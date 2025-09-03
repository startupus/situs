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

    // Ждём рукопожатие SSE, чтобы быть уверенными, что подписка активна
    await expect
      .poll(
        async () => {
          const tail = await page.evaluate(() => (window as any).__situsEventLog?.slice(-10) || []);
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

    // Берём первый проект
    const href = await page.locator('.grid .rounded-xl.border a[href^="/projects/"]').first().getAttribute('href');
    expect(href).toBeTruthy();
    const projectId = (href || '').split('/').pop();

    // Фиксируем исходный статус через API
    const current = await page.evaluate(
      async ({ projectId }) => {
        const base = window.location.origin;
        const res = await fetch(`${base}/api/projects/${projectId}`);
        const json = await res.json();
        return (json?.data?.status || '').toUpperCase();
      },
      { projectId },
    );

    const targetStatus = current === 'ACTIVE' ? 'SUSPENDED' : 'ACTIVE';

    // Меняем статус через API
    const ok = await page.evaluate(
      async ({ projectId, targetStatus }) => {
        const base = window.location.origin;
        const res = await fetch(`${base}/api/projects/${projectId}/status`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ status: targetStatus }),
        });
        return res.ok;
      },
      { projectId, targetStatus },
    );
    expect(ok).toBeTruthy();

    // Ждём подтверждение на сервере
    await expect
      .poll(
        async () => {
          const changed = await page.evaluate(
            async ({ projectId, targetStatus }) => {
              const base = window.location.origin;
              const res = await fetch(`${base}/api/projects/${projectId}`);
              const json = await res.json();
              return (json?.data?.status || '').toUpperCase() === targetStatus;
            },
            { projectId, targetStatus },
          );
          return changed;
        },
        { timeout: 8000 },
      )
      .toBe(true);

    // Проверяем, что событие пришло в клиент
    await expect
      .poll(
        async () => {
          const tail = await page.evaluate(() => (window as any).__situsEventLog?.slice(-20) || []);
          return tail.some((e: any) => {
            const dataStr = e?.data;
            if (!dataStr || typeof dataStr !== 'string') return false;
            try {
              const obj = JSON.parse(dataStr);
              return obj?.type === 'project_status' && !!obj?.payload?.id;
            } catch {
              return false;
            }
          });
        },
        { timeout: 10000 },
      )
      .toBe(true);
  });
});
