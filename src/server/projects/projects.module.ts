import { Module } from '@nestjs/common';
import { ProjectsController } from './projects.controller';
import { ProjectsService } from './projects.service';
import { DatabaseModule } from '../database/database.module';
import { RealtimeModule } from '../realtime/realtime.module';

// Диагностика загрузки модуля
console.log('[BOOT] Loading ProjectsModule');

/**
 * Модуль проектов
 */
@Module({
  imports: [DatabaseModule, RealtimeModule],
  controllers: [ProjectsController],
  providers: [ProjectsService],
  exports: [ProjectsService],
})
export class ProjectsModule {}
