import { Request, Response, NextFunction } from 'express';
import { z, ZodError } from 'zod';
import { ValidationError } from './error.middleware';

/**
 * Validation Middleware - Middleware для валидации данных с использованием Zod
 * Обеспечивает строгую проверку входящих данных
 */

// Тип для определения источника данных для валидации
type ValidationSource = 'body' | 'query' | 'params' | 'headers';

/**
 * Создает middleware для валидации данных
 * @param schema - Zod схема для валидации
 * @param source - источник данных (body, query, params, headers)
 */
export const validate = (schema: z.ZodSchema, source: ValidationSource = 'body') => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      let dataToValidate;

      // Выбираем источник данных для валидации
      switch (source) {
        case 'body':
          dataToValidate = req.body;
          break;
        case 'query':
          dataToValidate = req.query;
          break;
        case 'params':
          dataToValidate = req.params;
          break;
        case 'headers':
          dataToValidate = req.headers;
          break;
        default:
          dataToValidate = req.body;
      }

      // Валидируем данные
      const validatedData = schema.parse(dataToValidate);

      // Заменяем оригинальные данные на валидированные (с трансформациями)
      switch (source) {
        case 'body':
          req.body = validatedData;
          break;
        case 'query':
          req.query = validatedData;
          break;
        case 'params':
          req.params = validatedData;
          break;
        case 'headers':
          req.headers = validatedData;
          break;
      }

      next();
    } catch (error) {
      if (error instanceof ZodError) {
        // Форматируем ошибки Zod в читаемый вид
        const formattedErrors = error.errors.map(err => ({
          field: err.path.join('.'),
          message: err.message,
          value: err.input
        }));

        const validationError = new ValidationError(
          'Ошибка валидации данных',
          {
            source,
            errors: formattedErrors
          }
        );

        return next(validationError);
      }

      // Неожиданная ошибка
      next(error);
    }
  };
};

/**
 * Middleware для валидации тела запроса
 */
export const validateBody = (schema: z.ZodSchema) => validate(schema, 'body');

/**
 * Middleware для валидации параметров запроса
 */
export const validateQuery = (schema: z.ZodSchema) => validate(schema, 'query');

/**
 * Middleware для валидации параметров URL
 */
export const validateParams = (schema: z.ZodSchema) => validate(schema, 'params');

/**
 * Middleware для валидации заголовков
 */
export const validateHeaders = (schema: z.ZodSchema) => validate(schema, 'headers');

/**
 * Комбинированная валидация нескольких источников данных
 */
export const validateMultiple = (schemas: {
  body?: z.ZodSchema;
  query?: z.ZodSchema;
  params?: z.ZodSchema;
  headers?: z.ZodSchema;
}) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      const errors: any[] = [];

      // Валидируем каждый источник данных если схема предоставлена
      if (schemas.body) {
        try {
          req.body = schemas.body.parse(req.body);
        } catch (error) {
          if (error instanceof ZodError) {
            error.errors.forEach(err => {
              errors.push({
                source: 'body',
                field: err.path.join('.'),
                message: err.message,
                value: err.input
              });
            });
          }
        }
      }

      if (schemas.query) {
        try {
          req.query = schemas.query.parse(req.query);
        } catch (error) {
          if (error instanceof ZodError) {
            error.errors.forEach(err => {
              errors.push({
                source: 'query',
                field: err.path.join('.'),
                message: err.message,
                value: err.input
              });
            });
          }
        }
      }

      if (schemas.params) {
        try {
          req.params = schemas.params.parse(req.params);
        } catch (error) {
          if (error instanceof ZodError) {
            error.errors.forEach(err => {
              errors.push({
                source: 'params',
                field: err.path.join('.'),
                message: err.message,
                value: err.input
              });
            });
          }
        }
      }

      if (schemas.headers) {
        try {
          req.headers = schemas.headers.parse(req.headers);
        } catch (error) {
          if (error instanceof ZodError) {
            error.errors.forEach(err => {
              errors.push({
                source: 'headers',
                field: err.path.join('.'),
                message: err.message,
                value: err.input
              });
            });
          }
        }
      }

      // Если есть ошибки валидации, возвращаем их
      if (errors.length > 0) {
        const validationError = new ValidationError(
          'Ошибка валидации данных',
          { errors }
        );
        return next(validationError);
      }

      next();
    } catch (error) {
      next(error);
    }
  };
};

