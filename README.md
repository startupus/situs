# Situs

Платформа для управления проектами и продуктами (Website/Blog/Store) с фронтендом на React (Vite) и бэкендом на NestJS + Prisma. Реалтайм‑синхронизация без привязки к сессии через SSE.

## 🚀 Быстрый старт

### Предварительные требования
- Node.js 18+
- npm или yarn

### Установка и запуск

```bash
# Клонирование репозитория
git clone <repository-url>
cd Situs

# Установка зависимостей
npm install

# Генерация Prisma клиента и синхронизация схемы
npx prisma generate
npx prisma db push

# Демо-данные (проекты + Website + страницы)
npm run db:seed:demo

# Запуск backend (стабильно из dist, порт 3002)
npm run nestjs:build
PORT=3002 npm run serve:api:dist

# В новом терминале — запуск frontend (порт 5177)
npm run dev:situs
```

### Доступ к приложению
- **Frontend**: http://localhost:5177
- **Backend API**: http://localhost:3002
- **API Health Check**: http://localhost:3002/health

## 📁 Структура проекта

```
Situs/
├── src/                    # Frontend React приложение
│   ├── api/               # API слой
│   ├── components/        # React компоненты
│   ├── contexts/          # React контексты
│   ├── pages/             # Страницы приложения
│   └── ...
├── src/server/            # Backend (NestJS, единый бэкенд)
│   ├── projects/          # Проекты (CRUD, статус, доступы, события)
│   ├── pages/             # Website Pages API (список/PUT/reorder)
│   ├── realtime/          # Глобальная шина событий (SSE)
│   ├── database/          # Prisma service и модуль БД
│   ├── common/            # Фильтры/интерсепторы/пайпы
│   ├── health/            # Контроллер здоровья
│   └── main.ts            # Точка входа Nest
├── docs/                  # Документация
└── ...
```

### Где что лежит (быстрый навигатор)

- Backend (NestJS) — `src/server/`
  - `projects/` — проекты: контроллеры/сервисы/DTO, статус, публикация, события SSE
  - `pages/` — Website Pages API: список, редактирование, `PATCH /projects/:projectId/pages/reorder`
  - `products/` — каркас продуктов (Website/Shop/Blog)
  - `users/`, `auth/` — пользователи и аутентификация (подготовка к ролям/аккаунтам)
  - `realtime/` — события `GET /api/projects/events` (SSE) и heartbeat
  - `database/` — `PrismaService` и глобальный модуль БД
  - `common/` — глобальные фильтры/пайпы/интерсепторы
  - `health/` — `GET /health`
  - `config/` — конфиги (например, базы/портов)

- Frontend (React) — `src/`
  - `App.tsx` — корневой роутинг (в т.ч. `projects/:projectId/website`)
  - `api/` — клиентский API‑слой
    - `client.ts`, `client/ApiClient.ts` — HTTP‑клиент
    - `services/*.api.ts` — сервисы: `projects.api.ts`, `products.api.ts`, `analytics.api.ts` и др.
  - `components/` — компоненты приложения
    - `situs/` — рабочие экраны платформы (проекты, страницы, настройки)
    - `sections/` — крупные секции (например, `PagesSection.tsx`)
    - `ui/` — переиспользуемые UI‑элементы проекта (импорт как `@/components/ui/*`)
    - `dashy/` — шаблоны Dashy (интерфейс после логина)
    - `tailgrids/` — интеграционные компоненты под TailGrids
    - `redaktus/` — редактор и шаблоны сайта
      - `react-pro-components/` — большая библиотека TailGrids React Pro (адаптированная локально)
      - `website/` — шаблоны страниц сайта (страницы/секции)
      - `blog/`, `starter-components/`, `blocks/`, `admin/`, `config/`
  - `contexts/` — React контексты (проект, темы, пользователь и пр.)
  - `hooks/` — кастомные хуки (включая темизацию/интерфейс)
  - `i18n/` — локализации
  - `pages/` — верхнеуровневые страницы (например, селектор проекта)
  - `projects/` — список/создание проектов (frontend‑часть)
  - `services/projectApi.ts` — вспомогательный сервис проектов (исторически)
  - `styles/` — CSS для тем интерфейса и канвы
  - `mcp/` — интеграция MCP/Playwright инструментов

