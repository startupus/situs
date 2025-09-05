import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
// NOTE: Do not import AppModule at top-level to avoid eager side-effects during minimal boot
import { Module, Controller, Get } from '@nestjs/common';
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
let __keepAlive: any | undefined;

async function bootstrap() {
  try {
    console.log('[BOOT] Creating Nest application...');
    // Minimal fallback module for diagnostics
    @Controller()
    class MinimalController {
      @Get('/health')
      health() {
        return { status: 'ok', ts: new Date().toISOString() } as const;
      }
      @Get('/')
      root() {
        return { ok: true, service: 'situs-api(minimal)' } as const;
      }
    }
    @Module({ controllers: [MinimalController] })
    class MinimalModule {}

    const useMinimal = process.env.SITUS_BOOT_MINIMAL === '1';
    const RootModule: any = useMinimal ? MinimalModule : require('./app.module').AppModule;

    // Keep event loop alive during bootstrap under tsx until server listens
    __keepAlive = setInterval(() => {}, 1 << 30);
    const app = await NestFactory.create(RootModule, {
      bufferLogs: false,
      logger: ['log', 'error', 'warn', 'debug', 'verbose'],
    });
    console.log('[BOOT] Nest application created');

    console.log('[BOOT] Application created successfully, starting configuration...');

    // Минимальная конфигурация для стабильного запуска

    // CORS настройки
    let corsConfig: any = null;
    let pathsConfig: any = null;
    try {
      const configService = app.get(ConfigService);
      corsConfig = configService.get('cors') as any;
      pathsConfig = configService.get('paths') as any;
    } catch {}
    try {
      const rawOrigins = corsConfig && 'origins' in corsConfig ? corsConfig.origins : undefined;
      let originOption: any;
      if (Array.isArray(rawOrigins)) {
        originOption = rawOrigins.length ? rawOrigins : corsConfig.isProduction ? false : true;
      } else if (typeof rawOrigins === 'boolean') {
        originOption = rawOrigins;
      } else if (typeof rawOrigins === 'string') {
        const list = rawOrigins
          .split(',')
          .map((s: string) => s.trim())
          .filter(Boolean);
        originOption = list.length ? list : corsConfig.isProduction ? false : true;
      } else {
        originOption = corsConfig && corsConfig.isProduction ? false : true;
      }
      app.enableCors({
        origin: originOption,
        credentials: corsConfig?.allowCredentials,
        methods: corsConfig?.allowedMethods,
        allowedHeaders: corsConfig?.allowedHeaders,
        exposedHeaders: corsConfig?.exposedHeaders,
        maxAge: corsConfig?.maxAge,
      });
      console.log('[BOOT] CORS enabled with origin =', originOption);
    } catch (e) {
      console.error('[BOOT] CORS setup failed, enabling permissive CORS for development:', (e as any)?.message || e);
      app.enableCors({ origin: true, credentials: true });
    }
    console.log(
      '[BOOT] Paths config loaded:',
      pathsConfig
        ? {
            environment: pathsConfig.environment,
            isDocker: pathsConfig.isDocker,
            apiBaseUrl: pathsConfig.api?.baseUrl,
            frontendBaseUrl: pathsConfig.frontend?.baseUrl,
          }
        : 'no paths config',
    );

    // Trust proxy для корректного Host/X-Forwarded-Host
    try {
      const httpAdapter: any = app.getHttpAdapter();
      const instance: any = httpAdapter.getInstance?.();
      instance?.set?.('trust proxy', true);
    } catch {}

    // Глобальный префикс для API
    app.setGlobalPrefix('api', {
      exclude: [
        { path: 'robots.txt', method: (require('@nestjs/common') as any).RequestMethod.GET },
        { path: 'sitemap.xml', method: (require('@nestjs/common') as any).RequestMethod.GET },
      ],
    });
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

    // Явная инициализация перед listen для лучшей диагностики
    await app.init();
    try {
      await app.listen(port, '0.0.0.0');
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
  } finally {
    try {
      if (__keepAlive) clearInterval(__keepAlive);
    } catch {}
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

// Диагностика преждевременного завершения цикла событий (dev-only)
if (process.env.NODE_ENV !== 'production') {
  try {
    process.on('beforeExit', (code) => {
      try {
        const handles = (process as any)._getActiveHandles?.() || [];
        console.warn('[DIAG] beforeExit code =', code, 'activeHandles =', handles.length);
      } catch {}
    });
  } catch {}
}
