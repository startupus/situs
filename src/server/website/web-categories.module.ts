import { Module } from '@nestjs/common';
import { WebCategoriesController } from './web-categories.controller';
import { WebCategoriesService } from './web-categories.service';
import { DatabaseModule } from '../database/database.module';
import { ProjectsModule } from '../projects/projects.module';
import { RealtimeModule } from '../realtime/realtime.module';

@Module({
  imports: [DatabaseModule, ProjectsModule, RealtimeModule],
  controllers: [WebCategoriesController],
  providers: [WebCategoriesService],
  exports: [WebCategoriesService],
})
export class WebCategoriesModule {}
