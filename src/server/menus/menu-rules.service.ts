import { Injectable } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { MenusService } from './menus.service';

/**
 * Сервис для обработки правил маршрутизации меню (аналог Joomla MenuRules)
 * Автоматически определяет Itemid для SEF URLs и обрабатывает роутинг
 */
@Injectable()
export class MenuRulesService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly menusService: MenusService,
  ) {}

  /**
   * Автоматический выбор Itemid для URL
   * Реализует логику Joomla для определения активного пункта меню
   */
  async getItemidForRoute(
    projectId: string,
    component: string,
    view: string,
    targetId?: string,
    requestedItemid?: string,
  ): Promise<string | null> {
    // 1. Если Itemid указан в URL, проверяем его валидность
    if (requestedItemid) {
      const requestedItem = await this.prisma.menuItem.findFirst({
        where: {
          id: requestedItemid,
          menuType: {
            projectId,
          },
          isPublished: true,
        },
      });

      if (requestedItem && this.isMenuItemMatches(requestedItem, component, view, targetId)) {
        return requestedItemid;
      }
    }

    // 2. Поиск точного совпадения по component + view + targetId
    const exactMatch = await this.prisma.menuItem.findFirst({
      where: {
        component,
        view,
        targetId,
        isPublished: true,
        menuType: {
          projectId,
        },
      },
      orderBy: [
        { level: 'asc' }, // Предпочитаем пункты верхнего уровня
        { orderIndex: 'asc' },
      ],
    });

    if (exactMatch) {
      return exactMatch.id;
    }

    // 3. Поиск совпадения по component + view (без targetId)
    const componentMatch = await this.prisma.menuItem.findFirst({
      where: {
        component,
        view,
        isPublished: true,
        menuType: {
          projectId,
        },
      },
      orderBy: [{ level: 'asc' }, { orderIndex: 'asc' }],
    });

    if (componentMatch) {
      return componentMatch.id;
    }

    // 4. Поиск совпадения только по component
    const generalMatch = await this.prisma.menuItem.findFirst({
      where: {
        component,
        isPublished: true,
        menuType: {
          projectId,
        },
      },
      orderBy: [{ level: 'asc' }, { orderIndex: 'asc' }],
    });

    return generalMatch?.id || null;
  }

  /**
   * Построение SEF URL для пункта меню
   * Создает красивые URL как в Joomla
   */
  async buildSefUrl(menuItemId: string, additionalParams: Record<string, any> = {}): Promise<string> {
    const menuItem = await this.prisma.menuItem.findUnique({
      where: { id: menuItemId },
      include: {
        menuType: {
          include: {
            project: true,
          },
        },
        parent: true,
      },
    });

    if (!menuItem) {
      throw new Error('Пункт меню не найден');
    }

    const project = menuItem.menuType.project;
    let url = `/${project.slug}`;

    // Строим путь по иерархии меню
    const pathSegments: string[] = [];

    // Добавляем родительские алиасы
    if (menuItem.parent) {
      const parentPath = await this.getMenuItemPath(menuItem.parent.id);
      pathSegments.push(...parentPath);
    }

    // Добавляем текущий алиас
    pathSegments.push(menuItem.alias);

    url += '/' + pathSegments.join('/');

    // Добавляем Itemid для SEF
    const params = new URLSearchParams();
    params.set('Itemid', menuItemId);

    // Добавляем дополнительные параметры
    Object.entries(additionalParams).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        params.set(key, String(value));
      }
    });

    if (params.toString()) {
      url += '?' + params.toString();
    }

    return url;
  }

  /**
   * Парсинг URL и определение активного пункта меню
   */
  async parseUrl(
    url: string,
    projectId: string,
  ): Promise<{
    menuItem: any | null;
    component: string | null;
    view: string | null;
    targetId: string | null;
    itemid: string | null;
    params: Record<string, string>;
  }> {
    const urlObj = new URL(url, 'http://localhost');
    const params = Object.fromEntries(urlObj.searchParams.entries());
    const pathSegments = urlObj.pathname.split('/').filter(Boolean);

    // Извлекаем Itemid из параметров
    const itemid = params.Itemid || null;

    // Если есть Itemid, получаем пункт меню
    let menuItem = null;
    if (itemid) {
      menuItem = await this.prisma.menuItem.findFirst({
        where: {
          id: itemid,
          menuType: {
            projectId,
          },
        },
        include: {
          menuType: true,
        },
      });
    }

    // Если пункт меню найден, используем его данные
    if (menuItem) {
      return {
        menuItem,
        component: menuItem.component,
        view: menuItem.view,
        targetId: menuItem.targetId,
        itemid,
        params,
      };
    }

    // Иначе пытаемся определить по пути
    return {
      menuItem: null,
      component: null,
      view: null,
      targetId: null,
      itemid,
      params,
    };
  }

  /**
   * Генерация канонических URL для SEO
   */
  async generateCanonicalUrl(menuItemId: string, domain?: string): Promise<string> {
    const sefUrl = await this.buildSefUrl(menuItemId);
    const baseUrl = domain || 'http://localhost:5177';

    return `${baseUrl}${sefUrl}`;
  }

  /**
   * Построение sitemap.xml на основе пунктов меню
   */
  async generateSitemap(projectId: string): Promise<
    Array<{
      url: string;
      lastmod: string;
      priority: number;
      changefreq: string;
    }>
  > {
    const menuItems = await this.prisma.menuItem.findMany({
      where: {
        isPublished: true,
        type: 'COMPONENT', // Только компоненты, не внешние ссылки
        menuType: {
          projectId,
        },
      },
      include: {
        menuType: {
          include: {
            project: true,
          },
        },
      },
      orderBy: [{ level: 'asc' }, { orderIndex: 'asc' }],
    });

    const sitemap = [];

    for (const item of menuItems) {
      try {
        const url = await this.buildSefUrl(item.id);

        // Определяем приоритет по уровню меню
        const priority = item.level === 1 ? 1.0 : item.level === 2 ? 0.8 : 0.6;

        // Определяем частоту изменений по типу компонента
        let changefreq = 'monthly';
        if (item.component === 'Blog') changefreq = 'weekly';
        if (item.component === 'Store') changefreq = 'daily';
        if (item.component === 'Landing') changefreq = 'yearly';

        sitemap.push({
          url,
          lastmod: item.updatedAt.toISOString(),
          priority,
          changefreq,
        });
      } catch (error) {
        console.warn(`Ошибка генерации URL для пункта меню ${item.id}:`, error);
      }
    }

    return sitemap;
  }

  // Приватные методы

  /**
   * Проверяет, соответствует ли пункт меню указанным параметрам
   */
  private isMenuItemMatches(menuItem: any, component: string, view: string, targetId?: string): boolean {
    if (menuItem.component !== component) return false;
    if (menuItem.view !== view) return false;
    if (targetId && menuItem.targetId !== targetId) return false;

    return true;
  }

  /**
   * Получает путь до пункта меню через иерархию
   */
  private async getMenuItemPath(menuItemId: string): Promise<string[]> {
    const path: string[] = [];
    let currentId = menuItemId;

    while (currentId) {
      const item = await this.prisma.menuItem.findUnique({
        where: { id: currentId },
        select: { alias: true, parentId: true },
      });

      if (!item) break;

      path.unshift(item.alias);
      currentId = item.parentId || '';
    }

    return path;
  }
}
