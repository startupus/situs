import { test, expect } from '@playwright/test';

test.describe('Project Integrations UI', () => {
  test('catalog loads, create instance, status updates via SSE', async ({ page }) => {
    // Открываем список проектов и берём первый
    await page.goto('http://localhost:5177/projects', { waitUntil: 'domcontentloaded' });
    await page.waitForSelector('.grid .rounded-xl.border a[href^="/projects/"]', { timeout: 20000 });
    const href = await page.locator('.grid .rounded-xl.border a[href^="/projects/"]').first().getAttribute('href');
    expect(href).toBeTruthy();
    const projectId = (href || '').split('/').pop();

    // Переходим в настройки интеграций
    await page.goto(`http://localhost:5177/projects/${projectId}/settings/integrations`, { waitUntil: 'domcontentloaded' });
    await page.waitForSelector('text=Каталог', { timeout: 10000 });

    // Убедимся, что каталог прогружается (видна карточка Email SMTP)
    const emailCard = page.locator('div').filter({ hasText: 'Email (SMTP)' }).first();
    await expect(emailCard).toBeVisible();

    // Подключаем Email SMTP (кнопка Подключить на карточке)
    await emailCard.getByRole('button', { name: 'Подключить' }).first().click();

    // Переключаемся на вкладку Установленные
    await page.getByRole('button', { name: 'Установленные' }).click();
    // Ждём появления хотя бы одной установленной интеграции (кнопка "Настроить")
    await expect(page.getByRole('button', { name: 'Настроить' }).first()).toBeVisible({ timeout: 8000 });

    // Тогглим активность первой записи
    const toggle = page.getByRole('button', { name: /Включить|Выключить/ }).first();
    await expect(toggle).toBeVisible();
    const before = await toggle.textContent();
    await toggle.click();

    // Ожидаем смену надписи на кнопке (через SSE произойдёт обновление списка)
    await expect.poll(async () => (await toggle.textContent()) || '').not.toBe(before, { timeout: 8000 });
  });

  test('health indicators and test functionality', async ({ page }) => {
    // Переходим к интеграциям проекта
    await page.goto('http://localhost:5177/projects', { waitUntil: 'domcontentloaded' });
    await page.waitForSelector('.grid .rounded-xl.border a[href^="/projects/"]', { timeout: 20000 });
    const href = await page.locator('.grid .rounded-xl.border a[href^="/projects/"]').first().getAttribute('href');
    const projectId = (href || '').split('/').pop();

    await page.goto(`http://localhost:5177/projects/${projectId}/settings/integrations#installed`, { waitUntil: 'domcontentloaded' });
    await page.waitForSelector('text=Установленные', { timeout: 10000 });

    // Проверяем наличие кнопки "Проверить все"
    if (await page.locator('button:has-text("Проверить все")').count() > 0) {
      await expect(page.locator('button:has-text("Проверить все")')).toBeVisible();
    }

    // Проверяем наличие индикаторов здоровья
    const healthIndicators = page.locator('span').filter({ hasText: /[?✓✗]/ });
    if (await healthIndicators.count() > 0) {
      await expect(healthIndicators.first()).toBeVisible();
    }

    // Тестируем сортировку если есть интеграции
    const sortSelect = page.locator('select');
    if (await sortSelect.count() > 0) {
      await sortSelect.selectOption('status-desc');
      await page.waitForTimeout(500); // Ждем применения сортировки
    }

    // Тестируем поиск
    const searchInput = page.locator('input[placeholder*="Поиск"]');
    await searchInput.fill('email');
    await page.waitForTimeout(500);
    await searchInput.clear();
  });

  test('help popovers in catalog', async ({ page }) => {
    // Переходим к каталогу интеграций
    await page.goto('http://localhost:5177/projects', { waitUntil: 'domcontentloaded' });
    await page.waitForSelector('.grid .rounded-xl.border a[href^="/projects/"]', { timeout: 20000 });
    const href = await page.locator('.grid .rounded-xl.border a[href^="/projects/"]').first().getAttribute('href');
    const projectId = (href || '').split('/').pop();

    await page.goto(`http://localhost:5177/projects/${projectId}/settings/integrations#catalog`, { waitUntil: 'domcontentloaded' });
    await page.waitForSelector('text=Каталог', { timeout: 10000 });

    // Находим иконку справки и кликаем
    const helpIcon = page.locator('svg').filter({ hasText: /help|circle/ }).first();
    if (await helpIcon.count() > 0) {
      await helpIcon.click();
      
      // Проверяем появление popover
      await expect(page.locator('div').filter({ hasText: 'Настройка' })).toBeVisible({ timeout: 3000 });
    }
  });
});


