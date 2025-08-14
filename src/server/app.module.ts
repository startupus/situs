import { Module, MiddlewareConsumer } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from './database/database.module';
import { CommonModule } from './common/common.module';
import { HealthController } from './health/health.controller';
import { ProjectsModule } from './projects/projects.module';
import { appConfig } from './config/app.config';
import { RealtimeModule } from './realtime/realtime.module';
import { jwtConfig } from './config/jwt.config';
import { databaseConfig } from './config/database.config';
import { PagesModule } from './pages/pages.module';
import { ProductsModule } from './products/products.module';
import { AnalyticsModule } from './analytics/analytics.module';
import { TenantResolverMiddleware } from './common/middleware/tenant-resolver.middleware';
import { SeoModule } from './seo/seo.module';
import { AccountsModule } from './accounts/accounts.module';
import { DomainRedirectMiddleware } from './common/middleware/domain-redirect.middleware';
import { AuthModule } from './auth/auth.module';
import { APP_GUARD } from '@nestjs/core';
import { JwtAuthGuard } from './auth/guards/jwt-auth.guard';
import { PoliciesGuard } from './common/guards/policies.guard';
import { DomainsModule } from './domains/domains.module';
import { envValidationSchema } from './config/env.validation';
import { corsConfig } from './config/cors.config';
import { rateLimitConfig } from './config/rate-limit.config';
import { accessConfig } from './config/access.config';

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
      load: [appConfig, jwtConfig, databaseConfig, corsConfig, rateLimitConfig, accessConfig],
      envFilePath: ['.env.local', '.env'],
      validationSchema: envValidationSchema,
    }),

    // Модули инфраструктуры
    DatabaseModule,
    CommonModule,
    RealtimeModule, // Нужен для SSE
    PagesModule,

    // Бизнес-модули
    ProjectsModule,

    // Бизнес-модули: продукты
    ProductsModule,

    // Аналитика (мок эндпоинты для фронта)
    AnalyticsModule,

    // Публичные SEO-эндпоинты (robots/sitemap)
    SeoModule,

    // Домены
    DomainsModule,

    // Аккаунты и членства
    AccountsModule,

    // Аутентификация
    AuthModule,

    // MCP модуль временно отключён в dev, чтобы не блокировать сборку
    // SitusMcpModule,
  ],
  controllers: [HealthController],
  providers: [
    { provide: APP_GUARD, useClass: JwtAuthGuard },
    { provide: APP_GUARD, useClass: PoliciesGuard },
  ],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(DomainRedirectMiddleware).forRoutes('*');
    consumer.apply(TenantResolverMiddleware).forRoutes('*');
  }
}
