import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { 
  PERMISSION_KEY, 
  PERMISSION_CONTEXT_KEY 
} from '../decorators/permission.decorator';
import { PermissionsService } from '../services/permissions.service';
import { 
  Permission, 
  PermissionContext,
  AccessScope 
} from '../types/permissions.types';

/**
 * Guard для проверки детальных прав доступа
 * Заменяет старые RolesGuard и PoliciesGuard
 */
@Injectable()
export class PermissionGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private permissionsService: PermissionsService
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    // Test режим: проверяем тестовый токен для e2e тестов
    const request = context.switchToHttp().getRequest();
    if (process.env.NODE_ENV === 'test' && 
        request.headers.authorization === `Bearer ${process.env.AUTH_TEST_TOKEN || 'test-token-12345'}`) {
      return true;
    }

    // Получаем требуемое право доступа
    const requiredPermission = this.reflector.getAllAndOverride<Permission | any>(
      PERMISSION_KEY,
      [context.getHandler(), context.getClass()]
    );

    // Если права не требуются, разрешаем доступ
    if (!requiredPermission) {
      return true;
    }

    // Получаем контекст проверки
    const permissionContext = this.reflector.getAllAndOverride<Partial<PermissionContext>>(
      PERMISSION_CONTEXT_KEY,
      [context.getHandler(), context.getClass()]
    );

    const user = request.user;
    if (!user?.id) {
      return false;
    }

    // SUPER_ADMIN имеет все права
    if (user.globalRole === 'SUPER_ADMIN') {
      return true;
    }

    try {
      // Обрабатываем разные типы проверок прав
      if (typeof requiredPermission === 'string') {
        return await this.checkSinglePermission(user, requiredPermission, request, permissionContext);
      }

      if (requiredPermission.type === 'any') {
        return await this.checkAnyPermission(user, requiredPermission.permissions, request, permissionContext);
      }

      if (requiredPermission.type === 'all') {
        return await this.checkAllPermissions(user, requiredPermission.permissions, request, permissionContext);
      }

      if (requiredPermission.type === 'owner') {
        return await this.checkOwnership(user, requiredPermission.resourceType, request);
      }

      if (requiredPermission.type === 'agency') {
        return await this.checkAgencyAccess(user, requiredPermission.scope, request);
      }

      return false;
    } catch (error) {
      console.error('Ошибка проверки прав:', error);
      return false;
    }
  }

  /**
   * Проверка одного права
   */
  private async checkSinglePermission(
    user: any,
    permission: Permission,
    request: any,
    contextOverride?: Partial<PermissionContext>
  ): Promise<boolean> {
    const context = this.buildPermissionContext(permission, request, contextOverride);
    
    const result = await this.permissionsService.checkPermission(user.id, context);
    return result.allowed;
  }

  /**
   * Проверка любого из прав (OR)
   */
  private async checkAnyPermission(
    user: any,
    permissions: Permission[],
    request: any,
    contextOverride?: Partial<PermissionContext>
  ): Promise<boolean> {
    for (const permission of permissions) {
      const hasPermission = await this.checkSinglePermission(user, permission, request, contextOverride);
      if (hasPermission) {
        return true;
      }
    }
    return false;
  }

  /**
   * Проверка всех прав одновременно (AND)
   */
  private async checkAllPermissions(
    user: any,
    permissions: Permission[],
    request: any,
    contextOverride?: Partial<PermissionContext>
  ): Promise<boolean> {
    for (const permission of permissions) {
      const hasPermission = await this.checkSinglePermission(user, permission, request, contextOverride);
      if (!hasPermission) {
        return false;
      }
    }
    return true;
  }

  /**
   * Проверка владения ресурсом
   */
  private async checkOwnership(
    user: any,
    resourceType: string,
    request: any
  ): Promise<boolean> {
    const resourceId = request.params.id || request.params.projectId || request.params.accountId;
    
    if (!resourceId) {
      return false;
    }

    // Здесь можно добавить проверку через PermissionsService
    // Пока простая проверка через параметры
    const context: PermissionContext = {
      resource: resourceType as any,
      resourceId,
      ownerId: user.id,
      action: 'core.view.own' as Permission,
      scope: 'own' as AccessScope
    };

    const result = await this.permissionsService.checkPermission(user.id, context);
    return result.allowed;
  }

  /**
   * Проверка агентского доступа
   */
  private async checkAgencyAccess(
    user: any,
    scope: string,
    request: any
  ): Promise<boolean> {
    if (user.globalRole !== 'AGENCY') {
      return false;
    }

    // Для агентств проверяем доступ к клиентским ресурсам
    const clientId = request.params.clientId || request.query.clientId;
    
    if (scope === 'clients' && !clientId) {
      return false;
    }

    const context: PermissionContext = {
      resource: 'agency',
      clientId,
      action: 'agency.clients.manage' as Permission,
      scope: scope as AccessScope
    };

    const result = await this.permissionsService.checkPermission(user.id, context);
    return result.allowed;
  }

  /**
   * Построение контекста для проверки прав
   */
  private buildPermissionContext(
    permission: Permission,
    request: any,
    contextOverride?: Partial<PermissionContext>
  ): PermissionContext {
    const params = request.params || {};
    const query = request.query || {};

    // Определяем ресурс и скоуп из названия права
    let resource: PermissionContext['resource'] = 'global';
    let scope: AccessScope = 'own';

    if (permission.includes('project.')) {
      resource = 'project';
    } else if (permission.includes('account.')) {
      resource = 'account';
    } else if (permission.includes('user.')) {
      resource = 'component';
    } else if (permission.includes('agency.')) {
      resource = 'agency';
    }

    if (permission.includes('.all')) {
      scope = 'global';
    } else if (permission.includes('.clients')) {
      scope = 'agency';
    } else if (permission.includes('.own')) {
      scope = 'own';
    }

    const baseContext: PermissionContext = {
      resource,
      scope,
      action: permission,
      resourceId: params.id || params.projectId || params.accountId,
      projectId: params.projectId || query.projectId,
      accountId: params.accountId || query.accountId,
      clientId: params.clientId || query.clientId,
      agencyId: params.agencyId || query.agencyId,
      component: this.getComponentFromPermission(permission)
    };

    // Применяем переопределения контекста
    return { ...baseContext, ...contextOverride };
  }

  /**
   * Определение компонента из права
   */
  private getComponentFromPermission(permission: Permission): PermissionContext['component'] {
    if (permission.includes('orders.')) return 'orders';
    if (permission.includes('analytics.')) return 'analytics';
    if (permission.includes('billing.')) return 'billing';
    if (permission.includes('user.')) return 'users';
    if (permission.includes('project.')) return 'projects';
    return undefined;
  }
}