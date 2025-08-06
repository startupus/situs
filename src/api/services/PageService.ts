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
  metaKeywords?: string;
  template?: string;
  layout?: string;
  language?: string; // Добавляем поддержку языка
}

export interface UpdatePageData {
  title?: string;
  slug?: string;
  content?: any;
  isHomePage?: boolean;
  metaTitle?: string;
  metaDescription?: string;
  metaKeywords?: string;
  template?: string;
  layout?: string;
  status?: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED';
  language?: string;
}

export interface PageFilters {
  search?: string;
  status?: string;
  projectId?: string;
  language?: string;
  isHomePage?: boolean;
  sortBy?: 'title' | 'updated' | 'created';
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
      
      // Поиск по заголовку или slug
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
      
      // Фильтр по главной странице
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
          case 'updated':
            orderBy = { updatedAt: sortOrder };
            break;
          case 'created':
            orderBy = { createdAt: sortOrder };
            break;
        }
      }

      const pages = await prisma.page.findMany({
        where: whereClause,
        select: {
          id: true,
          title: true,
          slug: true,
          content: true,
          pageType: true,
          status: true,
          isHomePage: true,
          metaTitle: true,
          metaDescription: true,
          metaKeywords: true,
          template: true,
          layout: true,
          projectId: true,
          createdAt: true,
          updatedAt: true,
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

      return pages;
    } catch (error) {
      console.error('Ошибка при получении страниц:', error);
      throw new Error('Не удалось получить страницы');
    }
  }

  /**
   * Получение страницы по ID
   */
  async findById(id: string) {
    try {
      const page = await prisma.page.findUnique({
        where: { id },
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
        throw new Error('Страница не найдена');
      }

      return page;
    } catch (error) {
      console.error('Ошибка при получении страницы:', error);
      throw error;
    }
  }

  /**
   * Получение страницы по slug в рамках проекта
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
        throw new Error('Страница не найдена');
      }

      return page;
    } catch (error) {
      console.error('Ошибка при получении страницы по slug:', error);
      throw error;
    }
  }

  /**
   * Создание новой страницы
   */
  async create(data: CreatePageData) {
    try {
      // Проверяем, что проект существует
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

      const page = await prisma.page.create({
        data: {
          title: data.title,
          slug: data.slug,
          content: data.content || { blocks: [] },
          projectId: data.projectId,
          isHomePage: data.isHomePage || false,
          metaTitle: data.metaTitle,
          metaDescription: data.metaDescription,
          metaKeywords: data.metaKeywords,
          template: data.template,
          layout: data.layout,
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

      return page;
    } catch (error) {
      console.error('Ошибка при создании страницы:', error);
      throw error;
    }
  }

  /**
   * Обновление страницы
   */
  async update(id: string, data: UpdatePageData) {
    try {
      // Проверяем, что страница существует
      const existingPage = await prisma.page.findUnique({
        where: { id }
      });

      if (!existingPage) {
        throw new Error('Страница не найдена');
      }

      // Если обновляется slug, проверяем уникальность
      if (data.slug && data.slug !== existingPage.slug) {
        const slugExists = await prisma.page.findFirst({
          where: {
            projectId: existingPage.projectId,
            slug: data.slug,
            id: { not: id }
          }
        });

        if (slugExists) {
          throw new Error('Страница с таким slug уже существует в проекте');
        }
      }

      const page = await prisma.page.update({
        where: { id },
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

      return page;
    } catch (error) {
      console.error('Ошибка при обновлении страницы:', error);
      throw error;
    }
  }

  /**
   * Удаление страницы
   */
  async delete(id: string) {
    try {
      const page = await prisma.page.findUnique({
        where: { id }
      });

      if (!page) {
        throw new Error('Страница не найдена');
      }

      await prisma.page.delete({
        where: { id }
      });

      return { message: 'Страница успешно удалена' };
    } catch (error) {
      console.error('Ошибка при удалении страницы:', error);
      throw error;
    }
  }

  /**
   * Дублирование страницы
   */
  async duplicate(id: string, newTitle?: string) {
    try {
      const originalPage = await prisma.page.findUnique({
        where: { id }
      });

      if (!originalPage) {
        throw new Error('Страница не найдена');
      }

      // Генерируем новый slug
      const baseSlug = `${originalPage.slug}-copy`;
      let newSlug = baseSlug;
      let counter = 1;

      while (await this.slugExists(originalPage.projectId, newSlug)) {
        newSlug = `${baseSlug}-${counter}`;
        counter++;
      }

      const duplicatedPage = await prisma.page.create({
        data: {
          title: newTitle || `${originalPage.title} (копия)`,
          slug: newSlug,
          content: originalPage.content,
          projectId: originalPage.projectId,
          metaTitle: originalPage.metaTitle,
          metaDescription: originalPage.metaDescription,
          metaKeywords: originalPage.metaKeywords,
          template: originalPage.template,
          layout: originalPage.layout,
          isHomePage: false, // Копия не может быть главной страницей
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

      return duplicatedPage;
    } catch (error) {
      console.error('Ошибка при дублировании страницы:', error);
      throw error;
    }
  }

  /**
   * Публикация страницы
   */
  async publish(id: string) {
    try {
      const page = await prisma.page.update({
        where: { id },
        data: { 
          status: 'PUBLISHED',
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

      return page;
    } catch (error) {
      console.error('Ошибка при публикации страницы:', error);
      throw error;
    }
  }

  /**
   * Снятие страницы с публикации
   */
  async unpublish(id: string) {
    try {
      const page = await prisma.page.update({
        where: { id },
        data: { 
          status: 'DRAFT',
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

      return page;
    } catch (error) {
      console.error('Ошибка при снятии страницы с публикации:', error);
      throw error;
    }
  }

  /**
   * Получение статистики страниц для проекта
   */
  async getStatistics(projectId: string) {
    try {
      const stats = await prisma.page.groupBy({
        by: ['status'],
        where: { projectId },
        _count: {
          status: true
        }
      });

      const totalPages = await prisma.page.count({
        where: { projectId }
      });

      const homePageExists = await prisma.page.findFirst({
        where: { 
          projectId,
          isHomePage: true 
        }
      });

      return {
        total: totalPages,
        draft: stats.find(s => s.status === 'DRAFT')?._count.status || 0,
        published: stats.find(s => s.status === 'PUBLISHED')?._count.status || 0,
        archived: stats.find(s => s.status === 'ARCHIVED')?._count.status || 0,
        hasHomePage: !!homePageExists
      };
    } catch (error) {
      console.error('Ошибка при получении статистики страниц:', error);
      throw error;
    }
  }

  /**
   * Проверка существования slug в проекте
   */
  private async slugExists(projectId: string, slug: string): Promise<boolean> {
    const page = await prisma.page.findFirst({
      where: {
        projectId,
        slug
      }
    });
    return !!page;
  }

  /**
   * Генерация уникального slug
   */
  async generateUniqueSlug(projectId: string, title: string): Promise<string> {
    const baseSlug = title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();

    let slug = baseSlug;
    let counter = 1;

    while (await this.slugExists(projectId, slug)) {
      slug = `${baseSlug}-${counter}`;
      counter++;
    }

    return slug;
  }
}

export default new PageService();
