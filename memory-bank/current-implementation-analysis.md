# Анализ текущей реализации Event System

## 📋 Обзор существующей системы событий

### 🏗️ Архитектура

Проект Situs уже имеет **частично реализованную систему событий** на основе:

1. **RealtimeEventsService** - центральная шина событий
2. **SSE (Server-Sent Events)** - транспортный слой
3. **RxJS Observables** - реактивная обработка событий
4. **Модульная интеграция** - события интегрированы в бизнес-модули

### 🔧 Текущие компоненты

#### 1. Backend: RealtimeEventsService

**Файл**: `src/server/realtime/realtime-events.service.ts`

```typescript
@Injectable()
export class RealtimeEventsService {
  private readonly subject = new Subject<RealtimeEvent>();
  private readonly clients = new Set<(data: RealtimeEvent) => void>();

  // Основные методы:
  publish<T = any>(type: ProjectEventType, payload?: T): void;
  asObservable(): Observable<RealtimeEvent>;
  registerClient(send: (data: RealtimeEvent) => void): () => void;
}
```

**Поддерживаемые типы событий**:

- `sse_connected` - техническое событие подключения
- `project_*` - события проектов (created, updated, deleted, status, reordered)
- `menu_*` - события системы меню (type/item created/updated/deleted)
- `user_*` - события пользователей (created, updated, deleted, status_changed)
- `integration_*` - события интеграций (created, updated, deleted, status_changed)

#### 2. Backend: RealtimeController

**Файл**: `src/server/realtime/realtime.controller.ts`

```typescript
@Controller('realtime')
export class RealtimeController {
  @Sse('projects') events(): any
  @Sse('users') usersEvents(): any
  @Sse('integrations') integrationsEvents(): any
  @Get('stats') stats()
  @Get('test') test()
}
```

**SSE Endpoints**:

- `GET /api/realtime/projects` - события проектов
- `GET /api/realtime/users` - события пользователей
- `GET /api/realtime/integrations` - события интеграций

#### 3. Frontend: ProjectsApiService

**Файл**: `src/api/services/projects.api.ts`

```typescript
class ProjectsApiService {
  subscribeEvents(onEvent: (e: any) => void): () => void {
    // Универсальная подписка с fallback на fetch-stream
    // Поддержка EventSource + ReadableStream
  }
}
```

#### 4. Frontend: React Hooks

- `useMenuSystemRealtime.ts` - SSE подписка для меню
- `useSSEPermissions.ts` - SSE подписка для разрешений
- `useUsersSSE.ts` - SSE подписка для пользователей

### 🔄 Интеграция с модулями

#### Модули, использующие события:

1. **ProjectsModule** (`src/server/projects/`)

   ```typescript
   // Публикация событий
   this.realtime.publish('project_created', { id, name, status });
   this.realtime.publishProjectStatus(id, status);
   this.realtime.publish('project_reordered', { id, orderIndex });
   ```

2. **MenusModule** (`src/server/menus/`)

   ```typescript
   // События меню
   this.realtimeEvents.publishMenuTypeCreated(projectId, menuType);
   this.realtimeEvents.publishMenuItemUpdated(projectId, menuItem);
   ```

3. **IntegrationsModule** (`src/server/integrations/`)

   ```typescript
   // События интеграций
   this.realtime.publish('integration_created', { id, projectId });
   this.realtime.publish('integration_status_changed', { id, status });
   ```

4. **UsersModule** (`src/server/users/`)
   ```typescript
   // События пользователей
   this.realtime.publish('user_updated', { userId, user, changes });
   ```

### 📊 Текущие возможности

#### ✅ Что уже работает:

1. **Централизованная публикация событий**
   - Единая точка входа через `RealtimeEventsService`
   - Типизированные события через `ProjectEventType`

2. **SSE транспорт**
   - Множественные SSE endpoints для разных доменов
   - Handshake механизм для подтверждения подключения
   - Heartbeat для поддержания соединения

3. **Frontend интеграция**
   - Универсальная подписка с fallback механизмами
   - React hooks для различных доменов
   - Автоматическая синхронизация между вкладками

4. **Модульная архитектура**
   - События интегрированы в бизнес-модули
   - Опциональная инъекция `RealtimeEventsService`
   - Graceful degradation при отсутствии сервиса

#### ⚠️ Ограничения текущей реализации:

1. **Отсутствие типизации payload**
   - `payload?: T` - generic без строгой типизации
   - Нет валидации структуры событий

2. **Нет асинхронной обработки**
   - События публикуются синхронно
   - Отсутствует очередь событий

3. **Ограниченная фильтрация**
   - Нет механизма фильтрации по типу события
   - Отсутствует маршрутизация событий

4. **Нет персистентности**
   - События не сохраняются в БД
   - Нет механизма replay событий

5. **Отсутствие middleware**
   - Нет возможности добавить логирование, метрики
   - Нет механизма трансформации событий

### 🎯 Что нужно улучшить для полноценного Event Bus

#### 1. Строгая типизация

```typescript
// Текущее состояние
interface RealtimeEvent<T = any> {
  type: ProjectEventType;
  payload?: T;
}

// Нужно
interface TypedEvent<T extends EventType> {
  id: string;
  type: T;
  payload: EventPayloadMap[T];
  timestamp: Date;
  metadata?: EventMetadata;
}
```

#### 2. Асинхронная обработка

```typescript
// Нужно добавить
interface EventHandler<T extends EventType> {
  (event: TypedEvent<T>): Promise<void>;
}

class EventBus {
  async publish<T extends EventType>(event: TypedEvent<T>): Promise<void>;
  subscribe<T extends EventType>(type: T, handler: EventHandler<T>): () => void;
}
```

#### 3. Middleware система

```typescript
interface EventMiddleware {
  beforePublish?(event: TypedEvent): Promise<TypedEvent>;
  afterPublish?(event: TypedEvent): Promise<void>;
  onError?(error: Error, event: TypedEvent): Promise<void>;
}
```

#### 4. Персистентность

```typescript
interface EventStore {
  save(event: TypedEvent): Promise<void>;
  replay(fromTimestamp: Date): AsyncIterable<TypedEvent>;
  getEvents(filter: EventFilter): Promise<TypedEvent[]>;
}
```

### 🔄 Стратегия миграции

#### Фаза 1: Расширение существующего

- Добавить типизацию к `RealtimeEventsService`
- Внедрить middleware систему
- Добавить асинхронную обработку

#### Фаза 2: Новая архитектура

- Создать новый `EventBusService` как обертку
- Постепенная миграция модулей
- Сохранение обратной совместимости

#### Фаза 3: Полная замена

- Замена `RealtimeEventsService` на `EventBusService`
- Удаление устаревшего кода
- Финальная оптимизация

### 📋 Выводы

**Текущее состояние**: Проект имеет **рабочую систему событий** с SSE транспортом, но она ограничена в возможностях.

**Что есть**: Централизованная публикация, SSE транспорт, модульная интеграция, frontend hooks.

**Что нужно**: Строгая типизация, асинхронная обработка, middleware, персистентность, расширенная фильтрация.

**Рекомендация**: Поэтапная эволюция существующей системы с сохранением обратной совместимости.
