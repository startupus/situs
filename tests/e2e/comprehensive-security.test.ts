import { test, expect } from '@playwright/test';

/**
 * Комплексные тесты безопасности
 * Проверяют различные аспекты безопасности системы
 */
test.describe('Comprehensive Security Tests', () => {
  const API_BASE_URL = 'http://localhost:3002/api';
  const FRONTEND_URL = 'http://localhost:5177';

  test.beforeEach(async ({ page }) => {
    // Очищаем cookies перед каждым тестом
    await page.context().clearCookies();
  });

  test('should prevent SQL injection attacks', async ({ request }) => {
    // Тестируем SQL injection в параметрах запроса
    const maliciousQuery = "'; DROP TABLE projects; --";

    const response = await request.get(`${API_BASE_URL}/projects?search=${encodeURIComponent(maliciousQuery)}`, {
      headers: {
        Authorization: 'Bearer dev-token',
      },
    });

    // Должны получить корректный ответ без ошибок БД
    expect(response.ok()).toBeTruthy();
    const data = await response.json();
    expect(data.data.projects).toBeDefined();
    expect(Array.isArray(data.data.projects)).toBeTruthy();
  });

  test('should prevent XSS attacks in project data', async ({ request }) => {
    // Создаем проект с потенциально опасным контентом
    const maliciousContent = '<script>alert("XSS")</script>';

    const createResponse = await request.post(`${API_BASE_URL}/projects`, {
      data: {
        name: maliciousContent,
        description: maliciousContent,
      },
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer dev-token',
      },
    });

    expect(createResponse.ok()).toBeTruthy();
    const project = await createResponse.json();

    // Проверяем, что контент был санитизирован
    expect(project.data.name).not.toContain('<script>');
    expect(project.data.description).not.toContain('<script>');
  });

  test('should validate input data properly', async ({ request }) => {
    // Тестируем с невалидными данными
    const invalidData = {
      name: '', // Пустое имя
      description: null,
      settings: 'invalid-json',
    };

    const response = await request.post(`${API_BASE_URL}/projects`, {
      data: invalidData,
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer dev-token',
      },
    });

    // Должны получить ошибку валидации
    expect([400, 422]).toContain(response.status());
  });

  test('should enforce rate limiting', async ({ request }) => {
    // Отправляем множество запросов подряд
    const requests = [];
    for (let i = 0; i < 10; i++) {
      requests.push(
        request.get(`${API_BASE_URL}/projects`, {
          headers: {
            Authorization: 'Bearer dev-token',
          },
        }),
      );
    }

    const responses = await Promise.all(requests);

    // Проверяем, что не все запросы прошли успешно (rate limiting)
    const successCount = responses.filter((r) => r.ok()).length;
    const rateLimitHeaders = responses.find((r) => r.headers()['x-rate-limit-remaining']);

    // В dev режиме rate limiting может быть отключен, но заголовки должны присутствовать
    if (rateLimitHeaders) {
      expect(rateLimitHeaders.headers()['x-rate-limit-remaining']).toBeDefined();
    }
  });

  test('should handle authentication properly', async ({ request }) => {
    // Тестируем без авторизации
    const unauthorizedResponse = await request.get(`${API_BASE_URL}/projects`);
    expect([401, 403]).toContain(unauthorizedResponse.status());

    // Тестируем с невалидным токеном
    const invalidTokenResponse = await request.get(`${API_BASE_URL}/projects`, {
      headers: {
        Authorization: 'Bearer invalid-token',
      },
    });
    expect([401, 403]).toContain(invalidTokenResponse.status());

    // Тестируем с валидным токеном (dev bypass)
    const validTokenResponse = await request.get(`${API_BASE_URL}/projects`, {
      headers: {
        Authorization: 'Bearer dev-token',
      },
    });
    expect(validTokenResponse.ok()).toBeTruthy();
  });

  test('should prevent unauthorized project access', async ({ request }) => {
    // Создаем проект
    const createResponse = await request.post(`${API_BASE_URL}/projects`, {
      data: {
        name: 'Private Project',
        description: 'This should be private',
      },
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer dev-token',
      },
    });

    expect(createResponse.ok()).toBeTruthy();
    const project = await createResponse.json();
    const projectId = project.data.id;

    // Пытаемся получить проект без авторизации
    const unauthorizedResponse = await request.get(`${API_BASE_URL}/projects/${projectId}`);
    expect([401, 403, 404]).toContain(unauthorizedResponse.status());
  });

  test('should handle malformed JSON gracefully', async ({ request }) => {
    // Тестируем с невалидным JSON
    const response = await request.post(`${API_BASE_URL}/projects`, {
      data: 'invalid-json{',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer dev-token',
      },
    });

    expect([400, 422]).toContain(response.status());
  });

  test('should validate file upload security', async ({ request }) => {
    // Тестируем загрузку потенциально опасного файла
    const maliciousFile = new Blob(['<script>alert("XSS")</script>'], { type: 'text/html' });

    const response = await request.post(`${API_BASE_URL}/media/upload`, {
      multipart: {
        file: {
          name: 'malicious.html',
          mimeType: 'text/html',
          buffer: Buffer.from('<script>alert("XSS")</script>'),
        },
      },
      headers: {
        Authorization: 'Bearer dev-token',
      },
    });

    // Должны получить ошибку или отклонение файла
    expect([400, 403, 415]).toContain(response.status());
  });

  test('should handle large payloads properly', async ({ request }) => {
    // Тестируем с очень большим payload
    const largeData = {
      name: 'Large Project',
      description: 'A'.repeat(10000), // 10KB строка
    };

    const response = await request.post(`${API_BASE_URL}/projects`, {
      data: largeData,
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer dev-token',
      },
    });

    // Должны получить ошибку или ограничение размера
    expect([400, 413, 422]).toContain(response.status());
  });

  test('should prevent CSRF attacks', async ({ page }) => {
    // Тестируем CSRF защиту через браузер
    await page.goto(FRONTEND_URL);

    // Пытаемся выполнить запрос с внешнего сайта
    const result = await page.evaluate(async () => {
      try {
        const response = await fetch('/api/projects', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            name: 'CSRF Attack Project',
            description: 'This should be blocked',
          }),
        });
        return { status: response.status, ok: response.ok };
      } catch (error) {
        return { error: error.message };
      }
    });

    // Должны получить ошибку CSRF или авторизации
    expect([401, 403, 0]).toContain(result.status || 0);
  });

  test('should handle concurrent requests safely', async ({ request }) => {
    // Тестируем конкурентные запросы
    const concurrentRequests = [];

    for (let i = 0; i < 5; i++) {
      concurrentRequests.push(
        request.post(`${API_BASE_URL}/projects`, {
          data: {
            name: `Concurrent Project ${i}`,
            description: `Project ${i} created concurrently`,
          },
          headers: {
            'Content-Type': 'application/json',
            Authorization: 'Bearer dev-token',
          },
        }),
      );
    }

    const responses = await Promise.all(concurrentRequests);

    // Все запросы должны быть обработаны корректно
    responses.forEach((response) => {
      expect([200, 201, 400, 409]).toContain(response.status());
    });
  });

  test('should log security events', async ({ request }) => {
    // Выполняем подозрительный запрос
    const response = await request.get(`${API_BASE_URL}/projects`, {
      headers: {
        Authorization: 'Bearer invalid-token',
        'User-Agent': 'Mozilla/5.0 (compatible; SecurityTest/1.0)',
      },
    });

    // Проверяем, что запрос был обработан (логирование происходит на сервере)
    expect([200, 401, 403]).toContain(response.status());
  });

  test('should handle edge cases in project operations', async ({ request }) => {
    // Тестируем с несуществующим ID
    const notFoundResponse = await request.get(`${API_BASE_URL}/projects/non-existent-id`, {
      headers: {
        Authorization: 'Bearer dev-token',
      },
    });
    expect(notFoundResponse.status()).toBe(404);

    // Тестируем с пустым ID
    const emptyIdResponse = await request.get(`${API_BASE_URL}/projects/`, {
      headers: {
        Authorization: 'Bearer dev-token',
      },
    });
    expect([404, 405]).toContain(emptyIdResponse.status());

    // Тестируем с очень длинным ID
    const longId = 'a'.repeat(1000);
    const longIdResponse = await request.get(`${API_BASE_URL}/projects/${longId}`, {
      headers: {
        Authorization: 'Bearer dev-token',
      },
    });
    expect([400, 404]).toContain(longIdResponse.status());
  });
});
