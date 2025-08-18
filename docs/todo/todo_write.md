# TODO Write

- [x] Исправить PATCH /api/projects/:id/status (status + isPublished, публикация событий в сервисе)
- [x] Удалить минимальный сервер и артефакты .js из `src/server/projects`
- [x] Добавить heartbeat `/api/projects/heartbeat` и README для realtime/projects
- [x] Добавить глобальные пайпы/фильтры/интерцептор и graceful shutdown
- [x] Добавить pm2 конфиг и npm-скрипты деплоя
- [x] Прогнать e2e Playwright: status toggle + SSE sync
- [x] Создать unit-тесты для `ProjectsService.update` (без Jest)
- [x] Документация: обновить корневой README архитектуры, добавить Swagger
- [x] Очистить корень от артефактов компиляции и дублирующих конфигов TS
 
## UI реорганизация
- [x] Перенести `SitusDarkModeToggle` в `src/components/ui` и обновить импорты
- [x] Стандартизировать импорты UI на `@/components/ui/*` (проверить весь проект)
- [x] Объединить/перенести дубли из `src/components/situs/UI` (не создавать новые дубликаты)
- [x] Обновить `src/components/ui/README.md` и `src/components/situs/README.md`

## Архитектура и доступы
- [x] Интегрировать доработки из ветки `cursor/enhance-project-backend-and-authorization-c0df` (Auth, Guards, Policies, Domains, SEO)
- [x] API: CRUD `Account`, `AccountMembership`, `AgencyClient`
- [x] Авторизация: Guards/Policies (GlobalRole, Account, ProjectAccess) + декораторы `@Roles()`, `@Scopes()`
- [x] Tenant resolver: middleware по Host/домену (projectId, productId) и RequestContext
- [ ] Production‑режим: убрать dev‑bypass в `JwtAuthGuard`/`RolesGuard`/`PoliciesGuard`, включить строгую проверку ролей/доступов (UI должен корректно обрабатывать 401/403)
- [x] Единый формат ошибок API на фронте (адаптация `apiClient`): человекочитаемые сообщения для 401/403/404/500
 - [x] JwtAuthGuard: bypass только в development; в test строгий режим с поддержкой `AUTH_TEST_TOKEN` для e2e
 - [x] @Scopes() добавлены для `Accounts`, `AccountMemberships`, `AgencyClient`

## Продукты
- [x] Website: UX "Страницы" — создать/удалить/редактировать, DnD сохранение порядка (PATCH), поиск/фильтры, пагинация
- [x] Shop: модели каталога (товар, категория), контроллеры и UI раздел "Магазины" (без связи с Page)
- [ ] Единый каркас продукта: маршруты `/api/projects/:projectId/products/:productId/...`

## Backend (NestJS)
- [x] Валидация DTO на всех ручках (class-validator)
- [x] Единый формат ошибок/логов, привести 404/500 аналитики к реализованным
- [ ] Домены проекта: валидация, привязка, sitemap/robots генерация
- [ ] SSE: события статуса/прогресса, heartbeat оставить
- [ ] Rate limiting: интегрировать `@nestjs/throttler` на основе `rateLimitConfig` (dev выключен, prod включен)
  - [x] Подключить ThrottlerGuard глобально (значения из ENV)

## Frontend (React + Vite)
- [x] Роут `projects/:projectId/website`
- [x] Навигация к продуктам (магазин и др.)
- [x] Website UI: вкладки "Меню", "Дизайн", "SEO" — подключить реальные API; убрать заглушки
- [ ] Редактор: создание страницы, обработка ошибок, переходы
- [ ] UI для аккаунтов: списки/деталь `Account`, `AccountMembership`, `AgencyClient` + формы CRUD
- [ ] Обработчики ошибок API: дружелюбные сообщения для Forbidden/Not Found/Validation

## Мультиарендность и домены
- [ ] Привязка домена (форма/валидация/статус)
- [ ] Резолв по домену в предпросмотре Website
- [ ] E2E тест 301‑редиректов базовый→customDomain

## База и миграции
- [x] Prisma db push; добавить индексы и миграции
- [x] Проверить уникальные индексы: `AccountMembership`, `AgencyClient`, `pages_productId_slug_key`
- [x] Idempotent сиды: AGENCY/BUSINESS аккаунты, проекты, Website, страницы

