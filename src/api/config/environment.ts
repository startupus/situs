import { z } from 'zod';
import dotenv from 'dotenv';

// Загружаем переменные окружения
dotenv.config();

/**
 * Environment Configuration Module
 * Инспирирован конфигурационной системой Strapi
 */

// Схема валидации переменных окружения
const envSchema = z.object({
  // Database
  DATABASE_URL: z.string().url('DATABASE_URL должен быть валидным URL'),
  
  // JWT
  JWT_SECRET: z.string().min(32, 'JWT_SECRET должен быть минимум 32 символа'),
  JWT_EXPIRES_IN: z.string().default('7d'),
  
  // Server
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  PORT: z.coerce.number().int().min(1000).max(65535).default(3001),
  API_HOST: z.string().default('localhost'),
  API_URL: z.string().url().optional(),
  
  // Frontend
  FRONTEND_URL: z.string().url().default('http://localhost:3000'),
  CORS_ORIGINS: z.string().default('http://localhost:3000'),
  
  // Security
  BCRYPT_SALT_ROUNDS: z.coerce.number().int().min(10).max(15).default(12),
  RATE_LIMIT_MAX: z.coerce.number().int().positive().default(100),
  RATE_LIMIT_WINDOW_MS: z.coerce.number().int().positive().default(900000),
  
  // Logging
  LOG_LEVEL: z.enum(['error', 'warn', 'info', 'debug']).default('info'),
  LOG_FILE: z.string().optional(),
  
  // Development
  DEV_MODE: z.coerce.boolean().default(false),
  SEED_DATABASE: z.coerce.boolean().default(false),
  ENABLE_SWAGGER: z.coerce.boolean().default(false),
  ENABLE_CORS: z.coerce.boolean().default(true),
});

// Валидация и типизация переменных
const parseEnv = () => {
  try {
    return envSchema.parse(process.env);
  } catch (error) {
    if (error instanceof z.ZodError) {
      console.error('❌ Ошибка конфигурации окружения:');
      error.errors.forEach((err) => {
        console.error(`   ${err.path.join('.')}: ${err.message}`);
      });
      process.exit(1);
    }
    throw error;
  }
};

// Экспортируем конфигурацию
export const env = parseEnv();

// Конфигурация по разделам (как в Strapi)
export const database = {
  url: env.DATABASE_URL,
  client: 'postgresql',
  connection: {
    connectionString: env.DATABASE_URL,
  },
  debug: env.NODE_ENV === 'development',
};

export const server = {
  host: env.API_HOST,
  port: env.PORT,
  url: env.API_URL || `http://${env.API_HOST}:${env.PORT}`,
  cors: {
    enabled: env.ENABLE_CORS,
    origin: env.CORS_ORIGINS.split(',').map(origin => origin.trim()),
    credentials: true,
  },
  rateLimit: {
    max: env.RATE_LIMIT_MAX,
    windowMs: env.RATE_LIMIT_WINDOW_MS,
  },
};

export const security = {
  jwt: {
    secret: env.JWT_SECRET,
    expiresIn: env.JWT_EXPIRES_IN,
  },
  bcrypt: {
    saltRounds: env.BCRYPT_SALT_ROUNDS,
  },
};

export const logging = {
  level: env.LOG_LEVEL,
  file: env.LOG_FILE,
  console: env.NODE_ENV === 'development',
};

export const admin = {
  auth: {
    secret: env.JWT_SECRET,
  },
  apiToken: {
    salt: env.JWT_SECRET,
  },
};

// Проверка критически важных переменных
export const validateCriticalEnv = () => {
  const critical = [
    'DATABASE_URL',
    'JWT_SECRET',
  ];

  const missing = critical.filter(key => !process.env[key]);
  
  if (missing.length > 0) {
    console.error('❌ Критически важные переменные окружения отсутствуют:');
    missing.forEach(key => console.error(`   ${key}`));
    console.error('\nПожалуйста, создайте .env файл на основе .env.example');
    process.exit(1);
  }
};

// Информация о конфигурации
export const getConfigInfo = () => {
  return {
    environment: env.NODE_ENV,
    port: env.PORT,
    database: env.DATABASE_URL.replace(/\/\/.*@/, '//***@'), // Скрываем credentials
    cors: env.ENABLE_CORS,
    swagger: env.ENABLE_SWAGGER,
    development: env.DEV_MODE,
  };
};

export default {
  env,
  database,
  server,
  security,
  logging,
  admin,
  validateCriticalEnv,
  getConfigInfo,
};