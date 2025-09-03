# Архитектура бизнес-логики Situs

## Концепция

**Проект** - это НЕ тип продукта, а контейнер верхнего уровня:

- Единица владения и доменной привязки
- Единица тарификации
- Контейнер для группы продуктов под общим доменом

**Продукт** - идеологическая сущность, представляющая конкретную бизнес-функциональность:

- Технически может радикально отличаться (веб-страницы vs товарная база vs CRM)
- Имеет собственную архитектуру данных и интерфейсы
- Подключается как отдельный сервис/модуль к проекту
- Может иметь собственную базу данных и API
- Тарифицируется отдельно в зависимости от сложности

## Сущности

### 1. User (Пользователь)

```
- id: string
- username: string
- email: string
- password: string
- role: BUSINESS | AGENCY | ADMIN
- subscription_plan: string
- limits: JSON (лимиты по проектам/продуктам)
- created_at, updated_at
```

### 2. Project (Проект)

```
- id: string
- name: string
- description: string
- slug: string (уникальный)
- domain: string (поддомен .situs.com)
- custom_domain: string (собственный домен)
- owner_id: string (User.id)
- status: ACTIVE | SUSPENDED | ARCHIVED
- settings: JSON (общие настройки)
- theme: JSON (общая тема оформления)
- created_at, updated_at
```

### 3. Product (Продукт проекта)

```
- id: string
- name: string
- description: string
- type: WEBSITE | ECOMMERCE | BLOG | LANDING | CRM | TASK_MANAGER | ANALYTICS | API
- project_id: string (Project.id)
-
- # URL-маршрутизация
- subdomain: string (shop.domain.com)
- path_prefix: string (/shop, /blog, /crm)
-
- # Техническая архитектура
- service_type: INTERNAL | EXTERNAL | MICROSERVICE
- database_schema: string (имя схемы БД для продукта)
- api_endpoint: string (базовый API endpoint)
- frontend_component: string (React компонент для рендера)
-
- # Конфигурация
- status: ACTIVE | DRAFT | ARCHIVED | MAINTENANCE
- settings: JSON (настройки продукта)
- pricing_plan: string
- resource_limits: JSON (лимиты ресурсов)
-
- # Интеграции
- integrations: JSON (настройки интеграций)
- webhooks: JSON (webhook endpoints)
-
- created_at, updated_at
```

### 4. ProjectAccess (Доступы к проекту)

```
- project_id: string
- user_id: string
- role: OWNER | ADMIN | EDITOR | VIEWER
- granted_by: string (User.id)
- granted_at: datetime
```

### 5. Media (Медиафайлы)

```
- id: string
- filename: string
- original_name: string
- mime_type: string
- size: int
- url: string
- thumbnail_url: string
- project_id: string (Project.id)
- uploaded_by: string (User.id)
- created_at, updated_at
```

## Типы продуктов и их архитектура

### 🌐 WEBSITE (Сайт-страничник)

**Техническая реализация**: Полностью реализована

**Специфичные сущности продукта:**

```sql
Page (Страницы сайта)
- id: string
- title: string
- slug: string (уникальный в рамках продукта)
- content: JSON (блоки Redaktus)
- product_id: string (Product.id)
- page_type: HOME | PAGE | LANDING
- status: DRAFT | PUBLISHED | ARCHIVED
- is_home_page: boolean
- meta_title, meta_description, meta_keywords: string
- template: string (шаблон страницы)
- layout: string (layout страницы)
- created_at, updated_at

Block (Блоки контента страниц)
- id: string
- page_id: string (Page.id)
- type: string (hero-block, text-block, image-block, etc)
- props: JSON (настройки блока)
- order: int (порядок отображения)
- created_at, updated_at

Template (Шаблоны страниц)
- id: string
- name: string
- description: string
- product_id: string (Product.id)
- structure: JSON (структура шаблона)
- preview_image: string
- is_default: boolean
- created_at, updated_at
```

**Функциональность:**

- **Редактор**: Redaktus с drag&drop блоками
- **Frontend**: React компоненты из TailGrids
- **Маршрутизация**: Прямая (/, /about, /contacts)
- **SEO**: Мета-теги, sitemap, роботы
- **Шаблоны**: Готовые шаблоны страниц

### 🛒 ECOMMERCE (Интернет-магазин)

**Техническая реализация**: Частично реализована

**Специфичные сущности продукта:**

