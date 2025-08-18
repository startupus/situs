import { Injectable } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { AccessLevel } from '@prisma/client';

/**
 * Сервис для проверки прав доступа к пунктам меню
 * Реализует систему безопасности как в Joomla
 */
@Injectable()
export class MenuAccessService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Проверка доступа пользователя к пункту меню
   * @param menuItemId ID пункта меню
   * @param userAccessLevels Уровни доступа пользователя
   * @param userId ID пользователя (опционально)
   * @returns true если доступ разрешен
   */
  async checkMenuItemAccess(
    menuItemId: string,
    userAccessLevels: AccessLevel[] = ['PUBLIC'],
    userId?: string
  ): Promise<boolean> {
    const menuItem = await this.prisma.menuItem.findUnique({
      where: { id: menuItemId },
      select: {
        accessLevel: true,
        isPublished: true,
        parameters: true
      }
    });

    if (!menuItem || !menuItem.isPublished) {
      return false;
    }

    // Публичный доступ
    if (menuItem.accessLevel === 'PUBLIC') {
      return true;
    }

    // Проверяем уровни доступа пользователя
    if (userAccessLevels.includes(menuItem.accessLevel)) {
      return true;
    }

    // Пользовательские правила доступа
    if (menuItem.accessLevel === 'CUSTOM' && userId) {
      return await this.checkCustomAccess(menuItemId, userId, menuItem.parameters);
    }

    return false;
  }

  /**
   * Фильтрация пунктов меню по правам доступа
   * @param menuItems Список пунктов меню
   * @param userAccessLevels Уровни доступа пользователя
   * @param userId ID пользователя
   * @returns Отфильтрованный список доступных пунктов
   */
  async filterMenuItemsByAccess(
    menuItems: any[],
    userAccessLevels: AccessLevel[] = ['PUBLIC'],
    userId?: string
  ): Promise<any[]> {
    const accessibleItems = [];

    for (const item of menuItems) {
      const hasAccess = await this.checkMenuItemAccess(item.id, userAccessLevels, userId);
      
      if (hasAccess) {
        // Рекурсивно фильтруем дочерние элементы
        const filteredItem = { ...item };
        
        if (item.children && item.children.length > 0) {
          filteredItem.children = await this.filterMenuItemsByAccess(
            item.children,
            userAccessLevels,
            userId
          );
        }
        
        accessibleItems.push(filteredItem);
      }
    }

    return accessibleItems;
  }

  /**
   * Получение доступных типов меню для пользователя
   * @param projectId ID проекта
   * @param userAccessLevels Уровни доступа пользователя
   * @returns Список доступных типов меню
   */
  async getAccessibleMenuTypes(
    projectId: string,
    userAccessLevels: AccessLevel[] = ['PUBLIC']
  ) {
    const menuTypes = await this.prisma.menuType.findMany({
      where: {
        projectId,
        isActive: true
      },
      include: {
        items: {
          where: {
            isPublished: true
          }
        }
      }
    });

    const accessibleMenuTypes = [];

    for (const menuType of menuTypes) {
      // Проверяем, есть ли хотя бы один доступный пункт в меню
      const accessibleItems = await this.filterMenuItemsByAccess(
        menuType.items,
        userAccessLevels
      );

      if (accessibleItems.length > 0) {
        accessibleMenuTypes.push({
          ...menuType,
          items: accessibleItems
        });
      }
    }

    return accessibleMenuTypes;
  }

  /**
   * Проверка прав на редактирование пункта меню
   * @param menuItemId ID пункта меню
   * @param userId ID пользователя
   * @param userRoles Роли пользователя
   * @returns true если редактирование разрешено
   */
  async checkEditAccess(
    menuItemId: string,
    userId: string,
    userRoles: string[] = []
  ): Promise<boolean> {
    // Только администраторы и владельцы проекта могут редактировать меню
    if (userRoles.includes('ADMIN') || userRoles.includes('PROJECT_OWNER')) {
      return true;
    }

    // Проверяем права на конкретный проект
    const menuItem = await this.prisma.menuItem.findUnique({
      where: { id: menuItemId },
      include: {
        menuType: {
          include: {
            project: true
          }
        }
      }
    });

    if (!menuItem) {
      return false;
    }

    // Владелец проекта может редактировать
    if (menuItem.menuType.project.ownerId === userId) {
      return true;
    }

    // Проверяем членство в аккаунте проекта
    if (menuItem.menuType.project.accountId) {
      const membership = await this.prisma.accountMembership.findFirst({
        where: {
          accountId: menuItem.menuType.project.accountId,
          userId,
          role: {
            in: ['ADMIN', 'MEMBER'] // Используем существующие роли
          }
        }
      });

      return !!membership;
    }

    return false;
  }

  /**
   * Логирование доступа к пунктам меню для аудита
   * @param menuItemId ID пункта меню
   * @param userId ID пользователя
   * @param action Действие (view, edit, delete)
   * @param success Результат проверки доступа
   */
  async logMenuAccess(
    menuItemId: string,
    userId: string,
    action: 'view' | 'edit' | 'delete',
    success: boolean
  ) {
    // В реальном проекте здесь была бы запись в таблицу аудита
    console.log(`[MENU_ACCESS] User ${userId} ${action} menu item ${menuItemId}: ${success ? 'ALLOWED' : 'DENIED'}`);
  }

  /**
   * Получение статистики доступа к меню
   * @param projectId ID проекта
   * @returns Статистика по уровням доступа
   */
  async getAccessStatistics(projectId: string) {
    const stats = await this.prisma.menuItem.groupBy({
      by: ['accessLevel'],
      where: {
        menuType: {
          projectId
        }
      },
      _count: {
        accessLevel: true
      }
    });

    const total = await this.prisma.menuItem.count({
      where: {
        menuType: {
          projectId
        }
      }
    });

    return {
      total,
      byAccessLevel: stats.reduce((acc, stat) => {
        acc[stat.accessLevel] = stat._count.accessLevel;
        return acc;
      }, {} as Record<string, number>)
    };
  }

  // Приватные методы

  /**
   * Проверка пользовательских правил доступа
   */
  private async checkCustomAccess(
    menuItemId: string,
    userId: string,
    parameters: string
  ): Promise<boolean> {
    try {
      const params = JSON.parse(parameters);
      const customRules = params.access_rules;

      if (!customRules) {
        return false;
      }

      // Пример пользовательских правил:
      // {
      //   "access_rules": {
      //     "allowed_users": ["user1", "user2"],
      //     "allowed_groups": ["editors"],
      //     "time_restrictions": {
      //       "start": "09:00",
      //       "end": "18:00"
      //     }
      //   }
      // }

      // Проверка списка разрешенных пользователей
      if (customRules.allowed_users && Array.isArray(customRules.allowed_users)) {
        if (customRules.allowed_users.includes(userId)) {
          return true;
        }
      }

      // Проверка временных ограничений
      if (customRules.time_restrictions) {
        const now = new Date();
        const currentTime = now.getHours() * 100 + now.getMinutes();
        
        const startTime = this.parseTime(customRules.time_restrictions.start);
        const endTime = this.parseTime(customRules.time_restrictions.end);
        
        if (currentTime < startTime || currentTime > endTime) {
          return false;
        }
      }

      // TODO: Добавить проверку групп пользователей

      return false;
    } catch (error) {
      console.warn('Ошибка парсинга пользовательских правил доступа:', error);
      return false;
    }
  }

  /**
   * Парсинг времени в формате HH:MM в минуты
   */
  private parseTime(timeStr: string): number {
    const [hours, minutes] = timeStr.split(':').map(Number);
    return hours * 100 + minutes;
  }
}
