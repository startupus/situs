import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { MenuAccessService } from '../menu-access.service';

/**
 * Middleware для проверки прав доступа к пунктам меню
 * Автоматически фильтрует меню на основе прав пользователя
 */
@Injectable()
export class MenuAccessMiddleware implements NestMiddleware {
  constructor(private readonly menuAccessService: MenuAccessService) {}

  async use(req: Request, res: Response, next: NextFunction) {
    try {
      // Получаем информацию о пользователе из запроса
      const user = (req as any).user;
      const projectId = req.params.projectId || req.query.projectId as string;

      if (!projectId) {
        return next();
      }

      // Определяем уровни доступа пользователя
      const userAccessLevels = this.getUserAccessLevels(user, projectId);

      // Добавляем информацию в запрос для использования в контроллерах
      (req as any).userAccessLevels = userAccessLevels;
      (req as any).menuContext = {
        projectId,
        canViewAll: userAccessLevels.includes('CUSTOM'),
        isAdmin: userAccessLevels.includes('SPECIAL'),
        isRegistered: userAccessLevels.includes('REGISTERED')
      };

      next();
    } catch (error) {
      console.error('Ошибка в MenuAccessMiddleware:', error);
      next();
    }
  }

  /**
   * Определение уровней доступа пользователя
   * Интеграция с существующими системами ролей
   */
  private getUserAccessLevels(user: any, projectId: string): string[] {
    const levels = ['PUBLIC']; // Базовый уровень для всех

    if (!user) {
      return levels;
    }

    // Добавляем REGISTERED для авторизованных пользователей
    levels.push('REGISTERED');

    // Проверяем глобальные роли
    if (user.globalRole) {
      switch (user.globalRole) {
        case 'SUPER_ADMIN':
        case 'STAFF':
          levels.push('SPECIAL', 'CUSTOM');
          break;
        case 'AGENCY':
        case 'BUSINESS':
          levels.push('SPECIAL');
          break;
      }
    }

    // Проверяем роли в проекте
    if (user.projectAccess && user.projectAccess[projectId]) {
      const projectRole = user.projectAccess[projectId];
      switch (projectRole) {
        case 'OWNER':
        case 'ADMIN':
          levels.push('SPECIAL', 'CUSTOM');
          break;
        case 'EDITOR':
          levels.push('SPECIAL');
          break;
        // VIEWER уже имеет REGISTERED
      }
    }

    // Проверяем членство в агентстве
    if (user.accountMembership) {
      levels.push('SPECIAL');
    }

    return [...new Set(levels)]; // Убираем дубликаты
  }
}

/**
 * Декоратор для автоматической фильтрации меню по правам доступа
 */
export function FilterMenuByAccess() {
  return function (target: any, propertyName: string, descriptor: PropertyDescriptor) {
    const method = descriptor.value;

    descriptor.value = async function (...args: any[]) {
      const req = args.find(arg => arg && arg.userAccessLevels);
      
      if (req && req.userAccessLevels) {
        // Добавляем фильтрацию по правам доступа в параметры запроса
        const lastArg = args[args.length - 1];
        if (typeof lastArg === 'object' && lastArg !== null) {
          lastArg.accessLevels = req.userAccessLevels;
        }
      }

      return method.apply(this, args);
    };

    return descriptor;
  };
}

/**
 * Утилита для проверки прав доступа в контроллерах
 */
export class MenuAccessHelper {
  /**
   * Проверка, может ли пользователь видеть пункт меню
   */
  static canView(item: any, userAccessLevels: string[]): boolean {
    if (!item || !item.accessLevel) {
      return true; // По умолчанию разрешаем
    }

    return userAccessLevels.includes(item.accessLevel);
  }

  /**
   * Фильтрация списка пунктов меню по правам доступа
   */
  static filterMenuItems(items: any[], userAccessLevels: string[]): any[] {
    return items.filter(item => this.canView(item, userAccessLevels));
  }

  /**
   * Получение уровней доступа из запроса
   */
  static getAccessLevelsFromRequest(req: any): string[] {
    return req.userAccessLevels || ['PUBLIC'];
  }

  /**
   * Проверка, является ли пользователь администратором
   */
  static isAdmin(req: any): boolean {
    const levels = this.getAccessLevelsFromRequest(req);
    return levels.includes('SPECIAL') || levels.includes('CUSTOM');
  }
}
