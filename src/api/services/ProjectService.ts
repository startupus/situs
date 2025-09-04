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
  type?: string;
  domain?: string;
  customDomain?: string;
  settings?: any;
  userId: string;
}

export interface UpdateProjectData {
  name?: string;
  description?: string;
  type?: string;
  domain?: string;
  customDomain?: string;
  settings?: any;
  status?: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED';
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
  async findMany(userId: string, filters?: ProjectFilters) {
    try {
      const whereClause: any = {
        userId: userId,
      };

      // Поиск по названию или описанию
      if (filters?.search) {
        whereClause.OR = [
          { name: { contains: filters.search, mode: 'insensitive' } },
          { description: { contains: filters.search, mode: 'insensitive' } },
        ];
      }

      // Фильтр по статусу
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
          case 'updated':
            orderBy = { updatedAt: sortOrder };
            break;
          case 'created':
            orderBy = { createdAt: sortOrder };
            break;
        }
      }

      const projects = await prisma.project.findMany({
        where: whereClause,
        select: {
          id: true,
          name: true,
          description: true,
          slug: true,
          /* type: true, */
          domain: true,
          customDomain: true,
          settings: true,
          status: true,
          isPublished: true,
          createdAt: true,
          updatedAt: true,
          _count: {
            select: {
              /* pages: true */
            } as any,
          },
        },
        orderBy,
      });

