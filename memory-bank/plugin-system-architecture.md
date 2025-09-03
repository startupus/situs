# Plugin System Architecture - Situs

## 🏗️ Общая архитектура

### Компоненты системы

```
┌─────────────────────────────────────────────────────────────┐
│                    Plugin System                            │
├─────────────────────────────────────────────────────────────┤
│  Plugin Core                                                │
│  ├── PluginManager                                          │
│  ├── PluginRegistry                                         │
│  ├── PluginLoader                                           │
│  └── PluginAPI                                              │
├─────────────────────────────────────────────────────────────┤
│  Plugin Runtime                                             │
│  ├── PluginSandbox                                          │
│  ├── PluginContext                                          │
│  └── PluginDependencies                                     │
├─────────────────────────────────────────────────────────────┤
│  Plugin Types                                               │
│  ├── ProductPlugin                                          │
│  ├── IntegrationPlugin                                      │
│  ├── UIPlugin                                               │
│  └── MiddlewarePlugin                                       │
├─────────────────────────────────────────────────────────────┤
│  Integration Layer                                          │
│  ├── Event Bus Integration                                  │
│  ├── Products Module Integration                            │
│  └── Frontend Integration                                   │
└─────────────────────────────────────────────────────────────┘
```

## 📋 Core Components

### 1. **PluginManager**

```typescript
// src/server/plugins/plugin-manager.service.ts
@Injectable()
export class PluginManagerService {
  private readonly registry: PluginRegistry;
  private readonly loader: PluginLoader;
  private readonly sandbox: PluginSandbox;

  async installPlugin(pluginPath: string): Promise<Plugin> {
    // 1. Validate plugin manifest
    const manifest = await this.validateManifest(pluginPath);

    // 2. Check dependencies
    await this.checkDependencies(manifest.dependencies);

    // 3. Load plugin
    const plugin = await this.loader.load(pluginPath);

    // 4. Register in registry
    await this.registry.register(plugin);

    return plugin;
  }

  async activatePlugin(pluginId: string): Promise<void> {
    const plugin = this.registry.get(pluginId);
    await plugin.activate();
    await this.sandbox.createContext(plugin);
  }

  async deactivatePlugin(pluginId: string): Promise<void> {
    const plugin = this.registry.get(pluginId);
    await plugin.deactivate();
    await this.sandbox.destroyContext(plugin);
  }
}
```

### 2. **PluginRegistry**

```typescript
// src/server/plugins/plugin-registry.service.ts
@Injectable()
export class PluginRegistryService {
  private readonly plugins = new Map<string, Plugin>();
  private readonly dependencies = new Map<string, string[]>();

  register(plugin: Plugin): void {
    this.plugins.set(plugin.id, plugin);
    this.dependencies.set(plugin.id, plugin.dependencies);
  }

  get(pluginId: string): Plugin {
    const plugin = this.plugins.get(pluginId);
    if (!plugin) {
      throw new PluginNotFoundError(pluginId);
    }
    return plugin;
  }

  getAll(): Plugin[] {
    return Array.from(this.plugins.values());
  }

  getByType(type: PluginType): Plugin[] {
    return this.getAll().filter((plugin) => plugin.type === type);
  }
}
```

### 3. **PluginLoader**

```typescript
// src/server/plugins/plugin-loader.service.ts
@Injectable()
export class PluginLoaderService {
  async load(pluginPath: string): Promise<Plugin> {
    // 1. Load manifest
    const manifest = await this.loadManifest(pluginPath);

    // 2. Validate manifest
    await this.validateManifest(manifest);

    // 3. Load plugin module
    const pluginModule = await this.loadModule(pluginPath);

    // 4. Create plugin instance
    const plugin = new pluginModule.default(manifest);

    return plugin;
  }

  private async loadManifest(pluginPath: string): Promise<PluginManifest> {
    const manifestPath = path.join(pluginPath, 'plugin.json');
    const manifestContent = await fs.readFile(manifestPath, 'utf-8');
    return JSON.parse(manifestContent);
  }
}
```

### 4. **PluginAPI**

```typescript
// src/server/plugins/plugin-api.service.ts
@Injectable()
export class PluginAPIService {
  constructor(
    private readonly eventBus: EventBusService,
    private readonly prisma: PrismaService,
  ) {}

  getEventBus(): EventBusAPI {
    return {
      publish: (event: Event) => this.eventBus.publish(event),
      subscribe: (eventType: EventType, handler: EventHandler) => this.eventBus.subscribe(eventType, handler),
    };
  }

  getDatabase(): DatabaseAPI {
    return {
      query: (sql: string) => this.prisma.$queryRaw(sql),
      findMany: (model: string, where: any) => this.prisma[model].findMany(where),
    };
  }

  getUsers(): UsersAPI {
    return {
      findById: (id: string) => this.prisma.user.findUnique({ where: { id } }),
      findByEmail: (email: string) => this.prisma.user.findUnique({ where: { email } }),
    };
  }
}
```

