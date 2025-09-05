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

### Запуск в Docker (рекомендуется для демо)

```bash
# 1) Поднять стек (Postgres, API, Web)
docker compose up -d --build

# 2) Проверка здоровья API
curl -sf http://localhost:3002/health && echo "API OK"

# 3) Открыть UI
# Веб-интерфейс доступен на http://localhost:5178/
open http://localhost:5178/projects 2>/dev/null || xdg-open http://localhost:5178/projects 2>/dev/null || true
```

Учётные данные для входа:

- Email: `qa+admin2@situs.local` Пароль: `Admin123!`
- Email: `admin@situs.local` Пароль: `Admin123!`

Примечания:

- Контейнер API автоматически накатывает миграции и сиды (системный проект админки, демо‑проекты, стартовые меню).
- Проксирование `/api` настроено через Nginx в контейнере `situs-web`.
- UI по умолчанию на порту `5178` (см. `docker-compose.yml`).

### Доступ к приложению

- **Frontend (dev)**: http://localhost:5177
- **Frontend (Docker)**: http://localhost:5178
- **Backend API**: http://localhost:3002
- **API Health Check**: http://localhost:3002/health

### Проверка работоспособности

```bash
# Автоматическая проверка всех сервисов
node scripts/health-monitor.js

# Или через npm script
npm run health:check
```

### Основные npm скрипты

```bash
# Разработка
npm run dev:situs          # Frontend (Vite, порт 5177)
npm run dev:api:watch      # Backend (NestJS, порт 3002)
npm run dev:full           # Оба сервиса одновременно
```

# Сборка

npm run build # Frontend сборка
npm run build:safe # Сборка с проверкой TypeScript
npm run nestjs:build # Backend сборка

```

# Окружения
npm run env:dev            # Настройка development
npm run env:prod           # Настройка production
npm run env:docker         # Настройка Docker
```

# Валидация и мониторинг

npm run validate:build # Валидация конфигурации
npm run validate:pre-deploy # Полная проверка перед деплоем
npm run health:check # Быстрая проверка сервисов

```

# Тестирование
npm run test:e2e           # E2E тесты (Playwright)
npm run test               # Unit тесты (Vitest)
```

# База данных

npm run db:push # Синхронизация схемы
npm run db:seed:admin # Сид админ данных
npm run db:seed:demo # Демо данные

```

## ✨ Основные возможности

### 🔐 Система аутентификации

- **Вход по паролю**: поддержка email и телефона с табами переключения
- **Вход по коду**: двухшаговый процесс с автоматической отправкой кода
- **Восстановление пароля**: многошаговый процесс через email/телефон
- **Публичная регистрация**: регистрация с прогресс-баром и подтверждением
- **Безопасность**: хеширование паролей, временные коды, валидация
- **Подробнее**: [docs/AUTHENTICATION.md](docs/AUTHENTICATION.md)

### 👥 Система пользователей и приглашений

- **Управление пользователями**: просмотр, фильтрация, массовые операции
- **Гибкая система ролей**: SUPER_ADMIN, STAFF, AGENCY, BUSINESS
- **Статусы пользователей**: активные, заблокированные, ожидающие активации
- **Приглашения**: отправка приглашений с выбором роли и персональным сообщением
- **Два способа регистрации**:
  - По коду подтверждения (без пароля)
  - С созданием пароля
- **Многоканальные приглашения**: Email (MVP), SMS, Telegram, WhatsApp (в разработке)

📖 **[Подробная документация по пользователям и приглашениям](docs/USERS_AND_INVITATIONS.md)**

### 🎨 Система управления меню

- **Модульная архитектура**: типы меню, пункты меню, drag & drop
- **Иерархическая структура**: вложенные пункты с неограниченной глубиной
- **Real-time синхронизация**: изменения отображаются мгновенно через SSE
- **Пакетные операции**: массовое изменение статусов, удаление

📖 **[Подробная документация по системе меню](src/components/admin/menu/README.md)**

### 🚀 Проекты и продукты

- **Управление проектами**: создание, редактирование, архивирование, привязка доменного имени и серверные настройки
- **Типы продуктов**: Page, Blog, Store

## 📁 Структура проекта

```

Situs/
├── src/ # Frontend React приложение
│ ├── api/ # API слой
│ ├── components/ # React компоненты
│ ├── contexts/ # React контексты
│ ├── pages/ # Страницы приложения
│ └── ...
├── src/server/ # Backend (NestJS, единый бэкенд)
│ ├── projects/ # Проекты (CRUD, статус, доступы, события)
│ ├── pages/ # Website Pages API (список/PUT/reorder)
│ ├── realtime/ # Глобальная шина событий (SSE)
│ ├── database/ # Prisma service и модуль БД
│ ├── common/ # Фильтры/интерсепторы/пайпы
│ ├── health/ # Контроллер здоровья
│ └── main.ts # Точка входа Nest
├── docs/ # Документация
└── ...

