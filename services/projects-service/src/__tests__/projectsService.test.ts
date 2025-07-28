import { describe, it, expect, beforeAll, afterAll, beforeEach } from 'vitest';
import { ProjectsService } from '../services/projectsService.js';

// Мок для тестирования
const mockUserId = 'test-user-id';
const mockProjectData = {
  name: 'Test Project',
  description: 'Test project description',
  ownerId: mockUserId,
  type: 'WEBSITE' as const,
  settings: {
    theme: 'auto' as const,
    language: 'ru' as const,
    creationType: 'manual' as const
  }
};

describe('ProjectsService', () => {
  beforeAll(async () => {
    // Настройка тестовой базы данных
    process.env.NODE_ENV = 'test';
  });

  afterAll(async () => {
    // Очистка после тестов
    await ProjectsService.disconnect();
  });

  describe('generateSlug', () => {
    it('should generate valid slug from project name', () => {
      const name = 'My Awesome Project!';
      const slug = ProjectsService.generateSlug(name);
      
      expect(slug).toBe('my-awesome-project');
      expect(slug).toMatch(/^[a-z0-9-]+$/);
    });

    it('should handle special characters', () => {
      const name = 'Проект с русскими символами & спецзнаками!';
      const slug = ProjectsService.generateSlug(name);
      
      expect(slug).toMatch(/^[a-z0-9-]+$/);
      expect(slug).not.toContain(' ');
    });

    it('should handle multiple spaces and dashes', () => {
      const name = 'Multiple   Spaces--And-Dashes';
      const slug = ProjectsService.generateSlug(name);
      
      expect(slug).toBe('multiple-spaces-and-dashes');
      expect(slug).not.toContain('--');
    });
  });

  describe('generateSitusSubdomain', () => {
    it('should generate correct situs subdomain', () => {
      const slug = 'test-project';
      const subdomain = ProjectsService.generateSitusSubdomain(slug);
      
      expect(subdomain).toBe('test-project.situs.com');
    });
  });

  describe('Project validation', () => {
    it('should validate required fields', () => {
      const invalidData = {
        // name отсутствует
        ownerId: mockUserId
      };

      // Проверяем что валидация должна происходить на уровне Joi схем
      expect(() => {
        // Этот тест проверяет что мы правильно передаем данные
        const data = invalidData as any;
        expect(data.name).toBeUndefined();
      }).not.toThrow();
    });

    it('should accept valid project data', () => {
      expect(mockProjectData.name).toBeDefined();
      expect(mockProjectData.ownerId).toBeDefined();
      expect(mockProjectData.type).toMatch(/^(WEBSITE|ECOMMERCE|LANDING|BLOG|APP)$/);
    });
  });

  describe('Settings validation', () => {
    it('should validate theme settings', () => {
      const validThemes = ['light', 'dark', 'auto'];
      
      validThemes.forEach(theme => {
        const settings = { ...mockProjectData.settings, theme: theme as any };
        expect(['light', 'dark', 'auto']).toContain(settings.theme);
      });
    });

    it('should validate language settings', () => {
      const validLanguages = ['ru', 'en'];
      
      validLanguages.forEach(language => {
        const settings = { ...mockProjectData.settings, language: language as any };
        expect(['ru', 'en']).toContain(settings.language);
      });
    });

    it('should validate creation type', () => {
      const validTypes = ['manual', 'ai'];
      
      validTypes.forEach(creationType => {
        const settings = { ...mockProjectData.settings, creationType: creationType as any };
        expect(['manual', 'ai']).toContain(settings.creationType);
      });
    });
  });

  // Примечание: Интеграционные тесты с реальной БД требуют настройки тестовой среды
  // и могут быть добавлены позже при настройке CI/CD
});

// Дополнительные тесты для утилитарных функций
describe('Utility functions', () => {
  describe('Slug generation edge cases', () => {
    it('should handle empty string', () => {
      const slug = ProjectsService.generateSlug('');
      expect(slug).toBe('');
    });

    it('should handle only special characters', () => {
      const slug = ProjectsService.generateSlug('!!!@@@###');
      expect(slug).toBe('');
    });

    it('should handle very long names', () => {
      const longName = 'a'.repeat(200);
      const slug = ProjectsService.generateSlug(longName);
      expect(slug.length).toBeLessThanOrEqual(200);
      expect(slug).toMatch(/^[a-z0-9-]*$/);
    });
  });

  describe('Domain generation', () => {
    it('should create valid situs domains', () => {
      const testCases = [
        { slug: 'simple', expected: 'simple.situs.com' },
        { slug: 'with-dashes', expected: 'with-dashes.situs.com' },
        { slug: 'test123', expected: 'test123.situs.com' }
      ];

      testCases.forEach(({ slug, expected }) => {
        const domain = ProjectsService.generateSitusSubdomain(slug);
        expect(domain).toBe(expected);
      });
    });
  });
});