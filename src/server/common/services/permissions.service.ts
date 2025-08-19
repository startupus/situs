import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { 
  Permission, 
  PermissionContext, 
  PermissionCheckResult, 
  AccessScope 
} from '../types/permissions.types';
import { 
  hasPermission, 
  getRoleLevel, 
  canManageRole, 
  getRoleScopes,
  getRoleLimitations 
} from '../config/roles.config';

/**
 * Сервис для проверки прав доступа в многоуровневой системе
 * Учитывает:
 * - Иерархию ролей с наследованием
 * - Владение ресурсами (own vs clients vs all)
 * - Агентские отношения
 * - Контекстные права (проект/аккаунт/компонент)
 */
@Injectable()
export class PermissionsService {
  constructor(private prisma: PrismaService) {}

  /**
   * Основная функция проверки прав
   */
  async checkPermission(
    userId: string,
    context: PermissionContext
  ): Promise<PermissionCheckResult> {
    try {
      // Получаем пользователя с его ролью
      const user = await this.prisma.user.findUnique({
        where: { id: userId },
        select: { 
          id: true, 
          globalRole: true,
          ownedAccounts: {
            select: { id: true, type: true }
          },
          accountMemberships: {
            select: { 
              accountId: true, 
              role: true,
              account: {
                select: { type: true, ownerId: true }
              }
            }
          },
          projectAccesses: {
            select: { projectId: true, role: true }
          }
        }
      });

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
      if (!hasPermission(user.globalRole as string, context.action)) {
        return {
          allowed: false,
          reason: `Роль ${user.globalRole} не имеет права ${context.action}`,
          requiredRole: this.getRequiredRole(context.action),
          missingPermissions: [context.action]
        };
      }

      // Проверяем контекстные права в зависимости от ресурса
      const contextCheck = await this.checkContextualPermission(user, context);
      if (!contextCheck.allowed) {
        return contextCheck;
      }

      return { allowed: true, context };

    } catch (error) {
      console.error('Ошибка проверки прав:', error);
      return {
        allowed: false,
        reason: 'Ошибка при проверке прав доступа'
      };
    }
  }

  /**
   * Проверка контекстных прав (владение, агентские отношения и т.д.)
   */
  private async checkContextualPermission(
    user: any,
    context: PermissionContext
  ): Promise<PermissionCheckResult> {
    const { resource, action, ownerId, clientId, agencyId, projectId, accountId } = context;

    // Проверка прав на уровне проекта
    if (resource === 'project' && projectId) {
      return await this.checkProjectPermission(user, context);
    }

    // Проверка прав на уровне аккаунта
    if (resource === 'account' && accountId) {
      return await this.checkAccountPermission(user, context);
    }

    // Проверка агентских отношений
    if (clientId && user.globalRole === 'AGENCY') {
      return await this.checkAgencyClientPermission(user, context);
    }

    // Проверка владения ресурсом
    if (ownerId && this.isOwnershipRequired(action)) {
      return this.checkOwnership(user.id, ownerId, action);
    }

    // Проверка компонентных прав
    if (resource === 'component') {
      return this.checkComponentPermission(user, context);
    }

    return { allowed: true };
  }

  /**
   * Проверка прав на уровне проекта
   */
  private async checkProjectPermission(
    user: any,
    context: PermissionContext
  ): Promise<PermissionCheckResult> {
    const { projectId, action } = context;

    // Проверяем доступ к проекту
    const projectAccess = user.projectAccesses.find(
      (access: any) => access.projectId === projectId
    );

    if (!projectAccess) {
      // Проверяем, является ли пользователь владельцем проекта
      const project = await this.prisma.project.findUnique({
        where: { id: projectId },
        select: { ownerId: true, accountId: true }
      });

      if (!project) {
        return {
          allowed: false,
          reason: 'Проект не найден'
        };
      }

      // Если пользователь владелец проекта
      if (project.ownerId === user.id) {
        return { allowed: true };
      }

      // Если проект принадлежит аккаунту пользователя
      if (project.accountId) {
        const accountMembership = user.accountMemberships.find(
          (membership: any) => membership.accountId === project.accountId
        );
        
        if (accountMembership) {
          return this.checkProjectRolePermission(accountMembership.role, action);
        }
      }

      return {
        allowed: false,
        reason: 'Нет доступа к проекту'
      };
    }

    // Проверяем права по роли в проекте
    return this.checkProjectRolePermission(projectAccess.role, action);
  }

  /**
   * Проверка прав по роли в проекте
   */
  private checkProjectRolePermission(
    projectRole: string,
    action: Permission
  ): PermissionCheckResult {
    const rolePermissions: Record<string, Permission[]> = {
      'OWNER': ['*'] as Permission[],
      'ADMIN': [
        'project.edit.own',
        'project.publish.own',
        'project.settings.basic',
        'content.edit.all',
        'content.publish.all',
        'menu.edit',
        'product.edit.all'
      ] as Permission[],
      'EDITOR': [
        'content.create',
        'content.edit.own',
        'content.publish.own',
        'menu.edit',
        'product.edit.own'
      ] as Permission[],
      'VIEWER': [
        'core.view.own',
        'content.view',
        'analytics.view.own'
      ] as Permission[]
    };

    const permissions = rolePermissions[projectRole] || [];
    const hasAccess = permissions.includes('*' as Permission) || permissions.includes(action);

    return {
      allowed: hasAccess,
      reason: hasAccess ? undefined : `Роль ${projectRole} в проекте не имеет права ${action}`
    };
  }