```sql
EcommerceProduct (Товары)
- id: string
- name: string
- description: string
- slug: string (уникальный в рамках продукта)
- product_id: string (Product.id)
- category_id: string (Category.id)
- price: decimal
- sale_price: decimal
- sku: string (артикул)
- stock_quantity: int
- manage_stock: boolean
- images: JSON (массив URL изображений)
- attributes: JSON (характеристики товара)
- status: DRAFT | PUBLISHED | ARCHIVED
- featured: boolean
- meta_title, meta_description: string
- created_at, updated_at

Category (Категории товаров)
- id: string
- name: string
- slug: string
- description: string
- product_id: string (Product.id)
- parent_id: string (Category.id, для иерархии)
- image: string
- sort_order: int
- is_visible: boolean
- created_at, updated_at

Cart (Корзины покупателей)
- id: string
- session_id: string (для гостей)
- user_id: string (для авторизованных)
- product_id: string (Product.id)
- ecommerce_product_id: string (EcommerceProduct.id)
- quantity: int
- price: decimal (цена на момент добавления)
- created_at, updated_at

Order (Заказы)
- id: string
- order_number: string (уникальный номер)
- product_id: string (Product.id)
- customer_email: string
- customer_name: string
- customer_phone: string
- shipping_address: JSON
- billing_address: JSON
- items: JSON (товары в заказе)
- subtotal: decimal
- tax_amount: decimal
- shipping_amount: decimal
- discount_amount: decimal
- total_amount: decimal
- status: PENDING | PROCESSING | SHIPPED | DELIVERED | CANCELLED
- payment_status: PENDING | PAID | FAILED | REFUNDED
- payment_method: string
- shipping_method: string
- notes: string
- created_at, updated_at

Customer (Покупатели)
- id: string
- email: string
- name: string
- phone: string
- product_id: string (Product.id)
- addresses: JSON (адреса доставки)
- order_count: int
- total_spent: decimal
- created_at, updated_at
```

**Функциональность:**

- **Каталог**: Категории, фильтры, поиск товаров
- **Корзина**: Добавление, изменение количества, расчет
- **Оформление**: Форма заказа, способы доставки и оплаты
- **Админка**: Управление товарами, заказами, клиентами
- **Интеграции**: Платежные системы (Stripe, PayPal), службы доставки
- **Маршрутизация**: (/shop, /shop/category/:slug, /shop/product/:slug, /shop/cart)

### 📝 BLOG (Блог)

**Техническая реализация**: Базовая реализация

**Специфичные сущности продукта:**

```sql
Post (Посты блога)
- id: string
- title: string
- slug: string (уникальный в рамках продукта)
- content: TEXT (HTML/Markdown контент)
- excerpt: string (краткое описание)
- product_id: string (Product.id)
- author_id: string (User.id)
- category_id: string (BlogCategory.id)
- featured_image: string
- status: DRAFT | PUBLISHED | SCHEDULED | ARCHIVED
- published_at: datetime
- meta_title, meta_description, meta_keywords: string
- tags: JSON (массив тегов)
- view_count: int
- comment_count: int
- is_featured: boolean
- created_at, updated_at

BlogCategory (Категории блога)
- id: string
- name: string
- slug: string
- description: string
- product_id: string (Product.id)
- parent_id: string (BlogCategory.id)
- image: string
- post_count: int
- sort_order: int
- created_at, updated_at

Comment (Комментарии к постам)
- id: string
- post_id: string (Post.id)
- author_name: string
- author_email: string
- author_website: string
- content: TEXT
- status: PENDING | APPROVED | SPAM | TRASH
- parent_id: string (Comment.id, для ответов)
- ip_address: string
- user_agent: string
- created_at, updated_at

Tag (Теги)
- id: string
- name: string
- slug: string
- product_id: string (Product.id)
- post_count: int
- created_at, updated_at
```

**Функциональность:**

- **Редактор**: Rich-text редактор + медиа галерея
- **Категории**: Иерархические категории постов
- **Теги**: Система тегирования
- **Комментарии**: Модерация, ответы, спам-фильтр
- **RSS**: Автогенерация RSS/Atom лент
- **SEO**: Автоматические meta-теги, sitemap
- **Маршрутизация**: (/blog, /blog/category/:slug, /blog/post/:slug, /blog/tag/:slug)

### 🎯 LANDING (Лендинг)

**Техническая реализация**: Реализована через WEBSITE

- **Особенности**: Одностраничник с формами
- **Интеграции**: CRM, email-маркетинг
- **Аналитика**: Конверсии, A/B тесты

### 🏢 CRM (Управление клиентами)

**Техническая реализация**: НЕ РЕАЛИЗОВАНА

- **База данных**: Clients, Deals, Tasks, Communications
- **Функции**: Воронка продаж, задачи, коммуникации
- **Интеграции**: Email, телефония, мессенджеры
- **Маршрутизация**: (/crm/clients, /crm/deals)

### ✅ TASK_MANAGER (Менеджер задач)

**Техническая реализация**: НЕ РЕАЛИЗОВАНА

