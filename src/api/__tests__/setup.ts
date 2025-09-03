import { vi } from 'vitest';

// Настройка переменных окружения для тестов
process.env.NODE_ENV = 'test';
process.env.JWT_SECRET = 'test-jwt-secret-key';
process.env.JWT_REFRESH_SECRET = 'test-jwt-refresh-secret-key';
process.env.PORT = '3001';

// Мокаем Prisma Client
vi.mock('@prisma/client', () => ({
  PrismaClient: vi.fn().mockImplementation(() => ({
    user: {
      findUnique: vi.fn(),
      findMany: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
      deleteMany: vi.fn(),
      count: vi.fn(),
    },
    project: {
      findUnique: vi.fn(),
      findMany: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
      deleteMany: vi.fn(),
      count: vi.fn(),
    },
    page: {
      findUnique: vi.fn(),
      findMany: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
      deleteMany: vi.fn(),
      count: vi.fn(),
    },
    media: {
      findUnique: vi.fn(),
      findMany: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
      deleteMany: vi.fn(),
      count: vi.fn(),
    },
    $connect: vi.fn(),
    $disconnect: vi.fn(),
  })),
}));

// Мокаем JWT
vi.mock('jsonwebtoken', () => ({
  default: {
    sign: vi.fn(() => 'mock-jwt-token'),
    verify: vi.fn(() => ({ userId: '1', email: 'test@example.com' })),
  },
}));

// Мокаем bcrypt
vi.mock('bcryptjs', () => ({
  hash: vi.fn(() => Promise.resolve('hashed-password')),
  compare: vi.fn(() => Promise.resolve(true)),
}));

// Мокаем supertest
vi.mock('supertest', () => ({
  default: vi.fn(() => ({
    post: vi.fn().mockReturnThis(),
    get: vi.fn().mockReturnThis(),
    put: vi.fn().mockReturnThis(),
    delete: vi.fn().mockReturnThis(),
    send: vi.fn().mockReturnThis(),
    set: vi.fn().mockReturnThis(),
    expect: vi.fn().mockReturnThis(),
  })),
}));

// Глобальные моки для тестов
global.console = {
  ...console,
  // Отключаем логи в тестах для чистоты вывода
  log: vi.fn(),
  debug: vi.fn(),
  info: vi.fn(),
  warn: vi.fn(),
  error: vi.fn(),
};

// Настройка таймаутов для тестов
vi.setConfig({ testTimeout: 10000 });

// Очистка моков после каждого теста
afterEach(() => {
  vi.clearAllMocks();
});

// Очистка всех моков после всех тестов
afterAll(() => {
  vi.restoreAllMocks();
});
