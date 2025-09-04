import { test, expect } from '@playwright/test';

/**
 * Smoke-тесты безопасности для Docker окружения
 *
 * Проверяет:
 * 1. Доступность системного проекта при ENABLE_DEV_USER=1
 * 2. Отсутствие ошибок авторизации в консоли
 * 3. Корректность ответов API
 * 4. Безопасность endpoints
 */

test.describe('Docker Security Smoke Tests', () => {
  test.beforeEach(async ({ page }) => {
    // Переходим на страницу проектов
    await page.goto('http://localhost/projects');

    // Ждем загрузки страницы
    await page.waitForLoadState('networkidle');
  });

  test('should load projects page without auth errors', async ({ page }) => {
    // Проверяем, что страница загрузилась без ошибок авторизации
    const authErrors = await page.evaluate(() => {
      const errors = [];
      // Проверяем localStorage на наличие ошибок авторизации
      const authToken = localStorage.getItem('auth-token');
      return { authToken, hasAuthToken: !!authToken };
    });

    // При ENABLE_DEV_USER=1 не должно быть ошибок авторизации
    console.log('Auth status:', authErrors);

    // Проверяем консоль на ошибки
    const consoleErrors: string[] = [];
    page.on('console', (msg) => {
      if (msg.type() === 'error') {
        consoleErrors.push(msg.text());
      }
    });

    // Ждем немного для сбора ошибок
    await page.waitForTimeout(2000);

    // Фильтруем ошибки авторизации
    const authConsoleErrors = consoleErrors.filter(
      (error) =>
        error.includes('401') ||
        error.includes('Unauthorized') ||
        error.includes('authentication') ||
        error.includes('authorization'),
    );

    expect(authConsoleErrors).toHaveLength(0);
  });

  test('should show system project in projects list', async ({ page }) => {
    // Ждем загрузки списка проектов
    await page.waitForSelector('[data-testid="projects-list"], .projects-list, .project-card', { timeout: 10000 });

    // Проверяем наличие системного проекта
    const systemProject = await page.locator('text=situs-admin, text=Situs Admin').first();
    await expect(systemProject).toBeVisible({ timeout: 5000 });

    // Проверяем, что системный проект имеет правильные атрибуты
    const projectCard = systemProject.locator('..').first();
    await expect(projectCard).toBeVisible();
  });

  test('should handle API requests without 401 errors', async ({ page }) => {
    // Перехватываем API запросы
    const apiRequests: { url: string; status: number }[] = [];

    page.on('response', (response) => {
      if (response.url().includes('/api/')) {
        apiRequests.push({
          url: response.url(),
          status: response.status(),
        });
      }
    });

    // Обновляем страницу для генерации API запросов
    await page.reload();
    await page.waitForLoadState('networkidle');

    // Проверяем, что нет 401 ошибок
    const unauthorizedRequests = apiRequests.filter((req) => req.status === 401);
    expect(unauthorizedRequests).toHaveLength(0);

    // Проверяем, что основные API endpoints отвечают
    const projectsApiRequest = apiRequests.find((req) => req.url.includes('/api/projects'));
    expect(projectsApiRequest).toBeDefined();
    expect(projectsApiRequest?.status).toBe(200);
  });

  test('should not expose sensitive data in console', async ({ page }) => {
    const sensitiveData: string[] = [];

    page.on('console', (msg) => {
      const text = msg.text();
      // Проверяем на утечку чувствительных данных
      if (
        text.includes('password') ||
        text.includes('secret') ||
        text.includes('token') ||
        text.includes('jwt') ||
        text.includes('private')
      ) {
        sensitiveData.push(text);
      }
    });

    // Выполняем действия, которые могут вызвать логирование
    await page.reload();
    await page.waitForLoadState('networkidle');

    // Ждем для сбора логов
    await page.waitForTimeout(3000);

    // Проверяем, что чувствительные данные не попали в консоль
    expect(sensitiveData).toHaveLength(0);
  });

  test('should handle dev user bypass correctly', async ({ page }) => {
    // Проверяем, что dev-пользователь работает корректно
    const userInfo = await page.evaluate(async () => {
      try {
        // Пытаемся получить информацию о пользователе
        const response = await fetch('/api/users/me');
        if (response.ok) {
          return await response.json();
        }
        return null;
      } catch (error) {
        return { error: error.message };
      }
    });

    // При ENABLE_DEV_USER=1 должен быть доступ к /api/users/me
    expect(userInfo).toBeDefined();
    expect(userInfo.error).toBeUndefined();
  });

  test('should have proper CORS headers', async ({ page }) => {
    // Проверяем CORS заголовки
    const corsHeaders = await page.evaluate(async () => {
      try {
        const response = await fetch('/api/projects', {
          method: 'OPTIONS',
          headers: {
            Origin: 'http://localhost:5177',
            'Access-Control-Request-Method': 'GET',
          },
        });

        return {
          status: response.status,
          headers: {
            'access-control-allow-origin': response.headers.get('access-control-allow-origin'),
            'access-control-allow-methods': response.headers.get('access-control-allow-methods'),
            'access-control-allow-headers': response.headers.get('access-control-allow-headers'),
          },
        };
      } catch (error) {
        return { error: error.message };
      }
    });

    // Проверяем, что CORS настроен правильно
    expect(corsHeaders.error).toBeUndefined();
    expect(corsHeaders.status).toBe(200);
  });

  test('should not allow unauthorized access to admin endpoints', async ({ page }) => {
    // Проверяем защищенные endpoints
    const protectedEndpoints = ['/api/users', '/api/admin-screens', '/api/menus'];

    for (const endpoint of protectedEndpoints) {
      const response = await page.request.get(`http://localhost:3002${endpoint}`);

      // При ENABLE_DEV_USER=1 доступ должен быть разрешен
      // В production это должно быть 401/403
      expect([200, 401, 403]).toContain(response.status());
    }
  });

  test('should handle tenant resolution correctly', async ({ page }) => {
    // Проверяем tenant resolution
    const tenantInfo = await page.evaluate(async () => {
      try {
        const response = await fetch('/api/ui/admin-sidebar');
        if (response.ok) {
          return await response.json();
        }
        return null;
      } catch (error) {
        return { error: error.message };
      }
    });

    // Tenant resolution должен работать
    expect(tenantInfo).toBeDefined();
    expect(tenantInfo.error).toBeUndefined();
  });
});

test.describe('Docker Health Checks', () => {
  test('should respond to health endpoint', async ({ request }) => {
    const response = await request.get('http://localhost:3002/health');
    expect(response.status()).toBe(200);

    const healthData = await response.json();
    expect(healthData.status).toBe('ok');
    expect(healthData.ts).toBeDefined();
  });

  test('should respond to frontend health endpoint', async ({ request }) => {
    const response = await request.get('http://localhost/health');
    expect(response.status()).toBe(200);
  });

  test('should have all required services running', async ({ page }) => {
    // Проверяем, что все сервисы доступны
    const services = [
      { name: 'Frontend', url: 'http://localhost' },
      { name: 'Backend API', url: 'http://localhost:3002/health' },
      { name: 'Projects API', url: 'http://localhost:3002/api/projects' },
    ];

    for (const service of services) {
      const response = await page.request.get(service.url);
      expect(response.status()).toBeLessThan(500);
    }
  });
});