- Шаблоны и исходники UI/UX
  - `Upload/` — база внешних шаблонов и ресурсов (TailGrids React Pro, React templates и др.).
    - Используется как read‑only источник: компоненты копируются/адаптируются в `src/components/redaktus/react-pro-components/` и соседние каталоги.
    - Не импортируйте напрямую из `Upload/` в runtime.
  - `src/components/redaktus/react-pro-components/` — локальная библиотека адаптированных React‑компонентов (600+)
  - `src/components/dashy/` — шаблоны Dashy для внутреннего интерфейса после логина
  - `public/images/` — общие изображения/иконки

- Общие библиотеки
  - `libs/ui/` — зачатки UI‑библиотеки проекта
  - `libs/shared/` — общие утилиты/типы
  - `packages/core/`, `packages/plugins/` — пакеты для дальнейшей модульности (зарезервированы)

- База данных и миграции
  - `prisma/schema.prisma` — схема БД
  - `prisma/dev.db` — SQLite база для dev
  - `scripts/` — сиды/утилиты (`seed-demo-projects.ts` и пр.)

- Тестирование
  - `tests/e2e/` — Playwright E2E
  - `tests/unit/`, `tests/integration/`, `src/api/__tests__/` — unit/integration
  - `playwright.config.ts` — конфиг Playwright

- Сборка/конфиг
  - `vite.config.ts` — прокси `/api` → `http://localhost:3002`
  - `ecosystem.config.cjs` — pm2 (если используется)
  - `tsconfig*.json` — конфигурации TypeScript (frontend/backend)

## 🏗️ Архитектура

### Frontend
- **React 18** с TypeScript
- **React Router v6** для навигации
- **Tailwind CSS** для стилизации
- **Vite** для сборки и разработки

### Backend
- **Один бэкенд**: NestJS + TypeScript
- **Prisma** (SQLite для dev, `prisma/dev.db`)
- Модульная архитектура: projects, pages (Website), realtime, health, database, common
- Реалтайм через SSE: эндпоинт `GET /api/projects/events` (text/event-stream)

### Текущее состояние
- Backend (NestJS, `src/server/**`) — стабильный запуск из `dist/`
- Реалтайм: `GET /api/projects/events` + `GET /api/projects/heartbeat`
- Website Pages: `GET /api/projects/:projectId/pages` (фильтр по Product.type='WEBSITE'), `PATCH /api/projects/:projectId/pages/reorder`, `PUT /api/pages/:id`
- Статусы проектов: `PATCH /api/projects/:id/status` (+ событие `project_status`)

#### Frontend: источник правды
- Используется интерфейс в `src/components/situs/**` (страницы — `src/components/situs/pages/**`)
- Заголовок раздела теперь живёт в верхней панели (Header); дублирующий заголовок внутри страниц удалён
- UI‑библиотека: `src/components/ui/**` (импорт как `@/components/ui/...`). Сюда перенесён `SitusDarkModeToggle`.
- Папка `src/components/situs-new/**` удалена из исходников; маршруты удалены из `src/App.tsx`.

#### Realtime события (SSE)
- Endpoint: `GET /api/projects/events` (type: `text/event-stream`)
- События:
  - `sse_connected` — рукопожатие при подключении
  - `project_created` — создан проект (payload: id, name, status, ...)
  - `project_updated` — обновлён проект (имя, публикация и пр.)
  - `project_deleted` — удалён проект (payload: id)
  - `project_status` — смена статуса (payload: id, status)
  - `project_reordered` — изменён порядок (payload: id, orderIndex)

