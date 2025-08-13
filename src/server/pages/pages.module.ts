import { Module } from '@nestjs/common';
import { DatabaseModule } from '../database/database.module';
import { PagesController } from './pages.controller';
import { ProjectPagesController } from './project-pages.controller';

@Module({
  imports: [DatabaseModule],
  controllers: [PagesController, ProjectPagesController],
})
export class PagesModule {}


