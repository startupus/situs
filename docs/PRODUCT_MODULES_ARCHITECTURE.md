# Архитектура продуктовых модулей Situs

## Общая концепция

Каждый продукт в Situs реализован как независимый модуль со своей архитектурой, но использующий общую инфраструктуру проекта.

## Базовые интерфейсы

### ProductModule

```typescript
interface ProductModule {
  // Метаданные
  type: ProductType;
  name: string;
  version: string;
  description: string;

  // Схема данных
  databaseSchema: {
    models: PrismaModel[];
    relations: PrismaRelation[];
    migrations: string[];
  };

  // API
  apiRoutes: {
    basePath: string; // /api/products/website
    routes: ExpressRouter; // Express маршруты
    middleware: Middleware[]; // Дополнительные middleware
  };

  // Frontend
  components: {
    // Административный интерфейс
    admin: {
      dashboard: React.Component; // Дашборд продукта
      settings: React.Component; // Настройки продукта
      editor: React.Component; // Редактор контента
    };

    // Пользовательский интерфейс
    public: {
      viewer: React.Component; // Отображение для visitors
      app: React.Component; // SPA приложение (для CRM, etc)
    };

    // Виджеты для встраивания
    widgets: React.Component[];
  };

  // Конфигурация
  config: ProductConfig;

  // Lifecycle
  hooks: ProductLifecycleHooks;

  // Интеграции
  integrations: ProductIntegration[];
}
```

### ProductConfig

```typescript
interface ProductConfig {
  // Тарификация
  pricing: {
    basePlan: PricingTier;
    additionalLimits: LimitPricing[];
    features: FeaturePricing[];
  };

  // Лимиты ресурсов
  limits: {
    [key: string]: {
      default: number;
      max: number;
      upgradePrice: number;
    };
  };

  // Маршрутизация
  routing: {
    prefix: string; // /shop, /crm, /blog
    subdomain?: string; // shop.domain.com
    customRoutes: RouteConfig[];
  };

  // Права доступа
  permissions: {
    roles: ProductRole[];
    actions: ProductAction[];
    rules: AccessRule[];
  };

  // Настройки UI
  ui: {
    theme: ThemeConfig;
    navigation: NavigationConfig;
    dashboardWidgets: WidgetConfig[];
  };
}
```

## Реализованные модули

### 1. WebsiteModule

```typescript
class WebsiteModule implements ProductModule {
  type = 'WEBSITE';
  name = 'Website Builder';
  version = '1.0.0';

  databaseSchema = {
    models: [
      // Page уже реализована в основной схеме
      // Block - блоки контента страниц
      // Template - шаблоны страниц
    ],
    relations: ['Page.productId -> Product.id', 'Block.pageId -> Page.id'],
  };

  apiRoutes = {
    basePath: '/api/products/website',
    routes: WebsiteRouter,
    middleware: [authMiddleware, websitePermissions],
  };

  components = {
    admin: {
      dashboard: WebsiteDashboard, // Статистика страниц
      settings: WebsiteSettings, // SEO, домены
      editor: RedaktusEditor, // Drag&drop редактор
    },
    public: {
      viewer: WebsiteViewer, // Рендер страниц
      app: null, // SPA не нужно
    },
    widgets: [SitemapWidget, SEOWidget],
  };

  config = {
    pricing: {
      basePlan: { price: 5, limits: { pages: 50 } },
    },
    limits: {
      pages: { default: 50, max: 1000, upgradePrice: 1 },
      storage: { default: 1024, max: 10240, upgradePrice: 2 },
    },
    routing: {
      prefix: '/', // Корневые страницы
      customRoutes: ['/:slug', '/pages/:slug'],
    },
  };
}
```

### 2. EcommerceModule (планируется)

