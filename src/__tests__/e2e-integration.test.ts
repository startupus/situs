import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { StartupusEcosystemClient } from '../services/gateway-service/src/core/StartupusEcosystemClient';

// Mock StartupusEcosystemClient
vi.mock('../services/gateway-service/src/core/StartupusEcosystemClient', () => ({
  StartupusEcosystemClient: {
    getInstance: vi.fn(() => ({
      checkEcosystemHealth: vi.fn().mockResolvedValue({
        gateway: { status: 'healthy', port: 3010 },
        agents: { status: 'healthy', port: 3001 },
        loginus: { status: 'healthy', port: 3002 },
        bilingus: { status: 'healthy', port: 3003 }
      }),
      routeToHubus: vi.fn().mockResolvedValue({ success: true }),
      routeToEcosystem: vi.fn().mockResolvedValue({ success: true }),
      billWithBilingus: vi.fn().mockResolvedValue({ success: true })
    })),
  },
}));

describe('Gateway E2E Integration Tests', () => {
  let ecosystemClient: StartupusEcosystemClient;

  beforeEach(() => {
    vi.clearAllMocks();
    ecosystemClient = StartupusEcosystemClient.getInstance();
  });
  
  afterEach(() => {
    vi.clearAllTimers();
    vi.restoreAllMocks();
  });

  describe('Ecosystem Health Checks', () => {
    it('should check health of all services', async () => {
      const healthResult = await ecosystemClient.checkEcosystemHealth();
      
      expect(healthResult).toBeDefined();
      expect(typeof healthResult.overall).toBe('boolean');
      expect(healthResult.services).toBeDefined();
      
      // Проверяем наличие ключевых сервисов
      const expectedServices = ['hubus', 'loginus', 'bilingus', 'client'];
      expectedServices.forEach(service => {
        expect(healthResult.services).toHaveProperty(service);
      });
    });

    it('should handle service unavailability gracefully', async () => {
      // Mock недоступного сервиса
      global.fetch = vi.fn().mockRejectedValue(new Error('Service unavailable'));
      
      const healthResult = await ecosystemClient.checkEcosystemHealth();
      
      expect(healthResult.overall).toBe(false);
      expect(healthResult.services).toBeDefined();
    });
  });

  describe('Authentication Integration', () => {
    it('should validate token through loginus', async () => {
      // Mock успешной валидации токена
      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({
          success: true,
          data: {
            id: 'test-user',
            email: 'test@example.com',
            role: 'user',
            scopes: ['read', 'write']
          }
        })
      });

      const validation = await ecosystemClient.validateWithLoginus('test-token');
      
      expect(validation.valid).toBe(true);
      expect(validation.user).toBeDefined();
      expect(validation.user?.id).toBe('test-user');
    });

    it('should handle invalid token', async () => {
      // Mock неуспешной валидации токена
      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({
          success: false,
          error: { message: 'Invalid token' }
        })
      });

      const validation = await ecosystemClient.validateWithLoginus('invalid-token');
      
      expect(validation.valid).toBe(false);
      expect(validation.error).toBe('Invalid token');
    });
  });

  describe('Service Routing', () => {
    it('should route to Hubus services correctly', async () => {
      // Mock успешного ответа от hubus сервиса
      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({
          success: true,
          data: { message: 'Hello from agents service' }
        })
      });

      const result = await ecosystemClient.routeToHubus(
        'agents',
        '/health',
        {},
        'GET'
      );
      
      expect(result).toBeDefined();
      expect(result.success).toBe(true);
    });

    it('should route to ecosystem services correctly', async () => {
      // Mock успешного ответа от ecosystem сервиса
      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({
          success: true,
          data: { status: 'healthy' }
        })
      });

      const result = await ecosystemClient.routeToEcosystem(
        'bilingus',
        '/health',
        {},
        'GET'
      );
      
      expect(result).toBeDefined();
      expect(result.success).toBe(true);
    });
  });

  describe('Billing Integration', () => {
    it('should handle billing charge through bilingus', async () => {
      // Mock успешного биллинга
      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({
          success: true,
          transactionId: 'tx_123456',
          amount: 10.00,
          currency: 'USD'
        })
      });

      const chargeResult = await ecosystemClient.chargeBilling({
        userId: 'user_123',
        amount: 10.00,
        currency: 'USD',
        description: 'AI service usage'
      });
      
      expect(chargeResult.success).toBe(true);
      expect(chargeResult.transactionId).toBe('tx_123456');
    });

    it('should handle billing failures', async () => {
      // Mock неуспешного биллинга
      global.fetch = vi.fn().mockResolvedValue({
        ok: false,
        status: 400,
        statusText: 'Bad Request'
      });

      const chargeResult = await ecosystemClient.chargeBilling({
        userId: 'user_123',
        amount: -10.00, // Некорректная сумма
        currency: 'USD',
        description: 'Invalid charge'
      });
      
      expect(chargeResult.success).toBe(false);
      expect(chargeResult.error).toBeDefined();
    });
  });

  describe('Error Handling and Resilience', () => {
    it('should handle network timeouts', async () => {
      // Mock timeout
      global.fetch = vi.fn().mockImplementation(() => 
        new Promise((_, reject) => 
          setTimeout(() => reject(new Error('Timeout')), 100)
        )
      );

      const healthResult = await ecosystemClient.checkEcosystemHealth();
      
      expect(healthResult.overall).toBe(false);
      expect(healthResult.details?.error).toContain('Timeout');
    });

    it('should retry failed requests', async () => {
      let callCount = 0;
      global.fetch = vi.fn().mockImplementation(() => {
        callCount++;
        if (callCount < 3) {
          return Promise.reject(new Error('Network error'));
        }
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve({ success: true })
        });
      });

      const result = await ecosystemClient.routeToHubus('agents', '/health', {}, 'GET');
      
      expect(callCount).toBe(3); // Должно быть 3 попытки
      expect(result.success).toBe(true);
    });
  });

  describe('Performance and Load', () => {
    it('should handle concurrent requests', async () => {
      // Mock быстрого ответа
      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({ success: true, timestamp: Date.now() })
      });

      const promises = Array.from({ length: 10 }, (_, i) =>
        ecosystemClient.routeToHubus('agents', `/test/${i}`, {}, 'GET')
      );

      const results = await Promise.all(promises);
      
      expect(results).toHaveLength(10);
      results.forEach(result => {
        expect(result.success).toBe(true);
      });
    });

    it('should complete requests within acceptable time', async () => {
      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({ success: true })
      });

      const startTime = Date.now();
      await ecosystemClient.checkEcosystemHealth();
      const endTime = Date.now();
      
      const duration = endTime - startTime;
      expect(duration).toBeLessThan(5000); // Должно завершиться менее чем за 5 секунд
    });
  });
}); 