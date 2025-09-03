import { Module } from '@nestjs/common';
import { UiController } from './ui.controller';
import { UiService } from './ui.service';
import { DatabaseModule } from '../database/database.module';

@Module({
  imports: [DatabaseModule],
  controllers: [UiController],
  providers: [UiService],
  exports: [UiService],
})
export class UiModule {}
