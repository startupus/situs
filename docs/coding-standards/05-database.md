# База данных (Prisma/TypeORM)

Назначение: стандарты моделирования данных, миграций и транзакций.

## Ссылки в проекте

- `prisma/schema.prisma` — источник истины схемы
- `scripts/schema-sync.sh` — синхронизация с backend
- `prisma/seed.ts`, `scripts/seed-startapus-menus.ts` — сиды

## Именование

- Модели (Prisma) — `PascalCase` в единственном числе (`User`, `MenuItem`). Поля — `camelCase`.
- В TypeORM сущности именовать аналогично; таблицы — snake_case через настройки/модели по необходимости.

## Миграции и схема

- Источник истины — `prisma/schema.prisma`.
- Синхронизация в backend: `npm run schema:sync` (см. `scripts/schema-sync.sh`), копирует в `backend/prisma/schema.prisma` и валидирует.
- Применение изменений: `npx prisma db push` для dev, `prisma migrate dev/deploy` для миграций.
- Правило: не изменять `backend/prisma/schema.prisma` вручную — только через корневую схему.

### Пример модели (Prisma)

```prisma
model MenuItem {
  id         String   @id @default(cuid())
  projectId  String
  parentId   String?  @db.VarChar(191)
  title      String
  alias      String
  isActive   Boolean  @default(true)
  order      Int      @default(0)

  @@index([projectId])
  @@index([parentId])
  @@unique([projectId, alias])
}
```

### Транзакция (Prisma)

```ts
await prisma.$transaction(async (tx) => {
  const item = await tx.menuItem.update({ where: { id }, data: { parentId, order } });
  await tx.menuItem.updateMany({ where: { parentId }, data: { order: { increment: 1 } } });
  return item;
});
```

### Seed (TypeScript)

```ts
import { prisma } from '@/src/server/database/prisma';

await prisma.menuItem.createMany({
  data: [
    { projectId, title: 'Главная', alias: 'home', order: 0 },
    { projectId, title: 'О нас', alias: 'about', order: 1 },
  ],
});
```

## Индексы и ограничения

- Индексы на поля поиска/соединений (например, `projectId`, `parentId`, `slug/alias`).
- Уникальные ограничения на бизнес‑ключи (например, alias в пределах типа меню/проекта).

## Транзакции

- Использовать транзакции ORM для целостности связанных операций (создание/перемещение меню и т.п.).
- Важные инварианты проверять внутри транзакции (уникальные алиасы, корректность родителя).

## Версионирование и синхронизация

- При изменении схемы — запускать `npm run schema:sync` и `npx prisma generate`.
- В pre-commit хук включена синхронизация и проверка компиляции — коммит без прохождения проверок невозможен.

## TypeORM

- Если модуль использует TypeORM — фиксировать выбор ORM в README модуля, не смешивать с Prisma внутри одного домена.
- Миграции TypeORM хранить рядом с модулем или в централизованной папке (описать в README), применять через `typeorm migration:run`.

## Навигация

Назад: `./README.md`
