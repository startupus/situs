import { Module } from '@nestjs/common';
import { ProjectsController } from './projects.controller';
import { ProjectsService } from './projects.service';
// import { AuthSimpleModule } from '../auth/auth-simple.module';
import { DatabaseModule } from '../database/database.module';
import { ProjectsEventsService } from './projects-events.service';
import { RealtimeModule } from '../realtime/realtime.module';

/**
 * Модуль проектов
 */
@Module({
  imports: [DatabaseModule, RealtimeModule],
  controllers: [ProjectsController],
  providers: [ProjectsService, ProjectsEventsService],
  exports: [ProjectsService, ProjectsEventsService],
})
export class ProjectsModule {}
