import { describe, it, expect, beforeAll, afterAll } from 'vitest';

/**
 * E2E тесты для системы меню
 * Тестируем все API эндпоинты MenuTypes и MenuItems
 */

const API_BASE = process.env.API_BASE || 'http://localhost:3003/api';

describe('Menus System E2E', () => {
  let projectId: string;
  let menuTypeId: string;
  let menuItemId: string;

  beforeAll(async () => {
    // Используем существующий проект для тестов
    projectId = 'startapus-ecosystem';
  });

  describe('MenuTypes CRUD', () => {
    it('lists menu types for project', async () => {
      const response = await fetch(`${API_BASE}/menu-types?projectId=${projectId}`);
      expect([200, 401, 403]).toContain(response.status);
      
      if (response.status === 200) {
        const data = await response.json();
        expect(data.success).toBe(true);
        expect(Array.isArray(data.data)).toBe(true);
        
        // Должны быть main и footer меню из сидов
        const menuTypes = data.data;
        expect(menuTypes.length).toBeGreaterThanOrEqual(2);
        
        const mainMenu = menuTypes.find((mt: any) => mt.name === 'main');
        expect(mainMenu).toBeDefined();
        expect(mainMenu.title).toBe('Главное меню');
        expect(mainMenu._count.items).toBeGreaterThan(0);
        
        menuTypeId = mainMenu.id;
      }
    });

    it('creates and deletes a menu type', async () => {
      const createData = {
        name: 'test-menu',
        title: 'Тестовое меню',
        description: 'Меню для E2E тестов',
        projectId
      };

      const create = await fetch(`${API_BASE}/menu-types`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(createData)
      });

      if (![200, 201].includes(create.status)) {
        expect([401, 403]).toContain(create.status);
        return;
      }

      const createResult = await create.json();
      expect(createResult.success).toBe(true);
      expect(createResult.data.name).toBe('test-menu');
      expect(createResult.data.title).toBe('Тестовое меню');

      const createdId = createResult.data.id;

      // Обновляем
      const updateData = { title: 'Обновленное тестовое меню' };
      const update = await fetch(`${API_BASE}/menu-types/${createdId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updateData)
      });

      if (update.status === 200) {
        const updateResult = await update.json();
        expect(updateResult.success).toBe(true);
        expect(updateResult.data.title).toBe('Обновленное тестовое меню');
      }

      // Удаляем
      const deleteResponse = await fetch(`${API_BASE}/menu-types/${createdId}`, {
        method: 'DELETE'
      });

      if ([200, 204].includes(deleteResponse.status)) {
        const deleteResult = await deleteResponse.json();
        expect(deleteResult.success).toBe(true);
      }
    });
  });

  describe('MenuItems CRUD', () => {
    it('lists menu items with filtering', async () => {
      if (!menuTypeId) return;

      // Все пункты меню
      const allItems = await fetch(`${API_BASE}/menu-items?menuTypeId=${menuTypeId}`);
      expect([200, 401, 403]).toContain(allItems.status);
      
      if (allItems.status === 200) {
        const allData = await allItems.json();
        expect(allData.success).toBe(true);
        expect(Array.isArray(allData.data)).toBe(true);
        expect(allData.data.length).toBeGreaterThan(0);

        // Фильтрация по уровню 1
        const level1Items = await fetch(`${API_BASE}/menu-items?menuTypeId=${menuTypeId}&level=1`);
        if (level1Items.status === 200) {
          const level1Data = await level1Items.json();
          expect(level1Data.success).toBe(true);
          
          const items = level1Data.data;
          expect(items.every((item: any) => item.level === 1)).toBe(true);
          
          // Должны быть основные пункты: Главная, Каталог, О компании, Контакты
          const titles = items.map((item: any) => item.title);
          expect(titles).toContain('Главная');
          expect(titles).toContain('Каталог');
        }

        // Фильтрация по уровню 2 (подменю)
        const level2Items = await fetch(`${API_BASE}/menu-items?menuTypeId=${menuTypeId}&level=2`);
        if (level2Items.status === 200) {
          const level2Data = await level2Items.json();
          expect(level2Data.success).toBe(true);
          
          const items = level2Data.data;
          expect(items.every((item: any) => item.level === 2)).toBe(true);
          
          // Должны быть категории: Электроника, Одежда, Дом и сад
          const titles = items.map((item: any) => item.title);
          expect(titles).toContain('Электроника');
          expect(titles).toContain('Одежда');
        }
      }
    });

    it('creates and deletes a menu item', async () => {
      if (!menuTypeId) return;

      const createData = {
        title: 'Тестовый пункт',
        alias: 'test-item',
        type: 'COMPONENT',
        level: 1,
        component: 'Website',
        view: 'page',
        targetId: 'test-page',
        accessLevel: 'PUBLIC',
        language: '*',
        menuTypeId
      };

      const create = await fetch(`${API_BASE}/menu-items`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(createData)
      });

      if (![200, 201].includes(create.status)) {
        expect([401, 403]).toContain(create.status);
        return;
      }

      const createResult = await create.json();
      expect(createResult.success).toBe(true);
      expect(createResult.data.title).toBe('Тестовый пункт');
      expect(createResult.data.alias).toBe('test-item');
      expect(createResult.data.component).toBe('Website');

      menuItemId = createResult.data.id;

      // Обновляем
      const updateData = { title: 'Обновленный тестовый пункт' };
      const update = await fetch(`${API_BASE}/menu-items/${menuItemId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updateData)
      });

      if (update.status === 200) {
        const updateResult = await update.json();
        expect(updateResult.success).toBe(true);
        expect(updateResult.data.title).toBe('Обновленный тестовый пункт');
      }

      // Удаляем
      const deleteResponse = await fetch(`${API_BASE}/menu-items/${menuItemId}`, {
        method: 'DELETE'
      });

      if ([200, 204].includes(deleteResponse.status)) {
        const deleteResult = await deleteResponse.json();
        expect(deleteResult.success).toBe(true);
      }
    });

    it('tests hierarchy and parent-child relationships', async () => {
      if (!menuTypeId) return;

      // Создаем родительский пункт
      const parentData = {
        title: 'Родительский пункт',
        alias: 'parent-item',
        type: 'HEADING',
        level: 1,
        accessLevel: 'PUBLIC',
        language: '*',
        menuTypeId
      };

      const createParent = await fetch(`${API_BASE}/menu-items`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(parentData)
      });

      if (![200, 201].includes(createParent.status)) {
        expect([401, 403]).toContain(createParent.status);
        return;
      }

      const parentResult = await createParent.json();
      const parentId = parentResult.data.id;

      // Создаем дочерний пункт
      const childData = {
        title: 'Дочерний пункт',
        alias: 'child-item',
        type: 'COMPONENT',
        level: 2,
        parentId,
        component: 'Website',
        view: 'page',
        accessLevel: 'PUBLIC',
        language: '*',
        menuTypeId
      };

      const createChild = await fetch(`${API_BASE}/menu-items`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(childData)
      });

      if (createChild.status === 200 || createChild.status === 201) {
        const childResult = await createChild.json();
        expect(childResult.success).toBe(true);
        expect(childResult.data.parentId).toBe(parentId);
        expect(childResult.data.level).toBe(2);

        // Удаляем дочерний пункт
        await fetch(`${API_BASE}/menu-items/${childResult.data.id}`, {
          method: 'DELETE'
        });
      }

      // Удаляем родительский пункт
      await fetch(`${API_BASE}/menu-items/${parentId}`, {
        method: 'DELETE'
      });
    });
  });

  describe('MenuItems Special Endpoints', () => {
    it('tests lookup system for routing', async () => {
      if (!menuTypeId) return;

      const lookup = await fetch(`${API_BASE}/menu-items/lookup?menuTypeId=${menuTypeId}&language=*`);
      expect([200, 401, 403]).toContain(lookup.status);
      
      if (lookup.status === 200) {
        const lookupData = await lookup.json();
        expect(lookupData.success).toBe(true);
        expect(typeof lookupData.data).toBe('object');
        
        // Должны быть записи для page, categories, category
        const data = lookupData.data;
        expect(data.page).toBeDefined();
        expect(data.categories).toBeDefined();
        expect(data.category).toBeDefined();
      }
    });

    it('tests authorized items filtering', async () => {
      if (!menuTypeId) return;

      const authorized = await fetch(`${API_BASE}/menu-items/authorized?menuTypeId=${menuTypeId}&accessLevels=PUBLIC,REGISTERED`);
      expect([200, 401, 403]).toContain(authorized.status);
      
      if (authorized.status === 200) {
        const authData = await authorized.json();
        expect(authData.success).toBe(true);
        expect(Array.isArray(authData.data)).toBe(true);
        
        // Все возвращенные пункты должны иметь accessLevel PUBLIC или REGISTERED
        const items = authData.data;
        expect(items.every((item: any) => 
          ['PUBLIC', 'REGISTERED'].includes(item.accessLevel)
        )).toBe(true);
      }
    });

    it('tests multi-parameter filtering (Joomla style)', async () => {
      if (!menuTypeId) return;

      const filtered = await fetch(`${API_BASE}/menu-items/items-by-filters?menuTypeId=${menuTypeId}&properties=level,component&values=1,Website`);
      expect([200, 401, 403]).toContain(filtered.status);
      
      if (filtered.status === 200) {
        const filteredData = await filtered.json();
        expect(filteredData.success).toBe(true);
        expect(Array.isArray(filteredData.data)).toBe(true);
        
        // Все пункты должны быть level=1 и component=Website
        const items = filteredData.data;
        expect(items.every((item: any) => 
          item.level === 1 && item.component === 'Website'
        )).toBe(true);
      }
    });
  });

  describe('MenuItems Validation', () => {
    it('prevents duplicate aliases in same menu type', async () => {
      if (!menuTypeId) return;

      const duplicateData = {
        title: 'Дубликат',
        alias: 'home', // Уже существует в демо-данных
        type: 'COMPONENT',
        level: 1,
        component: 'Website',
        view: 'page',
        accessLevel: 'PUBLIC',
        language: '*',
        menuTypeId
      };

      const create = await fetch(`${API_BASE}/menu-items`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(duplicateData)
      });

      // Должна быть ошибка валидации
      if (create.status === 400) {
        const error = await create.json();
        expect(error.success).toBe(false);
        expect(error.error || error.message).toContain('alias');
      } else {
        // Если создание прошло (политики могут блокировать), проверим статус
        expect([401, 403]).toContain(create.status);
      }
    });

    it('validates required fields', async () => {
      const invalidData = {
        // Отсутствуют обязательные поля title, alias, menuTypeId
        type: 'COMPONENT'
      };

      const create = await fetch(`${API_BASE}/menu-items`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(invalidData)
      });

      // Должна быть ошибка валидации или политики
      expect([400, 401, 403]).toContain(create.status);
    });
  });

  describe('MenuItems Hierarchy', () => {
    it('creates proper parent-child relationships', async () => {
      if (!menuTypeId) return;

      // Получаем существующий пункт "Каталог" как родителя
      const items = await fetch(`${API_BASE}/menu-items?menuTypeId=${menuTypeId}&level=1`);
      
      if (items.status === 200) {
        const itemsData = await items.json();
        const catalogItem = itemsData.data.find((item: any) => item.alias === 'catalog');
        
        if (catalogItem) {
          // Проверяем, что у каталога есть дочерние элементы
          const childItems = await fetch(`${API_BASE}/menu-items?menuTypeId=${menuTypeId}&level=2`);
          
          if (childItems.status === 200) {
            const childData = await childItems.json();
            const children = childData.data.filter((item: any) => item.parentId === catalogItem.id);
            
            expect(children.length).toBeGreaterThan(0);
            expect(children.every((item: any) => item.level === 2)).toBe(true);
            expect(children.every((item: any) => item.component === 'Store')).toBe(true);
          }
        }
      }
    });
  });

  describe('MenuItems Component Binding', () => {
    it('validates component bindings', async () => {
      if (!menuTypeId) return;

      const items = await fetch(`${API_BASE}/menu-items?menuTypeId=${menuTypeId}`);
      
      if (items.status === 200) {
        const itemsData = await items.json();
        const menuItems = itemsData.data;
        
        // Проверяем привязки к компонентам
        const websiteItems = menuItems.filter((item: any) => item.component === 'Website');
        const storeItems = menuItems.filter((item: any) => item.component === 'Store');
        
        expect(websiteItems.length).toBeGreaterThan(0);
        expect(storeItems.length).toBeGreaterThan(0);
        
        // Website пункты должны иметь view=page и targetId
        websiteItems.forEach((item: any) => {
          expect(item.view).toBe('page');
          expect(item.targetId).toBeDefined();
        });
        
        // Store пункты должны иметь view=categories или view=category
        storeItems.forEach((item: any) => {
          expect(['categories', 'category']).toContain(item.view);
        });
      }
    });
  });

  describe('MenuItems Parameters', () => {
    it('validates JSON parameters', async () => {
      if (!menuTypeId) return;

      const items = await fetch(`${API_BASE}/menu-items?menuTypeId=${menuTypeId}`);
      
      if (items.status === 200) {
        const itemsData = await items.json();
        const menuItems = itemsData.data;
        
        // Проверяем, что parameters являются валидным JSON
        menuItems.forEach((item: any) => {
          expect(() => JSON.parse(item.parameters)).not.toThrow();
          
          const params = JSON.parse(item.parameters);
          expect(typeof params).toBe('object');
          
          // Базовые параметры должны быть корректными
          if (params.menu_show !== undefined) {
            expect(typeof params.menu_show).toBe('boolean');
          }
          if (params.css_class !== undefined) {
            expect(typeof params.css_class).toBe('string');
          }
        });
      }
    });
  });

  describe('MenuItems Access Control', () => {
    it('filters by access levels', async () => {
      if (!menuTypeId) return;

      // Получаем только PUBLIC пункты
      const publicItems = await fetch(`${API_BASE}/menu-items/authorized?menuTypeId=${menuTypeId}&accessLevels=PUBLIC`);
      
      if (publicItems.status === 200) {
        const publicData = await publicItems.json();
        expect(publicData.success).toBe(true);
        
        // Все пункты должны быть PUBLIC
        const items = publicData.data;
        expect(items.every((item: any) => item.accessLevel === 'PUBLIC')).toBe(true);
        
        // Должны быть основные публичные пункты
        expect(items.length).toBeGreaterThan(0);
      }
    });
  });

  describe('MenuItems Language Support', () => {
    it('filters by language', async () => {
      if (!menuTypeId) return;

      // Получаем пункты для всех языков
      const allLangItems = await fetch(`${API_BASE}/menu-items?menuTypeId=${menuTypeId}&language=*`);
      
      if (allLangItems.status === 200) {
        const allLangData = await allLangItems.json();
        expect(allLangData.success).toBe(true);
        
        // Все демо-пункты должны иметь language='*'
        const items = allLangData.data;
        expect(items.every((item: any) => item.language === '*')).toBe(true);
      }
    });
  });

  describe('MenuItems Reorder', () => {
    it('reorders menu items', async () => {
      if (!menuTypeId) return;

      // Получаем текущие пункты уровня 1
      const items = await fetch(`${API_BASE}/menu-items?menuTypeId=${menuTypeId}&level=1`);
      
      if (items.status === 200) {
        const itemsData = await items.json();
        const currentItems = itemsData.data;
        
        if (currentItems.length >= 2) {
          // Меняем порядок первых двух пунктов
          const reorderData = {
            items: [
              {
                id: currentItems[0].id,
                orderIndex: 1,
                level: 1,
                parentId: null
              },
              {
                id: currentItems[1].id,
                orderIndex: 0,
                level: 1,
                parentId: null
              }
            ]
          };

          const reorder = await fetch(`${API_BASE}/menu-items/reorder`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(reorderData)
          });

          if ([200, 204].includes(reorder.status)) {
            const reorderResult = await reorder.json();
            expect(reorderResult.success).toBe(true);
          } else {
            expect([401, 403]).toContain(reorder.status);
          }
        }
      }
    });
  });
});
