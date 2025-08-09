import { Request, Response } from 'express';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import AuthController from '../controllers/AuthController';
import UserService from '../services/UserService';

// Мокаем UserService
vi.mock('../services/UserService');

describe('AuthController', () => {
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let mockUserService: any;

  beforeEach(() => {
    mockRequest = {
      body: {},
      headers: {},
      user: undefined
    };

    mockResponse = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn().mockReturnThis(),
      send: vi.fn().mockReturnThis()
    };

    mockUserService = UserService;
  });

  describe('login', () => {
    it('должен успешно авторизовать пользователя с валидными данными', async () => {
      const mockUser = {
        id: '1',
        email: 'test@example.com',
        firstName: 'Test',
        lastName: 'User',
        role: 'USER'
      };

      const mockLoginResult = {
        user: mockUser,
        token: 'mock-jwt-token',
        refreshToken: 'mock-refresh-token'
      };

      mockRequest.body = {
        email: 'test@example.com',
        password: 'password123'
      };

      mockUserService.login = vi.fn().mockResolvedValue(mockLoginResult);

      await AuthController.login(mockRequest as Request, mockResponse as Response);

      expect(mockUserService.login).toHaveBeenCalledWith({
        email: 'test@example.com',
        password: 'password123'
      });
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith({
        jwt: 'mock-jwt-token',
        user: mockUser
      });
    });

    it('должен вернуть ошибку при невалидных данных', async () => {
      mockRequest.body = {
        email: 'invalid@example.com',
        password: 'wrongpassword'
      };

      mockUserService.login = vi.fn().mockRejectedValue(new Error('Неверные учетные данные'));

      await AuthController.login(mockRequest as Request, mockResponse as Response);

      expect(mockResponse.status).toHaveBeenCalledWith(500);
      expect(mockResponse.json).toHaveBeenCalledWith({
        error: {
          status: 500,
          name: 'InternalServerError',
          message: 'Внутренняя ошибка сервера'
        }
      });
    });

    it('должен вернуть ошибку при отсутствии email или password', async () => {
      mockRequest.body = {
        email: 'test@example.com'
        // password отсутствует
      };

      await AuthController.login(mockRequest as Request, mockResponse as Response);

      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith({
        error: {
          status: 400,
          name: 'ValidationError',
          message: 'Email и пароль обязательны'
        }
      });
    });
  });

  describe('register', () => {
    it('должен успешно зарегистрировать нового пользователя', async () => {
      const mockUser = {
        id: '1',
        email: 'new@example.com',
        firstName: 'New',
        lastName: 'User',
        role: 'USER'
      };

      const mockRegisterResult = {
        user: mockUser,
        token: 'mock-jwt-token',
        refreshToken: 'mock-refresh-token'
      };

      mockRequest.body = {
        email: 'new@example.com',
        password: 'password123',
        firstName: 'New',
        lastName: 'User'
      };

      mockUserService.register = vi.fn().mockResolvedValue(mockRegisterResult);

      await AuthController.register(mockRequest as Request, mockResponse as Response);

      expect(mockUserService.register).toHaveBeenCalledWith({
        email: 'new@example.com',
        password: 'password123',
        firstName: 'New',
        lastName: 'User'
      });
      expect(mockResponse.status).toHaveBeenCalledWith(201);
      expect(mockResponse.json).toHaveBeenCalledWith({
        jwt: 'mock-jwt-token',
        user: mockUser
      });
    });

    it('должен вернуть ошибку при регистрации с существующим email', async () => {
      mockRequest.body = {
        email: 'existing@example.com',
        password: 'password123',
        firstName: 'Existing',
        lastName: 'User'
      };

      mockUserService.register = vi.fn().mockRejectedValue(new Error('Пользователь с таким email уже существует'));

      await AuthController.register(mockRequest as Request, mockResponse as Response);

      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith({
        error: {
          status: 400,
          name: 'ValidationError',
          message: 'Пользователь с таким email уже существует'
        }
      });
    });
  });

  describe('verifyToken', () => {
    it('должен успешно проверить валидный токен', async () => {
      const mockUser = {
        id: '1',
        email: 'test@example.com',
        firstName: 'Test',
        lastName: 'User',
        role: 'USER'
      };

      mockRequest.headers = {
        authorization: 'Bearer valid-jwt-token'
      };

      mockUserService.verifyToken = vi.fn().mockResolvedValue(mockUser);

      await AuthController.verifyToken(mockRequest as Request, mockResponse as Response);

      expect(mockUserService.verifyToken).toHaveBeenCalledWith('valid-jwt-token');
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith({
        user: mockUser,
        valid: true
      });
    });

    it('должен вернуть ошибку при невалидном токене', async () => {
      mockRequest.headers = {};

      await AuthController.verifyToken(mockRequest as Request, mockResponse as Response);

      expect(mockResponse.status).toHaveBeenCalledWith(401);
      expect(mockResponse.json).toHaveBeenCalledWith({
        error: {
          status: 401,
          name: 'UnauthorizedError',
          message: 'Токен не предоставлен'
        }
      });
    });
  });

  describe('refreshToken', () => {
    it('должен успешно обновить токен', async () => {
      const mockUser = {
        id: '1',
        email: 'test@example.com',
        firstName: 'Test',
        lastName: 'User',
        role: 'USER'
      };

      mockRequest.headers = {
        authorization: 'Bearer old-refresh-token'
      };

      mockUserService.verifyToken = vi.fn().mockResolvedValue(mockUser);
      mockUserService.generateToken = vi.fn().mockReturnValue('new-jwt-token');

      await AuthController.refreshToken(mockRequest as Request, mockResponse as Response);

      expect(mockUserService.verifyToken).toHaveBeenCalledWith('old-refresh-token');
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith({
        jwt: 'new-jwt-token',
        user: mockUser
      });
    });
  });

  describe('logout', () => {
    it('должен успешно выполнить выход', async () => {
      await AuthController.logout(mockRequest as Request, mockResponse as Response);

      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith({
        message: 'Выход выполнен успешно'
      });
    });
  });

  describe('forgotPassword', () => {
    it('должен успешно отправить email для сброса пароля', async () => {
      mockRequest.body = {
        email: 'test@example.com'
      };

      mockUserService.findByEmail = vi.fn().mockResolvedValue({ id: '1', email: 'test@example.com' });

      await AuthController.forgotPassword(mockRequest as Request, mockResponse as Response);

      expect(mockUserService.findByEmail).toHaveBeenCalledWith('test@example.com');
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveProperty('message');
    });
  });

  describe('resetPassword', () => {
    it('должен успешно сбросить пароль', async () => {
      mockRequest.body = {
        token: 'reset-token',
        password: 'newpassword123'
      };

      mockUserService.resetPassword = vi.fn().mockResolvedValue(true);

      await AuthController.resetPassword(mockRequest as Request, mockResponse as Response);

      expect(mockUserService.resetPassword).toHaveBeenCalledWith('reset-token', 'newpassword123');
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveProperty('message');
    });
  });
}); 