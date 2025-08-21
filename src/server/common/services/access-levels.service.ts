import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { AccessLevel } from '@prisma/client';

/**
 * Сервис для управления уровнями доступа
 * Поддерживает как системные, так и кастомные уровни доступа
 */
@Injectable()
export class AccessLevelsService {
  constructor(private prisma: PrismaService) {}

  /**
   * Системные уровни доступа с их описаниями
   */
  private readonly systemAccessLevels = {
    PUBLIC: {
      name: 'PUBLIC',
      title: 'Общедоступный',
      description: 'Доступен всем пользователям, включая неавторизованных',
      allowedRoles: ['*'],
      level: 0
    },
    REGISTERED: {
      name: 'REGISTERED',
      title: 'Зарегистрированные',
      description: 'Доступен только зарегистрированным пользователям',
      allowedRoles: ['BUSINESS', 'AGENCY', 'STAFF', 'SUPER_ADMIN'],
      level: 10
    },
    BUSINESS: {
      name: 'BUSINESS',
      title: 'Бизнес-пользователи',
      description: 'Доступен бизнес-пользователям и выше',
      allowedRoles: ['BUSINESS', 'AGENCY', 'STAFF', 'SUPER_ADMIN'],
      level: 40
    },
    AGENCY: {
      name: 'AGENCY',
      title: 'Агентства',
      description: 'Доступен агентствам, персоналу и администраторам',
      allowedRoles: ['AGENCY', 'STAFF', 'SUPER_ADMIN'],
      level: 60
    },
    STAFF: {
      name: 'STAFF',
      title: 'Персонал',
      description: 'Доступен только персоналу и администраторам',
      allowedRoles: ['STAFF', 'SUPER_ADMIN'],
      level: 80
    },
    ADMIN: {
      name: 'ADMIN',
      title: 'Администраторы',
      description: 'Доступен только супер-администраторам',
      allowedRoles: ['SUPER_ADMIN'],
      level: 100
    },
    SPECIAL: {
      name: 'SPECIAL',
      title: 'Специальный',
      description: 'Специальный уровень доступа с кастомными правилами',
      allowedRoles: [],
      level: 50
    },
    CUSTOM: {
      name: 'CUSTOM',
      title: 'Пользовательский',
      description: 'Пользовательский уровень доступа',
      allowedRoles: [],
      level: 30
    }
  } as const;

  /**
   * Получить все системные уровни доступа
   */
  getSystemAccessLevels() {
    return Object.values(this.systemAccessLevels);
  }

  /**
   * Получить уровень доступа по имени
   */
  getSystemAccessLevel(name: AccessLevel) {
    return this.systemAccessLevels[name as keyof typeof this.systemAccessLevels];
  }

  /**
   * Проверить, имеет ли роль доступ к системному уровню
   */
  hasSystemAccess(userRole: string, accessLevel: AccessLevel): boolean {
    const level = this.systemAccessLevels[accessLevel as keyof typeof this.systemAccessLevels] as any;
    if (!level) return false;

    // Если уровень доступен всем
    if ((level.allowedRoles as any).includes('*')) return true;

    // Проверяем, есть ли роль в списке разрешенных
    return (level.allowedRoles as any).includes(userRole);
  }

  /**
   * Создать кастомный уровень доступа
   */
  async createCustomAccessLevel(data: {
    name: string;
    title: string;
    description?: string;
    allowedRoles: string[];
    conditions?: Record<string, any>;
    projectId?: string;
    accountId?: string;
  }) {
    return this.prisma.customAccessLevel.create({
      data: {
        name: data.name,
        title: data.title,
        description: data.description,
        allowedRoles: JSON.stringify(data.allowedRoles),
        conditions: JSON.stringify(data.conditions || {}),
        projectId: data.projectId,
        accountId: data.accountId,
        isSystem: false,
        isActive: true
      }
    });
  }

  /**
   * Получить кастомные уровни доступа для проекта
   */
  async getProjectCustomAccessLevels(projectId: string) {
    return this.prisma.customAccessLevel.findMany({
      where: {
        projectId,
        isActive: true
      },
      orderBy: { name: 'asc' }
    });
  }

  /**
   * Получить кастомные уровни доступа для аккаунта
   */
  async getAccountCustomAccessLevels(accountId: string) {
    return this.prisma.customAccessLevel.findMany({
      where: {
        accountId,
        isActive: true
      },
      orderBy: { name: 'asc' }
    });
  }

