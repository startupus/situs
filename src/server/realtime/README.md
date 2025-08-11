# Realtime (SSE)

- Контроллер: `src/server/realtime/realtime.controller.ts`
- Сервис-шина: `src/server/realtime/realtime-events.service.ts`
- Путь SSE: `GET /api/projects/events` (подписка фронта через `projectsApi.subscribeEvents`)
- Heartbeat: `GET /api/projects/heartbeat` — для keep-alive при нестабильных прокси
- Публикация событий из доменных сервисов: используем `RealtimeEventsService.publish(type, payload)` или `publishProjectStatus(id, status)`

Назначение: единый канал server-sent events без дублирования, работает для всех модулей.