## 🔄 Plugin Types

### 1. **ProductPlugin**

```typescript
// src/server/plugins/types/product-plugin.interface.ts
export interface ProductPlugin extends Plugin {
  type: 'product';

  // Product-specific methods
  getProductSchema(): ProductSchema;
  getProductAPI(): ProductAPI;
  getProductUI(): ProductUI;

  // Lifecycle hooks
  onProductCreated?(product: Product): Promise<void>;
  onProductUpdated?(product: Product): Promise<void>;
  onProductDeleted?(productId: string): Promise<void>;
}
```

### 2. **IntegrationPlugin**

```typescript
// src/server/plugins/types/integration-plugin.interface.ts
export interface IntegrationPlugin extends Plugin {
  type: 'integration';

  // Integration-specific methods
  getIntegrationConfig(): IntegrationConfig;
  getIntegrationAPI(): IntegrationAPI;

  // Lifecycle hooks
  onIntegrationActivated?(config: IntegrationConfig): Promise<void>;
  onIntegrationDeactivated?(config: IntegrationConfig): Promise<void>;

  // Event handlers
  handleEvent?(event: Event): Promise<void>;
}
```

### 3. **UIPlugin**

```typescript
// src/server/plugins/types/ui-plugin.interface.ts
export interface UIPlugin extends Plugin {
  type: 'ui';

  // UI-specific methods
  getUIComponents(): UIComponent[];
  getUIRoutes(): UIRoute[];
  getUINavigation(): UINavigation;

  // Lifecycle hooks
  onUIMount?(component: UIComponent): Promise<void>;
  onUIUnmount?(component: UIComponent): Promise<void>;
}
```

## 🛡️ Plugin Sandbox

### PluginSandbox

```typescript
// src/server/plugins/runtime/plugin-sandbox.service.ts
@Injectable()
export class PluginSandboxService {
  private readonly contexts = new Map<string, PluginContext>();

  async createContext(plugin: Plugin): Promise<PluginContext> {
    const context = new PluginContext(plugin);
    this.contexts.set(plugin.id, context);

    // Initialize sandbox environment
    await context.initialize();

    return context;
  }

  async destroyContext(plugin: Plugin): Promise<void> {
    const context = this.contexts.get(plugin.id);
    if (context) {
      await context.cleanup();
      this.contexts.delete(plugin.id);
    }
  }

  getContext(pluginId: string): PluginContext {
    const context = this.contexts.get(pluginId);
    if (!context) {
      throw new PluginContextNotFoundError(pluginId);
    }
    return context;
  }
}
```

### PluginContext

```typescript
// src/server/plugins/runtime/plugin-context.service.ts
export class PluginContext {
  private readonly plugin: Plugin;
  private readonly api: PluginAPI;
  private readonly permissions: PluginPermissions;

  constructor(plugin: Plugin) {
    this.plugin = plugin;
    this.api = new PluginAPI(plugin.permissions);
    this.permissions = plugin.permissions;
  }

  async initialize(): Promise<void> {
    // Initialize plugin context
    await this.plugin.initialize(this.api);
  }

  async cleanup(): Promise<void> {
    // Cleanup plugin context
    await this.plugin.cleanup();
  }

  hasPermission(permission: string): boolean {
    return this.permissions.includes(permission);
  }
}
```

## 🔌 Plugin Manifest

### PluginManifest

```typescript
// src/server/plugins/types/plugin-manifest.interface.ts
export interface PluginManifest {
  id: string;
  name: string;
  version: string;
  description: string;
  author: string;
  type: PluginType;

  // Dependencies
  dependencies?: PluginDependency[];
  peerDependencies?: PluginDependency[];

  // Permissions
  permissions: PluginPermission[];

  // API
  api?: PluginAPIDefinition;

  // Configuration
  config?: PluginConfigSchema;

  // Lifecycle
  lifecycle?: PluginLifecycleHooks;

  // Metadata
  metadata?: Record<string, any>;
}
```

### PluginDependency

```typescript
export interface PluginDependency {
  id: string;
  version: string;
  optional?: boolean;
}
```

## 🔄 Integration Strategy

### 1. **Event Bus Integration**

```typescript
// src/server/plugins/integrations/event-bus-integration.service.ts
@Injectable()
export class EventBusIntegrationService {
  constructor(private readonly eventBus: EventBusService) {}

  registerPluginEvents(plugin: Plugin): void {
    if (plugin.type === 'integration') {
      const integrationPlugin = plugin as IntegrationPlugin;

      // Register plugin event handlers
      integrationPlugin.getEventHandlers().forEach((handler) => {
        this.eventBus.subscribe(handler.eventType, handler.handler);
      });
    }
  }

  unregisterPluginEvents(plugin: Plugin): void {
    // Unregister plugin event handlers
    this.eventBus.unsubscribe(plugin.id);
  }
}
```

