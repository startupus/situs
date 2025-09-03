# План миграции в Docker для Situs

Документ описывает рекомендуемую стратегию миграции на Docker с переходом на PostgreSQL, включая порядок действий, проверки и механизм восстановления.

## Цели

- Перевести сервисы на docker-compose: Postgres, Redis, API (NestJS), Web (Nginx+Vite билд)
- Перейти с SQLite на PostgreSQL с согласованной схемой (Prisma migrate)
- Инициализировать системные данные (системная админка, меню) сидерами
- Обеспечить бэкфилл недостающих типов меню для всех проектов
- Автоматизировать проверку здоровья и UI smoke-проверки

## Архитектурные принципы

- Источник истины для схемы БД — Prisma миграции. Импорт из SQLite — опциональный и ограниченный (только нужные домены), из-за несовпадений схем.
- Сидер системной админки (`db:seed:admin`) — обязательный шаг после `migrate`.
- Бэкфилл проектных типов меню — идемпотентный скрипт, не ломающий существующие данные.

## Порядок действий

1. Инфраструктура
   - `docker compose up -d postgres redis`
   - Дождаться здоровья Postgres (`healthcheck` в compose)

2. Сборка и запуск API
   - `docker compose up -d situs-api`
   - В контейнере API выполняется: `prisma migrate deploy || prisma db push`, затем старт сервера
   - Проверка здоровья: `curl http://localhost:3002/health`

3. Инициализация системных данных
   - `docker compose exec situs-api npm run db:seed:admin`
   - Проверить: `GET /api/ui/admin-sidebar` возвращает пункты меню

4. Бэкфилл типов меню для всех проектов
   - `docker compose exec situs-api npx tsx scripts/backfill-menu-types.ts`
   - Скрипт создаёт `main`, `footer`, `sidebar` там, где их нет (кроме системного проекта)

5. (Опционально) Импорт данных из SQLite
   - Только если требуется перенос legacy-данных. Использовать `scripts/pgloader.load` с явным списком таблиц и маппингами
   - Рекомендация: импортировать только безопасные домены (например, `projects`, `pages`) и никогда — системные/enum‑колонки без сопоставления

6. Сборка и запуск Web
   - `docker compose up -d situs-web`
   - Открыть `http://localhost:5177/projects` и `.../settings/menu?tab=types`

7. Smoke‑тесты UI
   - Проверить сайдбар админки (источник из БД), вкладку «Типы меню», SSE переподключения

## Мониторинг и логи

- API: `docker compose logs -f situs-api`
- Postgres: `docker compose logs -f postgres`
- Web (Nginx): `docker compose logs -f situs-web`

## Откат

- Контейнеры: `docker compose down`
- Данные Postgres хранятся в volume `postgres_data`. Для полного отката — удалить volume (внимание: потеря данных)

## Риски

- Несовпадение схем SQLite и текущей Prisma‑схемы — рекомендуется не делать «сырой» полный импорт, а использовать сиды и точечный бэкфилл
- Дублирование данных при повторном запуске pgloader — избегать, использовать idempotent‑сидеры

## Следующие шаги (при необходимости)

- Подготовить расширенный pgloader‑скрипт с явными `INCLUDING ONLY`/`CAST`/`ALTER TABLE` маппингами под требуемые таблицы
- Добавить one‑shot сервис `situs-init` в compose для автоматического запуска сидов и бэкфилла после миграций
