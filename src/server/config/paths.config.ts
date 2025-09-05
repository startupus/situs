import { registerAs } from '@nestjs/config';

/**
 * Универсальная конфигурация путей для разных окружений
 * Автоматически определяет правильные пути в зависимости от среды выполнения
 */
export const pathsConfig = registerAs('paths', () => {
  const isProduction = process.env.NODE_ENV === 'production';
  const isDocker = process.env.DOCKER_ENV === 'true' || process.env.CONTAINER === 'true';
  const isDevelopment = process.env.NODE_ENV === 'development';

  // Базовые настройки
  const baseConfig = {
    isProduction,
    isDocker,
    isDevelopment,
    environment: process.env.NODE_ENV || 'development',
  };

  // Определение базового URL для API
  const getApiBaseUrl = () => {
    if (isDocker) {
      // В Docker контейнере
      return process.env.API_BASE_URL || 'http://localhost:3002';
    } else if (isDevelopment) {
      // В dev окружении
      return process.env.API_BASE_URL || 'http://localhost:3002';
    } else {
      // В production
      return process.env.API_BASE_URL || 'https://api.situs.com';
    }
  };

  // Определение базового URL для фронтенда
  const getFrontendBaseUrl = () => {
    if (isDocker) {
      // В Docker контейнере
      return process.env.FRONTEND_BASE_URL || 'http://localhost:5177';
    } else if (isDevelopment) {
      // В dev окружении
      return process.env.FRONTEND_BASE_URL || 'http://localhost:5177';
    } else {
      // В production
      return process.env.FRONTEND_BASE_URL || 'https://situs.com';
    }
  };

  // Определение базового URL для статических файлов
  const getStaticBaseUrl = () => {
    if (isDocker) {
      // В Docker контейнере
      return process.env.STATIC_BASE_URL || 'http://localhost:3002/static';
    } else if (isDevelopment) {
      // В dev окружении
      return process.env.STATIC_BASE_URL || 'http://localhost:3002/static';
    } else {
      // В production
      return process.env.STATIC_BASE_URL || 'https://cdn.situs.com';
    }
  };

  // Определение базового URL для медиа файлов
  const getMediaBaseUrl = () => {
    if (isDocker) {
      // В Docker контейнере
      return process.env.MEDIA_BASE_URL || 'http://localhost:3002/media';
    } else if (isDevelopment) {
      // В dev окружении
      return process.env.MEDIA_BASE_URL || 'http://localhost:3002/media';
    } else {
      // В production
      return process.env.MEDIA_BASE_URL || 'https://media.situs.com';
    }
  };

  // Определение базового URL для WebSocket соединений
  const getWebSocketBaseUrl = () => {
    if (isDocker) {
      // В Docker контейнере
      return process.env.WS_BASE_URL || 'ws://localhost:3002';
    } else if (isDevelopment) {
      // В dev окружении
      return process.env.WS_BASE_URL || 'ws://localhost:3002';
    } else {
      // В production
      return process.env.WS_BASE_URL || 'wss://ws.situs.com';
    }
  };

  // Определение базового URL для SSE соединений
  const getSSEBaseUrl = () => {
    if (isDocker) {
      // В Docker контейнере
      return process.env.SSE_BASE_URL || 'http://localhost:3002/api/realtime';
    } else if (isDevelopment) {
      // В dev окружении
      return process.env.SSE_BASE_URL || 'http://localhost:3002/api/realtime';
    } else {
      // В production
      return process.env.SSE_BASE_URL || 'https://api.situs.com/realtime';
    }
  };

  // Определение путей для файловой системы
  const getFileSystemPaths = () => {
    if (isDocker) {
      // В Docker контейнере
      return {
        uploads: process.env.UPLOADS_PATH || '/app/uploads',
        static: process.env.STATIC_PATH || '/app/public',
        temp: process.env.TEMP_PATH || '/tmp/situs',
        logs: process.env.LOGS_PATH || '/app/logs',
      };
    } else if (isDevelopment) {
      // В dev окружении
      return {
        uploads: process.env.UPLOADS_PATH || './uploads',
        static: process.env.STATIC_PATH || './public',
        temp: process.env.TEMP_PATH || './temp',
        logs: process.env.LOGS_PATH || './logs',
      };
    } else {
      // В production
      return {
        uploads: process.env.UPLOADS_PATH || '/var/situs/uploads',
        static: process.env.STATIC_PATH || '/var/situs/public',
        temp: process.env.TEMP_PATH || '/tmp/situs',
        logs: process.env.LOGS_PATH || '/var/log/situs',
      };
    }
  };

  // Определение настроек CORS
  const getCorsOrigins = () => {
    if (isDocker) {
      // В Docker контейнере
      return (
        process.env.CORS_ORIGINS?.split(',') || [
          'http://localhost:5177',
          'http://localhost:3000',
          'http://localhost:4000',
          'http://situs-web:5177',
          'http://situs-frontend:5177',
        ]
      );
    } else if (isDevelopment) {
      // В dev окружении
      return (
        process.env.CORS_ORIGINS?.split(',') || [
          'http://localhost:5177',
          'http://localhost:3000',
          'http://localhost:4000',
        ]
      );
    } else {
      // В production
      return (
        process.env.CORS_ORIGINS?.split(',') || ['https://situs.com', 'https://www.situs.com', 'https://app.situs.com']
      );
    }
  };

  // Определение настроек базы данных
  const getDatabaseConfig = () => {
    if (isDocker) {
      // В Docker контейнере
      return {
        host: process.env.DB_HOST || 'postgres',
        port: parseInt(process.env.DB_PORT || '5432'),
        database: process.env.DB_NAME || 'situs',
        username: process.env.DB_USER || 'situs',
        password: process.env.DB_PASSWORD || 'situs_password',
        url: process.env.DATABASE_URL || 'postgresql://situs:situs_password@postgres:5432/situs?schema=public',
      };
    } else if (isDevelopment) {
      // В dev окружении
      return {
        host: process.env.DB_HOST || 'localhost',
        port: parseInt(process.env.DB_PORT || '55432'),
        database: process.env.DB_NAME || 'situs',
        username: process.env.DB_USER || 'situs',
        password: process.env.DB_PASSWORD || 'situs_password',
        url: process.env.DATABASE_URL || 'postgresql://situs:situs_password@localhost:55432/situs?schema=public',
      };
    } else {
      // В production
      return {
        host: process.env.DB_HOST || 'localhost',
        port: parseInt(process.env.DB_PORT || '5432'),
        database: process.env.DB_NAME || 'situs',
        username: process.env.DB_USER || 'situs',
        password: process.env.DB_PASSWORD || 'situs_password',
        url: process.env.DATABASE_URL || 'postgresql://situs:situs_password@localhost:5432/situs?schema=public',
      };
    }
  };

  // Определение настроек Redis
  const getRedisConfig = () => {
    if (isDocker) {
      // В Docker контейнере
      return {
        host: process.env.REDIS_HOST || 'redis',
        port: parseInt(process.env.REDIS_PORT || '6379'),
        password: process.env.REDIS_PASSWORD || undefined,
        url: process.env.REDIS_URL || 'redis://redis:6379',
      };
    } else if (isDevelopment) {
      // В dev окружении
      return {
        host: process.env.REDIS_HOST || 'localhost',
        port: parseInt(process.env.REDIS_PORT || '6379'),
        password: process.env.REDIS_PASSWORD || undefined,
        url: process.env.REDIS_URL || 'redis://localhost:6379',
      };
    } else {
      // В production
      return {
        host: process.env.REDIS_HOST || 'localhost',
        port: parseInt(process.env.REDIS_PORT || '6379'),
        password: process.env.REDIS_PASSWORD || undefined,
        url: process.env.REDIS_URL || 'redis://localhost:6379',
      };
    }
  };

  return {
    ...baseConfig,

    // URL конфигурация
    api: {
      baseUrl: getApiBaseUrl(),
      internalUrl: process.env.API_INTERNAL_URL || getApiBaseUrl(),
      healthUrl: `${getApiBaseUrl()}/health`,
      docsUrl: `${getApiBaseUrl()}/api-docs`,
    },

    frontend: {
      baseUrl: getFrontendBaseUrl(),
      internalUrl: process.env.FRONTEND_INTERNAL_URL || getFrontendBaseUrl(),
    },

    static: {
      baseUrl: getStaticBaseUrl(),
      internalUrl: process.env.STATIC_INTERNAL_URL || getStaticBaseUrl(),
    },

    media: {
      baseUrl: getMediaBaseUrl(),
      internalUrl: process.env.MEDIA_INTERNAL_URL || getMediaBaseUrl(),
    },

    websocket: {
      baseUrl: getWebSocketBaseUrl(),
      internalUrl: process.env.WS_INTERNAL_URL || getWebSocketBaseUrl(),
    },

    sse: {
      baseUrl: getSSEBaseUrl(),
      internalUrl: process.env.SSE_INTERNAL_URL || getSSEBaseUrl(),
    },

    // Файловая система
    filesystem: getFileSystemPaths(),

    // CORS настройки
    cors: {
      origins: getCorsOrigins(),
      allowCredentials: true,
      allowedMethods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
      allowedHeaders: [
        'Content-Type',
        'Authorization',
        'X-Requested-With',
        'Accept',
        'Origin',
        'X-Tenant-Id',
        'X-API-Key',
      ],
    },

    // База данных
    database: getDatabaseConfig(),

    // Redis
    redis: getRedisConfig(),

    // Дополнительные настройки
    server: {
      port: parseInt(process.env.PORT || '3002'),
      host: process.env.HOST || '0.0.0.0',
      timeout: parseInt(process.env.SERVER_TIMEOUT || '30000'),
    },

    // Логирование
    logging: {
      level: process.env.LOG_LEVEL || (isDevelopment ? 'debug' : 'info'),
      format: process.env.LOG_FORMAT || (isDevelopment ? 'pretty' : 'json'),
    },

    // Безопасность
    security: {
      jwtSecret: process.env.JWT_SECRET || 'dev_secret_change_me_32_chars_minimum_1234567890',
      jwtExpiresIn: process.env.JWT_EXPIRES_IN || '30m',
      refreshExpiresIn: process.env.REFRESH_EXPIRES_IN || '7d',
      bcryptRounds: parseInt(process.env.BCRYPT_ROUNDS || '12'),
    },

    // Загрузка файлов
    upload: {
      maxSize: parseInt(process.env.UPLOAD_MAX_SIZE || '10485760'), // 10MB
      allowedTypes: process.env.UPLOAD_ALLOWED_TYPES?.split(',') || [
        'image/jpeg',
        'image/png',
        'image/gif',
        'image/webp',
        'application/pdf',
        'text/plain',
      ],
    },

    // Rate limiting
    rateLimit: {
      windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000'), // 15 минут
      maxRequests: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '1000'),
    },
  };
});