````

### Где что лежит (быстрый навигатор)

- Backend (NestJS) — `src/server/`
  - `projects/` — проекты: контроллеры/сервисы/DTO, статус, публикация, события SSE
  - `pages/` — Website Pages API: список, редактирование, `PATCH /projects/:projectId/pages/reorder`
  - `products/` — каркас продуктов (Website/Shop/Blog)
  - `users/`, `auth/` — пользователи и аутентификация (JWT, Local strategy)
  - `accounts/` — аккаунты, членства и связи «агентство ↔ клиент» (Accounts, AccountMemberships, AgencyClients)
  - `domains/` — проверки и поведение доменов
  - `seo/` — публичные SEO‑эндпоинты (robots.txt, sitemap.xml с ETag/Cache‑Control)
  - `realtime/` — события `GET /api/projects/events` (SSE) и heartbeat
  - `database/` — `PrismaService` и глобальный модуль БД
  - `common/` — глобальные фильтры/пайпы/интерсепторы
  - `health/` — `GET /health`
  - `config/` — конфиги (`env.validation.ts`, `cors.config.ts`, `rate-limit.config.ts`, `access.config.ts`)

- Frontend (React) — `src/`
  - `App.tsx` — корневой роутинг (в т.ч. `projects/:projectId/website`)
  - `api/` — клиентский API‑слой
    - `client.ts`, `client/ApiClient.ts` — HTTP‑клиент
    - `services/*.api.ts` — сервисы: `projects.api.ts`, `products.api.ts`, `analytics.api.ts` и др.
  - `components/` — компоненты приложения
    - `situs/` — рабочие экраны платформы (проекты, страницы, настройки)
    - `admin/` — административные компоненты
      - `menu/` — **Система управления меню** (модульная архитектура)
        - `MenuManager.tsx` — главный контейнер-оркестратор (~366 строк)
        - `MenuTypesTab.tsx` — управление типами меню с пакетной обработкой
        - `MenuItemsTab.tsx` — управление пунктами меню
        - `MenuManagerModals.tsx` — централизованные модальные окна
        - `MenuItemsList.tsx` — список и карточки пунктов
        - `drag-drop/` — **Модульная система Drag & Drop**
          - `MenuItemDragDrop.tsx` — основной D&D контейнер
          - `MenuItemRow.tsx` — компонент отдельного пункта меню с коллапсом
          - `useDragDrop.ts` — хук управления состоянием D&D
          - `utils.ts` — утилиты для построения иерархии
          - `types.ts` — типы для D&D системы
          - `index.ts` — экспорты модуля
        - `EditMenuItemModal.tsx` — модальное окно редактирования (корпоративные компоненты)
        - `README.md` — подробная документация архитектуры
    - `sections/` — крупные секции (например, `PagesSection.tsx`)
    - `ui/` — переиспользуемые UI‑элементы проекта (импорт как `@/components/ui/*`)
      - `ToggleSwitch.tsx` — корпоративный тумблер на основе TailGrids
      - `BatchActions.tsx` — компонент пакетной обработки элементов
      - `CorporateInput.tsx` — корпоративный текстовый инпут
      - `CorporateSelect.tsx` — корпоративный селектор (dropdown)
      - `CorporateTextarea.tsx` — корпоративная многострочная область ввода
    - `dashy/` — шаблоны Dashy (интерфейс после логина)
    - `tailgrids/` — интеграционные компоненты под TailGrids
    - `redaktus/` — редактор и шаблоны сайта
      - `react-pro-components/` — большая библиотека TailGrids React Pro (адаптированная локально)
      - `website/` — шаблоны страниц сайта (страницы/секции)
      - `blog/`, `starter-components/`, `blocks/`, `admin/`, `config/`
  - `contexts/` — React контексты (проект, темы, пользователь и пр.)
  - `hooks/` — кастомные хуки (включая темизацию/интерфейс)
    - `useMenuSystemRealtime.ts` — real-time синхронизация меню через SSE
    - `useMenuAPI.ts` — централизованные API операции для системы меню
    - `useMenuManagerState.ts` — управление состоянием MenuManager
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
  - PostgreSQL 15 — основная база данных
  - `scripts/` — сиды/утилиты (`seed-demo-projects.ts` и пр.)

