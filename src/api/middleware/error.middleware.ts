import { Request, Response, NextFunction } from 'express';
import { Prisma } from '@prisma/client';

/**
 * Error Handler Middleware - Централизованная обработка ошибок
 * Основан на стандартах Strapi с детальным логированием
 */

// Интерфейс для стандартизированной ошибки API
interface ApiError extends Error {
  status?: number;
  code?: string;
  details?: any;
}

/**
 * Создание стандартизированной ошибки API
 */
export class AppError extends Error implements ApiError {
  public status: number;
  public code: string;
  public details?: any;
  public isOperational: boolean;

  constructor(message: string, status: number = 500, code?: string, details?: any) {
    super(message);
    this.name = this.constructor.name;
    this.status = status;
    this.code = code || 'INTERNAL_SERVER_ERROR';
    this.details = details;
    this.isOperational = true;

    Error.captureStackTrace(this, this.constructor);
  }
}

/**
 * Предустановленные типы ошибок
 */
export class ValidationError extends AppError {
  constructor(message: string = 'Ошибка валидации данных', details?: any) {
    super(message, 400, 'VALIDATION_ERROR', details);
  }
}

export class NotFoundError extends AppError {
  constructor(message: string = 'Ресурс не найден') {
    super(message, 404, 'NOT_FOUND');
  }
}

export class UnauthorizedError extends AppError {
  constructor(message: string = 'Требуется аутентификация') {
    super(message, 401, 'UNAUTHORIZED');
  }
}

export class ForbiddenError extends AppError {
  constructor(message: string = 'Недостаточно прав доступа') {
    super(message, 403, 'FORBIDDEN');
  }
}

export class ConflictError extends AppError {
  constructor(message: string = 'Конфликт данных') {
    super(message, 409, 'CONFLICT');
  }
}

/**
 * Middleware для обработки 404 ошибок
 */
export const notFoundHandler = (req: Request, res: Response, next: NextFunction) => {
  const error = new NotFoundError(`Маршрут ${req.method} ${req.path} не найден`);
  next(error);
};

/**
 * Преобразование Prisma ошибок в понятные пользователю сообщения
 */
const handlePrismaError = (error: Prisma.PrismaClientKnownRequestError): AppError => {
  switch (error.code) {
    case 'P2002':
      // Нарушение уникальности
      const field = (error.meta?.target as string[])?.join(', ') || 'поле';
      return new ConflictError(`Значение ${field} уже существует`);

    case 'P2025':
      // Запись не найдена
      return new NotFoundError('Запрашиваемая запись не найдена');

    case 'P2003':
      // Нарушение внешнего ключа
      return new ValidationError('Ссылка на несуществующую запись');

    case 'P2016':
      // Ошибка интерпретации запроса
      return new ValidationError('Некорректные параметры запроса');

    case 'P2021':
      // Таблица не существует
      return new AppError('Ошибка структуры базы данных', 500, 'DATABASE_ERROR');

    case 'P2022':
      // Колонка не существует
      return new AppError('Ошибка структуры базы данных', 500, 'DATABASE_ERROR');

    default:
      console.error('Необработанная Prisma ошибка:', error);
      return new AppError('Ошибка базы данных', 500, 'DATABASE_ERROR');
  }
};

/**
 * Преобразование JWT ошибок
 */
const handleJWTError = (error: Error): AppError => {
  if (error.name === 'JsonWebTokenError') {
    return new UnauthorizedError('Недействительный токен');
  }
  if (error.name === 'TokenExpiredError') {
    return new UnauthorizedError('Токен истек');
  }
  return new UnauthorizedError('Ошибка токена');
};

/**
 * Форматирование ошибки для отправки клиенту
 */
const formatErrorResponse = (error: ApiError, isDevelopment: boolean) => {
  const response: any = {
    error: {
      status: error.status || 500,
      name: error.code || error.name || 'InternalServerError',
      message: error.message || 'Внутренняя ошибка сервера'
    }
  };

  // Добавляем детали только в режиме разработки
  if (isDevelopment) {
    if (error.details) {
      response.error.details = error.details;
    }
    if (error.stack) {
      response.error.stack = error.stack;
    }
  }

  return response;
};

/**
 * Логирование ошибок
 */
const logError = (error: Error, req: Request) => {
  const logData = {
    timestamp: new Date().toISOString(),
    method: req.method,
    url: req.url,
    ip: req.ip,
    userAgent: req.get('User-Agent'),
    userId: req.user?.id,
    error: {
      name: error.name,
      message: error.message,
      stack: error.stack
    }
  };

  // В продакшене можно интегрировать с внешними сервисами логирования
  console.error('API Error:', JSON.stringify(logData, null, 2));
};

/**
 * Основной middleware для обработки ошибок
 */
export const errorHandler = (
  error: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // Логируем ошибку
  logError(error, req);

  let apiError: ApiError;

  // Определяем тип ошибки и преобразуем в ApiError
  if (error instanceof AppError) {
    apiError = error;
  } else if (error instanceof Prisma.PrismaClientKnownRequestError) {
    apiError = handlePrismaError(error);
  } else if (error.name === 'JsonWebTokenError' || error.name === 'TokenExpiredError') {
    apiError = handleJWTError(error);
  } else if (error.name === 'ValidationError') {
    apiError = new ValidationError(error.message);
  } else if (error.name === 'CastError') {
    apiError = new ValidationError('Некорректный формат ID');
  } else {
    // Неизвестная ошибка
    apiError = new AppError(
      process.env.NODE_ENV === 'production' 
        ? 'Внутренняя ошибка сервера'
        : error.message,
      500,
      'INTERNAL_SERVER_ERROR'
    );
  }

  // Определяем среду выполнения
  const isDevelopment = process.env.NODE_ENV !== 'production';

  // Форматируем ответ
  const response = formatErrorResponse(apiError, isDevelopment);

  // Отправляем ответ
  res.status(apiError.status || 500).json(response);
};

/**
 * Middleware для асинхронной обработки ошибок
 * Оборачивает асинхронные обработчики маршрутов
 */
export const asyncHandler = (fn: Function) => {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};

/**
 * Middleware для обработки необработанных Promise отклонений
 */
export const handleUncaughtExceptions = () => {
  process.on('uncaughtException', (error: Error) => {
    console.error('UNCAUGHT EXCEPTION! Shutting down...');
    console.error('Error:', error);
    process.exit(1);
  });

  process.on('unhandledRejection', (reason: any, promise: Promise<any>) => {
    console.error('UNHANDLED REJECTION! Shutting down...');
    console.error('Reason:', reason);
    console.error('Promise:', promise);
    process.exit(1);
  });
};

/**
 * Middleware для валидации Content-Type
 */
export const validateContentType = (req: Request, res: Response, next: NextFunction) => {
  if (['POST', 'PUT', 'PATCH'].includes(req.method)) {
    const contentType = req.get('Content-Type');
    
    if (!contentType || !contentType.includes('application/json')) {
      return next(new ValidationError('Content-Type должен быть application/json'));
    }
  }
  
  next();
};

/**
 * Middleware для ограничения размера запроса
 */
export const requestSizeLimit = (limit: string = '10mb') => {
  return (req: Request, res: Response, next: NextFunction) => {
    const contentLength = req.get('Content-Length');
    
    if (contentLength) {
      const sizeInMB = parseInt(contentLength) / (1024 * 1024);
      const limitInMB = parseInt(limit.replace('mb', ''));
      
      if (sizeInMB > limitInMB) {
        return next(new ValidationError(`Размер запроса превышает лимит ${limit}`));
      }
    }
    
    next();
  };
};