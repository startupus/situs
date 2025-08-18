# TODO Write

- [x] Исправить PATCH /api/projects/:id/status (status + isPublished, публикация событий в сервисе)
- [x] Удалить минимальный сервер и артефакты .js из `src/server/projects`
- [x] Добавить heartbeat `/api/projects/heartbeat` и README для realtime/projects
- [x] Добавить глобальные пайпы/фильтры/интерцептор и graceful shutdown
- [x] Добавить pm2 конфиг и npm-скрипты деплоя
- [x] Прогнать e2e Playwright: status toggle + SSE sync
- [x] Создать unit-тесты для `ProjectsService.update` (без Jest)
- [ ] Документация: обновить корневой README архитектуры, добавить Swagger
- [ ] Очистить корень от артефактов компиляции и дублирующих конфигов TS
 
## UI реорганизация
- [x] Перенести `SitusDarkModeToggle` в `src/components/ui` и обновить импорты
- [ ] Стандартизировать импорты UI на `@/components/ui/*` (проверить весь проект)
- [ ] Объединить/перенести дубли из `src/components/situs/UI` (не создавать новые дубликаты)
- [x] Обновить `src/components/ui/README.md` и `src/components/situs/README.md`

## Архитектура и доступы
- [x] Интегрировать доработки из ветки `cursor/enhance-project-backend-and-authorization-c0df` (Auth, Guards, Policies, Domains, SEO)
- [x] API: CRUD `Account`, `AccountMembership`, `AgencyClient`
- [ ] Авторизация: Guards/Policies (GlobalRole, Account, ProjectAccess) + декораторы `@Roles()`, `@Scopes()`
- [x] Tenant resolver: middleware по Host/домену (projectId, productId) и RequestContext
- [ ] Production‑режим: убрать dev‑bypass в `JwtAuthGuard`/`RolesGuard`/`PoliciesGuard`, включить строгую проверку ролей/доступов (UI должен корректно обрабатывать 401/403)
- [x] Единый формат ошибок API на фронте (адаптация `apiClient`): человекочитаемые сообщения для 401/403/404/500
 - [x] JwtAuthGuard: bypass только в development; в test строгий режим с поддержкой `AUTH_TEST_TOKEN` для e2e
 - [x] @Scopes() добавлены для `Accounts`, `AccountMemberships`, `AgencyClient`

## Продукты
- [ ] Website: UX “Страницы” — создать/удалить/редактировать, DnD сохранение порядка (PATCH), поиск/фильтры, пагинация
- [ ] Shop: модели каталога (товар, категория), контроллеры и UI раздел “Магазины” (без связи с Page)
- [ ] Единый каркас продукта: маршруты `/api/projects/:projectId/products/:productId/...`

## Backend (NestJS)
- [ ] Валидация DTO на всех ручках (class-validator)
- [ ] Единый формат ошибок/логов, привести 404/500 аналитики к реализованным
- [ ] Домены проекта: валидация, привязка, sitemap/robots генерация
- [ ] SSE: события статуса/прогресса, heartbeat оставить
- [ ] Rate limiting: интегрировать `@nestjs/throttler` на основе `rateLimitConfig` (dev выключен, prod включен)
  - [x] Подключить ThrottlerGuard глобально (значения из ENV)

## Frontend (React + Vite)
- [x] Роут `projects/:projectId/website`
- [ ] Навигация к продуктам (магазин и др.)
- [ ] Website UI: вкладки “Меню”, “Дизайн”, “SEO” — подключить реальные API; убрать заглушки
- [ ] Редактор: создание страницы, обработка ошибок, переходы
- [ ] UI для аккаунтов: списки/деталь `Account`, `AccountMembership`, `AgencyClient` + формы CRUD
- [ ] Обработчики ошибок API: дружелюбные сообщения для Forbidden/Not Found/Validation

## Мультиарендность и домены
- [ ] Привязка домена (форма/валидация/статус)
- [ ] Резолв по домену в предпросмотре Website
- [ ] E2E тест 301‑редиректов базовый→customDomain

## База и миграции
- [x] Prisma db push; добавить индексы и миграции
- [ ] Проверить уникальные индексы: `AccountMembership`, `AgencyClient`, `pages_productId_slug_key`
- [x] Idempotent сиды: AGENCY/BUSINESS аккаунты, проекты, Website, страницы

## Тестирование (Playwright)
- [ ] E2E: проекты → проект → Website → страницы → DnD reorder → проверка порядка
- [ ] E2E: SSE `/api/projects/events`, отсутствие ошибок в консоли/сети
- [ ] E2E: домены (мок), роли (разные сценарии)
- [ ] Починить селекторы списка проектов (ожидание карточек, рукопожатие SSE) и стабилизировать webServer
 - [x] Базовые сценарии проектов и SSE проходят (искл. incognito sync)
 - [x] Incognito realtime sync: исправить `Failed to fetch` в `tests/e2e/chrome-incognito-sync.spec.ts` (проверить CORS/SSE контекст)

## Тестирование (Backend / Vitest)
- [x] Импортированы backend e2e (auth/domains/SSE), обновлён `vitest.config.ts`, добавлен `scripts/test-backend.mjs`
- [ ] Подключить запуск backend e2e в CI
 - [x] CRUD `Accounts`/`AccountMemberships`/`AgencyClient` покрыты e2e

## Dev/операции
- [ ] Починить ts/tsx dev‑рантайм (после стабилизации)
- [x] CI/CD: сборка NestJS, Prisma generate/db push, backend tests (`test:backend`), Playwright e2e
- [ ] Мониторинг: health, лог‑рутинг, трекинг ошибок

### Dev‑рантайм (tsx) — расследование и фиксы
- [ ] tsx dev завершается до `listen()`: воспроизвести и зафиксировать причину (beforeExit/exit без открытых хэндлов)
- [x] Временный фикс: dev keep‑alive таймер до `NestFactory.create()` в `src/server/main.ts`
- [ ] Устранить первопричину: гарантировать удержание event loop до старта HTTP (проверить поведение tsx v4.20.x + Node 20)
- [x] Добавить альтернативный dev‑режим без tsx: `scripts/dev-api-watch.sh` (tsc --watch + nodemon)
- [ ] Прогнать `dev:api:watch`, проверить /health и /api/projects; стабилизировать скрипт (вывод логов, автоперезапуск)

## Документация
- [ ] Обновить README архитектуры продуктов/ролей/маршрутов
- [ ] Зафиксировать ресёрч (research/*), протоколы (precise_triggers)
- [ ] Обновлять todo/инфо инкрементально
- [x] Добавить подробный раздел структуры проекта (папки backend/frontend/шаблоны)
 - [x] Добавить README в `src/server/pages/` (оглавление и контракты API)
 - [x] Обновить `src/components/redaktus/README.md` с навигатором по каталогу
 - [x] Добавить README в `src/server/{auth,products,database,common,health,users}` и `src/components/sections`
- [x] Документация по доменам/тенантам/ролям: поведение, ограничения, примеры запросов (см. `docs/AUTH_AND_DOMAINS.md`, README модулей)

## Темы/UX
- [ ] Единые настройки темы в админке, без заглушек

## Лицензии/зависимости
- [x] На новые пакеты — license audit и фиксация результата (см. `docs/licenses/AUDIT_$(date +%F).csv`)