/**
 * Middleware для валидации файлов
 */
export const validateFile = (options: {
  required?: boolean;
  maxSize?: number; // в байтах
  allowedTypes?: string[]; // MIME типы
  maxFiles?: number;
}) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      const files = req.files as any;
      const file = req.file as any;

      // Проверяем обязательность файла
      if (options.required && !file && (!files || files.length === 0)) {
        const validationError = new ValidationError('Файл обязателен для загрузки');
        return next(validationError);
      }

      // Если файлов нет и они не обязательны, продолжаем
      if (!file && (!files || files.length === 0)) {
        return next();
      }

      const filesToValidate = file ? [file] : files;

      // Проверяем количество файлов
      if (options.maxFiles && filesToValidate.length > options.maxFiles) {
        const validationError = new ValidationError(
          `Максимальное количество файлов: ${options.maxFiles}`
        );
        return next(validationError);
      }

      // Валидируем каждый файл
      for (const fileToValidate of filesToValidate) {
        // Проверяем размер файла
        if (options.maxSize && fileToValidate.size > options.maxSize) {
          const maxSizeMB = (options.maxSize / (1024 * 1024)).toFixed(2);
          const validationError = new ValidationError(
            `Размер файла не должен превышать ${maxSizeMB} MB`
          );
          return next(validationError);
        }

        // Проверяем тип файла
        if (options.allowedTypes && !options.allowedTypes.includes(fileToValidate.mimetype)) {
          const validationError = new ValidationError(
            `Разрешенные типы файлов: ${options.allowedTypes.join(', ')}`
          );
          return next(validationError);
        }
      }

      next();
    } catch (error) {
      next(error);
    }
  };
};

/**
 * Middleware для санитизации входящих данных
 */
export const sanitize = (options: {
  trimStrings?: boolean;
  removeEmptyStrings?: boolean;
  removeEmptyObjects?: boolean;
  maxDepth?: number;
}) => {
  const defaultOptions = {
    trimStrings: true,
    removeEmptyStrings: false,
    removeEmptyObjects: false,
    maxDepth: 10
  };

  const opts = { ...defaultOptions, ...options };

  const sanitizeValue = (value: any, depth: number = 0): any => {
    // Предотвращаем бесконечную рекурсию
    if (depth > opts.maxDepth) {
      return value;
    }

    if (typeof value === 'string') {
      let sanitized = value;
      
      if (opts.trimStrings) {
        sanitized = sanitized.trim();
      }

      if (opts.removeEmptyStrings && sanitized === '') {
        return undefined;
      }

      return sanitized;
    }

    if (Array.isArray(value)) {
      return value
        .map(item => sanitizeValue(item, depth + 1))
        .filter(item => item !== undefined);
    }

    if (value && typeof value === 'object') {
      const sanitized: any = {};
      
      for (const [key, val] of Object.entries(value)) {
        const sanitizedValue = sanitizeValue(val, depth + 1);
        
        if (sanitizedValue !== undefined) {
          sanitized[key] = sanitizedValue;
        }
      }

      // Удаляем пустые объекты если опция включена
      if (opts.removeEmptyObjects && Object.keys(sanitized).length === 0) {
        return undefined;
      }

      return sanitized;
    }

    return value;
  };

  return (req: Request, res: Response, next: NextFunction) => {
    try {
      if (req.body) {
        req.body = sanitizeValue(req.body);
      }

      if (req.query) {
        req.query = sanitizeValue(req.query);
      }

      next();
    } catch (error) {
      next(error);
    }
  };
};

/**
 * Middleware для проверки Content-Type в зависимости от эндпоинта
 */
export const validateContentType = (allowedTypes: string[] = ['application/json']) => {
  return (req: Request, res: Response, next: NextFunction) => {
    // Применяем только к методам с телом запроса
    if (!['POST', 'PUT', 'PATCH'].includes(req.method)) {
      return next();
    }

    const contentType = req.get('Content-Type');

    if (!contentType) {
      const validationError = new ValidationError('Заголовок Content-Type обязателен');
      return next(validationError);
    }

    const isValidType = allowedTypes.some(type => contentType.includes(type));

    if (!isValidType) {
      const validationError = new ValidationError(
        `Поддерживаемые типы контента: ${allowedTypes.join(', ')}`
      );
      return next(validationError);
    }

    next();
  };
};