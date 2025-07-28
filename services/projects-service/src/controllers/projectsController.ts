import { Request, Response } from 'express';
import { ProjectsService } from '../services/projectsService.js';
import { projectsLogger } from '../utils/logger.js';

export class ProjectsController {
  
  /**
   * Получить список проектов пользователя
   * GET /api/projects
   */
  static async getProjects(req: Request, res: Response) {
    try {
      if (!req.user) {
        return res.status(401).json({
          error: 'Unauthorized',
          message: 'Пользователь не аутентифицирован'
        });
      }

      const filters = {
        search: req.query.search as string,
        status: req.query.status as string,
        type: req.query.type as string,
        sortBy: req.query.sortBy as 'name' | 'updated' | 'created',
        sortOrder: req.query.sortOrder as 'asc' | 'desc',
        page: parseInt(req.query.page as string) || 1,
        limit: parseInt(req.query.limit as string) || 20
      };

      const result = await ProjectsService.getProjects(req.user.id, filters);

      res.json({
        success: true,
        data: result.projects,
        pagination: result.pagination
      });
    } catch (error) {
      projectsLogger.error('Error in getProjects controller', {
        userId: req.user?.id,
        query: req.query,
        error
      });

      res.status(500).json({
        error: 'Internal Server Error',
        message: 'Ошибка при получении списка проектов'
      });
    }
  }

  /**
   * Получить отдельный проект
   * GET /api/projects/:id
   */
  static async getProject(req: Request, res: Response) {
    try {
      if (!req.user) {
        return res.status(401).json({
          error: 'Unauthorized',
          message: 'Пользователь не аутентифицирован'
        });
      }

      const projectId = req.params.id;
      const project = await ProjectsService.getProject(projectId, req.user.id);

      if (!project) {
        return res.status(404).json({
          error: 'Not Found',
          message: 'Проект не найден'
        });
      }

      res.json({
        success: true,
        data: project
      });
    } catch (error) {
      projectsLogger.error('Error in getProject controller', {
        userId: req.user?.id,
        projectId: req.params.id,
        error
      });

      res.status(500).json({
        error: 'Internal Server Error',
        message: 'Ошибка при получении проекта'
      });
    }
  }

  /**
   * Создать новый проект
   * POST /api/projects
   */
  static async createProject(req: Request, res: Response) {
    try {
      if (!req.user) {
        return res.status(401).json({
          error: 'Unauthorized',
          message: 'Пользователь не аутентифицирован'
        });
      }

      const projectData = {
        ...req.body,
        ownerId: req.user.id
      };

      const project = await ProjectsService.createProject(projectData);

      res.status(201).json({
        success: true,
        data: project,
        message: 'Проект успешно создан'
      });
    } catch (error) {
      projectsLogger.error('Error in createProject controller', {
        userId: req.user?.id,
        data: req.body,
        error
      });

      if (error instanceof Error) {
        // Обрабатываем специфические ошибки
        if (error.message.includes('уже существует') || error.message.includes('уже занят')) {
          return res.status(409).json({
            error: 'Conflict',
            message: error.message
          });
        }
      }

      res.status(500).json({
        error: 'Internal Server Error',
        message: 'Ошибка при создании проекта'
      });
    }
  }

  /**
   * Обновить проект
   * PUT /api/projects/:id
   */
  static async updateProject(req: Request, res: Response) {
    try {
      if (!req.user) {
        return res.status(401).json({
          error: 'Unauthorized',
          message: 'Пользователь не аутентифицирован'
        });
      }

      const projectId = req.params.id;
      const updateData = req.body;

      const project = await ProjectsService.updateProject(projectId, req.user.id, updateData);

      if (!project) {
        return res.status(404).json({
          error: 'Not Found',
          message: 'Проект не найден или нет прав доступа'
        });
      }

      res.json({
        success: true,
        data: project,
        message: 'Проект успешно обновлен'
      });
    } catch (error) {
      projectsLogger.error('Error in updateProject controller', {
        userId: req.user?.id,
        projectId: req.params.id,
        data: req.body,
        error
      });

      if (error instanceof Error && error.message.includes('не найден')) {
        return res.status(404).json({
          error: 'Not Found',
          message: error.message
        });
      }

      res.status(500).json({
        error: 'Internal Server Error',
        message: 'Ошибка при обновлении проекта'
      });
    }
  }

  /**
   * Удалить проект
   * DELETE /api/projects/:id
   */
  static async deleteProject(req: Request, res: Response) {
    try {
      if (!req.user) {
        return res.status(401).json({
          error: 'Unauthorized',
          message: 'Пользователь не аутентифицирован'
        });
      }

      const projectId = req.params.id;
      const result = await ProjectsService.deleteProject(projectId, req.user.id);

      if (!result) {
        return res.status(404).json({
          error: 'Not Found',
          message: 'Проект не найден или нет прав доступа'
        });
      }

      res.json({
        success: true,
        message: 'Проект успешно удален'
      });
    } catch (error) {
      projectsLogger.error('Error in deleteProject controller', {
        userId: req.user?.id,
        projectId: req.params.id,
        error
      });

      if (error instanceof Error && error.message.includes('не найден')) {
        return res.status(404).json({
          error: 'Not Found',
          message: error.message
        });
      }

      res.status(500).json({
        error: 'Internal Server Error',
        message: 'Ошибка при удалении проекта'
      });
    }
  }

