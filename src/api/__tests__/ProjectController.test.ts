import { Request, Response } from 'express';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import ProjectController from '../controllers/ProjectController';
import ProjectService from '../services/ProjectService';

// Мокаем ProjectService
vi.mock('../services/ProjectService');

describe('ProjectController', () => {
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let mockProjectService: vi.Mocked<ProjectService>;

  beforeEach(() => {
    mockRequest = {
      body: {},
      params: {},
      query: {},
      user: { id: '1', email: 'test@example.com' }
    };

    mockResponse = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn().mockReturnThis(),
      send: vi.fn().mockReturnThis()
    };

    mockProjectService = ProjectService as vi.Mocked<ProjectService>;
  });

  describe('find', () => {
    it('должен успешно получить список проектов', async () => {
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

      mockRequest.query = { page: '1', limit: '10' };
      mockProjectService.findMany = vi.fn().mockResolvedValue({
        projects: mockProjects,
        total: 2,
        page: 1,
        limit: 10,
        totalPages: 1
      });

      await ProjectController.find(mockRequest as Request, mockResponse as Response);

      expect(mockProjectService.findMany).toHaveBeenCalledWith({
        userId: '1',
        page: 1,
        limit: 10
      });
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: true,
        data: {
          projects: mockProjects,
          total: 2,
          page: 1,
          limit: 10,
          totalPages: 1
        }
      });
    });

    it('должен обработать ошибку при получении проектов', async () => {
      mockRequest.query = { page: '1', limit: '10' };
      mockProjectService.findMany = vi.fn().mockRejectedValue(new Error('Ошибка базы данных'));

      await ProjectController.find(mockRequest as Request, mockResponse as Response);

      expect(mockResponse.status).toHaveBeenCalledWith(500);
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: false,
        error: 'Ошибка базы данных'
      });
    });
  });

  describe('findOne', () => {
    it('должен успешно получить проект по ID', async () => {
      const mockProject = {
        id: '1',
        name: 'Test Project',
        slug: 'test-project',
        status: 'DRAFT',
        userId: '1',
        createdAt: new Date(),
        updatedAt: new Date()
      };

      mockRequest.params = { id: '1' };
      mockProjectService.findOne = vi.fn().mockResolvedValue(mockProject);

      await ProjectController.findOne(mockRequest as Request, mockResponse as Response);

      expect(mockProjectService.findOne).toHaveBeenCalledWith('1', '1');
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: true,
        data: mockProject
      });
    });

    it('должен вернуть 404 если проект не найден', async () => {
      mockRequest.params = { id: '999' };
      mockProjectService.findOne = vi.fn().mockResolvedValue(null);

      await ProjectController.findOne(mockRequest as Request, mockResponse as Response);

      expect(mockResponse.status).toHaveBeenCalledWith(404);
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: false,
        error: 'Проект не найден'
      });
    });
  });

  describe('create', () => {
    it('должен успешно создать новый проект', async () => {
      const mockProject = {
        id: '1',
        name: 'New Project',
        slug: 'new-project',
        status: 'DRAFT',
        userId: '1',
        createdAt: new Date(),
        updatedAt: new Date()
      };

      mockRequest.body = {
        name: 'New Project',
        description: 'Test description',
        type: 'WEBSITE'
      };

      mockProjectService.create = vi.fn().mockResolvedValue(mockProject);

      await ProjectController.create(mockRequest as Request, mockResponse as Response);

      expect(mockProjectService.create).toHaveBeenCalledWith({
        name: 'New Project',
        description: 'Test description',
        type: 'WEBSITE',
        userId: '1'
      });
      expect(mockResponse.status).toHaveBeenCalledWith(201);
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: true,
        data: mockProject
      });
    });

    it('должен вернуть ошибку при отсутствии обязательных полей', async () => {
      mockRequest.body = {
        description: 'Test description'
        // name отсутствует
      };

      await ProjectController.create(mockRequest as Request, mockResponse as Response);

      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: false,
        error: 'Название проекта обязательно'
      });
    });
  });

  describe('update', () => {
    it('должен успешно обновить проект', async () => {
      const mockProject = {
        id: '1',
        name: 'Updated Project',
        slug: 'updated-project',
        status: 'DRAFT',
        userId: '1',
        createdAt: new Date(),
        updatedAt: new Date()
      };

      mockRequest.params = { id: '1' };
      mockRequest.body = {
        name: 'Updated Project',
        description: 'Updated description'
      };

      mockProjectService.update = vi.fn().mockResolvedValue(mockProject);

      await ProjectController.update(mockRequest as Request, mockResponse as Response);

      expect(mockProjectService.update).toHaveBeenCalledWith('1', {
        name: 'Updated Project',
        description: 'Updated description'
      }, '1');
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: true,
        data: mockProject
      });
    });

    it('должен вернуть 404 если проект не найден', async () => {
      mockRequest.params = { id: '999' };
      mockRequest.body = { name: 'Updated Project' };

      mockProjectService.update = vi.fn().mockResolvedValue(null);

      await ProjectController.update(mockRequest as Request, mockResponse as Response);

      expect(mockResponse.status).toHaveBeenCalledWith(404);
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: false,
        error: 'Проект не найден'
      });
    });
  });

  describe('delete', () => {
    it('должен успешно удалить проект', async () => {
      mockRequest.params = { id: '1' };
      mockProjectService.delete = vi.fn().mockResolvedValue(true);

      await ProjectController.delete(mockRequest as Request, mockResponse as Response);

      expect(mockProjectService.delete).toHaveBeenCalledWith('1', '1');
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: true,
        message: 'Проект успешно удален'
      });
    });

    it('должен вернуть 404 если проект не найден', async () => {
      mockRequest.params = { id: '999' };
      mockProjectService.delete = vi.fn().mockResolvedValue(false);

      await ProjectController.delete(mockRequest as Request, mockResponse as Response);

      expect(mockResponse.status).toHaveBeenCalledWith(404);
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: false,
        error: 'Проект не найден'
      });
    });
  });

  describe('publish', () => {
    it('должен успешно опубликовать проект', async () => {
      const mockProject = {
        id: '1',
        name: 'Test Project',
        slug: 'test-project',
        status: 'PUBLISHED',
        userId: '1',
        createdAt: new Date(),
        updatedAt: new Date()
      };

      mockRequest.params = { id: '1' };
      mockProjectService.publish = vi.fn().mockResolvedValue(mockProject);

      await ProjectController.publish(mockRequest as Request, mockResponse as Response);

      expect(mockProjectService.publish).toHaveBeenCalledWith('1', '1');
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: true,
        data: mockProject
      });
    });

    it('должен вернуть 404 если проект не найден', async () => {
      mockRequest.params = { id: '999' };
      mockProjectService.publish = vi.fn().mockResolvedValue(null);

      await ProjectController.publish(mockRequest as Request, mockResponse as Response);

      expect(mockResponse.status).toHaveBeenCalledWith(404);
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: false,
        error: 'Проект не найден'
      });
    });
  });

  describe('unpublish', () => {
    it('должен успешно снять проект с публикации', async () => {
      const mockProject = {
        id: '1',
        name: 'Test Project',
        slug: 'test-project',
        status: 'DRAFT',
        userId: '1',
        createdAt: new Date(),
        updatedAt: new Date()
      };

      mockRequest.params = { id: '1' };
      mockProjectService.unpublish = vi.fn().mockResolvedValue(mockProject);

      await ProjectController.unpublish(mockRequest as Request, mockResponse as Response);

      expect(mockProjectService.unpublish).toHaveBeenCalledWith('1', '1');
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: true,
        data: mockProject
      });
    });

    it('должен вернуть 404 если проект не найден', async () => {
      mockRequest.params = { id: '999' };
      mockProjectService.unpublish = vi.fn().mockResolvedValue(null);

      await ProjectController.unpublish(mockRequest as Request, mockResponse as Response);

      expect(mockResponse.status).toHaveBeenCalledWith(404);
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: false,
        error: 'Проект не найден'
      });
    });
  });

  describe('getStatistics', () => {
    it('должен успешно получить статистику проектов', async () => {
      const mockStats = {
        total: 10,
        published: 5,
        draft: 3,
        archived: 2,
        recentProjects: [
          {
            id: '1',
            name: 'Recent Project',
            status: 'PUBLISHED',
            updatedAt: new Date()
          }
        ]
      };

      mockProjectService.getStatistics = vi.fn().mockResolvedValue(mockStats);

      await ProjectController.getStatistics(mockRequest as Request, mockResponse as Response);

      expect(mockProjectService.getStatistics).toHaveBeenCalledWith('1');
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: true,
        data: mockStats
      });
    });
  });
}); 