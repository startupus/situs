import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

/**
 * PageService - Модульный сервис для работы со страницами
 * Основан на архитектуре Strapi с разделением ответственности
 */

export interface CreatePageData {
  title: string;
  slug: string;
  content?: any;
  projectId: string;
  isHomePage?: boolean;
  metaTitle?: string;
  metaDescription?: string;
}

export interface UpdatePageData {
  title?: string;
  slug?: string;
  content?: any;
  isHomePage?: boolean;
  metaTitle?: string;
  metaDescription?: string;
  status?: string;
}

export interface PageFilters {
  projectId?: string;
  search?: string;
  status?: string;
  isHomePage?: boolean;
  sortBy?: 'title' | 'created' | 'updated';
  sortOrder?: 'asc' | 'desc';
}

class PageService {
  /**
   * Получение всех страниц с фильтрацией
   */
  async findMany(filters?: PageFilters) {
    try {
      const whereClause: any = {};
      
      // Фильтр по проекту
      if (filters?.projectId) {
        whereClause.projectId = filters.projectId;
      }
      
      // Поиск по названию
      if (filters?.search) {
        whereClause.OR = [
          { title: { contains: filters.search, mode: 'insensitive' } },
          { slug: { contains: filters.search, mode: 'insensitive' } }
        ];
      }
      
      // Фильтр по статусу
      if (filters?.status) {
        whereClause.status = filters.status.toUpperCase();
      }
      
      // Фильтр по домашней странице
      if (filters?.isHomePage !== undefined) {
        whereClause.isHomePage = filters.isHomePage;
      }
      
      // Определяем сортировку
      let orderBy: any = { updatedAt: 'desc' };
      if (filters?.sortBy) {
        const sortOrder = filters.sortOrder || 'desc';
        switch (filters.sortBy) {
          case 'title':
            orderBy = { title: sortOrder };
            break;
          case 'created':
            orderBy = { createdAt: sortOrder };
            break;
          case 'updated':
            orderBy = { updatedAt: sortOrder };
            break;
        }
      }

      const pages = await prisma.page.findMany({
        where: whereClause,
        include: {
          project: {
            select: {
              id: true,
              name: true,
              slug: true
            }
          }
        },
        orderBy
      });

      return pages.map(page => ({
        id: page.id,
        title: page.title,
        slug: page.slug,
        isHomePage: page.isHomePage,
        status: page.status,
        metaTitle: page.metaTitle,
        metaDescription: page.metaDescription,
        content: page.content,
        projectId: page.projectId,
        project: page.project,
        createdAt: page.createdAt.toISOString(),
        updatedAt: page.updatedAt.toISOString()
      }));
    } catch (error) {
      console.error('Ошибка при получении страниц:', error);
      throw new Error('Не удалось получить страницы');
    }
  }

  /**
   * Получение страницы по ID
   */
  async findOne(pageId: string) {
    try {
      const page = await prisma.page.findUnique({
        where: { id: pageId },
        include: {
          project: {
            select: {
              id: true,
              name: true,
              slug: true,
              ownerId: true
            }
          }
        }
      });

      if (!page) {
        return null;
      }

      return {
        id: page.id,
        title: page.title,
        slug: page.slug,
        isHomePage: page.isHomePage,
        status: page.status,
        metaTitle: page.metaTitle,
        metaDescription: page.metaDescription,
        content: page.content,
        projectId: page.projectId,
        project: page.project,
        createdAt: page.createdAt.toISOString(),
        updatedAt: page.updatedAt.toISOString()
      };
    } catch (error) {
      console.error('Ошибка при получении страницы:', error);
      return null;
    }
  }

