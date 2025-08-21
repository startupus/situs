import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../database/prisma.service';
import { RoleHierarchyService } from './role-hierarchy.service';
import { ContextResolverService } from './context-resolver.service';
import type { 
  Permission, 
  PermissionContext, 
  PermissionCheckResult,
  GlobalRole 
} from '../types';
import { validatePermissionContext } from '../utils';

/**
 * Основной сервис проверки прав доступа
 * 
 * Координирует работу других сервисов для проверки прав
 * в многоуровневой системе
 */
@Injectable()
export class PermissionsService {
  constructor(
    private prisma: PrismaService,
    private roleHierarchyService: RoleHierarchyService,
    private contextResolverService: ContextResolverService
  ) {}

  /**
   * Основная функция проверки прав
   */
  async checkPermission(
    userId: string,
    context: PermissionContext
  ): Promise<PermissionCheckResult> {
    try {
      // Валидируем контекст
      if (!validatePermissionContext(context)) {
        return {
          allowed: false,
          reason: 'Некорректный контекст проверки прав'
        };
      }

      // Получаем пользователя
      const user = await this.getUser(userId);
      if (!user) {
        return {
          allowed: false,
          reason: 'Пользователь не найден'
        };
      }

      // SUPER_ADMIN имеет все права
      if (user.globalRole === 'SUPER_ADMIN') {
        return { allowed: true };
      }

      // Проверяем базовое право по роли
      const hasBasePermission = this.roleHierarchyService.hasPermission(
        user.globalRole as GlobalRole, 
        context.action
      );

      if (!hasBasePermission) {
        return {
          allowed: false,
          reason: `Роль ${user.globalRole} не имеет права ${context.action}`,
          missingPermissions: [context.action]
        };
      }

      // Проверяем контекстные права
      const contextCheck = await this.checkContextualPermission(user, context);
      return contextCheck;

    } catch (error) {
      console.error('Ошибка проверки прав:', error);
      return {
        allowed: false,
        reason: 'Ошибка при проверке прав доступа'
      };
    }
  }

  /**
   * Быстрая проверка права без контекста
   */
  async hasSimplePermission(userId: string, permission: Permission): Promise<boolean> {
    const user = await this.getUser(userId);
    if (!user) return false;
    
    if (user.globalRole === 'SUPER_ADMIN') return true;
    
    return this.roleHierarchyService.hasPermission(user.globalRole as GlobalRole, permission);
  }

  /**
   * Получение всех прав пользователя
   */
  async getUserPermissions(userId: string): Promise<Permission[]> {
    const user = await this.getUser(userId);
    if (!user) return [];

    return this.roleHierarchyService.getRolePermissions(user.globalRole as GlobalRole);
  }

  /**
   * Проверка контекстных прав
   */
  private async checkContextualPermission(
    user: any,
    context: PermissionContext
  ): Promise<PermissionCheckResult> {
    const { resource, scope } = context;

    // Проверяем в зависимости от скоупа
    switch (scope) {
      case 'own':
        return this.checkOwnScopePermission(user, context);
      case 'agency':
        return this.checkAgencyScopePermission(user, context);
      case 'global':
        return this.checkGlobalScopePermission(user, context);
      default:
        return { allowed: true };
    }
  }

  /**
   * Проверка прав на собственные ресурсы
   */
  private async checkOwnScopePermission(
    user: any,
    context: PermissionContext
  ): Promise<PermissionCheckResult> {
    if (context.resource === 'project' && context.projectId) {
      const isOwner = await this.contextResolverService.checkProjectOwnership(
        user.id, 
        context.projectId
      );
      
      if (!isOwner) {
        const access = await this.contextResolverService.checkProjectAccess(
          user.id, 
          context.projectId
        );
        
        if (!access.hasAccess) {
          return {
            allowed: false,
            reason: 'Нет доступа к проекту'
          };
        }
      }
    }

    return { allowed: true };
  }

  /**
   * Проверка агентских прав
   */
  private async checkAgencyScopePermission(
    user: any,
    context: PermissionContext
  ): Promise<PermissionCheckResult> {
    if (user.globalRole !== 'AGENCY') {
      return {
        allowed: false,
        reason: 'Агентские права доступны только агентствам'
      };
    }

    if (context.clientId) {
      const isClient = await this.contextResolverService.isAgencyClient(
        user.id, 
        context.clientId
      );
      
      if (!isClient) {
        return {
          allowed: false,
          reason: 'Нет агентских отношений с данным клиентом'
        };
      }
    }

    return { allowed: true };
  }

  /**
   * Проверка глобальных прав
   */
  private async checkGlobalScopePermission(
    user: any,
    context: PermissionContext
  ): Promise<PermissionCheckResult> {
    // Глобальные права только для STAFF и SUPER_ADMIN
    if (!['STAFF', 'SUPER_ADMIN'].includes(user.globalRole)) {
      return {
        allowed: false,
        reason: 'Глобальные права доступны только персоналу и администраторам'
      };
    }

    return { allowed: true };
  }

  /**
   * Получение пользователя с минимальными данными
   */
  private async getUser(userId: string) {
    return this.prisma.user.findUnique({
      where: { id: userId },
      select: { 
        id: true, 
        globalRole: true,
        status: true
      }
    });
  }
}