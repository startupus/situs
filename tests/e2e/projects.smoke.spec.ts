import { test, expect } from '@playwright/test';

test.describe('Situs Projects Page', () => {
  test('loads projects and shows UI controls', async ({ page }) => {
    await page.goto('http://localhost:5177/projects');

    // Заголовок раздела
    await expect(page.getByRole('heading', { name: 'Проекты' })).toBeVisible();

    // Верхняя панель: поиск и плюс
    await expect(page.getByRole('button', { name: 'Поиск' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Добавить' })).toBeVisible();

    // Карточки проектов
    const detailsLinks = page.getByRole('link', { name: 'Подробнее' });
    await expect(detailsLinks.first()).toBeVisible();
  });

  test('search toggles and closes', async ({ page }) => {
    await page.goto('http://localhost:5177/projects');
    const searchBtn = page.getByRole('button', { name: 'Поиск' });
    await searchBtn.click();
    await page.getByPlaceholder('Поиск по разделу...').fill('test');
    // Закрыть крестиком
    await page.locator('button[title="Закрыть поиск"]').click();
    await expect(page.getByPlaceholder('Поиск по разделу...')).toHaveCount(0);
  });

  test('create project modal opens from + and can be cancelled', async ({ page }) => {
    await page.goto('http://localhost:5177/projects');
    await page.getByRole('button', { name: 'Добавить' }).click();
    // Ожидаем заголовок модалки
    await expect(page.getByRole('heading', { name: 'Создать новый проект' })).toBeVisible();
    // Закрываем
    await page.getByRole('button', { name: 'Отмена' }).click();
    await expect(page.getByRole('heading', { name: 'Создать новый проект' })).toHaveCount(0);
  });

  test('navigate to project detail', async ({ page }) => {
    await page.goto('http://localhost:5177/projects');
    // Уточняем локатор: кликаем по ссылке внутри активной карточки
    const link = page.locator('div.rounded-xl.border:not(.pointer-events-none) a[href^="/projects/"]').first();
    await link.click({ trial: true }).catch(() => {});
    await link.click({ timeout: 15000 });
    // URL перешёл на детальную страницу
    await expect(page).toHaveURL(/\/projects\/[^/]+$/);
    // В верхней панели больше нет заголовка "Проекты"
    await expect(page.getByRole('heading', { name: 'Проекты', exact: true })).toHaveCount(0);
  });
});


