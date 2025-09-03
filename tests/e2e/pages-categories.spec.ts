import { test, expect } from '@playwright/test';

const API_BASE = process.env.API_BASE || 'http://localhost:3002';
const FRONTEND_BASE = process.env.FRONTEND_BASE || 'http://localhost:5177';
const PROJECT_ID = process.env.PROJECT_ID || 'startapus-ecosystem';

test.describe('Pages categories CRUD and reorder', () => {
  test('Create category with plus button, list visible, reorder API works', async ({ page, request }) => {
    await page.goto(`${FRONTEND_BASE}/projects/${PROJECT_ID}/pages`);
    // Переключаемся на вкладку Категории
    await page.getByRole('button', { name: 'Категории' }).click();
    // Открываем модал создания
    await page.getByRole('button', { name: 'Создать категорию' }).click();
    await expect(page.getByRole('heading', { name: 'Создать категорию' })).toBeVisible();

    const slug = `auto-${Date.now()}`;
    await page.getByLabel('Название *').fill(`AutoCat ${slug}`);
    await page.getByLabel('Slug *').fill(slug);
    await page.getByRole('button', { name: 'Создать' }).click();

    // Появилась в списке
    await expect(page.getByText(`/${slug}`)).toBeVisible({ timeout: 5000 });

    // Проверяем reorder через API (минимальная проверка доступности)
    const listResp = await request.get(`${API_BASE}/api/projects/${PROJECT_ID}/pages/categories`);
    expect(listResp.ok()).toBeTruthy();
    const listJson = await listResp.json();
    expect(listJson.success).toBe(true);
    const cats = listJson.categories || [];
    expect(Array.isArray(cats)).toBe(true);
    if (cats.length >= 2) {
      const [a, b] = cats.slice(0, 2);
      const reorderResp = await request.patch(`${API_BASE}/api/pages/categories/reorder`, {
        data: {
          projectId: PROJECT_ID,
          items: [
            { id: a.id, orderIndex: 1, parentId: a.parentId || null },
            { id: b.id, orderIndex: 0, parentId: b.parentId || null },
          ],
        },
      });
      expect(reorderResp.ok()).toBeTruthy();
      const reorderJson = await reorderResp.json();
      expect(reorderJson.success).toBe(true);
    }
  });
});
