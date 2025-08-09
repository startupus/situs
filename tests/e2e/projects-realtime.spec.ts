import { test, expect } from '@playwright/test';

// E2E: проверяем, что переключение статуса проекта в одном окне
// приводит к мгновенному обновлению карточки в другом окне (через SSE)

test.describe('Projects realtime sync (SSE)', () => {
  test('toggling status updates in another context', async ({ browser }) => {
    const contextA = await browser.newContext();
    const contextB = await browser.newContext();
    const pageA = await contextA.newPage();
    const pageB = await contextB.newPage();

    await Promise.all([
      pageA.goto('http://localhost:5177/projects', { waitUntil: 'domcontentloaded' }),
      pageB.goto('http://localhost:5177/projects', { waitUntil: 'domcontentloaded' }),
    ]);

    // Дожидаемся появления хотя бы одной карточки
    await pageA.waitForSelector('.grid .rounded-xl.border', { timeout: 20000 });
    await pageB.waitForSelector('.grid .rounded-xl.border', { timeout: 20000 });
    const firstCardA = pageA.locator('.grid .rounded-xl.border').first();
    await expect(firstCardA).toBeVisible({ timeout: 20000 });

    // Находим ссылку "Подробнее" — из её href извлечём id
    const detailLinkA = firstCardA.locator('a[href^="/projects/"]');
    const href = await detailLinkA.getAttribute('href');
    expect(href).toBeTruthy();

    // На странице B найдём ту же карточку по href
    const detailLinkB = pageB.locator(`a[href="${href}"]`).first();
    await expect(detailLinkB).toBeVisible();

    // Фиксируем текущее состояние на странице B по классу pointer-events-none (неактивная карточка)
    const beforeClass = await detailLinkB.getAttribute('class');
    const wasInactive = !!beforeClass?.includes('pointer-events-none');

    // На странице A переключаем тумблер статуса (скрытый input)
    const toggleInput = firstCardA.locator('input[type="checkbox"]');
    if (wasInactive) {
      await toggleInput.check({ force: true }); // включаем
    } else {
      await toggleInput.uncheck({ force: true }); // выключаем
    }

    // Ожидаем изменения класса на странице B (через SSE)
    await expect.poll(async () => {
      const cls = await detailLinkB.getAttribute('class');
      const isInactiveNow = !!cls?.includes('pointer-events-none');
      return isInactiveNow !== wasInactive;
    }, { timeout: 5000 }).toBeTruthy();

    await Promise.all([contextA.close(), contextB.close()]);
  });
});


