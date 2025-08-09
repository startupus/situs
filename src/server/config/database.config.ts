import { registerAs } from '@nestjs/config';

/**
 * Конфигурация базы данных
 * 
 * Настройки подключения к PostgreSQL через Prisma
 */
export const databaseConfig = registerAs('database', () => ({
  url: process.env.DATABASE_URL || 'file:./dev.db',
  type: process.env.DATABASE_TYPE || 'sqlite',
  host: process.env.DATABASE_HOST || 'localhost',
  port: parseInt(process.env.DATABASE_PORT, 10) || 5432,
  username: process.env.DATABASE_USERNAME || 'postgres',
  password: process.env.DATABASE_PASSWORD || 'password',
  database: process.env.DATABASE_NAME || 'situs',
  synchronize: process.env.NODE_ENV !== 'production',
  logging: process.env.NODE_ENV === 'development',
}));
