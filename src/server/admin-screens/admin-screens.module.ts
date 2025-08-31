import { Module } from '@nestjs/common';
import { DatabaseModule } from '../database/database.module';
import { AdminScreensService } from './admin-screens.service';
import { AdminScreensController } from './admin-screens.controller';

@Module({
  imports: [DatabaseModule],
  controllers: [AdminScreensController],
  providers: [AdminScreensService],
  exports: [AdminScreensService],
})
export class AdminScreensModule {}