### Проект: модель и изоляция
- Проект — изолированная единица; действия внутри проекта не влияют на другие проекты
- Владение/доступы: `ownerId` и `ProjectAccess` (OWNER/ADMIN/EDITOR/VIEWER)
- Домены: `domain` (базовый субдомен), `customDomain` (кастом). При кастоме — 301 с базового домена
- Компоненты: `ProductType` (WEBSITE, ECOMMERCE, BLOG, LANDING)
- API: `PATCH /api/projects/:id/domains` для обновления доменных полей

#### API (основное)
- `GET /api/projects` — список (пагинация/фильтры)
- `GET /api/projects/:id` — один проект
- `POST /api/projects` — создание
- `PATCH /api/projects/:id` — частичное обновление (name/description/settings/status/publishedAt опциональны)
- `PATCH /api/projects/:id/status` — смена статуса (`ACTIVE|SUSPENDED|ARCHIVED|DELETED`), синхронизирует `isPublished`
- `PUT /api/projects/:id/publish` и `PUT /api/projects/:id/unpublish` — совместимость для публикации

### API и интеграция
- Централизованный API‑клиент (`src/api/client.ts`)
- Сервис проектов (`src/api/services/projects.api.ts`)
- Проксирование `/api` через Vite (dev) на `http://localhost:3002`
- SSE `/api/projects/events` для реалтайм‑синхронизации

## 🔧 Основные функции

### ✅ Реализовано
- **Проекты**: список (Prisma), создание, обновление, удаление
- **Карточки**: иконки активных продуктов, домен, DnD‑порядок, тумблер активности
- **Хедер/Сайдбар**: унифицированные отступы, поиск в хедере, кнопка `+`, меню пользователя
- **Реалтайм**: SSE без привязки к сессии (обычные/инкогнито, разные браузеры)
- **Тесты**: Playwright E2E (в т.ч. кросс‑контекстная синхронизация)

## 🧪 Проверка в dev

1) Запуск backend (Nest):
```bash
PORT=3002 npm run serve:api:dist
```
Проверка здоровья: `http://localhost:3002/health`

2) Запуск frontend (Vite):
```bash
npm run dev:situs
```
Frontend доступен на `http://localhost:5177`. Все запросы `/api/**` идут через proxy на порт 3002.

3) Реалтайм (SSE):
```bash
curl -N http://localhost:3001/api/projects/events?sub=cli
```
Переключение статуса проекта (`PATCH /api/projects/:id/status`) должно породить событие `project_status` во всех вкладках/браузерах.
Сохранение порядка перетаскиванием карточек публикует `project_reordered` и моментально обновляет порядок у всех клиентов.

## 🧹 Депрекации/чистка
- Удалены `.js`‑артефакты из `src/server/**` (оставлен только TypeScript‑код)
- Временные Express/минимальные сервера удалены; запуск — только через NestJS (`src/server/main.ts`)
- Папки `services/`, `backend/` и прочие устаревшие реализации не участвуют в dev‑старте


### 🚧 В разработке
- **Доступы**: GlobalRole, Account/AccountMembership/AgencyClient, Policies/Guards
- **Website UX**: создание/удаление/редактирование страниц, DnD‑сохранение, поиск/фильтры, пагинация
- **Shop**: каталог (товар/категория), отдельные API/UI
- **Домены**: привязка/валидация, sitemap/robots
- **Тесты**: Playwright E2E для потоков Projects→Website→Pages и SSE
- **Dev**: стабилизация ts/tsx dev‑рантайма, CI/CD (build + migrate + e2e)

## 📚 Документация

### Документация
- [Архитектура продуктов](./docs/PRODUCT_SCHEMAS.md)
- [План интеграции NestJS](./docs/NESTJS_INTEGRATION_PLAN.md)
- [Бизнес‑архитектура](./docs/BUSINESS_ARCHITECTURE.md)
- [Интеграция MCP](./docs/MCP_INTEGRATION.md)
- [Стандарты разработки](./docs/DEVELOPMENT_STANDARDS.md)
- [Техническое задание](./docs/TECHNICAL_SPECIFICATION.md)
- [Обзор docs](./docs/README.md)

