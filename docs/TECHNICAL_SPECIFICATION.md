# Техническое задание: Event Bus и Plugin Architecture

## Цель

Реализация event-driven архитектуры и системы плагинов для Bilingus Service на основе анализа Lago и KillBill.

## Scope Phase 1: Core Architecture

### 1. Event Bus Implementation

#### 1.1 Архитектура Event Bus

```typescript
// src/core/events/types.ts
export interface BillingEvent {
  id: string;
  type: BillingEventType;
  payload: any;
  timestamp: Date;
  tenantId?: string;
  userId?: string;
  metadata?: Record<string, any>;
}

export enum BillingEventType {
  // User Events
  USER_CREATED = 'user.created',
  USER_UPDATED = 'user.updated',
  USER_DELETED = 'user.deleted',

  // Balance Events
  BALANCE_CREATED = 'balance.created',
  BALANCE_UPDATED = 'balance.updated',
  BALANCE_CREDITED = 'balance.credited',
  BALANCE_DEBITED = 'balance.debited',

  // Transaction Events
  TRANSACTION_CREATED = 'transaction.created',
  TRANSACTION_COMPLETED = 'transaction.completed',
  TRANSACTION_FAILED = 'transaction.failed',
  TRANSACTION_CANCELLED = 'transaction.cancelled',

  // Currency Events
  CURRENCY_CREATED = 'currency.created',
  CURRENCY_UPDATED = 'currency.updated',
  CURRENCY_ACTIVATED = 'currency.activated',
  CURRENCY_DEACTIVATED = 'currency.deactivated',

  // Invoice Events
  INVOICE_GENERATED = 'invoice.generated',
  INVOICE_PAID = 'invoice.paid',
  INVOICE_OVERDUE = 'invoice.overdue',

  // Payment Events
  PAYMENT_INITIATED = 'payment.initiated',
  PAYMENT_COMPLETED = 'payment.completed',
  PAYMENT_FAILED = 'payment.failed',
  PAYMENT_REFUNDED = 'payment.refunded'
}

export interface EventHandler {
  (event: BillingEvent): Promise<void>;
}
```

#### 1.2 Event Bus Service

```typescript
// src/core/events/EventBus.ts
export class EventBus {
  private handlers: Map<BillingEventType, EventHandler[]> = new Map();
  private eventStore: EventStore;

  constructor(eventStore: EventStore) {
    this.eventStore = eventStore;
  }

  async publish(event: BillingEvent): Promise<void> {
    // Persist event
    await this.eventStore.save(event);

    // Notify handlers
    const handlers = this.handlers.get(event.type) || [];
    await Promise.all(handlers.map(handler =>
      this.safeExecute(handler, event)
    ));

    // Notify webhooks
    await this.notifyWebhooks(event);
  }

  subscribe(eventType: BillingEventType, handler: EventHandler): void {
    if (!this.handlers.has(eventType)) {
      this.handlers.set(eventType, []);
    }
    this.handlers.get(eventType)!.push(handler);
  }

  private async safeExecute(handler: EventHandler, event: BillingEvent): Promise<void> {
    try {
      await handler(event);
    } catch (error) {
      console.error(`Event handler error for ${event.type}:`, error);
      // Log to monitoring system
    }
  }

  private async notifyWebhooks(event: BillingEvent): Promise<void> {
    // Implementation for webhook notifications
  }
}
```

#### 1.3 Event Store

```typescript
// src/core/events/EventStore.ts
export interface EventStore {
  save(event: BillingEvent): Promise<void>;
  getEvents(filters: EventFilters): Promise<BillingEvent[]>;
  getEventsByType(type: BillingEventType): Promise<BillingEvent[]>;
  getEventsByEntity(entityId: string): Promise<BillingEvent[]>;
}

export class PostgresEventStore implements EventStore {
  constructor(private prisma: PrismaClient) {}

  async save(event: BillingEvent): Promise<void> {
    await this.prisma.billingEvent.create({
      data: {
        id: event.id,
        type: event.type,
        payload: event.payload,
        timestamp: event.timestamp,
        tenantId: event.tenantId,
        userId: event.userId,
        metadata: event.metadata
      }
    });
  }

  async getEvents(filters: EventFilters): Promise<BillingEvent[]> {
    // Implementation
  }
}
```

### 2. Plugin Architecture

#### 2.1 Plugin Interface

```typescript
// src/core/plugins/types.ts
export interface BillingPlugin {
  name: string;
  version: string;
  description: string;
  author: string;

  initialize(config: PluginConfig): Promise<void>;
  execute(context: BillingContext): Promise<PluginResult>;
  shutdown(): Promise<void>;
}

export interface PluginConfig {
  settings: Record<string, any>;
  eventBus: EventBus;
  database: PrismaClient;
  logger: Logger;
}

export interface BillingContext {
  eventType: BillingEventType;
  payload: any;
  user?: User;
  tenant?: string;
}

export interface PluginResult {
  success: boolean;
  data?: any;
  error?: string;
  shouldContinue?: boolean;
}
```