```typescript
class EcommerceModule implements ProductModule {
  type = 'ECOMMERCE';
  name = 'Online Store';
  version = '0.5.0';

  databaseSchema = {
    models: [
      'EcommerceProduct', // Товары
      'Category', // Категории
      'Cart', // Корзины
      'Order', // Заказы
      'Customer', // Покупатели
      'Payment', // Платежи
      'Shipping', // Доставка
    ],
    relations: [
      'EcommerceProduct.categoryId -> Category.id',
      'Order.customerId -> Customer.id',
      'Cart.productId -> EcommerceProduct.id',
    ],
  };

  apiRoutes = {
    basePath: '/api/products/ecommerce',
    routes: EcommerceRouter,
    middleware: [authMiddleware, ecommercePermissions],
  };

  components = {
    admin: {
      dashboard: EcommerceDashboard, // Статистика продаж
      settings: EcommerceSettings, // Платежи, доставка
      editor: ProductEditor, // Управление товарами
    },
    public: {
      viewer: ShopViewer, // Каталог товаров
      app: ShopApp, // Корзина, оформление
    },
    widgets: [CartWidget, ProductsWidget],
  };

  config = {
    pricing: {
      basePlan: { price: 15, limits: { products: 100, orders: 500 } },
    },
    routing: {
      prefix: '/shop',
      customRoutes: ['/shop/category/:slug', '/shop/product/:slug', '/shop/cart', '/shop/checkout'],
    },
  };
}
```

### 3. CrmModule (планируется)

```typescript
class CrmModule implements ProductModule {
  type = 'CRM';
  name = 'Customer Relationship Management';
  version = '0.1.0';

  databaseSchema = {
    models: [
      'CrmClient', // Клиенты
      'Deal', // Сделки
      'Task', // Задачи
      'Communication', // Коммуникации
      'Pipeline', // Воронки продаж
      'Activity', // Активности
    ],
  };

  components = {
    admin: {
      dashboard: CrmDashboard, // Дашборд продаж
      settings: CrmSettings, // Настройки воронок
      editor: null, // Нет контент-редактора
    },
    public: {
      viewer: null, // Публичного доступа нет
      app: CrmApp, // Полноценное SPA
    },
  };

  config = {
    pricing: {
      basePlan: { price: 25, limits: { clients: 1000, deals: 500 } },
    },
    routing: {
      prefix: '/crm',
      customRoutes: ['/crm/clients', '/crm/deals', '/crm/tasks', '/crm/reports'],
    },
  };
}
```

## Система загрузки модулей

### ModuleRegistry

```typescript
class ModuleRegistry {
  private modules = new Map<ProductType, ProductModule>();

  // Регистрация модуля
  register(module: ProductModule): void {
    this.modules.set(module.type, module);
    this.initializeModule(module);
  }

  // Получение модуля
  get(type: ProductType): ProductModule | null {
    return this.modules.get(type) || null;
  }

  // Инициализация модуля
  private async initializeModule(module: ProductModule): Promise<void> {
    // Применяем миграции БД
    await this.applyMigrations(module.databaseSchema.migrations);

    // Регистрируем API роуты
    this.registerRoutes(module.apiRoutes);

    // Регистрируем UI компоненты
    this.registerComponents(module.components);

    // Вызываем lifecycle хуки
    await module.hooks.onInstall?.();
  }
}
```

### ProductFactory

```typescript
class ProductFactory {
  constructor(private registry: ModuleRegistry) {}

  // Создание экземпляра продукта
  async createProduct(projectId: string, type: ProductType, config: any): Promise<Product> {
    const module = this.registry.get(type);
    if (!module) {
      throw new Error(`Module for ${type} not found`);
    }

    // Создаем запись в БД
    const product = await prisma.product.create({
      data: {
        projectId,
        type,
        name: config.name,
        settings: JSON.stringify(config.settings),
        ...module.config.defaults,
      },
    });

    // Инициализируем специфичные данные продукта
    await module.hooks.onProductCreate?.(product.id, config);

    return product;
  }
}
```

## Система плагинов

### ProductPlugin