### Архитектура
- [Структура компонентов](./src/components/README.md)
- [Система роутинга](./docs/ROUTING_ARCHITECTURE.md)
- [Темизация](./docs/THEME_SYSTEM.md)

### README модулей и разделов
- Backend:
  - Pages (Website): `src/server/pages/README.md`
  - Projects: `src/server/projects/README.md`
  - Auth: `src/server/auth/README.md`
  - Products: `src/server/products/README.md`
  - Database: `src/server/database/README.md`
  - Common: `src/server/common/README.md`
  - Realtime: `src/server/realtime/README.md`
  - Health: `src/server/health/README.md`
  - Users: `src/server/users/README.md`
- Frontend:
  - Redaktus: `src/components/redaktus/README.md`
  - Situs (экраны): `src/components/situs/README.md`
  - Sections: `src/components/sections/README.md`
  - UI: `src/components/ui/README.md`
  - Frontend API: `src/api/README.md`

## 🛠️ Разработка

### Команды
```bash
# Frontend (Vite)
npm run dev:situs

# Backend (NestJS из dist)
npm run nestjs:build && PORT=3002 npm run serve:api:dist

# Prisma
npx prisma generate && npx prisma db push && npm run db:seed:demo

# Тесты Playwright
npx playwright test
```

### Структура разработки
- **Модульная архитектура**: Каждый компонент изолирован
- **Типизация**: Полная TypeScript поддержка
- **API First**: Backend API как основа
- **Компонентный подход**: Переиспользуемые UI компоненты

## 🔄 Недавние изменения

### Prisma интеграция (Август 2024)
- ✅ Полное решение проблемы с базой данных
- ✅ Централизованная Prisma схема для всего проекта
- ✅ Реальные данные вместо моковых
- ✅ Модульные роутеры с CRUD операциями
- ✅ Правильная архитектура backend
- ✅ Успешная интеграция frontend-backend

### Правильная архитектура продуктов (Август 2024)
- ✅ Исправлена архитектура "Стартапус - Демо проект"
- ✅ Создан роутер продуктов (`/api/products`)
- ✅ Реализована иерархия: Проект → Продукт → Страницы
- ✅ Добавлены типы продуктов: WEBSITE, STORE, BLOG, APP, LANDING
- ✅ Интегрирована система аналитики для продуктов
- ✅ Создан frontend API сервис для продуктов

### Рефакторинг API структуры (Август 2024)
- ✅ Разделение больших файлов на модули
- ✅ Создание отдельных роутеров для API
- ✅ Исправление проблем роутинга
- ✅ Унификация форматов API ответов
- ✅ Устранение дублирования кода
- ✅ Улучшение типизации

### Результаты
- **Архитектура**: Правильная иерархия проектов и продуктов
- **Производительность**: Устранены дублирующиеся запросы
- **Поддерживаемость**: Четкая структура файлов
- **Масштабируемость**: Легко добавлять новые функции
- **Надежность**: Правильная обработка ошибок

## 🚀 Следующие шаги

1. **Расширение функциональности**
   - Визуальный редактор
   - Система пользователей
   - Управление файлами

2. **Оптимизация и улучшения**
   - Кэширование API
   - Оптимизация производительности
   - Улучшение UX

3. **Тестирование и документация**
   - Автоматические тесты
   - API документация
   - Руководства пользователя

## 📄 Лицензия

MIT License - см. файл [LICENSE](LICENSE) для деталей.

---

**Situs** — современная платформа управления проектами/продуктами  
**Статус**: активная разработка

# Situs Visual Website Builder

Платформа для управления проектами и продуктами (Website/Blog/Store) с фронтендом на React (Vite) и бэкендом на NestJS + Prisma. Реалтайм‑синхронизация без привязки к сессии через SSE.

