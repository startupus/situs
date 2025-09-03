import { Module } from '@nestjs/common';
import { RealtimeEventsService } from './realtime-events.service';
import { RealtimeController } from './realtime.controller';

@Module({
  providers: [RealtimeEventsService],
  exports: [RealtimeEventsService],
  controllers: [RealtimeController],
})
export class RealtimeModule {}
