import { test, expect, chromium, BrowserContext } from '@playwright/test';
import os from 'os';
import path from 'path';

test.describe('Chrome normal vs incognito realtime sync', () => {
  test('status toggle propagates between normal and incognito', async () => {
    const userDataDir = path.join(os.tmpdir(), `situs-chrome-persist-${Date.now()}`);
    const normalCtx: BrowserContext = await chromium.launchPersistentContext(userDataDir, { headless: true });
    const incognitoCtx: BrowserContext = await chromium.launchPersistentContext(
      path.join(os.tmpdir(), `situs-chrome-incog-${Date.now()}`),
      { headless: true },
    );

    const pageNormal = await normalCtx.newPage();
    const pageIncog = await incognitoCtx.newPage();

    await Promise.all([
      pageNormal.goto('http://localhost:5177/projects', { waitUntil: 'domcontentloaded' }),
      pageIncog.goto('http://localhost:5177/projects', { waitUntil: 'domcontentloaded' }),
    ]);

    // Ждём загрузку карточек
    await pageNormal.waitForSelector('.grid .rounded-xl.border', { timeout: 30000 });
    await pageIncog.waitForSelector('.grid .rounded-xl.border', { timeout: 30000 });

    const firstCard = pageNormal.locator('.grid .rounded-xl.border').first();
    await expect(firstCard).toBeVisible();

    // Идентифицируем проект по ссылке
    const detailLink = firstCard.locator('a[href^="/projects/"]').first();
    const href = await detailLink.getAttribute('href');
    expect(href).toBeTruthy();

    // Находим соответствующую карточку в инкогнито
    const cardIncog = pageIncog.locator(`div.rounded-xl.border:has(a[href='${href}'])`).first();
    await expect(cardIncog).toBeVisible({ timeout: 20000 });

    const toggleNormal = firstCard.locator('input[type="checkbox"]');
    const toggleIncog = cardIncog.locator('input[type="checkbox"]');

    const wasChecked = await toggleNormal.isChecked();

    // Вместо клика по UI — вызываем API напрямую, чтобы исключить влияние DnD/оверлеев
    const projectId = (href || '').split('/').pop();
    const targetStatus = wasChecked ? 'SUSPENDED' : 'ACTIVE';
    const ok = await pageNormal.evaluate(
      async ({ projectId, targetStatus, API_BASE }) => {
        const res = await fetch(`${API_BASE}/api/projects/${projectId}/status`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ status: targetStatus }),
        });
        return res.ok;
      },
      { projectId, targetStatus, API_BASE: process.env.API_BASE || 'http://localhost:3002' },
    );
    expect(ok).toBeTruthy();

    // Подтверждаем, что сервер действительно поменял статус (перед тем как ждать фронт)
    await expect
      .poll(
        async () => {
          const changed = await pageNormal.evaluate(
            async ({ projectId, targetStatus, API_BASE }) => {
              const res = await fetch(`${API_BASE}/api/projects/${projectId}`);
              const json = await res.json();
              return (json?.data?.status || '').toUpperCase() === targetStatus;
            },
            { projectId, targetStatus, API_BASE: process.env.API_BASE || 'http://localhost:3002' },
          );
          return changed;
        },
        { timeout: 8000 },
      )
      .toBe(true);

    // Ожидаем синхронизацию: меняется атрибут checked у инпута в инкогнито
    const incogSelector = `div.rounded-xl.border:has(a[href='${href}']) input[type="checkbox"]`;
    await expect
      .poll(async () => await pageIncog.locator(incogSelector).isChecked(), { timeout: 20000 })
      .toBe(!wasChecked);

    // Диагностика лога подписки в обоих контекстах
    const [logNormal, logIncog] = await Promise.all([
      pageNormal.evaluate(() => (window as any).__situsEventLog?.slice(-5) || []),
      pageIncog.evaluate(() => (window as any).__situsEventLog?.slice(-5) || []),
    ]);
    console.log('normal tail:', logNormal);
    console.log('incog tail:', logIncog);

    await Promise.all([normalCtx.close(), incognitoCtx.close()]);
  });
});