#### 2.2 Специализированные Plugin Interfaces

```typescript
// Payment Plugin
export interface PaymentPlugin extends BillingPlugin {
  processPayment(request: PaymentRequest): Promise<PaymentResult>;
  refundPayment(request: RefundRequest): Promise<RefundResult>;
  getPaymentStatus(paymentId: string): Promise<PaymentStatus>;
}

// Tax Plugin
export interface TaxPlugin extends BillingPlugin {
  calculateTax(request: TaxCalculationRequest): Promise<TaxResult>;
  validateTaxNumber(taxNumber: string, country: string): Promise<boolean>;
}

// Fraud Detection Plugin
export interface FraudPlugin extends BillingPlugin {
  checkTransaction(transaction: Transaction): Promise<FraudResult>;
  reportFraud(transactionId: string, reason: string): Promise<void>;
}

// Notification Plugin
export interface NotificationPlugin extends BillingPlugin {
  sendNotification(notification: NotificationRequest): Promise<void>;
  getNotificationStatus(notificationId: string): Promise<NotificationStatus>;
}
```

#### 2.3 Plugin Manager

```typescript
// src/core/plugins/PluginManager.ts
export class PluginManager {
  private plugins: Map<string, BillingPlugin> = new Map();
  private eventBus: EventBus;

  constructor(eventBus: EventBus) {
    this.eventBus = eventBus;
  }

  async loadPlugin(pluginPath: string, config: PluginConfig): Promise<void> {
    const PluginClass = await import(pluginPath);
    const plugin = new PluginClass.default();

    await plugin.initialize(config);
    this.plugins.set(plugin.name, plugin);

    // Subscribe to relevant events
    this.subscribePluginToEvents(plugin);
  }

  async unloadPlugin(pluginName: string): Promise<void> {
    const plugin = this.plugins.get(pluginName);
    if (plugin) {
      await plugin.shutdown();
      this.plugins.delete(pluginName);
    }
  }

  getPlugin<T extends BillingPlugin>(name: string): T | undefined {
    return this.plugins.get(name) as T;
  }

  async executePlugin(pluginName: string, context: BillingContext): Promise<PluginResult> {
    const plugin = this.plugins.get(pluginName);
    if (!plugin) {
      throw new Error(`Plugin ${pluginName} not found`);
    }

    return await plugin.execute(context);
  }

  private subscribePluginToEvents(plugin: BillingPlugin): void {
    // Auto-subscribe plugin to events based on its type
    if (this.isPaymentPlugin(plugin)) {
      this.eventBus.subscribe(BillingEventType.PAYMENT_INITIATED,
        async (event) => await plugin.execute({
          eventType: event.type,
          payload: event.payload
        })
      );
    }
  }

  private isPaymentPlugin(plugin: BillingPlugin): plugin is PaymentPlugin {
    return 'processPayment' in plugin;
  }
}
```

### 3. Database Schema Updates

#### 3.1 Events Table

```sql
- - Add to schema.prisma
model BillingEvent {
  id        String   @id @default(cuid())
  type      String
  payload   Json
  timestamp DateTime @default(now())
  tenantId  String?
  userId    String?
  metadata  Json?

  createdAt DateTime @default(now())

  @@index([type])
  @@index([timestamp])
  @@index([tenantId])
  @@index([userId])
}

model Plugin {
  id          String   @id @default(cuid())
  name        String   @unique
  version     String
  description String?
  author      String?
  isActive    Boolean  @default(true)
  config      Json?

  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}

model WebhookEndpoint {
  id          String   @id @default(cuid())
  url         String
  events      String[] // Array of event types
  isActive    Boolean  @default(true)
  secret      String?

  tenantId    String?

  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  @@index([tenantId])
}
```

### 4. Integration Points

#### 4.1 Service Updates

```typescript
// src/services/UserService.ts
export class UserService {
  constructor(
    private prisma: PrismaClient,
    private eventBus: EventBus
  ) {}

  async createUser(userData: CreateUserRequest): Promise<User> {
    const user = await this.prisma.user.create({
      data: userData
    });

    // Publish event
    await this.eventBus.publish({
      id: generateId(),
      type: BillingEventType.USER_CREATED,
      payload: { user },
      timestamp: new Date()
    });

    return user;
  }
}
```

#### 4.2 API Endpoints для Plugin Management

