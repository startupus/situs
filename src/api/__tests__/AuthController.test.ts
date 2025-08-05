import { Request, Response } from 'express';
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
        success: true,
        data: mockLoginResult
      });
    });

    it('должен вернуть ошибку при невалидных данных', async () => {
      mockRequest.body = {
        email: 'invalid@example.com',
        password: 'wrongpassword'
      };

      mockUserService.login = vi.fn().mockRejectedValue(new Error('Неверные учетные данные'));

      await AuthController.login(mockRequest as Request, mockResponse as Response);

      expect(mockResponse.status).toHaveBeenCalledWith(401);
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: false,
        error: 'Неверные учетные данные'
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
        success: false,
        error: 'Email и пароль обязательны'
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
        success: true,
        data: mockRegisterResult
      });
    });

    it('должен вернуть ошибку при регистрации с существующим email', async () => {
      mockRequest.body = {
        email: 'existing@example.com',
        password: 'password123',
        firstName: 'Test',
        lastName: 'User'
      };

      mockUserService.register = vi.fn().mockRejectedValue(new Error('Пользователь с таким email уже существует'));

      await AuthController.register(mockRequest as Request, mockResponse as Response);

      expect(mockResponse.status).toHaveBeenCalledWith(409);
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: false,
        error: 'Пользователь с таким email уже существует'
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

      mockRequest.body = {
        token: 'valid-jwt-token'
      };

      mockUserService.verifyToken = vi.fn().mockResolvedValue(mockUser);

      await AuthController.verifyToken(mockRequest as Request, mockResponse as Response);

      expect(mockUserService.verifyToken).toHaveBeenCalledWith('valid-jwt-token');
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: true,
        data: { user: mockUser }
      });
    });

    it('должен вернуть ошибку при невалидном токене', async () => {
      mockRequest.body = {
        token: 'invalid-jwt-token'
      };

      mockUserService.verifyToken = vi.fn().mockRejectedValue(new Error('Невалидный токен'));

      await AuthController.verifyToken(mockRequest as Request, mockResponse as Response);

      expect(mockResponse.status).toHaveBeenCalledWith(401);
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: false,
        error: 'Невалидный токен'
      });
    });
  });

  describe('refreshToken', () => {
    it('должен успешно обновить токен', async () => {
      const mockTokens = {
        token: 'new-jwt-token',
        refreshToken: 'new-refresh-token'
      };

      mockRequest.body = {
        refreshToken: 'old-refresh-token'
      };

      mockUserService.refreshToken = vi.fn().mockResolvedValue(mockTokens);

      await AuthController.refreshToken(mockRequest as Request, mockResponse as Response);

      expect(mockUserService.refreshToken).toHaveBeenCalledWith('old-refresh-token');
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: true,
        data: mockTokens
      });
    });
  });

  describe('logout', () => {
    it('должен успешно выполнить выход', async () => {
      mockRequest.body = {
        refreshToken: 'refresh-token-to-invalidate'
      };

      mockUserService.logout = vi.fn().mockResolvedValue(true);

      await AuthController.logout(mockRequest as Request, mockResponse as Response);

      expect(mockUserService.logout).toHaveBeenCalledWith('refresh-token-to-invalidate');
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: true,
        message: 'Выход выполнен успешно'
      });
    });
  });

  describe('forgotPassword', () => {
    it('должен успешно отправить email для сброса пароля', async () => {
      mockRequest.body = {
        email: 'test@example.com'
      };

      mockUserService.forgotPassword = vi.fn().mockResolvedValue(true);

      await AuthController.forgotPassword(mockRequest as Request, mockResponse as Response);

      expect(mockUserService.forgotPassword).toHaveBeenCalledWith('test@example.com');
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: true,
        message: 'Инструкции по сбросу пароля отправлены на email'
      });
    });
  });

  describe('resetPassword', () => {
    it('должен успешно сбросить пароль', async () => {
      mockRequest.body = {
        token: 'reset-token',
        newPassword: 'newpassword123'
      };

      mockUserService.resetPassword = vi.fn().mockResolvedValue(true);

      await AuthController.resetPassword(mockRequest as Request, mockResponse as Response);

      expect(mockUserService.resetPassword).toHaveBeenCalledWith('reset-token', 'newpassword123');
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: true,
        message: 'Пароль успешно изменен'
      });
    });
  });
}); 