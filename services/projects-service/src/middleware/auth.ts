import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { config } from '../config/environment.js';
import { projectsLogger } from '../utils/logger.js';

// Расширяем интерфейс Request для добавления пользователя
declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        username: string;
        email: string;
        role: string;
        iat?: number;
        exp?: number;
      };
    }
  }
}

/**
 * Middleware для проверки JWT токена
 */
export const authenticateToken = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

  if (!token) {
    projectsLogger.securityEvent('missing_token', {
      ip: req.ip,
      userAgent: req.get('User-Agent'),
      url: req.originalUrl
    });
    
    return res.status(401).json({
      error: 'Access denied',
      message: 'Токен доступа не предоставлен'
    });
  }

  try {
    const decoded = jwt.verify(token, config.getJwtSecret()) as any;
    req.user = decoded;
    
    projectsLogger.authAttempt(decoded.id, true, req.ip);
    next();
  } catch (error) {
    projectsLogger.securityEvent('invalid_token', {
      token: token.substring(0, 20) + '...',
      error: error instanceof Error ? error.message : 'Unknown error',
      ip: req.ip,
      userAgent: req.get('User-Agent')
    });

    return res.status(403).json({
      error: 'Access denied',
      message: 'Недействительный токен'
    });
  }
};

/**
 * Middleware для проверки роли пользователя
 */
export const requireRole = (roles: string | string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({
        error: 'Unauthorized',
        message: 'Пользователь не аутентифицирован'
      });
    }

    const userRole = req.user.role;
    const allowedRoles = Array.isArray(roles) ? roles : [roles];

    if (!allowedRoles.includes(userRole)) {
      projectsLogger.securityEvent('insufficient_permissions', {
        userId: req.user.id,
        userRole,
        requiredRoles: allowedRoles,
        url: req.originalUrl
      });

      return res.status(403).json({
        error: 'Forbidden',
        message: 'Недостаточно прав доступа'
      });
    }

    next();
  };
};

/**
 * Middleware для проверки владельца ресурса
 */
export const requireOwnership = (resourceUserIdField: string = 'ownerId') => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({
        error: 'Unauthorized',
        message: 'Пользователь не аутентифицирован'
      });
    }

    // Получаем ID ресурса из параметров или тела запроса
    const resourceOwnerId = req.body[resourceUserIdField] || req.params[resourceUserIdField];
    
    if (!resourceOwnerId) {
      return res.status(400).json({
        error: 'Bad Request',
        message: 'ID владельца ресурса не найден'
      });
    }

    // Администраторы могут получить доступ к любому ресурсу
    if (req.user.role === 'ADMIN') {
      return next();
    }

    // Проверяем что пользователь является владельцем ресурса
    if (req.user.id !== resourceOwnerId) {
      projectsLogger.securityEvent('unauthorized_access_attempt', {
        userId: req.user.id,
        resourceOwnerId,
        url: req.originalUrl,
        method: req.method
      });

      return res.status(403).json({
        error: 'Forbidden',
        message: 'Доступ запрещен: вы не являетесь владельцем этого ресурса'
      });
    }

    next();
  };
};

/**
 * Middleware для опциональной аутентификации
 */
export const optionalAuth = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return next();
  }

  try {
    const decoded = jwt.verify(token, config.getJwtSecret()) as any;
    req.user = decoded;
  } catch (error) {
    // Логируем ошибку, но продолжаем выполнение
    projectsLogger.debug('Optional auth failed', {
      error: error instanceof Error ? error.message : 'Unknown error',
      ip: req.ip
    });
  }

  next();
};

/**
 * Middleware для логирования API запросов
 */
export const logRequest = (req: Request, res: Response, next: NextFunction) => {
  const startTime = Date.now();
  
  res.on('finish', () => {
    const responseTime = Date.now() - startTime;
    
    projectsLogger.apiRequest(
      req.method,
      req.originalUrl,
      req.user?.id,
      responseTime
    );
  });

  next();
};

/**
 * Utility функция для генерации токена
 */
export const generateToken = (user: { id: string; username: string; email: string; role: string }) => {
  return jwt.sign(
    {
      id: user.id,
      username: user.username,
      email: user.email,
      role: user.role
    },
    config.getJwtSecret(),
    { expiresIn: '24h' }
  );
};

/**
 * Utility функция для проверки токена
 */
export const verifyToken = (token: string) => {
  try {
    return jwt.verify(token, config.getJwtSecret());
  } catch (error) {
    return null;
  }
};