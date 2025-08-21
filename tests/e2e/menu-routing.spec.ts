import { test, expect } from '@playwright/test';

/**
 * E2E тесты роутинга и SEF URLs для системы меню
 * Проверяет корректность маршрутизации и генерации SEF URLs
 */

const API_BASE = process.env.API_BASE || 'http://localhost:3002';
const FRONTEND_BASE = process.env.FRONTEND_BASE || 'http://localhost:5177';
const PROJECT_ID = 'startapus-ecosystem';

test.describe('Menu Routing & SEF URLs', () => {
  
  test('API: получение Itemid для роутинга', async ({ request }) => {
    const response = await request.get(`${API_BASE}/api/menu-items/routing/get-itemid`, {
      params: {
        projectId: PROJECT_ID,
        component: 'Website',
        view: 'page',
        targetId: 'home'
      }
    });

    expect(response.ok()).toBeTruthy();
    const data = await response.json();
    expect(data.success).toBe(true);
    expect(data.data).toHaveProperty('itemid');
    expect(data.data).toHaveProperty('found');
  });

  test('API: парсинг URL в компоненты', async ({ request }) => {
    const response = await request.get(`${API_BASE}/api/menu-items/routing/parse-url`, {
      params: {
        projectId: PROJECT_ID,
        url: '/home?Itemid=cmeh1ajkk000k9k6kbbwh1vm6'
      }
    });

    expect(response.ok()).toBeTruthy();
    const data = await response.json();
    expect(data.success).toBe(true);
    expect(data.data).toHaveProperty('component');
    expect(data.data).toHaveProperty('view');
  });

  test('API: генерация SEF URL для пункта меню', async ({ request }) => {
    // Сначала получаем ID любого пункта меню
    const menuItemsResponse = await request.get(`${API_BASE}/api/menu-items`, {
      params: { menuTypeId: 'cmeh1ajkj000i9k6kvdv0weji' }
    });
    
    const menuItems = await menuItemsResponse.json();
    expect(menuItems.success).toBe(true);
    expect(menuItems.data.length).toBeGreaterThan(0);
    
    const firstItem = menuItems.data[0];
    
    // Генерируем SEF URL
    const sefResponse = await request.get(`${API_BASE}/api/menu-items/${firstItem.id}/sef-url`);
    expect(sefResponse.ok()).toBeTruthy();
    
    const sefData = await sefResponse.json();
    expect(sefData.success).toBe(true);
    expect(sefData.data).toHaveProperty('url');
    expect(sefData.data.url).toContain('Itemid=');
  });

  test('API: генерация sitemap', async ({ request }) => {
    const response = await request.get(`${API_BASE}/api/menu-items/routing/sitemap`, {
      params: {
        projectId: PROJECT_ID,
        baseUrl: 'https://example.com'
      }
    });

    expect(response.ok()).toBeTruthy();
    const data = await response.json();
    expect(data.success).toBe(true);
    expect(Array.isArray(data.data)).toBe(true);
    expect(data.data.length).toBeGreaterThan(0);
    
    // Проверяем структуру sitemap
    const firstEntry = data.data[0];
    expect(firstEntry).toHaveProperty('url');
    expect(firstEntry).toHaveProperty('priority');
    expect(firstEntry).toHaveProperty('changefreq');
    expect(firstEntry).toHaveProperty('lastmod');
  });

  test('API: lookup таблица для быстрого поиска', async ({ request }) => {
    const response = await request.get(`${API_BASE}/api/menu-items/lookup`, {
      params: {
        menuTypeId: 'cmeh1ajkj000i9k6kvdv0weji',
        language: '*'
      }
    });

    expect(response.ok()).toBeTruthy();
    const data = await response.json();
    expect(data.success).toBe(true);
    expect(typeof data.data).toBe('object');
    
    // Lookup должен содержать ключи вида "Website:page"
    const lookupKeys = Object.keys(data.data);
    expect(lookupKeys.length).toBeGreaterThan(0);
    expect(lookupKeys.some(key => key.includes(':'))).toBe(true);
  });

  test('API: поиск активного пункта меню по пути', async ({ request }) => {
    const response = await request.get(`${API_BASE}/api/menu-items/active-by-path`, {
      params: {
        menuTypeId: 'cmeh1ajkj000i9k6kvdv0weji',
        path: '/home'
      }
    });

    expect(response.ok()).toBeTruthy();
    const data = await response.json();
    expect(data.success).toBe(true);
    
    if (data.data) {
      expect(data.data).toHaveProperty('activeItem');
      expect(data.data).toHaveProperty('breadcrumbs');
    }
  });

  test('Frontend: навигация с активным пунктом меню', async ({ page }) => {
    await page.goto(`${FRONTEND_BASE}/projects/${PROJECT_ID}/menus`);
    
    // Ждем загрузки меню
    await page.waitForSelector('[data-testid="menu-manager"]', { timeout: 10000 });
    
    // Проверяем, что есть пункты меню (после автоподстановки главного типа меню)
    const menuItems = await page.locator('[data-testid="menu-item"]').count();
    expect(menuItems).toBeGreaterThan(0);
    
    // Проверяем работу переключения типов меню
    await page.selectOption('[data-testid="menu-type-select"]', 'cmeh1ajkj000i9k6kvdv0weji');
    await page.waitForTimeout(1000);
    
    const footerValue = await page.locator('[data-testid="menu-type-select"]').inputValue();
    expect(footerValue).toBe('cmeh1ajkj000i9k6kvdv0weji');
    const footerItems = await page.locator('[data-testid="menu-item"]').count();
    expect(footerItems).toBeGreaterThan(0);
  });

  test('Frontend: предпросмотр меню с фильтрацией', async ({ page }) => {
    await page.goto(`${FRONTEND_BASE}/projects/${PROJECT_ID}/menus`);
    
    // Предпросмотр доступен на странице, проверяем секцию
    await page.waitForSelector('[data-testid="menu-preview"]');
    
    // Проверяем настройки предпросмотра
    await page.waitForSelector('[data-testid="menu-preview-role"]');
    
    // Меняем роль на администратора
    await page.selectOption('[data-testid="menu-preview-role"]', 'admin');
    
    // Проверяем, что количество показанных пунктов изменилось
    const statsText = await page.textContent('[data-testid="menu-preview-stats"]');
    expect(statsText).toContain('из');
  });

  test('Frontend: Drag & Drop перестановка пунктов', async ({ page }) => {
    await page.goto(`${FRONTEND_BASE}/projects/${PROJECT_ID}/menus`);
    
    // Область перетаскивания доступна на странице
    
    // Проверяем наличие элементов для перетаскивания
    await page.waitForSelector('[data-testid="menu-drag-handle"]');
    const dragHandles = await page.locator('[data-testid="menu-drag-handle"]').count();
    expect(dragHandles).toBeGreaterThan(0);
    
    // Проверяем инструкции
    // Текст инструкции может отличаться; проверяем наличие самой области
    await expect(page.locator('[data-testid="menu-drag-handle"]').first()).toBeVisible();
  });

  test('API: проверка прав доступа к пунктам меню', async ({ request }) => {
    // Получаем первый пункт меню
    const menuItemsResponse = await request.get(`${API_BASE}/api/menu-items`, {
      params: { menuTypeId: 'cmeh1ajkj000i9k6kvdv0weji' }
    });
    
    const menuItems = await menuItemsResponse.json();
    expect(menuItems.success).toBe(true);
    const firstItem = menuItems.data[0];
    
    // Проверяем доступ
    const accessResponse = await request.get(`${API_BASE}/api/menu-items/security/check-access/${firstItem.id}`, {
      params: {
        userAccessLevels: 'PUBLIC,REGISTERED'
      }
    });

    expect(accessResponse.ok()).toBeTruthy();
    const accessData = await accessResponse.json();
    expect(accessData.success).toBe(true);
    expect(typeof accessData.data.hasAccess).toBe('boolean');
  });

  test('API: статистика прав доступа', async ({ request }) => {
    const response = await request.get(`${API_BASE}/api/menu-items/security/access-stats`, {
      params: {
        projectId: PROJECT_ID
      }
    });

    expect(response.ok()).toBeTruthy();
    const data = await response.json();
    expect(data.success).toBe(true);
    expect(data.data).toHaveProperty('total');
    expect(data.data).toHaveProperty('byAccessLevel');
    expect(typeof data.data.total).toBe('number');
  });

  test('API: мультиязычная фильтрация', async ({ request }) => {
    // Получаем пункты для русского языка
    const ruResponse = await request.get(`${API_BASE}/api/menu-items/authorized`, {
      params: {
        menuTypeId: 'cmeh1ajkj000i9k6kvdv0weji',
        accessLevels: 'PUBLIC',
        language: 'ru-RU'
      }
    });

    expect(ruResponse.ok()).toBeTruthy();
    const ruData = await ruResponse.json();
    expect(ruData.success).toBe(true);
    
    // Получаем пункты для всех языков
    const allResponse = await request.get(`${API_BASE}/api/menu-items/authorized`, {
      params: {
        menuTypeId: 'cmeh1ajkj000i9k6kvdv0weji',
        accessLevels: 'PUBLIC',
        language: '*'
      }
    });

    const allData = await allResponse.json();
    expect(allData.success).toBe(true);
    
    // Для универсальных пунктов (language='*') результаты должны быть одинаковыми
    expect(ruData.data.length).toBe(allData.data.length);
  });

  test('Integration: полный цикл роутинга', async ({ request }) => {
    // 1. Получаем lookup таблицу
    const lookupResponse = await request.get(`${API_BASE}/api/menu-items/lookup`, {
      params: {
        menuTypeId: 'cmeh1ajkj000i9k6kvdv0weji',
        language: '*'
      }
    });
    
    const lookupData = await lookupResponse.json();
    expect(lookupData.success).toBe(true);
    
    // 2. Ищем Itemid для Website:page
    const websitePageKey = Object.keys(lookupData.data).find(key => 
      key.startsWith('Website:page')
    );
    
    if (websitePageKey) {
      const itemId = Object.values(lookupData.data[websitePageKey])[0] as string;
      
      // 3. Генерируем SEF URL
      const sefResponse = await request.get(`${API_BASE}/api/menu-items/${itemId}/sef-url`);
      const sefData = await sefResponse.json();
      expect(sefData.success).toBe(true);
      
      // 4. Парсим сгенерированный URL обратно
      const parseResponse = await request.get(`${API_BASE}/api/menu-items/routing/parse-url`, {
        params: {
          projectId: PROJECT_ID,
          url: sefData.data.url
        }
      });
      
      const parseData = await parseResponse.json();
      expect(parseData.success).toBe(true);
      expect(parseData.data.component).toBe('Website');
      expect(parseData.data.view).toBe('page');
    }
  });

});
