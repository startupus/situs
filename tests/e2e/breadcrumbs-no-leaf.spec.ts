import { test, expect } from '@playwright/test';

const FRONTEND_BASE = process.env.FRONTEND_BASE || 'http://localhost:5177';

test.describe('Breadcrumbs without clickable leaf', () => {
  test('project root page shows only parent crumbs', async ({ page }) => {
    // Берём демо проект из README сценариев — можно заменить на динамику при необходимости
    await page.goto(`${FRONTEND_BASE}/projects`);
    // Открываем первую карточку проекта
    const card = page.locator('div.rounded-xl.border:not(.pointer-events-none)').first();
    await card.click({ position: { x: 100, y: 60 } });

    // Проверяем крошки: должна быть ссылка «Проекты», а текущего названия проекта в виде ссылки быть не должно
    const crumbs = page.locator('nav[aria-label="Хлебные крошки"], nav:has-text("Хлебные крошки")');
    await expect(crumbs).toBeVisible();
    await expect(page.getByRole('link', { name: 'Проекты' })).toBeVisible();

    // Текущий заголовок — видим, но не как ссылка в крошках
    const projectTitle = await page.getByRole('heading').first().textContent();
    // Ищем ссылку с этим названием — её быть не должно
    const linksWithTitle = await page.getByRole('link', { name: projectTitle || '' }).count();
    expect(linksWithTitle).toBe(0);
  });
});