- Мониторинг и автоматизация
  - `scripts/health-monitor.js` — автоматический мониторинг здоровья сервисов
  - `scripts/setup-environment.sh` — настройка окружений (dev/prod/docker)
  - `scripts/validate-build.js` — валидация сборки с уведомлениями об ошибках

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
- **Prisma** (PostgreSQL)
- Модульная архитектура: projects, pages (Website), realtime, health, database, common
- Реалтайм через SSE: эндпоинт `GET /api/projects/events` (text/event-stream)

### Мониторинг и Health Checks

- **Health Monitor Service**: `scripts/health-monitor.js`
- **Автоматическая диагностика** всех сервисов (API, Frontend, Prisma Studio)
- **Мониторинг Docker контейнеров** и системных ресурсов
- **Генерация отчетов** для анализа проблем и трендов
- **Непрерывный мониторинг** в production окружениях

#### Security & Access

- Глобальные Guard’ы: `JwtAuthGuard`, `RolesGuard`, `PoliciesGuard` (+ `ThrottlerGuard`)
- Декораторы: `@Public()`, `@Roles()`, `@Scopes()`
- Поведение окружений:
  - development: упрощённый доступ (bypass в `JwtAuthGuard`)
  - test: строгая проверка, поддержка `AUTH_TEST_TOKEN` для e2e
  - production: строгая проверка ролей/скоупов
- CORS из `cors.config.ts`, лимиты запросов из `rate-limit.config.ts`, валидация ENV через `env.validation.ts`

#### SEO & Domains

- Публичные эндпоинты: `GET /robots.txt`, `GET /sitemap.xml` (ETag/Cache‑Control, 304 при `If-None-Match`)
- Middleware:
  - `DomainRedirectMiddleware` — условный 301 с `project.domain` на `project.customDomain` (если опубликован и домен верифицирован)
  - `TenantResolverMiddleware` — резолв арендатора по Host/домену (добавляет `tenant.projectId`/`tenant.productId` в `req`)

### Текущее состояние

- Backend (NestJS, `src/server/**`) — стабильный запуск из `dist/`
- Реалтайм: `GET /api/projects/events` + `GET /api/projects/heartbeat`
- Website Pages: полный CRUD — создание/редактирование/удаление страниц с UI
- Статусы проектов: `PATCH /api/projects/:id/status` (+ событие `project_status`)
- Валидация DTO: все эндпоинты используют `class-validator`
- Единый формат ошибок: `GlobalExceptionFilter` с traceId и структурированными ответами
- Авторизация: `@Roles()`, `@Scopes()` декораторы активно используются, Guards настроены
- UI стандартизация: компоненты в `@/components/ui/*`, артефакты очищены

#### Frontend: источник правды

- Используется интерфейс в `src/components/situs/**` (страницы — `src/components/situs/pages/**`)
- Заголовок раздела теперь живёт в верхней панели (Header); дублирующий заголовок внутри страниц удалён
- UI‑библиотека: `src/components/ui/**` (импорт как `@/components/ui/...`). Сюда перенесён `SitusDarkModeToggle`.
- Папка `src/components/situs-new/**` удалена из исходников; маршруты удалены из `src/App.tsx`.

- #### Realtime события (SSE)
- Endpoint: `GET /api/projects/events` и `GET /api/realtime/integrations` (type: `text/event-stream`)
- События:
  - `sse_connected` — рукопожатие при подключении
  - `project_created` — создан проект (payload: id, name, status, ...)
  - `project_updated` — обновлён проект (имя, публикация и пр.)
  - `project_deleted` — удалён проект (payload: id)
  - `project_status` — смена статуса (payload: id, status)
  - `project_reordered` — изменён порядок (payload: id, orderIndex)
  - `integration_created|updated|deleted|status_changed` — события интеграций

### Проект: модель и изоляция

- Проект — изолированная единица; действия внутри проекта не влияют на другие проекты
- Владение/доступы: `ownerId` и `ProjectAccess` (OWNER/ADMIN/EDITOR/VIEWER)
- Домены: `domain` (базовый субдомен), `customDomain` (кастом). При кастоме — 301 с базового домена
- Компоненты: `ProductType` (WEBSITE, ECOMMERCE, BLOG, LANDING)
- API: `PATCH /api/projects/:id/domains` для обновления доменных полей

### Система ролей и доступов

#### Глобальные роли (GlobalRole)

- `SUPER_ADMIN` — полный доступ ко всей системе
- `STAFF` — доступ к административным функциям
- `AGENCY` — агентство, может управлять клиентскими аккаунтами
- `BUSINESS` — обычный бизнес-пользователь

#### Роли проекта (ProjectRole)

- `OWNER` — владелец проекта, полные права
- `ADMIN` — администратор проекта
- `EDITOR` — редактор контента
- `VIEWER` — только просмотр

