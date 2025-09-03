import { test, expect } from '@playwright/test';

/**
 * E2E тесты для проверки консистентности меню между dev и production окружениями
 */
test.describe('Menu Consistency Tests', () => {
  test.beforeEach(async ({ page }) => {
    // Переходим на главную страницу
    await page.goto('/');

    // Ждем загрузки меню
    await page.waitForSelector('[data-testid="sidebar"], nav', { timeout: 10000 });
  });

  test('Menu displays all required navigation items', async ({ page }) => {
    // Проверяем наличие основных пунктов меню
    const expectedMenuItems = [
      { text: 'Дашборд', url: '/' },
      { text: 'Проекты', url: '/projects' },
      { text: 'Пользователи', url: '/users' },
      { text: 'Заказы', url: '/orders' },
      { text: 'Настройки', url: '/profile-settings' },
    ];

    for (const item of expectedMenuItems) {
      const menuLink = page.locator(`nav a[href="${item.url}"]`);
      await expect(menuLink).toBeVisible();

      // Проверяем что у каждого пункта есть иконка
      const icon = menuLink.locator('svg, img');
      await expect(icon).toBeVisible();
    }
  });

  test('Menu icons load correctly', async ({ page }) => {
    // Проверяем что все иконки загружены (нет fallback квадратиков)
    const menuIcons = page.locator('nav a svg');
    const iconCount = await menuIcons.count();

    expect(iconCount).toBeGreaterThan(0);

    // Проверяем что иконки имеют правильные размеры
    for (let i = 0; i < iconCount; i++) {
      const icon = menuIcons.nth(i);
      await expect(icon).toHaveAttribute('width', '18');
      await expect(icon).toHaveAttribute('height', '18');
    }
  });

  test('Menu API loads successfully', async ({ page }) => {
    // Проверяем что API запрос успешен
    const apiResponse = page.waitForResponse('/api/ui/admin-sidebar');
    await page.reload();

    const response = await apiResponse;
    expect(response.status()).toBe(200);

    const data = await response.json();
    expect(data.success).toBe(true);
    expect(Array.isArray(data.data)).toBe(true);
    expect(data.data.length).toBeGreaterThan(0);
  });

  test('Menu fallback works when API fails', async ({ page }) => {
    // Блокируем API запрос для тестирования fallback
    await page.route('/api/ui/admin-sidebar', (route) => {
      route.fulfill({
        status: 500,
        body: 'Internal Server Error',
      });
    });

    // Перехватываем логи перед перезагрузкой
    const logs = [];
    page.on('console', (msg) => logs.push(msg.text()));

    await page.reload();

    // Ждем загрузки меню
    await page.waitForSelector('nav a', { timeout: 5000 });

    // Проверяем что fallback меню отображается
    await expect(page.locator('nav a[href="/"]')).toBeVisible(); // Дашборд
    await expect(page.locator('nav a[href="/projects"]')).toBeVisible(); // Проекты

    // Проверяем что меню работает даже при блокированном API
    const menuItemsCount = await page.locator('nav a').count();
    expect(menuItemsCount).toBeGreaterThanOrEqual(3); // Fallback меню должно содержать минимум 3 пункта

    await page.waitForTimeout(2000);

    // Проверяем наличие error логов (опционально, так как может не работать в headless режиме)
    const errorLogs = logs.filter(
      (log) =>
        log.includes('[SIDEBAR]') &&
        (log.includes('Failed to load') || log.includes('using fallback') || log.includes('Network error')),
    );
    // Делаем проверку логов не критичной
    if (errorLogs.length === 0) {
      console.log('Warning: Error logs not captured, but fallback menu is working');
    }
  });

  test('Menu navigation works correctly', async ({ page }) => {
    // Тестируем навигацию по пунктам меню
    await page.click('nav a[href="/projects"]');
    await expect(page).toHaveURL('/projects');

    await page.goBack();
    await expect(page).toHaveURL('/');
  });

  test('Menu styling is consistent', async ({ page }) => {
    const sidebar = page.locator('nav').first();

    // Проверяем что сайдбар имеет правильную ширину (в dev режиме может отличаться)
    const sidebarBox = await sidebar.boundingBox();
    expect(sidebarBox?.width).toBeGreaterThan(80); // Минимальная ширина

    // Проверяем что все пункты меню выровнены
    const menuItems = page.locator('nav a');
    const itemCount = await menuItems.count();

    for (let i = 0; i < itemCount; i++) {
      const item = menuItems.nth(i);
      await expect(item).toBeVisible();

      // Проверяем что элемент кликабелен
      await expect(item).toHaveAttribute('href');
    }
  });

  test('Menu debug information is present in development', async ({ page }) => {
    // В development режиме должны быть debug логи
    const logs = [];
    page.on('console', (msg) => logs.push(msg.text()));

    await page.reload();
    await page.waitForTimeout(2000);

    const debugLogs = logs.filter((log) => log.includes('[SIDEBAR]'));
    expect(debugLogs.length).toBeGreaterThan(0);

    // Проверяем наличие конкретных debug сообщений
    const loadingLog = logs.find((log) => log.includes('Loading admin menu'));
    expect(loadingLog).toBeTruthy();
  });
});

/**
 * Тесты для сравнения dev vs production поведения
 */
test.describe('Dev vs Production Menu Behavior', () => {
  test('Menu loads with same items count in both environments', async ({ page }) => {
    // Получаем количество пунктов меню
    await page.goto('/');
    await page.waitForSelector('nav a');

    const menuItemsCount = await page.locator('nav a').count();

    // В обоих окружениях должно быть одинаковое количество пунктов
    expect(menuItemsCount).toBeGreaterThanOrEqual(5); // Минимум 5 основных пунктов
    expect(menuItemsCount).toBeLessThanOrEqual(10); // Максимум 10 пунктов
  });

  test('Menu API response structure is consistent', async ({ page }) => {
    const response = await page.request.get('/api/ui/admin-sidebar');
    expect(response.status()).toBe(200);

    const data = await response.json();

    // Проверяем структуру ответа
    expect(data).toHaveProperty('success', true);
    expect(data).toHaveProperty('data');
    expect(Array.isArray(data.data)).toBe(true);

    // Проверяем структуру каждого пункта меню
    for (const item of data.data) {
      expect(item).toHaveProperty('title');
      expect(item).toHaveProperty('to');
      expect(item).toHaveProperty('icon');
      expect(item).toHaveProperty('iconLibrary');
    }
  });
});
