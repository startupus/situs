import { describe, it, expect, beforeEach, afterEach, beforeAll, afterAll, vi } from 'vitest';
import { PrismaClient } from '@prisma/client';
import UserService from '../../services/UserService';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

/**
 * UserService Unit Tests
 * Комплексное тестирование бизнес-логики пользователей
 */

// Мокаем Prisma Client
vi.mock('@prisma/client');
vi.mock('bcryptjs');
vi.mock('jsonwebtoken');

const mockPrisma = {
  user: {
    findMany: vi.fn(),
    findUnique: vi.fn(),
    findFirst: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
    delete: vi.fn(),
    count: vi.fn(),
  },
} as any;

// Мокаем модули
vi.mocked(PrismaClient).mockImplementation(() => mockPrisma);

describe('UserService', () => {
  beforeEach(() => {
    // Очищаем все моки перед каждым тестом
    vi.clearAllMocks();
  });

  describe('findMany - получение списка пользователей', () => {
    it('should return users list with correct formatting', async () => {
      // Arrange
      const mockUsers = [
        {
          id: '1',
          email: 'test@example.com',
          firstName: 'Test',
          lastName: 'User',
          role: 'USER',
          isActive: true,
          lastLoginAt: new Date('2025-01-30'),
          createdAt: new Date('2025-01-01'),
          updatedAt: new Date('2025-01-30'),
          _count: { projects: 3 }
        }
      ];

      mockPrisma.user.findMany.mockResolvedValue(mockUsers);

      // Act
      const result = await UserService.findMany({});

      // Assert
      expect(result).toHaveLength(1);
      expect(result[0]).toEqual({
        id: '1',
        email: 'test@example.com',
        firstName: 'Test',
        lastName: 'User',
        fullName: 'Test User',
        role: 'user', // должен быть в lowercase
        isActive: true,
        lastLoginAt: '2025-01-30T00:00:00.000Z',
        createdAt: '2025-01-01T00:00:00.000Z',
        updatedAt: '2025-01-30T00:00:00.000Z',
        projectCount: 3
      });
    });

    it('should apply search filter correctly', async () => {
      // Arrange
      mockPrisma.user.findMany.mockResolvedValue([]);

      // Act
      await UserService.findMany({ search: 'john' });

      // Assert
      expect(mockPrisma.user.findMany).toHaveBeenCalledWith({
        where: {
          OR: [
            { email: { contains: 'john', mode: 'insensitive' } },
            { firstName: { contains: 'john', mode: 'insensitive' } },
            { lastName: { contains: 'john', mode: 'insensitive' } }
          ]
        },
        select: expect.any(Object),
        orderBy: { createdAt: 'desc' }
      });
    });

    it('should apply role filter correctly', async () => {
      // Arrange
      mockPrisma.user.findMany.mockResolvedValue([]);

      // Act
      await UserService.findMany({ role: 'admin' });

      // Assert
      expect(mockPrisma.user.findMany).toHaveBeenCalledWith({
        where: { role: 'ADMIN' },
        select: expect.any(Object),
        orderBy: { createdAt: 'desc' }
      });
    });

    it('should handle database errors gracefully', async () => {
      // Arrange
      mockPrisma.user.findMany.mockRejectedValue(new Error('Database error'));

      // Act & Assert
      await expect(UserService.findMany({})).rejects.toThrow('Не удалось получить пользователей');
    });
  });

  describe('findOne - получение пользователя по ID', () => {
    it('should return user with projects', async () => {
      // Arrange
      const mockUser = {
        id: '1',
        email: 'test@example.com',
        firstName: 'Test',
        lastName: 'User',
        role: 'USER',
        isActive: true,
        lastLoginAt: new Date('2025-01-30'),
        createdAt: new Date('2025-01-01'),
        updatedAt: new Date('2025-01-30'),
        projects: [
          {
            id: 'proj1',
            name: 'Test Project',
            slug: 'test-project',
            status: 'ACTIVE',
            isPublished: true,
            createdAt: new Date('2025-01-15')
          }
        ]
      };

      mockPrisma.user.findUnique.mockResolvedValue(mockUser);

      // Act
      const result = await UserService.findOne('1');

      // Assert
      expect(result).toBeDefined();
      expect(result!.id).toBe('1');
      expect(result!.projects).toHaveLength(1);
      expect(result!.projects[0].name).toBe('Test Project');
    });

    it('should return null for non-existent user', async () => {
      // Arrange
      mockPrisma.user.findUnique.mockResolvedValue(null);

      // Act
      const result = await UserService.findOne('999');

      // Assert
      expect(result).toBeNull();
    });

    it('should handle database errors', async () => {
      // Arrange
      mockPrisma.user.findUnique.mockRejectedValue(new Error('Database error'));

      // Act
      const result = await UserService.findOne('1');

      // Assert
      expect(result).toBeNull();
    });
  });

  describe('create - создание пользователя', () => {
    it('should create user with hashed password', async () => {
      // Arrange
      const userData = {
        email: 'new@example.com',
        password: 'password123',
        firstName: 'New',
        lastName: 'User',
        role: 'USER' as const
      };

      const hashedPassword = 'hashed_password';
      vi.mocked(bcrypt.hash).mockResolvedValue(hashedPassword as never);

      const createdUser = {
        id: '2',
        email: userData.email,
        firstName: userData.firstName,
        lastName: userData.lastName,
        role: userData.role,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
      };

      mockPrisma.user.create.mockResolvedValue(createdUser);

      // Act
      const result = await UserService.create(userData);

      // Assert
      expect(bcrypt.hash).toHaveBeenCalledWith(userData.password, expect.any(Number));
      expect(mockPrisma.user.create).toHaveBeenCalledWith({
        data: {
          email: userData.email,
          password: hashedPassword,
          firstName: userData.firstName,
          lastName: userData.lastName,
          role: userData.role,
          isActive: true
        },
        select: expect.any(Object)
      });
      expect(result.email).toBe(userData.email);
    });

    it('should handle duplicate email error', async () => {
      // Arrange
      const userData = {
        email: 'existing@example.com',
        password: 'password123'
      };

      const duplicateError = new Error('Unique constraint failed');
      (duplicateError as any).code = 'P2002';
      
      vi.mocked(bcrypt.hash).mockResolvedValue('hashed' as never);
      mockPrisma.user.create.mockRejectedValue(duplicateError);

      // Act & Assert
      await expect(UserService.create(userData)).rejects.toThrow('Пользователь с таким email уже существует');
    });

    it('should handle other database errors', async () => {
      // Arrange
      const userData = {
        email: 'test@example.com',
        password: 'password123'
      };

      vi.mocked(bcrypt.hash).mockResolvedValue('hashed' as never);
      mockPrisma.user.create.mockRejectedValue(new Error('Database error'));

      // Act & Assert
      await expect(UserService.create(userData)).rejects.toThrow('Не удалось создать пользователя');
    });
  });

  describe('login - аутентификация', () => {
    it('should return token for valid credentials', async () => {
      // Arrange
      const loginData = {
        email: 'test@example.com',
        password: 'password123'
      };

      const mockUser = {
        id: '1',
        email: loginData.email,
        password: 'hashed_password',
        firstName: 'Test',
        lastName: 'User',
        role: 'USER',
        isActive: true
      };

      const mockToken = 'jwt_token';

      mockPrisma.user.findFirst.mockResolvedValue(mockUser);
      vi.mocked(bcrypt.compare).mockResolvedValue(true as never);
      vi.mocked(jwt.sign).mockReturnValue(mockToken as never);
      mockPrisma.user.update.mockResolvedValue(mockUser);

      // Act
      const result = await UserService.login(loginData);

      // Assert
      expect(result).toBeDefined();
      expect(result!.token).toBe(mockToken);
      expect(result!.user.email).toBe(loginData.email);
      expect(mockPrisma.user.update).toHaveBeenCalledWith({
        where: { id: '1' },
        data: { lastLoginAt: expect.any(Date) }
      });
    });

    it('should return null for invalid email', async () => {
      // Arrange
      mockPrisma.user.findFirst.mockResolvedValue(null);

      // Act
      const result = await UserService.login({
        email: 'nonexistent@example.com',
        password: 'password123'
      });

      // Assert
      expect(result).toBeNull();
    });

    it('should return null for invalid password', async () => {
      // Arrange
      const mockUser = {
        id: '1',
        email: 'test@example.com',
        password: 'hashed_password',
        isActive: true
      };

      mockPrisma.user.findFirst.mockResolvedValue(mockUser);
      vi.mocked(bcrypt.compare).mockResolvedValue(false as never);

      // Act
      const result = await UserService.login({
        email: 'test@example.com',
        password: 'wrong_password'
      });

      // Assert
      expect(result).toBeNull();
    });

    it('should return null for inactive user', async () => {
      // Arrange
      const mockUser = {
        id: '1',
        email: 'test@example.com',
        password: 'hashed_password',
        isActive: false
      };

      mockPrisma.user.findFirst.mockResolvedValue(mockUser);

      // Act
      const result = await UserService.login({
        email: 'test@example.com',
        password: 'password123'
      });

      // Assert
      expect(result).toBeNull();
    });
  });

  describe('getStatistics - статистика пользователей', () => {
    it('should return correct statistics', async () => {
      // Arrange
      mockPrisma.user.count
        .mockResolvedValueOnce(100) // total users
        .mockResolvedValueOnce(85)  // active users
        .mockResolvedValueOnce(5)   // admin users
        .mockResolvedValueOnce(90); // user users

      // Act
      const result = await UserService.getStatistics();

      // Assert
      expect(result).toEqual({
        totalUsers: 100,
        activeUsers: 85,
        inactiveUsers: 15,
        adminUsers: 5,
        userUsers: 90
      });
    });

    it('should handle database errors', async () => {
      // Arrange
      mockPrisma.user.count.mockRejectedValue(new Error('Database error'));

      // Act & Assert
      await expect(UserService.getStatistics()).rejects.toThrow('Не удалось получить статистику пользователей');
    });
  });

  describe('verifyToken - верификация JWT', () => {
    it('should return user for valid token', async () => {
      // Arrange
      const token = 'valid_token';
      const decoded = { userId: '1' };
      const mockUser = {
        id: '1',
        email: 'test@example.com',
        firstName: 'Test',
        lastName: 'User',
        role: 'USER',
        isActive: true
      };

      vi.mocked(jwt.verify).mockReturnValue(decoded as never);
      mockPrisma.user.findUnique.mockResolvedValue(mockUser);

      // Act
      const result = await UserService.verifyToken(token);

      // Assert
      expect(result).toBeDefined();
      expect(result!.id).toBe('1');
      expect(result!.email).toBe('test@example.com');
      expect(result!.fullName).toBe('Test User');
    });

    it('should return null for invalid token', async () => {
      // Arrange
      const token = 'invalid_token';
      vi.mocked(jwt.verify).mockImplementation(() => {
        throw new Error('Invalid token');
      });

      // Act
      const result = await UserService.verifyToken(token);

      // Assert
      expect(result).toBeNull();
    });

    it('should return null for inactive user', async () => {
      // Arrange
      const token = 'valid_token';
      const decoded = { userId: '1' };
      const mockUser = {
        id: '1',
        email: 'test@example.com',
        isActive: false
      };

      vi.mocked(jwt.verify).mockReturnValue(decoded as never);
      mockPrisma.user.findUnique.mockResolvedValue(mockUser);

      // Act
      const result = await UserService.verifyToken(token);

      // Assert
      expect(result).toBeNull();
    });
  });

  describe('Edge cases and error handling', () => {
    it('should handle null/undefined inputs gracefully', async () => {
      // Act & Assert
      await expect(UserService.findOne('')).resolves.toBeNull();
      await expect(UserService.create({} as any)).rejects.toThrow();
    });

    it('should format fullName correctly for edge cases', async () => {
      // Arrange
      const mockUser = {
        id: '1',
        email: 'test@example.com',
        firstName: null,
        lastName: null,
        role: 'USER',
        isActive: true,
        lastLoginAt: null,
        createdAt: new Date(),
        updatedAt: new Date(),
        _count: { projects: 0 }
      };

      mockPrisma.user.findMany.mockResolvedValue([mockUser]);

      // Act
      const result = await UserService.findMany({});

      // Assert
      expect(result[0].fullName).toBe('Без имени');
    });
  });
});