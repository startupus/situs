import { test, expect } from '@playwright/test';

/**
 * Тесты безопасности tenant-scope
 * Проверяют изоляцию данных между тенантами
 */
test.describe('Tenant-Scope Security Tests', () => {
  const API_BASE_URL = 'http://localhost:3002/api';
  const FRONTEND_URL = 'http://localhost:5177';

  test.beforeEach(async ({ page }) => {
    // Очищаем cookies перед каждым тестом
    await page.context().clearCookies();
  });

  test('should isolate projects between different tenants', async ({ page, request }) => {
    // Создаем проекты для разных тенантов
    const tenant1Projects = [];
    const tenant2Projects = [];

    // Создаем проекты для tenant1
    for (let i = 1; i <= 3; i++) {
      const response = await request.post(`${API_BASE_URL}/projects`, {
        data: {
          name: `Tenant1 Project ${i}`,
          description: `Project ${i} for tenant1`,
        },
        headers: {
          'Content-Type': 'application/json',
          'X-Tenant-Id': 'tenant1',
          Authorization: 'Bearer dev-token', // Dev bypass для тестов
        },
      });
      expect(response.ok()).toBeTruthy();
      const project = await response.json();
      tenant1Projects.push(project.data);
    }

    // Создаем проекты для tenant2
    for (let i = 1; i <= 3; i++) {
      const response = await request.post(`${API_BASE_URL}/projects`, {
        data: {
          name: `Tenant2 Project ${i}`,
          description: `Project ${i} for tenant2`,
        },
        headers: {
          'Content-Type': 'application/json',
          'X-Tenant-Id': 'tenant2',
          Authorization: 'Bearer dev-token',
        },
      });
      expect(response.ok()).toBeTruthy();
      const project = await response.json();
      tenant2Projects.push(project.data);
    }

    // Проверяем, что tenant1 видит только свои проекты
    const tenant1Response = await request.get(`${API_BASE_URL}/projects`, {
      headers: {
        'X-Tenant-Id': 'tenant1',
        Authorization: 'Bearer dev-token',
      },
    });
    expect(tenant1Response.ok()).toBeTruthy();
    const tenant1Data = await tenant1Response.json();

    // Должны видеть только проекты tenant1 + системный проект
    const tenant1ProjectNames = tenant1Data.data.projects.map((p: any) => p.name);
    expect(tenant1ProjectNames).toContain('Tenant1 Project 1');
    expect(tenant1ProjectNames).toContain('Tenant1 Project 2');
    expect(tenant1ProjectNames).toContain('Tenant1 Project 3');
    expect(tenant1ProjectNames).not.toContain('Tenant2 Project 1');
    expect(tenant1ProjectNames).not.toContain('Tenant2 Project 2');
    expect(tenant1ProjectNames).not.toContain('Tenant2 Project 3');

    // Проверяем, что tenant2 видит только свои проекты
    const tenant2Response = await request.get(`${API_BASE_URL}/projects`, {
      headers: {
        'X-Tenant-Id': 'tenant2',
        Authorization: 'Bearer dev-token',
      },
    });
    expect(tenant2Response.ok()).toBeTruthy();
    const tenant2Data = await tenant2Response.json();

    const tenant2ProjectNames = tenant2Data.data.projects.map((p: any) => p.name);
    expect(tenant2ProjectNames).toContain('Tenant2 Project 1');
    expect(tenant2ProjectNames).toContain('Tenant2 Project 2');
    expect(tenant2ProjectNames).toContain('Tenant2 Project 3');
    expect(tenant2ProjectNames).not.toContain('Tenant1 Project 1');
    expect(tenant2ProjectNames).not.toContain('Tenant1 Project 2');
    expect(tenant2ProjectNames).not.toContain('Tenant1 Project 3');
  });

  test('should prevent cross-tenant project access', async ({ request }) => {
    // Создаем проект для tenant1
    const createResponse = await request.post(`${API_BASE_URL}/projects`, {
      data: {
        name: 'Secret Tenant1 Project',
        description: 'This should be private to tenant1',
      },
      headers: {
        'Content-Type': 'application/json',
        'X-Tenant-Id': 'tenant1',
        Authorization: 'Bearer dev-token',
      },
    });
    expect(createResponse.ok()).toBeTruthy();
    const project = await createResponse.json();
    const projectId = project.data.id;

    // Пытаемся получить проект от имени tenant2
    const accessResponse = await request.get(`${API_BASE_URL}/projects/${projectId}`, {
      headers: {
        'X-Tenant-Id': 'tenant2',
        Authorization: 'Bearer dev-token',
      },
    });

    // Должны получить 404 или 403
    expect([404, 403]).toContain(accessResponse.status());
  });

  test('should allow system admin projects to all tenants', async ({ request }) => {
    // Системный проект должен быть доступен всем тенантам
    const tenant1Response = await request.get(`${API_BASE_URL}/projects`, {
      headers: {
        'X-Tenant-Id': 'tenant1',
        Authorization: 'Bearer dev-token',
      },
    });
    expect(tenant1Response.ok()).toBeTruthy();
    const tenant1Data = await tenant1Response.json();

    // Должен быть системный проект
    const systemProject = tenant1Data.data.projects.find((p: any) => p.isSystemAdmin);
    expect(systemProject).toBeTruthy();
    expect(systemProject.name).toContain('Situs Admin');

    // Проверяем, что tenant2 тоже видит системный проект
    const tenant2Response = await request.get(`${API_BASE_URL}/projects`, {
      headers: {
        'X-Tenant-Id': 'tenant2',
        Authorization: 'Bearer dev-token',
      },
    });
    expect(tenant2Response.ok()).toBeTruthy();
    const tenant2Data = await tenant2Response.json();

    const systemProject2 = tenant2Data.data.projects.find((p: any) => p.isSystemAdmin);
    expect(systemProject2).toBeTruthy();
    expect(systemProject2.id).toBe(systemProject.id);
  });

  test('should prevent tenant spoofing via header manipulation', async ({ request }) => {
    // Создаем проект для tenant1
    const createResponse = await request.post(`${API_BASE_URL}/projects`, {
      data: {
        name: 'Tenant1 Project',
        description: 'Project for tenant1',
      },
      headers: {
        'Content-Type': 'application/json',
        'X-Tenant-Id': 'tenant1',
        Authorization: 'Bearer dev-token',
      },
    });
    expect(createResponse.ok()).toBeTruthy();
    const project = await createResponse.json();
    const projectId = project.data.id;

    // Пытаемся получить проект с поддельным tenantId
    const spoofResponse = await request.get(`${API_BASE_URL}/projects/${projectId}`, {
      headers: {
        'X-Tenant-Id': 'tenant1', // Правильный tenant
        'X-Forwarded-For': '192.168.1.100', // Попытка подмены IP
        Authorization: 'Bearer dev-token',
      },
    });

    // Должны получить доступ (правильный tenant)
    expect(spoofResponse.ok()).toBeTruthy();

    // Пытаемся получить проект с неправильным tenantId
    const wrongTenantResponse = await request.get(`${API_BASE_URL}/projects/${projectId}`, {
      headers: {
        'X-Tenant-Id': 'tenant2', // Неправильный tenant
        Authorization: 'Bearer dev-token',
      },
    });

    // Должны получить 404 или 403
    expect([404, 403]).toContain(wrongTenantResponse.status());
  });

  test('should handle missing tenant header gracefully', async ({ request }) => {
    // Запрос без tenant header должен работать (fallback к user-based filtering)
    const response = await request.get(`${API_BASE_URL}/projects`, {
      headers: {
        Authorization: 'Bearer dev-token',
      },
    });

    // Должны получить ответ (системные проекты + проекты пользователя)
    expect(response.ok()).toBeTruthy();
    const data = await response.json();
    expect(data.data.projects).toBeDefined();
    expect(Array.isArray(data.data.projects)).toBeTruthy();
  });

  test('should validate tenant ID format', async ({ request }) => {
    // Пытаемся создать проект с невалидным tenantId
    const response = await request.post(`${API_BASE_URL}/projects`, {
      data: {
        name: 'Test Project',
        description: 'Test project with invalid tenant',
      },
      headers: {
        'Content-Type': 'application/json',
        'X-Tenant-Id': 'invalid-tenant-id-with-special-chars!@#$%',
        Authorization: 'Bearer dev-token',
      },
    });

    // Должны получить ошибку валидации
    expect([400, 422]).toContain(response.status());
  });
});
