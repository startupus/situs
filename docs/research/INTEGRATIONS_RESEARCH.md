# Интеграции: архитектура плагинов (по аналогии с Joomla)

Цель: спроектировать компонент «Интеграции» как расширяемую систему плагинов 2-го уровня (для каждого проекта), поддерживающую подключение/настройку SMTP и иных каналов без переделки остального кода. Компонент включает каталог провайдеров, инстансы интеграций на проекте, API, события и UI.

## Референсы Joomla (что берем как принципы)

- Плагины регистрируются в реестре и подписываются на события (EventBus) — компонент испускает события, плагины их обрабатывают.
- Группы/типы плагинов (content/system/user …) — в нашем случае «каналы/категории интеграций» (EMAIL, WEBHOOK, TELEGRAM, SLACK, SMS, OAUTH …).
- Манифест и обновления — хранение метаданных плагина (имя, версия, возможности), возможность обновлений через update‑сервер (в текущей итерации фиксируем версию в коде и БД, удалённые обновления — в план).

Ссылки на идеи из Joomla (для ориентира):
- Event‑подписка плагинов и диспетчер событий (importPlugin + dispatch) — on* события → обработчики.
- Update servers в манифестах — блок `<updateservers>` (у нас аналог — поля метаданных + возможный URL источника обновлений в будущем).

## Архитектура в Situs

### Слои и роли

1) Registry/Реестр плагинов (runtime):
   - Регистрирует доступные провайдеры (метаданные + фабрика создания инстансов).
   - Предоставляет список провайдеров для UI «Каталог интеграций».
   - Типобезопасные capabilities плагина (sendMessage/import/export/healthCheck …).

2) IntegrationPlugin (интерфейс):
   - `key: string` (уникальный идентификатор провайдера, например `EMAIL_SMTP`).
   - `name: string`, `version: string`, `category: 'EMAIL' | 'WEBHOOK' | ...`.
   - `capabilities: { sendMessage?: boolean; importData?: boolean; exportData?: boolean; }`.
   - `getConfigSchema(): JsonSchema` (валидация настроек проекта для плагина).
   - `install?(projectId)`, `uninstall?(projectId)`.
   - `activate(projectId, config)`, `deactivate(projectId)`.
   - `healthCheck(projectId): Promise<HealthStatus>`.
   - Опционально: обработчики событий (подписки) по типам данных.

3) EventBus (внутренний):
   - Используем уже существующий `RealtimeEventsService` как шину и для SSE.
   - Стандартизируем события: `integration_created|updated|deleted|status_changed`, а также доменные (`invitations_send_requested` → маршрутизация в Email‑плагин и т.п.).

4) Persistence (Prisma):
   - `Integration` (инстанс плагина на проекте):
     - `id`, `projectId`, `provider` (key), `title`, `isActive`, `status` (`READY|DISABLED|ERROR`), `version`, `config` (Json), `secrets` (Json, шифровать в дальнейшем), `createdAt`, `updatedAt`.
     - `@@unique([projectId, provider])`.
   - `IntegrationEvent` (аудит/лог): `id`, `integrationId`, `event`, `payload` (Json), `createdAt`.
   - (Опционально) `IntegrationDefinition` — кэш метаданных провайдеров на случай UI/поиска, но на старте достаточно runtime‑реестра.

5) Безопасность
   - Доступ к CRUD интеграций — через `PermissionGuard` (роль проекта: Owner/Admin). Просмотр статуса — члены проекта с правом чтения настроек.
   - Секреты: хранение отдельно (поле `secrets`), последующее шифрование (план: KMS/локальный keyring).

### Минимальный набор провайдеров (MVP)

- `EMAIL_SMTP` — мост к существующему `CommunicationService.sendEmail()`. Позволяет: проверка подключения (EHLO), отправка тестового письма, отправка инвайтов.
- `WEBHOOK_GENERIC` — отправка HTTP(S) запросов из событий проекта (будущее, после MVP Email).

## API (NestJS)