```typescript
// src/routes/plugins.ts
export const pluginRoutes = express.Router();

pluginRoutes.get('/plugins', async (req, res) => {
  const plugins = await pluginManager.getInstalledPlugins();
  res.json(plugins);
});

pluginRoutes.post('/plugins/:name/install', async (req, res) => {
  const { name } = req.params;
  const { config } = req.body;

  await pluginManager.loadPlugin(name, config);
  res.json({ success: true });
});

pluginRoutes.delete('/plugins/:name', async (req, res) => {
  const { name } = req.params;
  await pluginManager.unloadPlugin(name);
  res.json({ success: true });
});
```

### 5. Example Plugins

#### 5.1 Stripe Payment Plugin

```typescript
// plugins/stripe-payment/index.ts
export default class StripePaymentPlugin implements PaymentPlugin {
  name = 'stripe-payment';
  version = '1.0.0';
  description = 'Stripe payment processing plugin';
  author = 'Bilingus Team';

  private stripe: Stripe;

  async initialize(config: PluginConfig): Promise<void> {
    this.stripe = new Stripe(config.settings.apiKey);
  }

  async execute(context: BillingContext): Promise<PluginResult> {
    if (context.eventType === BillingEventType.PAYMENT_INITIATED) {
      return await this.processPayment(context.payload);
    }
    return { success: true };
  }

  async processPayment(request: PaymentRequest): Promise<PaymentResult> {
    try {
      const paymentIntent = await this.stripe.paymentIntents.create({
        amount: request.amount,
        currency: request.currency,
        payment_method: request.paymentMethodId
      });

      return {
        success: true,
        paymentId: paymentIntent.id,
        status: 'pending'
      };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  async shutdown(): Promise<void> {
    // Cleanup resources
  }
}
```

#### 5.2 Email Notification Plugin

```typescript
// plugins/email-notification/index.ts
export default class EmailNotificationPlugin implements NotificationPlugin {
  name = 'email-notification';
  version = '1.0.0';
  description = 'Email notification plugin';
  author = 'Bilingus Team';

  private transporter: nodemailer.Transporter;

  async initialize(config: PluginConfig): Promise<void> {
    this.transporter = nodemailer.createTransporter(config.settings.smtp);

    // Subscribe to events
    config.eventBus.subscribe(BillingEventType.INVOICE_GENERATED,
      async (event) => await this.handleInvoiceGenerated(event)
    );
  }

  async execute(context: BillingContext): Promise<PluginResult> {
    return { success: true };
  }

  private async handleInvoiceGenerated(event: BillingEvent): Promise<void> {
    const { invoice, user } = event.payload;

    await this.sendNotification({
      to: user.email,
      subject: 'New Invoice Generated',
      template: 'invoice-generated',
      data: { invoice, user }
    });
  }

  async sendNotification(notification: NotificationRequest): Promise<void> {
    await this.transporter.sendMail({
      to: notification.to,
      subject: notification.subject,
      html: await this.renderTemplate(notification.template, notification.data)
    });
  }

  async shutdown(): Promise<void> {
    this.transporter.close();
  }
}
```

## Implementation Plan

### Week 1: Event Bus Foundation

- [ ] Создать Event Bus interface и implementation
- [ ] Добавить EventStore с PostgreSQL
- [ ] Обновить database schema
- [ ] Создать базовые event types

### Week 2: Plugin Architecture

- [ ] Реализовать Plugin interfaces
- [ ] Создать PluginManager
- [ ] Добавить plugin loading/unloading
- [ ] Создать API endpoints для plugin management

### Week 3: Integration

- [ ] Интегрировать Event Bus в существующие services
- [ ] Добавить event publishing во все CRUD operations
- [ ] Создать webhook system
- [ ] Добавить monitoring и logging

### Week 4: Example Plugins

- [ ] Создать Stripe Payment Plugin
- [ ] Создать Email Notification Plugin
- [ ] Создать Audit Log Plugin
- [ ] Написать documentation и tests

## Success Criteria

1. **Event Bus**: Все operations генерируют events
2. **Plugin System**: Можно загружать/выгружать plugins
3. **Payment Plugin**: Stripe integration работает
4. **Notification Plugin**: Email уведомления работают
5. **Monitoring**: События логируются и мониторятся
6. **Documentation**: Полная документация для разработчиков плагинов

## Risks & Mitigation

1. **Performance**: Event publishing может замедлить operations
   - Mitigation: Async event processing, event batching

2. **Plugin Stability**: Плохие plugins могут сломать систему
   - Mitigation: Plugin isolation, error handling, health checks

3. **Complexity**: Архитектура становится сложнее
   - Mitigation: Хорошая документация, примеры, тесты

- --

* *Дата создания**: 2025-01-27
* *Приоритет**: High
* *Estimated Effort**: 4 weeks
* *Dependencies**: Existing Bilingus Service