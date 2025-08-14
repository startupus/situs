# Pages Module (Website Pages API)

Модуль API для страниц продукта Website в архитектуре Project → Product → Page.
Все выборки выполняются через `Page.productId` с фильтром `Product.type = 'WEBSITE'`.

## Состав папки
- `pages.module.ts` — модуль NestJS, подключает контроллеры.
- `pages.controller.ts` — общий контроллер страниц:
  - `GET /api/pages?projectId=&page=&limit=` — список страниц Website (опционально по проекту).
  - `GET /api/pages/:id` — получить страницу (упрощённый ответ; под замену на чтение из БД).
  - `POST /api/pages` — создание страницы (упрощённый DTO; добавить валидацию).
- `project-pages.controller.ts` — маршруты проекта:
  - `GET /api/projects/:projectId/pages?page=&limit=` — страницы Website конкретного проекта.
  - `PATCH /api/projects/:projectId/pages/reorder` — сохранение порядка (DnD), тело: `{ ids: string[] }` (DTO `ReorderPagesDto`).

## Контракты API (кратко)
- Список страниц:
  - Параметры: `page` (>=1), `limit` (1..100)
  - Сортировка: `orderIndex ASC, updatedAt DESC`
  - Ответ:
    ```json
    {
      "success": true,
      "data": {
        "pages": [],
        "pagination": { "page": 1, "limit": 20, "total": 0, "totalPages": 0 }
      }
    }
    ```
- Reorder:
  - Тело: `{ "ids": ["pageId1", "pageId2", "..."] }`
  - Ответ: `{ "success": true, "data": { "updated": 3 } }`

## Модель данных (Prisma)
- `Page.productId → Product.id`
- `Product.projectId → Project.id`
- `Product.type = 'WEBSITE'` — только такие продукты имеют `Page`
- `Page.orderIndex` — позиция в списке (DnD), по умолчанию `0`

Прямая связь `Page.projectId` не используется.

## Зависимости
- `PrismaService` — `src/server/database/prisma.service.ts`
- Глобальные пайпы/фильтры/интерсепторы — `src/server/common/*`

## Ближайшие задачи
- Валидация DTO (`class-validator`) для create/update страниц
- Полный CRUD: создание/удаление/редактирование страниц Website
- Поиск/фильтры/пагинация (согласовать с frontend)
- Guards/Policies: роли (Global/Account/Project) и `@Scopes()` для ручек
- Idempotent сиды демо‑страниц при пустом Website

## Примечания
- Dev API: `http://localhost:3002` (см. корневой README: прокси Vite на 3002)
