/**
 * 🔒 SECURITY TESTS - Environment Configuration
 *
 * Comprehensive security testing for environment validation infrastructure
 * Based on project standards from TESTING.md and git history etalons
 *
 * Test Categories:
 * - Unit tests for environment validation schemas
 * - Integration tests for cross-service security
 * - E2E tests for production security scenarios
 */

import { describe, test, expect, beforeEach, afterEach } from 'vitest';
import { config as hubusConfig } from '../../services/hubus-service/src/config/environment.js';
import { config as gatewayConfig } from '../../services/gateway-service/src/config/environment.js';
import { config as bilingusConfig } from '../../services/bilingus-service/src/config/environment.js';

describe('Security: Environment Configuration', () => {
  const originalEnv = process.env;

  beforeEach(() => {
    process.env = { ...originalEnv };
  });

  afterEach(() => {
    process.env = originalEnv;
  });

  describe('Hubus Service Security', () => {
    test('должен требовать JWT_SECRET минимальной длины 32 символа', () => {
      process.env.DATABASE_URL = 'postgresql://user:pass@localhost:5432/hubus';
      process.env.JWT_SECRET = 'short'; // Слишком короткий

      expect(() => {
        new (require('../../services/hubus-service/src/config/environment.js').default.constructor)();
      }).toThrow();
    });

    test('должен валидировать DATABASE_URL формат', () => {
      process.env.DATABASE_URL = 'invalid-url';
      process.env.JWT_SECRET = 'super-secret-jwt-key-min-32-characters-long';

      expect(() => {
        new (require('../../services/hubus-service/src/config/environment.js').default.constructor)();
      }).toThrow();
    });

    test('должен правильно конфигурировать rate limiting', () => {
      process.env.DATABASE_URL = 'postgresql://user:pass@localhost:5432/hubus';
      process.env.JWT_SECRET = 'super-secret-jwt-key-min-32-characters-long';
      process.env.RATE_LIMIT_WINDOW = '600000';
      process.env.RATE_LIMIT_MAX = '500';

      const config = new (require('../../services/hubus-service/src/config/environment.js').default.constructor)();
      const rateLimitConfig = config.getRateLimitConfig();

      expect(rateLimitConfig.windowMs).toBe(600000);
      expect(rateLimitConfig.max).toBe(500);
    });
  });

  describe('Gateway Service Security', () => {
    test('должен требовать JWT_SECRET минимальной длины 32 символа', () => {
      process.env.HUBUS_PROXY_URL = 'http://localhost:3005';
      process.env.HUBUS_AGENTS_URL = 'http://localhost:3006';
      process.env.HUBUS_PROVIDER_URL = 'http://localhost:3007';
      process.env.HUBUS_CLIENT_URL = 'http://localhost:3008';
      process.env.LOGINUS_URL = 'http://localhost:3001';
      process.env.BILINGUS_URL = 'http://localhost:3003';
      process.env.SITUS_URL = 'http://localhost:5173';
      process.env.DASHBOARD_URL = 'http://localhost:3002';
      process.env.CHAT_URL = 'http://localhost:3004';
      process.env.JWT_SECRET = 'short'; // Слишком короткий

      expect(() => {
        new (require('../../services/gateway-service/src/config/environment.js').default.constructor)();
      }).toThrow();
    });

    test('должен валидировать все обязательные URL сервисов', () => {
      process.env.JWT_SECRET = 'super-secret-jwt-key-min-32-characters-long';
      // Убираем один из обязательных URL
      delete process.env.HUBUS_PROXY_URL;

      expect(() => {
        new (require('../../services/gateway-service/src/config/environment.js').default.constructor)();
      }).toThrow();
    });

    test('должен правильно конфигурировать session security', () => {
      process.env.HUBUS_PROXY_URL = 'http://localhost:3005';
      process.env.HUBUS_AGENTS_URL = 'http://localhost:3006';
      process.env.HUBUS_PROVIDER_URL = 'http://localhost:3007';
      process.env.HUBUS_CLIENT_URL = 'http://localhost:3008';
      process.env.LOGINUS_URL = 'http://localhost:3001';
      process.env.BILINGUS_URL = 'http://localhost:3003';
      process.env.SITUS_URL = 'http://localhost:5173';
      process.env.DASHBOARD_URL = 'http://localhost:3002';
      process.env.CHAT_URL = 'http://localhost:3004';
      process.env.JWT_SECRET = 'super-secret-jwt-key-min-32-characters-long';
      process.env.SESSION_SECRET = 'super-secret-session-key-min-32-characters';

      const config = new (require('../../services/gateway-service/src/config/environment.js').default.constructor)();

      expect(config.getSessionSecret()).toBe('super-secret-session-key-min-32-characters');
      expect(config.isCookieSecure()).toBe(false); // По умолчанию false для development
    });
  });

  describe('Bilingus Service Security', () => {
    test('должен требовать JWT_SECRET минимальной длины 32 символа', () => {
      process.env.DATABASE_URL = 'postgresql://user:pass@localhost:5432/bilingus';
      process.env.JWT_SECRET = 'short'; // Слишком короткий

      expect(() => {
        new (require('../../services/bilingus-service/src/config/environment.js').default.constructor)();
      }).toThrow();
    });

    test('должен валидировать DATABASE_URL формат', () => {
      process.env.DATABASE_URL = 'invalid-url';
      process.env.JWT_SECRET = 'super-secret-jwt-key-min-32-characters-long';

      expect(() => {
        new (require('../../services/bilingus-service/src/config/environment.js').default.constructor)();
      }).toThrow();
    });

    test('должен правильно конфигурировать PCI DSS соответствие', () => {
      process.env.DATABASE_URL = 'postgresql://user:pass@localhost:5432/bilingus';
      process.env.JWT_SECRET = 'super-secret-jwt-key-min-32-characters-long';
      process.env.PCI_COMPLIANCE_ENABLED = 'true';
      process.env.ENCRYPTION_KEY = 'super-secret-encryption-key-min-32-chars';

      const config = new (require('../../services/bilingus-service/src/config/environment.js').default.constructor)();

      expect(config.isPciComplianceEnabled()).toBe(true);
      expect(config.getEncryptionKey()).toBe('super-secret-encryption-key-min-32-chars');
    });

    test('должен правильно конфигурировать лимиты транзакций', () => {
      process.env.DATABASE_URL = 'postgresql://user:pass@localhost:5432/bilingus';
      process.env.JWT_SECRET = 'super-secret-jwt-key-min-32-characters-long';
      process.env.MAX_TRANSACTION_AMOUNT = '5000';
      process.env.MIN_TRANSACTION_AMOUNT = '0.10';

      const config = new (require('../../services/bilingus-service/src/config/environment.js').default.constructor)();
      const limits = config.getTransactionLimits();

      expect(limits.max).toBe(5000);
      expect(limits.min).toBe(0.1);
    });

    test('должен правильно конфигурировать мультивалютность', () => {
      process.env.DATABASE_URL = 'postgresql://user:pass@localhost:5432/bilingus';
      process.env.JWT_SECRET = 'super-secret-jwt-key-min-32-characters-long';
      process.env.SUPPORTED_CURRENCIES = 'USD,EUR,RUB,CNY';
      process.env.DEFAULT_CURRENCY = 'EUR';

      const config = new (require('../../services/bilingus-service/src/config/environment.js').default.constructor)();

      expect(config.getSupportedCurrencies()).toEqual(['USD', 'EUR', 'RUB', 'CNY']);
      expect(config.getDefaultCurrency()).toBe('EUR');
    });
  });

  describe('Cross-Service Security', () => {
    test('все сервисы должны использовать одинаковые стандарты безопасности', () => {
      // Устанавливаем базовые переменные для всех сервисов
      process.env.NODE_ENV = 'production';
      process.env.DATABASE_URL = 'postgresql://user:pass@localhost:5432/test';
      process.env.JWT_SECRET = 'super-secret-jwt-key-min-32-characters-long';
      process.env.HUBUS_PROXY_URL = 'http://localhost:3005';
      process.env.HUBUS_AGENTS_URL = 'http://localhost:3006';
      process.env.HUBUS_PROVIDER_URL = 'http://localhost:3007';
      process.env.HUBUS_CLIENT_URL = 'http://localhost:3008';
      process.env.LOGINUS_URL = 'http://localhost:3001';
      process.env.BILINGUS_URL = 'http://localhost:3003';
      process.env.SITUS_URL = 'http://localhost:5173';
      process.env.DASHBOARD_URL = 'http://localhost:3002';
      process.env.CHAT_URL = 'http://localhost:3004';

      // Проверяем, что все сервисы загружаются без ошибок
      expect(() => {
        new (require('../../services/hubus-service/src/config/environment.js').default.constructor)();
      }).not.toThrow();

      expect(() => {
        new (require('../../services/gateway-service/src/config/environment.js').default.constructor)();
      }).not.toThrow();

      expect(() => {
        new (require('../../services/bilingus-service/src/config/environment.js').default.constructor)();
      }).not.toThrow();
    });

    test('все сервисы должны правильно обрабатывать production окружение', () => {
      process.env.NODE_ENV = 'production';
      process.env.DATABASE_URL = 'postgresql://user:pass@localhost:5432/test';
      process.env.JWT_SECRET = 'super-secret-jwt-key-min-32-characters-long';
      process.env.HUBUS_PROXY_URL = 'http://localhost:3005';
      process.env.HUBUS_AGENTS_URL = 'http://localhost:3006';
      process.env.HUBUS_PROVIDER_URL = 'http://localhost:3007';
      process.env.HUBUS_CLIENT_URL = 'http://localhost:3008';
      process.env.LOGINUS_URL = 'http://localhost:3001';
      process.env.BILINGUS_URL = 'http://localhost:3003';
      process.env.SITUS_URL = 'http://localhost:5173';
      process.env.DASHBOARD_URL = 'http://localhost:3002';
      process.env.CHAT_URL = 'http://localhost:3004';

      const hubusConfig = new (require('../../services/hubus-service/src/config/environment.js').default.constructor)();
      const gatewayConfig =
        new (require('../../services/gateway-service/src/config/environment.js').default.constructor)();
      const bilingusConfig =
        new (require('../../services/bilingus-service/src/config/environment.js').default.constructor)();

      expect(hubusConfig.isProduction()).toBe(true);
      expect(gatewayConfig.isProduction()).toBe(true);
      expect(bilingusConfig.isProduction()).toBe(true);
    });
  });
});
