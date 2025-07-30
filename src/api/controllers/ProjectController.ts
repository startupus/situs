import { Request, Response } from 'express';
import ProjectService from '../services/ProjectService';

/**
 * ProjectController - REST API контроллер для управления проектами
 * Основан на архитектуре Strapi с стандартными CRUD операциями
 */

class ProjectController {
  /**
   * GET /api/projects
   * Получение всех проектов пользователя с фильтрацией
   */
  async find(req: Request, res: Response) {
    try {
      const { userId } = req.user as any; // Предполагаем middleware для авторизации
      const { search, status, sortBy, sortOrder } = req.query;

      const filters = {
        search: search as string,
        status: status as string,
        sortBy: sortBy as 'name' | 'updated' | 'created',
        sortOrder: sortOrder as 'asc' | 'desc'
      };

      const projects = await ProjectService.findMany(userId, filters);

      res.status(200).json({
        data: projects,
        meta: {
          total: projects.length
        }
      });
    } catch (error) {
      console.error('Ошибка при получении проектов:', error);
      res.status(500).json({
        error: {
          status: 500,
          name: 'InternalServerError',
          message: 'Внутренняя ошибка сервера'
        }
      });
    }
  }

  /**
   * GET /api/projects/:id
   * Получение проекта по ID
   */
  async findOne(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const project = await ProjectService.findOne(id);

      if (!project) {
        return res.status(404).json({
          error: {
            status: 404,
            name: 'NotFoundError',
            message: 'Проект не найден'
          }
        });
      }

      res.status(200).json({
        data: project
      });
    } catch (error) {
      console.error('Ошибка при получении проекта:', error);
      res.status(500).json({
        error: {
          status: 500,
          name: 'InternalServerError',
          message: 'Внутренняя ошибка сервера'
        }
      });
    }
  }

  /**
   * POST /api/projects
   * Создание нового проекта
   */
  async create(req: Request, res: Response) {
    try {
      const { userId } = req.user as any;
      const { name, description, slug, type, domain, customDomain, settings } = req.body;

      // Валидация обязательных полей
      if (!name) {
        return res.status(400).json({
          error: {
            status: 400,
            name: 'ValidationError',
            message: 'Название проекта обязательно'
          }
        });
      }

      const projectData = {
        name,
        description,
        slug,
        type,
        domain,
        customDomain,
        settings,
        ownerId: userId
      };

      const project = await ProjectService.create(projectData);

      res.status(201).json({
        data: project
      });
    } catch (error) {
      console.error('Ошибка при создании проекта:', error);
      
      if (error instanceof Error && error.message.includes('уже существует')) {
        return res.status(400).json({
          error: {
            status: 400,
            name: 'ValidationError',
            message: error.message
          }
        });
      }

      res.status(500).json({
        error: {
          status: 500,
          name: 'InternalServerError',
          message: 'Внутренняя ошибка сервера'
        }
      });
    }
  }

  /**
   * PUT /api/projects/:id
   * Обновление проекта
   */
  async update(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { name, description, type, domain, customDomain, settings, status, isPublished } = req.body;

      const updateData = {
        name,
        description,
        type,
        domain,
        customDomain,
        settings,
        status,
        isPublished
      };

      const project = await ProjectService.update(id, updateData);

      res.status(200).json({
        data: project
      });
    } catch (error) {
      console.error('Ошибка при обновлении проекта:', error);
      res.status(500).json({
        error: {
          status: 500,
          name: 'InternalServerError',
          message: 'Внутренняя ошибка сервера'
        }
      });
    }
  }

  /**
   * DELETE /api/projects/:id
   * Удаление проекта
   */
  async delete(req: Request, res: Response) {
    try {
      const { id } = req.params;
      await ProjectService.delete(id);

      res.status(200).json({
        data: { id }
      });
    } catch (error) {
      console.error('Ошибка при удалении проекта:', error);
      res.status(500).json({
        error: {
          status: 500,
          name: 'InternalServerError',
          message: 'Внутренняя ошибка сервера'
        }
      });
    }
  }

  /**
   * PUT /api/projects/:id/publish
   * Публикация проекта
   */
  async publish(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const result = await ProjectService.publish(id);

      res.status(200).json({
        data: result
      });
    } catch (error) {
      console.error('Ошибка при публикации проекта:', error);
      res.status(500).json({
        error: {
          status: 500,
          name: 'InternalServerError',
          message: 'Внутренняя ошибка сервера'
        }
      });
    }
  }

  /**
   * PUT /api/projects/:id/unpublish
   * Снятие проекта с публикации
   */
  async unpublish(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const result = await ProjectService.unpublish(id);

      res.status(200).json({
        data: result
      });
    } catch (error) {
      console.error('Ошибка при снятии проекта с публикации:', error);
      res.status(500).json({
        error: {
          status: 500,
          name: 'InternalServerError',
          message: 'Внутренняя ошибка сервера'
        }
      });
    }
  }

  /**
   * GET /api/projects/statistics
   * Получение статистики проектов пользователя
   */
  async getStatistics(req: Request, res: Response) {
    try {
      const { userId } = req.user as any;
      const statistics = await ProjectService.getStatistics(userId);

      res.status(200).json({
        data: statistics
      });
    } catch (error) {
      console.error('Ошибка при получении статистики проектов:', error);
      res.status(500).json({
        error: {
          status: 500,
          name: 'InternalServerError',
          message: 'Внутренняя ошибка сервера'
        }
      });
    }
  }
}

export default new ProjectController();