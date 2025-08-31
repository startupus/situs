# Чек‑лист улучшений раздела «Интеграции»

Статус: draft
Область: UI/Backend интеграций, DX, наблюдаемость

## Бэклог задач

- [ ] UI: индикатор health рядом со статусом инстанса (READY/ERROR → ping /test)
- [ ] UI: кнопка «Проверить все» (параллельный запуск `/api/integrations/:id/test`)
- [ ] UI: тосты/уведомления на результат test/update (успех/ошибка)
- [ ] UI: пагинация/ленивая подгрузка для длинных списков провайдеров/инстансов
- [ ] UI: сортировка инстансов (status, provider, updatedAt)
- [ ] UI: ссылочный help по каждому провайдеру (popover с инструкцией)
- [ ] UI: маскирование чувствительных полей конфигурации (secrets) и контроль фокуса
- [ ] Backend: шифрование `Integration.secrets` (этап 2; KMS/локальный keyring)
- [ ] Backend: rate‑limit на `:id/test` и кэш результата health на 60с
- [ ] Backend: webhooks при изменениях интеграций (audit → внешние системы)
- [ ] Backend: события `integration_health_changed` и хранение последнего health в БД
- [ ] SSE: отдельный канал по проекту `/api/realtime/integrations?projectId=...`
- [ ] SSE: debounce публикации при массовых обновлениях (batch)
- [ ] N8N: поддержка map `routes`: webhook|workflow + UI‑редактор с проверкой
- [ ] EMAIL: предпросмотр письма инвайта по шаблону `inviteTemplate`
- [ ] Документация: раздел «Добавление нового провайдера», примеры API/конфига
- [ ] Тесты: e2e на healthCheck для EMAIL/N8N, UI smoke на фильтры/поиск

## Примечания
- Не использовать Jest; e2e — Playwright.
- Актуализировать README после внедрения критичных изменений.

## Справка для исполнителя (где что лежит)

- Бэкенд интеграций
  - Модуль: `src/server/integrations/integrations.module.ts`
  - Сервис: `src/server/integrations/integrations.service.ts`
  - Контроллер: `src/server/integrations/integrations.controller.ts`
  - Плагины:
    - Email (SMTP): `src/server/integrations/plugins/email/email.integration.ts`
    - n8n: `src/server/integrations/plugins/n8n/n8n.integration.ts`
    - Типы/реестр: `src/server/integrations/plugins/integration.types.ts`, `src/server/integrations/plugins/registry.ts`
  - SSE:
    - Контроллер: `src/server/realtime/realtime.controller.ts` (эндпойнт `GET /api/realtime/integrations`)
    - Шина событий: `src/server/realtime/realtime-events.service.ts`
    - Документация: `src/server/realtime/README.md`
  - Связка инвайтов с EMAIL: `src/server/invitations/invitations.service.ts` (лог `IntegrationEvent`, публикация `integration_*`)

- Фронтенд интеграций
  - Страница: `src/components/situs/projects/settings/ProjectIntegrationsPage.tsx` (вкладки, поиск/фильтр, SSE‑подписка)
  - API‑клиент: `src/api/services/integrations.api.ts`
  - Роут: `src/components/situs/SitusApp.tsx` (`/projects/:projectId/settings/integrations`)
  - Сайдбар: `src/components/situs/Sidebar/SitusSidebar.tsx` (пункт «Интеграции»)

- База данных и сиды
  - Prisma схема: `prisma/schema.prisma` (модели `Integration`, `IntegrationEvent`, `CommunicationSettings`)
  - Сид системного проекта/интеграций: `prisma/seed-admin-system.ts`

- Тесты
  - E2E (интеграции UI): `tests/e2e/integrations-ui.spec.ts`
  - E2E (SSE проектов): `tests/e2e/projects-realtime.spec.ts`, `tests/e2e/projects-sse-events.spec.ts`

- Документация
  - Обзор: `docs/README.md`
  - Realtime/SSE: `src/server/realtime/README.md`
  - Навигация админки: `docs/specs/admin-navigation-from-menu-tz.md`
  - Разделение админки/лендинга: `docs/specs/admin-routing-tz.md`

- Быстрый старт
  - Команды см. `README.md`
  - Backend (dev): `npm run nestjs:build && PORT=3002 npm run serve:api:dist`
  - Frontend (dev): `npm run dev:situs`
  - E2E: `npm run test:e2e`

- API контракты (интеграции)
  - `GET /api/integrations/providers`
  - `GET /api/integrations?projectId=:id`
  - `POST /api/integrations`
  - `PATCH /api/integrations/:id`
  - `POST /api/integrations/:id/test`
  - `DELETE /api/integrations/:id`
  - SSE: `GET /api/realtime/integrations`

- Стандарты
  - TypeScript строгий, NestJS/Nx структура модулей
  - UI — без дублирования заголовков, заголовок и крошки в верхней панели
  - Изменения, влияющие на структуру/UI, отражать в `README.md` и `docs/README.md`