## Тестирование (Playwright)
- [ ] E2E: проекты → проект → Website → страницы → DnD reorder → проверка порядка
- [ ] E2E: SSE `/api/projects/events`, отсутствие ошибок в консоли/сети
- [ ] E2E: домены (мок), роли (разные сценарии)
- [ ] Починить селекторы списка проектов (ожидание карточек, рукопожатие SSE) и стабилизировать webServer
 - [x] Базовые сценарии проектов и SSE проходят (искл. incognito sync)
 - [x] Incognito realtime sync: исправить `Failed to fetch` в `tests/e2e/chrome-incognito-sync.spec.ts` (проверить CORS/SSE контекст)

## Тестирование (Backend / Vitest)
- [x] Импортированы backend e2e (auth/domains/SSE), обновлён `vitest.config.ts`, добавлен `scripts/test-backend.mjs`
- [x] Подключить запуск backend e2e в CI
 - [x] CRUD `Accounts`/`AccountMemberships`/`AgencyClient` покрыты e2e

## Dev/операции
- [ ] Починить ts/tsx dev‑рантайм (после стабилизации)
- [x] CI/CD: сборка NestJS, Prisma generate/db push, backend tests (`test:backend`), Playwright e2e
- [ ] Мониторинг: health, лог‑рутинг, трекинг ошибок

### Dev‑рантайм (tsx) — расследование и фиксы
- [ ] tsx dev завершается до `listen()`: воспроизвести и зафиксировать причину (beforeExit/exit без открытых хэндлов)
- [x] Временный фикс: dev keep‑alive таймер до `NestFactory.create()` в `src/server/main.ts`
- [ ] Устранить первопричину: гарантировать удержание event loop до старта HTTP (проверить поведение tsx v4.20.x + Node 20)
- [x] Добавить альтернативный dev‑режим без tsx: `scripts/dev-api-watch.sh` (tsc --watch + nodemon)
- [ ] Прогнать `dev:api:watch`, проверить /health и /api/projects; стабилизировать скрипт (вывод логов, автоперезапуск)