  /**
   * Проверить доступ к кастомному уровню
   */
  async hasCustomAccess(
    userId: string,
    customAccessLevelId: string
  ): Promise<boolean> {
    const customLevel = await this.prisma.customAccessLevel.findUnique({
      where: { id: customAccessLevelId }
    });

    if (!customLevel || !customLevel.isActive) return false;

    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: { 
        accountMemberships: { select: { accountId: true, role: true } },
        projectAccesses: { select: { projectId: true, role: true } }
      },
      select: undefined as any
    } as any);

    if (!user) return false;

    const allowedRoles = JSON.parse(customLevel.allowedRoles as any);
    const conditions = JSON.parse(customLevel.conditions as any);

    // Проверяем глобальную роль
    if (allowedRoles.includes((user as any).globalRole)) return true;

    // Проверяем дополнительные условия
    if (conditions.requireAccountMembership && customLevel.accountId) {
      const hasMembership = (user as any).accountMemberships.some(
        (membership: any) => membership.accountId === customLevel.accountId
      );
      if (!hasMembership) return false;
    }

    if (conditions.requireProjectAccess && customLevel.projectId) {
      const hasAccess = (user as any).projectAccesses.some(
        (access: any) => access.projectId === customLevel.projectId
      );
      if (!hasAccess) return false;
    }

    return true;
  }

  /**
   * Обновить кастомный уровень доступа
   */
  async updateCustomAccessLevel(
    id: string,
    data: {
      title?: string;
      description?: string;
      allowedRoles?: string[];
      conditions?: Record<string, any>;
      isActive?: boolean;
    }
  ) {
    const updateData: any = {};

    if (data.title !== undefined) updateData.title = data.title;
    if (data.description !== undefined) updateData.description = data.description;
    if (data.allowedRoles !== undefined) {
      updateData.allowedRoles = JSON.stringify(data.allowedRoles);
    }
    if (data.conditions !== undefined) {
      updateData.conditions = JSON.stringify(data.conditions);
    }
    if (data.isActive !== undefined) updateData.isActive = data.isActive;

    updateData.updatedAt = new Date();

    return this.prisma.customAccessLevel.update({
      where: { id },
      data: updateData
    });
  }

  /**
   * Удалить кастомный уровень доступа
   */
  async deleteCustomAccessLevel(id: string) {
    return this.prisma.customAccessLevel.delete({
      where: { id }
    });
  }

  /**
   * Получить все доступные уровни доступа для проекта
   * (системные + кастомные)
   */
  async getAvailableAccessLevels(projectId?: string, accountId?: string) {
    const systemLevels = this.getSystemAccessLevels();
    const customLevels: any[] = [];

    if (projectId) {
      const projectCustomLevels = await this.getProjectCustomAccessLevels(projectId);
      customLevels.push(...projectCustomLevels.map(level => ({
        ...level,
        allowedRoles: JSON.parse(level.allowedRoles as any),
        conditions: JSON.parse(level.conditions as any),
        isCustom: true
      })));
    }

    if (accountId) {
      const accountCustomLevels = await this.getAccountCustomAccessLevels(accountId);
      customLevels.push(...accountCustomLevels.map(level => ({
        ...level,
        allowedRoles: JSON.parse(level.allowedRoles as any),
        conditions: JSON.parse(level.conditions as any),
        isCustom: true
      })));
    }

    return {
      system: systemLevels as any,
      custom: customLevels,
      all: [...(systemLevels as any), ...customLevels]
    };
  }

  /**
   * Проверить доступ к ресурсу с учетом уровня доступа
   */
  async checkResourceAccess(
    userId: string,
    resourceType: 'project' | 'product' | 'page',
    resourceId: string
  ): Promise<boolean> {
    // Получаем ресурс с его уровнем доступа
    let resource: any;

    switch (resourceType) {
      case 'project':
        resource = await this.prisma.project.findUnique({
          where: { id: resourceId }
        });
        break;
      case 'product':
        resource = await this.prisma.product.findUnique({
          where: { id: resourceId }
        });
        break;
      case 'page':
        resource = await this.prisma.page.findUnique({
          where: { id: resourceId }
        });
        break;
    }

    if (!resource) return false;

    // Получаем пользователя
    const user = await this.prisma.user.findUnique({
      where: { id: userId }
    });

    if (!user) return false;

    // Проверяем системный уровень доступа
    if (resource.accessLevel !== 'CUSTOM') {
      return this.hasSystemAccess((user as any).globalRole, resource.accessLevel as AccessLevel);
    }

    // Проверяем кастомный уровень доступа
    if ((resource as any).customAccessLevelId) {
      return this.hasCustomAccess(userId, (resource as any).customAccessLevelId);
    }

    return false;
  }

  /**
   * Получить статистику по уровням доступа
   */
  async getAccessLevelsStats(projectId?: string, accountId?: string) {
    const whereClause: any = {};
    if (projectId) whereClause.projectId = projectId;
    if (accountId) whereClause.accountId = accountId;

    const customLevels = await this.prisma.customAccessLevel.findMany({
      where: whereClause,
      select: { name: true, isActive: true }
    });

    return {
      total: customLevels.length,
      active: customLevels.filter(level => level.isActive).length,
      inactive: customLevels.filter(level => !level.isActive).length,
      systemLevels: Object.keys(this.systemAccessLevels).length,
      customLevels: customLevels.length
    };
  }
}