- **База данных**: Tasks, Projects, Teams, TimeTracking
- **Функции**: Канбан, календарь, отчеты
- **Интеграции**: Календари, уведомления
- **Маршрутизация**: (/tasks/board, /tasks/calendar)

### 📊 ANALYTICS (Аналитика)

**Техническая реализация**: НЕ РЕАЛИЗОВАНА

- **База данных**: Events, Sessions, Conversions
- **Функции**: Дашборды, отчеты, воронки
- **Интеграции**: Google Analytics, внешние метрики
- **Маршрутизация**: (/analytics/dashboard)

### 🔧 API (API Сервис)

**Техническая реализация**: НЕ РЕАЛИЗОВАНА

- **Функции**: REST/GraphQL API для мобильных приложений
- **Документация**: Swagger/OpenAPI
- **Аутентификация**: JWT, OAuth
- **Маршрутизация**: (/api/v1/\*)

## Архитектура расширяемости

### Модульная система

```typescript
// Интерфейс для продуктовых модулей
interface ProductModule {
  type: ProductType;
  name: string;
  version: string;

  // Схема БД для продукта
  databaseSchema: PrismaSchema;

  // API роуты
  apiRoutes: ExpressRouter;

  // Frontend компоненты
  components: {
    editor: React.Component; // Редактор для admin
    viewer: React.Component; // Отображение для users
    settings: React.Component; // Настройки продукта
  };

  // Конфигурация
  config: {
    pricing: PricingTier[];
    features: Feature[];
    integrations: Integration[];
  };

  // Lifecycle hooks
  onInstall: () => Promise<void>;
  onUninstall: () => Promise<void>;
  onUpdate: () => Promise<void>;
}
```

### Система плагинов

```typescript
// Для расширения существующих продуктов
interface ProductPlugin {
  targetProduct: ProductType;
  name: string;

  // Дополнительные поля БД
  schemaExtensions: SchemaExtension[];

  // Дополнительные API endpoints
  apiExtensions: ApiExtension[];

  // UI расширения
  uiExtensions: {
    hooks: UIHook[]; // Где встраиваться в UI
    components: Component[]; // Новые компоненты
  };
}
```

### Интеграционная шина

```typescript
// Для связи между продуктами
interface ProductBus {
  // Обмен данными между продуктами
  publish(event: ProductEvent): void;
  subscribe(eventType: string, handler: EventHandler): void;

  // Общие сервисы
  getSharedService(name: string): Service;
  registerSharedService(name: string, service: Service): void;

  // Межпродуктовые запросы
  query(targetProduct: string, query: Query): Promise<Result>;
}
```

## Роли пользователей

### BUSINESS (Бизнес-пользователь)

- **Доступ**: 1 проект по умолчанию
- **Возможности**:
  - Управление своим проектом
  - Добавление продуктов в проект
  - Простой интерфейс
- **Интерфейс**: Скрыта сложность проектов, фокус на продуктах

### AGENCY (Агентство/Разработчик)

- **Доступ**: Множество проектов
- **Возможности**:
  - Создание проектов для клиентов
  - Приглашение клиентов как администраторов
  - Управление всеми своими проектами
- **Интерфейс**: Полная функциональность, клиент-ориентированность

### ADMIN (Системный администратор)

- **Доступ**: Все проекты системы
- **Возможности**: Управление пользователями, тарифами, системой

## Доступы к проекту

- **PROJECT_OWNER**: Полный доступ, управление доступами
- **PROJECT_ADMIN**: Управление продуктами и контентом
- **PROJECT_EDITOR**: Редактирование контента
- **PROJECT_VIEWER**: Только просмотр

## Тарификация

### За проекты

- **BUSINESS**: 1 проект включен, +$10 за дополнительный
- **AGENCY**: $50/месяц за 10 проектов, +$5 за дополнительный

### За продукты

#### Базовые продукты (реализованы)

- **WEBSITE**: $5/месяц (до 50 страниц)
- **ECOMMERCE**: $15/месяц (до 100 товаров)
- **BLOG**: $3/месяц (до 100 постов)
- **LANDING**: $2/месяц (1 страница)

#### Продвинутые продукты (планируются)

- **CRM**: $25/месяц (до 1000 клиентов)
- **TASK_MANAGER**: $20/месяц (до 10 пользователей)
- **ANALYTICS**: $10/месяц (базовая аналитика)
- **API**: $15/месяц (до 10k запросов/день)

#### Дополнительные лимиты

- **WEBSITE**: +$1 за каждые 10 дополнительных страниц
- **ECOMMERCE**: +$5 за каждые 100 дополнительных товаров
- **CRM**: +$10 за каждые 500 дополнительных клиентов
- **API**: +$5 за каждые 10k дополнительных запросов

### За ИИ работу

- Генерация контента: по токенам
- Создание дизайна: по запросам
- Оптимизация: по действиям

