# Руководство по тестированию Hubus

## 🎯 Стандарт тестирования

### e2e/интеграционные тесты - ТОЛЬКО Vitest

- \*Jest больше не используется для e2e/интеграционных тестов!\*\*

- ✅ **Vitest** - единственный инструмент для e2e/интеграционных тестов
- ✅ **In-memory SQLite** - изоляция тестов, быстрая работа
- ✅ **Отдельная фабрика приложения** - без сложных middleware
- ✅ **Setup файлы** - конфигурация тестового окружения
- ✅ **Моки внешних сервисов** - стабильность тестов

### Структура тестов

```
src/__tests__/
├── *.vitest.test.ts     # e2e/интеграционные тесты (Vitest)

├── *.unit.test.ts       # unit тесты (рекомендуется Vitest)

└── setup.ts             # конфигурация тестового окружения

```

## 🚀 Запуск тестов

### Все e2e/интеграционные тесты

```bash
npm run test:all
```

### Отдельные сервисы

```bash

## Provider Service

npm run test:vitest:provider

## Client Service

npm run test:vitest:client

## Proxy Service

npm run test:vitest:proxy
```

### Локальный запуск в сервисе

```bash
cd services/hubus-service
npm run test:vitest
```

## 📋 Конфигурация Vitest

### vitest.config.ts

```typescript
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    setupFiles: ['./src/__tests__/setup.ts'],
    include: ['src/__tests__/**/*.vitest.test.ts'],
    exclude: ['node_modules', 'dist', 'coverage'],
    testTimeout: 30000,
    hookTimeout: 30000,
  },
  resolve: {
    alias: {
      '@': '/src',
    },
  },
});
```

### setup.ts

```typescript
import { beforeAll, afterAll } from 'vitest';

beforeAll(() => {
  process.env.NODE_ENV = 'test';
  process.env.DATABASE_URL = 'file:memory:?cache=shared';
  process.env.JWT_SECRET = 'test-secret';
});

afterAll(() => {
  // Очистка ресурсов
});
```

## 🏗️ Фабрика приложения для тестов

### createTestApp.ts

```typescript
import express from 'express';
import { createDefaultApp } from '../appFactory';

export function createTestApp(options: { isTest?: boolean } = {}) {
  const app = createDefaultApp({
    isTest: true,
    disableRBAC: true,
    useTestRoutes: true,
  });

  return app;
}
```

## 📝 Шаблон e2e теста

```typescript
import { describe, it, beforeAll, expect } from 'vitest';
import request from 'supertest';
import { createTestApp } from '../appFactory';

let app: any;

beforeAll(() => {
  process.env.NODE_ENV = 'test';
  process.env.DATABASE_URL = 'file:memory:?cache=shared';
  app = createTestApp({ isTest: true });
});

describe('Service e2e (Vitest)', () => {
  it('Health check работает', async () => {
    const res = await request(app).get('/health');
    expect(res.status).toBe(200);
    expect(res.body.status).toBe('ok');
  });

  it('API возвращает 401 без токена', async () => {
    const res = await request(app).get('/api/protected');
    expect(res.status).toBe(401);
    expect(res.body.error).toBe('No token provided');
  });
});
```

## 🔧 Лучшие практики

### 1. Изоляция тестов

- Используйте in-memory SQLite
- Мокируйте внешние сервисы
- Очищайте состояние между тестами

### 2. Именование файлов

- `*.vitest.test.ts`- e2e/интеграционные тесты
- `*.unit.test.ts`- unit тесты
- `setup.ts` - конфигурация

### 3. Структура тестов

- Группируйте связанные тесты в describe блоки
- Используйте понятные названия тестов
- Проверяйте как успешные, так и ошибочные сценарии

### 4. Моки и стабы

- Мокируйте внешние API
- Используйте стабы для сложных зависимостей
- Избегайте реальных сетевых запросов

## 🚫 Что НЕ делать

### ❌ Не используйте Jest для e2e

```bash

## НЕПРАВИЛЬНО

npm run test  # Jest для e2e

## ПРАВИЛЬНО

npm run test:vitest  # Vitest для e2e

```

### ❌ Не используйте реальную базу данных

```typescript
// НЕПРАВИЛЬНО
process.env.DATABASE_URL = 'postgresql://...';

// ПРАВИЛЬНО
process.env.DATABASE_URL = 'file:memory:?cache=shared';
```

### ❌ Не делайте реальные HTTP запросы

```typescript
// НЕПРАВИЛЬНО
const response = await fetch('<https://api.external.com');>

// ПРАВИЛЬНО
const mockResponse = { data: 'mocked' };
```

## 📊 Покрытие кода

### Запуск с покрытием

```bash

## В отдельном сервисе

cd services/hubus-service
npm run test:vitest -- --coverage

## Все сервисы (если настроено)

npm run test:coverage
```

### Минимальные требования

- **e2e тесты**: покрытие основных сценариев
- **unit тесты**: покрытие > 80% кода
- **Интеграционные тесты**: покрытие критических путей

## 🔍 Отладка тестов

### Логирование

```typescript
import { describe, it, beforeAll, expect } from 'vitest';

describe('Debug test', () => {
  it('should work', async () => {
    console.log('Debug info:', { data: 'test' });
    expect(true).toBe(true);
  });
});
```

### Запуск в режиме отладки

```bash

## Запуск с подробными логами

npm run test:vitest -- --reporter=verbose

## Запуск одного теста

npm run test:vitest -- --run src/__tests__/specific.test.ts
```

## 📚 Дополнительные ресурсы

- [Vitest Documentation](<https://vitest.dev/)>
- [Supertest Documentation](<https://github.com/visionmedia/supertest)>
- [Testing Best Practices](./templates/test.template.md)
- [Architecture Decisions](./CONCEPTUAL_TASKS.md)