#### Роли аккаунта (AccountRole)

- `OWNER` — владелец аккаунта
- `ADMIN` — администратор аккаунта
- `MEMBER` — участник аккаунта

#### Скоупы доступа

- **Project scopes**: `PROJECT_READ`, `PROJECT_WRITE`, `PROJECT_ADMIN`
- **Account scopes**: `ACCOUNT_READ`, `ACCOUNT_WRITE`, `ACCOUNT_ADMIN`

### Архитектура продуктов

#### Иерархия: Project → Product → Page

- **Project** — контейнер верхнего уровня (домен, настройки, владение)
- **Product** — функциональный модуль внутри проекта
- **Page** — контентная единица внутри продукта

#### Типы продуктов (ProductType)

- `WEBSITE` — корпоративный сайт, лендинг, блог
- `ECOMMERCE` — интернет-магазин
- `BLOG` — блог-платформа
- `LANDING` — посадочные страницы

#### Website Pages API

- `GET /api/projects/:projectId/pages` — список страниц Website
- `POST /api/pages` — создание новой страницы
- `PUT /api/pages/:id` — обновление страницы
- `DELETE /api/pages/:id` — удаление страницы (защищено от удаления главной)
- `PATCH /api/projects/:projectId/pages/reorder` — DnD сохранение порядка

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
- SSE:
  - `/api/projects/events` — события проектов (status/update/reorder)
  - `/api/realtime/integrations` — события интеграций (created/updated/deleted/status_changed)

## 🎨 Дизайн и стилизация

### Система темизации

- **Глобальные CSS переменные** в `src/index.css`
- **Контекст темы** в `src/contexts/ThemeContext.tsx`
- **Адаптивная темная/светлая тема** с автопереключением
- **Кастомизация цветов** через админ-панель

### Стандартные компоненты темы

- **Базовые компоненты** в `src/styles/theme-components.css`
- **Единообразие интерфейса** на основе @react-pro-components-main
- **CSS классы-утилиты** для быстрой разработки:
  - `.btn-primary`, `.btn-secondary`, `.btn-outline`, `.btn-ghost` - кнопки
  - `.input-field`, `.input-label`, `.select-field` - поля ввода и селекторы
  - `.modal-overlay`, `.modal-content`, `.modal-header` - модальные окна
  - `.card`, `.section-primary`, `.info-block` - карточки и блоки
  - `.tabs-container`, `.view-switcher` - вкладки и переключатели
  - `.grid-2`, `.grid-3`, `.grid-4` - сетки
  - `.text-primary`, `.text-secondary`, `.text-muted` - типографика

### Правила стилизации

- **Запрет эмодзи** в интерфейсе - используйте React Icons (react-icons/fi)
- **Корпоративные стандарты** - все компоненты должны использовать классы из theme-components.css
- **Глобальные настройки темы** - все цвета и стили подчиняются настройкам темы
- **Адаптивность** - все компоненты должны корректно работать в светлой и темной теме

### Корпоративные стандарты интерфейса

- **Заголовки страниц**: Верхняя панель всегда выводит заголовок текущего раздела
- **Вкладки и заголовки**: При переключении вкладок заголовок в верхней панели должен изменяться соответственно
- **Навигация**: Единообразие в отображении заголовков и хлебных крошек

## 🔧 Основные функции

### ✅ Реализовано

- **Проекты**: список (Prisma), создание, обновление, удаление
- **Карточки**: иконки активных продуктов, домен, DnD‑порядок, тумблер активности
- **Хедер/Сайдбар**: унифицированные отступы, поиск в хедере, кнопка `+`, меню пользователя
- **Реалтайм**: SSE без привязки к сессии (обычные/инкогнито, разные браузеры)
- **Интеграции**: каталог провайдеров (EMAIL_SMTP, N8N), CRUD, healthCheck, SSE обновление статусов, связка с инвайтами
- **Тесты**: Playwright E2E (в т.ч. кросс‑контекстная синхронизация)

## 🧪 Проверка в dev

1. Запуск backend (Nest):

```bash
PORT=3002 npm run serve:api:dist
````

Проверка здоровья: `http://localhost:3002/health`

2. Запуск frontend (Vite):

```bash
npm run dev:situs
```

Frontend доступен на `http://localhost:5177`. Все запросы `/api/**` идут через proxy на порт 3002.

3. Реалтайм (SSE):

```bash
curl -N http://localhost:3001/api/projects/events?sub=cli
```

Переключение статуса проекта (`PATCH /api/projects/:id/status`) должно породить событие `project_status` во всех вкладках/браузерах.
Сохранение порядка перетаскиванием карточек публикует `project_reordered` и моментально обновляет порядок у всех клиентов.

