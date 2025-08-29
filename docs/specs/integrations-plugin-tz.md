# ТЗ: Компонент «Интеграции» (плагинная система для проектов)

Статус: draft v0.1
Связанные документы: `docs/research/INTEGRATIONS_RESEARCH.md`, `docs/specs/admin-navigation-from-menu-tz.md`

## 1. Цель
Реализовать компонент 2‑го уровня «Интеграции» как расширяемую плагинную систему для каждого проекта. Компонент предоставляет каталог интеграций (провайдеров), установку и настройку инстансов на проекте, события, API и UI. SMTP (email) переносится в виде плагина `EMAIL_SMTP`, далее расширяется другими каналами (webhook, messengers, SMS, OAuth и т.д.).

Отображаемое имя компонента: «Интеграции», slug: `integrations`, i18n ключ: `situs.project.integrations`.

## 2. Термины
- **Провайдер (Provider)**: реализация плагина интеграции (например, `EMAIL_SMTP`).
- **Инстанс интеграции (Integration)**: подключение провайдера к конкретному проекту с конфигом/секретами.
- **Реестр плагинов (Registry)**: набор доступных провайдеров в рантайме.
- **Компонент «Интеграции»**: серверный модуль + UI для управления интеграциями проектов.

## 3. Требования к архитектуре
- **Расширяемость без изменения ядра**: добавление нового провайдера не требует модификации бизнес‑логики проекта, только регистрация плагина.
- **Пер‑проектные настройки и множественные инстансы**: каждый проект может иметь 0..N интеграций, включая несколько инстансов одного и того же провайдера (например, два N8N: «Системная почта (Gmail)» и «AI обработка контента»). Для различения инстансов вводится `instanceKey` (строковый идентификатор, по умолчанию `default`); уникальность по тройке `(projectId, provider, instanceKey)`.
- **Событийная модель**: события `integration_created|updated|deleted|status_changed`; доменные события (например, `invitations_send_requested`) маршрутизируются в активные интеграции соответствующей категории.
- **Безопасность**: доступ через роли проекта (Owner/Admin — CRUD; Viewer — чтение статуса). Секреты изолированы от обычного конфига, шифрование — последующим этапом.
- **Совместимость**: `EMAIL_SMTP` использует существующий `CommunicationService` для транспорта почты.
- **SSE**: поток `/api/realtime/integrations` для обновления UI.

### 3.1 Маршрутизация действий → воркфлоу (для N8N)
- Доменные модули вызывают интеграции по стабильным ключам действий: `invitations.send`, `auth.password.reset`, `email.send`, `content.ai.process` и т.п.
- Конфигурация инстанса провайдера `N8N` хранит карту соответствий `actionKey → webhook|workflow`.
- Вызов выполняется через плагин: `trigger(projectId, provider, instanceKey, actionKey, payload)` → поиск маршрута в конфиге → HTTP‑вызов в n8n (API или webhook) с HMAC‑подписью и пер‑проектным ключом.
- Изоляция: для каждого проекта — свой `baseUrl` (если требуется), свои токены/секреты и allow‑list воркфлоу/тегов.

## 4. Модель данных (Prisma)
Добавить модели:

- `Integration`:
  - `id        String   @id @default(cuid())`
  - `projectId String   @index`
  - `provider  IntegrationProvider`
  - `instanceKey String  @default("default")`
  - `title     String?`
  - `version   String?`
  - `isActive  Boolean  @default(false)`
  - `status    String   @default("DISABLED")` // READY|DISABLED|ERROR
  - `config    Json?`
  - `secrets   Json?`
  - `createdAt DateTime @default(now())`
  - `updatedAt DateTime @updatedAt`
  - `@@unique([projectId, provider, instanceKey])`

- `IntegrationEvent`:
  - `id            String   @id @default(cuid())`
  - `integrationId String   @index`
  - `event         String`
  - `payload       Json?`
  - `createdAt     DateTime @default(now())`

Enum (опционально): `IntegrationStatus` (READY, DISABLED, ERROR). В `IntegrationProvider` предусмотреть `N8N`.

## 5. Backend (NestJS)
- Модуль: `IntegrationsModule`
  - `IntegrationRegistry` — хранит метаданные провайдеров, фабрики инстансов; отдаёт каталог для UI.
  - `IntegrationPlugin` — интерфейс плагина; реализации (минимум `EmailIntegrationPlugin`, `N8nIntegrationPlugin`).
  - `IntegrationsService` — CRUD по `Integration`, диспетчеризация доменных событий → плагины.
  - `IntegrationsController` — REST API.
  - SSE контроллер `/api/realtime/integrations`.

- Интерфейс `IntegrationPlugin` (минимум):
  - `key`, `name`, `version`, `category`, `capabilities`.
  - `getConfigSchema()`, `activate()`, `deactivate()`, `healthCheck()`, опц. `install()/uninstall()`.
  - Для `N8N`: поддержка `trigger(actionKey, payload, options)` с маршрутизацией по карте `routes`.

