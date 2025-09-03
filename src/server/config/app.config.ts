import { registerAs } from '@nestjs/config';

/**
 * Конфигурация приложения
 *
 * Содержит основные настройки сервера
 */
export const appConfig = registerAs('app', () => ({
  port: parseInt(process.env.PORT || '3001', 10) || 3001,
  nodeEnv: process.env.NODE_ENV || 'development',
  apiPrefix: process.env.API_PREFIX || 'api',
  cors: {
    origins: ['http://localhost:3000', 'http://localhost:5173', 'http://localhost:5177', 'http://localhost:5178'],
  },
}));