4. Тесты

```bash
# Backend e2e/unit (Vitest)
npm run test            # быстрый прогон __tests__
npm run test:backend    # старт API в NODE_ENV=test и запуск Vitest

# Playwright e2e (webServer поднимается автоматически)
npm run test:e2e
```

Примечания к тестам:

- В test‑окружении `AUTH_TEST_TOKEN=test-token-12345` можно использовать как Bearer для приватных ручек.
- Публичные эндпоинты: `/`, `/health`, `/robots.txt`, `/sitemap.xml`, `/api/projects/events`, `/api/projects/heartbeat`.

## 🧹 Депрекации/чистка

- Удалены `.js`‑артефакты из `src/server/**` (оставлен только TypeScript‑код)
- Временные Express/минимальные сервера удалены; запуск — только через NestJS (`src/server/main.ts`)
- Папки `services/`, `backend/` и прочие устаревшие реализации не участвуют в dev‑старте

### 🚧 В разработке

- **Shop**: каталог (товар/категория), отдельные API/UI
- **Домены**: привязка/валидация, sitemap/robots генерация
- **Website UX**: DnD‑сохранение порядка страниц, поиск/фильтры, пагинация
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
- [Демо‑данные и подход к мокам (JSON → API)](./docs/DEMO_DATA.md)
- [Auth и домены (роли/скоупы, публичные маршруты, редиректы)](./docs/AUTH_AND_DOMAINS.md)
- [Заметки по Swagger (планы интеграции)](./docs/SWAGGER_NOTES.md)
- [Стандарты Playwright](./docs/testing/PLAYWRIGHT_STANDARDS.md)

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
  - Accounts: `src/server/accounts/README.md`
  - Domains: `src/server/domains/README.md`
  - SEO: `src/server/seo/README.md`
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

## 🎨 Корпоративные стандарты интерфейса

### Система тем и стилизации

#### Глобальные настройки темы

- **Основа**: TailGrids Pro компоненты с поддержкой темной/светлой темы
- **Переменные**: CSS-переменные для динамического изменения цветов (`--color-primary`, `--color-secondary`, и т.д.)
- **Контексты**: `AdminThemeContext`, `ThemeContext`, `ProjectThemeContext` для управления темами на разных уровнях
- **Автопереключение**: Следование системным настройкам браузера по умолчанию
- **Принудительное переключение**: Возможность форсированного изменения темы через интерфейс

#### Стандартные компоненты

- **Расположение**: `src/styles/theme-components.css` - центральное место для корпоративных стилей
- **Компоненты**: Кнопки, поля ввода, модальные окна, карточки, вкладки, сетки, типографика
- **Принцип**: Использование готовых TailGrids компонентов вместо кастомных CSS с `!important`
- **Тумблеры**: Корпоративный компонент `ToggleSwitch` для переключателей состояния
- **Пакетная обработка**: Универсальный компонент `BatchActions` для массовых операций

#### Правила стилизации

- **Запрет эмодзи**: Использование только React Icons (`react-icons/fi`) в интерфейсе
- **Иконки**: Консистентная иконография через `react-icons`
- **Цвета**: Только через CSS-переменные, без хардкода
- **Адаптивность**: Поддержка всех размеров экранов через TailGrids стандарты

### Логика верхней панели навигации

#### Динамические заголовки страниц

- **Принцип**: Верхняя панель всегда отображает заголовок текущего раздела
- **Переключение по вкладкам**: Заголовок автоматически меняется при переключении вкладок
- **Примеры**:
  - Вкладка "Пункты меню" → "Управление пунктами меню"
  - Вкладка "Типы меню" → "Управление типами меню"
- **Реализация**: Через `useMemo` с зависимостями от `location.search` и активной вкладки

#### Кнопка создания "+"

- **Контекстность**: Кнопка "+" создает элементы в зависимости от активного раздела/вкладки
- **События**: Использование `CustomEvent` для межкомпонентной коммуникации
- **Примеры**:
  - На вкладке "Пункты меню" → создание пункта меню
  - На вкладке "Типы меню" → создание типа меню
  - На странице проектов → создание проекта

#### Навигация "Назад"

- **Корректные ссылки**: Ведут в правильный контекст (конкретный проект, а не общий список)
- **Хлебные крошки**: Отражают реальную иерархию навигации

### Архитектурные принципы

#### Управление состоянием

- **Локальное состояние**: `useState` для компонентного состояния
- **Глобальное состояние**: Контексты React для тем и настроек
- **URL-состояние**: Активные вкладки и фильтры через URL параметры
- **Серверное состояние**: SSE (Server-Sent Events) для реального времени

