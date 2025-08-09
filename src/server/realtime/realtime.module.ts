import { Global, Module } from '@nestjs/common';
import { RealtimeEventsService } from './realtime-events.service';
import { RealtimeController } from './realtime.controller';

@Global()
@Module({
  providers: [RealtimeEventsService],
  exports: [RealtimeEventsService],
  controllers: [RealtimeController],
})
export class RealtimeModule {}


