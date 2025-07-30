import { Request, Response } from 'express';
import PageService from '../services/PageService';

/**
 * PageController - REST API контроллер для управления страницами
 * Основан на архитектуре Strapi с стандартными CRUD операциями
 */

class PageController {
  /**
   * GET /api/pages
   * Получение всех страниц с фильтрацией
   */
  async find(req: Request, res: Response) {
    try {
      const { projectId, search, status, isHomePage, sortBy, sortOrder } = req.query;

      const filters = {
        projectId: projectId as string,
        search: search as string,
        status: status as string,
        isHomePage: isHomePage === 'true' ? true : isHomePage === 'false' ? false : undefined,
        sortBy: sortBy as 'title' | 'created' | 'updated',
        sortOrder: sortOrder as 'asc' | 'desc'
      };

      const pages = await PageService.findMany(filters);

      res.status(200).json({
        data: pages,
        meta: {
          total: pages.length
        }
      });
    } catch (error) {
      console.error('Ошибка при получении страниц:', error);
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
   * GET /api/pages/:id
   * Получение страницы по ID
   */
  async findOne(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const page = await PageService.findOne(id);

      if (!page) {
        return res.status(404).json({
          error: {
            status: 404,
            name: 'NotFoundError',
            message: 'Страница не найдена'
          }
        });
      }

      res.status(200).json({
        data: page
      });
    } catch (error) {
      console.error('Ошибка при получении страницы:', error);
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
   * GET /api/projects/:projectId/pages/:slug
   * Получение страницы по slug в проекте
   */
  async findBySlug(req: Request, res: Response) {
    try {
      const { projectId, slug } = req.params;
      const page = await PageService.findBySlug(projectId, slug);

      if (!page) {
        return res.status(404).json({
          error: {
            status: 404,
            name: 'NotFoundError',
            message: 'Страница не найдена'
          }
        });
      }

      res.status(200).json({
        data: page
      });
    } catch (error) {
      console.error('Ошибка при получении страницы по slug:', error);
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
   * POST /api/pages
   * Создание новой страницы
   */
  async create(req: Request, res: Response) {
    try {
      const { title, slug, content, projectId, isHomePage, metaTitle, metaDescription } = req.body;

      // Валидация обязательных полей
      if (!title || !slug || !projectId) {
        return res.status(400).json({
          error: {
            status: 400,
            name: 'ValidationError',
            message: 'Название, slug и ID проекта обязательны'
          }
        });
      }

      const pageData = {
        title,
        slug,
        content,
        projectId,
        isHomePage,
        metaTitle,
        metaDescription
      };

      const page = await PageService.create(pageData);

      res.status(201).json({
        data: page
      });
    } catch (error) {
      console.error('Ошибка при создании страницы:', error);
      
      if (error instanceof Error && 
          (error.message.includes('уже существует') || error.message.includes('не найден'))) {
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
   * PUT /api/pages/:id
   * Обновление страницы
   */
  async update(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { title, slug, content, isHomePage, metaTitle, metaDescription, status } = req.body;

      const updateData = {
        title,
        slug,
        content,
        isHomePage,
        metaTitle,
        metaDescription,
        status
      };

      const page = await PageService.update(id, updateData);

      res.status(200).json({
        data: page
      });
    } catch (error) {
      console.error('Ошибка при обновлении страницы:', error);
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
   * DELETE /api/pages/:id
   * Удаление страницы
   */
  async delete(req: Request, res: Response) {
    try {
      const { id } = req.params;
      await PageService.delete(id);

      res.status(200).json({
        data: { id }
      });
    } catch (error) {
      console.error('Ошибка при удалении страницы:', error);
      
      if (error instanceof Error && error.message.includes('домашнюю страницу')) {
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
   * POST /api/pages/:id/duplicate
   * Дублирование страницы
   */
  async duplicate(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { title } = req.body;

      const duplicatedPage = await PageService.duplicate(id, title);

      res.status(201).json({
        data: duplicatedPage
      });
    } catch (error) {
      console.error('Ошибка при дублировании страницы:', error);
      
      if (error instanceof Error && error.message.includes('не найдена')) {
        return res.status(404).json({
          error: {
            status: 404,
            name: 'NotFoundError',
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
   * PUT /api/pages/:id/publish
   * Публикация страницы
   */
  async publish(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const result = await PageService.publish(id);

      res.status(200).json({
        data: result
      });
    } catch (error) {
      console.error('Ошибка при публикации страницы:', error);
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
   * PUT /api/pages/:id/unpublish
   * Снятие страницы с публикации
   */
  async unpublish(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const result = await PageService.unpublish(id);

      res.status(200).json({
        data: result
      });
    } catch (error) {
      console.error('Ошибка при снятии страницы с публикации:', error);
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
   * GET /api/projects/:projectId/pages/statistics
   * Получение статистики страниц для проекта
   */
  async getStatistics(req: Request, res: Response) {
    try {
      const { projectId } = req.params;
      const statistics = await PageService.getStatistics(projectId);

      res.status(200).json({
        data: statistics
      });
    } catch (error) {
      console.error('Ошибка при получении статистики страниц:', error);
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

export default new PageController();