  /**
   * Получение страницы по slug в проекте
   */
  async findBySlug(projectId: string, slug: string) {
    try {
      const page = await prisma.page.findFirst({
        where: { 
          projectId,
          slug 
        },
        include: {
          project: {
            select: {
              id: true,
              name: true,
              slug: true,
              ownerId: true
            }
          }
        }
      });

      if (!page) {
        return null;
      }

      return {
        id: page.id,
        title: page.title,
        slug: page.slug,
        isHomePage: page.isHomePage,
        status: page.status,
        metaTitle: page.metaTitle,
        metaDescription: page.metaDescription,
        content: page.content,
        projectId: page.projectId,
        project: page.project,
        createdAt: page.createdAt.toISOString(),
        updatedAt: page.updatedAt.toISOString()
      };
    } catch (error) {
      console.error('Ошибка при получении страницы по slug:', error);
      return null;
    }
  }

  /**
   * Создание новой страницы
   */
  async create(data: CreatePageData) {
    try {
      // Проверяем, существует ли проект
      const project = await prisma.project.findUnique({
        where: { id: data.projectId }
      });

      if (!project) {
        throw new Error('Проект не найден');
      }

      // Проверяем уникальность slug в рамках проекта
      const existingPage = await prisma.page.findFirst({
        where: {
          projectId: data.projectId,
          slug: data.slug
        }
      });

      if (existingPage) {
        throw new Error('Страница с таким slug уже существует в проекте');
      }

      // Если это домашняя страница, убираем флаг у других страниц
      if (data.isHomePage) {
        await prisma.page.updateMany({
          where: { projectId: data.projectId },
          data: { isHomePage: false }
        });
      }

      const page = await prisma.page.create({
        data: {
          title: data.title,
          slug: data.slug,
          content: data.content || { blocks: [] },
          projectId: data.projectId,
          isHomePage: data.isHomePage || false,
          metaTitle: data.metaTitle,
          metaDescription: data.metaDescription,
          status: 'DRAFT'
        },
        include: {
          project: {
            select: {
              id: true,
              name: true,
              slug: true
            }
          }
        }
      });

      return {
        id: page.id,
        title: page.title,
        slug: page.slug,
        isHomePage: page.isHomePage,
        status: page.status,
        metaTitle: page.metaTitle,
        metaDescription: page.metaDescription,
        content: page.content,
        projectId: page.projectId,
        project: page.project,
        createdAt: page.createdAt.toISOString(),
        updatedAt: page.updatedAt.toISOString()
      };
    } catch (error) {
      console.error('Ошибка при создании страницы:', error);
      throw error;
    }
  }

  /**
   * Обновление страницы
   */
  async update(pageId: string, data: UpdatePageData) {
    try {
      // Если устанавливается домашняя страница, убираем флаг у других
      if (data.isHomePage) {
        const page = await prisma.page.findUnique({
          where: { id: pageId },
          select: { projectId: true }
        });

        if (page) {
          await prisma.page.updateMany({
            where: { 
              projectId: page.projectId,
              id: { not: pageId }
            },
            data: { isHomePage: false }
          });
        }
      }

      const updatedPage = await prisma.page.update({
        where: { id: pageId },
        data: {
          ...data,
          updatedAt: new Date()
        },
        include: {
          project: {
            select: {
              id: true,
              name: true,
              slug: true
            }
          }
        }
      });

      return {
        id: updatedPage.id,
        title: updatedPage.title,
        slug: updatedPage.slug,
        isHomePage: updatedPage.isHomePage,
        status: updatedPage.status,
        metaTitle: updatedPage.metaTitle,
        metaDescription: updatedPage.metaDescription,
        content: updatedPage.content,
        projectId: updatedPage.projectId,
        project: updatedPage.project,
        createdAt: updatedPage.createdAt.toISOString(),
        updatedAt: updatedPage.updatedAt.toISOString()
      };
    } catch (error) {
      console.error('Ошибка при обновлении страницы:', error);
      throw new Error('Не удалось обновить страницу');
    }
  }

