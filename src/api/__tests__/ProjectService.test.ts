import { PrismaClient } from '@prisma/client';
import ProjectService from '../services/ProjectService';

// Мокаем Prisma
vi.mock('@prisma/client');

const mockPrisma = {
  project: {
    findMany: vi.fn(),
    findUnique: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
    delete: vi.fn(),
    count: vi.fn()
  }
};

(PrismaClient as vi.MockedClass<typeof PrismaClient>).mockImplementation(() => mockPrisma as any);

describe('ProjectService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('findMany', () => {
    it('должен вернуть список проектов с фильтрами', async () => {
      const mockProjects = [
        {
          id: '1',
          name: 'Test Project 1',
          slug: 'test-project-1',
          status: 'DRAFT',
          userId: '1',
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          id: '2',
          name: 'Test Project 2',
          slug: 'test-project-2',
          status: 'PUBLISHED',
          userId: '1',
          createdAt: new Date(),
          updatedAt: new Date()
        }
      ];

      mockPrisma.project.findMany.mockResolvedValue(mockProjects);
      mockPrisma.project.count.mockResolvedValue(2);

      const result = await ProjectService.findMany({
        userId: '1',
        status: 'DRAFT',
        page: 1,
        limit: 10
      });

      expect(mockPrisma.project.findMany).toHaveBeenCalledWith({
        where: {
          userId: '1',
          status: 'DRAFT'
        },
        skip: 0,
        take: 10,
        orderBy: { updatedAt: 'desc' }
      });
      expect(result).toEqual({
        projects: mockProjects,
        total: 2,
        page: 1,
        limit: 10,
        totalPages: 1
      });
    });

    it('должен вернуть пустой список если проекты не найдены', async () => {
      mockPrisma.project.findMany.mockResolvedValue([]);
      mockPrisma.project.count.mockResolvedValue(0);

      const result = await ProjectService.findMany({ userId: '1' });

      expect(result).toEqual({
        projects: [],
        total: 0,
        page: 1,
        limit: 10,
        totalPages: 0
      });
    });

    it('должен использовать значения по умолчанию для пагинации', async () => {
      mockPrisma.project.findMany.mockResolvedValue([]);
      mockPrisma.project.count.mockResolvedValue(0);

      await ProjectService.findMany({ userId: '1' });

      expect(mockPrisma.project.findMany).toHaveBeenCalledWith({
        where: { userId: '1' },
        skip: 0,
        take: 10,
        orderBy: { updatedAt: 'desc' }
      });
    });
  });

  describe('findOne', () => {
    it('должен вернуть проект по ID', async () => {
      const mockProject = {
        id: '1',
        name: 'Test Project',
        slug: 'test-project',
        status: 'DRAFT',
        userId: '1',
        createdAt: new Date(),
        updatedAt: new Date()
      };

      mockPrisma.project.findUnique.mockResolvedValue(mockProject);

      const result = await ProjectService.findOne('1', '1');

      expect(mockPrisma.project.findUnique).toHaveBeenCalledWith({
        where: {
          id: '1',
          userId: '1'
        }
      });
      expect(result).toEqual(mockProject);
    });

    it('должен вернуть null если проект не найден', async () => {
      mockPrisma.project.findUnique.mockResolvedValue(null);

      const result = await ProjectService.findOne('999', '1');

      expect(result).toBeNull();
    });
  });

  describe('create', () => {
    it('должен создать новый проект', async () => {
      const mockProject = {
        id: '1',
        name: 'New Project',
        slug: 'new-project',
        status: 'DRAFT',
        userId: '1',
        createdAt: new Date(),
        updatedAt: new Date()
      };

      mockPrisma.project.create.mockResolvedValue(mockProject);

      const result = await ProjectService.create({
        name: 'New Project',
        description: 'Test description',
        type: 'WEBSITE',
        userId: '1'
      });

      expect(mockPrisma.project.create).toHaveBeenCalledWith({
        data: {
          name: 'New Project',
          description: 'Test description',
          type: 'WEBSITE',
          slug: 'new-project',
          status: 'DRAFT',
          userId: '1'
        }
      });
      expect(result).toEqual(mockProject);
    });

    it('должен генерировать slug из названия', async () => {
      const mockProject = {
        id: '1',
        name: 'Test Project Name',
        slug: 'test-project-name',
        status: 'DRAFT',
        userId: '1'
      };

      mockPrisma.project.create.mockResolvedValue(mockProject);

      await ProjectService.create({
        name: 'Test Project Name',
        userId: '1'
      });

      expect(mockPrisma.project.create).toHaveBeenCalledWith({
        data: expect.objectContaining({
          slug: 'test-project-name'
        })
      });
    });

    it('должен обрабатывать специальные символы в slug', async () => {
      mockPrisma.project.create.mockResolvedValue({} as any);

      await ProjectService.create({
        name: 'Test Project with Special Chars!@#$%',
        userId: '1'
      });

      expect(mockPrisma.project.create).toHaveBeenCalledWith({
        data: expect.objectContaining({
          slug: 'test-project-with-special-chars'
        })
      });
    });
  });

  describe('update', () => {
    it('должен обновить проект', async () => {
      const mockProject = {
        id: '1',
        name: 'Updated Project',
        slug: 'updated-project',
        status: 'DRAFT',
        userId: '1',
        createdAt: new Date(),
        updatedAt: new Date()
      };

      mockPrisma.project.update.mockResolvedValue(mockProject);

      const result = await ProjectService.update('1', {
        name: 'Updated Project',
        description: 'Updated description'
      }, '1');

      expect(mockPrisma.project.update).toHaveBeenCalledWith({
        where: {
          id: '1',
          userId: '1'
        },
        data: {
          name: 'Updated Project',
          description: 'Updated description',
          slug: 'updated-project'
        }
      });
      expect(result).toEqual(mockProject);
    });

    it('должен обновить slug только при изменении названия', async () => {
      const mockProject = {
        id: '1',
        name: 'Test Project',
        slug: 'test-project',
        status: 'DRAFT',
        userId: '1'
      };

      mockPrisma.project.update.mockResolvedValue(mockProject);

      await ProjectService.update('1', {
        description: 'Updated description'
        // name не изменяется
      }, '1');

      expect(mockPrisma.project.update).toHaveBeenCalledWith({
        where: {
          id: '1',
          userId: '1'
        },
        data: {
          description: 'Updated description'
          // slug не должен быть в data
        }
      });
    });

    it('должен вернуть null если проект не найден', async () => {
      mockPrisma.project.update.mockRejectedValue(new Error('Record not found'));

      const result = await ProjectService.update('999', {
        name: 'Updated Project'
      }, '1');

      expect(result).toBeNull();
    });
  });

  describe('delete', () => {
    it('должен удалить проект', async () => {
      const mockProject = {
        id: '1',
        name: 'Test Project',
        userId: '1'
      };

      mockPrisma.project.delete.mockResolvedValue(mockProject);

      const result = await ProjectService.delete('1', '1');

      expect(mockPrisma.project.delete).toHaveBeenCalledWith({
        where: {
          id: '1',
          userId: '1'
        }
      });
      expect(result).toBe(true);
    });

    it('должен вернуть false если проект не найден', async () => {
      mockPrisma.project.delete.mockRejectedValue(new Error('Record not found'));

      const result = await ProjectService.delete('999', '1');

      expect(result).toBe(false);
    });
  });

  describe('publish', () => {
    it('должен опубликовать проект', async () => {
      const mockProject = {
        id: '1',
        name: 'Test Project',
        slug: 'test-project',
        status: 'PUBLISHED',
        userId: '1',
        createdAt: new Date(),
        updatedAt: new Date()
      };

      mockPrisma.project.update.mockResolvedValue(mockProject);

      const result = await ProjectService.publish('1', '1');

      expect(mockPrisma.project.update).toHaveBeenCalledWith({
        where: {
          id: '1',
          userId: '1'
        },
        data: {
          status: 'PUBLISHED',
          publishedAt: expect.any(Date)
        }
      });
      expect(result).toEqual(mockProject);
    });

    it('должен вернуть null если проект не найден', async () => {
      mockPrisma.project.update.mockRejectedValue(new Error('Record not found'));

      const result = await ProjectService.publish('999', '1');

      expect(result).toBeNull();
    });
  });

  describe('unpublish', () => {
    it('должен снять проект с публикации', async () => {
      const mockProject = {
        id: '1',
        name: 'Test Project',
        slug: 'test-project',
        status: 'DRAFT',
        userId: '1',
        createdAt: new Date(),
        updatedAt: new Date()
      };

      mockPrisma.project.update.mockResolvedValue(mockProject);

      const result = await ProjectService.unpublish('1', '1');

      expect(mockPrisma.project.update).toHaveBeenCalledWith({
        where: {
          id: '1',
          userId: '1'
        },
        data: {
          status: 'DRAFT',
          publishedAt: null
        }
      });
      expect(result).toEqual(mockProject);
    });

    it('должен вернуть null если проект не найден', async () => {
      mockPrisma.project.update.mockRejectedValue(new Error('Record not found'));

      const result = await ProjectService.unpublish('999', '1');

      expect(result).toBeNull();
    });
  });

  describe('getStatistics', () => {
    it('должен вернуть статистику проектов', async () => {
      const mockStats = {
        total: 10,
        published: 5,
        draft: 3,
        archived: 2
      };

      const mockRecentProjects = [
        {
          id: '1',
          name: 'Recent Project 1',
          status: 'PUBLISHED',
          updatedAt: new Date()
        },
        {
          id: '2',
          name: 'Recent Project 2',
          status: 'DRAFT',
          updatedAt: new Date()
        }
      ];

      mockPrisma.project.count.mockResolvedValueOnce(mockStats.total);
      mockPrisma.project.count.mockResolvedValueOnce(mockStats.published);
      mockPrisma.project.count.mockResolvedValueOnce(mockStats.draft);
      mockPrisma.project.count.mockResolvedValueOnce(mockStats.archived);
      mockPrisma.project.findMany.mockResolvedValue(mockRecentProjects);

      const result = await ProjectService.getStatistics('1');

      expect(mockPrisma.project.count).toHaveBeenCalledWith({
        where: { userId: '1' }
      });
      expect(mockPrisma.project.count).toHaveBeenCalledWith({
        where: { userId: '1', status: 'PUBLISHED' }
      });
      expect(mockPrisma.project.count).toHaveBeenCalledWith({
        where: { userId: '1', status: 'DRAFT' }
      });
      expect(mockPrisma.project.count).toHaveBeenCalledWith({
        where: { userId: '1', status: 'ARCHIVED' }
      });
      expect(mockPrisma.project.findMany).toHaveBeenCalledWith({
        where: { userId: '1' },
        take: 5,
        orderBy: { updatedAt: 'desc' },
        select: {
          id: true,
          name: true,
          status: true,
          updatedAt: true
        }
      });
      expect(result).toEqual({
        total: 10,
        published: 5,
        draft: 3,
        archived: 2,
        recentProjects: mockRecentProjects
      });
    });
  });

  describe('generateSlug', () => {
    it('должен генерировать корректный slug из названия', () => {
      const testCases = [
        { input: 'Test Project', expected: 'test-project' },
        { input: 'Test Project Name', expected: 'test-project-name' },
        { input: 'Test Project with Special Chars!@#$%', expected: 'test-project-with-special-chars' },
        { input: 'Test Project with Numbers 123', expected: 'test-project-with-numbers-123' },
        { input: 'Test Project with Cyrillic Тест', expected: 'test-project-with-cyrillic' },
        { input: 'Multiple   Spaces', expected: 'multiple-spaces' },
        { input: 'Trailing Spaces ', expected: 'trailing-spaces' },
        { input: ' Leading Spaces', expected: 'leading-spaces' }
      ];

      testCases.forEach(({ input, expected }) => {
        const result = (ProjectService as any).generateSlug(input);
        expect(result).toBe(expected);
      });
    });
  });
}); 