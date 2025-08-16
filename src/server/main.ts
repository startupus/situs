import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import { GlobalExceptionFilter } from './common/filters/global-exception.filter';
import { LoggingInterceptor } from './common/interceptors/logging.interceptor';

// Диагностика необработанных ошибок на этапе запуска
process.on('uncaughtException', (err) => {
  try { console.error('[FATAL] uncaughtException:', err); } catch {}
});
process.on('unhandledRejection', (reason) => {
  try { console.error('[FATAL] unhandledRejection:', reason); } catch {}
});

// Диагностика неожиданных завершений процесса
process.on('beforeExit', (code) => {
  try { console.warn('[LIFECYCLE] beforeExit code:', code); } catch {}
});
process.on('exit', (code) => {
  try { console.warn('[LIFECYCLE] exit code:', code); } catch {}
});

/**
 * Точка входа в NestJS приложение
 * 
 * Настраивает:
 * - Валидацию
 * - CORS
 * - Swagger документацию
 * - Глобальные фильтры и интерцепторы
 */
async function bootstrap() {
  console.log('[BOOT] Creating Nest application...');
  // Dev keep-alive, чтобы процесс не завершался до старта HTTP-сервера в окружении tsx/ESM
  const isProduction = process.env.NODE_ENV === 'production';
  const devKeepAlive = isProduction ? undefined : setInterval(() => {}, 1000);

  const app = await NestFactory.create(AppModule);
  console.log('[BOOT] Nest application created');

  // Минимальная конфигурация для стабильного запуска

  // CORS настройки - минимальные
  app.enableCors();
  console.log('[BOOT] CORS enabled');

  // Глобальные пайпы/фильтры/интерцепторы
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
  app.useGlobalFilters(new GlobalExceptionFilter());
  app.useGlobalInterceptors(new LoggingInterceptor());
  console.log('[BOOT] Global pipes/filters/interceptors configured');

  // Грейсфул-шатдаун
  app.enableShutdownHooks();

  // Базовые Express routes
  try {
    const httpAdapter: any = app.getHttpAdapter();
    const instance: any = httpAdapter.getInstance?.();
    instance?.get?.('/', (_req: any, res: any) => res.json({ ok: true, service: 'situs-api' }));
    instance?.get?.('/health', (_req: any, res: any) => res.json({ status: 'ok', ts: new Date().toISOString() }));
    console.log('[BOOT] Early routes registered');
  } catch (e) {
    console.warn('[BOOT] Failed to register early routes:', (e as any)?.message || e);
  }

  // Swagger отключён

  // Удалены временные Express-ручки /api/projects — используем ProjectsController

  const port = Number(process.env.PORT || 3002);
  try { console.log(`[BOOT] About to listen on port ${port}`); } catch {}
  await app.listen(port);
  console.log(`[BOOT] Listening OK on http://localhost:${port}`);
  console.log('🚀 Situs NestJS Server запущен и слушает порт', port);
  console.log(`🔗 API базовый URL: http://localhost:${port}/api`);
  console.log(`💚 Health: http://localhost:${port}/health`);
  try { console.log(`[BOOT] Listening on http://localhost:${port}`); } catch {}

  console.log('🚀 Situs NestJS Server запущен!');
  console.log(`🔗 API базовый URL: http://localhost:${port}/api`);
  console.log(`💚 Health: http://localhost:${port}/health`);
  // Очищаем dev keep-alive по успешному старту
  if (devKeepAlive) clearInterval(devKeepAlive);

  // SSE реализован в RealtimeController (@Sse('projects/events'))

  // Дублирующие endpoints удалены - перенесены в начало main.ts перед app.listen()
}

// Обработка сигналов для корректного завершения
function setupSignalHandlers() {
  const shutdown = async (signal: string) => {
    try { console.log(`[SHUTDOWN] Received ${signal}`); } catch {}
    try {
      // В Nest 11 рекомендуется закрывать приложение через app.close(), но у нас нет app в этой области.
      // Поэтому полагаемся на enableShutdownHooks + OnModuleDestroy у PrismaService.
    } catch {}
    process.exit(0);
  };
  process.on('SIGINT', () => shutdown('SIGINT'));
  process.on('SIGTERM', () => shutdown('SIGTERM'));
}

setupSignalHandlers();

bootstrap().catch((error) => {
  console.error('❌ Ошибка запуска сервера:', error);
  process.exit(1);
});
