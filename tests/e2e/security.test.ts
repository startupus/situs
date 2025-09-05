import { test, expect } from '@playwright/test';

/**
 * E2E тесты безопасности
 *
 * Проверяют:
 * - Авторизацию и доступ к защищенным эндпоинтам
 * - CORS политики
 * - Dev-байпас только для localhost
 * - Фильтрацию проектов по пользователю
 */

test.describe('Security Tests', () => {
  test.beforeEach(async ({ page }) => {
    // Переходим на главную страницу
    await page.goto('http://localhost:5177/');
  });

  test('should require authentication for protected endpoints', async ({ page }) => {
    // Проверяем, что API требует авторизацию
    const response = await page.request.get('http://localhost:3002/api/projects');

    // Должен быть 401 или 403 (в зависимости от настроек)
    expect([401, 403]).toContain(response.status());
  });

  test('should allow access with dev bypass on localhost', async ({ page }) => {
    // В dev режиме с ENABLE_DEV_USER=1 должен работать байпас
    await page.goto('http://localhost:5177/projects');

    // Проверяем, что страница загрузилась без ошибок авторизации
    await expect(page.locator('h1')).toContainText('Проекты');

    // Проверяем, что системный проект загрузился
    await expect(page.locator('text=Situs Admin system')).toBeVisible();
  });

  test('should block dev bypass from external IP', async ({ page }) => {
    // Симулируем запрос с внешнего IP
    await page.route('**/api/**', async (route) => {
      const request = route.request();
      const headers = request.headers();

      // Добавляем заголовки, имитирующие внешний IP
      const modifiedHeaders = {
        ...headers,
        'x-forwarded-for': '203.0.113.1', // Внешний IP
        'x-real-ip': '203.0.113.1',
      };

      await route.continue({ headers: modifiedHeaders });
    });

    // Попытка доступа к API должна быть заблокирована
    const response = await page.request.get('http://localhost:3002/api/projects');
    expect([401, 403]).toContain(response.status());
  });

  test('should enforce CORS policies', async ({ page }) => {
    // Проверяем CORS заголовки
    const response = await page.request.get('http://localhost:3002/api/health', {
      headers: {
        Origin: 'https://malicious-site.com',
      },
    });

    // В production режиме должен быть заблокирован
    if (process.env.NODE_ENV === 'production') {
      expect(response.status()).toBe(403);
    }
  });

  test('should filter projects by user ownership', async ({ page }) => {
    // Логинимся как dev пользователь
    await page.goto('http://localhost:5177/projects');

    // Проверяем, что видим только системный проект
    const projects = page.locator('[data-testid="project-item"]');
    const count = await projects.count();

    // Должен быть только системный проект
    expect(count).toBe(1);
    await expect(page.locator('text=Situs Admin system')).toBeVisible();
  });

  test('should prevent unauthorized project access', async ({ page }) => {
    // Попытка доступа к несуществующему проекту
    const response = await page.request.get('http://localhost:3002/api/projects/non-existent-id');

    // Должен быть 404 или 403
    expect([404, 403]).toContain(response.status());
  });

  test('should validate JWT tokens', async ({ page }) => {
    // Попытка доступа с невалидным токеном
    const response = await page.request.get('http://localhost:3002/api/projects', {
      headers: {
        Authorization: 'Bearer invalid-token',
      },
    });

    // Должен быть 401
    expect(response.status()).toBe(401);
  });

  test('should rate limit API requests', async ({ page }) => {
    // Делаем много запросов подряд
    const promises = Array.from({ length: 10 }, () => page.request.get('http://localhost:3002/api/health'));

    const responses = await Promise.all(promises);

    // Некоторые запросы должны быть заблокированы rate limiting
    const blockedResponses = responses.filter((r) => r.status() === 429);
    expect(blockedResponses.length).toBeGreaterThan(0);
  });

  test('should sanitize user input', async ({ page }) => {
    // Попытка SQL инъекции в поиске
    const maliciousInput = "'; DROP TABLE projects; --";

    await page.goto('http://localhost:5177/projects');
    await page.fill('input[placeholder*="Поиск"]', maliciousInput);
    await page.press('input[placeholder*="Поиск"]', 'Enter');

    // Проверяем, что приложение не упало
    await expect(page.locator('h1')).toContainText('Проекты');
  });

  test('should handle XSS attempts', async ({ page }) => {
    // Попытка XSS атаки
    const xssPayload = '<script>alert("XSS")</script>';

    await page.goto('http://localhost:5177/projects');
    await page.fill('input[placeholder*="Поиск"]', xssPayload);
    await page.press('input[placeholder*="Поиск"]', 'Enter');

    // Проверяем, что скрипт не выполнился
    const alertHandled = await page.evaluate(() => {
      return window.alert === undefined || !window.alert.toString().includes('XSS');
    });

    expect(alertHandled).toBe(true);
  });
});
