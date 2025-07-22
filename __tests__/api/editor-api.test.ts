/**
 * Автотесты для Editor API
 * Тестирование всех endpoints и функциональности
 */

import { describe, test, expect, beforeAll, afterAll } from 'vitest';

const API_BASE_URL = 'http://localhost:3000';

// Проверяем доступность API перед тестами
beforeAll(async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/health`);
    if (!response.ok) {
      throw new Error('API server not available');
    }
  } catch (error) {
    console.warn('API server might not be running. Start it with: node server-test.cjs');
    throw error;
  }
});

describe('Editor API Tests', () => {
  describe('Health Check', () => {
    test('should return healthy status', async () => {
      const response = await fetch(`${API_BASE_URL}/health`);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.status).toBe('healthy');
      expect(data.service).toBe('situs-service');
      expect(data.component).toBe('redaktus-editor-api');
      expect(data.data).toHaveProperty('totalPages');
      expect(data.data).toHaveProperty('totalComponents');
      expect(data.data).toHaveProperty('componentLibrarySize');
    });
  });

  describe('Root Endpoint', () => {
    test('should return service information', async () => {
      const response = await fetch(`${API_BASE_URL}/`);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.message).toContain('Situs Service');
      expect(data.service).toBe('Redaktus Editor API');
      expect(data.endpoints).toHaveProperty('health');
      expect(data.endpoints).toHaveProperty('pages');
      expect(data.endpoints).toHaveProperty('components');
    });
  });

  describe('Pages API', () => {
    let createdPageId: string;

    test('should get all pages', async () => {
      const response = await fetch(`${API_BASE_URL}/api/pages`);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
      expect(data.data).toHaveProperty('items');
      expect(data.data).toHaveProperty('total');
      expect(data.data.items).toBeInstanceOf(Array);
    });

    test('should create a new page', async () => {
      const newPage = {
        title: 'Тестовая страница',
        template: 'blog',
        language: 'ru'
      };

      const response = await fetch(`${API_BASE_URL}/api/pages`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(newPage)
      });

      const data = await response.json();

      expect(response.status).toBe(201);
      expect(data.success).toBe(true);
      expect(data.data.title).toBe(newPage.title);
      expect(data.data.settings.template).toBe(newPage.template);
      expect(data.data.settings.language).toBe(newPage.language);
      expect(data.data.status).toBe('draft');
      expect(data.data).toHaveProperty('id');

      createdPageId = data.data.id;
    });

    test('should get page by ID', async () => {
      if (!createdPageId) {
        throw new Error('No page ID available for testing');
      }

      const response = await fetch(`${API_BASE_URL}/api/pages/${createdPageId}`);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
      expect(data.data.id).toBe(createdPageId);
      expect(data.data.title).toBe('Тестовая страница');
    });

    test('should update page', async () => {
      if (!createdPageId) {
        throw new Error('No page ID available for testing');
      }

      const updates = {
        title: 'Обновленная тестовая страница',
        status: 'published',
        description: 'Описание обновленной страницы'
      };

      const response = await fetch(`${API_BASE_URL}/api/pages/${createdPageId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(updates)
      });

      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
      expect(data.data.title).toBe(updates.title);
      expect(data.data.status).toBe(updates.status);
      expect(data.data.description).toBe(updates.description);
    });

    test('should delete page', async () => {
      if (!createdPageId) {
        throw new Error('No page ID available for testing');
      }

      const response = await fetch(`${API_BASE_URL}/api/pages/${createdPageId}`, {
        method: 'DELETE'
      });

      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
      expect(data.data.deleted).toBe(true);
    });

    test('should return 404 for non-existent page', async () => {
      const response = await fetch(`${API_BASE_URL}/api/pages/non-existent`);
      const data = await response.json();

      expect(response.status).toBe(404);
      expect(data.success).toBe(false);
      expect(data.error.code).toBe('PAGE_NOT_FOUND');
    });

    test('should validate required fields', async () => {
      const invalidPage = {
        // title отсутствует
        template: 'blog'
      };

      const response = await fetch(`${API_BASE_URL}/api/pages`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(invalidPage)
      });

      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.success).toBe(false);
      expect(data.error.code).toBe('VALIDATION_ERROR');
    });
  });

  describe('Components API', () => {
    test('should get component library', async () => {
      const response = await fetch(`${API_BASE_URL}/api/components`);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
      expect(data.data).toBeInstanceOf(Array);
      expect(data.data.length).toBeGreaterThan(0);

      // Проверяем структуру компонента
      const component = data.data[0];
      expect(component).toHaveProperty('id');
      expect(component).toHaveProperty('name');
      expect(component).toHaveProperty('type');
      expect(component).toHaveProperty('category');
      expect(component).toHaveProperty('description');
      expect(component).toHaveProperty('defaultProps');
      expect(component).toHaveProperty('schema');
      expect(component).toHaveProperty('tags');
    });

    test('should have heading component', async () => {
      const response = await fetch(`${API_BASE_URL}/api/components`);
      const data = await response.json();

      const headingComponent = data.data.find((comp: any) => comp.type === 'heading');
      expect(headingComponent).toBeDefined();
      expect(headingComponent.name).toBe('Заголовок');
      expect(headingComponent.category).toBe('text');
      expect(headingComponent.defaultProps).toHaveProperty('level');
      expect(headingComponent.defaultProps).toHaveProperty('color');
    });

    test('should have paragraph component', async () => {
      const response = await fetch(`${API_BASE_URL}/api/components`);
      const data = await response.json();

      const paragraphComponent = data.data.find((comp: any) => comp.type === 'paragraph');
      expect(paragraphComponent).toBeDefined();
      expect(paragraphComponent.name).toBe('Текст');
      expect(paragraphComponent.category).toBe('text');
      expect(paragraphComponent.defaultProps).toHaveProperty('fontSize');
      expect(paragraphComponent.defaultProps).toHaveProperty('color');
    });
  });

  describe('Stats API', () => {
    test('should get statistics', async () => {
      const response = await fetch(`${API_BASE_URL}/api/stats`);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
      expect(data.data).toHaveProperty('totalPages');
      expect(data.data).toHaveProperty('totalComponents');
      expect(data.data).toHaveProperty('totalLibraryComponents');
      expect(data.data).toHaveProperty('pagesByStatus');

      expect(typeof data.data.totalPages).toBe('number');
      expect(typeof data.data.totalComponents).toBe('number');
      expect(typeof data.data.totalLibraryComponents).toBe('number');

      expect(data.data.pagesByStatus).toHaveProperty('draft');
      expect(data.data.pagesByStatus).toHaveProperty('published');
      expect(data.data.pagesByStatus).toHaveProperty('archived');
    });
  });

  describe('Error Handling', () => {
    test('should handle non-existent endpoints', async () => {
      const response = await fetch(`${API_BASE_URL}/api/non-existent`);
      expect(response.status).toBe(404);
    });

    test('should handle invalid JSON', async () => {
      const response = await fetch(`${API_BASE_URL}/api/pages`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: 'invalid json'
      });

      expect(response.status).toBeGreaterThanOrEqual(400);
    });
  });

  describe('Performance', () => {
    test('API should respond quickly', async () => {
      const startTime = Date.now();
      const response = await fetch(`${API_BASE_URL}/health`);
      const endTime = Date.now();

      expect(response.status).toBe(200);
      expect(endTime - startTime).toBeLessThan(500); // Менее 500ms
    });

    test('Pages API should respond quickly', async () => {
      const startTime = Date.now();
      const response = await fetch(`${API_BASE_URL}/api/pages`);
      const data = await response.json();
      const endTime = Date.now();

      expect(response.status).toBe(200);
      expect(data.meta.processingTime).toBeDefined();
      expect(endTime - startTime).toBeLessThan(1000); // Менее 1 секунды
    });
  });

  describe('API Response Format', () => {
    test('success responses should have correct format', async () => {
      const response = await fetch(`${API_BASE_URL}/api/pages`);
      const data = await response.json();

      expect(data).toHaveProperty('success');
      expect(data).toHaveProperty('data');
      expect(data).toHaveProperty('meta');

      expect(data.success).toBe(true);
      expect(data.meta).toHaveProperty('timestamp');
      expect(data.meta).toHaveProperty('requestId');
      expect(data.meta).toHaveProperty('processingTime');
    });

    test('error responses should have correct format', async () => {
      const response = await fetch(`${API_BASE_URL}/api/pages/non-existent`);
      const data = await response.json();

      expect(data).toHaveProperty('success');
      expect(data).toHaveProperty('error');
      expect(data).toHaveProperty('meta');

      expect(data.success).toBe(false);
      expect(data.error).toHaveProperty('code');
      expect(data.error).toHaveProperty('message');
    });
  });
});