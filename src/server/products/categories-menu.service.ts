import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { RealtimeEventsService } from '../realtime/realtime-events.service';
import { Category } from '@prisma/client';

/**
 * Сервис для работы с категориями как с системой меню
 * Реализует ту же логику, что и в системе меню
 */
@Injectable()
export class CategoriesMenuService {
  private readonly logger = new Logger(CategoriesMenuService.name);
  
  constructor(
    private readonly prisma: PrismaService,
    private readonly realtimeEvents: RealtimeEventsService
  ) {}

  /**
   * Получение иерархического списка категорий
   * Аналог getMenuItems с фильтрацией
   */
  async getCategoriesHierarchy(
    productId: string,
    language: string = '*',
    parentId?: string,
    level?: number
  ): Promise<Category[]> {
    const where: any = {
      productId,
      isPublished: true
    };

    // Фильтрация по языку (аналог меню)
    if (language !== '*') {
      where.OR = [
        { language: '*' },
        { language }
      ];
    }

    // Фильтрация по родителю
    if (parentId !== undefined) {
      where.parentId = parentId;
    }

    // Фильтрация по уровню
    if (level !== undefined) {
      where.level = level;
    }

    const categories = await this.prisma.category.findMany({
      where,
      include: {
        children: {
          where: { isPublished: true },
          orderBy: [{ orderIndex: 'asc' }, { name: 'asc' }]
        },
        parent: true,
        _count: {
          select: {
            items: true,
            children: true
          }
        }
      },
      orderBy: [
        { level: 'asc' },
        { orderIndex: 'asc' },
        { name: 'asc' }
      ]
    });

    return categories;
  }

  /**
   * Построение lookup таблицы для категорий
   * Аналог buildLookup для меню
   */
  async buildCategoriesLookup(
    productId: string,
    language: string = '*'
  ): Promise<{ [alias: string]: string }> {
    const categories = await this.prisma.category.findMany({
      where: {
        productId,
        isPublished: true,
        OR: language === '*' ? undefined : [
          { language: '*' },
          { language }
        ]
      },
      select: {
        id: true,
        alias: true,
        language: true
      }
    });

    const lookup: { [alias: string]: string } = {};
    
    for (const category of categories) {
      // Приоритет: конкретный язык > универсальный
      if (!lookup[category.alias] || category.language === language) {
        lookup[category.alias] = category.id;
      }
    }

    return lookup;
  }

  /**
   * Поиск категории по alias
   * Аналог findMenuItemByAlias
   */
  async findCategoryByAlias(
    productId: string,
    alias: string,
    language: string = '*'
  ): Promise<Category | null> {
    const category = await this.prisma.category.findFirst({
      where: {
        productId,
        alias,
        isPublished: true,
        OR: language === '*' ? undefined : [
          { language: '*' },
          { language }
        ]
      },
      include: {
        parent: true,
        children: {
          where: { isPublished: true },
          orderBy: [{ orderIndex: 'asc' }, { name: 'asc' }]
        },
        _count: {
          select: {
            items: true,
            children: true
          }
        }
      }
    });

    return category;
  }

  /**
   * Получение хлебных крошек для категории
   * Аналог getBreadcrumbs для меню
   */
  async getCategoryBreadcrumbs(
    categoryId: string,
    language: string = '*'
  ): Promise<Category[]> {
    const breadcrumbs: Category[] = [];
    let currentCategory = await this.prisma.category.findUnique({
      where: { id: categoryId },
      include: {
        parent: true
      }
    });

    while (currentCategory) {
      breadcrumbs.unshift(currentCategory);
      
      if (currentCategory.parentId) {
        currentCategory = await this.prisma.category.findUnique({
          where: { id: currentCategory.parentId },
          include: {
            parent: true
          }
        });
      } else {
        break;
      }
    }

    return breadcrumbs;
  }

  /**
   * Переупорядочивание категорий
   * Аналог reorderMenuItems
   */
  async reorderCategories(
    productId: string,
    items: Array<{
      id: string;
      orderIndex: number;
      level: number;
      parentId: string | null;
    }>
  ): Promise<void> {
    // Обновляем порядок в транзакции
    await this.prisma.$transaction(async (tx) => {
      for (const item of items) {
        await tx.category.update({
          where: { id: item.id },
          data: {
            orderIndex: item.orderIndex,
            level: item.level,
            parentId: item.parentId
          }
        });
      }
    });

    // Публикуем SSE событие
    this.realtimeEvents.publishCategoriesReordered(productId, items);
    
    this.logger.debug(`Reordered ${items.length} categories for product ${productId}`);
  }

  /**
   * Получение активной категории
   * Аналог getActiveMenuItem
   */
  async getActiveCategory(
    productId: string,
    currentPath: string,
    language: string = '*'
  ): Promise<Category | null> {
    // Простая логика: ищем по alias в пути
    const pathSegments = currentPath.split('/').filter(s => s.length > 0);
    
    for (const segment of pathSegments.reverse()) {
      const category = await this.findCategoryByAlias(productId, segment, language);
      if (category) {
        return category;
      }
    }

    return null;
  }

  /**
   * Получение статистики категорий
   * Аналог статистики меню
   */
  async getCategoriesStats(productId: string): Promise<{
    totalCategories: number;
    publishedCategories: number;
    categoriesByLevel: { [level: number]: number };
    totalItems: number;
  }> {
    const [total, published, byLevel, itemsCount] = await Promise.all([
      this.prisma.category.count({ where: { productId } }),
      this.prisma.category.count({ where: { productId, isPublished: true } }),
      this.prisma.category.groupBy({
        by: ['level'],
        where: { productId, isPublished: true },
        _count: { id: true }
      }),
      this.prisma.item.count({
        where: {
          category: { productId }
        }
      })
    ]);

    const categoriesByLevel: { [level: number]: number } = {};
    byLevel.forEach(group => {
      categoriesByLevel[group.level] = group._count.id;
    });

    return {
      totalCategories: total,
      publishedCategories: published,
      categoriesByLevel,
      totalItems: itemsCount
    };
  }

  /**
   * Поиск категорий с мультипараметровой фильтрацией
   * Аналог getItemsByFilters для меню
   */
  async getCategoriesByFilters(
    productId: string,
    properties: string[],
    values: any[],
    language: string = '*'
  ): Promise<Category[]> {
    if (properties.length !== values.length) {
      throw new Error('Количество свойств должно соответствовать количеству значений');
    }

    const where: any = {
      productId,
      isPublished: true
    };

    // Мультиязычность
    if (language !== '*') {
      where.OR = [
        { language: '*' },
        { language }
      ];
    }

    // Применяем фильтры
    for (let i = 0; i < properties.length; i++) {
      const property = properties[i];
      const value = values[i];

      switch (property) {
        case 'level':
          if (Array.isArray(value)) {
            where.level = { in: value };
          } else {
            where.level = value;
          }
          break;
        
        case 'parentId':
          where.parentId = value;
          break;
        
        case 'alias':
          if (Array.isArray(value)) {
            where.alias = { in: value };
          } else {
            where.alias = value;
          }
          break;
        
        case 'name':
          where.name = { contains: value, mode: 'insensitive' };
          break;
      }
    }

    return await this.prisma.category.findMany({
      where,
      include: {
        parent: true,
        children: {
          where: { isPublished: true },
          orderBy: [{ orderIndex: 'asc' }, { name: 'asc' }]
        },
        _count: {
          select: {
            items: true,
            children: true
          }
        }
      },
      orderBy: [
        { level: 'asc' },
        { orderIndex: 'asc' },
        { name: 'asc' }
      ]
    });
  }
}
