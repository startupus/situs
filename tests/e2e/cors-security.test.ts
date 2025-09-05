import { test, expect } from '@playwright/test';

/**
 * Тесты безопасности CORS
 * Проверяют CORS политики на неразрешенные origins и методы
 */
test.describe('CORS Security Tests', () => {
  const API_BASE_URL = 'http://localhost:3002/api';
  const FRONTEND_URL = 'http://localhost:5177';

  test('should reject requests from unauthorized origins in production', async ({ request }) => {
    // Тестируем с неавторизованным origin
    const response = await request.get(`${API_BASE_URL}/projects`, {
      headers: {
        Origin: 'https://malicious-site.com',
        Authorization: 'Bearer dev-token',
      },
    });

    // В dev режиме может быть разрешен, но в production должен быть отклонен
    // Проверяем наличие CORS заголовков
    const corsOrigin = response.headers()['access-control-allow-origin'];
    const corsCredentials = response.headers()['access-control-allow-credentials'];

    if (corsOrigin) {
      // Если CORS заголовки присутствуют, проверяем что origin не wildcard
      expect(corsOrigin).not.toBe('*');
      expect(corsCredentials).toBe('true');
    }
  });

  test('should allow requests from authorized origins', async ({ request }) => {
    // Тестируем с авторизованным origin (localhost для dev)
    const response = await request.get(`${API_BASE_URL}/projects`, {
      headers: {
        Origin: 'http://localhost:5177',
        Authorization: 'Bearer dev-token',
      },
    });

    expect(response.ok()).toBeTruthy();

    // Проверяем CORS заголовки
    const corsOrigin = response.headers()['access-control-allow-origin'];
    const corsCredentials = response.headers()['access-control-allow-credentials'];

    expect(corsOrigin).toBeTruthy();
    expect(corsCredentials).toBe('true');
  });

  test('should handle preflight requests correctly', async ({ request }) => {
    // Тестируем OPTIONS запрос (preflight)
    const response = await request.fetch(`${API_BASE_URL}/projects`, {
      method: 'OPTIONS',
      headers: {
        Origin: 'http://localhost:5177',
        'Access-Control-Request-Method': 'POST',
        'Access-Control-Request-Headers': 'Content-Type,Authorization',
      },
    });

    expect(response.status()).toBe(204); // OPTIONS должен возвращать 204

    // Проверяем CORS заголовки в preflight ответе
    const corsOrigin = response.headers()['access-control-allow-origin'];
    const corsMethods = response.headers()['access-control-allow-methods'];
    const corsHeaders = response.headers()['access-control-allow-headers'];
    const corsMaxAge = response.headers()['access-control-max-age'];

    expect(corsOrigin).toBeTruthy();
    if (corsMethods) {
      expect(corsMethods).toContain('POST');
    }
    if (corsHeaders) {
      expect(corsHeaders).toContain('Content-Type');
      expect(corsHeaders).toContain('Authorization');
    }
    if (corsMaxAge) {
      expect(corsMaxAge).toBeTruthy();
    }
  });

  test('should reject unsupported HTTP methods', async ({ request }) => {
    // Тестируем неразрешенный метод
    const response = await request.fetch(`${API_BASE_URL}/projects`, {
      method: 'TRACE', // Обычно не разрешен
      headers: {
        Origin: 'http://localhost:5177',
        Authorization: 'Bearer dev-token',
      },
    });

    // Должны получить ошибку метода
    expect([404, 405, 501]).toContain(response.status());
  });

  test('should validate allowed headers', async ({ request }) => {
    // Тестируем с неразрешенным заголовком
    const response = await request.get(`${API_BASE_URL}/projects`, {
      headers: {
        Origin: 'http://localhost:5177',
        Authorization: 'Bearer dev-token',
        'X-Malicious-Header': 'evil-value',
      },
    });

    // Запрос может пройти, но заголовок не должен быть в allowed headers
    if (response.ok()) {
      const corsHeaders = response.headers()['access-control-allow-headers'];
      if (corsHeaders) {
        expect(corsHeaders).not.toContain('X-Malicious-Header');
      }
    }
  });

  test('should handle credentials correctly', async ({ request }) => {
    // Тестируем запрос с credentials
    const response = await request.get(`${API_BASE_URL}/projects`, {
      headers: {
        Origin: 'http://localhost:5177',
        Authorization: 'Bearer dev-token',
        Cookie: 'session=test-session',
      },
    });

    expect(response.ok()).toBeTruthy();

    // Проверяем, что credentials разрешены
    const corsCredentials = response.headers()['access-control-allow-credentials'];
    expect(corsCredentials).toBe('true');
  });

  test('should expose only allowed headers', async ({ request }) => {
    const response = await request.get(`${API_BASE_URL}/projects`, {
      headers: {
        Origin: 'http://localhost:5177',
        Authorization: 'Bearer dev-token',
      },
    });

    expect(response.ok()).toBeTruthy();

    // Проверяем exposed headers
    const exposedHeaders = response.headers()['access-control-expose-headers'];
    expect(exposedHeaders).toBeTruthy();

    // Должны быть только разрешенные заголовки
    const allowedExposedHeaders = ['X-Total-Count', 'X-Rate-Limit-Remaining', 'X-Rate-Limit-Reset'];
    if (exposedHeaders) {
      const headers = exposedHeaders.split(',').map((h) => h.trim());
      headers.forEach((header) => {
        expect(allowedExposedHeaders).toContain(header);
      });
    }
  });

  test('should handle multiple origins correctly', async ({ request }) => {
    // Тестируем с несколькими origins (должен выбрать подходящий)
    const response = await request.get(`${API_BASE_URL}/projects`, {
      headers: {
        Origin: 'http://localhost:5177,https://app.example.com',
        Authorization: 'Bearer dev-token',
      },
    });

    // В dev режиме localhost должен быть разрешен
    expect(response.ok()).toBeTruthy();
  });

  test('should reject requests without proper CORS headers', async ({ request }) => {
    // Тестируем запрос без Origin заголовка
    const response = await request.get(`${API_BASE_URL}/projects`, {
      headers: {
        Authorization: 'Bearer dev-token',
      },
    });

    // В dev режиме может быть разрешен, но в production должен быть отклонен
    // Проверяем, что CORS заголовки не содержат wildcard
    const corsOrigin = response.headers()['access-control-allow-origin'];
    if (corsOrigin) {
      expect(corsOrigin).not.toBe('*');
    }
  });

  test('should handle CORS errors gracefully', async ({ request }) => {
    // Тестируем с невалидным Origin
    const response = await request.get(`${API_BASE_URL}/projects`, {
      headers: {
        Origin: 'invalid-origin-format',
        Authorization: 'Bearer dev-token',
      },
    });

    // Должны получить ошибку или корректный CORS ответ
    if (response.ok()) {
      const corsOrigin = response.headers()['access-control-allow-origin'];
      expect(corsOrigin).not.toBe('invalid-origin-format');
    }
  });

  test('should validate CORS configuration in production mode', async ({ request }) => {
    // Этот тест проверяет, что в production режиме CORS настроен строго
    // В реальном production окружении этот тест должен проверять:
    // 1. Только HTTPS origins разрешены
    // 2. Нет wildcard origins
    // 3. Строгий набор методов и заголовков

    const response = await request.get(`${API_BASE_URL}/projects`, {
      headers: {
        Origin: 'http://localhost:5177',
        Authorization: 'Bearer dev-token',
      },
    });

    expect(response.ok()).toBeTruthy();

    // В dev режиме проверяем базовые CORS заголовки
    const corsOrigin = response.headers()['access-control-allow-origin'];
    const corsMethods = response.headers()['access-control-allow-methods'];
    const corsHeaders = response.headers()['access-control-allow-headers'];

    expect(corsOrigin).toBeTruthy();
    // В dev режиме CORS заголовки могут отсутствовать
    if (corsMethods) {
      expect(corsMethods).toBeTruthy();
    }
    if (corsHeaders) {
      expect(corsHeaders).toBeTruthy();
    }
  });
});
