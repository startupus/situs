import { describe, test, expect, beforeEach, afterEach, vi } from 'vitest';
import { PrismaClient } from '@prisma/client';
import ProjectService from '../../services/ProjectService';

/**
 * Unit Tests для ProjectService
 * Тестируют бизнес-логику сервиса проектов
 */

// Мокаем Prisma Client
vi.mock('@prisma/client');

const mockPrisma = {
  project: {
    findMany: vi.fn(),
    findUnique: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
    delete: vi.fn(),
    count: vi.fn(),
  },
  page: {
    create: vi.fn(),
    deleteMany: vi.fn(),
    count: vi.fn(),
  },
};

// Мокаем модуль PrismaClient
vi.mocked(PrismaClient).mockImplementation(() => mockPrisma as any);

describe('ProjectService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  describe('findMany', () => {
    test('должен возвращать список проектов пользователя', async () => {
      const mockProjects = [
        {
          id: 'project-1',
          name: 'Тестовый проект',
          description: 'Описание проекта',
          slug: 'test-project',
          type: 'WEBSITE',
          status: 'DRAFT',
          domain: null,
          customDomain: null,
          isPublished: false,
          settings: { theme: 'auto' },
          createdAt: new Date('2024-01-01'),
          updatedAt: new Date('2024-01-02'),
          pages: [],
          _count: { pages: 0 },
        },
      ];

      mockPrisma.project.findMany.mockResolvedValue(mockProjects);

      const result = await ProjectService.findMany('user-1');

      expect(mockPrisma.project.findMany).toHaveBeenCalledWith({
        where: { ownerId: 'user-1' },
        include: {
          pages: {
            orderBy: { createdAt: 'desc' },
          },
          _count: {
            select: { pages: true },
          },
        },
        orderBy: { updatedAt: 'desc' },
      });

      expect(result).toHaveLength(1);
      expect(result[0]).toMatchObject({
        id: 'project-1',
        name: 'Тестовый проект',
        type: 'website',
        status: 'DRAFT',
      });
    });

    test('должен применять фильтры поиска', async () => {
      const filters = {
        search: 'тест',
        status: 'DRAFT',
        sortBy: 'name' as const,
        sortOrder: 'asc' as const,
      };

      mockPrisma.project.findMany.mockResolvedValue([]);

      await ProjectService.findMany('user-1', filters);

      expect(mockPrisma.project.findMany).toHaveBeenCalledWith({
        where: {
          ownerId: 'user-1',
          OR: [
            { name: { contains: 'тест', mode: 'insensitive' } },
            { description: { contains: 'тест', mode: 'insensitive' } },
          ],
          status: 'DRAFT',
        },
        include: {
          pages: {
            orderBy: { createdAt: 'desc' },
          },
          _count: {
            select: { pages: true },
          },
        },
        orderBy: { name: 'asc' },
      });
    });
  });

  describe('findOne', () => {
    test('должен возвращать проект по ID', async () => {
      const mockProject = {
        id: 'project-1',
        name: 'Тестовый проект',
        description: 'Описание',
        slug: 'test-project',
        type: 'WEBSITE',
        status: 'DRAFT',
        domain: null,
        customDomain: null,
        isPublished: false,
        settings: { theme: 'auto' },
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date('2024-01-02'),
        pages: [],
        _count: { pages: 0 },
      };

      mockPrisma.project.findUnique.mockResolvedValue(mockProject);

      const result = await ProjectService.findOne('project-1');

      expect(mockPrisma.project.findUnique).toHaveBeenCalledWith({
        where: { id: 'project-1' },
        include: {
          pages: {
            orderBy: { createdAt: 'desc' },
          },
          _count: {
            select: { pages: true },
          },
        },
      });

      expect(result).toMatchObject({
        id: 'project-1',
        name: 'Тестовый проект',
      });
    });

    test('должен возвращать null если проект не найден', async () => {
      mockPrisma.project.findUnique.mockResolvedValue(null);

      const result = await ProjectService.findOne('nonexistent');

      expect(result).toBeNull();
    });
  });

  describe('create', () => {
    test('должен создавать новый проект с домашней страницей', async () => {
      const projectData = {
        name: 'Новый проект',
        description: 'Описание нового проекта',
        ownerId: 'user-1',
      };

      const mockCreatedProject = {
        id: 'project-1',
        name: 'Новый проект',
        description: 'Описание нового проекта',
        slug: 'novyj-proekt',
        type: 'WEBSITE',
        status: 'DRAFT',
        domain: null,
        customDomain: null,
        isPublished: false,
        settings: { theme: 'auto', language: 'ru', creationType: 'manual' },
        createdAt: new Date(),
        updatedAt: new Date(),
        pages: [],
      };

      mockPrisma.project.findUnique.mockResolvedValue(null); // slug не существует
      mockPrisma.project.create.mockResolvedValue(mockCreatedProject);
      mockPrisma.page.create.mockResolvedValue({});

      const result = await ProjectService.create(projectData);

      expect(mockPrisma.project.create).toHaveBeenCalledWith({
        data: {
          name: 'Новый проект',
          description: 'Описание нового проекта',
          slug: expect.any(String),
          type: 'WEBSITE',
          domain: undefined,
          customDomain: undefined,
          ownerId: 'user-1',
          status: 'DRAFT',
          settings: {
            theme: 'auto',
            language: 'ru',
            creationType: 'manual',
          },
        },
        include: {
          pages: true,
        },
      });

      expect(mockPrisma.page.create).toHaveBeenCalledWith({
        data: {
          title: 'Главная',
          slug: '/',
          projectId: 'project-1',
          isHomePage: true,
          status: 'DRAFT',
          content: {
            blocks: [
              {
                type: 'heading',
                data: {
                  text: 'Добро пожаловать на Новый проект',
                  level: 1,
                },
              },
              {
                type: 'paragraph',
                data: {
                  text: 'Это ваша новая домашняя страница. Начните редактирование!',
                },
              },
            ],
          },
        },
      });

      expect(result).toMatchObject({
        id: 'project-1',
        name: 'Новый проект',
      });
    });

    test('должен выбрасывать ошибку если slug уже существует', async () => {
      const projectData = {
        name: 'Существующий проект',
        slug: 'existing-project',
        ownerId: 'user-1',
      };

      mockPrisma.project.findUnique.mockResolvedValue({ id: 'existing' });

      await expect(ProjectService.create(projectData)).rejects.toThrow('Проект с таким названием уже существует');
    });
  });

  describe('update', () => {
    test('должен обновлять проект', async () => {
      const updateData = {
        name: 'Обновленное название',
        description: 'Новое описание',
      };

      const mockUpdatedProject = {
        id: 'project-1',
        name: 'Обновленное название',
        description: 'Новое описание',
        slug: 'test-project',
        type: 'WEBSITE',
        status: 'DRAFT',
        domain: null,
        customDomain: null,
        isPublished: false,
        settings: { theme: 'auto' },
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date(),
      };

      mockPrisma.project.update.mockResolvedValue(mockUpdatedProject);

      const result = await ProjectService.update('project-1', updateData);

      expect(mockPrisma.project.update).toHaveBeenCalledWith({
        where: { id: 'project-1' },
        data: {
          ...updateData,
          updatedAt: expect.any(Date),
        },
      });

      expect(result).toMatchObject({
        id: 'project-1',
        name: 'Обновленное название',
      });
    });
  });

  describe('delete', () => {
    test('должен удалять проект и все его страницы', async () => {
      mockPrisma.page.deleteMany.mockResolvedValue({ count: 3 });
      mockPrisma.project.delete.mockResolvedValue({});

      const result = await ProjectService.delete('project-1');

      expect(mockPrisma.page.deleteMany).toHaveBeenCalledWith({
        where: { projectId: 'project-1' },
      });

      expect(mockPrisma.project.delete).toHaveBeenCalledWith({
        where: { id: 'project-1' },
      });

      expect(result).toEqual({ success: true });
    });
  });

  describe('publish', () => {
    test('должен публиковать проект', async () => {
      const mockPublishedProject = {
        id: 'project-1',
        isPublished: true,
        status: 'PUBLISHED',
        updatedAt: new Date(),
      };

      mockPrisma.project.update.mockResolvedValue(mockPublishedProject);

      const result = await ProjectService.publish('project-1');

      expect(mockPrisma.project.update).toHaveBeenCalledWith({
        where: { id: 'project-1' },
        data: {
          isPublished: true,
          status: 'PUBLISHED',
          updatedAt: expect.any(Date),
        },
      });

      expect(result).toMatchObject({
        id: 'project-1',
        isPublished: true,
        status: 'PUBLISHED',
      });
    });
  });

  describe('getStatistics', () => {
    test('должен возвращать статистику проектов', async () => {
      mockPrisma.project.count
        .mockResolvedValueOnce(10) // totalProjects
        .mockResolvedValueOnce(5) // publishedProjects
        .mockResolvedValueOnce(5); // draftProjects

      mockPrisma.page.count.mockResolvedValue(25); // totalPages

      const result = await ProjectService.getStatistics('user-1');

      expect(result).toEqual({
        totalProjects: 10,
        publishedProjects: 5,
        draftProjects: 5,
        totalPages: 25,
        averagePagesPerProject: 3,
      });
    });

    test('должен обрабатывать случай когда нет проектов', async () => {
      mockPrisma.project.count
        .mockResolvedValueOnce(0) // totalProjects
        .mockResolvedValueOnce(0) // publishedProjects
        .mockResolvedValueOnce(0); // draftProjects

      mockPrisma.page.count.mockResolvedValue(0); // totalPages

      const result = await ProjectService.getStatistics('user-1');

      expect(result).toEqual({
        totalProjects: 0,
        publishedProjects: 0,
        draftProjects: 0,
        totalPages: 0,
        averagePagesPerProject: 0,
      });
    });
  });
});