      return projects.map((project) => ({
        id: project.id,
        name: project.name,
        description: project.description,
        slug: project.slug,
        type: (project as any).type,
        domain: project.domain,
        customDomain: project.customDomain,
        settings: project.settings,
        status: project.status.toLowerCase(),
        isPublished: project.isPublished,
        createdAt: project.createdAt.toISOString(),
        updatedAt: project.updatedAt.toISOString(),
        pageCount: (project as any)._count?.pages || 0,
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
        select: {
          id: true,
          name: true,
          description: true,
          slug: true,
          /* type: true, */
          domain: true,
          customDomain: true,
          settings: true,
          status: true,
          isPublished: true,
          createdAt: true,
          updatedAt: true,
          owner: {
            select: {
              id: true,
              email: true,
              /* firstName: true, */
              /* lastName: true, */
            },
          },
          /* pages: {
            select: {
              id: true,
              title: true,
              slug: true,
              status: true,
              isPublished: true,
              createdAt: true,
            },
            orderBy: { updatedAt: 'desc' },
          }, */
        },
      });

      if (!project) {
        return null;
      }

      return {
        id: project.id,
        name: project.name,
        description: project.description,
        slug: project.slug,
        type: (project as any).type,
        domain: project.domain,
        customDomain: project.customDomain,
        settings: project.settings,
        status: project.status.toLowerCase(),
        isPublished: project.isPublished,
        createdAt: project.createdAt.toISOString(),
        updatedAt: project.updatedAt.toISOString(),
        owner: {
          id: (project as any).owner?.id,
          email: (project as any).owner?.email,
          firstName: (project as any).owner?.firstName,
          lastName: (project as any).owner?.lastName,
          fullName: this.getFullName((project as any).owner?.firstName, (project as any).owner?.lastName),
        },
        pages: (project as any).pages?.map((page) => ({
          id: page.id,
          title: page.title,
          slug: page.slug,
          status: page.status.toLowerCase(),
          isPublished: page.isPublished,
          createdAt: page.createdAt.toISOString(),
        })),
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

      // Проверяем уникальность slug для пользователя
      const existingProject = await prisma.project.findFirst({
        where: {
          slug,
          /* userId: (data as any).ownerId, */
        },
      });

      if (existingProject) {
        throw new Error('Проект с таким slug уже существует');
      }

      const project = await prisma.project.create({
        data: {
          name: data.name,
          description: data.description,
          slug,
          /* type: data.type || 'WEBSITE', */
          domain: data.domain,
          customDomain: data.customDomain,
          settings: data.settings || {},
          status: 'DRAFT' as any,
          isPublished: false,
          owner: { connect: { id: 'default-user' } },
          /* userId: (data as any).ownerId, */
        },
        select: {
          id: true,
          name: true,
          description: true,
          slug: true,
          /* type: true, */
          domain: true,
          customDomain: true,
          settings: true,
          status: true,
          isPublished: true,
          createdAt: true,
          updatedAt: true,
        },
      });

      return {
        id: project.id,
        name: project.name,
        description: project.description,
        slug: project.slug,
        type: (project as any).type,
        domain: project.domain,
        customDomain: project.customDomain,
        settings: project.settings,
        status: project.status.toLowerCase(),
        isPublished: project.isPublished,
        createdAt: project.createdAt.toISOString(),
        updatedAt: project.updatedAt.toISOString(),
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
      const updateData: any = {
        ...data,
        updatedAt: new Date(),
      };

      // Если изменяется название, генерируем новый slug
      if (data.name) {
        updateData.slug = this.generateSlug(data.name);
      }

      const project = await prisma.project.update({
        where: { id: projectId },
        data: updateData,
        select: {
          id: true,
          name: true,
          description: true,
          slug: true,
          /* type: true, */
          domain: true,
          customDomain: true,
          settings: true,
          status: true,
          isPublished: true,
          createdAt: true,
          updatedAt: true,
        },
      });

      return {
        id: project.id,
        name: project.name,
        description: project.description,
        slug: project.slug,
        type: (project as any).type,
        domain: project.domain,
        customDomain: project.customDomain,
        settings: project.settings,
        status: project.status.toLowerCase(),
        isPublished: project.isPublished,
        createdAt: project.createdAt.toISOString(),
        updatedAt: project.updatedAt.toISOString(),
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
        where: {
          /* projectId */
        } as any,
      });

      // Затем удаляем проект
      await prisma.project.delete({
        where: { id: projectId },
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
          status: 'PUBLISHED' as any,
          isPublished: true,
          updatedAt: new Date(),
        },
        select: {
          id: true,
          name: true,
          status: true,
          isPublished: true,
          updatedAt: true,
        },
      });

      return {
        id: project.id,
        name: project.name,
        status: project.status.toLowerCase(),
        isPublished: project.isPublished,
        updatedAt: project.updatedAt.toISOString(),
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
          status: 'DRAFT' as any,
          isPublished: false,
          owner: { connect: { id: 'default-user' } },
          updatedAt: new Date(),
        },
        select: {
          id: true,
          name: true,
          status: true,
          isPublished: true,
          updatedAt: true,
        },
      });

      return {
        id: project.id,
        name: project.name,
        status: project.status.toLowerCase(),
        isPublished: project.isPublished,
        updatedAt: project.updatedAt.toISOString(),
      };
    } catch (error) {
      console.error('Ошибка при снятии проекта с публикации:', error);
      throw new Error('Не удалось снять проект с публикации');
    }
  }

  /**
   * Получение статистики проектов пользователя
   */
  async getStatistics(userId: string) {
    try {
      const [totalProjects, publishedProjects, draftProjects, archivedProjects] = await Promise.all([
        prisma.project.count({
          where: {
            /* userId: userId */
          } as any,
        }),
        prisma.project.count({ where: { /* userId: userId, */ status: 'PUBLISHED' as any } as any }),
        prisma.project.count({ where: { /* userId: userId, */ status: 'DRAFT' as any } as any }),
        prisma.project.count({ where: { /* userId: userId, */ status: 'ARCHIVED' as any } }),
      ]);

      return {
        totalProjects,
        publishedProjects,
        draftProjects,
        archivedProjects,
      };
    } catch (error) {
      console.error('Ошибка при получении статистики проектов:', error);
      throw new Error('Не удалось получить статистику проектов');
    }
  }

  /**
   * Генерация slug из названия
   */
  private generateSlug(name: string): string {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
  }

  /**
   * Получение полного имени
   */
  private getFullName(firstName?: string | null, lastName?: string | null): string {
    const parts = [firstName, lastName].filter(Boolean);
    return parts.join(' ') || 'Без имени';
  }
}

export default new ProjectService();
