import { registerAs } from '@nestjs/config';

/**
 * Конфигурация JWT токенов
 *
 * Настройки для аутентификации и авторизации
 */
export const jwtConfig = registerAs('jwt', () => ({
  secret: process.env.JWT_SECRET || 'situs-super-secret-key-change-in-production',
  accessTokenExpiresIn: process.env.JWT_ACCESS_EXPIRES_IN || '15m',
  refreshTokenExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d',
}));
