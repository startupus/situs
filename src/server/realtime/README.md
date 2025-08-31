# Realtime (SSE)

- Контроллер: `src/server/realtime/realtime.controller.ts`
- Сервис-шина: `src/server/realtime/realtime-events.service.ts`
- Пути SSE:
  - `GET /api/projects/events` — события проектов (status/update/reorder)
  - `GET /api/realtime/integrations` — события интеграций (created/updated/deleted/status_changed)
- Heartbeat: `GET /api/projects/heartbeat` — для keep-alive при нестабильных прокси
- Публикация событий из доменных сервисов: используем `RealtimeEventsService.publish(type, payload)` или `publishProjectStatus(id, status)`

Назначение: единый канал server-sent events без дублирования, работает для всех модулей.

Пример публикации событий интеграций:

```ts
// Внутри сервиса интеграций: src/server/integrations/integrations.service.ts
this.realtime.publish('integration_created', { id: created.id, projectId: dto.projectId });
this.realtime.publish('integration_updated', { id, projectId: updated.projectId });
this.realtime.publish('integration_status_changed', { id, projectId: updated.projectId, status: updated.status });
this.realtime.publish('integration_deleted', { id, projectId: integration.projectId });
```

Фронтенд подписка (пример):

```ts
const es = new EventSource('/api/realtime/integrations');
es.onmessage = (e) => {
  const data = JSON.parse(e.data || '{}');
  if ((data.type || '').startsWith('integration_')) {
    // refetch списка интеграций
  }
};
```
