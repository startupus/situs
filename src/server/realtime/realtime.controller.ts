import { Controller, Get, Query, Inject, Sse, MessageEvent } from '@nestjs/common';
import { RealtimeEventsService } from './realtime-events.service';
import { map } from 'rxjs/operators';
import { merge, of } from 'rxjs';
import { Public } from '../common/decorators/public.decorator';

// Используем префикс 'realtime' чтобы избежать конфликтов
@Controller('realtime')
export class RealtimeController {
  constructor(@Inject(RealtimeEventsService) private readonly realtime: RealtimeEventsService) {}

  /**
   * Тест публикации события в глобальную шину
   * GET /api/realtime/test?type=foo => publish({ type: 'foo', payload: { ts } })
   */
  @Get('test')
  test(@Query('type') type: any = 'project_updated') {
    const payload = { ts: new Date().toISOString() };
    this.realtime.publish(type as any, payload);
    return { success: true, type, payload };
  }

  @Get('stats')
  stats() {
    return { success: true, data: this.realtime.getStats() };
  }

  /**
   * SSE поток для проектов
   * Фактический путь: GET /api/realtime/projects (изменен путь чтобы избежать конфликта с projects/:id)
   */
  @Public()
  @Sse('projects')
  events(): any {
    const source$ = this.realtime.asObservable();
    // Handshake: сразу после подключения клиент получает техническое событие, чтобы UI зафиксировал соединение
    const handshake$ = of({ type: 'sse_connected', payload: { ts: new Date().toISOString() } });
    return merge(handshake$, source$).pipe(map((evt) => ({ data: evt }) as MessageEvent));
  }

  /**
   * SSE поток для пользователей
   * Фактический путь: GET /api/realtime/users
   */
  @Public()
  @Sse('users')
  usersEvents(): any {
    const source$ = this.realtime.asObservable();
    // Handshake: сразу после подключения клиент получает техническое событие, чтобы UI зафиксировал соединение
    const handshake$ = of({ type: 'sse_connected', payload: { ts: new Date().toISOString() } });
    return merge(handshake$, source$).pipe(map((evt) => ({ data: evt }) as MessageEvent));
  }

  /**
   * SSE поток для интеграций
   * Фактический путь: GET /api/realtime/integrations
   */
  @Public()
  @Sse('integrations')
  integrationsEvents(): any {
    const source$ = this.realtime.asObservable();
    const handshake$ = of({ type: 'sse_connected', payload: { ts: new Date().toISOString() } });
    return merge(handshake$, source$).pipe(map((evt) => ({ data: evt }) as MessageEvent));
  }

  /**
   * Heartbeat для удержания соединения живым через обычный HTTP long-poll совместимый путь
   * Позволяет клиенту периодически дергать endpoint, если сеть/проксирующие балансировщики рвут SSE
   */
  @Public()
  @Get('api/realtime/heartbeat')
  heartbeat() {
    return { success: true, ts: new Date().toISOString() };
  }

  /**
   * Общий прогресс/статус долгих операций через событийную шину
   * Клиент может инициировать проверку на фронте и слушать через SSE
   */
  @Get('api/realtime/progress')
  progress(@Query('taskId') taskId?: string) {
    if (taskId) {
      this.realtime.publish('task_progress_check', { taskId, ts: new Date().toISOString() });
    }
    return { success: true };
  }
}