  /**
   * Опубликовать проект
   * PATCH /api/projects/:id/publish
   */
  static async publishProject(req: Request, res: Response) {
    try {
      if (!req.user) {
        return res.status(401).json({
          error: 'Unauthorized',
          message: 'Пользователь не аутентифицирован'
        });
      }

      const projectId = req.params.id;
      const result = await ProjectsService.publishProject(projectId, req.user.id);

      if (!result) {
        return res.status(404).json({
          error: 'Not Found',
          message: 'Проект не найден или нет прав доступа'
        });
      }

      res.json({
        success: true,
        message: 'Проект успешно опубликован'
      });
    } catch (error) {
      projectsLogger.error('Error in publishProject controller', {
        userId: req.user?.id,
        projectId: req.params.id,
        error
      });

      if (error instanceof Error && error.message.includes('не найден')) {
        return res.status(404).json({
          error: 'Not Found',
          message: error.message
        });
      }

      res.status(500).json({
        error: 'Internal Server Error',
        message: 'Ошибка при публикации проекта'
      });
    }
  }

  /**
   * Снять с публикации проект
   * PATCH /api/projects/:id/unpublish
   */
  static async unpublishProject(req: Request, res: Response) {
    try {
      if (!req.user) {
        return res.status(401).json({
          error: 'Unauthorized',
          message: 'Пользователь не аутентифицирован'
        });
      }

      const projectId = req.params.id;
      const result = await ProjectsService.unpublishProject(projectId, req.user.id);

      if (!result) {
        return res.status(404).json({
          error: 'Not Found',
          message: 'Проект не найден или нет прав доступа'
        });
      }

      res.json({
        success: true,
        message: 'Проект снят с публикации'
      });
    } catch (error) {
      projectsLogger.error('Error in unpublishProject controller', {
        userId: req.user?.id,
        projectId: req.params.id,
        error
      });

      if (error instanceof Error && error.message.includes('не найден')) {
        return res.status(404).json({
          error: 'Not Found',
          message: error.message
        });
      }

      res.status(500).json({
        error: 'Internal Server Error',
        message: 'Ошибка при снятии с публикации'
      });
    }
  }

  /**
   * Изменить статус проекта
   * PATCH /api/projects/:id/status
   */
  static async updateProjectStatus(req: Request, res: Response) {
    try {
      if (!req.user) {
        return res.status(401).json({
          error: 'Unauthorized',
          message: 'Пользователь не аутентифицирован'
        });
      }

      const projectId = req.params.id;
      const { status } = req.body;

      const result = await ProjectsService.updateProjectStatus(projectId, req.user.id, status);

      if (!result) {
        return res.status(404).json({
          error: 'Not Found',
          message: 'Проект не найден или нет прав доступа'
        });
      }

      res.json({
        success: true,
        message: 'Статус проекта успешно обновлен'
      });
    } catch (error) {
      projectsLogger.error('Error in updateProjectStatus controller', {
        userId: req.user?.id,
        projectId: req.params.id,
        status: req.body.status,
        error
      });

      if (error instanceof Error) {
        if (error.message.includes('не найден')) {
          return res.status(404).json({
            error: 'Not Found',
            message: error.message
          });
        }
        if (error.message.includes('Недопустимый статус')) {
          return res.status(400).json({
            error: 'Bad Request',
            message: error.message
          });
        }
      }

      res.status(500).json({
        error: 'Internal Server Error',
        message: 'Ошибка при обновлении статуса проекта'
      });
    }
  }

  /**
   * Проверить доступность слага
   * GET /api/projects/check-slug/:slug
   */
  static async checkSlugAvailability(req: Request, res: Response) {
    try {
      const slug = req.params.slug;
      const excludeProjectId = req.query.exclude as string;

      const isAvailable = await ProjectsService.checkSlugAvailability(slug, excludeProjectId);

      res.json({
        success: true,
        data: {
          slug,
          available: isAvailable
        }
      });
    } catch (error) {
      projectsLogger.error('Error in checkSlugAvailability controller', {
        slug: req.params.slug,
        exclude: req.query.exclude,
        error
      });

      res.status(500).json({
        error: 'Internal Server Error',
        message: 'Ошибка при проверке доступности слага'
      });
    }
  }

  /**
   * Проверить доступность домена
   * GET /api/projects/check-domain/:domain
   */
  static async checkDomainAvailability(req: Request, res: Response) {
    try {
      const domain = req.params.domain;
      const excludeProjectId = req.query.exclude as string;

      const isAvailable = await ProjectsService.checkDomainAvailability(domain, excludeProjectId);

      res.json({
        success: true,
        data: {
          domain,
          available: isAvailable
        }
      });
    } catch (error) {
      projectsLogger.error('Error in checkDomainAvailability controller', {
        domain: req.params.domain,
        exclude: req.query.exclude,
        error
      });

      res.status(500).json({
        error: 'Internal Server Error',
        message: 'Ошибка при проверке доступности домена'
      });
    }
  }
}

export default ProjectsController;