```typescript
interface ProductPlugin {
  name: string;
  version: string;
  targetProduct: ProductType;

  // Расширения схемы БД
  schemaExtensions: {
    fields: FieldExtension[]; // Новые поля к существующим моделям
    models: PrismaModel[]; // Новые модели
    relations: PrismaRelation[]; // Новые связи
  };

  // Расширения API
  apiExtensions: {
    endpoints: ApiEndpoint[]; // Новые endpoints
    middleware: Middleware[]; // Дополнительные middleware
    hooks: ApiHook[]; // Hooks в существующие endpoints
  };

  // Расширения UI
  uiExtensions: {
    components: Component[]; // Новые компоненты
    hooks: UIHook[]; // Hooks для встраивания в UI
    routes: RouteConfig[]; // Новые маршруты
  };

  // Lifecycle
  onInstall(): Promise<void>;
  onUninstall(): Promise<void>;
  onUpdate(oldVersion: string): Promise<void>;
}
```

### Пример плагина: PaymentPlugin для EcommerceModule

```typescript
class StripePaymentPlugin implements ProductPlugin {
  name = 'Stripe Payment Gateway';
  version = '1.0.0';
  targetProduct = 'ECOMMERCE';

  schemaExtensions = {
    fields: [
      {
        model: 'Order',
        field: 'stripePaymentIntentId',
        type: 'String?',
      },
    ],
    models: [
      {
        name: 'StripeTransaction',
        fields: ['id String @id', 'orderId String', 'stripeChargeId String', 'amount Int', 'status String'],
      },
    ],
  };

  apiExtensions = {
    endpoints: [
      {
        path: '/api/products/ecommerce/payments/stripe/webhook',
        method: 'POST',
        handler: this.handleStripeWebhook,
      },
    ],
    hooks: [
      {
        target: 'POST /api/products/ecommerce/orders',
        when: 'after',
        handler: this.processPayment,
      },
    ],
  };

  uiExtensions = {
    components: [StripeCheckoutForm],
    hooks: [
      {
        target: 'EcommerceCheckout',
        position: 'payment-methods',
        component: StripePaymentMethod,
      },
    ],
  };
}
```

## Интеграционная шина

### ProductBus

```typescript
class ProductBus {
  private subscribers = new Map<string, EventHandler[]>();

  // Публикация события
  publish(event: ProductEvent): void {
    const handlers = this.subscribers.get(event.type) || [];
    handlers.forEach((handler) => handler(event));
  }

  // Подписка на события
  subscribe(eventType: string, handler: EventHandler): void {
    const handlers = this.subscribers.get(eventType) || [];
    handlers.push(handler);
    this.subscribers.set(eventType, handlers);
  }

  // Межпродуктовые запросы
  async query(sourceProduct: string, targetProduct: string, query: Query): Promise<Result> {
    const targetModule = this.registry.get(targetProduct);
    if (!targetModule?.handlers?.query) {
      throw new Error(`Product ${targetProduct} doesn't support queries`);
    }

    return await targetModule.handlers.query(sourceProduct, query);
  }
}
```

### Примеры интеграций

```typescript
// CRM интегрируется с Ecommerce для получения данных о покупках
class CrmModule {
  async getClientPurchases(clientEmail: string): Promise<Order[]> {
    return await productBus.query('CRM', 'ECOMMERCE', {
      type: 'getOrdersByEmail',
      params: { email: clientEmail },
    });
  }
}

// Website интегрируется с Analytics для отправки событий
class WebsiteModule {
  async trackPageView(pageId: string, visitorId: string): Promise<void> {
    productBus.publish({
      type: 'page.viewed',
      source: 'WEBSITE',
      data: { pageId, visitorId, timestamp: Date.now() },
    });
  }
}

// Analytics подписывается на события от всех продуктов
class AnalyticsModule {
  constructor() {
    productBus.subscribe('page.viewed', this.handlePageView);
    productBus.subscribe('order.created', this.handleOrderCreated);
    productBus.subscribe('task.completed', this.handleTaskCompleted);
  }
}
```

## Развертывание и масштабирование

### Поэтапное подключение модулей

1. **Фаза 1**: Базовые модули (Website, Blog) как часть монолита
2. **Фаза 2**: Средние модули (Ecommerce) как отдельные сервисы с общей БД
3. **Фаза 3**: Сложные модули (CRM, Analytics) как микросервисы с собственными БД
4. **Фаза 4**: Внешние модули от третьих лиц через API

### Стратегия миграции

- Обратная совместимость API
- Постепенная миграция данных
- Canary deployment для новых модулей
- Rollback стратегии
