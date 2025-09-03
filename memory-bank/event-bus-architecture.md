# Event Bus Architecture - Situs

## 🏗️ Общая архитектура

### Компоненты системы

```
┌─────────────────────────────────────────────────────────────┐
│                    Event Bus System                        │
├─────────────────────────────────────────────────────────────┤
│  EventBus Core                                              │
│  ├── EventPublisher                                         │
│  ├── EventSubscriber                                        │
│  ├── EventRouter                                            │
│  └── EventMiddleware                                        │
├─────────────────────────────────────────────────────────────┤
│  Event Store                                                │
│  ├── PostgreSQL EventStore                                  │
│  ├── Event Indexing                                         │
│  └── Event Archiving                                        │
├─────────────────────────────────────────────────────────────┤
│  Transport Layer                                            │
│  ├── SSE Transport (existing)                               │
│  ├── Webhook Transport                                      │
│  └── Internal Transport                                     │
├─────────────────────────────────────────────────────────────┤
│  Integration Layer                                          │
│  ├── RealtimeEventsService (legacy)                        │
│  ├── React Hooks                                            │
│  └── Plugin System                                          │
└─────────────────────────────────────────────────────────────┘
```

## 📋 Core Components

### 1. **EventBus Core**

```typescript
// src/server/event-bus/event-bus.service.ts
@Injectable()
export class EventBusService {
  private readonly eventStore: EventStore;
  private readonly transportLayer: TransportLayer;
  private readonly middleware: EventMiddleware[];

  async publish<T>(event: Event<T>): Promise<void> {
    // 1. Apply middleware
    const processedEvent = await this.applyMiddleware(event);

    // 2. Store event
    await this.eventStore.save(processedEvent);

    // 3. Route to subscribers
    await this.routeEvent(processedEvent);

    // 4. Send via transport
    await this.transportLayer.send(processedEvent);
  }

  subscribe<T>(eventType: EventType, handler: EventHandler<T>): Subscription {
    // Register handler with routing
  }
}
```

### 2. **Event Types**

```typescript
// src/server/event-bus/types/event.types.ts
export interface Event<T = any> {
  id: string;
  type: EventType;
  payload: T;
  timestamp: Date;
  projectId?: string;
  tenantId?: string;
  userId?: string;
  metadata?: EventMetadata;
}

export enum EventType {
  // Project Events
  PROJECT_CREATED = 'project.created',
  PROJECT_UPDATED = 'project.updated',
  PROJECT_DELETED = 'project.deleted',
  PROJECT_STATUS_CHANGED = 'project.status_changed',

  // Integration Events
  INTEGRATION_CREATED = 'integration.created',
  INTEGRATION_UPDATED = 'integration.updated',
  INTEGRATION_DELETED = 'integration.deleted',
  INTEGRATION_STATUS_CHANGED = 'integration.status_changed',

  // User Events
  USER_CREATED = 'user.created',
  USER_UPDATED = 'user.updated',
  USER_DELETED = 'user.deleted',

  // Menu Events
  MENU_TYPE_CREATED = 'menu.type_created',
  MENU_ITEM_UPDATED = 'menu.item_updated',
  MENU_ITEM_DELETED = 'menu.item_deleted',
}
```

### 3. **Event Store**

```typescript
// src/server/event-bus/event-store/event-store.service.ts
@Injectable()
export class EventStoreService implements EventStore {
  constructor(private readonly prisma: PrismaService) {}

  async save(event: Event): Promise<void> {
    await this.prisma.event.create({
      data: {
        id: event.id,
        type: event.type,
        payload: event.payload,
        timestamp: event.timestamp,
        projectId: event.projectId,
        tenantId: event.tenantId,
        userId: event.userId,
        metadata: event.metadata,
      },
    });
  }

  async getEvents(filters: EventFilters): Promise<Event[]> {
    // Query with filters
  }

  async getEventsByProject(projectId: string): Promise<Event[]> {
    // Project-specific events
  }
}
```

### 4. **Transport Layer**

```typescript
// src/server/event-bus/transport/transport.service.ts
@Injectable()
export class TransportService {
  constructor(
    private readonly sseTransport: SSETransport,
    private readonly webhookTransport: WebhookTransport,
  ) {}

  async send(event: Event): Promise<void> {
    // Send via SSE
    await this.sseTransport.send(event);

    // Send webhooks
    await this.webhookTransport.send(event);
  }
}
```

## 🔄 Integration Strategy

### Phase 1: Extend RealtimeEventsService

```typescript
// src/server/realtime/realtime-events.service.ts
@Injectable()
export class RealtimeEventsService {
  constructor(
    private readonly eventBus: EventBusService, // New dependency
  ) {}

  publish<T = any>(type: ProjectEventType, payload?: T): void {
    // Convert to new Event format
    const event: Event<T> = {
      id: generateId(),
      type: this.mapEventType(type),
      payload,
      timestamp: new Date(),
      projectId: payload?.projectId,
    };

    // Publish via Event Bus
    this.eventBus.publish(event);
  }
}
```

