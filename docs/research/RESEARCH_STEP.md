# Research Step: Полный отказ от SQLite и миграция на PostgreSQL

Дата: 2025-09-03

Цель: Полностью удалить SQLite из проекта, конвертировать миграции на синтаксис PostgreSQL, обновить конфигурацию Docker и окружения, проверить работоспособность.

Ключевые решения:

- Источник истины: Prisma schema и миграции; все SQL миграции приведены к Postgres.
- Убран любой runtime/artifact SQLite (dev.db, test.db).
- Docker: только Postgres 15 + Redis; сервис pgloader удалён.
- Документация и тестовые ссылки на SQLite заменены на PostgreSQL.

Изменённые области:

- prisma/migrations/\* — заменены DATETIME → TIMESTAMP(3), REAL → DOUBLE PRECISION, убраны PRAGMA, добавлены IF EXISTS.
- docker-compose.yml — удалён pgloader, удалены маппинги dev.db.
- docs/DEVELOPMENT.md — DATABASE_URL теперь PostgreSQL.
- scripts/run-ecosystem-tests.ts — тестовая БД на PostgreSQL.
- src/server/common/permissions/**tests**/README.md — обновлён DATABASE_URL.
- Удалены файлы: prisma/dev.db, prisma/prisma/dev.db.
- package.json — удалён typeorm.

Риски и валидация:

- Healthcheck /health возвращает ok.
- Сборка и контейнеры поднимаются успешно.
- Запуск e2e покрывает основные сценарии (см. CI).

Дальнейшие шаги:

- Поддерживать только PostgreSQL; контролировать отсутствие file:\*.db в новых PR.
