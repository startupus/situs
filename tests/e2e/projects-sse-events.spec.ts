import { test, expect } from '@playwright/test';

/**
 * Проверка, что SSE события project_status приходят после смены статуса
 */
test.describe('Projects SSE', () => {
  test('project_status arrives after status PATCH', async ({ page }) => {
    // Подписка логов событий
    await page.addInitScript(() => {
      (window as any).__situsEventLog = [];
    });

    // Открываем список проектов (фронт должен инициализировать подписку)
    await page.goto('http://localhost:5177/projects', { waitUntil: 'domcontentloaded' });
    await page.waitForSelector('.grid .rounded-xl.border', { timeout: 30000 });

    // Берём первый проект
    const href = await page.locator('.grid .rounded-xl.border a[href^="/projects/"]').first().getAttribute('href');
    expect(href).toBeTruthy();
    const projectId = (href || '').split('/').pop();

    // Фиксируем исходный статус через API
    const current = await page.evaluate(async ({ projectId }) => {
      const res = await fetch(`http://localhost:3001/api/projects/${projectId}`);
      const json = await res.json();
      return (json?.data?.status || '').toUpperCase();
    }, { projectId });

    const targetStatus = current === 'ACTIVE' ? 'SUSPENDED' : 'ACTIVE';

    // Меняем статус через API
    const ok = await page.evaluate(async ({ projectId, targetStatus }) => {
      const res = await fetch(`http://localhost:3001/api/projects/${projectId}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: targetStatus }),
      });
      return res.ok;
    }, { projectId, targetStatus });
    expect(ok).toBeTruthy();

    // Ждём подтверждение на сервере
    await expect.poll(async () => {
      const changed = await page.evaluate(async ({ projectId, targetStatus }) => {
        const res = await fetch(`http://localhost:3001/api/projects/${projectId}`);
        const json = await res.json();
        return (json?.data?.status || '').toUpperCase() === targetStatus;
      }, { projectId, targetStatus });
      return changed;
    }, { timeout: 8000 }).toBe(true);

    // Проверяем, что событие пришло в клиент
    await expect.poll(async () => {
      const tail = await page.evaluate(() => (window as any).__situsEventLog?.slice(-10) || []);
      return tail.some((e: any) => e?.data?.type === 'project_status' && (e?.data?.payload?.id));
    }, { timeout: 10000 }).toBe(true);
  });
});

