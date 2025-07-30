# Шаблон автотеста для сервисов Hubus

## Общие стандарты

- Используйте **optional chaining** при обращении к элементам массива: `array[0]?.property`
- Все переменные должны быть **типизированы**
- Следуйте паттерну **arrange-act-assert**
- Обрабатывайте **edge-cases** и негативные сценарии
- Импортируйте типы из централизованного места (`src/types/`или`../types/`)
- Не используйте `any`/`unknown` без проверки
- Для e2e и unit тестов используйте актуальные моки и переменные окружения

- --

## Чеклист для нового теста

1. [ ] Используется шаблон автотеста (см. ниже)?
2. [ ] Все типы импортируются из централизованного места?
3. [ ] Для массивов используется optional chaining?
4. [ ] Моки и переменные окружения соответствуют документации?
5. [ ] Описаны edge-cases и негативные сценарии?
6. [ ] Тесты проходят на CI/CD?

- --

## Пример unit-теста (service)

````ts
import { describe, it, expect } from '@jest/globals';
import { MyService } from '../services/MyService';
import { CreateMyDTO } from '../DTOs/myDTOs';
import { UserPayload } from '../types/UserPayload';

const mockUser: UserPayload = {
  userId: 'test-user',
  email: 'test@example.com',
  roles: ['user'],
  scopes: ['read', 'write'],
};

describe('MyService', () => {
  it('должен возвращать массив элементов', async () => {
    const result = await MyService.getAll({}, mockUser);
    expect(Array.isArray(result)).toBe(true);
    expect(result[0]?.id).toBeDefined(); // optional chaining!
  });

  it('должен выбрасывать ошибку при невалидных данных', async () => {
    await expect(MyService.create(null as any, mockUser)).rejects.toThrow();
  });
});

```text
- --

## Пример e2e-теста (controller)

```ts
import request from 'supertest';
import app from '../index';
import { UserPayload } from '../types/UserPayload';

describe('MyController E2E', () => {
  it('должен создавать и получать элемент', async () => {
    const token = 'Bearer ';
    const createDto = { name: 'Test', description: 'Test desc' };
    const res = await request(app)
      .post('/api/my')
      .set('Authorization', token)
      .send(createDto)
      .expect(201);
    expect(res.body.id).toBeDefined();
    const getRes = await request(app)
      .get(`/api/my/${res.body.id}`)
      .set('Authorization', token)
      .expect(200);
    expect(getRes.body.name).toBe(createDto.name);
  });
});

```text
- --

## Edge cases и негативные сценарии

```ts
it('должен обрабатывать пустые массивы', async () => {
  const result = await MyService.getAll({}, mockUser);
  expect(Array.isArray(result)).toBe(true);
  if (result.length > 0) {
    expect(result[0]?.id).toBeDefined();
  }
});

it('должен обрабатывать null/undefined значения', async () => {
  await expect(MyService.create(null as any, mockUser)).rejects.toThrow();
});

```text
- --

## Best practice

- Используйте **describe/it** для структурирования тестов
- Для моков используйте актуальные типы и структуру
- Всегда покрывайте edge-cases
- Документируйте нестандартные решения прямо в тесте (через комментарии)
- При изменении типов — обновляйте шаблон и все тесты, которые его используют

- --

> Актуальный шаблон всегда доступен в `/templates/test.template.md`. Все новые тесты должны соответствовать этому
стандарту.

## Шаблон автотеста Hubus

## 🎯 Стандарт тестирования

### e2e/интеграционные тесты - ТОЛЬКО Vitest

- *Jest больше не используется для e2e/интеграционных тестов!**

- ✅ **Vitest** - единственный инструмент для e2e/интеграционных тестов
- ✅ **In-memory SQLite** - изоляция тестов, быстрая работа
- ✅ **Отдельная фабрика приложения** - без сложных middleware
- ✅ **Setup файлы** - конфигурация тестового окружения
- ✅ **Моки внешних сервисов** - стабильность тестов

## 📁 Структура файлов

```
src/__tests__/
├── *.vitest.test.ts     # e2e/интеграционные тесты (Vitest)

├── *.unit.test.ts       # unit тесты (рекомендуется Vitest)

└── setup.ts             # конфигурация тестового окружения

```

## 🔧 Конфигурация

### package.json

```json
{
  "scripts": {
    "test:vitest": "vitest run",
    "lint": "eslint ./src --ext .ts"
  },
  "devDependencies": {
    "@vitest/ui": "^3.2.4",
    "vitest": "^3.2.4"
  }
}
```

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

## 📝 Шаблоны тестов

### e2e/интеграционный тест (Vitest)

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

  it('Валидирует входные данные', async () => {
    const res = await request(app)
      .post('/api/endpoint')
      .send({ invalid: 'data' });

    expect(res.status).toBe(400);
    expect(res.body.error).toContain('validation');
  });
});
```

