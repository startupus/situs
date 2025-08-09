import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
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
  const app = await NestFactory.create(AppModule);

  // Глобальная валидация
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
    transform: true,
  }));

  // Глобальные фильтры и интерцепторы
  app.useGlobalFilters(new GlobalExceptionFilter());
  app.useGlobalInterceptors(new LoggingInterceptor());

  // CORS настройки
  app.enableCors({
    origin: ['http://localhost:5177', 'http://127.0.0.1:5177', 'http://localhost:3000', 'http://127.0.0.1:3000', '*'],
    credentials: false,
    methods: ['GET', 'POST', 'PATCH', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    maxAge: 86400,
  });

  // Swagger документация (отключена для тестирования)
  // const config = new DocumentBuilder()
  //   .setTitle('Situs API')
  //   .setDescription('API для платформы визуального создания сайтов Situs')
  //   .setVersion('1.0')
  //   .addBearerAuth()
  //   .addTag('auth', 'Аутентификация')
  //   .addTag('projects', 'Проекты')
  //   .addTag('users', 'Пользователи')
  //   .addTag('mcp', 'Model Context Protocol')
  //   .build();

  // const document = SwaggerModule.createDocument(app, config);
  // SwaggerModule.setup('api/docs', app, document);

  const port = Number(process.env.PORT || 3001);
  try { console.log(`[BOOT] About to listen on port ${port}`); } catch {}
  // Ручной SSE endpoint на уровне приложения (Express)
  const httpAdapter: any = app.getHttpAdapter();
  const instance: any = httpAdapter.getInstance?.();
  try {
    const { ProjectsEventsService } = await import('./projects/projects-events.service');
    const events = app.get(ProjectsEventsService);
    // Preflight для FF (на всякий случай)
    instance.options('/api/projects/events', (req: any, res: any) => {
      const origin = req.headers.origin || '*';
      res.setHeader('Access-Control-Allow-Origin', origin);
      res.setHeader('Vary', 'Origin');
      res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
      res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
      res.status(204).end();
    });

    instance.get('/api/projects/events', (req: any, res: any) => {
      const origin = req.headers.origin || '*';
      res.setHeader('Access-Control-Allow-Origin', origin);
      res.setHeader('Vary', 'Origin');
      res.setHeader('Content-Type', 'text/event-stream; charset=utf-8');
      res.setHeader('Cache-Control', 'no-cache, no-transform');
      res.setHeader('Connection', 'keep-alive');
      res.setHeader('X-Accel-Buffering', 'no');
      res.flushHeaders?.();

      // Отправляем стартовый комментарий, чтобы FF зафиксировал открытие потока
      const subId = (req.query?.sub as string) || 'unknown';
      res.write(`: connected sub=${subId}\n`);
      res.write(`retry: 2000\n\n`);

      const send = (data: any) => res.write(`data: ${JSON.stringify(data)}\n\n`);
      const subscription = (events as any).asObservable().subscribe((evt: any) => send(evt.data ?? evt));
      // Пульс
      const heartbeat = setInterval(() => { try { res.write(`: ping\n\n`); } catch {} }, 15000);
      req.on('close', () => { try { subscription.unsubscribe(); } catch {}; try { clearInterval(heartbeat); } catch {}; try { res.end(); } catch {} });
    });
  } catch (e: any) {
    console.warn('SSE not initialized:', e && (e.message || e));
  }
  await app.listen(port, '0.0.0.0');
  console.log('🚀 Situs NestJS Server запущен и слушает порт', port);
  console.log(`🔗 API базовый URL: http://localhost:${port}/api`);
  console.log(`💚 Health: http://localhost:${port}/health`);
  try { console.log(`[BOOT] Listening on http://localhost:${port}`); } catch {}

  console.log('🚀 Situs NestJS Server запущен!');
  console.log(`🔗 API базовый URL: http://localhost:${port}/api`);
  console.log(`💚 Health: http://localhost:${port}/health`);
}

bootstrap().catch((error) => {
  console.error('❌ Ошибка запуска сервера:', error);
  process.exit(1);
});
