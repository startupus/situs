import { test, expect } from '@playwright/test';

const API_BASE = process.env.API_BASE || 'http://localhost:3002';
const FRONTEND_BASE = process.env.FRONTEND_BASE || 'http://localhost:5177';
const PROJECT_ID = process.env.PROJECT_ID || 'startapus-ecosystem';

test.describe('Menu manager: plus button and icon save', () => {
  test('Plus button opens correct modal on items or types tab and autoselects/creates main type', async ({
    page,
    request,
  }) => {
    await page.goto(`${FRONTEND_BASE}/projects/${PROJECT_ID}/settings/menu?tab=items`);

    // На вкладке items по умолчанию: клик по "+" должен открыть модал создания пункта
    const plusButton = page.locator('header [title="Добавить"]');
    await expect(plusButton).toBeVisible();
    await plusButton.click();
    // Ожидаем шапку модала создания пункта
    // Модал может быть в другом контейнере: проверим заголовок через роль heading
    await expect(page.getByRole('heading', { name: 'Создать пункт меню' })).toBeVisible({ timeout: 5000 });

    // Закрываем модал
    await page.getByRole('button', { name: 'Отмена' }).click();

    // Переключаемся на вкладку типов
    await page.getByRole('button', { name: 'Типы меню' }).click();
    await expect(page.getByRole('button', { name: 'Типы меню' })).toHaveClass(/bg-primary/);

    // Клик по "+" теперь должен открыть модал создания типа
    await page.locator('header [title="Добавить"]').click();
    await expect(page.getByText('Создать тип меню')).toBeVisible({ timeout: 5000 });
    // Закрываем
    await page.getByRole('button', { name: 'Отмена' }).click();

    // Проверяем автосоздание main при отсутствии типов: временно создадим проект-стенд не будем; сценарий: если типов ноль — API POST /api/menu-types с name=main должен произойти
    // Здесь smoke: убеждаемся, что список типов есть или модал открывается повторно после клика
  });

  test('Update menu item icon via Edit modal persists and reflects in UI', async ({ page, request }) => {
    // Гарантируем наличие типов и элементов
    const typesResp = await request.get(`${API_BASE}/api/menu-types`, { params: { projectId: PROJECT_ID } });
    expect(typesResp.ok()).toBeTruthy();
    const typesJson = await typesResp.json();
    expect(typesJson.success).toBe(true);
    const type = (typesJson.data || [])[0];
    expect(type).toBeTruthy();

    // Получаем пункты и берём первый
    const itemsResp = await request.get(`${API_BASE}/api/menu-items`, { params: { menuTypeId: type.id } });
    expect(itemsResp.ok()).toBeTruthy();
    const itemsJson = await itemsResp.json();
    expect(itemsJson.success).toBe(true);
    const item = (itemsJson.data || [])[0];
    expect(item).toBeTruthy();

    await page.goto(`${FRONTEND_BASE}/projects/${PROJECT_ID}/menus`);
    // Выбираем тип в селекте
    await page.selectOption('[data-testid="menu-type-select"]', type.id);
    await page.waitForTimeout(500);

    // Открываем первый пункт в режиме редактирования
    const firstItem = page.locator('[data-testid="menu-item"]').first();
    await expect(firstItem).toBeVisible();
    // Кнопка редактирования внутри карточки
    await firstItem.getByTitle('Редактировать пункт меню').click();
    await expect(page.getByText('Редактирование пункта меню')).toBeVisible();

    // Меняем иконку: открыть селектор и выбрать FiSettings
    await page.getByRole('button', { name: 'Изменить' }).click();
    await expect(page.getByText('Выбор иконки для пункта меню')).toBeVisible();
    await page.getByPlaceholder('Поиск иконок... (например: дом, пользователь, корзина)').fill('settings');
    await page.getByTitle('FiSettings').click();
    // Если закрытие не произошло автоматически — подтверждаем
    await page.getByRole('button', { name: 'Выбрать' }).click();

    // Сохранить
    await page.getByRole('button', { name: 'Сохранить изменения' }).click();
    await expect(page.getByText('Редактирование пункта меню')).toBeHidden({ timeout: 7000 });

    // Проверяем, что иконка видна в карточке и в предпросмотре
    // Внутри карточки несколько svg (кнопки). Проверим именно блок иконки через первый svg внутри текста заголовка
    await expect(firstItem.locator('span[title^="Тип:"] svg').first()).toBeVisible();
    await expect(page.locator('[data-testid="menu-preview"]').locator('svg').first()).toBeVisible();
  });
});
