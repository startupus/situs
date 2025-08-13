# TODO Write

- [x] Исправить PATCH /api/projects/:id/status (status + isPublished, публикация событий в сервисе)
- [x] Удалить минимальный сервер и артефакты .js из `src/server/projects`
- [x] Добавить heartbeat `/api/projects/heartbeat` и README для realtime/projects
- [x] Добавить глобальные пайпы/фильтры/интерцептор и graceful shutdown
- [x] Добавить pm2 конфиг и npm-скрипты деплоя
- [ ] Прогнать e2e Playwright: status toggle + SSE sync
- [ ] Создать unit-тесты для `ProjectsService.update` (без Jest)
- [ ] Документация: обновить корневой README архитектуры, добавить Swagger
- [ ] Очистить корень от артефактов компиляции и дублирующих конфигов TS
 
## UI реорганизация
- [x] Перенести `SitusDarkModeToggle` в `src/components/ui` и обновить импорты
- [ ] Стандартизировать импорты UI на `@/components/ui/*` (проверить весь проект)
- [ ] Объединить/перенести дубли из `src/components/situs/UI` (не создавать новые дубликаты)
- [x] Обновить `src/components/ui/README.md` и `src/components/situs/README.md`

## Архитектура и доступы
- [ ] API: CRUD `Account`, `AccountMembership`, `AgencyClient`
- [ ] Авторизация: Guards/Policies (GlobalRole, Account, ProjectAccess) + декораторы `@Roles()`, `@Scopes()`
- [ ] Tenant resolver: middleware по Host/домену (projectId, productId) и RequestContext

## Продукты
- [ ] Website: UX “Страницы” — создать/удалить/редактировать, DnD сохранение порядка (PATCH), поиск/фильтры, пагинация
- [ ] Shop: модели каталога (товар, категория), контроллеры и UI раздел “Магазины” (без связи с Page)
- [ ] Единый каркас продукта: маршруты `/api/projects/:projectId/products/:productId/...`

## Backend (NestJS)
- [ ] Валидация DTO на всех ручках (class-validator)
- [ ] Единый формат ошибок/логов, привести 404/500 аналитики к реализованным
- [ ] Домены проекта: валидация, привязка, sitemap/robots генерация
- [ ] SSE: события статуса/прогресса, heartbeat оставить

## Frontend (React + Vite)
- [x] Роут `projects/:projectId/website`
- [ ] Навигация к продуктам (магазин и др.)
- [ ] Website UI: вкладки “Меню”, “Дизайн”, “SEO” — подключить реальные API; убрать заглушки
- [ ] Редактор: создание страницы, обработка ошибок, переходы

## Мультиарендность и домены
- [ ] Привязка домена (форма/валидация/статус)
- [ ] Резолв по домену в предпросмотре Website

## База и миграции
- [x] Prisma db push; добавить индексы и миграции
- [ ] Проверить уникальные индексы: `AccountMembership`, `AgencyClient`, `pages_productId_slug_key`
- [x] Idempotent сиды: AGENCY/BUSINESS аккаунты, проекты, Website, страницы

## Тестирование (Playwright)
- [ ] E2E: проекты → проект → Website → страницы → DnD reorder → проверка порядка
- [ ] E2E: SSE `/api/projects/events`, отсутствие ошибок в консоли/сети
- [ ] E2E: домены (мок), роли (разные сценарии)

## Dev/операции
- [ ] Починить ts/tsx dev‑рантайм (после стабилизации)
- [ ] CI/CD: сборка NestJS, `prisma migrate deploy`, Playwright test, публикация артефактов
- [ ] Мониторинг: health, лог‑рутинг, трекинг ошибок

## Документация
- [ ] Обновить README архитектуры продуктов/ролей/маршрутов
- [ ] Зафиксировать ресёрч (research/*), протоколы (precise_triggers)
- [ ] Обновлять todo/инфо инкрементально
- [x] Добавить подробный раздел структуры проекта (папки backend/frontend/шаблоны)
 - [x] Добавить README в `src/server/pages/` (оглавление и контракты API)

## Темы/UX
- [ ] Единые настройки темы в админке, без заглушек

## Лицензии/зависимости
- [ ] На новые пакеты — license audit и фиксация результата