#### Компонентная архитектура

- **Разделение ответственности**: Четкое разделение UI, логики и данных
- **Переиспользование**: Универсальные компоненты (`ToggleSwitch`, `BatchActions`)
- **Типизация**: Строгая типизация TypeScript для всех компонентов
- **Тестируемость**: Компоненты должны легко тестироваться

#### Стандарты разработки

- **Файловая структура**: Логическая группировка по функциональности
- **Именование**: Понятные и консистентные имена файлов и компонентов
- **Документация**: README файлы в каждой папке с описанием содержимого
- **Комментирование**: Обязательные комментарии для сложной логики
- **Модульность**: Разбиение больших файлов (>400 строк) на логические компоненты

#### Модульная архитектура (на примере системы меню)

##### Принципы рефакторинга

- **Разделение ответственности**: API, состояние и UI в отдельных модулях
- **Переиспользование**: Хуки для API операций и управления состоянием
- **Тестируемость**: Независимые модули легче тестировать
- **Масштабируемость**: Новые функции добавляются без изменения существующего кода

##### Структура хуков

```typescript
// useMenuAPI.ts (~250 строк) - Централизованные API операции
- handleCreateMenuItem, handleUpdateMenuItem, handleDeleteMenuItem
- handleCreateMenuType, handleUpdateMenuType, handleDeleteMenuType
- handleBatchToggleMenuTypeStatus, handleBatchDeleteMenuTypes
- Единая обработка ошибок и типизация

// useMenuManagerState.ts (~100 строк) - Управление состоянием
- selectedMenuType, showModals, editingItems, displayStyle
- activeTab с URL синхронизацией
- autoSelectMainMenu, modal handlers
- События от header кнопки "+"

// useMenuSystemRealtime.ts - SSE синхронизация
- Real-time обновления через Server-Sent Events
- Автоматическая синхронизация между клиентами
```

##### Компоненты-оркестраторы

```typescript
// MenuManager.tsx (~200 строк) - Главный оркестратор
- Координация между компонентами
- Интеграция хуков (API + State + Realtime)
- Обработка ошибок и SSE событий
- Рендеринг структуры интерфейса

// MenuItemsTab.tsx - Управление пунктами меню
- Отображение списка пунктов
- Drag & Drop функциональность
- Предпросмотр меню

// MenuTypesTab.tsx - Управление типами меню
- Список типов с метаданными
- Пакетная обработка (статус, удаление)
- Тумблеры активности

// MenuManagerModals.tsx - Централизованные модальные окна
- Создание и редактирование пунктов/типов
- Подтверждение удаления
- Единая точка управления модалами
```

##### Drag & Drop архитектура

```typescript
// src/components/admin/menu/drag-drop/
├── types.ts                 // Типы для D&D системы
├── useDragDrop.ts          // Хук управления состоянием D&D
├── MenuItemRow.tsx         // Компонент отдельного пункта меню
├── MenuItemDragDrop.tsx    // Основной D&D контейнер
├── utils.ts                // Утилиты для построения иерархии
└── index.ts                // Экспорты модуля

// Принципы модульности:
- Разделение логики D&D от UI компонентов
- Переиспользуемые типы и утилиты
- Изоляция событий для предотвращения конфликтов
- Поддержка бесконечной вложенности (как в Joomla)
```

##### Результаты рефакторинга

- **Было**: 1 файл, 491 строка, смешанная логика
- **Стало**: 3 хука + 4 компонента + модульная D&D система, четкое разделение ответственности
- **Преимущества**: Переиспользование, тестируемость, читаемость, модульность
- **Производительность**: Параллельные API вызовы, оптимизированные ре-рендеры
- **D&D улучшения**: Правильная иерархия, изоляция событий, корпоративная стилизация

### Пользовательский опыт (UX)

#### Интерактивность

- **Обратная связь**: Визуальные индикаторы для всех действий пользователя
- **Состояния загрузки**: Спиннеры и скелетоны для асинхронных операций
- **Валидация**: Мгновенная валидация форм с понятными сообщениями об ошибках
- **Подтверждения**: Модальные окна для критических действий (удаление, массовые операции)

#### Доступность

- **Клавиатурная навигация**: Поддержка навигации с клавиатуры
- **Семантическая разметка**: Правильное использование HTML-тегов
- **Контрастность**: Соответствие стандартам контрастности для темной и светлой тем
- **Экранные читалки**: Поддержка assistive технологий

#### Производительность