## 🚀 Быстрый старт

### Предварительные требования
- Node.js 18+
- npm или yarn

### Установка и запуск

```bash
# Клонирование репозитория
git clone <repository-url>
cd Situs

# Установка зависимостей
npm install

# Генерация Prisma клиента и синхронизация схемы
npx prisma generate
npx prisma db push

# Демо-данные (проекты + Website + страницы)
npm run db:seed:demo

# Запуск backend (стабильно из dist, порт 3002)
npm run nestjs:build
PORT=3002 npm run serve:api:dist

# В новом терминале — запуск frontend (порт 5177)
npm run dev:situs
```

### Доступ к приложению
- **Frontend**: http://localhost:5177
- **Backend API**: http://localhost:3002
- **API Health Check**: http://localhost:3002/health

## 📁 Структура проекта

```
Situs/
├── src/                    # Frontend React приложение
│   ├── api/               # API слой
│   ├── components/        # React компоненты
│   ├── contexts/          # React контексты
│   ├── pages/             # Страницы приложения
│   └── ...
├── src/server/            # Backend (NestJS, единый бэкенд)
│   ├── projects/          # Проекты (CRUD, статус, доступы, события)
│   ├── pages/             # Website Pages API (список/PUT/reorder)
│   ├── realtime/          # Глобальная шина событий (SSE)
│   ├── database/          # Prisma service и модуль БД
│   ├── common/            # Фильтры/интерсепторы/пайпы
│   ├── health/            # Контроллер здоровья
│   └── main.ts            # Точка входа Nest
├── docs/                  # Документация
└── ...
```

### Где что лежит (быстрый навигатор)

- Backend (NestJS) — `src/server/`
  - `projects/` — проекты: контроллеры/сервисы/DTO, статус, публикация, события SSE
  - `pages/` — Website Pages API: список, редактирование, `PATCH /projects/:projectId/pages/reorder`
  - `products/` — каркас продуктов (Website/Shop/Blog)
  - `users/`, `auth/` — пользователи и аутентификация (подготовка к ролям/аккаунтам)
  - `realtime/` — события `GET /api/projects/events` (SSE) и heartbeat
  - `database/` — `PrismaService` и глобальный модуль БД
  - `common/` — глобальные фильтры/пайпы/интерсепторы
  - `health/` — `GET /health`
  - `config/` — конфиги (например, базы/портов)

- Frontend (React) — `src/`
  - `App.tsx` — корневой роутинг (в т.ч. `projects/:projectId/website`)
  - `api/` — клиентский API‑слой
    - `client.ts`, `client/ApiClient.ts` — HTTP‑клиент
    - `services/*.api.ts` — сервисы: `projects.api.ts`, `products.api.ts`, `analytics.api.ts` и др.
  - `components/` — компоненты приложения
    - `situs/` — рабочие экраны платформы (проекты, страницы, настройки)
    - `sections/` — крупные секции (например, `PagesSection.tsx`)
    - `ui/` — переиспользуемые UI‑элементы проекта (импорт как `@/components/ui/*`)
    - `dashy/` — шаблоны Dashy (интерфейс после логина)
    - `tailgrids/` — интеграционные компоненты под TailGrids
    - `redaktus/` — редактор и шаблоны сайта
      - `react-pro-components/` — большая библиотека TailGrids React Pro (адаптированная локально)
      - `website/` — шаблоны страниц сайта (страницы/секции)
      - `blog/`, `starter-components/`, `blocks/`, `admin/`, `config/`
  - `contexts/` — React контексты (проект, темы, пользователь и пр.)
  - `hooks/` — кастомные хуки (включая темизацию/интерфейс)
  - `i18n/` — локализации
  - `pages/` — верхнеуровневые страницы (например, селектор проекта)
  - `projects/` — список/создание проектов (frontend‑часть)
  - `services/projectApi.ts` — вспомогательный сервис проектов (исторически)
  - `styles/` — CSS для тем интерфейса и канвы
  - `mcp/` — интеграция MCP/Playwright инструментов

