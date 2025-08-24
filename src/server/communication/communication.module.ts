import { Module } from '@nestjs/common';
import { CommunicationService } from './communication.service';
import { DatabaseModule } from '../database/database.module';

@Module({
  imports: [DatabaseModule],
  providers: [CommunicationService],
  exports: [CommunicationService],
})
export class CommunicationModule {}
