import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import UserService from '../services/UserService';

// Мокаем зависимости
vi.mock('@prisma/client');
vi.mock('bcryptjs');
vi.mock('jsonwebtoken');

const mockPrisma = {
  user: {
    findMany: vi.fn(),
    findUnique: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
    delete: vi.fn(),
    count: vi.fn()
  }
};

(PrismaClient as vi.MockedClass<typeof PrismaClient>).mockImplementation(() => mockPrisma as any);

describe('UserService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('findMany', () => {
    it('должен вернуть список пользователей с фильтрами', async () => {
      const mockUsers = [
        {
          id: '1',
          email: 'test1@example.com',
          firstName: 'Test1',
          lastName: 'User1',
          role: 'USER',
          isActive: true,
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          id: '2',
          email: 'test2@example.com',
          firstName: 'Test2',
          lastName: 'User2',
          role: 'ADMIN',
          isActive: true,
          createdAt: new Date(),
          updatedAt: new Date()
        }
      ];

      mockPrisma.user.findMany.mockResolvedValue(mockUsers);
      mockPrisma.user.count.mockResolvedValue(2);

      const result = await UserService.findMany({
        role: 'USER',
        isActive: true,
        page: 1,
        limit: 10
      });

      expect(mockPrisma.user.findMany).toHaveBeenCalledWith({
        where: {
          role: 'USER',
          isActive: true
        },
        skip: 0,
        take: 10,
        orderBy: { createdAt: 'desc' }
      });
      expect(result).toEqual({
        users: mockUsers,
        total: 2,
        page: 1,
        limit: 10,
        totalPages: 1
      });
    });

    it('должен вернуть пустой список если пользователи не найдены', async () => {
      mockPrisma.user.findMany.mockResolvedValue([]);
      mockPrisma.user.count.mockResolvedValue(0);

      const result = await UserService.findMany();

      expect(result).toEqual({
        users: [],
        total: 0,
        page: 1,
        limit: 10,
        totalPages: 0
      });
    });
  });

  describe('findOne', () => {
    it('должен вернуть пользователя по ID', async () => {
      const mockUser = {
        id: '1',
        email: 'test@example.com',
        firstName: 'Test',
        lastName: 'User',
        role: 'USER',
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
      };

      mockPrisma.user.findUnique.mockResolvedValue(mockUser);

      const result = await UserService.findOne('1');

      expect(mockPrisma.user.findUnique).toHaveBeenCalledWith({
        where: { id: '1' }
      });
      expect(result).toEqual(mockUser);
    });

    it('должен вернуть null если пользователь не найден', async () => {
      mockPrisma.user.findUnique.mockResolvedValue(null);

      const result = await UserService.findOne('999');

      expect(result).toBeNull();
    });
  });

  describe('findByEmail', () => {
    it('должен вернуть пользователя по email', async () => {
      const mockUser = {
        id: '1',
        email: 'test@example.com',
        firstName: 'Test',
        lastName: 'User',
        role: 'USER',
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
      };

      mockPrisma.user.findUnique.mockResolvedValue(mockUser);

      const result = await UserService.findByEmail('test@example.com');

      expect(mockPrisma.user.findUnique).toHaveBeenCalledWith({
        where: { email: 'test@example.com' }
      });
      expect(result).toEqual(mockUser);
    });
  });

  describe('create', () => {
    it('должен создать нового пользователя', async () => {
      const mockUser = {
        id: '1',
        email: 'new@example.com',
        firstName: 'New',
        lastName: 'User',
        role: 'USER',
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
      };

      const hashedPassword = 'hashedPassword123';
      (bcrypt.hash as vi.Mock).mockResolvedValue(hashedPassword);
      mockPrisma.user.create.mockResolvedValue(mockUser);

      const result = await UserService.create({
        email: 'new@example.com',
        password: 'password123',
        firstName: 'New',
        lastName: 'User',
        role: 'USER'
      });

      expect(bcrypt.hash).toHaveBeenCalledWith('password123', 12);
      expect(mockPrisma.user.create).toHaveBeenCalledWith({
        data: {
          email: 'new@example.com',
          password: hashedPassword,
          firstName: 'New',
          lastName: 'User',
          role: 'USER'
        }
      });
      expect(result).toEqual(mockUser);
    });
  });

  describe('register', () => {
    it('должен зарегистрировать нового пользователя и вернуть токены', async () => {
      const mockUser = {
        id: '1',
        email: 'new@example.com',
        firstName: 'New',
        lastName: 'User',
        role: 'USER',
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
      };

      const hashedPassword = 'hashedPassword123';
      const mockToken = 'mock-jwt-token';
      const mockRefreshToken = 'mock-refresh-token';

      (bcrypt.hash as vi.Mock).mockResolvedValue(hashedPassword);
      (jwt.sign as vi.Mock).mockReturnValue(mockToken);
      mockPrisma.user.create.mockResolvedValue(mockUser);

      const result = await UserService.register({
        email: 'new@example.com',
        password: 'password123',
        firstName: 'New',
        lastName: 'User'
      });

      expect(result).toEqual({
        user: {
          id: '1',
          email: 'new@example.com',
          firstName: 'New',
          lastName: 'User',
          role: 'USER',
          fullName: 'New User'
        },
        token: mockToken,
        refreshToken: mockRefreshToken
      });
    });

    it('должен выбросить ошибку если пользователь с таким email уже существует', async () => {
      mockPrisma.user.findUnique.mockResolvedValue({
        id: '1',
        email: 'existing@example.com'
      });

      await expect(UserService.register({
        email: 'existing@example.com',
        password: 'password123',
        firstName: 'Test',
        lastName: 'User'
      })).rejects.toThrow('Пользователь с таким email уже существует');
    });
  });

  describe('login', () => {
    it('должен успешно авторизовать пользователя', async () => {
      const mockUser = {
        id: '1',
        email: 'test@example.com',
        firstName: 'Test',
        lastName: 'User',
        role: 'USER',
        password: 'hashedPassword123',
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
      };

      const mockToken = 'mock-jwt-token';
      const mockRefreshToken = 'mock-refresh-token';

      mockPrisma.user.findUnique.mockResolvedValue(mockUser);
      (bcrypt.compare as vi.Mock).mockResolvedValue(true);
      (jwt.sign as vi.Mock).mockReturnValue(mockToken);

      const result = await UserService.login({
        email: 'test@example.com',
        password: 'password123'
      });

      expect(result).toEqual({
        user: {
          id: '1',
          email: 'test@example.com',
          firstName: 'Test',
          lastName: 'User',
          role: 'USER',
          fullName: 'Test User'
        },
        token: mockToken,
        refreshToken: mockRefreshToken
      });
    });

    it('должен выбросить ошибку если пользователь не найден', async () => {
      mockPrisma.user.findUnique.mockResolvedValue(null);

      await expect(UserService.login({
        email: 'nonexistent@example.com',
        password: 'password123'
      })).rejects.toThrow('Неверные учетные данные');
    });

    it('должен выбросить ошибку если пароль неверный', async () => {
      const mockUser = {
        id: '1',
        email: 'test@example.com',
        password: 'hashedPassword123'
      };

      mockPrisma.user.findUnique.mockResolvedValue(mockUser);
      (bcrypt.compare as vi.Mock).mockResolvedValue(false);

      await expect(UserService.login({
        email: 'test@example.com',
        password: 'wrongpassword'
      })).rejects.toThrow('Неверные учетные данные');
    });

    it('должен выбросить ошибку если пользователь неактивен', async () => {
      const mockUser = {
        id: '1',
        email: 'test@example.com',
        password: 'hashedPassword123',
        isActive: false
      };

      mockPrisma.user.findUnique.mockResolvedValue(mockUser);
      (bcrypt.compare as vi.Mock).mockResolvedValue(true);

      await expect(UserService.login({
        email: 'test@example.com',
        password: 'password123'
      })).rejects.toThrow('Аккаунт деактивирован');
    });
  });

  describe('update', () => {
    it('должен обновить пользователя', async () => {
      const mockUser = {
        id: '1',
        email: 'test@example.com',
        firstName: 'Updated',
        lastName: 'User',
        role: 'USER',
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
      };

      mockPrisma.user.update.mockResolvedValue(mockUser);

      const result = await UserService.update('1', {
        firstName: 'Updated',
        lastName: 'User'
      });

      expect(mockPrisma.user.update).toHaveBeenCalledWith({
        where: { id: '1' },
        data: {
          firstName: 'Updated',
          lastName: 'User'
        }
      });
      expect(result).toEqual(mockUser);
    });
  });

  describe('changePassword', () => {
    it('должен успешно изменить пароль', async () => {
      const mockUser = {
        id: '1',
        password: 'oldHashedPassword'
      };

      const newHashedPassword = 'newHashedPassword';

      mockPrisma.user.findUnique.mockResolvedValue(mockUser);
      (bcrypt.compare as vi.Mock).mockResolvedValue(true);
      (bcrypt.hash as vi.Mock).mockResolvedValue(newHashedPassword);
      mockPrisma.user.update.mockResolvedValue({ ...mockUser, password: newHashedPassword });

      const result = await UserService.changePassword('1', 'oldPassword', 'newPassword');

      expect(bcrypt.compare).toHaveBeenCalledWith('oldPassword', 'oldHashedPassword');
      expect(bcrypt.hash).toHaveBeenCalledWith('newPassword', 12);
      expect(mockPrisma.user.update).toHaveBeenCalledWith({
        where: { id: '1' },
        data: { password: newHashedPassword }
      });
      expect(result).toBe(true);
    });

    it('должен выбросить ошибку если текущий пароль неверный', async () => {
      const mockUser = {
        id: '1',
        password: 'oldHashedPassword'
      };

      mockPrisma.user.findUnique.mockResolvedValue(mockUser);
      (bcrypt.compare as vi.Mock).mockResolvedValue(false);

      await expect(UserService.changePassword('1', 'wrongPassword', 'newPassword'))
        .rejects.toThrow('Неверный текущий пароль');
    });
  });

  describe('deactivate', () => {
    it('должен деактивировать пользователя', async () => {
      const mockUser = {
        id: '1',
        isActive: false
      };

      mockPrisma.user.update.mockResolvedValue(mockUser);

      const result = await UserService.deactivate('1');

      expect(mockPrisma.user.update).toHaveBeenCalledWith({
        where: { id: '1' },
        data: { isActive: false }
      });
      expect(result).toEqual(mockUser);
    });
  });

  describe('activate', () => {
    it('должен активировать пользователя', async () => {
      const mockUser = {
        id: '1',
        isActive: true
      };

      mockPrisma.user.update.mockResolvedValue(mockUser);

      const result = await UserService.activate('1');

      expect(mockPrisma.user.update).toHaveBeenCalledWith({
        where: { id: '1' },
        data: { isActive: true }
      });
      expect(result).toEqual(mockUser);
    });
  });

  describe('delete', () => {
    it('должен удалить пользователя', async () => {
      const mockUser = {
        id: '1',
        email: 'test@example.com'
      };

      mockPrisma.user.delete.mockResolvedValue(mockUser);

      const result = await UserService.delete('1');

      expect(mockPrisma.user.delete).toHaveBeenCalledWith({
        where: { id: '1' }
      });
      expect(result).toEqual(mockUser);
    });
  });

  describe('getStatistics', () => {
    it('должен вернуть статистику пользователей', async () => {
      mockPrisma.user.count.mockResolvedValue(100);
      mockPrisma.user.findMany.mockResolvedValue([
        {
          id: '1',
          email: 'recent@example.com',
          createdAt: new Date()
        }
      ]);

      const result = await UserService.getStatistics();

      expect(mockPrisma.user.count).toHaveBeenCalledWith({
        where: { isActive: true }
      });
      expect(mockPrisma.user.findMany).toHaveBeenCalledWith({
        where: { isActive: true },
        take: 5,
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          email: true,
          firstName: true,
          lastName: true,
          role: true,
          createdAt: true
        }
      });
      expect(result).toEqual({
        total: 100,
        recentUsers: [
          {
            id: '1',
            email: 'recent@example.com',
            firstName: null,
            lastName: null,
            role: 'USER',
            createdAt: expect.any(Date)
          }
        ]
      });
    });
  });

  describe('verifyToken', () => {
    it('должен успешно проверить токен', async () => {
      const mockUser = {
        id: '1',
        email: 'test@example.com',
        firstName: 'Test',
        lastName: 'User',
        role: 'USER',
        isActive: true
      };

      const mockDecoded = { userId: '1' };

      (jwt.verify as vi.Mock).mockReturnValue(mockDecoded);
      mockPrisma.user.findUnique.mockResolvedValue(mockUser);

      const result = await UserService.verifyToken('valid-token');

      expect(jwt.verify).toHaveBeenCalledWith('valid-token', process.env.JWT_SECRET);
      expect(mockPrisma.user.findUnique).toHaveBeenCalledWith({
        where: { id: '1' }
      });
      expect(result).toEqual({
        id: '1',
        email: 'test@example.com',
        firstName: 'Test',
        lastName: 'User',
        role: 'USER',
        fullName: 'Test User'
      });
    });

    it('должен выбросить ошибку при невалидном токене', async () => {
      (jwt.verify as vi.Mock).mockImplementation(() => {
        throw new Error('Invalid token');
      });

      await expect(UserService.verifyToken('invalid-token'))
        .rejects.toThrow('Invalid token');
    });
  });
}); 