## Документация
- [x] Обновить README архитектуры продуктов/ролей/маршрутов
- [ ] Зафиксировать ресёрч (research/*), протоколы (precise_triggers)
- [ ] Обновлять todo/инфо инкрементально
- [x] Добавить подробный раздел структуры проекта (папки backend/frontend/шаблоны)
 - [x] Добавить README в `src/server/pages/` (оглавление и контракты API)
 - [x] Обновить `src/components/redaktus/README.md` с навигатором по каталогу
 - [x] Добавить README в `src/server/{auth,products,database,common,health,users}` и `src/components/sections`
- [x] Документация по доменам/тенантам/ролям: поведение, ограничения, примеры запросов (см. `docs/AUTH_AND_DOMAINS.md`, README модулей)

## Темы/UX
- [ ] Единые настройки темы в админке, без заглушек

## Лицензии/зависимости
- [x] На новые пакеты — license audit и фиксация результата (см. `docs/licenses/AUDIT_$(date +%F).csv`)

## 🍃 Универсальная система меню (на основе архитектуры Joomla)

### Концепция (изучено из Joomla CMS)
**Ключевые принципы Joomla Menu System:**
1. **Универсальная привязка**: пункт меню → компонент + параметры (view, layout, id)
2. **Иерархия и типы**: menutype, level (1,2,3...), parent-child структура  
3. **Права доступа**: access levels, viewing permissions по ролям
4. **Параметры**: menu_show, menu_image, component-specific settings
5. **Мультиязычность**: language filtering, активные пункты по языку
6. **Роутинг**: автоматический Itemid, SEF URLs через MenuRules

### 📋 План реализации

#### 🎯 ФАЗА 1: Модели данных (Неделя 1)
- [x] 🧩 Создать модель `MenuItem` в Prisma схеме (id, title, type, component, parameters, access, language, level, parentId)
- [x] 📁 Создать модель `MenuType` в Prisma схеме (id, name, description, isActive) 
- [x] 🔗 Связать MenuItem с Project через MenuType для контекстной навигации
- [x] 📊 Применить миграцию: `npx prisma db push`
- [x] 🎛️ Создать TypeScript интерфейсы `MenuItemData`, `MenuParameters`
- [ ] 🧪 Создать сиды для демо-меню (main, footer, admin)
- [ ] ✅ Unit-тесты для моделей и связей

#### 🎯 ФАЗА 2: Backend API (Неделя 2)
- [ ] 🏗️ Создать модуль `MenuModule` в `src/server/menus/`
- [ ] 📝 DTO классы: `CreateMenuTypeDto`, `UpdateMenuTypeDto`, `CreateMenuItemDto`, `UpdateMenuItemDto`
- [ ] 🎮 Контроллеры: `MenuTypesController`, `MenuItemsController`
- [ ] 🔧 Сервис `MenuService` с методами как в Joomla:
  - `getItems(properties, values)` - мультипараметровая фильтрация
  - `getActive(path)` - определение активного пункта
  - `getAuthorized(userLevels)` - фильтрация по правам
  - `buildLookup(language)` - таблица для роутинга
- [ ] 🔌 API эндпоинты полный CRUD:
  - `GET /api/menu-types` - список типов меню
  - `POST /api/menu-types` - создание типа
  - `GET /api/menu-items` - список пунктов (с фильтрами)
  - `POST /api/menu-items` - создание пункта
  - `PATCH /api/menu-items/reorder` - изменение порядка
  - `GET /api/menu-items/active` - активный пункт
  - `GET /api/menu-items/authorized` - доступные пункты
- [ ] 🔐 Интеграция с `@Scopes()` декораторами
- [ ] ✅ E2E тесты для всех эндпоинтов

#### 🎯 ФАЗА 3: Frontend интерфейс (Неделя 3)
- [ ] 🏗️ Создать компонент `MenuManager` в `src/components/admin/`
- [ ] 📋 Список типов меню с переключением между ними
- [ ] 🎨 Иерархическое отображение пунктов меню (древовидная структура)
- [ ] ➕ Модальные окна создания/редактирования:
  - Создание типа меню
  - Создание пункта меню
  - Настройка параметров по типу компонента
- [ ] 🖱️ Drag & Drop для изменения:
  - Порядка пунктов (orderIndex)
  - Вложенности (level, parentId)
  - Перемещения между уровнями
- [ ] 🎛️ Форма параметров пункта меню:
  - Базовые: title, alias, type, accessLevel
  - Компонент: component, view, layout, targetId
  - SEO: metaTitle, metaDescription, metaKeywords
  - Отображение: cssClass, menuImage, parameters
- [ ] 👁️ Предпросмотр меню в реальном времени
- [ ] 🔐 Фильтрация по правам доступа пользователя
- [ ] ✅ Playwright тесты для UI

#### 🎯 ФАЗА 4: Интеграция с компонентами (Неделя 4)
- [ ] 🔄 Система универсальной привязки:
  - Website: `pageId` → конкретная страница, `view=page`
  - Store: `categoryId` → категория товаров, `view=category|list`
  - Blog: `articleId` → статья блога, `view=article|list`
  - Landing: `templateId` → шаблон лендинга, `view=landing`
- [ ] 📝 Параметры по типам компонентов:
  - Website: `showBreadcrumbs`, `showTitle`, `customCSS`
  - Store: `itemsPerPage`, `showFilters`, `sortBy`
  - Blog: `showAuthor`, `showDate`, `showTags`
  - Landing: `variant`, `theme`, `customData`
- [ ] 🎪 Поддержка view + layout комбинаций:
  - `page:default`, `page:full-width`, `page:sidebar`
  - `category:grid`, `category:list`, `category:blog`
  - `article:single`, `article:teaser`, `article:full`
- [ ] 🏷️ Автоматические meta-данные из связанного контента
- [ ] 🔗 Обратная связь: показать где используется страница/категория в меню
- [ ] ✅ Интеграционные тесты привязок

#### 🎯 ФАЗА 5: Роутинг и SEF URLs (Неделя 5)
- [ ] 🛤️ Создать `MenuRules` класс для автоматического выбора Itemid:
  - Проверка указанного Itemid в URL
  - Поиск точного совпадения по component + view + targetId
  - Использование активного пункта если подходит
  - Fallback на родительский класс
- [ ] 🔍 Lookup система для быстрого поиска:
  - Индексация по `component:view:layout`
  - Кэширование в Redis/памяти
  - Обновление при изменении меню
- [ ] 🌐 Мультиязычный роутинг:
  - Фильтрация по `language = '*'` или конкретному языку
  - Приоритет активного языка приложения
  - Fallback на язык по умолчанию
- [ ] 📍 Отслеживание активного пункта меню:
  - Определение по текущему URL
  - Подсветка в навигации
  - Хлебные крошки на основе иерархии
- [ ] ✅ E2E тесты роутинга и SEF URLs

#### 🎯 ФАЗА 6: Права доступа и безопасность (Неделя 6)
- [ ] 🛡️ Система уровней доступа:
  - PUBLIC: доступно всем
  - REGISTERED: только авторизованным
  - SPECIAL: по специальным ролям
  - CUSTOM: пользовательские уровни
- [ ] 👥 Интеграция с существующими системами:
  - GlobalRole (SUPER_ADMIN, STAFF, AGENCY, BUSINESS)
  - ProjectAccess (OWNER, ADMIN, EDITOR, VIEWER)
  - AccountMembership для агентств
- [ ] 🔒 Middleware для проверки прав:
  - `user.getAuthorisedViewLevels()` аналог
  - `canView(item.access)` проверка
  - Автоматическая фильтрация в API
- [ ] 🚫 UI логика скрытия недоступных пунктов:
  - Фильтрация на уровне компонентов
  - Graceful degradation для ограниченных прав
  - Сообщения о недостатке прав
- [ ] ✅ Security тесты и проверка прав

#### 🎯 ФАЗА 7: Мультиязычность (Неделя 7)
- [ ] 🗣️ Поддержка языков в пунктах меню:
  - `language = '*'` (все языки)
  - Конкретные языки: `ru-RU`, `en-GB`, `es-ES`
  - Приоритет по языку браузера/пользователя
- [ ] 🎌 Фильтрация меню по текущему языку:
  - Автоматическая фильтрация в `MenuService`
  - API параметр `?language=ru-RU`
  - Fallback на универсальные пункты (`*`)
- [ ] 🔄 Переключение языка с сохранением контекста:
  - Поиск аналогичного пункта на другом языке
  - Сохранение параметров навигации
  - Редирект на соответствующую страницу
- [ ] 📋 Интеграция с i18n системой:
  - Перевод названий пунктов меню
  - Локализация параметров компонентов
  - Мультиязычные мета-данные
- [ ] ✅ Тесты мультиязычности

#### 🎯 ФАЗА 8: Административный интерфейс (Неделя 8)
- [ ] 🎛️ Главная страница управления меню:
  - Список всех типов меню проекта
  - Переключение между типами
  - Статистика использования пунктов
- [ ] 🌳 Древовидный интерфейс пунктов меню:
  - Иерархическое отображение с отступами
  - Индикаторы уровня (Level 1, 2, 3...)
  - Иконки по типам (🧩 Component, 🔗 URL, 📂 Heading)
- [ ] ✏️ Редактирование пункта меню:
  - Основные поля (title, alias, type)
  - Выбор компонента из выпадающего списка
  - Настройка view и layout
  - Выбор targetId с автокомплитом
  - Настройка прав доступа
  - SEO поля
- [ ] 🎨 Настройка параметров отображения:
  - CSS классы и стили
  - Изображения для пунктов меню
  - Настройки target и rel для ссылок
- [ ] 🔍 Предпросмотр и тестирование:
  - Live preview меню
  - Тест прав доступа
  - Проверка ссылок
- [ ] ✅ UI/UX тесты интерфейса

#### 🎯 ФАЗА 9: Интеграция и финализация (Неделя 9)
- [ ] 🔌 Подключение к существующим компонентам:
  - Обновить роутинг в SitusApp.tsx
  - Интегрировать с ProjectPage.tsx
  - Добавить в навигацию админки
- [ ] 🎯 Демо-данные и сиды:
  - Создать типовые меню для всех шаблонов
  - Примеры привязок к компонентам
  - Тестовые данные для разработки
- [ ] 📚 Документация:
  - README для модуля меню
  - API документация (Swagger)
  - Руководство пользователя
- [ ] 🚀 Production готовность:
  - Оптимизация запросов
  - Кэширование lookup таблиц
  - Мониторинг производительности
- [ ] ✅ Полное E2E тестирование всей системы