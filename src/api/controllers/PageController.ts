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
      const { search, status, projectId, language, isHomePage, sortBy, sortOrder } = req.query;

      const filters = {
        search: search as string,
        status: status as string,
        projectId: projectId as string,
        language: language as string,
        isHomePage: isHomePage === 'true' ? true : isHomePage === 'false' ? false : undefined,
        sortBy: sortBy as 'title' | 'updated' | 'created',
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
      const { userId } = req.user as any;

      const page = await PageService.findById(id);

      // Проверяем права доступа к проекту
      if (page.project.ownerId !== userId) {
        return res.status(403).json({
          error: {
            status: 403,
            name: 'ForbiddenError',
            message: 'Нет доступа к этой странице'
          }
        });
      }

      res.status(200).json({
        data: page
      });
    } catch (error) {
      console.error('Ошибка при получении страницы:', error);
      
      if (error.message === 'Страница не найдена') {
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
   * GET /api/projects/:projectId/pages/:slug
   * Получение страницы по slug в проекте
   */
  async findBySlug(req: Request, res: Response) {
    try {
      const { projectId, slug } = req.params;
      const { userId } = req.user as any;

      const page = await PageService.findBySlug(projectId, slug);

      // Проверяем права доступа к проекту
      if (page.project.ownerId !== userId) {
        return res.status(403).json({
          error: {
            status: 403,
            name: 'ForbiddenError',
            message: 'Нет доступа к этой странице'
          }
        });
      }

      res.status(200).json({
        data: page
      });
    } catch (error) {
      console.error('Ошибка при получении страницы по slug:', error);
      
      if (error.message === 'Страница не найдена') {
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
   * POST /api/pages
   * Создание новой страницы
   */
  async create(req: Request, res: Response) {
    try {
      const { userId } = req.user as any;
      const pageData = req.body;

      // Проверяем права доступа к проекту
      const ProjectService = (await import('../services/ProjectService')).default;
      const project = await ProjectService.findById(pageData.projectId);
      
      if (project.ownerId !== userId) {
        return res.status(403).json({
          error: {
            status: 403,
            name: 'ForbiddenError',
            message: 'Нет доступа к этому проекту'
          }
        });
      }

      // Генерируем slug если не передан
      if (!pageData.slug) {
        pageData.slug = await PageService.generateUniqueSlug(pageData.projectId, pageData.title);
      }

      const page = await PageService.create(pageData);

      res.status(201).json({
        data: page,
        meta: {
          message: 'Страница успешно создана'
        }
      });
    } catch (error) {
      console.error('Ошибка при создании страницы:', error);
      
      if (error.message.includes('уже существует') || error.message.includes('не найден')) {
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
      const { userId } = req.user as any;
      const updateData = req.body;

      // Проверяем права доступа
      const existingPage = await PageService.findById(id);
      if (existingPage.project.ownerId !== userId) {
        return res.status(403).json({
          error: {
            status: 403,
            name: 'ForbiddenError',
            message: 'Нет доступа к этой странице'
          }
        });
      }

      const page = await PageService.update(id, updateData);

      res.status(200).json({
        data: page,
        meta: {
          message: 'Страница успешно обновлена'
        }
      });
    } catch (error) {
      console.error('Ошибка при обновлении страницы:', error);
      
      if (error.message === 'Страница не найдена') {
        return res.status(404).json({
          error: {
            status: 404,
            name: 'NotFoundError',
            message: error.message
          }
        });
      }

      if (error.message.includes('уже существует')) {
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
   * DELETE /api/pages/:id
   * Удаление страницы
   */
  async delete(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { userId } = req.user as any;

      // Проверяем права доступа
      const existingPage = await PageService.findById(id);
      if (existingPage.project.ownerId !== userId) {
        return res.status(403).json({
          error: {
            status: 403,
            name: 'ForbiddenError',
            message: 'Нет доступа к этой странице'
          }
        });
      }

      const result = await PageService.delete(id);

      res.status(200).json({
        data: null,
        meta: {
          message: result.message
        }
      });
    } catch (error) {
      console.error('Ошибка при удалении страницы:', error);
      
      if (error.message === 'Страница не найдена') {
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
   * POST /api/pages/:id/duplicate
   * Дублирование страницы
   */
  async duplicate(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { userId } = req.user as any;
      const { title } = req.body;

      // Проверяем права доступа
      const existingPage = await PageService.findById(id);
      if (existingPage.project.ownerId !== userId) {
        return res.status(403).json({
          error: {
            status: 403,
            name: 'ForbiddenError',
            message: 'Нет доступа к этой странице'
          }
        });
      }

      const duplicatedPage = await PageService.duplicate(id, title);

      res.status(201).json({
        data: duplicatedPage,
        meta: {
          message: 'Страница успешно дублирована'
        }
      });
    } catch (error) {
      console.error('Ошибка при дублировании страницы:', error);
      
      if (error.message === 'Страница не найдена') {
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
      const { userId } = req.user as any;

      // Проверяем права доступа
      const existingPage = await PageService.findById(id);
      if (existingPage.project.ownerId !== userId) {
        return res.status(403).json({
          error: {
            status: 403,
            name: 'ForbiddenError',
            message: 'Нет доступа к этой странице'
          }
        });
      }

      const page = await PageService.publish(id);

      res.status(200).json({
        data: page,
        meta: {
          message: 'Страница успешно опубликована'
        }
      });
    } catch (error) {
      console.error('Ошибка при публикации страницы:', error);
      
      if (error.message === 'Страница не найдена') {
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
   * PUT /api/pages/:id/unpublish
   * Снятие страницы с публикации
   */
  async unpublish(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { userId } = req.user as any;

      // Проверяем права доступа
      const existingPage = await PageService.findById(id);
      if (existingPage.project.ownerId !== userId) {
        return res.status(403).json({
          error: {
            status: 403,
            name: 'ForbiddenError',
            message: 'Нет доступа к этой странице'
          }
        });
      }

      const page = await PageService.unpublish(id);

      res.status(200).json({
        data: page,
        meta: {
          message: 'Страница снята с публикации'
        }
      });
    } catch (error) {
      console.error('Ошибка при снятии страницы с публикации:', error);
      
      if (error.message === 'Страница не найдена') {
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
   * GET /api/projects/:projectId/pages/statistics
   * Получение статистики страниц для проекта
   */
  async getStatistics(req: Request, res: Response) {
    try {
      const { projectId } = req.params;
      const { userId } = req.user as any;

      // Проверяем права доступа к проекту
      const ProjectService = (await import('../services/ProjectService')).default;
      const project = await ProjectService.findById(projectId);
      
      if (project.ownerId !== userId) {
        return res.status(403).json({
          error: {
            status: 403,
            name: 'ForbiddenError',
            message: 'Нет доступа к этому проекту'
          }
        });
      }

      const statistics = await PageService.getStatistics(projectId);

      res.status(200).json({
        data: statistics
      });
    } catch (error) {
      console.error('Ошибка при получении статистики страниц:', error);
      
      if (error.message === 'Проект не найден') {
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
}

export default new PageController();
