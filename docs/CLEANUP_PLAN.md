# План очистки legacy-кода

Цель: оставить один бэкенд (NestJS в `src/server/**`), единый фронтовый API-клиент и удалить/архивировать дубли.

## Удалить (без переносов)
- `src/api/server.ts`, `src/api/simple-server.ts` — старые сервера Express
- `src/api/routes/**` — маршруты Express
- `src/api/controllers/**` — контроллеры Express
- `src/api/middleware/**` — middleware Express
- `src/api/database.ts`, `src/api/mockData.ts`, `src/api/validation/**` — утилиты Express
- `src/services/projectApi.ts` — дубль логики; оставить `src/api/services/projects.api.ts`
- Конфликтующие unit-тесты под Express/Jest (оставить e2e Playwright и актуальные unit фронта)

## Перенести (если используется)
- Из `src/api/services/**` оставить только клиенты, которые реально используются UI. Остальное — архивировать в `docs/archives/`.

## Оставить
- `src/api/client.ts` и `src/api/services/projects.api.ts` — единая точка фронтовых запросов к Nest
- Весь NestJS бэкенд: `src/server/**`

## Шаги
1. Удалить перечисленные legacy директории
2. Прогнать сборку сервера: `npm run nestjs:build`
3. Запустить dev-стек: `npm run dev:full`
4. Прогнать e2e: `npm run test:e2e`
5. Зафиксировать результаты в документации
