/**
 * Интеграционные тесты для API
 * Проверяют взаимодействие фронтенда с бэкендом
 */

import { describe, test, expect, beforeAll, afterAll } from 'vitest';
import { apiClient, ApiClientError } from '../client';
import { projectsApi } from '../services/projects.api';
import { usersApi } from '../services/users.api';
import { analyticsApi } from '../services/analytics.api';

// Мок-данные для тестов
const testUser = {
  username: 'testuser',
  email: 'test@example.com',
  password: 'TestPassword123!'
};

const testProject = {
  name: 'Test Project',
  description: 'Project for testing API integration',
  type: 'WEBSITE' as const
};

let authToken: string;
let userId: string;
let projectId: string;

describe('API Integration Tests', () => {
  beforeAll(async () => {
    // Настройка тестовой среды
    process.env.VITE_API_BASE_URL = 'http://localhost:3001';
  });

  afterAll(async () => {
    // Очистка после тестов
    if (projectId) {
      try {
        await projectsApi.deleteProject(projectId);
      } catch (error) {
        console.log('Cleanup project error:', error);
      }
    }
  });

  describe('API Client', () => {
    test('должен корректно обрабатывать GET запросы', async () => {
      const response = await apiClient.get('/health');
      expect(response).toBeDefined();
    });

    test('должен обрабатывать ошибки сети', async () => {
      // Устанавливаем неверный URL
      const originalBaseURL = apiClient['baseURL'];
      apiClient['baseURL'] = 'http://invalid-url';
      
      await expect(apiClient.get('/test')).rejects.toThrow(ApiClientError);
      
      // Восстанавливаем URL
      apiClient['baseURL'] = originalBaseURL;
    });

    test('должен добавлять токен аутентификации', () => {
      const testToken = 'test-token';
      apiClient.setAuthToken(testToken);
      
      expect(apiClient['defaultHeaders']['Authorization']).toBe(`Bearer ${testToken}`);
      
      apiClient.removeAuthToken();
    });
  });

  describe('Users API', () => {
    test('должен регистрировать нового пользователя', async () => {
      const authResponse = await usersApi.register(testUser);
      
      expect(authResponse).toBeDefined();
      expect(authResponse.user).toBeDefined();
      expect(authResponse.token).toBeDefined();
      expect(authResponse.user.email).toBe(testUser.email);
      
      authToken = authResponse.token;
      userId = authResponse.user.id;
    });

    test('должен входить в систему', async () => {
      const authResponse = await usersApi.login({
        email: testUser.email,
        password: testUser.password
      });
      
      expect(authResponse).toBeDefined();
      expect(authResponse.user.email).toBe(testUser.email);
    });

    test('должен получать текущего пользователя', async () => {
      const user = await usersApi.getCurrentUser();
      
      expect(user).toBeDefined();
      expect(user.id).toBe(userId);
      expect(user.email).toBe(testUser.email);
    });

    test('должен обновлять профиль пользователя', async () => {
      const profileUpdate = {
        firstName: 'Test',
        lastName: 'User',
        bio: 'Test bio'
      };
      
      const updatedUser = await usersApi.updateProfile(profileUpdate);
      
      expect(updatedUser.profile?.firstName).toBe(profileUpdate.firstName);
      expect(updatedUser.profile?.lastName).toBe(profileUpdate.lastName);
    });
  });

  describe('Projects API', () => {
    test('должен создавать новый проект', async () => {
      const project = await projectsApi.createProject(testProject);
      
      expect(project).toBeDefined();
      expect(project.name).toBe(testProject.name);
      expect(project.description).toBe(testProject.description);
      
      projectId = project.id;
    });

    test('должен получать список проектов', async () => {
      const response = await projectsApi.getProjects();
      
      expect(response).toBeDefined();
      expect(response.projects).toBeInstanceOf(Array);
      expect(response.pagination).toBeDefined();
    });

    test('должен получать отдельный проект', async () => {
      const project = await projectsApi.getProject(projectId);
      
      expect(project).toBeDefined();
      expect(project.id).toBe(projectId);
      expect(project.name).toBe(testProject.name);
    });

    test('должен обновлять проект', async () => {
      const updateData = {
        name: 'Updated Test Project',
        description: 'Updated description'
      };
      
      const updatedProject = await projectsApi.updateProject(projectId, updateData);
      
      expect(updatedProject.name).toBe(updateData.name);
      expect(updatedProject.description).toBe(updateData.description);
    });

    test('должен проверять доступность слага', async () => {
      const isAvailable = await projectsApi.checkSlugAvailability('unique-test-slug');
      expect(typeof isAvailable).toBe('boolean');
    });

    test('должен публиковать проект', async () => {
      await expect(projectsApi.publishProject(projectId)).resolves.not.toThrow();
    });

    test('должен снимать с публикации проект', async () => {
      await expect(projectsApi.unpublishProject(projectId)).resolves.not.toThrow();
    });
  });

  describe('Analytics API', () => {
    test('должен получать статистику дашборда', async () => {
      const stats = await analyticsApi.getDashboardStats();
      
      expect(stats).toBeDefined();
      expect(stats.projects).toBeDefined();
      expect(stats.users).toBeDefined();
      expect(stats.traffic).toBeDefined();
      expect(stats.revenue).toBeDefined();
    });

    test('должен получать данные трафика', async () => {
      const trafficData = await analyticsApi.getTrafficData();
      
      expect(trafficData).toBeDefined();
      expect(trafficData.labels).toBeInstanceOf(Array);
      expect(trafficData.datasets).toBeInstanceOf(Array);
    });

    test('должен получать данные конверсии', async () => {
      const conversionData = await analyticsApi.getConversionData();
      
      expect(conversionData).toBeDefined();
      expect(conversionData.labels).toBeInstanceOf(Array);
      expect(conversionData.datasets).toBeInstanceOf(Array);
    });

    test('должен получать метрики проектов', async () => {
      const metrics = await analyticsApi.getProjectMetrics();
      
      expect(metrics).toBeDefined();
      expect(metrics).toBeInstanceOf(Array);
    });
  });

  describe('Error Handling', () => {
    test('должен обрабатывать 404 ошибки', async () => {
      await expect(projectsApi.getProject('non-existent-id')).rejects.toThrow();
    });

    test('должен обрабатывать 401 ошибки', async () => {
      // Удаляем токен для имитации неавторизованного запроса
      usersApi.logout();
      
      await expect(projectsApi.getProjects()).rejects.toThrow();
      
      // Восстанавливаем токен
      apiClient.setAuthToken(authToken);
    });

    test('должен обрабатывать валидационные ошибки', async () => {
      const invalidProjectData = {
        name: '', // Пустое название должно вызвать ошибку
        description: testProject.description
      };
      
      await expect(projectsApi.createProject(invalidProjectData)).rejects.toThrow();
    });
  });

  describe('Performance Tests', () => {
    test('запросы должны выполняться быстро', async () => {
      const startTime = Date.now();
      
      await projectsApi.getProjects({ limit: 10 });
      
      const endTime = Date.now();
      const duration = endTime - startTime;
      
      // Запрос должен выполняться менее чем за 5 секунд
      expect(duration).toBeLessThan(5000);
    });

    test('должен поддерживать параллельные запросы', async () => {
      const promises = [
        projectsApi.getProjects({ limit: 5 }),
        usersApi.getCurrentUser(),
        analyticsApi.getDashboardStats()
      ];
      
      const results = await Promise.all(promises);
      
      expect(results).toHaveLength(3);
      results.forEach(result => {
        expect(result).toBeDefined();
      });
    });
  });
});

