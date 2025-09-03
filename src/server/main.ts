import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { GlobalExceptionFilter } from './common/filters/global-exception.filter';
import { LoggingInterceptor } from './common/interceptors/logging.interceptor';
import { ConfigService } from '@nestjs/config';

// Диагностика необработанных ошибок на этапе запуска
process.on('uncaughtException', (err) => {
  try {
    console.error('[FATAL] uncaughtException:', err);
  } catch {}
});
process.on('unhandledRejection', (reason) => {
  try {
    console.error('[FATAL] unhandledRejection:', reason);
  } catch {}
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
  try {
    console.log('[BOOT] Creating Nest application...');
    const app = await NestFactory.create(AppModule);
    console.log('[BOOT] Nest application created');

    console.log('[BOOT] Application created successfully, starting configuration...');

    // Минимальная конфигурация для стабильного запуска

    // CORS настройки
    const configService = app.get(ConfigService);
    const origins = configService.get<string[]>('cors.origins') || [];
    app.enableCors({
      origin: origins.length ? origins : true,
      credentials: true,
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization'],
    });
    console.log('[BOOT] CORS enabled with', origins.length ? origins : 'any');

    // Trust proxy для корректного Host/X-Forwarded-Host
    try {
      const httpAdapter: any = app.getHttpAdapter();
      const instance: any = httpAdapter.getInstance?.();
      instance?.set?.('trust proxy', true);
    } catch {}

    // Глобальный префикс для API
    app.setGlobalPrefix('api');
    console.log('[BOOT] Global prefix set to /api');

    // Глобальные пайпы/фильтры/интерцепторы
    app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
    app.useGlobalFilters(new GlobalExceptionFilter());
    app.useGlobalInterceptors(new LoggingInterceptor());

    // Грейсфул-шатдаун
    app.enableShutdownHooks();

    // Базовые Express routes
    try {
      const httpAdapter: any = app.getHttpAdapter();
      const instance: any = httpAdapter.getInstance?.();
      instance?.get?.('/', (_req: any, res: any) => res.json({ ok: true, service: 'situs-api' }));
      instance?.get?.('/health', (_req: any, res: any) => res.json({ status: 'ok', ts: new Date().toISOString() }));
    } catch (e) {
      console.warn('[BOOT] Failed to register early routes:', (e as any)?.message || e);
    }

    // Swagger (dev/test by default, can be disabled via ENABLE_SWAGGER=0)
    try {
      const enableSwagger = (process.env.ENABLE_SWAGGER || '1') !== '0' && process.env.NODE_ENV !== 'production';
      if (enableSwagger) {
        const config = new DocumentBuilder()
          .setTitle('Situs API')
          .setDescription('Документация API для Situs (NestJS)')
          .setVersion('1.0')
          .addBearerAuth()
          .build();
        const document = SwaggerModule.createDocument(app, config);
        SwaggerModule.setup('api-docs', app, document);
        console.log('[BOOT] Swagger enabled at /api-docs');
      }
    } catch (e) {
      console.warn('[BOOT] Swagger init failed:', (e as any)?.message || e);
    }

    // Удалены временные Express-ручки /api/projects — используем ProjectsController

    console.log('[BOOT] Starting server setup...');
    const port = Number(process.env.PORT || 3002);
    console.log(`[BOOT] About to listen on port ${port}`);

    try {
      await app.listen(port);
      console.log(`[BOOT] Server started successfully on port ${port}`);
    } catch (error) {
      console.error('[BOOT] Failed to start server:', error);
      throw error;
    }
    console.log(`[BOOT] Listening OK on http://localhost:${port}`);
    console.log('🚀 Situs NestJS Server запущен и слушает порт', port);
    console.log(`🔗 API базовый URL: http://localhost:${port}/api`);
    console.log(`💚 Health: http://localhost:${port}/health`);
    try {
      console.log(`[BOOT] Listening on http://localhost:${port}`);
    } catch {}

    console.log('🚀 Situs NestJS Server запущен!');
    console.log(`🔗 API базовый URL: http://localhost:${port}/api`);
    console.log(`💚 Health: http://localhost:${port}/health`);

    // SSE реализован в RealtimeController (@Sse('projects/events'))

    // Дублирующие endpoints удалены - перенесены в начало main.ts перед app.listen()
  } catch (error) {
    console.error('[BOOT] Bootstrap failed:', error);
    process.exit(1);
  }
}

// Обработка сигналов для корректного завершения
function setupSignalHandlers() {
  const shutdown = async (signal: string) => {
    try {
      console.log(`[SHUTDOWN] Received ${signal}`);
    } catch {}
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
