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

  // Строгая валидация origins в production
  if (isProduction) {
    const invalidOrigins = origins.filter((origin) => {
      // Проверяем, что origin не содержит wildcard или небезопасные паттерны
      return (
        origin.includes('*') ||
        origin.includes('localhost') ||
        origin.includes('127.0.0.1') ||
        !origin.startsWith('https://')
      );
    });

    if (invalidOrigins.length > 0) {
      throw new Error(
        `Invalid CORS origins in production: ${invalidOrigins.join(', ')}. Only HTTPS origins are allowed.`,
      );
    }
  }

  return {
    origins: isProduction ? origins : origins.length > 0 ? origins : true, // В dev разрешаем все origins если не указаны
    isProduction,
    // Строгие настройки для production
    allowCredentials: true,
    allowedMethods: isProduction
      ? ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'] // Ограниченный набор методов
      : ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS', 'HEAD'], // Расширенный набор для dev
    allowedHeaders: isProduction
      ? [
          'Content-Type',
          'Authorization',
          'X-Requested-With',
          'Accept',
          'Origin',
          'X-Tenant-Id', // Для multi-tenant поддержки
          'X-API-Key', // Для API ключей
        ]
      : [
          'Content-Type',
          'Authorization',
          'X-Requested-With',
          'Accept',
          'Origin',
          'X-Tenant-Id',
          'X-API-Key',
          'X-Custom-Header', // Дополнительные заголовки для dev
        ],
    exposedHeaders: isProduction
      ? ['X-Total-Count', 'X-Rate-Limit-Remaining', 'X-Rate-Limit-Reset']
      : ['X-Total-Count', 'X-Rate-Limit-Remaining', 'X-Rate-Limit-Reset', 'X-Debug-Info'],
    maxAge: isProduction ? 86400 : 0, // 24 часа в production, без кеша в dev
    // Дополнительные настройки безопасности
    optionsSuccessStatus: 204, // Статус для preflight запросов
    preflightContinue: false, // Не передавать preflight запросы дальше
  };
});
