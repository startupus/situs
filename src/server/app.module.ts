import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from './database/database.module';
import { CommonModule } from './common/common.module';
import { HealthController } from './health/health.controller';
import { ProjectsModule } from './projects/projects.module';
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
    RealtimeModule, // Нужен для SSE

    // Бизнес-модули
    ProjectsModule,

    // Бизнес-модули (dev-slim)

    // Бизнес-модули: продукты
    // ProductsModule,

    // MCP модуль временно отключён в dev, чтобы не блокировать сборку
    // SitusMcpModule,
  ],
  controllers: [HealthController],
  providers: [],
})
export class AppModule {}