- Реализация `EmailIntegrationPlugin`:
  - Мост к `CommunicationService.sendMessage('EMAIL', ...)`.
  - `healthCheck` — попытка подключения (EHLO/dry‑run), возврат статуса.

- Реализация `N8nIntegrationPlugin`:
  - Конфиг: `baseUrl`, `auth` (`apiKey`/`basic`), `security.hmacSecret`, `allow` (`workflows[]`, `tags[]`), `routes` (`actionKey → webhook|workflow`).
  - Триггер: HTTP `POST` в `webhook` путь или запуск `workflowId` через API; подпись HMAC, project metadata.
  - Логи: результат/ошибка в `IntegrationEvent`; обновление статуса и SSE.

## 6. API
- `GET /api/integrations/providers` → список провайдеров (каталог).
- `GET /api/integrations?projectId=:id` → инстансы по проекту.
- `POST /api/integrations` → создать/активировать (body: `projectId, provider, instanceKey?, title?, config?, secrets?`). Если `instanceKey` не указан — `default`.
- `PATCH /api/integrations/:id` → обновить (`title?`, `config?`, `secrets?`, `isActive?`, `instanceKey?` — с проверкой уникальности).
- `POST /api/integrations/:id/test` → `healthCheck`.
- `DELETE /api/integrations/:id` → удалить/деактивировать.
- `GET /api/realtime/integrations` → SSE события.

Дополнительно (для удобства UI, опционально в MVP):
- `GET /api/integrations/n8n/workflows?projectId=:id` — проксирование списка воркфлоу/тегов из внешнего n8n по данным активной интеграции.

## 7. UI (React)
- Размещение: отдельный компонент проекта «Интеграции» (не в «Настройках» как страница хранения, а как самостоятельный раздел). При переходе из «Настройки → Интеграции» выполняется редирект в компонент.
- Роуты:
  - `/projects/:projectId/integrations` — каталог (вкладки: «Каталог», «Установленные»), карточки провайдеров, кнопки «Подключить»/«Настроить»/«Проверить».
  - `/projects/:projectId/integrations/:integrationId` — настройки инстанса (форма по `getConfigSchema()`).
- SSE подписка для автообновления списков/статусов.

Множественные инстансы одного провайдера:
- Кнопка «Добавить интеграцию» разрешает несколько карточек провайдера `N8N` в одном проекте.
- В мастере подключения задаётся `instanceKey` (генерируем автоматически и даём отредактировать) и человекочитаемый `title`.
- В настройках `N8N` конфигурируется карта `routes` (actionKey → webhook/workflow) и allow‑list.

## 8. Сиды
- Для проекта `situs-admin` создать (или предложить) инстансы:
  - `EMAIL_SMTP` (не активировать без секретов) — настройки по умолчанию из `CommunicationSettings`.
  - `N8N` c `instanceKey = "default"`, пустыми `routes` и заглушечным `baseUrl` (не активировать), чтобы показать в UI пример конфигурации.

## 9. Нефункциональные требования
- TypeScript строгий.
- Документация: README в папке интеграций; обновление корневого README ссылкой.
- Лицензии новых зависимостей — аудит и фиксация результатов.
- Тестирование: e2e (API CRUD интеграций) и Playwright UI‑smoke; без Jest.

## 10. Чек‑лист приёмки
- [x] Prisma: модели `Integration`, `IntegrationEvent`.
- [x] Backend: `IntegrationsModule`, `IntegrationRegistry`, интерфейс + `EmailIntegrationPlugin`, `N8nIntegrationPlugin`.
- [x] API: providers/list/create/update/test/delete.
- [ ] SSE: `/api/realtime/integrations`.
- [x] UI: каталог + «Установленные», страница настроек инстанса.
- [x] Навигация/редиректы: пункт «Интеграции» на уровне проекта; редирект из «Настройки → Интеграции`.
- [ ] Связка с инвайтами по событию.
- [x] Множественные инстансы одного провайдера (поле `instanceKey`, уникальность по тройке).
- [x] Сиды для `situs-admin` (EMAIL и N8N пример).
- [ ] Документация и обновление README.

## 11. Этапность
- MVP: `EMAIL_SMTP` + интеграция инвайтов; шифрование секретов — следующий этап.
- Обновления плагинов через удалённый сервер — вне MVP, предусмотреть поля метаданных на будущее.

Приложение A. Пример конфига `N8N` (пер‑проектно)
```
{
  "baseUrl": "https://n8n.company.com",
  "auth": { "type": "apiKey", "apiKey": "N8N_API_KEY" },
  "security": { "hmacSecret": "project-secret" },
  "routes": {
    "invitations.send": { "mode": "webhook", "path": "situs/invitations/send", "method": "POST" },
    "email.send":       { "mode": "workflow", "workflowId": "123", "execMode": "sync" },
    "content.ai.process": { "mode": "workflow", "workflowId": "456" }
  },
  "allow": { "workflows": ["123","456"], "tags": ["situs"] }
}
```