/**
 * E2E тесты для критических пользовательских сценариев
 */
describe('E2E User Scenarios', () => {
  test('Полный цикл создания и управления проектом', async () => {
    // 1. Регистрация пользователя
    const authResponse = await usersApi.register({
      username: 'e2euser',
      email: 'e2e@example.com',
      password: 'E2EPassword123!'
    });
    
    expect(authResponse.user).toBeDefined();
    
    // 2. Создание проекта
    const project = await projectsApi.createProject({
      name: 'E2E Test Project',
      description: 'End-to-end test project',
      type: 'WEBSITE'
    });
    
    expect(project).toBeDefined();
    
    // 3. Обновление проекта
    const updatedProject = await projectsApi.updateProject(project.id, {
      name: 'Updated E2E Project'
    });
    
    expect(updatedProject.name).toBe('Updated E2E Project');
    
    // 4. Публикация проекта
    await projectsApi.publishProject(project.id);
    
    // 5. Проверка статистики
    const stats = await analyticsApi.getDashboardStats();
    expect(stats.projects.total).toBeGreaterThan(0);
    
    // 6. Очистка
    await projectsApi.deleteProject(project.id);
  });

  test('Сценарий обновления профиля с аватаром', async () => {
    // Создание тестового файла (blob)
    const testFile = new File(['test'], 'avatar.jpg', { type: 'image/jpeg' });
    
    // Загрузка аватара
    const uploadResult = await usersApi.uploadAvatar(testFile);
    expect(uploadResult.url).toBeDefined();
    
    // Обновление профиля
    const updatedUser = await usersApi.updateProfile({
      firstName: 'Test',
      lastName: 'Avatar',
      bio: 'User with avatar'
    });
    
    expect(updatedUser.profile?.firstName).toBe('Test');
    expect(updatedUser.profile?.avatar).toBeDefined();
  });
});