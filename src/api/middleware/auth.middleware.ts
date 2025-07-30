import { Request, Response, NextFunction } from 'express';
import UserService from '../services/UserService';

/**
 * Auth Middleware - Middleware для аутентификации и авторизации
 * Основан на JWT токенах с поддержкой ролей пользователей
 */

// Расширяем интерфейс Request для добавления информации о пользователе
declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        userId: string;
        email: string;
        firstName?: string;
        lastName?: string;
        fullName: string;
        role: string;
        isActive: boolean;
      };
    }
  }
}

/**
 * Middleware для проверки JWT токена
 */
export const authenticate = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization;

    // Проверяем наличие заголовка Authorization
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        error: {
          status: 401,
          name: 'UnauthorizedError',
          message: 'Токен доступа отсутствует'
        }
      });
    }

    // Извлекаем токен
    const token = authHeader.substring(7); // Убираем 'Bearer '

    // Проверяем токен через UserService
    const user = await UserService.verifyToken(token);

    if (!user) {
      return res.status(401).json({
        error: {
          status: 401,
          name: 'UnauthorizedError',
          message: 'Недействительный токен доступа'
        }
      });
    }

    // Добавляем информацию о пользователе в объект запроса
    req.user = {
      id: user.id,
      userId: user.id, // Дублируем для совместимости
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      fullName: user.fullName,
      role: user.role,
      isActive: user.isActive
    };

    next();
  } catch (error) {
    console.error('Ошибка при проверке токена:', error);
    return res.status(401).json({
      error: {
        status: 401,
        name: 'UnauthorizedError',
        message: 'Ошибка при проверке токена доступа'
      }
    });
  }
};

/**
 * Middleware для проверки ролей пользователя
 * @param allowedRoles - массив разрешенных ролей
 */
export const authorize = (allowedRoles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!req.user) {
        return res.status(401).json({
          error: {
            status: 401,
            name: 'UnauthorizedError',
            message: 'Пользователь не аутентифицирован'
          }
        });
      }

      // Проверяем роль пользователя
      const userRole = req.user.role.toUpperCase();
      const hasPermission = allowedRoles.some(role => role.toUpperCase() === userRole);

      if (!hasPermission) {
        return res.status(403).json({
          error: {
            status: 403,
            name: 'ForbiddenError',
            message: 'Недостаточно прав для выполнения операции'
          }
        });
      }

      next();
    } catch (error) {
      console.error('Ошибка при проверке прав:', error);
      return res.status(500).json({
        error: {
          status: 500,
          name: 'InternalServerError',
          message: 'Внутренняя ошибка сервера'
        }
      });
    }
  };
};

/**
 * Middleware для проверки, что пользователь может редактировать только свои ресурсы
 * @param resourceOwnerKey - ключ в параметрах запроса или body, содержащий ID владельца ресурса
 */
export const checkResourceOwnership = (resourceOwnerKey: string = 'userId') => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!req.user) {
        return res.status(401).json({
          error: {
            status: 401,
            name: 'UnauthorizedError',
            message: 'Пользователь не аутентифицирован'
          }
        });
      }

      // Админы могут редактировать любые ресурсы
      if (req.user.role.toUpperCase() === 'ADMIN') {
        return next();
      }

      // Получаем ID владельца ресурса из параметров или body
      const resourceOwnerId = req.params[resourceOwnerKey] || req.body[resourceOwnerKey];

      // Проверяем, что пользователь редактирует свой ресурс
      if (resourceOwnerId && resourceOwnerId !== req.user.id) {
        return res.status(403).json({
          error: {
            status: 403,
            name: 'ForbiddenError',
            message: 'Можно редактировать только свои ресурсы'
          }
        });
      }

      next();
    } catch (error) {
      console.error('Ошибка при проверке владения ресурсом:', error);
      return res.status(500).json({
        error: {
          status: 500,
          name: 'InternalServerError',
          message: 'Внутренняя ошибка сервера'
        }
      });
    }
  };
};

/**
 * Middleware для проверки активности пользователя
 */
export const checkUserActive = (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        error: {
          status: 401,
          name: 'UnauthorizedError',
          message: 'Пользователь не аутентифицирован'
        }
      });
    }

    if (!req.user.isActive) {
      return res.status(403).json({
        error: {
          status: 403,
          name: 'ForbiddenError',
          message: 'Аккаунт деактивирован'
        }
      });
    }

    next();
  } catch (error) {
    console.error('Ошибка при проверке активности пользователя:', error);
    return res.status(500).json({
      error: {
        status: 500,
        name: 'InternalServerError',
        message: 'Внутренняя ошибка сервера'
      }
    });
  }
};

/**
 * Middleware для опциональной аутентификации
 * Если токен предоставлен, проверяет его, но не требует обязательной аутентификации
 */
export const optionalAuth = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization;

    // Если заголовок отсутствует, просто продолжаем без аутентификации
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return next();
    }

    // Если заголовок присутствует, проверяем токен
    const token = authHeader.substring(7);
    const user = await UserService.verifyToken(token);

    if (user) {
      req.user = {
        id: user.id,
        userId: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        fullName: user.fullName,
        role: user.role,
        isActive: user.isActive
      };
    }

    next();
  } catch (error) {
    // В случае ошибки просто продолжаем без аутентификации
    console.warn('Предупреждение при опциональной аутентификации:', error);
    next();
  }
};

// Предустановленные комбинации middleware для удобства использования
export const requireAuth = [authenticate, checkUserActive];
export const requireAdmin = [authenticate, checkUserActive, authorize(['ADMIN'])];
export const requireAdminOrModerator = [authenticate, checkUserActive, authorize(['ADMIN', 'MODERATOR'])];
export const requireAuthWithOwnership = (resourceOwnerKey?: string) => [
  authenticate, 
  checkUserActive, 
  checkResourceOwnership(resourceOwnerKey)
];