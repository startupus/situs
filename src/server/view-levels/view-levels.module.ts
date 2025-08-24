import { Module } from '@nestjs/common';
import { DatabaseModule } from '../database/database.module';
import { ViewLevelsController } from './view-levels.controller';
import { ViewLevelsService } from './view-levels.service';

@Module({
  imports: [DatabaseModule],
  controllers: [ViewLevelsController],
  providers: [ViewLevelsService],
  exports: [ViewLevelsService],
})
export class ViewLevelsModule {}