- **Ленивая загрузка**: Компоненты загружаются по требованию
- **Мемоизация**: `useCallback` и `useMemo` для оптимизации рендеринга
- **Виртуализация**: Для больших списков данных
- **Кэширование**: Разумное кэширование API запросов

## 🔍 Мониторинг и Health Checks

### Health Monitor Service

Проект включает в себя автоматизированную систему мониторинга здоровья сервисов через `scripts/health-monitor.js`. Этот сервис критически важен для обеспечения стабильности и быстрой диагностики проблем в различных окружениях.

#### Назначение Health Monitor

- **Автоматическая диагностика** состояния всех сервисов (API, Frontend, Prisma Studio)
- **Мониторинг Docker контейнеров** и их health status
- **Проверка системных ресурсов** (диск, память, версии Node.js/npm)
- **Генерация отчетов** для анализа проблем и трендов
- **Непрерывный мониторинг** в production окружениях

#### Использование

```bash
# Разовый health check
node scripts/health-monitor.js

# Непрерывный мониторинг (каждые 30 секунд)
node scripts/health-monitor.js --continuous

# Быстрая проверка через npm script
npm run health:check
```

#### Структура отчета

Health Monitor генерирует детальный JSON отчет (`health-report.json`) с информацией о:

- Статусе всех сервисов (healthy/unhealthy)
- Состоянии Docker контейнеров
- Системных ресурсах
- Временных метках и окружении
- Общем статусе здоровья системы

---

## 📋 Правила разработки

### 🚨 Критические принципы для предотвращения ошибок

#### 1. Обязательные проверки перед коммитом

```bash
# ВСЕГДА выполняйте перед коммитом:
npm run validate:build      # Валидация конфигурации
npm run health:check        # Проверка сервисов
npm run test:e2e           # E2E тесты
```

#### 2. Работа с окружениями

**ЗАПРЕЩЕНО**:

- ❌ Ручное редактирование `.env` файлов
- ❌ Хардкод переменных окружения в коде
- ❌ Использование `NODE_ENV=development` в production

**ОБЯЗАТЕЛЬНО**:

- ✅ Использовать `./scripts/setup-environment.sh [environment]`
- ✅ Всегда указывать `NODE_ENV=production` в Docker
- ✅ Проверять переменные через `npm run validate:build`

#### 3. Стандарты кодирования

##### TypeScript

```typescript
// ✅ ПРАВИЛЬНО - строгая типизация
interface ServiceConfig {
  name: string;
  url: string;
  timeout: number;
  expectedStatus: number;
}

// ❌ НЕПРАВИЛЬНО - any типы
function checkService(config: any): any {
  // ...
}
```

##### Error Handling

```typescript
// ✅ ПРАВИЛЬНО - обработка ошибок с fallback
const checkServiceHealth = async (service: ServiceConfig) => {
  try {
    const response = await makeRequest(service.url, service.timeout);
    return { success: true, response };
  } catch (error) {
    log.error(`${service.name} health check failed: ${error.message}`);
    return { success: false, error: error.message };
  }
};

// ❌ НЕПРАВИЛЬНО - игнорирование ошибок
const checkService = async (url: string) => {
  const response = await fetch(url); // Может упасть!
  return response.json();
};
```

##### Logging

```typescript
// ✅ ПРАВИЛЬНО - структурированное логирование
log.info(`Checking ${service.name} (attempt ${attempt}/${maxRetries})...`);
log.success(`${service.name} is healthy`);
log.error(`${service.name} health check failed: ${error.message}`);

// ❌ НЕПРАВИЛЬНО - console.log без контекста
console.log('Service check');
console.log('OK');
console.log('Error');
```

#### 4. Требования к тестированию

##### Обязательные тесты

```bash
# Перед каждым PR:
npm run test:e2e                    # E2E тесты
npm run validate:build             # Валидация сборки
node scripts/health-monitor.js     # Health check
```

##### E2E тесты для критических компонентов

```typescript
// ✅ ОБЯЗАТЕЛЬНО тестировать:
test('Menu displays correctly in all environments', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('nav a[href="/"]')).toBeVisible();
  await expect(page.locator('nav a[href="/projects"]')).toBeVisible();
});

test('API health endpoint responds correctly', async ({ page }) => {
  const response = await page.request.get('/api/health');
  expect(response.status()).toBe(200);
  const data = await response.json();
  expect(data.status).toBe('ok');
});
```

#### 5. Согласование изменений

##### Workflow для изменений

1. **Создание feature branch** от `main`
2. **Локальная валидация**: `npm run validate:build`
3. **Тестирование**: `npm run test:e2e`
4. **Health check**: `node scripts/health-monitor.js`
5. **Code review** с фокусом на:
   - Правильность обработки ошибок
   - Соответствие стандартам логирования
   - Влияние на health checks
   - Совместимость с разными окружениями

