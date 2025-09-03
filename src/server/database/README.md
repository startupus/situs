# Database Module

Глобальный модуль БД и PrismaService.

## Состав
- `database.module.ts` — экспортирует `PrismaService` глобально
- `prisma.service.ts` — инициализация Prisma, lifecycle hooks

## Окружение
- `DATABASE_URL` — см. `.env` (PostgreSQL)
- Генерация клиента: `npx prisma generate`
- Синхронизация схемы: `npx prisma db push`

## Примечания
- Использовать `PrismaService` через DI
- Для миграций/сидов см. каталог `prisma/` и `scripts/`
