import { Module, MiddlewareConsumer, RequestMethod } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { DatabaseModule } from '../database/database.module';
import { RealtimeModule } from '../realtime/realtime.module';
import { MenuAccessMiddleware } from './middleware/menu-access.middleware';
import { MenusService } from './menus.service';
import { MenuResolverService } from './menu-resolver.service';
import { MenuRulesService } from './menu-rules.service';
import { MenuAccessService } from './menu-access.service';
import { MenuLookupService } from './menu-lookup.service';
import { MenuMultilangService } from './menu-multilang.service';
import { MenuTypesController } from './menu-types.controller';
import { MenuItemsController } from './menu-items.controller';

/**
 * Модуль универсальной системы меню
 * Включает все сервисы для роутинга, lookup таблиц и мультиязычности
 */
@Module({
  imports: [DatabaseModule, RealtimeModule, ScheduleModule.forRoot()],
  controllers: [MenuTypesController, MenuItemsController],
  providers: [
    MenusService,
    MenuResolverService,
    MenuRulesService,
    MenuAccessService,
    MenuLookupService,
    MenuMultilangService,
    MenuAccessMiddleware,
  ],
  exports: [
    MenusService,
    MenuResolverService,
    MenuRulesService,
    MenuAccessService,
    MenuLookupService,
    MenuMultilangService,
  ],
})
export class MenusModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(MenuAccessMiddleware)
      .forRoutes(
        { path: 'menu-items/*', method: RequestMethod.GET },
        { path: 'menu-types/*', method: RequestMethod.GET },
      );
  }
}
