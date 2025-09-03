# Демонстрационные данные (JSON → API)

Назначение: хранить демо-данные в JSON на бэкенде и отдавать их фронтенду исключительно через публичные API.

- Расположение JSON: `src/server/demo-data/startapus/`
  - `pages.json` — список страниц (home/about/contacts)
  - `menu.json` — типы меню и пункты (main/footer)

- Как попадают в API:
  - Скрипт сидирования читает JSON и записывает в БД Prisma.
  - Далее фронтенд получает данные штатными эндпоинтами:
    - Меню: `GET /api/menu-types`, `GET /api/menu-items` (и прочие)
    - Страницы: `GET /api/pages`, `GET /api/pages/:id`

## DemoModule (временный API для мок‑данных)

- Назначение: централизованно отдавать временные демо‑данные через бэкенд, исключая хардкод во фронтенде.
- Путь: `src/server/demo/*`
  - `demo.data.ts` — демо‑массивы (websites, stores, orders, products, supportTickets)
  - `demo.controller.ts` — публичные эндпоинты
  - `demo.module.ts` — модуль NestJS
- Эндпоинты:
  - `GET /api/demo/websites`
  - `GET /api/demo/stores`
  - `GET /api/demo/orders`
  - `GET /api/demo/products`
  - `GET /api/demo/support-tickets`
- Клиент фронтенда: `src/api/services/demo.api.ts` (`DemoAPI.websites()`, `stores()`, ...)
- Статус: временное решение до полноценной реализации бизнес‑модулей. Источник правды остаётся за реальными API.

Пример миграции фронтенда:

- Было: локальные массивы `const mock... = [...]` в компонентах.
- Стало: `useEffect` + `DemoAPI.*()` → состояние компонента.

- Скрипты:
  - Системный проект админки: `npm run db:seed:admin`
  - Демо‑проект Startapus (pages/menu/categories): `tsx scripts/seed-startapus.ts`
  - Приглашения (Accept Invitation e2e): `tsx scripts/seed-invitations.ts`

- Правила:
  - Мок‑данные не используются напрямую на фронтенде.
  - Источник правды — API бэкенда; JSON служит источником для сидинга/инициализации.
  - Расширение демо‑набора — через правку JSON и повторный сидинг.

- Расширение:
  1. Добавьте новые объекты в JSON.
  2. Запустите соответствующий сидер, чтобы обновить БД.
  3. Проверьте ответы API (см. `docs/DATABASE_SETUP.md`).

- Примечание: при отсутствии данных допустим fallback в сервисах (автозаполнение из JSON). Сейчас используется явный сидинг для предсказуемости тестов.