- Шаблоны и исходники UI/UX
  - `Upload/` — база внешних шаблонов и ресурсов (TailGrids React Pro, React templates и др.).
    - Используется как read‑only источник: компоненты копируются/адаптируются в `src/components/redaktus/react-pro-components/` и соседние каталоги.
    - Не импортируйте напрямую из `Upload/` в runtime.
  - `src/components/redaktus/react-pro-components/` — локальная библиотека адаптированных React‑компонентов (600+)
  - `src/components/dashy/` — шаблоны Dashy для внутреннего интерфейса после логина
  - `public/images/` — общие изображения/иконки

- Общие библиотеки
  - `libs/ui/` — зачатки UI‑библиотеки проекта
  - `libs/shared/` — общие утилиты/типы
  - `packages/core/`, `packages/plugins/` — пакеты для дальнейшей модульности (зарезервированы)

- База данных и миграции
  - `prisma/schema.prisma` — схема БД
  - `prisma/dev.db` — SQLite база для dev
  - `scripts/` — сиды/утилиты (`seed-demo-projects.ts` и пр.)

- Тестирование
  - `tests/e2e/` — Playwright E2E
  - `tests/unit/`, `tests/integration/`, `src/api/__tests__/` — unit/integration
  - `playwright.config.ts` — конфиг Playwright

- Сборка/конфиг
  - `vite.config.ts` — прокси `/api` → `http://localhost:3002`
  - `ecosystem.config.cjs` — pm2 (если используется)
  - `tsconfig*.json` — конфигурации TypeScript (frontend/backend)

## 🏗️ Архитектура

### Frontend
- **React 18** с TypeScript
- **React Router v6** для навигации
- **Tailwind CSS** для стилизации
- **Vite** для сборки и разработки

### Backend
- **Один бэкенд**: NestJS + TypeScript
- **Prisma** (SQLite для dev, `prisma/dev.db`)
- Модульная архитектура: projects, pages (Website), realtime, health, database, common
- Реалтайм через SSE: эндпоинт `GET /api/projects/events` (text/event-stream)

### Текущее состояние
- Backend (NestJS, `src/server/**`) — стабильный запуск из `dist/`
- Реалтайм: `GET /api/projects/events` + `GET /api/projects/heartbeat`
- Website Pages: `GET /api/projects/:projectId/pages` (фильтр по Product.type='WEBSITE'), `PATCH /api/projects/:projectId/pages/reorder`, `PUT /api/pages/:id`
- Статусы проектов: `PATCH /api/projects/:id/status` (+ событие `project_status`)

#### Frontend: источник правды
- Используется интерфейс в `src/components/situs/**` (страницы — `src/components/situs/pages/**`)
- Заголовок раздела теперь живёт в верхней панели (Header); дублирующий заголовок внутри страниц удалён
- UI‑библиотека: `src/components/ui/**` (импорт как `@/components/ui/...`). Сюда перенесён `SitusDarkModeToggle`.
- Папка `src/components/situs-new/**` удалена из исходников; маршруты удалены из `src/App.tsx`.

#### Realtime события (SSE)
- Endpoint: `GET /api/projects/events` (type: `text/event-stream`)
- События:
  - `sse_connected` — рукопожатие при подключении
  - `project_created` — создан проект (payload: id, name, status, ...)
  - `project_updated` — обновлён проект (имя, публикация и пр.)
  - `project_deleted` — удалён проект (payload: id)
  - `project_status` — смена статуса (payload: id, status)
  - `project_reordered` — изменён порядок (payload: id, orderIndex)