##### Критерии для merge

- ✅ Все тесты проходят
- ✅ Health monitor показывает healthy status
- ✅ Валидация сборки успешна
- ✅ Нет breaking changes в API
- ✅ Документация обновлена

---

## ⚠️ Типичные ошибки и их предотвращение

### 1. Проблемы с окружениями

#### Ошибка: "Menu not displaying in production"

```bash
# ❌ ПРОБЛЕМА: NODE_ENV=development в Docker
ENV NODE_ENV=development

# ✅ РЕШЕНИЕ: Правильная настройка окружения
./scripts/setup-environment.sh docker
# Проверяет NODE_ENV=production в Docker
```

#### Ошибка: "API not responding"

```bash
# ❌ ПРОБЛЕМА: Неправильные CORS настройки
CORS_ORIGINS=http://localhost:3000

# ✅ РЕШЕНИЕ: Использование правильного env файла
npm run env:prod  # Устанавливает правильные CORS_ORIGINS
```

### 2. Проблемы с Health Checks

#### Ошибка: "Health check timeout"

```typescript
// ❌ ПРОБЛЕМА: Слишком короткий timeout
const response = await fetch('/api/health', { timeout: 1000 });

// ✅ РЕШЕНИЕ: Адекватный timeout с retry
const response = await makeRequest('/api/health', 5000);
// makeRequest включает retry логику
```

#### Ошибка: "Service marked as unhealthy"

```typescript
// ❌ ПРОБЛЕМА: Игнорирование ошибок
const checkHealth = async () => {
  try {
    await fetch('/api/health');
  } catch (error) {
    // Игнорируем ошибку!
  }
};

// ✅ РЕШЕНИЕ: Правильная обработка с fallback
const checkHealth = async () => {
  try {
    const response = await makeRequest('/api/health');
    return { success: true, response };
  } catch (error) {
    log.error(`Health check failed: ${error.message}`);
    return { success: false, error: error.message };
  }
};
```

### 3. Проблемы с мониторингом

#### Ошибка: "Health monitor not detecting issues"

```bash
# ❌ ПРОБЛЕМА: Запуск без continuous режима
node scripts/health-monitor.js  # Только разовая проверка

# ✅ РЕШЕНИЕ: Непрерывный мониторинг
node scripts/health-monitor.js --continuous
```

#### Ошибка: "False positive health reports"

```typescript
// ❌ ПРОБЛЕМА: Неполная проверка сервиса
const checkService = async (url: string) => {
  const response = await fetch(url);
  return response.ok; // Только HTTP статус!
};

// ✅ РЕШЕНИЕ: Комплексная проверка
const checkService = async (service: ServiceConfig) => {
  const response = await makeRequest(service.url, service.timeout);

  // Проверяем статус код
  if (response.status !== service.expectedStatus) {
    throw new Error(`Expected ${service.expectedStatus}, got ${response.status}`);
  }

  // Проверяем тело ответа
  if (service.expectedBody) {
    const body = JSON.parse(response.body);
    for (const [key, expectedValue] of Object.entries(service.expectedBody)) {
      if (body[key] !== expectedValue) {
        throw new Error(`Expected ${key}=${expectedValue}, got ${body[key]}`);
      }
    }
  }

  return { success: true, response };
};
```

---

## 🎯 Рекомендации для новых участников команды

### Первые шаги

1. **Изучите health monitor**:

   ```bash
   # Запустите и изучите отчет
   node scripts/health-monitor.js
   cat health-report.json
   ```

2. **Настройте окружение**:

   ```bash
   # Используйте автоматическую настройку
   ./scripts/setup-environment.sh development
   ```

3. **Проверьте работоспособность**:
   ```bash
   # Полная валидация
   npm run validate:pre-deploy
   ```

### Принципы работы

- **Всегда используйте health monitor** перед деплоем
- **Не игнорируйте предупреждения** в логах
- **Тестируйте в разных окружениях** (dev, docker, production)
- **Документируйте изменения** в health checks
- **Следуйте стандартам логирования** для лучшей диагностики

### Полезные команды

```bash
# Быстрая диагностика
npm run health:check

# Полная валидация
npm run validate:pre-deploy

# Настройка окружения
npm run env:dev    # Development
npm run env:prod   # Production
npm run env:docker # Docker

# Непрерывный мониторинг
node scripts/health-monitor.js --continuous
```

---

## 📄 Лицензия

MIT License - см. файл [LICENSE](LICENSE) для деталей.

---

**Situs** — современная платформа управления проектами/продуктами  
**Статус**: активная разработка