### 2. **Products Module Integration**

```typescript
// src/server/plugins/integrations/products-integration.service.ts
@Injectable()
export class ProductsIntegrationService {
  constructor(private readonly productsService: ProductsService) {}

  registerProductPlugin(plugin: ProductPlugin): void {
    const productSchema = plugin.getProductSchema();
    const productAPI = plugin.getProductAPI();

    // Register product type
    this.productsService.registerProductType(productSchema);

    // Register product API
    this.productsService.registerProductAPI(productSchema.type, productAPI);
  }

  unregisterProductPlugin(plugin: ProductPlugin): void {
    const productSchema = plugin.getProductSchema();

    // Unregister product type
    this.productsService.unregisterProductType(productSchema.type);
  }
}
```

### 3. **Frontend Integration**

```typescript
// src/server/plugins/integrations/frontend-integration.service.ts
@Injectable()
export class FrontendIntegrationService {
  registerUIPlugin(plugin: UIPlugin): void {
    const components = plugin.getUIComponents();
    const routes = plugin.getUIRoutes();
    const navigation = plugin.getUINavigation();

    // Register UI components
    this.registerComponents(components);

    // Register UI routes
    this.registerRoutes(routes);

    // Register UI navigation
    this.registerNavigation(navigation);
  }

  unregisterUIPlugin(plugin: UIPlugin): void {
    // Unregister UI components
    this.unregisterComponents(plugin.id);

    // Unregister UI routes
    this.unregisterRoutes(plugin.id);

    // Unregister UI navigation
    this.unregisterNavigation(plugin.id);
  }
}
```

## 🧪 Testing Strategy

### Unit Tests

```typescript
// src/server/plugins/__tests__/plugin-manager.service.spec.ts
describe('PluginManagerService', () => {
  let service: PluginManagerService;
  let mockRegistry: jest.Mocked<PluginRegistry>;
  let mockLoader: jest.Mocked<PluginLoader>;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        PluginManagerService,
        { provide: PluginRegistry, useValue: mockRegistry },
        { provide: PluginLoader, useValue: mockLoader },
      ],
    }).compile();

    service = module.get<PluginManagerService>(PluginManagerService);
  });

  it('should install plugin', async () => {
    const pluginPath = '/path/to/plugin';
    const mockPlugin = createMockPlugin();

    mockLoader.load.mockResolvedValue(mockPlugin);
    mockRegistry.register.mockImplementation(() => {});

    const result = await service.installPlugin(pluginPath);

    expect(result).toBe(mockPlugin);
    expect(mockRegistry.register).toHaveBeenCalledWith(mockPlugin);
  });
});
```

### Integration Tests

```typescript
// tests/integration/plugin-system.integration.spec.ts
describe('Plugin System Integration', () => {
  it('should load and activate plugin', async () => {
    // Test plugin loading and activation
  });

  it('should handle plugin dependencies', async () => {
    // Test plugin dependency resolution
  });

  it('should integrate with Event Bus', async () => {
    // Test Event Bus integration
  });
});
```

## 📊 Monitoring & Health

### Health Checks

```typescript
// src/server/plugins/health/plugin-system.health.ts
@Injectable()
export class PluginSystemHealthIndicator extends HealthIndicator {
  constructor(private readonly pluginManager: PluginManagerService) {
    super();
  }

  async check(key: string): Promise<HealthIndicatorResult> {
    try {
      const plugins = this.pluginManager.getAllPlugins();
      const activePlugins = plugins.filter((p) => p.isActive);

      return this.getStatus(key, true, {
        totalPlugins: plugins.length,
        activePlugins: activePlugins.length,
        status: 'healthy',
      });
    } catch (error) {
      return this.getStatus(key, false, { error: error.message });
    }
  }
}
```

## 🚀 Deployment

### Docker Configuration

```dockerfile
# Dockerfile.plugin-system
FROM node:20-alpine

WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production

COPY dist/ ./dist/
COPY plugins/ ./plugins/

EXPOSE 3002
CMD ["node", "dist/server/main.js"]
```

### Environment Configuration

```env
# .env.plugin-system
PLUGIN_SYSTEM_ENABLED=true
PLUGIN_DIRECTORY=/app/plugins
PLUGIN_SANDBOX_ENABLED=true
PLUGIN_PERMISSIONS_STRICT=true
```

## 📈 Performance Considerations

### Optimization Strategies

1. **Lazy Loading**: Load plugins only when needed
2. **Caching**: Cache plugin metadata and components
3. **Isolation**: Isolate plugin execution to prevent performance impact
4. **Monitoring**: Monitor plugin performance and resource usage
5. **Cleanup**: Proper cleanup of plugin resources

### Monitoring Metrics

- Plugin load times
- Plugin memory usage
- Plugin API call metrics
- Plugin error rates
- Plugin dependency resolution time
