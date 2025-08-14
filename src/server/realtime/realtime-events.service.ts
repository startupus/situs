import { Injectable } from '@nestjs/common';
import { Observable, Subject } from 'rxjs';

export type ProjectEventType =
  | 'sse_connected'
  | 'project_created'
  | 'project_updated'
  | 'project_deleted'
  | 'project_status'
  | 'project_reordered'
  | 'task_progress_check';

export interface RealtimeEvent<T = any> {
  type: ProjectEventType;
  payload?: T;
}

/**
 * Глобальный шина событий реального времени.
 * Единый источник для всех модулей/контроллеров, чтобы публикации
 * гарантированно доходили до всех активных SSE-подключений.
 */
@Injectable()
export class RealtimeEventsService {
  private readonly subject = new Subject<RealtimeEvent>();
  private readonly clients = new Set<(data: RealtimeEvent) => void>();
  private publishedCounter = 0;

  asObservable(): Observable<RealtimeEvent> {
    return this.subject.asObservable();
  }

  publish<T = any>(type: ProjectEventType, payload?: T): void {
    try {
      const evt: RealtimeEvent<T> = { type, payload };
      // eslint-disable-next-line no-console
      console.log('[RT] publish', type, { at: new Date().toISOString(), clients: this.clients.size });
      this.subject.next(evt);
      for (const send of this.clients) {
        try { send(evt as RealtimeEvent); } catch {}
      }
      this.publishedCounter += 1;
    } catch {
      // глушим ошибки публикации, чтобы не влиять на бизнес-логику
    }
  }

  publishProjectStatus(id: string, status: string): void {
    this.publish('project_status', { id, status });
  }

  /** Регистрирует SSE-клиента. Возвращает функцию отписки */
  registerClient(send: (data: RealtimeEvent) => void): () => void {
    this.clients.add(send);
    return () => {
      try { this.clients.delete(send); } catch {}
    };
  }

  getStats() {
    return { clients: this.clients.size, published: this.publishedCounter };
  }
}


