# Стандарты Playwright в проекте

Этот документ фиксирует терминологию и правила для e2e‑тестов фронтенда через браузер.

## Термины

- **Playwright**: фреймворк для автоматизации браузера (Chromium/Firefox/WebKit).
- **Playwright Test**: встроенный раннер тестов Playwright и конфигурация `playwright.config.ts`.
- **webServer**: секция конфигурации, которая поднимает dev‑серверы перед тестами.
- **baseURL**: базовый URL фронтенда, к которому обращаются тесты (у нас `http://localhost:5177`).
- **project**: профили окружений браузера (например, `chromium`).
- **trace/screenshot/video**: артефакты диагностики падений тестов.

## Порты и процессы

- Frontend (Vite): `5177` (строгий порт, `strictPort: true`).
- Backend (NestJS): `3001`.
- HMR: `24678`.

Если порт занят — процесс должен быть остановлен, затем перезапущен на зафиксированном порту. Автоматические попытки смены порта запрещены в тестовой среде.

## Структура

- Конфиг: корень репозитория — `playwright.config.ts`.
- Тесты e2e: `tests/e2e/**/*.spec.ts`.
- Визуальные тесты: `tests/visual/**/*.spec.ts` (отдельный конфиг: `playwright-visual.config.ts`).

## Скрипты npm

- `dev:api` — NestJS (порт 3001).
- `dev:situs` — Vite (порт 5177, strictPort=true).
- `dev:full` — параллельно frontend + backend (для локальной разработки).
- `test:e2e` — запуск Playwright.

Рекомендуемый порядок локального прогона: достаточно `npm run test:e2e` — webServer поднимет оба сервера автоматически.

## Конвенции тестов

- Использовать селекторы по ролям и aria‑меткам (`getByRole`, `getByLabel`) либо data‑атрибуты `data-testid`.
- Не полагаться на локаторы, завязанные на случайный текст/классы Tailwind.
- Отключать лишние сети/таймеры в тестах (debounce/анимации) при необходимости.

### Централизованные data-testid

- Все идентификаторы тестов задаются централизованно в `src/components/ui/testids.ts` и используются компонентами напрямую.
- Перечень ключевых id (на 2025‑08‑20):
  - menu: `menu-manager`, `menu-item`, `menu-type-select`, `menu-preview`, `menu-preview-role`, `menu-preview-language`, `menu-preview-style`, `menu-preview-stats`, `menu-drag-handle`
  - projects: `projects-list`, `project-card`, `project-status-toggle`, `project-detail-link`
  - pages: `project-pages`, `pages-search-input`, `pages-status-select`, `project-page-card`, `project-page-edit`
  - users: `users-container`, `users-search-input`, `users-role-select`, `users-status-select`, `users-table`, `users-row`, `users-edit`, `users-permissions`, `users-delete`
  - products: `products-tab-categories`, `products-tab-items`, `products-categories-section`, `products-items-section`, `products-create-category`, `products-create-item`, `products-item-row`

Примеры использования смотреть в `MenuManager.tsx`, `MenuItemRow.tsx`, `MenuPreview.tsx`, `ProjectsList.tsx`, `ProjectPages.tsx`, `SitusUsers.tsx`, `SitusProjectStore.tsx`.

## Отладка

- `PWDEBUG=1` или `npx playwright test --debug` — инспектор.
- Артефакты падений см. в `test-results/`.

## Примечания

- Для e2e запрещено использовать Jest. Все браузерные тесты — только Playwright Test.
- MCP Browser Tools допускается использовать как вспомогательный инструмент мониторинга, но эталон проверок — Playwright.

## Обязательные сценарии проекта

- Smoke: загрузка списка проектов, видимость кнопок, переход на детальную
- SSE: смена статуса через API и получение `project_status` в клиенте
- Realtime: синхронизация статуса между независимыми контекстами (обычный/инкогнито)
