import { Injectable } from '@nestjs/common';
import { Observable, Subject } from 'rxjs';

export interface RealtimeEvent<T = any> {
  type: string;
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

  publish<T = any>(type: string, payload?: T): void {
    try {
      const evt: RealtimeEvent<T> = { type, payload };
      // Серверный лог для отладки доставки
      // eslint-disable-next-line no-console
      console.log('[RT] publish', type, { at: new Date().toISOString(), clients: this.clients.size });
      this.subject.next(evt);
      // Прямой широковещательный канал для подключённых SSE клиентов
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


