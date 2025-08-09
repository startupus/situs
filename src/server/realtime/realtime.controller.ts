import { Controller, Get, Query, Inject } from '@nestjs/common';
import { RealtimeEventsService } from './realtime-events.service';

@Controller('api/realtime')
export class RealtimeController {
  constructor(@Inject(RealtimeEventsService) private readonly realtime: RealtimeEventsService) {}

  /**
   * Тест публикации события в глобальную шину
   * GET /api/realtime/test?type=foo => publish({ type: 'foo', payload: { ts } })
   */
  @Get('test')
  test(@Query('type') type = 'test') {
    const payload = { ts: new Date().toISOString() };
    this.realtime.publish(type, payload);
    return { success: true, type, payload };
  }

  @Get('stats')
  stats() {
    return { success: true, data: this.realtime.getStats() };
  }
}


