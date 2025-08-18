import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { MenusService, MenuLookup } from './menus.service';
import { Cron, CronExpression } from '@nestjs/schedule';

/**
 * Сервис для создания и кэширования lookup таблиц меню
 * Реализует быстрый поиск пунктов меню для роутинга
 */
@Injectable()
export class MenuLookupService {
  private readonly logger = new Logger(MenuLookupService.name);
  private lookupCache = new Map<string, MenuLookup>();
  private lastUpdate = new Map<string, Date>();

  constructor(
    private readonly prisma: PrismaService,
    private readonly menusService: MenusService
  ) {}

  /**
   * Построение lookup таблицы для быстрого поиска
   * Индексация по component:view:layout
   */
  async buildLookup(
    menuTypeId: string, 
    language: string = '*'
  ): Promise<MenuLookup> {
    const cacheKey = `${menuTypeId}:${language}`;
    
    // Проверяем кэш
    const cached = this.lookupCache.get(cacheKey);
    const lastUpd = this.lastUpdate.get(cacheKey);
    
    if (cached && lastUpd && (Date.now() - lastUpd.getTime()) < 5 * 60 * 1000) { // 5 минут
      return cached;
    }

    // Получаем все пункты меню
    const menuItems = await this.prisma.menuItem.findMany({
      where: {
        menuTypeId,
        isPublished: true,
        OR: [
          { language: '*' },
          { language }
        ]
      },
      select: {
        id: true,
        component: true,
        view: true,
        layout: true,
        targetId: true,
        language: true
      }
    });

    // Строим lookup таблицу
    const lookup: MenuLookup = {};
    
    for (const item of menuItems) {
      if (!item.component || !item.view) continue;
      
      const key = item.layout 
        ? `${item.component}:${item.view}:${item.layout}`
        : `${item.component}:${item.view}`;
      
      if (!lookup[key]) {
        lookup[key] = {};
      }
      
      const targetIndex = item.targetId ? parseInt(item.targetId) || 0 : 0;
      lookup[key][targetIndex] = item.id;
    }

    // Кэшируем результат
    this.lookupCache.set(cacheKey, lookup);
    this.lastUpdate.set(cacheKey, new Date());
    
    this.logger.debug(`Built lookup table for ${cacheKey}: ${Object.keys(lookup).length} entries`);
    
    return lookup;
  }

  /**
   * Быстрый поиск пункта меню по компоненту
   */
  async findMenuItemId(
    menuTypeId: string,
    component: string,
    view: string,
    layout?: string,
    targetId?: string,
    language: string = '*'
  ): Promise<string | null> {
    const lookup = await this.buildLookup(menuTypeId, language);
    
    const key = layout ? `${component}:${view}:${layout}` : `${component}:${view}`;
    const targetIndex = targetId ? parseInt(targetId) || 0 : 0;
    
    return lookup[key]?.[targetIndex] || null;
  }

  /**
   * Инвалидация кэша при изменении меню
   */
  invalidateCache(menuTypeId?: string): void {
    if (menuTypeId) {
      // Инвалидируем кэш для конкретного типа меню
      const keysToDelete = Array.from(this.lookupCache.keys())
        .filter(key => key.startsWith(menuTypeId));
      
      keysToDelete.forEach(key => {
        this.lookupCache.delete(key);
        this.lastUpdate.delete(key);
      });
      
      this.logger.debug(`Invalidated cache for menuType: ${menuTypeId}`);
    } else {
      // Полная очистка кэша
      this.lookupCache.clear();
      this.lastUpdate.clear();
      this.logger.debug('Cleared all lookup cache');
    }
  }

  /**
   * Автоматическая очистка устаревшего кэша (каждые 30 минут)
   */
  @Cron(CronExpression.EVERY_30_MINUTES)
  handleCacheCleanup(): void {
    const now = Date.now();
    const maxAge = 30 * 60 * 1000; // 30 минут
    
    for (const [key, lastUpd] of this.lastUpdate.entries()) {
      if (now - lastUpd.getTime() > maxAge) {
        this.lookupCache.delete(key);
        this.lastUpdate.delete(key);
      }
    }
    
    this.logger.debug('Cleaned up expired lookup cache entries');
  }

  /**
   * Статистика кэша
   */
  getCacheStats(): { entries: number; oldestEntry?: Date; newestEntry?: Date } {
    const dates = Array.from(this.lastUpdate.values());
    
    return {
      entries: this.lookupCache.size,
      oldestEntry: dates.length > 0 ? new Date(Math.min(...dates.map(d => d.getTime()))) : undefined,
      newestEntry: dates.length > 0 ? new Date(Math.max(...dates.map(d => d.getTime()))) : undefined
    };
  }
}
