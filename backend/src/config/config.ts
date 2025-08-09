import dotenv from 'dotenv';
import path from 'path';

// Загружаем переменные окружения
const envPath = path.resolve(__dirname, '../../../.env');
dotenv.config({ path: envPath });

// Fallback для .env файла
if (!process.env.DATABASE_URL) {
  dotenv.config({ path: path.resolve(process.cwd(), '.env') });
}
if (!process.env.DATABASE_URL) {
  dotenv.config();
}

interface Config {
  // Основные настройки
  NODE_ENV: string;
  PORT: number;
  
  // База данных
  DATABASE_URL: string;
  
  // CORS настройки
  CORS_ORIGINS: string[];
  
  // JWT
  JWT_SECRET: string;
  
  // Логирование
  LOG_LEVEL: string;
  
  // Rate limiting
  RATE_LIMIT_WINDOW_MS: number;
  RATE_LIMIT_MAX_REQUESTS: number;
  
  // File upload
  UPLOAD_MAX_SIZE: number;
  UPLOAD_ALLOWED_TYPES: string[];
}

// Функция для парсинга массива origins из строки
const parseOrigins = (origins: string): string[] => {
  if (!origins) return [];
  return origins.split(',').map(origin => origin.trim()).filter(Boolean);
};

// Функция для получения значения с валидацией
const getRequiredEnv = (key: string): string => {
  const value = process.env[key];
  if (!value) {
    throw new Error(`Missing required environment variable: ${key}`);
  }
  return value;
};

// Функция для получения значения с fallback
const getEnv = (key: string, fallback: string): string => {
  return process.env[key] || fallback;
};

// Функция для получения числового значения
const getNumberEnv = (key: string, fallback: number): number => {
  const value = process.env[key];
  if (!value) return fallback;
  const parsed = parseInt(value, 10);
  return isNaN(parsed) ? fallback : parsed;
};

// Конфигурация по умолчанию для разных окружений
const getDefaultConfig = (): Partial<Config> => {
  const env = getEnv('NODE_ENV', 'development');
  
  switch (env) {
    case 'production':
      return {
        LOG_LEVEL: 'warn',
        CORS_ORIGINS: ['https://yourdomain.com'],
        RATE_LIMIT_WINDOW_MS: 900000, // 15 минут
        RATE_LIMIT_MAX_REQUESTS: 100,
      };
    
    case 'staging':
      return {
        LOG_LEVEL: 'info',
        CORS_ORIGINS: ['https://staging.yourdomain.com'],
        RATE_LIMIT_WINDOW_MS: 900000,
        RATE_LIMIT_MAX_REQUESTS: 200,
      };
    
    case 'development':
    default:
      return {
        LOG_LEVEL: 'debug',
        CORS_ORIGINS: ['http://localhost:5177', 'http://localhost:3000', 'http://localhost:4000'],
        RATE_LIMIT_WINDOW_MS: 900000,
        RATE_LIMIT_MAX_REQUESTS: 1000,
      };
  }
};

// Создаем конфигурацию
const createConfig = (): Config => {
  const defaults = getDefaultConfig();
  
  // Получаем CORS origins с fallback
  const corsOrigins = parseOrigins(getEnv('CORS_ORIGINS', ''));
  const finalCorsOrigins = corsOrigins.length > 0 ? corsOrigins : (defaults.CORS_ORIGINS || ['http://localhost:5177']);
  
  const config: Config = {
    // Основные настройки
    NODE_ENV: getEnv('NODE_ENV', 'development'),
    PORT: getNumberEnv('PORT', 3001),
    
    // База данных - для development используем SQLite fallback (относительно backend/)
    DATABASE_URL: getEnv('DATABASE_URL', 'file:../prisma/dev.db'),
    
    // CORS настройки
    CORS_ORIGINS: finalCorsOrigins,
    
    // JWT - для development используем fallback
    JWT_SECRET: getEnv('JWT_SECRET', 'development_jwt_secret_minimum_32_characters_long'),
    
    // Логирование
    LOG_LEVEL: getEnv('LOG_LEVEL', defaults.LOG_LEVEL || 'info'),
    
    // Rate limiting
    RATE_LIMIT_WINDOW_MS: getNumberEnv('RATE_LIMIT_WINDOW_MS', defaults.RATE_LIMIT_WINDOW_MS || 900000),
    RATE_LIMIT_MAX_REQUESTS: getNumberEnv('RATE_LIMIT_MAX_REQUESTS', defaults.RATE_LIMIT_MAX_REQUESTS || 100),
    
    // File upload
    UPLOAD_MAX_SIZE: getNumberEnv('UPLOAD_MAX_SIZE', 10485760), // 10MB
    UPLOAD_ALLOWED_TYPES: parseOrigins(getEnv('UPLOAD_ALLOWED_TYPES', 'image/jpeg,image/png,image/gif,image/webp')),
  };
  
  return config;
};

// Упрощенная валидация для предотвращения зависания
const validateConfig = (config: Config): void => {
  if (config.NODE_ENV === 'production') {
    if (!config.DATABASE_URL) throw new Error('DATABASE_URL required in production');
    if (config.JWT_SECRET.length < 32) throw new Error('JWT_SECRET too short in production');
  }
};

// Создаем и валидируем конфигурацию
const config = createConfig();
validateConfig(config);

// Минимальное логирование только для отладки
if (config.NODE_ENV === 'development' && process.env.DEBUG_CONFIG) {
  console.log('🔧 Config:', config.NODE_ENV, config.PORT);
}

export default config;
export type { Config };