- `GET /api/integrations/providers` — список доступных провайдеров из реестра (каталог).
- `GET /api/integrations?projectId=...` — список инстансов в проекте.
- `POST /api/integrations` — создать/активировать инстанс (provider, projectId, title, config, secrets?).
- `PATCH /api/integrations/:id` — обновить конфиг/статус/название.
- `POST /api/integrations/:id/test` — healthCheck.
- `DELETE /api/integrations/:id` — деактивация/удаление.
- `GET /api/realtime/integrations` (SSE) — события о составе и статусах.

Примечания:
- Канал EMAIL в инвайтах: `InvitationsService` испускает событие `invitations_send_requested`, диспетчер интеграций находит активный EMAIL‑инстанс для `projectId` и делегирует в плагин.
- Публичность эндпоинтов — нет, только аутентифицированным с правами проекта.

## UI (React, Situs)

- Раздел: `Интеграции` как самостоятельный компонент проекта (2-й уровень):
  - Маршруты:
    - `/projects/:projectId/integrations` — каталог + вкладка «Установленные».
    - `/projects/:projectId/integrations/:integrationId` — настройки конкретной интеграции (формы по `getConfigSchema`).
  - Если заход через «Настройки → Интеграции»: редирект на `/projects/:projectId/integrations`.
  - SSE подписка на `integration_*` для автообновления.
  - TailGrids UI: карточки провайдеров, фильтр, кнопки «Подключить», «Отключить», «Проверить», «Настроить».

## Миграции/Seed

- Добавить таблицы `Integration`, `IntegrationEvent`.
- Посев мета‑настроек для EMAIL (если требуется) в `situs-admin` или активировать Email‑интеграцию по умолчанию на системном проекте (конфиг берётся из существующего `CommunicationSettings` при первичной активации).

## Сопоставление с текущим кодом

- SMTP сейчас реализован в `CommunicationService.sendEmail()` — плагин `EMAIL_SMTP` будет вызывать этот сервис (чтобы не дублировать транспорт). Централизация SMTP в CommunicationService сохраняется; интеграции — это «управляющий слой» + конфигурация per‑project.
- Интеграции влияют на инвайты: `InvitationsService.create()` → событие → диспетчер интеграций → `EMAIL_SMTP.send()`.

## План внедрения (итерации)

1) БД (Prisma): модели `Integration`, `IntegrationEvent`.
2) Backend: `IntegrationsModule` (реестр + контроллер + сервис), интерфейс `IntegrationPlugin`, реализация `EmailIntegrationPlugin` (мост к CommunicationService).
3) API: providers/list/create/update/test/delete (+ SSE).
4) UI: страницы `/projects/:id/integrations` и `/:id/integrations/:integrationId`.
5) Включение в навигацию: пункт «Интеграции» (ссылка ведёт в компонент интеграций), «Настройки → Интеграции» делает редирект.
6) Связка с инвайтами: перевести отправку на события + интеграции.
7) Документация: README раздела и DevGuide по добавлению новых плагинов.

## Риски и открытые вопросы

- Шифрование секретов (MVP — хранение как есть, пометка TODO; далее — KMS/crypto).
- Обновления плагинов через удалённый update‑сервер (нужно проектирование механизма поставки/подписей; не в MVP).
- Горячая регистрация плагинов (динамическая загрузка) — на старте статический реестр, затем поддержка загрузки из `node_modules`/локальных пакетов.

## Чек‑лист реализации

- [ ] Prisma: `Integration`, `IntegrationEvent`.
- [ ] NestJS: `IntegrationsModule`, `IntegrationRegistry`, `IntegrationPlugin`.
- [ ] Плагин `EMAIL_SMTP` (мост к CommunicationService), `healthCheck`.
- [ ] API: providers/list/create/update/test/delete.
- [ ] SSE: `integration_created|updated|deleted|status_changed`.
- [ ] UI: каталог + «Установленные», страница настроек интеграции.
- [ ] Роутинг/меню: пункт «Интеграции» на уровне проекта; редирект из «Настройки → Интеграции».
- [ ] Связка инвайтов с интеграциями (событие → EMAIL).
- [ ] README в папке интеграций и обновление корневого README со ссылками.