### Phase 2: Create EventBus Module

```typescript
// src/server/event-bus/event-bus.module.ts
@Module({
  imports: [DatabaseModule],
  providers: [EventBusService, EventStoreService, TransportService, SSETransport, WebhookTransport],
  exports: [EventBusService],
})
export class EventBusModule {}
```

### Phase 3: Frontend Integration

```typescript
// src/hooks/useEventBus.ts
export function useEventBus<T>(eventType: EventType) {
  const [data, setData] = useState<T | null>(null);

  useEffect(() => {
    const subscription = eventBus.subscribe(eventType, (event) => {
      setData(event.payload);
    });

    return () => subscription.unsubscribe();
  }, [eventType]);

  return data;
}
```

## 🛡️ Middleware System

### Event Middleware

```typescript
// src/server/event-bus/middleware/event.middleware.ts
export interface EventMiddleware {
  process(event: Event): Promise<Event>;
}

@Injectable()
export class ValidationMiddleware implements EventMiddleware {
  async process(event: Event): Promise<Event> {
    // Validate event structure
    return event;
  }
}

@Injectable()
export class LoggingMiddleware implements EventMiddleware {
  async process(event: Event): Promise<Event> {
    // Log event
    return event;
  }
}

@Injectable()
export class SecurityMiddleware implements EventMiddleware {
  async process(event: Event): Promise<Event> {
    // Check permissions
    return event;
  }
}
```

## 🔌 Plugin Integration

### Plugin Event Handlers

```typescript
// src/server/plugins/plugin.event-handler.ts
@Injectable()
export class PluginEventHandler {
  constructor(private readonly eventBus: EventBusService) {}

  onModuleInit() {
    // Subscribe to plugin events
    this.eventBus.subscribe(EventType.PLUGIN_INSTALLED, this.handlePluginInstalled);
    this.eventBus.subscribe(EventType.PLUGIN_UPDATED, this.handlePluginUpdated);
  }

  private handlePluginInstalled = async (event: Event<PluginEventPayload>) => {
    // Handle plugin installation
  };
}
```

## 📊 Monitoring & Health

### Health Checks

```typescript
// src/server/event-bus/health/event-bus.health.ts
@Injectable()
export class EventBusHealthIndicator extends HealthIndicator {
  constructor(private readonly eventBus: EventBusService) {
    super();
  }

  async check(key: string): Promise<HealthIndicatorResult> {
    try {
      // Check Event Bus health
      const isHealthy = await this.eventBus.isHealthy();

      return this.getStatus(key, isHealthy, {
        status: isHealthy ? 'healthy' : 'unhealthy',
      });
    } catch (error) {
      return this.getStatus(key, false, { error: error.message });
    }
  }
}
```

## 🧪 Testing Strategy

### Unit Tests

```typescript
// src/server/event-bus/__tests__/event-bus.service.spec.ts
describe('EventBusService', () => {
  let service: EventBusService;
  let eventStore: jest.Mocked<EventStore>;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [EventBusService, { provide: EventStore, useValue: mockEventStore }],
    }).compile();

    service = module.get<EventBusService>(EventBusService);
  });

  it('should publish event', async () => {
    const event = createTestEvent();
    await service.publish(event);

    expect(eventStore.save).toHaveBeenCalledWith(event);
  });
});
```

### Integration Tests

```typescript
// tests/integration/event-bus.integration.spec.ts
describe('Event Bus Integration', () => {
  it('should handle SSE events', async () => {
    // Test SSE integration
  });

  it('should handle webhook delivery', async () => {
    // Test webhook delivery
  });
});
```

## 🚀 Deployment

### Docker Configuration

```dockerfile
# Dockerfile.event-bus
FROM node:20-alpine

WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production

COPY dist/ ./dist/
COPY prisma/ ./prisma/

EXPOSE 3002
CMD ["node", "dist/server/main.js"]
```

### Environment Configuration

```env
# .env.event-bus
EVENT_BUS_ENABLED=true
EVENT_STORE_URL=postgresql://...
WEBHOOK_RETRY_ATTEMPTS=3
WEBHOOK_TIMEOUT=5000
SSE_HEARTBEAT_INTERVAL=30000
```

## 📈 Performance Considerations

### Optimization Strategies

1. **Event Batching**: Batch multiple events for efficient processing
2. **Async Processing**: Use queues for heavy event processing
3. **Caching**: Cache frequently accessed event data
4. **Indexing**: Optimize database indexes for event queries
5. **Connection Pooling**: Efficient database connection management

### Monitoring Metrics

- Events per second
- Handler execution time
- Error rates
- Memory usage
- Queue depth
- Webhook delivery success rate
