# ТЗ: Перевод фронтенда с мок‑данных на API бэка (JSON → API)

Цель: добиться 100% получения данных фронтендом через API бэка. Временные данные хранятся централизованно на бэке (JSON/демо‑модуль) и отдаются по эндпоинтам. Это позволяет по разделам понимать, какие полноценные модули требуется реализовать вместо моков.

## Область работ

- Поиск всех мест фронтенда, где используются:
  - локальные массивы/объекты с данными (mock, demo, placeholder)
  - статический контент, влияющий на логику (списки/таблицы/карточки)
- Замена на загрузку через API:
  - временно: `GET /api/demo/*` (DemoModule)
  - финально: соответствующие реальные доменные API (после их реализации)
- Стандартизация: использовать только переменные (состояние), тексты в UI — либо из API, либо из i18n.

## Источники и контракты

- JSON демо: `src/server/demo-data/startapus/*.json` — сидируются в Prisma
- DemoModule: `src/server/demo/*`
  - `GET /api/demo/websites`
  - `GET /api/demo/stores`
  - `GET /api/demo/orders`
  - `GET /api/demo/products`
  - `GET /api/demo/support-tickets`
- Клиент: `src/api/services/demo.api.ts`

## Скоуп 1 (быстрый перевод на Demo API)

- Страницы:
  - `src/components/situs/pages/SitusWebsites.tsx` → DEMO API (готово)
  - `src/components/situs/pages/SitusStores.tsx` → DEMO API (готово)
  - `src/components/sections/OrdersSection.tsx` → DEMO API (готово)
  - `src/components/situs/pages/SitusSupport.tsx` → DEMO API (перевести)
  - `src/components/sections/EcommerceSection.tsx` → DEMO API (перевести)
- Удалить локальные мок‑массивы после перевода.

## Скоуп 2 (реальные модули)

- Для каждого раздела определить целевые доменные API:
  - Orders: `/api/orders` (фильтры, пагинация)
  - Support: `/api/support/tickets` (CRUD/статусы)
  - Ecommerce: `/api/products`, `/api/categories` (CRUD/stock/filters)
  - Websites: `/api/pages`, `/api/website/*` (уточнить требования)
- Создать схемы в Prisma, сервисы, контроллеры, миграции.
- Обновить фронтенд на использование реальных сервисов; Demo API отключить.

## Требования к реализации

- Фронтенд:
  - Только через API; запрет на хардкод массивов данных
  - Загрузка данных в `useEffect`/RTK Query/Zustand (по текущей архитектуре — `useEffect` + API слой)
  - Состояние: типизировано; тексты — через i18n/переменные
- Бэкенд:
  - Временный `DemoModule` публичный (`@Public()`)
  - Реальные модули — под защитой Guard’ов/ролей/скоупов
- Тестирование:
  - Playwright e2e: smoke для страниц, где был переход с моков
  - Бэкенд e2e: проверка ответов Demo API

## Критерии приёмки

- [ ] Поиск моков: перечень файлов/строк с удалёнными массивами
- [ ] Все целевые страницы получают данные по API
- [ ] В README и DEMO_DATA.md отражён подход (JSON → API)
- [ ] Playwright e2e зелёные для затронутых страниц

## Ссылки

- `docs/DEMO_DATA.md` — описание демо‑данных и DemoModule
- `src/api/services/demo.api.ts` — клиент Demo API
