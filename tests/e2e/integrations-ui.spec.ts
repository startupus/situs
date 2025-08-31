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
});