  /**
   * Проверка прав на уровне аккаунта
   */
  private async checkAccountPermission(
    user: any,
    context: PermissionContext
  ): Promise<PermissionCheckResult> {
    const { accountId, action } = context;

    // Проверяем членство в аккаунте
    const membership = user.accountMemberships.find(
      (membership: any) => membership.accountId === accountId
    );

    if (!membership) {
      // Проверяем, является ли пользователь владельцем аккаунта
      const ownedAccount = user.ownedAccounts.find(
        (account: any) => account.id === accountId
      );

      if (!ownedAccount) {
        return {
          allowed: false,
          reason: 'Нет доступа к аккаунту'
        };
      }

      return { allowed: true }; // Владелец имеет все права
    }

    return this.checkAccountRolePermission(membership.role, action);
  }

  /**
   * Проверка прав по роли в аккаунте
   */
  private checkAccountRolePermission(
    accountRole: string,
    action: Permission
  ): PermissionCheckResult {
    const rolePermissions: Record<string, Permission[]> = {
      'OWNER': ['*'] as Permission[],
      'ADMIN': [
        'account.edit.own',
        'account.manage.members',
        'account.billing',
        'user.create.clients',
        'user.edit.clients'
      ] as Permission[],
      'MANAGER': [
        'account.edit.own',
        'user.view.clients',
        'project.view.clients'
      ] as Permission[],
      'MEMBER': [
        'account.view',
        'project.view.own'
      ] as Permission[]
    };

    const permissions = rolePermissions[accountRole] || [];
    const hasAccess = permissions.includes('*' as Permission) || permissions.includes(action);

    return {
      allowed: hasAccess,
      reason: hasAccess ? undefined : `Роль ${accountRole} в аккаунте не имеет права ${action}`
    };
  }

  /**
   * Проверка агентских отношений
   */
  private async checkAgencyClientPermission(
    user: any,
    context: PermissionContext
  ): Promise<PermissionCheckResult> {
    const { clientId, action } = context;

    // Проверяем, является ли пользователь агентством для данного клиента
    const agencyRelation = await this.prisma.agencyClient.findFirst({
      where: {
        agencyAccountId: { in: user.ownedAccounts.map((acc: any) => acc.id) },
        clientAccountId: clientId
      }
    });

    if (!agencyRelation) {
      return {
        allowed: false,
        reason: 'Нет агентских отношений с данным клиентом'
      };
    }

    // Проверяем, поддерживает ли действие работу с клиентами
    if (!this.isClientAction(action)) {
      return {
        allowed: false,
        reason: 'Действие не поддерживает работу с клиентами'
      };
    }

    return { allowed: true };
  }

  /**
   * Проверка владения ресурсом
   */
  private checkOwnership(
    userId: string,
    ownerId: string,
    action: Permission
  ): PermissionCheckResult {
    if (userId === ownerId) {
      return { allowed: true };
    }

    return {
      allowed: false,
      reason: 'Нет прав на чужой ресурс'
    };
  }

  /**
   * Проверка компонентных прав
   */
  private checkComponentPermission(
    user: any,
    context: PermissionContext
  ): PermissionCheckResult {
    const { component, action } = context;
    const limitations = getRoleLimitations(user.globalRole);

    // Проверяем, разрешен ли компонент для роли
    if (limitations.allowedComponents && 
        !limitations.allowedComponents.includes('*') &&
        !limitations.allowedComponents.includes(component || '')) {
      return {
        allowed: false,
        reason: `Роль ${user.globalRole} не имеет доступа к компоненту ${component}`
      };
    }

    return { allowed: true };
  }

  /**
   * Проверка, требует ли действие проверки владения
   */
  private isOwnershipRequired(action: Permission): boolean {
    return action.includes('.own') || action.includes('.delete') || action.includes('.edit');
  }

  /**
   * Проверка, является ли действие клиентским
   */
  private isClientAction(action: Permission): boolean {
    return action.includes('.clients') || action.includes('.all');
  }

  /**
   * Получение требуемой роли для действия
   */
  private getRequiredRole(action: Permission): string {
    if (action.includes('system.') || action.includes('.all')) {
      return 'STAFF';
    }
    if (action.includes('.clients') || action.includes('agency.')) {
      return 'AGENCY';
    }
    return 'BUSINESS';
  }

  /**
   * Быстрая проверка права без контекста
   */
  async hasSimplePermission(userId: string, permission: Permission): Promise<boolean> {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { globalRole: true }
    });

    if (!user) return false;
    if (user.globalRole === 'SUPER_ADMIN') return true;

    return hasPermission(user.globalRole as string, permission);
  }

  /**
   * Получение всех прав пользователя
   */
  async getUserPermissions(userId: string): Promise<Permission[]> {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { globalRole: true }
    });

    if (!user) return [];

    return this.getRolePermissions(user.globalRole as string);
  }

  /**
   * Получение прав роли (делегирует в конфиг)
   */
  private getRolePermissions(roleId: string): Permission[] {
    // Импортируем функцию из конфига
    const { getRolePermissions } = require('../config/roles.config');
    return getRolePermissions(roleId);
  }
}