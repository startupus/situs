import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

/**
 * ProjectService - Модульный сервис для работы с проектами
 * Основан на архитектуре Strapi с разделением ответственности
 */

export interface CreateProjectData {
  name: string;
  description?: string;
  slug?: string;
  type?: 'WEBSITE' | 'ECOMMERCE' | 'LANDING' | 'BLOG' | 'APP';
  domain?: string;
  customDomain?: string;
  settings?: {
    theme?: 'light' | 'dark' | 'auto';
    language?: 'ru' | 'en';
    creationType?: 'manual' | 'ai';
  };
  ownerId: string;
}

export interface UpdateProjectData {
  name?: string;
  description?: string;
  type?: 'WEBSITE' | 'ECOMMERCE' | 'LANDING' | 'BLOG' | 'APP';
  domain?: string;
  customDomain?: string;
  settings?: any;
  status?: string;
  isPublished?: boolean;
}

export interface ProjectFilters {
  search?: string;
  status?: string;
  sortBy?: 'name' | 'updated' | 'created';
  sortOrder?: 'asc' | 'desc';
}

class ProjectService {
  /**
   * Получение всех проектов пользователя с фильтрацией
   */
  async findMany(ownerId: string, filters?: ProjectFilters) {
    try {
      const whereClause: any = { ownerId };
      
      // Добавляем поиск
      if (filters?.search) {
        whereClause.OR = [
          { name: { contains: filters.search, mode: 'insensitive' } },
          { description: { contains: filters.search, mode: 'insensitive' } }
        ];
      }
      
      // Добавляем фильтр по статусу
      if (filters?.status) {
        whereClause.status = filters.status.toUpperCase();
      }
      
      // Определяем сортировку
      let orderBy: any = { updatedAt: 'desc' };
      if (filters?.sortBy) {
        const sortOrder = filters.sortOrder || 'desc';
        switch (filters.sortBy) {
          case 'name':
            orderBy = { name: sortOrder };
            break;
          case 'created':
            orderBy = { createdAt: sortOrder };
            break;
          case 'updated':
            orderBy = { updatedAt: sortOrder };
            break;
        }
      }

      const projects = await prisma.project.findMany({
        where: whereClause,
        include: {
          pages: {
            orderBy: { createdAt: 'desc' }
          },
          _count: {
            select: { pages: true }
          }
        },
        orderBy
      });

      return projects.map(project => ({
        id: project.id,
        name: project.name,
        description: project.description,
        slug: project.slug,
        type: project.type.toLowerCase(),
        status: project.status,
        domain: project.domain,
        customDomain: project.customDomain,
        isPublished: project.isPublished,
        settings: project.settings,
        createdAt: project.createdAt.toISOString(),
        updatedAt: project.updatedAt.toISOString(),
        pages: project.pages.map(page => ({
          id: page.id,
          title: page.title,
          slug: page.slug,
          isHomePage: page.isHomePage,
          status: page.status,
          createdAt: page.createdAt.toISOString(),
          updatedAt: page.updatedAt.toISOString()
        })),
        pageCount: project._count.pages
      }));
    } catch (error) {
      console.error('Ошибка при получении проектов:', error);
      throw new Error('Не удалось получить проекты');
    }
  }

  /**
   * Получение проекта по ID
   */
  async findOne(projectId: string) {
    try {
      const project = await prisma.project.findUnique({
        where: { id: projectId },
        include: {
          pages: {
            orderBy: { createdAt: 'desc' }
          },
          _count: {
            select: { pages: true }
          }
        }
      });

      if (!project) {
        return null;
      }

      return {
        id: project.id,
        name: project.name,
        description: project.description,
        slug: project.slug,
        type: project.type.toLowerCase(),
        status: project.status,
        domain: project.domain,
        customDomain: project.customDomain,
        isPublished: project.isPublished,
        settings: project.settings,
        createdAt: project.createdAt.toISOString(),
        updatedAt: project.updatedAt.toISOString(),
        pages: project.pages.map(page => ({
          id: page.id,
          title: page.title,
          slug: page.slug,
          isHomePage: page.isHomePage,
          status: page.status,
          metaTitle: page.metaTitle,
          metaDescription: page.metaDescription,
          content: page.content,
          createdAt: page.createdAt.toISOString(),
          updatedAt: page.updatedAt.toISOString()
        })),
        pageCount: project._count.pages
      };
    } catch (error) {
      console.error('Ошибка при получении проекта:', error);
      return null;
    }
  }

