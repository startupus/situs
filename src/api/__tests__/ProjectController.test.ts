import { Request, Response } from 'express';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import ProjectController from '../controllers/ProjectController';
import ProjectService from '../services/ProjectService';

// Мокаем ProjectService
vi.mock('../services/ProjectService');

describe('ProjectController', () => {
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let mockProjectService: any;

  beforeEach(() => {
    mockRequest = {
      body: {},
      params: {},
      query: {},
      user: { id: '1', userId: '1', email: 'test@example.com', fullName: 'Test User', role: 'USER', isActive: true }
    };

    mockResponse = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn().mockReturnThis(),
      send: vi.fn().mockReturnThis()
    };

    mockProjectService = ProjectService;
  });

  describe('find', () => {
    it('должен успешно получить список проектов', async () => {
      const mockProjects = [
        {
          id: '1',
          name: 'Test Project',
          description: 'Test Description',
          type: 'WEBSITE',
          status: 'DRAFT'
        }
      ];

      mockRequest.query = {
        search: 'test',
        status: 'DRAFT',
        sortBy: 'name',
        sortOrder: 'asc'
      };

      mockProjectService.findMany = vi.fn().mockResolvedValue(mockProjects);

      await ProjectController.find(mockRequest as Request, mockResponse as Response);

      expect(mockProjectService.findMany).toHaveBeenCalledWith('1', {
        search: 'test',
        status: 'DRAFT',
        sortBy: 'name',
        sortOrder: 'asc'
      });
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith({
        data: mockProjects,
        meta: {
          total: mockProjects.length
        }
      });
    });

    it('должен обработать ошибку при получении проектов', async () => {
      mockProjectService.findMany = vi.fn().mockRejectedValue(new Error('Ошибка базы данных'));

      await ProjectController.find(mockRequest as Request, mockResponse as Response);

      expect(mockResponse.status).toHaveBeenCalledWith(500);
      expect(mockResponse.json).toHaveBeenCalledWith({
        error: {
          status: 500,
          name: 'InternalServerError',
          message: 'Внутренняя ошибка сервера'
        }
      });
    });
  });

  describe('findOne', () => {
    it('должен успешно получить проект по ID', async () => {
      const mockProject = {
        id: '1',
        name: 'Test Project',
        description: 'Test Description',
        type: 'WEBSITE',
        status: 'DRAFT'
      };

      mockRequest.params = { id: '1' };

      mockProjectService.findOne = vi.fn().mockResolvedValue(mockProject);

      await ProjectController.findOne(mockRequest as Request, mockResponse as Response);

      expect(mockProjectService.findOne).toHaveBeenCalledWith('1');
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith({
        data: mockProject
      });
    });

    it('должен вернуть 404 если проект не найден', async () => {
      mockRequest.params = { id: '999' };

      mockProjectService.findOne = vi.fn().mockResolvedValue(null);

      await ProjectController.findOne(mockRequest as Request, mockResponse as Response);

      expect(mockResponse.status).toHaveBeenCalledWith(404);
      expect(mockResponse.json).toHaveBeenCalledWith({
        error: {
          status: 404,
          name: 'NotFoundError',
          message: 'Проект не найден'
        }
      });
    });
  });

  describe('create', () => {
    it('должен успешно создать новый проект', async () => {
      const mockProject = {
        id: '1',
        name: 'New Project',
        description: 'Test description',
        type: 'WEBSITE',
        status: 'DRAFT'
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
        slug: undefined,
        domain: undefined,
        customDomain: undefined,
        settings: undefined,
        ownerId: '1'
      });
      expect(mockResponse.status).toHaveBeenCalledWith(201);
      expect(mockResponse.json).toHaveBeenCalledWith({
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
        error: {
          status: 400,
          name: 'ValidationError',
          message: 'Название проекта обязательно'
        }
      });
    });
  });

  describe('update', () => {
    it('должен успешно обновить проект', async () => {
      const mockProject = {
        id: '1',
        name: 'Updated Project',
        description: 'Updated description',
        type: 'WEBSITE',
        status: 'DRAFT'
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
        description: 'Updated description',
        slug: undefined,
        domain: undefined,
        customDomain: undefined,
        settings: undefined,
        status: undefined,
        type: undefined,
        isPublished: undefined
      });
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith({
        data: mockProject
      });
    });

    it('должен вернуть 404 если проект не найден', async () => {
      mockRequest.params = { id: '999' };
      mockRequest.body = {
        name: 'Updated Project'
      };

      mockProjectService.update = vi.fn().mockResolvedValue(null);

      await ProjectController.update(mockRequest as Request, mockResponse as Response);

      expect(mockResponse.status).toHaveBeenCalledWith(404);
      expect(mockResponse.json).toHaveBeenCalledWith({
        error: {
          status: 404,
          name: 'NotFoundError',
          message: 'Проект не найден'
        }
      });
    });
  });

  describe('delete', () => {
    it('должен успешно удалить проект', async () => {
      const mockProject = { id: '1' };

      mockRequest.params = { id: '1' };

      mockProjectService.delete = vi.fn().mockResolvedValue(mockProject);

      await ProjectController.delete(mockRequest as Request, mockResponse as Response);

      expect(mockProjectService.delete).toHaveBeenCalledWith('1');
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith({
        data: mockProject
      });
    });

    it('должен вернуть 404 если проект не найден', async () => {
      mockRequest.params = { id: '999' };

      mockProjectService.delete = vi.fn().mockResolvedValue(null);

      await ProjectController.delete(mockRequest as Request, mockResponse as Response);

      expect(mockResponse.status).toHaveBeenCalledWith(404);
      expect(mockResponse.json).toHaveBeenCalledWith({
        error: {
          status: 404,
          name: 'NotFoundError',
          message: 'Проект не найден'
        }
      });
    });
  });

  describe('publish', () => {
    it('должен успешно опубликовать проект', async () => {
      const mockProject = {
        id: '1',
        name: 'Test Project',
        status: 'PUBLISHED'
      };

      mockRequest.params = { id: '1' };

      mockProjectService.publish = vi.fn().mockResolvedValue(mockProject);

      await ProjectController.publish(mockRequest as Request, mockResponse as Response);

      expect(mockProjectService.publish).toHaveBeenCalledWith('1');
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith({
        data: mockProject
      });
    });

    it('должен вернуть 404 если проект не найден', async () => {
      mockRequest.params = { id: '999' };

      mockProjectService.publish = vi.fn().mockResolvedValue(null);

      await ProjectController.publish(mockRequest as Request, mockResponse as Response);

      expect(mockResponse.status).toHaveBeenCalledWith(404);
      expect(mockResponse.json).toHaveBeenCalledWith({
        error: {
          status: 404,
          name: 'NotFoundError',
          message: 'Проект не найден'
        }
      });
    });
  });

  describe('unpublish', () => {
    it('должен успешно снять проект с публикации', async () => {
      const mockProject = {
        id: '1',
        name: 'Test Project',
        status: 'DRAFT'
      };

      mockRequest.params = { id: '1' };

      mockProjectService.unpublish = vi.fn().mockResolvedValue(mockProject);

      await ProjectController.unpublish(mockRequest as Request, mockResponse as Response);

      expect(mockProjectService.unpublish).toHaveBeenCalledWith('1');
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith({
        data: mockProject
      });
    });

    it('должен вернуть 404 если проект не найден', async () => {
      mockRequest.params = { id: '999' };

      mockProjectService.unpublish = vi.fn().mockResolvedValue(null);

      await ProjectController.unpublish(mockRequest as Request, mockResponse as Response);

      expect(mockResponse.status).toHaveBeenCalledWith(404);
      expect(mockResponse.json).toHaveBeenCalledWith({
        error: {
          status: 404,
          name: 'NotFoundError',
          message: 'Проект не найден'
        }
      });
    });
  });

  describe('getStatistics', () => {
    it('должен успешно получить статистику проектов', async () => {
      const mockStats = {
        total: 10,
        published: 5,
        draft: 3,
        archived: 2
      };

      mockProjectService.getStatistics = vi.fn().mockResolvedValue(mockStats);

      await ProjectController.getStatistics(mockRequest as Request, mockResponse as Response);

      expect(mockProjectService.getStatistics).toHaveBeenCalledWith('1');
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith({
        data: mockStats
      });
    });
  });
}); 