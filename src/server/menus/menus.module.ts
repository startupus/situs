import { Module } from '@nestjs/common';
import { DatabaseModule } from '../database/database.module';
import { RealtimeModule } from '../realtime/realtime.module';
import { MenusService } from './menus.service';
import { MenuResolverService } from './menu-resolver.service';
import { MenuRulesService } from './menu-rules.service';
import { MenuAccessService } from './menu-access.service';
import { MenuTypesController } from './menu-types.controller';
import { MenuItemsController } from './menu-items.controller';

/**
 * Модуль универсальной системы меню
 */
@Module({
  imports: [DatabaseModule, RealtimeModule],
  controllers: [MenuTypesController, MenuItemsController],
  providers: [MenusService, MenuResolverService, MenuRulesService, MenuAccessService],
  exports: [MenusService, MenuResolverService, MenuRulesService, MenuAccessService],
})
export class MenusModule {}
