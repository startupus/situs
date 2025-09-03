import { Injectable, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../../../database/prisma.service';
import { GlobalRole, ProjectRole, AccountRole } from '../types/roles.types';
import { RoleHierarchyService } from './role-hierarchy.service';

/**
 * Сервис для безопасного назначения ролей
 * Реализует принципы безопасности:
 * - Пользователь не может назначить роль выше своей
 * - Только владельцы могут назначать роли в своих ресурсах
 * - SUPER_ADMIN может назначать любые роли
 */
@Injectable()
export class RoleAssignmentService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly roleHierarchyService: RoleHierarchyService,
  ) {}

  /**
   * Проверка прав на назначение глобальной роли
   */
  async canAssignGlobalRole(
    assignerId: string,
    targetUserId: string,
    newRole: GlobalRole,
  ): Promise<{ allowed: boolean; reason?: string }> {
    // Получаем информацию о назначающем пользователе
    const assigner = await this.prisma.user.findUnique({
      where: { id: assignerId },
    });

    if (!assigner) {
      return { allowed: false, reason: 'Пользователь не найден' };
    }

    // SUPER_ADMIN может назначать любые роли
    if (assigner.globalRole === 'SUPER_ADMIN') {
      return { allowed: true };
    }

    // Получаем уровни ролей
    const assignerLevel = this.getRoleLevel(assigner.globalRole);
    const newRoleLevel = this.getRoleLevel(newRole);

    // Нельзя назначить роль выше или равную своей (кроме SUPER_ADMIN)
    if (newRoleLevel >= assignerLevel) {
      return {
        allowed: false,
        reason: `Нельзя назначить роль ${newRole} (уровень ${newRoleLevel}). Ваш уровень: ${assignerLevel}`,
      };
    }

    // Нельзя изменять роль самому себе (кроме SUPER_ADMIN)
    if (assignerId === targetUserId) {
      return {
        allowed: false,
        reason: 'Нельзя изменять собственную роль',
      };
    }

    // Проверяем, имеет ли право назначать роли
    // Используем системное право, существующее в типах
    const hasPermission = this.roleHierarchyService.hasPermission(assigner.globalRole, 'system.admin');

    if (!hasPermission) {
      return {
        allowed: false,
        reason: `Роль ${assigner.globalRole} не имеет права назначать роли`,
      };
    }

    return { allowed: true };
  }

  /**
   * Проверка прав на назначение роли в проекте
   */
  async canAssignProjectRole(
    assignerId: string,
    targetUserId: string,
    projectId: string,
    newRole: ProjectRole,
  ): Promise<{ allowed: boolean; reason?: string }> {
    // Получаем информацию о проекте и правах назначающего
    const project = await this.prisma.project.findUnique({
      where: { id: projectId },
      include: {
        accesses: {
          where: { userId: assignerId },
        },
      },
    });

    if (!project) {
      return { allowed: false, reason: 'Проект не найден' };
    }

    const assigner = await this.prisma.user.findUnique({
      where: { id: assignerId },
    });

    if (!assigner) {
      return { allowed: false, reason: 'Пользователь не найден' };
    }

    // SUPER_ADMIN может назначать любые роли
    if (assigner.globalRole === 'SUPER_ADMIN') {
      return { allowed: true };
    }

    // Владелец проекта может назначать любые роли в своем проекте
    if (project.ownerId === assignerId) {
      return { allowed: true };
    }

    // Проверяем роль назначающего в проекте
    const assignerProjectAccess = project.accesses.find((access) => access.userId === assignerId);

    if (!assignerProjectAccess) {
      return {
        allowed: false,
        reason: 'У вас нет доступа к этому проекту',
      };
    }

    // Получаем уровни ролей в проекте
    const assignerRoleLevel = this.getProjectRoleLevel(assignerProjectAccess.role);
    const newRoleLevel = this.getProjectRoleLevel(newRole);

    // Нельзя назначить роль выше или равную своей
    if (newRoleLevel >= assignerRoleLevel) {
      return {
        allowed: false,
        reason: `Нельзя назначить роль ${newRole} в проекте. Ваша роль: ${assignerProjectAccess.role}`,
      };
    }

    // Только ADMIN и выше могут назначать роли
    if (assignerRoleLevel < this.getProjectRoleLevel('ADMIN')) {
      return {
        allowed: false,
        reason: 'Только администраторы проекта могут назначать роли',
      };
    }

    return { allowed: true };
  }

  /**
   * Проверка прав на назначение роли в аккаунте
   */
  async canAssignAccountRole(
    assignerId: string,
    targetUserId: string,
    accountId: string,
    newRole: AccountRole,
  ): Promise<{ allowed: boolean; reason?: string }> {
    // Получаем информацию об аккаунте и правах назначающего
    const account = await this.prisma.account.findUnique({
      where: { id: accountId },
      include: {
        members: {
          where: { userId: assignerId },
        },
      },
    });

    if (!account) {
      return { allowed: false, reason: 'Аккаунт не найден' };
    }

    const assigner = await this.prisma.user.findUnique({
      where: { id: assignerId },
    });

    if (!assigner) {
      return { allowed: false, reason: 'Пользователь не найден' };
    }

    // SUPER_ADMIN может назначать любые роли
    if (assigner.globalRole === 'SUPER_ADMIN') {
      return { allowed: true };
    }

    // Владелец аккаунта может назначать любые роли
    if (account.ownerId === assignerId) {
      return { allowed: true };
    }

    // Проверяем роль назначающего в аккаунте
    const assignerMembership = account.members.find((member) => member.userId === assignerId);

    if (!assignerMembership) {
      return {
        allowed: false,
        reason: 'У вас нет доступа к этому аккаунту',
      };
    }

    // Получаем уровни ролей в аккаунте
    const assignerRoleLevel = this.getAccountRoleLevel(assignerMembership.role);
    const newRoleLevel = this.getAccountRoleLevel(newRole);

    // Нельзя назначить роль выше или равную своей
    if (newRoleLevel >= assignerRoleLevel) {
      return {
        allowed: false,
        reason: `Нельзя назначить роль ${newRole} в аккаунте. Ваша роль: ${assignerMembership.role}`,
      };
    }

    // Только ADMIN и выше могут назначать роли
    if (assignerRoleLevel < this.getAccountRoleLevel('ADMIN')) {
      return {
        allowed: false,
        reason: 'Только администраторы аккаунта могут назначать роли',
      };
    }

    return { allowed: true };
  }

  /**
   * Безопасное назначение глобальной роли
   */
  async assignGlobalRole(assignerId: string, targetUserId: string, newRole: GlobalRole): Promise<void> {
    const check = await this.canAssignGlobalRole(assignerId, targetUserId, newRole);

    if (!check.allowed) {
      throw new ForbiddenException(check.reason);
    }

    await this.prisma.user.update({
      where: { id: targetUserId },
      data: { globalRole: newRole },
    });

    // Логируем изменение роли
    await this.logRoleChange('global', targetUserId, newRole, assignerId, undefined);
  }

  /**
   * Безопасное назначение роли в проекте
   */
  async assignProjectRole(
    assignerId: string,
    targetUserId: string,
    projectId: string,
    newRole: ProjectRole,
  ): Promise<void> {
    const check = await this.canAssignProjectRole(assignerId, targetUserId, projectId, newRole);

    if (!check.allowed) {
      throw new ForbiddenException(check.reason);
    }

    await this.prisma.projectAccess.upsert({
      where: {
        projectId_userId: {
          projectId,
          userId: targetUserId,
        },
      },
      create: {
        projectId,
        userId: targetUserId,
        role: newRole,
        grantedBy: assignerId,
      },
      update: {
        role: newRole,
        grantedBy: assignerId,
        grantedAt: new Date(),
      },
    });

    // Логируем изменение роли
    await this.logRoleChange('project', targetUserId, newRole, assignerId, projectId);
  }

  /**
   * Безопасное назначение роли в аккаунте
   */
  async assignAccountRole(
    assignerId: string,
    targetUserId: string,
    accountId: string,
    newRole: AccountRole,
  ): Promise<void> {
    const check = await this.canAssignAccountRole(assignerId, targetUserId, accountId, newRole);

    if (!check.allowed) {
      throw new ForbiddenException(check.reason);
    }

    await this.prisma.accountMembership.upsert({
      where: {
        accountId_userId: {
          accountId,
          userId: targetUserId,
        },
      },
      create: {
        accountId,
        userId: targetUserId,
        role: newRole,
      },
      update: {
        role: newRole,
      },
    });

    // Логируем изменение роли
    await this.logRoleChange('account', targetUserId, newRole, assignerId, accountId);
  }

  // Приватные методы

  private getRoleLevel(role: GlobalRole): number {
    const levels = {
      BUSINESS: 40,
      AGENCY: 60,
      STAFF: 80,
      SUPER_ADMIN: 100,
    };
    return levels[role] || 0;
  }

  private getProjectRoleLevel(role: ProjectRole): number {
    const levels = {
      VIEWER: 10,
      EDITOR: 30,
      ADMIN: 70,
      OWNER: 100,
    };
    return levels[role] || 0;
  }

  private getAccountRoleLevel(role: AccountRole): number {
    const levels: Record<'MEMBER' | 'ADMIN' | 'OWNER', number> = {
      MEMBER: 30,
      ADMIN: 70,
      OWNER: 100,
    };
    return (levels as any)[role] || 0;
  }

  private async logRoleChange(
    type: 'global' | 'project' | 'account',
    targetUserId: string,
    newRole: string,
    assignerId: string,
    contextId?: string,
  ): Promise<void> {
    // В реальном проекте здесь была бы запись в таблицу аудита
    console.log(`[ROLE_CHANGE] ${type.toUpperCase()} role changed:`, {
      targetUserId,
      newRole,
      assignerId,
      contextId,
      timestamp: new Date().toISOString(),
    });
  }
}
