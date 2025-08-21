import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../database/prisma.service';
import type { PermissionContext, PermissionCheckResult } from '../types';

/**
 * Сервис для резолвинга контекста проверки прав
 * 
 * Отвечает за:
 * - Проверку владения ресурсами
 * - Проверку агентских отношений
 * - Проверку членства в аккаунтах/проектах
 * - Валидацию контекста
 */
@Injectable()
export class ContextResolverService {
  constructor(private prisma: PrismaService) {}

  /**
   * Проверяет владение проектом
   */
  async checkProjectOwnership(
    userId: string, 
    projectId: string
  ): Promise<boolean> {
    const project = await this.prisma.project.findUnique({
      where: { id: projectId },
      select: { ownerId: true }
    });

    return project?.ownerId === userId;
  }

  /**
   * Проверяет доступ к проекту через ProjectAccess
   */
  async checkProjectAccess(
    userId: string, 
    projectId: string
  ): Promise<{ hasAccess: boolean; role?: string }> {
    const access = await this.prisma.projectAccess.findFirst({
      where: { projectId, userId }
    });

    return {
      hasAccess: !!access,
      role: access?.role
    };
  }

  /**
   * Проверяет членство в аккаунте
   */
  async checkAccountMembership(
    userId: string, 
    accountId: string
  ): Promise<{ isMember: boolean; role?: string }> {
    const membership = await this.prisma.accountMembership.findFirst({
      where: { accountId, userId }
    });

    return {
      isMember: !!membership,
      role: membership?.role
    };
  }

  /**
   * Проверяет агентские отношения
   */
  async checkAgencyClientRelation(
    agencyUserId: string, 
    clientUserId: string
  ): Promise<boolean> {
    // Получаем аккаунты пользователей
    const agencyUser = await this.prisma.user.findUnique({
      where: { id: agencyUserId },
      include: { ownedAccounts: true }
    });

    const clientUser = await this.prisma.user.findUnique({
      where: { id: clientUserId },
      include: { ownedAccounts: true }
    });

    if (!agencyUser || !clientUser) return false;

    // Проверяем связи между аккаунтами
    const agencyAccountIds = agencyUser.ownedAccounts.map(acc => acc.id);
    const clientAccountIds = clientUser.ownedAccounts.map(acc => acc.id);

    const relation = await this.prisma.agencyClient.findFirst({
      where: {
        agencyAccountId: { in: agencyAccountIds },
        clientAccountId: { in: clientAccountIds }
      }
    });

    return !!relation;
  }

  /**
   * Получает все проекты, к которым у пользователя есть доступ
   */
  async getUserAccessibleProjects(userId: string): Promise<string[]> {
    // Собственные проекты
    const ownedProjects = await this.prisma.project.findMany({
      where: { ownerId: userId },
      select: { id: true }
    });

    // Проекты через ProjectAccess
    const accessedProjects = await this.prisma.projectAccess.findMany({
      where: { userId },
      select: { projectId: true }
    });

    // Проекты через членство в аккаунтах
    const accountProjects = await this.prisma.project.findMany({
      where: {
        account: {
          members: {
            some: { userId }
          }
        }
      },
      select: { id: true }
    });

    const projectIds = [
      ...ownedProjects.map(p => p.id),
      ...accessedProjects.map(a => a.projectId),
      ...accountProjects.map(p => p.id)
    ];

    return [...new Set(projectIds)];
  }

  /**
   * Получает всех клиентов агентства
   */
  async getAgencyClients(agencyUserId: string): Promise<string[]> {
    const agencyUser = await this.prisma.user.findUnique({
      where: { id: agencyUserId },
      include: {
        ownedAccounts: {
          include: {
            clients: {
              include: {
                client: {
                  include: {
                    owner: true
                  }
                }
              }
            }
          }
        }
      }
    });

    if (!agencyUser) return [];

    const clientIds: string[] = [];
    
    agencyUser.ownedAccounts.forEach(account => {
      account.clients.forEach(relation => {
        clientIds.push(relation.client.owner.id);
      });
    });

    return [...new Set(clientIds)];
  }

  /**
   * Проверяет, является ли пользователь клиентом агентства
   */
  async isAgencyClient(agencyUserId: string, clientUserId: string): Promise<boolean> {
    const clients = await this.getAgencyClients(agencyUserId);
    return clients.includes(clientUserId);
  }

  /**
   * Резолвит полный контекст для проверки прав
   */
  async resolveFullContext(
    userId: string,
    baseContext: PermissionContext
  ): Promise<PermissionContext> {
    const resolvedContext = { ...baseContext };

    // Добавляем ownerId если не указан
    if (!resolvedContext.ownerId) {
      resolvedContext.ownerId = userId;
    }

    // Резолвим данные проекта
    if (resolvedContext.projectId && !resolvedContext.resourceId) {
      resolvedContext.resourceId = resolvedContext.projectId;
    }

    // Резолвим данные аккаунта
    if (resolvedContext.accountId && !resolvedContext.resourceId) {
      resolvedContext.resourceId = resolvedContext.accountId;
    }

    // Для агентского скоупа получаем клиентов
    if (resolvedContext.scope === 'agency' && !resolvedContext.clientId) {
      const clients = await this.getAgencyClients(userId);
      if (clients.length > 0) {
        resolvedContext.clientId = clients[0]; // Берем первого клиента как дефолт
      }
    }

    return resolvedContext;
  }
}