# Тестирование проекта Situs

## Требования

- Node 18+
- Backend: 3002; Frontend: 5177 (Vite)
- Тестовая БД: изолированная (in-memory/локальная)

## Команды

- Backend: nestjs:build + serve:api:dist (PORT=3002)
- Frontend: dev:situs (5177)
- Unit/Integration: test, test:backend (Vitest)
- E2E: test:e2e (Playwright)

## Конфигурация

- Playwright: playwright.config.ts (webServer, proxy /api -> 3002)
- Vitest: vitest.config.ts, src/test-setup.ts

## Правила

- Не использовать Jest для e2e
- Мокировать внешние интеграции
- В NODE_ENV=test разрешён AUTH_TEST_TOKEN

## Быстрые проверки

- GET http://localhost:3002/health
- GET /api/projects/events
