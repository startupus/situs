import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
// Dev-slim: оставляем только проекты и realtime
// import { AuthSimpleModule } from './auth/auth-simple.module';
import { ProjectsModule } from './projects/projects.module';
// import { UsersModule } from './users/users.module';
// import { SitusMcpModule } from '../mcp/mcp.module';
import { DatabaseModule } from './database/database.module';
import { CommonModule } from './common/common.module';
import { HealthController } from './health/health.controller';
// import { AuthTestController } from './auth/auth-test.controller';
import { ProjectsSimpleController } from './projects/projects-simple.controller';
// import { OrdersController } from './orders/orders.controller';
// import { ProductsController } from './products/products.controller';
// import { ProductsModule } from './products/products.module';
// import { PagesController } from './pages/pages.controller';
import { appConfig } from './config/app.config';
import { RealtimeModule } from './realtime/realtime.module';
import { jwtConfig } from './config/jwt.config';
import { databaseConfig } from './config/database.config';

/**
 * Основной модуль приложения
 * 
 * Импортирует все необходимые модули:
 * - Конфигурацию
 * - Базу данных  
 * - Бизнес-модули (Auth, Projects, Users)
 * - MCP модуль для AI интеграции
 * - Общие утилиты
 */
@Module({
  imports: [
    // Конфигурация приложения
    ConfigModule.forRoot({
      isGlobal: true,
      load: [appConfig, jwtConfig, databaseConfig],
      envFilePath: ['.env.local', '.env'],
    }),

    // Модули инфраструктуры
    DatabaseModule,
    CommonModule,
    RealtimeModule,

    // Бизнес-модули (dev-slim)
    ProjectsModule,

    // Бизнес-модули: продукты
    // ProductsModule,

    // MCP модуль временно отключён в dev, чтобы не блокировать сборку
    // SitusMcpModule,
  ],
  controllers: [HealthController, ProjectsSimpleController],
})
export class AppModule {}
