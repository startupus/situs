import { registerAs } from '@nestjs/config';

function parseOrigins(input: string | undefined): string[] {
  if (!input) return [];
  return input
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean);
}

export const corsConfig = registerAs('cors', () => {
  const isProduction = process.env.NODE_ENV === 'production';
  const origins = parseOrigins(process.env.CORS_ORIGINS);
  
  // В production режиме CORS origins обязательны
  if (isProduction && origins.length === 0) {
    throw new Error('CORS_ORIGINS must be configured in production environment');
  }
  
  return {
    origins,
    isProduction,
    // Дополнительные настройки для production
    allowCredentials: true,
    allowedMethods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: [
      'Content-Type', 
      'Authorization', 
      'X-Requested-With',
      'Accept',
      'Origin'
    ],
    exposedHeaders: ['X-Total-Count'],
    maxAge: isProduction ? 86400 : 0, // 24 часа в production, без кеша в dev
  };
});
