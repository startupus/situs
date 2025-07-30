import { Request, Response } from 'express';
import UserService from '../services/UserService';

/**
 * UserController - REST API контроллер для управления пользователями
 * Основан на архитектуре Strapi с стандартными CRUD операциями
 */

class UserController {
  /**
   * GET /api/users
   * Получение всех пользователей с фильтрацией (только для админов)
   */
  async find(req: Request, res: Response) {
    try {
      const { search, role, isActive, sortBy, sortOrder } = req.query;

      const filters = {
        search: search as string,
        role: role as string,
        isActive: isActive === 'true' ? true : isActive === 'false' ? false : undefined,
        sortBy: sortBy as 'email' | 'firstName' | 'created' | 'lastLogin',
        sortOrder: sortOrder as 'asc' | 'desc'
      };

      const users = await UserService.findMany(filters);

      res.status(200).json({
        data: users,
        meta: {
          total: users.length
        }
      });
    } catch (error) {
      console.error('Ошибка при получении пользователей:', error);
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
   * GET /api/users/:id
   * Получение пользователя по ID
   */
  async findOne(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const user = await UserService.findOne(id);

      if (!user) {
        return res.status(404).json({
          error: {
            status: 404,
            name: 'NotFoundError',
            message: 'Пользователь не найден'
          }
        });
      }

      res.status(200).json({
        data: user
      });
    } catch (error) {
      console.error('Ошибка при получении пользователя:', error);
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
   * GET /api/users/me
   * Получение профиля текущего пользователя
   */
  async me(req: Request, res: Response) {
    try {
      const { userId } = req.user as any;
      const user = await UserService.findOne(userId);

      if (!user) {
        return res.status(404).json({
          error: {
            status: 404,
            name: 'NotFoundError',
            message: 'Пользователь не найден'
          }
        });
      }

      res.status(200).json({
        data: user
      });
    } catch (error) {
      console.error('Ошибка при получении профиля:', error);
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
   * POST /api/users
   * Создание нового пользователя (только для админов)
   */
  async create(req: Request, res: Response) {
    try {
      const { email, password, firstName, lastName, role, isActive } = req.body;

      // Валидация обязательных полей
      if (!email || !password) {
        return res.status(400).json({
          error: {
            status: 400,
            name: 'ValidationError',
            message: 'Email и пароль обязательны'
          }
        });
      }

      const userData = {
        email,
        password,
        firstName,
        lastName,
        role,
        isActive
      };

      const user = await UserService.create(userData);

      res.status(201).json({
        data: user
      });
    } catch (error) {
      console.error('Ошибка при создании пользователя:', error);
      
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
   * PUT /api/users/:id
   * Обновление пользователя
   */
  async update(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { email, firstName, lastName, role, isActive } = req.body;

      const updateData = {
        email,
        firstName,
        lastName,
        role,
        isActive
      };

      const user = await UserService.update(id, updateData);

      res.status(200).json({
        data: user
      });
    } catch (error) {
      console.error('Ошибка при обновлении пользователя:', error);
      
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
   * PUT /api/users/me
   * Обновление профиля текущего пользователя
   */
  async updateMe(req: Request, res: Response) {
    try {
      const { userId } = req.user as any;
      const { email, firstName, lastName } = req.body;

      const updateData = {
        email,
        firstName,
        lastName
      };

      const user = await UserService.update(userId, updateData);

      res.status(200).json({
        data: user
      });
    } catch (error) {
      console.error('Ошибка при обновлении профиля:', error);
      
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
   * PUT /api/users/change-password
   * Изменение пароля текущего пользователя
   */
  async changePassword(req: Request, res: Response) {
    try {
      const { userId } = req.user as any;
      const { currentPassword, newPassword } = req.body;

      // Валидация обязательных полей
      if (!currentPassword || !newPassword) {
        return res.status(400).json({
          error: {
            status: 400,
            name: 'ValidationError',
            message: 'Текущий пароль и новый пароль обязательны'
          }
        });
      }

      await UserService.changePassword(userId, currentPassword, newPassword);

      res.status(200).json({
        data: { success: true }
      });
    } catch (error) {
      console.error('Ошибка при изменении пароля:', error);
      
      if (error instanceof Error && error.message.includes('Неверный')) {
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
   * PUT /api/users/:id/deactivate
   * Деактивация пользователя (только для админов)
   */
  async deactivate(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const result = await UserService.deactivate(id);

      res.status(200).json({
        data: result
      });
    } catch (error) {
      console.error('Ошибка при деактивации пользователя:', error);
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
   * PUT /api/users/:id/activate
   * Активация пользователя (только для админов)
   */
  async activate(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const result = await UserService.activate(id);

      res.status(200).json({
        data: result
      });
    } catch (error) {
      console.error('Ошибка при активации пользователя:', error);
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
   * DELETE /api/users/:id
   * Удаление пользователя (только для админов)
   */
  async delete(req: Request, res: Response) {
    try {
      const { id } = req.params;
      await UserService.delete(id);

      res.status(200).json({
        data: { id }
      });
    } catch (error) {
      console.error('Ошибка при удалении пользователя:', error);
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
   * GET /api/users/statistics
   * Получение статистики пользователей (только для админов)
   */
  async getStatistics(req: Request, res: Response) {
    try {
      const statistics = await UserService.getStatistics();

      res.status(200).json({
        data: statistics
      });
    } catch (error) {
      console.error('Ошибка при получении статистики пользователей:', error);
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

export default new UserController();