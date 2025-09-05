import { test, expect } from '@playwright/test';

/**
 * E2E тесты для tenant-scope функциональности
 *
 * Проверяют:
 * - Фильтрацию проектов по тенанту
 * - Изоляцию данных между тенантами
 * - Корректную работу middleware
 */

test.describe('Tenant Scope Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:5178/');
  });

  test('should filter projects by tenant', async ({ page }) => {
    // Симулируем запрос с определенным тенантом
    await page.route('**/api/**', async (route) => {
      const request = route.request();
      const headers = request.headers();

      // Добавляем заголовок тенанта
      const modifiedHeaders = {
        ...headers,
        'x-tenant-id': 'tenant-1',
      };

      await route.continue({ headers: modifiedHeaders });
    });

    await page.goto('http://localhost:5178/projects');

    // Проверяем, что загрузились только проекты для tenant-1
    const projects = page.locator('[data-testid="project-item"]');
    const count = await projects.count();

    // Должен быть только системный проект (доступен всем тенантам)
    expect(count).toBe(1);
    await expect(page.locator('text=Situs Admin system')).toBeVisible();
  });

  test('should isolate data between tenants', async ({ page }) => {
    // Создаем контекст для первого тенанта
    const tenant1Context = await page.context().newPage();
    await tenant1Context.route('**/api/**', async (route) => {
      const request = route.request();
      const headers = request.headers();

      const modifiedHeaders = {
        ...headers,
        'x-tenant-id': 'tenant-1',
      };

      await route.continue({ headers: modifiedHeaders });
    });

    // Создаем контекст для второго тенанта
    const tenant2Context = await page.context().newPage();
    await tenant2Context.route('**/api/**', async (route) => {
      const request = route.request();
      const headers = request.headers();

      const modifiedHeaders = {
        ...headers,
        'x-tenant-id': 'tenant-2',
      };

      await route.continue({ headers: modifiedHeaders });
    });

    // Проверяем, что данные изолированы
    await tenant1Context.goto('http://localhost:5178/projects');
    await tenant2Context.goto('http://localhost:5178/projects');

    // Оба должны видеть только системный проект
    await expect(tenant1Context.locator('text=Situs Admin system')).toBeVisible();
    await expect(tenant2Context.locator('text=Situs Admin system')).toBeVisible();
  });

  test('should handle missing tenant gracefully', async ({ page }) => {
    // Запрос без заголовка тенанта
    await page.goto('http://localhost:5178/projects');

    // Должен работать с дефолтным тенантом или системным
    await expect(page.locator('h1')).toContainText('Проекты');
  });

  test('should validate tenant format', async ({ page }) => {
    // Симулируем запрос с невалидным тенантом
    await page.route('**/api/**', async (route) => {
      const request = route.request();
      const headers = request.headers();

      const modifiedHeaders = {
        ...headers,
        'x-tenant-id': 'invalid-tenant-format!@#',
      };

      await route.continue({ headers: modifiedHeaders });
    });

    const response = await page.request.get('http://localhost:5178/api/projects');

    // Должен быть 400 Bad Request
    expect(response.status()).toBe(400);
  });

  test('should cache tenant data appropriately', async ({ page }) => {
    // Первый запрос с тенантом
    await page.route('**/api/**', async (route) => {
      const request = route.request();
      const headers = request.headers();

      const modifiedHeaders = {
        ...headers,
        'x-tenant-id': 'tenant-1',
      };

      await route.continue({ headers: modifiedHeaders });
    });

    const startTime = Date.now();
    await page.goto('http://localhost:5178/projects');
    const firstLoadTime = Date.now() - startTime;

    // Второй запрос с тем же тенантом (должен быть быстрее из-за кеша)
    const startTime2 = Date.now();
    await page.reload();
    const secondLoadTime = Date.now() - startTime2;

    // Второй запрос должен быть быстрее (кеш работает)
    expect(secondLoadTime).toBeLessThan(firstLoadTime);
  });
});
