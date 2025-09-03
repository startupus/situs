### ТЗ: Переработка сущности Pages (Pages + Categories, в стиле Joomla)

- Вдохновляющая модель: материалы/категории Joomla — использовать её устойчивые принципы для структуры, статусов, иерархии и URL-построения [Joomla CMS](https://github.com/joomla/joomla-cms).
- Отличия от Joomla:
  - Страница может быть в нескольких рубриках (many-to-many).
  - Одна рубрика обязательно определяется как “основная” для канонического URL.
  - Если на страницу есть пункт меню, URL берётся из меню; иначе — из основной рубрики.
  - Контент страницы редактируется через редактор Redaktus; категории не влияют на формат контента.

### Цели и результат

- Переназначить Pages: отвечает только за Страницы (Pages) и Рубрики (Categories).
- Реализовать: иерархические рубрики, множественная привязка страниц, выбор основной рубрики, согласованные канонические URL и интеграцию с меню.
- Обновить API/бэкенд/клиент и административный UI.

### Модель данных (Prisma)

- Страницы:
  - `Page.primaryCategoryId`: ссылка на основную рубрику.
  - Many-to-many `Page ↔ WebCategory` через стык-таблицу.
- Рубрики Pages (`WebCategory`):
  - Иерархия: `parentId/children/level`, `orderIndex`.
  - Публикация/доступ/язык: `isPublished`, `accessLevel`, `language`.
  - Уникальность `slug` в пределах продукта.

Актуальные модели:

```prisma
model WebCategory {
  id            String   @id @default(cuid())
  name          String
  description   String?
  slug          String
  alias         String   @default("")

  // Иерархия
  level         Int      @default(1)
  parentId      String?
  parent        WebCategory? @relation("WebCategoryHierarchy", fields: [parentId], references: [id])
  children      WebCategory[] @relation("WebCategoryHierarchy")

  // Публикация/доступ/язык
  orderIndex    Int      @default(0)
  isActive      Boolean  @default(true)
  isPublished   Boolean  @default(true)
  language      String   @default("*")
  accessLevel   AccessLevel @default(PUBLIC)

  // Привязка к продукту WEBSITE
  productId     String
  product       Product  @relation(fields: [productId], references: [id], onDelete: Cascade)

  // Связи
  pageLinks     PageWebCategory[]
  primaryPages  Page[] @relation("PagePrimaryCategory")

  createdAt     DateTime @default(now())
  updatedAt     DateTime @updatedAt

  @@unique([productId, slug])
  @@map("web_categories")
}

model Page {
  id                String   @id @default(cuid())
  title             String
  slug              String
  content           String?
  pageType          PageType @default(PAGE)
  status            PageStatus @default(DRAFT)
  isHomePage        Boolean  @default(false)
  orderIndex        Int      @default(0)

  // Доступ
  accessLevel       AccessLevel @default(PUBLIC)
  customAccessLevelId String?

  // Продукт и категория
  productId         String
  primaryCategoryId String?

  createdAt         DateTime @default(now())
  updatedAt         DateTime @updatedAt

  product           Product @relation(fields: [productId], references: [id], onDelete: Cascade)
  primaryCategory   WebCategory? @relation("PagePrimaryCategory", fields: [primaryCategoryId], references: [id])
  webCategories     PageWebCategory[]

  @@unique([productId, slug])
  @@map("pages")
}

model PageWebCategory {
  pageId      String
  categoryId  String
  assignedAt  DateTime @default(now())

  page        Page        @relation(fields: [pageId], references: [id], onDelete: Cascade)
  category    WebCategory @relation(fields: [categoryId], references: [id], onDelete: Cascade)

  @@id([pageId, categoryId])
  @@map("page_web_categories")
}
```

### Правила URL и маршрутизация

- Если существует `MenuItem` (component=Website, view='page', targetId=pageId) — использовать URL из меню (SEF) как первичный.
- Иначе канонический URL: `/<product.pathPrefix?>/<primaryCategory.slug>/<page.slug>`.
- Если основная рубрика не задана — до публикации страницы требуется выбрать (валидация).
- Sitemap/SEF: при генерации учитывать приоритет меню и fallback по основной рубрике.

### Бэкенд (NestJS)

- Контроллеры/эндпоинты категорий (Website):
  - `GET /api/projects/:projectId/website/categories`
  - `POST /api/projects/:projectId/website/categories`
  - `PUT /api/website/categories/:id`
  - `DELETE /api/website/categories/:id`
  - `PATCH /api/website/categories/reorder`
- Страницы (дополнения):
  - Включать в ответы: `primaryCategory`, `categories[]`.
  - `PATCH /api/pages/:id/categories` — тело `{ add?: string[]; remove?: string[] }`.
  - `PATCH /api/pages/:id/categories/primary` — тело `{ categoryId: string }`.
- Валидации:
  - `slug`: `/^[a-z0-9-]+$/`, уникален в продукте.
  - Запрет циклов в иерархии.
  - `primaryCategoryId ∈ categories(page)`.
  - Перед публикацией страницы — наличие `primaryCategory`.
- Права и фильтрация: PROJECT_READ/PROJECT_WRITE; учёт `AccessLevel`/`language`.
- SSE-события: `website_category_created/updated/deleted/reordered`, `page_category_updated`.
- Индексы: `(productId, slug)`, `(parentId, orderIndex)`.

### Клиент/SDK

- `ApiClient`:
  - Методы рубрик: list/create/update/delete/reorder.
  - Методы страниц: assignCategories, setPrimaryCategory.
  - Расширить `getPages`/project pages, чтобы возвращать `categories` и `primaryCategory`.
- Хелпер `buildCanonicalUrl(page)`: приоритет меню, затем основная рубрика.

### Админский UI

- Управление рубриками:
  - Дерево с drag&drop (перемещение/сортировка), публикация/деактивация, поиск/фильтр.
  - Форма: name, slug, описание, родитель, публикация/активация.
- Страницы:
  - В списке: бейджи рубрик, фильтр по рубрике.
  - В форме: множественный выбор рубрик, выбор одной “основной” среди выбранных.
  - При публикации — подсказка выбрать основную рубрику, если отсутствует.
- UI/UX:
  - Использовать существующие React-иконки, не эмодзи.
  - Тёмная тема: парные классы `dark:` для фонов и границ.

### SEO и sitemap

- `<link rel="canonical">` строится по меню (если есть) или по основной рубрике.
- В sitemap включать канонические URL.
- Учитывать мета-поля страницы (title/description/keywords).

### Миграции и данные

- Подготовить prod-миграции.
- Seed демо: создать дерево рубрик, распределить страницы, назначить primary.

### Тестирование

- Unit:
  - Валидация slug/иерархии.
  - Правила URL (меню → primary category → slug).
  - `primaryCategory ∈ categories(page)`.
- E2E:
  - CRUD рубрик, DnD reorder, назначение рубрик странице, установка primary.
  - Sitemap/SEF-URL.
- Регрессия:
  - Список страниц проекта (в т.ч. fallback `/api/pages?projectId=...`).

### Rollout

- Ветка: `develop`.
- Шаги:
  1. Backend API категорий и назначений (+SSE, права)
  2. Клиент/SDK
  3. UI раздел рубрик + изменения в формах страниц
  4. URL builder и sitemap
  5. Тесты

### Критерии приёмки

- Можно создавать/редактировать/удалять рубрики; иерархия и сортировка работают.
- Страница может иметь несколько рубрик; можно выбрать “основную”.
- Канонический URL: из меню (если есть) или из основной рубрики.
- В списках страниц видны рубрики, фильтрация по рубрике работает.
- Sitemap/SEF строится корректно.
- Все операции доступны при валидных правах; SSE-события приходят.
