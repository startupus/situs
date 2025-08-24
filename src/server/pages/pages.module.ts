import { Module } from '@nestjs/common';
import { DatabaseModule } from '../database/database.module';
import { RealtimeModule } from '../realtime/realtime.module';
import { PagesController } from './pages.controller';
import { ProjectPagesController } from './project-pages.controller';
import { PageCategoriesController } from './page-categories.controller';
import { PageCategoriesService } from './page-categories.service';

@Module({
  imports: [DatabaseModule, RealtimeModule],
  controllers: [PagesController, ProjectPagesController, PageCategoriesController],
  providers: [PageCategoriesService],
  exports: [PageCategoriesService],
})
export class PagesModule {}


