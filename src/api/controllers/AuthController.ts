import { Request, Response } from 'express';
import UserService from '../services/UserService';

/**
 * AuthController - REST API контроллер для аутентификации
 * Основан на архитектуре Strapi с стандартными операциями авторизации
 */

class AuthController {
  /**
   * POST /api/auth/login
   * Авторизация пользователя
   */
  async login(req: Request, res: Response) {
    try {
      const { email, password } = req.body;

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

      const result = await UserService.login({ email, password });

      res.status(200).json({
        jwt: result.token,
        user: result.user
      });
    } catch (error) {
      console.error('Ошибка при авторизации:', error);
      
      if (error instanceof Error && 
          (error.message.includes('Неверный') || error.message.includes('деактивирован'))) {
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
   * POST /api/auth/register
   * Регистрация нового пользователя
   */
  async register(req: Request, res: Response) {
    try {
      const { email, password, firstName, lastName } = req.body;

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

      // Простая валидация email
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        return res.status(400).json({
          error: {
            status: 400,
            name: 'ValidationError',
            message: 'Некорректный формат email'
          }
        });
      }

      // Валидация пароля
      if (password.length < 6) {
        return res.status(400).json({
          error: {
            status: 400,
            name: 'ValidationError',
            message: 'Пароль должен содержать минимум 6 символов'
          }
        });
      }

      const result = await UserService.register({
        email,
        password,
        firstName,
        lastName
      });

      res.status(201).json({
        jwt: result.token,
        user: result.user
      });
    } catch (error) {
      console.error('Ошибка при регистрации:', error);
      
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
   * POST /api/auth/verify-token
   * Проверка валидности JWT токена
   */
  async verifyToken(req: Request, res: Response) {
    try {
      const authHeader = req.headers.authorization;
      
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({
          error: {
            status: 401,
            name: 'UnauthorizedError',
            message: 'Токен не предоставлен'
          }
        });
      }

      const token = authHeader.substring(7); // Убираем 'Bearer '
      const user = await UserService.verifyToken(token);

      if (!user) {
        return res.status(401).json({
          error: {
            status: 401,
            name: 'UnauthorizedError',
            message: 'Недействительный токен'
          }
        });
      }

      res.status(200).json({
        user,
        valid: true
      });
    } catch (error) {
      console.error('Ошибка при проверке токена:', error);
      res.status(401).json({
        error: {
          status: 401,
          name: 'UnauthorizedError',
          message: 'Недействительный токен'
        }
      });
    }
  }

  /**
   * POST /api/auth/refresh-token
   * Обновление JWT токена
   */
  async refreshToken(req: Request, res: Response) {
    try {
      const authHeader = req.headers.authorization;
      
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({
          error: {
            status: 401,
            name: 'UnauthorizedError',
            message: 'Токен не предоставлен'
          }
        });
      }

      const token = authHeader.substring(7);
      const user = await UserService.verifyToken(token);

      if (!user) {
        return res.status(401).json({
          error: {
            status: 401,
            name: 'UnauthorizedError',
            message: 'Недействительный токен'
          }
        });
      }

      // Генерируем новый токен
      const newToken = (UserService as any).generateToken(user.id);

      res.status(200).json({
        jwt: newToken,
        user
      });
    } catch (error) {
      console.error('Ошибка при обновлении токена:', error);
      res.status(401).json({
        error: {
          status: 401,
          name: 'UnauthorizedError',
          message: 'Недействительный токен'
        }
      });
    }
  }

  /**
   * POST /api/auth/logout
   * Выход из системы (в текущей реализации просто подтверждение)
   */
  async logout(req: Request, res: Response) {
    try {
      // В JWT-based системе токен просто удаляется на клиенте
      // Здесь можно добавить логику для blacklist токенов если потребуется
      
      res.status(200).json({
        message: 'Выход выполнен успешно'
      });
    } catch (error) {
      console.error('Ошибка при выходе:', error);
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
   * POST /api/auth/forgot-password
   * Восстановление пароля (заглушка для будущей реализации)
   */
  async forgotPassword(req: Request, res: Response) {
    try {
      const { email } = req.body;

      if (!email) {
        return res.status(400).json({
          error: {
            status: 400,
            name: 'ValidationError',
            message: 'Email обязателен'
          }
        });
      }

      // Проверяем существование пользователя
      const user = await UserService.findByEmail(email);
      
      if (!user) {
        // Не сообщаем о том, что пользователь не найден по соображениям безопасности
        return res.status(200).json({
          message: 'Если пользователь с таким email существует, на него будет отправлено письмо с инструкциями'
        });
      }

      // TODO: Реализовать отправку email с токеном сброса пароля
      // В текущей версии просто возвращаем успешный ответ
      
      res.status(200).json({
        message: 'Если пользователь с таким email существует, на него будет отправлено письмо с инструкциями'
      });
    } catch (error) {
      console.error('Ошибка при восстановлении пароля:', error);
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
   * POST /api/auth/reset-password
   * Сброс пароля (заглушка для будущей реализации)
   */
  async resetPassword(req: Request, res: Response) {
    try {
      const { token, newPassword } = req.body;

      if (!token || !newPassword) {
        return res.status(400).json({
          error: {
            status: 400,
            name: 'ValidationError',
            message: 'Токен и новый пароль обязательны'
          }
        });
      }

      if (newPassword.length < 6) {
        return res.status(400).json({
          error: {
            status: 400,
            name: 'ValidationError',
            message: 'Пароль должен содержать минимум 6 символов'
          }
        });
      }

      // TODO: Реализовать проверку токена сброса пароля и обновление пароля
      // В текущей версии возвращаем ошибку что функция не реализована
      
      res.status(501).json({
        error: {
          status: 501,
          name: 'NotImplementedError',
          message: 'Функция сброса пароля пока не реализована'
        }
      });
    } catch (error) {
      console.error('Ошибка при сбросе пароля:', error);
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

export default new AuthController(); 