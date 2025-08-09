import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { Module, Controller, Get } from '@nestjs/common';

@Controller()
class AppController {
  @Get()
  getHello(): string {
    return 'NestJS сервер работает!';
  }

  @Get('health')
  getHealth() {
    return { status: 'ok', timestamp: new Date().toISOString() };
  }
}

@Module({
  controllers: [AppController],
})
class MinimalAppModule {}

async function bootstrap() {
  const app = await NestFactory.create(MinimalAppModule);
  
  app.enableCors({
    origin: ['http://localhost:3000', 'http://localhost:5173'],
    credentials: true,
  });

  const port = 4000;
  await app.listen(port);

  console.log('🚀 Минимальный NestJS сервер запущен!');
  console.log(`🔗 URL: http://localhost:${port}`);
  console.log(`💚 Health: http://localhost:${port}/health`);
}

bootstrap().catch((error) => {
  console.error('❌ Ошибка запуска:', error);
  process.exit(1);
});
