import { Injectable } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';

/**
 * Сервис для разрешения пунктов меню в конкретные компоненты и данные
 * Реализует универсальную систему привязки как в Joomla
 */
@Injectable()
export class MenuResolverService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Разрешает пункт меню в данные компонента
   * @param menuItem Пункт меню
   * @returns Объект с данными для рендеринга компонента
   */
  async resolveMenuItem(menuItem: any) {
    if (!menuItem.component || !menuItem.view) {
      return {
        component: null,
        data: null,
        error: 'Пункт меню не содержит информации о компоненте',
      };
    }

    try {
      switch (menuItem.component) {
        case 'Website':
          return await this.resolveWebsiteComponent(menuItem);

        case 'Store':
          return await this.resolveStoreComponent(menuItem);

        case 'Blog':
          return await this.resolveBlogComponent(menuItem);

        case 'Landing':
          return await this.resolveLandingComponent(menuItem);

        default:
          return {
            component: menuItem.component,
            data: null,
            error: `Неизвестный компонент: ${menuItem.component}`,
          };
      }
    } catch (error) {
      return {
        component: menuItem.component,
        data: null,
        error: `Ошибка разрешения компонента: ${error instanceof Error ? error.message : String(error)}`,
      };
    }
  }

  /**
   * Разрешение Website компонента
   */
  private async resolveWebsiteComponent(menuItem: any) {
    const { view, targetId } = menuItem;

    switch (view) {
      case 'page':
        if (!targetId) {
          return {
            component: 'Website',
            data: null,
            error: 'Для view=page требуется targetId (slug страницы)',
          };
        }

        // Ищем страницу по slug
        const page = await this.prisma.page.findFirst({
          where: {
            slug: targetId,
            product: {
              type: 'WEBSITE',
            },
          },
          include: {
            product: {
              include: {
                project: true,
              },
            },
          },
        });

        if (!page) {
          return {
            component: 'Website',
            data: null,
            error: `Страница с slug "${targetId}" не найдена`,
          };
        }

        return {
          component: 'Website',
          view: 'page',
          data: {
            page,
            project: page.product.project,
            url: `/projects/${page.product.project.slug}/website/${page.slug}`,
          },
        };

      default:
        return {
          component: 'Website',
          data: null,
          error: `Неизвестный view для Website: ${view}`,
        };
    }
  }

  /**
   * Разрешение Store компонента
   */
  private async resolveStoreComponent(menuItem: any) {
    const { view, targetId } = menuItem;

    switch (view) {
      case 'categories':
        // Показать все категории магазина
        const categories = await this.prisma.category.findMany({
          where: {
            product: {
              type: 'ECOMMERCE',
            },
          },
          include: {
            children: true,
            _count: { select: { items: true } },
            product: {
              include: {
                project: true,
              },
            },
          },
          orderBy: [{ orderIndex: 'asc' }, { name: 'asc' }],
        });

        return {
          component: 'Store',
          view: 'categories',
          data: {
            categories,
            project: categories[0]?.product?.project,
            url: `/projects/${categories[0]?.product?.project?.slug}/store`,
          },
        };

      case 'category':
        if (!targetId) {
          return {
            component: 'Store',
            data: null,
            error: 'Для view=category требуется targetId (ID категории)',
          };
        }

        // Ищем категорию по ID
        const category = await this.prisma.category.findUnique({
          where: { id: targetId },
          include: {
            children: true,
            parent: true,
            items: {
              take: 20,
              orderBy: [{ orderIndex: 'asc' }, { name: 'asc' }],
            },
            _count: { select: { items: true } },
            product: {
              include: {
                project: true,
              },
            },
          },
        });

        if (!category) {
          return {
            component: 'Store',
            data: null,
            error: `Категория с ID "${targetId}" не найдена`,
          };
        }

        return {
          component: 'Store',
          view: 'category',
          data: {
            category,
            items: category.items,
            project: category.product.project,
            url: `/projects/${category.product.project.slug}/store/category/${category.slug}`,
          },
        };

      default:
        return {
          component: 'Store',
          data: null,
          error: `Неизвестный view для Store: ${view}`,
        };
    }
  }

  /**
   * Разрешение Blog компонента
   */
  private async resolveBlogComponent(menuItem: any) {
    const { view, targetId } = menuItem;

    switch (view) {
      case 'list':
        // Показать список статей блога
        return {
          component: 'Blog',
          view: 'list',
          data: {
            articles: [], // TODO: реализовать модель Article
            project: null, // TODO: получить проект
            url: `/blog/${targetId || 'list'}`,
          },
        };

      case 'article':
        // Показать конкретную статью
        return {
          component: 'Blog',
          view: 'article',
          data: {
            article: null, // TODO: найти статью по targetId
            project: null,
            url: `/blog/article/${targetId}`,
          },
        };

      default:
        return {
          component: 'Blog',
          data: null,
          error: `Неизвестный view для Blog: ${view}`,
        };
    }
  }

  /**
   * Разрешение Landing компонента
   */
  private async resolveLandingComponent(menuItem: any) {
    const { view, targetId } = menuItem;

    switch (view) {
      case 'page':
        // Показать лендинг страницу
        return {
          component: 'Landing',
          view: 'page',
          data: {
            landing: null, // TODO: найти лендинг по targetId
            project: null,
            url: `/landing/${targetId}`,
          },
        };

      default:
        return {
          component: 'Landing',
          data: null,
          error: `Неизвестный view для Landing: ${view}`,
        };
    }
  }

  /**
   * Разрешает активный пункт меню для текущего пути
   * @param menuTypeId ID типа меню
   * @param currentPath Текущий путь (например, /projects/demo/website/about)
   * @returns Активный пункт меню или null
   */
  async resolveActiveMenuItem(menuTypeId: string, currentPath: string) {
    const menuItems = await this.prisma.menuItem.findMany({
      where: {
        menuTypeId,
        isPublished: true,
      },
      orderBy: [{ level: 'asc' }, { orderIndex: 'asc' }],
    });

    // Ищем точное совпадение по targetId или alias
    for (const item of menuItems) {
      if (item.alias && currentPath.includes(item.alias)) {
        return item;
      }

      if (item.targetId && currentPath.includes(item.targetId)) {
        return item;
      }
    }

    return null;
  }

  /**
   * Строит навигационные крошки (breadcrumbs) на основе активного пункта меню
   * @param activeMenuItem Активный пункт меню
   * @param menuTypeId ID типа меню
   * @returns Массив крошек от корня до активного пункта
   */
  async buildBreadcrumbs(activeMenuItem: any, menuTypeId: string) {
    if (!activeMenuItem) return [];

    const breadcrumbs = [];
    let currentItem = activeMenuItem;

    // Поднимаемся по иерархии до корня
    while (currentItem) {
      breadcrumbs.unshift({
        id: currentItem.id,
        title: currentItem.title,
        alias: currentItem.alias,
        url: this.buildMenuItemUrl(currentItem),
      });

      if (currentItem.parentId) {
        currentItem = await this.prisma.menuItem.findUnique({
          where: { id: currentItem.parentId },
        });
      } else {
        currentItem = null;
      }
    }

    return breadcrumbs;
  }

  /**
   * Строит URL для пункта меню
   * @param menuItem Пункт меню
   * @returns URL для навигации
   */
  private buildMenuItemUrl(menuItem: any): string {
    if (menuItem.type === 'URL' && menuItem.externalUrl) {
      return menuItem.externalUrl;
    }

    if (menuItem.component && menuItem.view && menuItem.targetId) {
      switch (menuItem.component) {
        case 'Website':
          return `/website/${menuItem.targetId}`;
        case 'Store':
          if (menuItem.view === 'category') {
            return `/store/category/${menuItem.targetId}`;
          }
          return `/store/${menuItem.view}`;
        case 'Blog':
          return `/blog/${menuItem.targetId}`;
        case 'Landing':
          return `/landing/${menuItem.targetId}`;
      }
    }

    return `/${menuItem.alias}`;
  }
}
