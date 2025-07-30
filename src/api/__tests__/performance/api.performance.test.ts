import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import request from 'supertest';
import app from '../../server';

/**
 * API Performance Tests
 * Тестирование производительности и нагрузки
 */

describe('API Performance Tests', () => {
  const PERFORMANCE_THRESHOLD = {
    FAST: 100,    // < 100ms - быстрый ответ
    NORMAL: 500,  // < 500ms - нормальный ответ
    SLOW: 2000,   // < 2s - медленный, но приемлемый
  };

  describe('Response Time Tests', () => {
    it('health check should respond quickly', async () => {
      const startTime = Date.now();
      
      await request(app)
        .get('/api/health')
        .expect(200);
      
      const responseTime = Date.now() - startTime;
      expect(responseTime).toBeLessThan(PERFORMANCE_THRESHOLD.FAST);
    });

    it('API info endpoint should respond quickly', async () => {
      const startTime = Date.now();
      
      await request(app)
        .get('/api')
        .expect(200);
      
      const responseTime = Date.now() - startTime;
      expect(responseTime).toBeLessThan(PERFORMANCE_THRESHOLD.FAST);
    });

    it('authentication endpoints should respond within normal time', async () => {
      const startTime = Date.now();
      
      await request(app)
        .post('/api/auth/login')
        .send({
          email: 'test@example.com',
          password: 'password123'
        });
      
      const responseTime = Date.now() - startTime;
      expect(responseTime).toBeLessThan(PERFORMANCE_THRESHOLD.NORMAL);
    });
  });

  describe('Concurrent Requests Tests', () => {
    it('should handle multiple concurrent health checks', async () => {
      const concurrentRequests = 20;
      const startTime = Date.now();
      
      const promises = Array(concurrentRequests).fill(null).map(() =>
        request(app).get('/api/health').expect(200)
      );
      
      const responses = await Promise.all(promises);
      const totalTime = Date.now() - startTime;
      
      // Все запросы должны быть успешными
      expect(responses).toHaveLength(concurrentRequests);
      responses.forEach(response => {
        expect(response.status).toBe(200);
      });
      
      // Общее время не должно превышать порог
      expect(totalTime).toBeLessThan(PERFORMANCE_THRESHOLD.SLOW);
    });

    it('should handle burst of API info requests', async () => {
      const burstSize = 15;
      const startTime = Date.now();
      
      const promises = Array(burstSize).fill(null).map(() =>
        request(app).get('/api')
      );
      
      const responses = await Promise.all(promises);
      const totalTime = Date.now() - startTime;
      const avgResponseTime = totalTime / burstSize;
      
      // Проверяем успешность запросов
      responses.forEach(response => {
        expect([200, 429]).toContain(response.status); // 429 допустим из-за rate limiting
      });
      
      // Среднее время ответа должно быть приемлемым
      expect(avgResponseTime).toBeLessThan(PERFORMANCE_THRESHOLD.NORMAL);
    });
  });

  describe('Memory and Resource Usage', () => {
    it('should not cause memory leaks during stress test', async () => {
      const initialMemory = process.memoryUsage();
      
      // Выполняем множество запросов для проверки утечек памяти
      for (let i = 0; i < 50; i++) {
        await request(app).get('/api/health');
      }
      
      // Принудительно вызываем сборщик мусора, если доступен
      if (global.gc) {
        global.gc();
      }
      
      const finalMemory = process.memoryUsage();
      const memoryIncrease = finalMemory.heapUsed - initialMemory.heapUsed;
      
      // Увеличение памяти не должно быть критическим (< 10MB)
      expect(memoryIncrease).toBeLessThan(10 * 1024 * 1024);
    });

    it('should handle large request payloads efficiently', async () => {
      const largePayload = {
        email: 'test@example.com',
        password: 'password123',
        largeData: 'x'.repeat(1000) // 1KB строка
      };
      
      const startTime = Date.now();
      
      await request(app)
        .post('/api/auth/login')
        .send(largePayload);
      
      const responseTime = Date.now() - startTime;
      expect(responseTime).toBeLessThan(PERFORMANCE_THRESHOLD.NORMAL);
    });
  });

  describe('Rate Limiting Performance', () => {
    it('rate limiter should not significantly impact response time', async () => {
      const normalStartTime = Date.now();
      await request(app).get('/api/health');
      const normalTime = Date.now() - normalStartTime;
      
      // Делаем запросы близко к лимиту
      const promises = Array(5).fill(null).map(() =>
        request(app).get('/api/health')
      );
      
      const limitStartTime = Date.now();
      await Promise.all(promises);
      const limitTime = Date.now() - limitStartTime;
      const avgLimitTime = limitTime / 5;
      
      // Rate limiter не должен сильно замедлять ответы
      expect(avgLimitTime).toBeLessThan(normalTime * 3);
    });
  });

  describe('Error Handling Performance', () => {
    it('404 errors should be handled quickly', async () => {
      const startTime = Date.now();
      
      await request(app)
        .get('/api/non-existent-endpoint')
        .expect(404);
      
      const responseTime = Date.now() - startTime;
      expect(responseTime).toBeLessThan(PERFORMANCE_THRESHOLD.FAST);
    });

    it('validation errors should be processed efficiently', async () => {
      const startTime = Date.now();
      
      await request(app)
        .post('/api/auth/login')
        .send({
          email: 'invalid-email',
          password: '123'
        })
        .expect(400);
      
      const responseTime = Date.now() - startTime;
      expect(responseTime).toBeLessThan(PERFORMANCE_THRESHOLD.NORMAL);
    });
  });

  describe('Static Content Performance', () => {
    it('should serve API documentation info quickly', async () => {
      const startTime = Date.now();
      
      const response = await request(app)
        .get('/api')
        .expect(200);
      
      const responseTime = Date.now() - startTime;
      
      expect(responseTime).toBeLessThan(PERFORMANCE_THRESHOLD.FAST);
      expect(response.body).toHaveProperty('endpoints');
    });
  });

  describe('Database Query Performance', () => {
    it('should handle authentication queries efficiently', async () => {
      const startTime = Date.now();
      
      // Тестируем запрос аутентификации (который обращается к БД)
      await request(app)
        .post('/api/auth/login')
        .send({
          email: 'nonexistent@example.com',
          password: 'password123'
        });
      
      const responseTime = Date.now() - startTime;
      expect(responseTime).toBeLessThan(PERFORMANCE_THRESHOLD.NORMAL);
    });
  });

  describe('Stress Testing', () => {
    it('should maintain performance under moderate load', async () => {
      const loadTestRequests = 30;
      const maxAllowedTime = PERFORMANCE_THRESHOLD.SLOW;
      
      const startTime = Date.now();
      
      const promises = Array(loadTestRequests).fill(null).map(async (_, index) => {
        // Небольшая задержка между запросами для имитации реальной нагрузки
        await new Promise(resolve => setTimeout(resolve, index * 10));
        return request(app).get('/api/health');
      });
      
      const responses = await Promise.all(promises);
      const totalTime = Date.now() - startTime;
      
      // Все запросы должны завершиться успешно
      const successfulResponses = responses.filter(r => r.status === 200);
      expect(successfulResponses.length).toBeGreaterThan(loadTestRequests * 0.8); // 80% успешности
      
      // Общее время не должно превышать порог
      expect(totalTime).toBeLessThan(maxAllowedTime);
    });
  });

  describe('Resource Cleanup', () => {
    it('should clean up resources after requests', async () => {
      const initialHandles = process._getActiveHandles?.()?.length || 0;
      
      // Выполняем несколько запросов
      await Promise.all([
        request(app).get('/api/health'),
        request(app).get('/api'),
        request(app).post('/api/auth/login').send({ email: 'test', password: 'test' })
      ]);
      
      // Даем время для cleanup
      await new Promise(resolve => setTimeout(resolve, 100));
      
      const finalHandles = process._getActiveHandles?.()?.length || 0;
      
      // Количество активных хендлов не должно расти значительно
      expect(finalHandles - initialHandles).toBeLessThan(10);
    });
  });

  describe('Performance Metrics Collection', () => {
    it('should collect response time metrics', async () => {
      const metrics: number[] = [];
      const testRuns = 10;
      
      for (let i = 0; i < testRuns; i++) {
        const startTime = Date.now();
        await request(app).get('/api/health');
        metrics.push(Date.now() - startTime);
      }
      
      // Вычисляем статистики
      const avgTime = metrics.reduce((a, b) => a + b, 0) / metrics.length;
      const maxTime = Math.max(...metrics);
      const minTime = Math.min(...metrics);
      
      console.log(`Performance metrics:
        Average: ${avgTime.toFixed(2)}ms
        Min: ${minTime}ms
        Max: ${maxTime}ms
        95th percentile: ${metrics.sort()[Math.floor(testRuns * 0.95)]}ms`);
      
      expect(avgTime).toBeLessThan(PERFORMANCE_THRESHOLD.FAST);
      expect(maxTime).toBeLessThan(PERFORMANCE_THRESHOLD.NORMAL);
    });
  });
});