### Unit тест (Vitest)

```typescript
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { ServiceClass } from '../services/ServiceClass';

describe('ServiceClass', () => {
  let service: ServiceClass;

  beforeEach(() => {
    service = new ServiceClass();
  });

  it('должен обрабатывать валидные данные', () => {
    const result = service.process({ valid: 'data' });
    expect(result).toBeDefined();
    expect(result.success).toBe(true);
  });

  it('должен выбрасывать ошибку для невалидных данных', () => {
    expect(() => {
      service.process({ invalid: 'data' });
    }).toThrow('Invalid data');
  });

  it('должен мокировать внешние зависимости', async () => {
    const mockExternalService = vi.fn().mockResolvedValue({ data: 'mocked' });
    service.setExternalService(mockExternalService);

    const result = await service.callExternal();

    expect(mockExternalService).toHaveBeenCalled();
    expect(result.data).toBe('mocked');
  });
});
```

## 🏗️ Фабрика приложения для тестов

### appFactory.ts

```typescript
import express from 'express';
import { createDefaultApp } from './appFactory';

export function createTestApp(options: {
  isTest?: boolean;
  disableRBAC?: boolean;
  useTestRoutes?: boolean;
} = {}) {
  const app = createDefaultApp({
    isTest: true,
    disableRBAC: options.disableRBAC ?? true,
    useTestRoutes: options.useTestRoutes ?? true
  });

  return app;
}
```

## 🔧 Лучшие практики

### 1. Изоляция тестов

```typescript
// ✅ ПРАВИЛЬНО - in-memory база данных
process.env.DATABASE_URL = 'file:memory:?cache=shared';

// ❌ НЕПРАВИЛЬНО - реальная база данных
process.env.DATABASE_URL = 'postgresql://user:pass@localhost:5432/db';
```

### 2. Моки внешних сервисов

```typescript
// ✅ ПРАВИЛЬНО - мок внешнего API
const mockApiResponse = { data: 'mocked' };
vi.mock('../services/externalApi', () => ({
  default: vi.fn().mockResolvedValue(mockApiResponse)
}));

// ❌ НЕПРАВИЛЬНО - реальные HTTP запросы
const response = await fetch('<https://api.external.com');>
```

### 3. Очистка состояния

```typescript
import { afterEach } from 'vitest';

afterEach(() => {
  // Очистка моков
  vi.clearAllMocks();

  // Очистка базы данных
  // await clearTestDatabase();
});
```

### 4. Валидация входных данных

```typescript
it('должен валидировать обязательные поля', async () => {
  const res = await request(app)
    .post('/api/users')
    .send({}); // Пустой объект

  expect(res.status).toBe(400);
  expect(res.body.errors).toContain('name is required');
});
```

## 🚫 Что НЕ делать

### ❌ Не используйте Jest для e2e

```bash

## НЕПРАВИЛЬНО

npm run test  # Jest для e2e

## ПРАВИЛЬНО

npm run test:vitest  # Vitest для e2e

```

### ❌ Не используйте реальные зависимости

```typescript
// НЕПРАВИЛЬНО
import { realDatabase } from '../database';

// ПРАВИЛЬНО
import { mockDatabase } from '../__mocks__/database';
```

### ❌ Не делайте тесты зависимыми друг от друга

```typescript
// НЕПРАВИЛЬНО
let sharedState = {};

it('тест 1', () => {
  sharedState.data = 'value';
});

it('тест 2', () => {
  expect(sharedState.data).toBe('value'); // Зависимость!
});

// ПРАВИЛЬНО
it('тест 1', () => {
  const state = { data: 'value' };
  expect(state.data).toBe('value');
});

it('тест 2', () => {
  const state = { data: 'other' };
  expect(state.data).toBe('other');
});
```

## 📊 Покрытие кода

### Запуск с покрытием

```bash
npm run test:vitest -- --coverage
```

### Минимальные требования

- **e2e тесты**: покрытие основных сценариев
- **unit тесты**: покрытие > 80% кода
- **интеграционные тесты**: покрытие критических путей

## 🔍 Отладка

### Логирование

```typescript
it('debug test', async () => {
  console.log('Debug info:', { data: 'test' });
  const res = await request(app).get('/api/endpoint');
  console.log('Response:', res.body);
  expect(res.status).toBe(200);
});
```

### Запуск одного теста

```bash
npm run test:vitest -- --run src/__tests__/specific.test.ts
```

### Подробные логи

```bash
npm run test:vitest -- --reporter=verbose
```

## 📚 Дополнительные ресурсы

- [Vitest Documentation](<https://vitest.dev/)>
- [Supertest Documentation](<https://github.com/visionmedia/supertest)>
- [Testing Best Practices](./TESTING.md)
- [Architecture Decisions](./CONCEPTUAL_TASKS.md)
````
