import { test, expect } from '@playwright/test';

const API_BASE = process.env.API_BASE || 'http://localhost:3002';
const FRONTEND_BASE = process.env.FRONTEND_BASE || 'http://localhost:5177';

test.describe('Admin global navigation (admin-sidebar)', () => {
  test('renders and navigates top-level items', async ({ page, request }) => {
    // 1) Берём admin-sidebar
    const resp = await request.get(`${API_BASE}/api/ui/admin-sidebar`);
    expect(resp.ok()).toBeTruthy();
    const json = await resp.json();
    expect(json.success).toBe(true);
    const items: Array<{ title: string; to: string }> = json.data || [];
    expect(items.length).toBeGreaterThan(0);

    // 2) Открываем корень
    await page.goto(`${FRONTEND_BASE}/`);

    // 3) Для 2-3 первых пунктов кликаем по ссылке в сайдбаре, сверяем URL
    const sample = items.slice(0, Math.min(3, items.length));
    for (const it of sample) {
      // В глобальном контексте навигация идёт по абсолютным to
      const href = it.to;
      // Ищем ссылку с таким href в левом сайдбаре
      const link = page.locator(`nav ul li a[href="${href}"]`).first();
      await expect(link).toBeVisible();
      await link.click();
      await expect(page).toHaveURL(new RegExp(href.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')));
    }
  });
});


