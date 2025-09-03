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
    // Берём вторую ссылку внутри карточки, которая ведёт на детальную (первая может быть бейджем типа)
    const href = await firstCardA.locator('a[href^="/projects/"]').nth(1).getAttribute('href');
    expect(href).toBeTruthy();

    // На странице B найдём ту же карточку по href
    const detailLinkB = pageB.locator(`a[href="${href}"]`).first();
    await expect(detailLinkB).toBeVisible();

    // Дожидаемся handshake SSE в обоих контекстах для надёжности
    const waitHandshake = async (p: any) => {
      await p.addInitScript(() => {
        (window as any).__situsEventLog = [];
      });
      await expect
        .poll(
          async () => {
            const tail = await p.evaluate(() => (window as any).__situsEventLog?.slice(-10) || []);
            return tail.some((e: any) => {
              const dataStr = e?.data;
              if (!dataStr || typeof dataStr !== 'string') return false;
              try {
                return JSON.parse(dataStr)?.type === 'sse_connected';
              } catch {
                return false;
              }
            });
          },
          { timeout: 8000 },
        )
        .toBe(true);
    };
    await Promise.all([waitHandshake(pageA), waitHandshake(pageB)]);

    // Фиксируем текущее состояние по чекбоксу статуса
    const toggleB = pageB.locator(`div.rounded-xl.border:has(a[href='${href}']) input[type="checkbox"]`).first();
    const wasChecked = await toggleB.isChecked();

    // На странице A переключаем тумблер статуса (скрытый input)
    const toggleInput = firstCardA.locator('input[type="checkbox"]');
    if (!wasChecked) {
      await toggleInput.check({ force: true }); // включаем
    } else {
      await toggleInput.uncheck({ force: true }); // выключаем
    }

    // Ожидаем изменения чекбокса на странице B (через SSE)
    await expect.poll(async () => await toggleB.isChecked(), { timeout: 10000 }).toBe(!wasChecked);

    await Promise.all([contextA.close(), contextB.close()]);
  });
});
