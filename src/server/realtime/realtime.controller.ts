import { Controller, Get, Query, Inject, Sse, MessageEvent } from '@nestjs/common';
import { RealtimeEventsService } from './realtime-events.service';
import { map } from 'rxjs/operators';
import { merge, of } from 'rxjs';

// Базовый префикс 'api' чтобы упростить маршруты и поддержать /api/projects/events
@Controller('api')
export class RealtimeController {
  constructor(@Inject(RealtimeEventsService) private readonly realtime: RealtimeEventsService) {}

  /**
   * Тест публикации события в глобальную шину
   * GET /api/realtime/test?type=foo => publish({ type: 'foo', payload: { ts } })
   */
  @Get('realtime/test')
  test(@Query('type') type = 'test') {
    const payload = { ts: new Date().toISOString() };
    this.realtime.publish(type, payload);
    return { success: true, type, payload };
  }

  @Get('realtime/stats')
  stats() {
    return { success: true, data: this.realtime.getStats() };
  }

  /**
   * SSE поток для проектов
   * Фактический путь: GET /api/projects/events (совместим с фронтом)
   */
  @Sse('projects/events')
  events(): any {
    const source$ = this.realtime.asObservable();
    // Handshake: сразу после подключения клиент получает техническое событие, чтобы UI зафиксировал соединение
    const handshake$ = of({ type: 'sse_connected', payload: { ts: new Date().toISOString() } });
    return merge(handshake$, source$).pipe(
      map((evt) => ({ data: evt }) as MessageEvent),
    );
  }

  /**
   * Heartbeat для удержания соединения живым через обычный HTTP long-poll совместимый путь
   * Позволяет клиенту периодически дергать endpoint, если сеть/проксирующие балансировщики рвут SSE
   */
  @Get('projects/heartbeat')
  heartbeat() {
    return { success: true, ts: new Date().toISOString() };
  }

  /**
   * Общий прогресс/статус долгих операций через событийную шину
   * Клиент может инициировать проверку на фронте и слушать через SSE
   */
  @Get('realtime/progress')
  progress(@Query('taskId') taskId?: string) {
    if (taskId) {
      this.realtime.publish('task_progress_check', { taskId, ts: new Date().toISOString() });
    }
    return { success: true };
  }
}


