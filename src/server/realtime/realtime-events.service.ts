import { Injectable } from '@nestjs/common';
import { Observable, Subject } from 'rxjs';

export type ProjectEventType =
  | 'sse_connected'
  | 'project_created'
  | 'project_updated'
  | 'project_deleted'
  | 'project_status'
  | 'project_reordered'
  | 'task_progress_check'
  // События системы меню
  | 'menu_type_created'
  | 'menu_type_updated'
  | 'menu_type_deleted'
  | 'menu_item_created'
  | 'menu_item_updated'
  | 'menu_item_deleted'
  | 'menu_items_reordered'
  | 'menu_structure_changed'
  // События пользователей
  | 'user_created'
  | 'user_updated'
  | 'user_deleted'
  | 'user_status_changed'
  // События интеграций
  | 'integration_created'
  | 'integration_updated'
  | 'integration_deleted'
  | 'integration_status_changed'
  | 'integration_health_changed';

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
  private debounceTimers = new Map<string, NodeJS.Timeout>();
  private debouncedEvents = new Map<string, RealtimeEvent[]>();

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

  /**
   * Debounced publish for bulk operations
   * Groups events by key and publishes them in batches after delay
   */
  publishDebounced<T = any>(key: string, type: ProjectEventType, payload?: T, delayMs = 1000): void {
    try {
      const evt: RealtimeEvent<T> = { type, payload };
      
      // Add to debounced events
      const existing = this.debouncedEvents.get(key) || [];
      existing.push(evt);
      this.debouncedEvents.set(key, existing);
      
      // Clear existing timer
      const existingTimer = this.debounceTimers.get(key);
      if (existingTimer) {
        clearTimeout(existingTimer);
      }
      
      // Set new timer
      const timer = setTimeout(() => {
        const events = this.debouncedEvents.get(key) || [];
        if (events.length > 0) {
          // Publish batch event
          this.publish('integration_batch_update' as any, {
            key,
            events: events.map(e => ({ type: e.type, payload: e.payload })),
            count: events.length
          });
          
          // Clean up
          this.debouncedEvents.delete(key);
          this.debounceTimers.delete(key);
        }
      }, delayMs);
      
      this.debounceTimers.set(key, timer);
    } catch {
      // глушим ошибки публикации, чтобы не влиять на бизнес-логику
    }
  }

  publishProjectStatus(id: string, status: string): void {
    this.publish('project_status', { id, status });
  }

  // События системы меню
  publishMenuTypeCreated(projectId: string, menuType: any): void {
    this.publish('menu_type_created', { projectId, menuType });
  }

  publishMenuTypeUpdated(projectId: string, menuType: any): void {
    this.publish('menu_type_updated', { projectId, menuType });
  }

  publishMenuTypeDeleted(projectId: string, menuTypeId: string): void {
    this.publish('menu_type_deleted', { projectId, menuTypeId });
  }

  publishMenuItemCreated(projectId: string, menuItem: any): void {
    this.publish('menu_item_created', { projectId, menuItem });
  }

  publishMenuItemUpdated(projectId: string, menuItem: any): void {
    this.publish('menu_item_updated', { projectId, menuItem });
  }

  publishMenuItemDeleted(projectId: string, menuItemId: string, menuTypeId: string): void {
    this.publish('menu_item_deleted', { projectId, menuItemId, menuTypeId });
  }

  publishMenuItemsReordered(projectId: string, menuTypeId: string, items: any[]): void {
    this.publish('menu_items_reordered', { projectId, menuTypeId, items });
  }

  publishMenuStructureChanged(projectId: string, menuTypeId: string): void {
    this.publish('menu_structure_changed', { projectId, menuTypeId });
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


