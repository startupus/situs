import { NestFactory } from '@nestjs/core';
import { SitusMcpModule } from './mcp.module';

async function bootstrap() {
  const app = await NestFactory.create(SitusMcpModule);
  
  // Настройка CORS для веб-интеграции
  app.enableCors({
    origin: ['http://localhost:3000', 'http://localhost:5173'],
    credentials: true,
  });
  
  // Запуск MCP сервера на порту 3001
  await app.listen(3001);
  
  console.log('🚀 Situs MCP Server запущен на порту 3001');
  console.log('📡 Доступные инструменты:');
  console.log('  - create-project: Создание нового проекта');
  console.log('  - list-projects: Получение списка проектов');
  console.log('  - update-project: Обновление проекта');
  console.log('');
  console.log('📁 Доступные ресурсы:');
  console.log('  - situs://docs/project/{projectId}');
  console.log('  - situs://templates/components/{category}');
  console.log('  - situs://config/theme/{themeName}');
  console.log('  - situs://content/{type}/{id}');
  console.log('');
  console.log('💬 Доступные промпты:');
  console.log('  - create-react-component: Создание React компонента');
  console.log('  - refactor-code: Рефакторинг кода');
  console.log('  - create-api-endpoint: Создание API эндпоинта');
  console.log('  - optimize-performance: Оптимизация производительности');
  console.log('  - create-tests: Создание тестов');
  console.log('  - generate-documentation: Генерация документации');
}

bootstrap().catch((error) => {
  console.error('❌ Ошибка запуска MCP сервера:', error);
  process.exit(1);
});