### Проект: модель и изоляция
- Проект — изолированная единица; действия внутри проекта не влияют на другие проекты
- Владение/доступы: `ownerId` и `ProjectAccess` (OWNER/ADMIN/EDITOR/VIEWER)
- Домены: `domain` (базовый субдомен), `customDomain` (кастом). При кастоме — 301 с базового домена
- Компоненты: `ProductType` (WEBSITE, ECOMMERCE, BLOG, LANDING)
- API: `PATCH /api/projects/:id/domains` для обновления доменных полей

#### API (основное)
- `GET /api/projects` — список (пагинация/фильтры)
- `GET /api/projects/:id` — один проект
- `POST /api/projects` — создание
- `PATCH /api/projects/:id` — частичное обновление (name/description/settings/status/publishedAt опциональны)
- `PATCH /api/projects/:id/status` — смена статуса (`ACTIVE|SUSPENDED|ARCHIVED|DELETED`), синхронизирует `isPublished`
- `PUT /api/projects/:id/publish` и `PUT /api/projects/:id/unpublish` — совместимость для публикации

### API и интеграция
- Централизованный API‑клиент (`src/api/client.ts`)
- Сервис проектов (`src/api/services/projects.api.ts`)
- Проксирование `/api` через Vite (dev) на `http://localhost:3002`
- SSE `/api/projects/events` для реалтайм‑синхронизации

## 🔧 Основные функции

### ✅ Реализовано
- **Проекты**: список (Prisma), создание, обновление, удаление
- **Карточки**: иконки активных продуктов, домен, DnD‑порядок, тумблер активности
- **Хедер/Сайдбар**: унифицированные отступы, поиск в хедере, кнопка `+`, меню пользователя
- **Реалтайм**: SSE без привязки к сессии (обычные/инкогнито, разные браузеры)
- **Тесты**: Playwright E2E (в т.ч. кросс‑контекстная синхронизация)

## 🧪 Проверка в dev

1) Запуск backend (Nest):
```bash
PORT=3002 npm run serve:api:dist
```
Проверка здоровья: `http://localhost:3002/health`

2) Запуск frontend (Vite):
```bash
npm run dev:situs
```
Frontend доступен на `http://localhost:5177`. Все запросы `/api/**` идут через proxy на порт 3002.

3) Реалтайм (SSE):
```bash
curl -N http://localhost:3001/api/projects/events?sub=cli
```
Переключение статуса проекта (`PATCH /api/projects/:id/status`) должно породить событие `project_status` во всех вкладках/браузерах.
Сохранение порядка перетаскиванием карточек публикует `project_reordered` и моментально обновляет порядок у всех клиентов.

## 🧹 Депрекации/чистка
- Удалены `.js`‑артефакты из `src/server/**` (оставлен только TypeScript‑код)
- Временные Express/минимальные сервера удалены; запуск — только через NestJS (`src/server/main.ts`)
- Папки `services/`, `backend/` и прочие устаревшие реализации не участвуют в dev‑старте


### 🚧 В разработке
- **Доступы**: GlobalRole, Account/AccountMembership/AgencyClient, Policies/Guards
- **Website UX**: создание/удаление/редактирование страниц, DnD‑сохранение, поиск/фильтры, пагинация
- **Shop**: каталог (товар/категория), отдельные API/UI
- **Домены**: привязка/валидация, sitemap/robots
- **Тесты**: Playwright E2E для потоков Projects→Website→Pages и SSE
- **Dev**: стабилизация ts/tsx dev‑рантайма, CI/CD (build + migrate + e2e)

## 📚 Документация

### Документация
- [Архитектура продуктов](./docs/PRODUCT_SCHEMAS.md)
- [План интеграции NestJS](./docs/NESTJS_INTEGRATION_PLAN.md)
- [Бизнес‑архитектура](./docs/BUSINESS_ARCHITECTURE.md)
- [Интеграция MCP](./docs/MCP_INTEGRATION.md)
- [Стандарты разработки](./docs/DEVELOPMENT_STANDARDS.md)
- [Техническое задание](./docs/TECHNICAL_SPECIFICATION.md)
- [Обзор docs](./docs/README.md)