## Примеры использования

### Бизнес: "Плитка+"

**Проект**: 1 проект "Плитка+"
**Продукты**:

- WEBSITE (корпоративный сайт + услуги)
- ECOMMERCE (каталог плитки + заказы)
  **Стоимость**: $20/месяц
  **Особенности**: Единый домен, общий дизайн, интеграция корзины с сайтом

### Агентство: "Веб-студия ProMax"

**Проекты**: 8 клиентских проектов
**Продукты**:

- 5 проектов с WEBSITE
- 2 проекта с WEBSITE + ECOMMERCE
- 1 проект с WEBSITE + BLOG + CRM
  **Стоимость**: $50 + (3×$5) + (2×$20) + (1×$33) = $138/месяц
  **Особенности**: Различная сложность для разных клиентов

### Крупный бизнес: "Мебель Групп"

**Проект**: 1 проект "Мебель Групп"
**Продукты**:

- WEBSITE (корпоративный сайт)
- ECOMMERCE (интернет-магазин мебели, 500+ товаров)
- BLOG (статьи о дизайне)
- CRM (управление B2B клиентами, 2000+ контактов)
- ANALYTICS (отчеты по продажам)
  **Стоимость**: $5 + $20 + $3 + $45 + $10 = $83/месяц
  **Особенности**: Полная экосистема под одним доменом

### Консалтинговая компания: "BizConsult"

**Проект**: 1 проект "BizConsult"
**Продукты**:

- WEBSITE (корпоративный сайт)
- CRM (клиентская база, 5000+ клиентов)
- TASK_MANAGER (внутренние проекты, 25 сотрудников)
- API (интеграция с мобильным приложением)
  **Стоимость**: $5 + $65 + $50 + $15 = $135/месяц
  **Особенности**: Сложная внутренняя экосистема для работы команды

### Стартап: "EcoDelivery"

**Проект**: 1 проект "EcoDelivery"
**Продукты**:

- LANDING (MVP лендинг)
- API (для мобильного приложения)
- ANALYTICS (отслеживание пользователей)
  **Стоимость**: $2 + $15 + $10 = $27/месяц
  **Особенности**: Минимальный набор для запуска продукта

## Техническая реализация

### Текущее состояние (MVP)

✅ **Реализовано**:

- Архитектура Проектов и базовых Продуктов
- WEBSITE продукт с Redaktus редактором
- Базовая система Page для контента
- Пользователи и роли (BUSINESS, AGENCY, ADMIN)
- Система доступов к проектам

### Следующие этапы развития

#### Этап 1: Завершение базовой архитектуры (1-2 месяца)

- [ ] Доработка ECOMMERCE продукта (товары, корзина, заказы)
- [ ] Улучшение BLOG функциональности
- [ ] Система плагинов для расширения продуктов
- [ ] API для внешних интеграций

#### Этап 2: Продвинутые продукты (3-6 месяцев)

- [ ] CRM система (клиенты, сделки, воронка)
- [ ] TASK_MANAGER (канбан, календарь, команды)
- [ ] ANALYTICS модуль (дашборды, отчеты)
- [ ] Система уведомлений и интеграций

#### Этап 3: Экосистема и масштабирование (6-12 месяцев)

- [ ] Микросервисная архитектура для продуктов
- [ ] Marketplace продуктов от сторонних разработчиков
- [ ] Продвинутая система интеграций
- [ ] Мобильные приложения

### Архитектурные принципы

#### 1. Модульность

Каждый продукт - отдельный модуль с собственной:

- Схемой базы данных
- API endpoints
- Frontend компонентами
- Системой настроек

#### 2. Расширяемость

- Система плагинов для кастомизации
- Hooks для встраивания в UI
- Event-driven архитектура для связи между модулями

#### 3. Масштабируемость

- Отдельные микросервисы для сложных продуктов
- Горизонтальное масштабирование по продуктам
- Кэширование и оптимизация запросов

#### 4. Безопасность

- Изоляция данных между проектами
- Ролевая модель доступа
- Аудит действий пользователей

### Вызовы и решения

#### Техническая сложность

**Проблема**: Радикальные различия между продуктами (страницы vs CRM vs аналитика)
**Решение**: Модульная архитектура с общими сервисами (аутентификация, уведомления, файлы)

#### Производительность

**Проблема**: Много продуктов в одном проекте могут замедлить систему
**Решение**: Ленивая загрузка модулей, кэширование, CDN для статики

#### UX сложность

**Проблема**: Как показать пользователю сложную экосистему продуктов
**Решение**: Умная навигация, контекстные переходы, единый дизайн

#### Ценообразование

**Проблема**: Справедливая цена за разные по сложности продукты
**Решение**: Гибкая система лимитов и дополнительных опций
