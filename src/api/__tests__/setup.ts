// Настройка переменных окружения для тестов
process.env.NODE_ENV = 'test';
process.env.JWT_SECRET = 'test-jwt-secret-key';
process.env.JWT_REFRESH_SECRET = 'test-jwt-refresh-secret-key';
process.env.PORT = '3001';

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