import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { PermissionsService } from '../services/permissions.service';
import { buildContextFromRequest } from '../utils';
import type { Permission } from '../types';

/**
 * Компактный Guard для проверки детальных прав доступа
 *
 * Заменяет старые RolesGuard и PoliciesGuard
 * Поддерживает все типы проверок прав
 */
@Injectable()
export class PermissionGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private permissionsService: PermissionsService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();

    // Test режим: проверяем тестовый токен
    if (this.isTestMode(request)) {
      return true;
    }

    // Получаем требуемое право
    const requiredPermission = this.getRequiredPermission(context);
    if (!requiredPermission) {
      return true; // Нет требований к правам
    }

    const user = request.user;
    if (!user?.id) {
      return false;
    }

    // SUPER_ADMIN имеет все права
    if (user.globalRole === 'SUPER_ADMIN') {
      return true;
    }

    // Проверяем права
    return this.checkPermissions(user, requiredPermission, request);
  }

  /**
   * Проверка тестового режима
   */
  private isTestMode(request: any): boolean {
    return (
      process.env.NODE_ENV === 'test' &&
      request.headers.authorization === `Bearer ${process.env.AUTH_TEST_TOKEN || 'test-token-12345'}`
    );
  }

  /**
   * Получение требуемого права из метаданных
   * КРИТИЧЕСКАЯ БЕЗОПАСНОСТЬ: Поддержка @Roles и @Scopes
   */
  private getRequiredPermission(context: ExecutionContext): any {
    // Сначала проверяем детальные права
    const permission = this.reflector.getAllAndOverride<Permission | any>('permission', [
      context.getHandler(),
      context.getClass(),
    ]);
    if (permission) return permission;

    // Затем проверяем роли и скоупы
    const roles = this.reflector.getAllAndOverride<string[]>('roles', [context.getHandler(), context.getClass()]);
    const scopes = this.reflector.getAllAndOverride<string[]>('scopes', [context.getHandler(), context.getClass()]);

    if (roles || scopes) {
      return {
        type: 'roles_and_scopes',
        roles: roles || [],
        scopes: scopes || [],
      };
    }

    return null;
  }

  /**
   * Проверка прав в зависимости от типа
   */
  private async checkPermissions(user: any, requiredPermission: any, request: any): Promise<boolean> {
    if (typeof requiredPermission === 'string') {
      return this.checkSinglePermission(user, requiredPermission as Permission, request);
    }

    switch (requiredPermission.type) {
      case 'any':
        return this.checkAnyPermission(user, requiredPermission.permissions, request);
      case 'all':
        return this.checkAllPermissions(user, requiredPermission.permissions, request);
      case 'owner':
        return this.checkOwnership(user, requiredPermission.resourceType, request);
      case 'agency':
        return this.checkAgencyAccess(user, requiredPermission.scope, request);
      case 'roles_and_scopes':
        return this.checkRolesAndScopes(user, requiredPermission.roles, requiredPermission.scopes);
      default:
        return false;
    }
  }

  /**
   * Проверка одного права
   */
  private async checkSinglePermission(user: any, permission: Permission, request: any): Promise<boolean> {
    const context = buildContextFromRequest(permission, request);
    const result = await this.permissionsService.checkPermission(user.id, context);
    return result.allowed;
  }

  /**
   * Проверка любого из прав (OR)
   */
  private async checkAnyPermission(user: any, permissions: Permission[], request: any): Promise<boolean> {
    for (const permission of permissions) {
      if (await this.checkSinglePermission(user, permission, request)) {
        return true;
      }
    }
    return false;
  }

  /**
   * Проверка всех прав (AND)
   */
  private async checkAllPermissions(user: any, permissions: Permission[], request: any): Promise<boolean> {
    for (const permission of permissions) {
      if (!(await this.checkSinglePermission(user, permission, request))) {
        return false;
      }
    }
    return true;
  }

  /**
   * Проверка владения ресурсом
   */
  private async checkOwnership(user: any, resourceType: string, request: any): Promise<boolean> {
    const resourceId = request.params.id || request.params.projectId || request.params.accountId;

    if (!resourceId) return false;

    if (resourceType === 'project') {
      return this.permissionsService['contextResolverService'].checkProjectOwnership(user.id, resourceId);
    }

    return false;
  }

  /**
   * Проверка агентского доступа
   */
  private async checkAgencyAccess(user: any, scope: string, request: any): Promise<boolean> {
    if (user.globalRole !== 'AGENCY') {
      return false;
    }

    const clientId = request.params.clientId || request.query.clientId;

    if (scope === 'clients' && clientId) {
      return this.permissionsService['contextResolverService'].isAgencyClient(user.id, clientId);
    }

    return true;
  }

  /**
   * Проверка ролей и скоупов
   * КРИТИЧЕСКАЯ БЕЗОПАСНОСТЬ: Правильная обработка @Roles и @Scopes
   */
  private async checkRolesAndScopes(user: any, requiredRoles: string[], requiredScopes: string[]): Promise<boolean> {
    // Проверяем роли
    if (requiredRoles.length > 0) {
      const hasRequiredRole = requiredRoles.includes(user.globalRole);
      if (!hasRequiredRole) {
        return false;
      }
    }

    // Проверяем скоупы
    if (requiredScopes.length > 0) {
      const userScopes = user.scopes || [];
      const hasRequiredScope = requiredScopes.some((scope) => userScopes.includes(scope));
      if (!hasRequiredScope) {
        return false;
      }
    }

    return true;
  }
}