### Архитектура
- [Структура компонентов](./src/components/README.md)
- [Система роутинга](./docs/ROUTING_ARCHITECTURE.md)
- [Темизация](./docs/THEME_SYSTEM.md)

### README модулей и разделов
- Backend:
  - Pages (Website): `src/server/pages/README.md`
  - Projects: `src/server/projects/README.md`
  - Auth: `src/server/auth/README.md`
  - Products: `src/server/products/README.md`
  - Database: `src/server/database/README.md`
  - Common: `src/server/common/README.md`
  - Realtime: `src/server/realtime/README.md`
  - Health: `src/server/health/README.md`
  - Users: `src/server/users/README.md`
- Frontend:
  - Redaktus: `src/components/redaktus/README.md`
  - Situs (экраны): `src/components/situs/README.md`
  - Sections: `src/components/sections/README.md`
  - UI: `src/components/ui/README.md`
  - Frontend API: `src/api/README.md`

## 🛠️ Разработка

### Команды
```bash
# Frontend (Vite)
npm run dev:situs

# Backend (NestJS из dist)
npm run nestjs:build && PORT=3002 npm run serve:api:dist

# Prisma
npx prisma generate && npx prisma db push && npm run db:seed:demo

# Тесты Playwright
npx playwright test
```

### Структура разработки
- **Модульная архитектура**: Каждый компонент изолирован
- **Типизация**: Полная TypeScript поддержка
- **API First**: Backend API как основа
- **Компонентный подход**: Переиспользуемые UI компоненты

## 🔄 Недавние изменения

### Prisma интеграция (Август 2024)
- ✅ Полное решение проблемы с базой данных
- ✅ Централизованная Prisma схема для всего проекта
- ✅ Реальные данные вместо моковых
- ✅ Модульные роутеры с CRUD операциями
- ✅ Правильная архитектура backend
- ✅ Успешная интеграция frontend-backend

### Правильная архитектура продуктов (Август 2024)
- ✅ Исправлена архитектура "Стартапус - Демо проект"
- ✅ Создан роутер продуктов (`/api/products`)
- ✅ Реализована иерархия: Проект → Продукт → Страницы
- ✅ Добавлены типы продуктов: WEBSITE, STORE, BLOG, APP, LANDING
- ✅ Интегрирована система аналитики для продуктов
- ✅ Создан frontend API сервис для продуктов

### Рефакторинг API структуры (Август 2024)
- ✅ Разделение больших файлов на модули
- ✅ Создание отдельных роутеров для API
- ✅ Исправление проблем роутинга
- ✅ Унификация форматов API ответов
- ✅ Устранение дублирования кода
- ✅ Улучшение типизации

### Результаты
- **Архитектура**: Правильная иерархия проектов и продуктов
- **Производительность**: Устранены дублирующиеся запросы
- **Поддерживаемость**: Четкая структура файлов
- **Масштабируемость**: Легко добавлять новые функции
- **Надежность**: Правильная обработка ошибок

## 🚀 Следующие шаги

1. **Расширение функциональности**
   - Визуальный редактор
   - Система пользователей
   - Управление файлами

2. **Оптимизация и улучшения**
   - Кэширование API
   - Оптимизация производительности
   - Улучшение UX

3. **Тестирование и документация**
   - Автоматические тесты
   - API документация
   - Руководства пользователя

## 📄 Лицензия

MIT License - см. файл [LICENSE](LICENSE) для деталей.

---

**Situs** — современная платформа управления проектами/продуктами  
**Статус**: активная разработка

### Config & Env Validation

- Env schema validation via Joi in `src/server/config/env.validation.ts`.
- CORS origins: set `CORS_ORIGINS=http://localhost:5177,http://localhost:3000`.
- Rate limiting knobs (reserved): `RATE_LIMIT_WINDOW_MS`, `RATE_LIMIT_MAX_REQUESTS`.