  /**
   * Создание нового проекта
   */
  async create(data: CreateProjectData) {
    try {
      // Генерируем slug если не предоставлен
      const slug = data.slug || this.generateSlug(data.name);
      
      // Проверяем уникальность slug
      const existingProject = await prisma.project.findUnique({
        where: { slug }
      });
      
      if (existingProject) {
        throw new Error('Проект с таким названием уже существует');
      }
      
      // Создаем проект
      const project = await prisma.project.create({
        data: {
          name: data.name,
          description: data.description,
          slug,
          type: data.type || 'WEBSITE',
          domain: data.domain,
          customDomain: data.customDomain,
          ownerId: data.ownerId,
          status: 'DRAFT',
          settings: data.settings || {
            theme: 'auto',
            language: 'ru',
            creationType: 'manual'
          }
        },
        include: {
          pages: true
        }
      });

      // Создаем домашнюю страницу автоматически
      await prisma.page.create({
        data: {
          title: 'Главная',
          slug: '/',
          projectId: project.id,
          isHomePage: true,
          status: 'DRAFT',
          content: {
            blocks: [
              {
                type: 'heading',
                data: {
                  text: `Добро пожаловать на ${data.name}`,
                  level: 1
                }
              },
              {
                type: 'paragraph',
                data: {
                  text: 'Это ваша новая домашняя страница. Начните редактирование!'
                }
              }
            ]
          }
        }
      });

      return {
        id: project.id,
        name: project.name,
        description: project.description,
        slug: project.slug,
        type: project.type.toLowerCase(),
        status: project.status,
        domain: project.domain,
        customDomain: project.customDomain,
        isPublished: project.isPublished,
        settings: project.settings,
        createdAt: project.createdAt.toISOString(),
        updatedAt: project.updatedAt.toISOString()
      };
    } catch (error) {
      console.error('Ошибка при создании проекта:', error);
      throw error;
    }
  }

  /**
   * Обновление проекта
   */
  async update(projectId: string, data: UpdateProjectData) {
    try {
      const project = await prisma.project.update({
        where: { id: projectId },
        data: {
          ...data,
          updatedAt: new Date()
        }
      });

      return {
        id: project.id,
        name: project.name,
        description: project.description,
        slug: project.slug,
        type: project.type.toLowerCase(),
        status: project.status,
        domain: project.domain,
        customDomain: project.customDomain,
        isPublished: project.isPublished,
        settings: project.settings,
        createdAt: project.createdAt.toISOString(),
        updatedAt: project.updatedAt.toISOString()
      };
    } catch (error) {
      console.error('Ошибка при обновлении проекта:', error);
      throw new Error('Не удалось обновить проект');
    }
  }

  /**
   * Удаление проекта
   */
  async delete(projectId: string) {
    try {
      // Сначала удаляем все страницы проекта
      await prisma.page.deleteMany({
        where: { projectId }
      });

      // Затем удаляем сам проект
      await prisma.project.delete({
        where: { id: projectId }
      });

      return { success: true };
    } catch (error) {
      console.error('Ошибка при удалении проекта:', error);
      throw new Error('Не удалось удалить проект');
    }
  }

  /**
   * Публикация проекта
   */
  async publish(projectId: string) {
    try {
      const project = await prisma.project.update({
        where: { id: projectId },
        data: {
          isPublished: true,
          status: 'PUBLISHED',
          updatedAt: new Date()
        }
      });

      return {
        id: project.id,
        isPublished: project.isPublished,
        status: project.status
      };
    } catch (error) {
      console.error('Ошибка при публикации проекта:', error);
      throw new Error('Не удалось опубликовать проект');
    }
  }

  /**
   * Снятие проекта с публикации
   */
  async unpublish(projectId: string) {
    try {
      const project = await prisma.project.update({
        where: { id: projectId },
        data: {
          isPublished: false,
          status: 'DRAFT',
          updatedAt: new Date()
        }
      });

      return {
        id: project.id,
        isPublished: project.isPublished,
        status: project.status
      };
    } catch (error) {
      console.error('Ошибка при снятии проекта с публикации:', error);
      throw new Error('Не удалось снять проект с публикации');
    }
  }

  /**
   * Генерация уникального slug из названия
   */
  private generateSlug(name: string): string {
    return name
      .toLowerCase()
      .replace(/[^\w\s-]/g, '') // Удаляем специальные символы
      .replace(/[\s_-]+/g, '-') // Заменяем пробелы и подчеркивания на дефисы
      .replace(/^-+|-+$/g, ''); // Удаляем дефисы в начале и конце
  }

  /**
   * Получение статистики проектов пользователя
   */
  async getStatistics(ownerId: string) {
    try {
      const [totalProjects, publishedProjects, draftProjects, totalPages] = await Promise.all([
        prisma.project.count({ where: { ownerId } }),
        prisma.project.count({ where: { ownerId, isPublished: true } }),
        prisma.project.count({ where: { ownerId, status: 'DRAFT' } }),
        prisma.page.count({
          where: {
            project: { ownerId }
          }
        })
      ]);

      return {
        totalProjects,
        publishedProjects,
        draftProjects,
        totalPages,
        averagePagesPerProject: totalProjects > 0 ? Math.round(totalPages / totalProjects) : 0
      };
    } catch (error) {
      console.error('Ошибка при получении статистики:', error);
      throw new Error('Не удалось получить статистику');
    }
  }
}

export default new ProjectService();