import { Module } from '@nestjs/common';
import { ProjectsController } from './projects.controller';
import { ProjectsService } from './projects.service';
import { AuthSimpleModule } from '../auth/auth-simple.module';
import { DatabaseModule } from '../database/database.module';
import { ProjectsEventsService } from './projects-events.service';

/**
 * Модуль проектов
 */
@Module({
  imports: [AuthSimpleModule, DatabaseModule],
  controllers: [ProjectsController],
  providers: [ProjectsService, ProjectsEventsService],
  exports: [ProjectsService, ProjectsEventsService],
})
export class ProjectsModule {}
