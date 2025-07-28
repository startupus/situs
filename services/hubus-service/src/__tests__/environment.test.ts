import { describe, test, expect, beforeEach, afterEach, vi } from 'vitest';
import { config } from '../config/environment.js';

describe('Hubus Service Environment Configuration', () => {
  const originalEnv = process.env;

  beforeEach(() => {
    // Сохраняем оригинальные переменные окружения
    process.env = { ...originalEnv };
  });

  afterEach(() => {
    // Восстанавливаем оригинальные переменные окружения
    process.env = originalEnv;
  });

  test('должен загружать конфигурацию с валидными переменными окружения', () => {
    // Устанавливаем валидные переменные окружения
    process.env.NODE_ENV = 'development';
    process.env.PORT = '3005';
    process.env.DATABASE_URL = 'postgresql://user:pass@localhost:5432/hubus';
    process.env.JWT_SECRET = 'super-secret-jwt-key-min-32-characters-long';

    // Создаем новый экземпляр конфигурации
    const testConfig = new (require('../config/environment.js').default.constructor)();

    expect(testConfig.getNodeEnv()).toBe('development');
    expect(testConfig.getPort()).toBe(3005);
    expect(testConfig.getDatabaseUrl()).toBe('postgresql://user:pass@localhost:5432/hubus');
    expect(testConfig.getJwtSecret()).toBe('super-secret-jwt-key-min-32-characters-long');
  });

  test('должен использовать значения по умолчанию для отсутствующих переменных', () => {
    // Устанавливаем только обязательные переменные
    process.env.DATABASE_URL = 'postgresql://user:pass@localhost:5432/hubus';
    process.env.JWT_SECRET = 'super-secret-jwt-key-min-32-characters-long';

    const testConfig = new (require('../config/environment.js').default.constructor)();

    expect(testConfig.getNodeEnv()).toBe('development');
    expect(testConfig.getPort()).toBe(3005);
    expect(testConfig.getLogLevel()).toBe('info');
    expect(testConfig.getCorsOrigin()).toBe('*');
  });

  test('должен выбрасывать ошибку при отсутствии обязательных переменных', () => {
    // Убираем обязательные переменные
    delete process.env.DATABASE_URL;
    delete process.env.JWT_SECRET;

    // Мокаем console.error и process.exit
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    const exitSpy = vi.spyOn(process, 'exit').mockImplementation(() => {
      throw new Error('process.exit called');
    });

    expect(() => {
      new (require('../config/environment.js').default.constructor)();
    }).toThrow('process.exit called');

    expect(consoleSpy).toHaveBeenCalled();
    expect(exitSpy).toHaveBeenCalledWith(1);

    // Восстанавливаем моки
    consoleSpy.mockRestore();
    exitSpy.mockRestore();
  });

  test('должен валидировать JWT_SECRET минимальную длину', () => {
    process.env.DATABASE_URL = 'postgresql://user:pass@localhost:5432/hubus';
    process.env.JWT_SECRET = 'short'; // Слишком короткий

    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    const exitSpy = vi.spyOn(process, 'exit').mockImplementation(() => {
      throw new Error('process.exit called');
    });

    expect(() => {
      new (require('../config/environment.js').default.constructor)();
    }).toThrow('process.exit called');

    expect(consoleSpy).toHaveBeenCalledWith(
      expect.stringContaining('JWT_SECRET должен быть не менее 32 символов')
    );

    consoleSpy.mockRestore();
    exitSpy.mockRestore();
  });

  test('должен валидировать DATABASE_URL формат', () => {
    process.env.DATABASE_URL = 'invalid-url';
    process.env.JWT_SECRET = 'super-secret-jwt-key-min-32-characters-long';

    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    const exitSpy = vi.spyOn(process, 'exit').mockImplementation(() => {
      throw new Error('process.exit called');
    });

    expect(() => {
      new (require('../config/environment.js').default.constructor)();
    }).toThrow('process.exit called');

    expect(consoleSpy).toHaveBeenCalledWith(
      expect.stringContaining('DATABASE_URL')
    );

    consoleSpy.mockRestore();
    exitSpy.mockRestore();
  });

  test('должен правильно определять окружение', () => {
    process.env.DATABASE_URL = 'postgresql://user:pass@localhost:5432/hubus';
    process.env.JWT_SECRET = 'super-secret-jwt-key-min-32-characters-long';

    // Тест development
    process.env.NODE_ENV = 'development';
    let testConfig = new (require('../config/environment.js').default.constructor)();
    expect(testConfig.isDevelopment()).toBe(true);
    expect(testConfig.isProduction()).toBe(false);
    expect(testConfig.isTest()).toBe(false);

    // Тест production
    process.env.NODE_ENV = 'production';
    testConfig = new (require('../config/environment.js').default.constructor)();
    expect(testConfig.isDevelopment()).toBe(false);
    expect(testConfig.isProduction()).toBe(true);
    expect(testConfig.isTest()).toBe(false);

    // Тест test
    process.env.NODE_ENV = 'test';
    testConfig = new (require('../config/environment.js').default.constructor)();
    expect(testConfig.isDevelopment()).toBe(false);
    expect(testConfig.isProduction()).toBe(false);
    expect(testConfig.isTest()).toBe(true);
  });

  test('должен возвращать правильную конфигурацию rate limiting', () => {
    process.env.DATABASE_URL = 'postgresql://user:pass@localhost:5432/hubus';
    process.env.JWT_SECRET = 'super-secret-jwt-key-min-32-characters-long';
    process.env.RATE_LIMIT_WINDOW = '600000';
    process.env.RATE_LIMIT_MAX = '500';

    const testConfig = new (require('../config/environment.js').default.constructor)();
    const rateLimitConfig = testConfig.getRateLimitConfig();

    expect(rateLimitConfig.windowMs).toBe(600000);
    expect(rateLimitConfig.max).toBe(500);
  });

  test('должен возвращать правильную конфигурацию circuit breaker', () => {
    process.env.DATABASE_URL = 'postgresql://user:pass@localhost:5432/hubus';
    process.env.JWT_SECRET = 'super-secret-jwt-key-min-32-characters-long';
    process.env.CIRCUIT_BREAKER_ENABLED = 'true';
    process.env.CIRCUIT_BREAKER_THRESHOLD = '10';

    const testConfig = new (require('../config/environment.js').default.constructor)();
    
    expect(testConfig.isCircuitBreakerEnabled()).toBe(true);
    expect(testConfig.getCircuitBreakerConfig().threshold).toBe(10);
  });
}); 