  /**
   * Удаление страницы
   */
  async delete(pageId: string) {
    try {
      const page = await prisma.page.findUnique({
        where: { id: pageId },
        select: { isHomePage: true, projectId: true }
      });

      if (page?.isHomePage) {
        throw new Error('Нельзя удалить домашнюю страницу');
      }

      await prisma.page.delete({
        where: { id: pageId }
      });

      return { success: true };
    } catch (error) {
      console.error('Ошибка при удалении страницы:', error);
      throw error;
    }
  }

  /**
   * Дублирование страницы
   */
  async duplicate(pageId: string, newTitle?: string) {
    try {
      const originalPage = await prisma.page.findUnique({
        where: { id: pageId }
      });

      if (!originalPage) {
        throw new Error('Страница не найдена');
      }

      const duplicatedTitle = newTitle || `${originalPage.title} (копия)`;
      const duplicatedSlug = this.generateUniqueSlug(originalPage.slug + '-copy');

      const duplicatedPage = await prisma.page.create({
        data: {
          title: duplicatedTitle,
          slug: duplicatedSlug,
          content: originalPage.content,
          projectId: originalPage.projectId,
          isHomePage: false, // Копия не может быть домашней страницей
          metaTitle: originalPage.metaTitle,
          metaDescription: originalPage.metaDescription,
          status: 'DRAFT'
        },
        include: {
          project: {
            select: {
              id: true,
              name: true,
              slug: true
            }
          }
        }
      });

      return {
        id: duplicatedPage.id,
        title: duplicatedPage.title,
        slug: duplicatedPage.slug,
        isHomePage: duplicatedPage.isHomePage,
        status: duplicatedPage.status,
        metaTitle: duplicatedPage.metaTitle,
        metaDescription: duplicatedPage.metaDescription,
        content: duplicatedPage.content,
        projectId: duplicatedPage.projectId,
        project: duplicatedPage.project,
        createdAt: duplicatedPage.createdAt.toISOString(),
        updatedAt: duplicatedPage.updatedAt.toISOString()
      };
    } catch (error) {
      console.error('Ошибка при дублировании страницы:', error);
      throw new Error('Не удалось дублировать страницу');
    }
  }

  /**
   * Публикация страницы
   */
  async publish(pageId: string) {
    try {
      const page = await prisma.page.update({
        where: { id: pageId },
        data: {
          status: 'PUBLISHED',
          updatedAt: new Date()
        }
      });

      return {
        id: page.id,
        status: page.status,
        updatedAt: page.updatedAt.toISOString()
      };
    } catch (error) {
      console.error('Ошибка при публикации страницы:', error);
      throw new Error('Не удалось опубликовать страницу');
    }
  }

  /**
   * Снятие страницы с публикации
   */
  async unpublish(pageId: string) {
    try {
      const page = await prisma.page.update({
        where: { id: pageId },
        data: {
          status: 'DRAFT',
          updatedAt: new Date()
        }
      });

      return {
        id: page.id,
        status: page.status,
        updatedAt: page.updatedAt.toISOString()
      };
    } catch (error) {
      console.error('Ошибка при снятии страницы с публикации:', error);
      throw new Error('Не удалось снять страницу с публикации');
    }
  }

  /**
   * Генерация уникального slug
   */
  private generateUniqueSlug(baseSlug: string): string {
    return baseSlug
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '') + '-' + Date.now();
  }

  /**
   * Получение статистики страниц для проекта
   */
  async getStatistics(projectId: string) {
    try {
      const [totalPages, publishedPages, draftPages, homePageExists] = await Promise.all([
        prisma.page.count({ where: { projectId } }),
        prisma.page.count({ where: { projectId, status: 'PUBLISHED' } }),
        prisma.page.count({ where: { projectId, status: 'DRAFT' } }),
        prisma.page.findFirst({ where: { projectId, isHomePage: true } })
      ]);

      return {
        totalPages,
        publishedPages,
        draftPages,
        hasHomePage: !!homePageExists
      };
    } catch (error) {
      console.error('Ошибка при получении статистики страниц:', error);
      throw new Error('Не удалось получить статистику страниц');
    }
  }
}

export default new PageService();