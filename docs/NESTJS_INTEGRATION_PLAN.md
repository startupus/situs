# План интеграции NestJS в проект Situs

## Обзор

План по миграции существующего Express API на NestJS архитектуру с интеграцией MCP модуля для стандартизации и улучшения архитектуры проекта.

## Цели миграции

1. **Стандартизация архитектуры** - единый подход к разработке API
2. **Интеграция MCP** - использование MCP для AI инструментов
3. **Улучшение производительности** - оптимизация через NestJS возможности
4. **Упрощение разработки** - использование декораторов и DI
5. **Лучшая типизация** - TypeScript-first подход

## Текущее состояние

### Существующие компоненты

- Express API сервер (`backend/`)
- MCP сервер (`src/mcp/`) - уже на NestJS
- Prisma схема базы данных
- React фронтенд

### Проблемы текущей архитектуры

- Разрозненность API и MCP серверов
- Отсутствие единой архитектуры
- Сложность масштабирования
- Дублирование кода

## План миграции

### Этап 1: Подготовка (1-2 дня)

- [ ] Создание нового NestJS приложения
- [ ] Настройка TypeScript конфигурации
- [ ] Интеграция с существующей Prisma схемой
- [ ] Настройка окружения и конфигурации

### Этап 2: Миграция API (3-5 дней)

- [ ] Создание AuthModule
  - [ ] AuthController (миграция из Express)
  - [ ] AuthService (миграция из Express)
  - [ ] JWT стратегия
  - [ ] Guards для аутентификации
- [ ] Создание ProjectModule
  - [ ] ProjectController (миграция из Express)
  - [ ] ProjectService (миграция из Express)
  - [ ] DTO для валидации
- [ ] Создание UserModule
  - [ ] UserController
  - [ ] UserService
  - [ ] User entity

### Этап 3: Интеграция MCP (1-2 дня)

- [ ] Интеграция SitusMcpModule в основной сервер
- [ ] Настройка роутинга MCP
- [ ] Тестирование интеграции
- [ ] Документация API

### Этап 4: Улучшения (2-3 дня)

- [ ] Настройка middleware
  - [ ] Логирование запросов
  - [ ] Обработка ошибок
  - [ ] CORS настройки
- [ ] Создание интерцепторов
- [ ] Настройка pipes для валидации
- [ ] Swagger документация

### Этап 5: Тестирование и деплой (1-2 дня)

- [ ] Unit тесты для всех модулей
- [ ] Integration тесты
- [ ] E2E тесты
- [ ] Деплой и мониторинг

## Архитектура после миграции

```
src/
├── app.module.ts              # Основной модуль приложения
├── main.ts                    # Точка входа
├── auth/
│   ├── auth.module.ts
│   ├── auth.controller.ts
│   ├── auth.service.ts
│   ├── guards/
│   └── strategies/
├── projects/
│   ├── projects.module.ts
│   ├── projects.controller.ts
│   ├── projects.service.ts
│   └── dto/
├── users/
│   ├── users.module.ts
│   ├── users.controller.ts
│   └── users.service.ts
├── mcp/                       # Интегрированный MCP модуль
│   ├── mcp.module.ts
│   ├── tools/
│   ├── resources/
│   └── prompts/
├── common/
│   ├── guards/
│   ├── interceptors/
│   ├── pipes/
│   └── filters/
└── config/
    ├── database.config.ts
    ├── jwt.config.ts
    └── app.config.ts
```

## Технические детали

### Зависимости для установки

```bash
npm install @nestjs/common @nestjs/core @nestjs/platform-express
npm install @nestjs/config @nestjs/jwt @nestjs/passport
npm install @nestjs/typeorm @nestjs/swagger
npm install class-validator class-transformer
npm install passport passport-jwt
npm install typeorm reflect-metadata
```

### Конфигурация TypeScript

```json
{
  "compilerOptions": {
    "experimentalDecorators": true,
    "emitDecoratorMetadata": true,
    "strict": true
  }
}
```

### Основной модуль приложения

```typescript
@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot({
      type: 'postgres',
      // конфигурация БД
    }),
    AuthModule,
    ProjectsModule,
    UsersModule,
    SitusMcpModule, // Интегрированный MCP модуль
  ],
})
export class AppModule {}
```

## Преимущества после миграции

### Для разработчиков

- Единая архитектура и подход
- Лучшая типизация и автодополнение
- Упрощенное тестирование
- Встроенная валидация

### Для проекта

- Стандартизированный API
- Лучшая производительность
- Простота масштабирования
- Интеграция с AI инструментами

### Для бизнеса

- Быстрая разработка новых функций
- Снижение технического долга
- Улучшенная стабильность
- Готовность к масштабированию

## Риски и митигация

### Риски

1. **Время миграции** - может занять больше времени
2. **Совместимость** - возможны проблемы с существующим кодом
3. **Обучение команды** - необходимо изучение NestJS

### Митигация

1. **Поэтапная миграция** - мигрируем модуль за модулем
2. **Параллельная разработка** - старый API работает во время миграции
3. **Документация и обучение** - создаем гайды и проводим обучение

## Критерии успеха

- [ ] Все существующие API endpoints работают
- [ ] MCP модуль интегрирован и функционирует
- [ ] Производительность не ухудшилась
- [ ] Код покрыт тестами
- [ ] Документация обновлена
- [ ] Команда обучена работе с NestJS

## Следующие шаги

1. **Создание ветки** `development/nestjs-migration`
2. **Настройка базовой структуры** NestJS приложения
3. **Миграция первого модуля** (AuthModule)
4. **Тестирование и итерация**
5. **Постепенная миграция остальных модулей**

---

**Дата создания**: 7 августа 2025
**Автор**: AI Assistant
**Статус**: Планирование
