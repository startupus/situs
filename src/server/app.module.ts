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
import { WebCategoriesModule } from './website/web-categories.module';
import { ProductsModule } from './products/products.module';
import { AnalyticsModule } from './analytics/analytics.module';
import { TenantResolverMiddleware } from './common/middleware/tenant-resolver.middleware';
import { SeoModule } from './seo/seo.module';
import { AccountsModule } from './accounts/accounts.module';
import { DomainRedirectMiddleware } from './common/middleware/domain-redirect.middleware';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { UserGroupsModule } from './user-groups/user-groups.module';
import { ViewLevelsModule } from './view-levels/view-levels.module';
import { InvitationsModule } from './invitations/invitations.module';
import { CommunicationModule } from './communication/communication.module';
import { APP_GUARD } from '@nestjs/core';
import { JwtAuthGuard } from './auth/guards/jwt-auth.guard';
import { PoliciesGuard } from './common/guards/policies.guard';
import { PermissionGuard } from './common/permissions/guards/permission.guard';
import { DomainsModule } from './domains/domains.module';
import { MenusModule } from './menus/menus.module';
import { envValidationSchema } from './config/env.validation';
import { corsConfig } from './config/cors.config';
import { rateLimitConfig } from './config/rate-limit.config';
import { accessConfig } from './config/access.config';
import { RolesGuard } from './common/guards/roles.guard';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { UiModule } from './ui/ui.module';
import { AdminScreensModule } from './admin-screens/admin-screens.module';
import { IntegrationsModule } from './integrations/integrations.module';
import { DemoModule } from './demo/demo.module';
import { ThemeTemplatesModule } from './theme-templates/theme-templates.module';

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
    WebCategoriesModule,

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

    // Универсальная система меню
    MenusModule,

    // Аутентификация
    AuthModule,

    // Пользователи
    UsersModule,

    // Группы пользователей
    UserGroupsModule,

    // Уровни доступа
    ViewLevelsModule,

    // Приглашения
    InvitationsModule,

    // Каналы связи
    CommunicationModule,
    UiModule,
    AdminScreensModule,
    IntegrationsModule,
    DemoModule,
    ThemeTemplatesModule,

    // MCP модуль временно отключён в dev, чтобы не блокировать сборку
    // SitusMcpModule,

    // Rate limiting (production only рекомендуется)
    ThrottlerModule.forRootAsync({
      useFactory: () => ({
        throttlers: [
          {
            ttl: Number(process.env.RATE_LIMIT_WINDOW_MS || 900000) / 1000,
            limit: Number(process.env.RATE_LIMIT_MAX_REQUESTS || 1000),
          },
        ],
      }),
    }),
  ],
  controllers: [HealthController],
  providers: [
    { provide: APP_GUARD, useClass: JwtAuthGuard },
    // Новый guard с детальной проверкой прав (заменяет RolesGuard и PoliciesGuard)
    { provide: APP_GUARD, useClass: PermissionGuard },
    // Старые guards временно оставлены для совместимости
    // { provide: APP_GUARD, useClass: RolesGuard },
    // { provide: APP_GUARD, useClass: PoliciesGuard },
    { provide: APP_GUARD, useClass: ThrottlerGuard },
  ],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(DomainRedirectMiddleware).forRoutes('*');
    consumer.apply(TenantResolverMiddleware).forRoutes('*');
  }
}
