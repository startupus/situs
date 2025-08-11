# Модуль Projects

- Контроллер: `projects.controller.ts`
- Сервис: `projects.service.ts`
- DTO: `dto/*.ts`
- События: публикация через `RealtimeEventsService` (project_status)

Основные эндпоинты:

- `GET /api/projects` — список
- `GET /api/projects/:id` — по id
- `POST /api/projects` — создать
- `PATCH /api/projects/:id` — обновить
- `DELETE /api/projects/:id` — удалить
- `PATCH /api/projects/:id/status` — смена статуса (принимает `ACTIVE|SUSPENDED|ARCHIVED|DELETED`)

Примечания:

- При смене статуса одновременно синхронизируется флаг `isPublished` для совместимости фронта.
- Событие `project_status` публикуется на уровне сервиса при изменении `status`.
- Легаси `projects-simple.controller.ts` и `projects-minimal.module.ts` удалены.
