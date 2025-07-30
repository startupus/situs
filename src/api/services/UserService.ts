import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { security } from '../config/environment';

const prisma = new PrismaClient();

/**
 * UserService - Модульный сервис для работы с пользователями
 * Основан на архитектуре Strapi с разделением ответственности
 */

export interface CreateUserData {
  email: string;
  password: string;
  firstName?: string;
  lastName?: string;
  role?: 'USER' | 'ADMIN' | 'MODERATOR';
  isActive?: boolean;
}

export interface UpdateUserData {
  email?: string;
  firstName?: string;
  lastName?: string;
  role?: 'USER' | 'ADMIN' | 'MODERATOR';
  isActive?: boolean;
  lastLoginAt?: Date;
}

export interface UserFilters {
  search?: string;
  role?: string;
  isActive?: boolean;
  sortBy?: 'email' | 'firstName' | 'created' | 'lastLogin';
  sortOrder?: 'asc' | 'desc';
}

export interface LoginData {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  password: string;
  firstName?: string;
  lastName?: string;
}

class UserService {
  /**
   * Получение всех пользователей с фильтрацией
   */
  async findMany(filters?: UserFilters) {
    try {
      const whereClause: any = {};
      
      // Поиск по email, имени или фамилии
      if (filters?.search) {
        whereClause.OR = [
          { email: { contains: filters.search, mode: 'insensitive' } },
          { firstName: { contains: filters.search, mode: 'insensitive' } },
          { lastName: { contains: filters.search, mode: 'insensitive' } }
        ];
      }
      
      // Фильтр по роли
      if (filters?.role) {
        whereClause.role = filters.role.toUpperCase();
      }
      
      // Фильтр по активности
      if (filters?.isActive !== undefined) {
        whereClause.isActive = filters.isActive;
      }
      
      // Определяем сортировку
      let orderBy: any = { createdAt: 'desc' };
      if (filters?.sortBy) {
        const sortOrder = filters.sortOrder || 'desc';
        switch (filters.sortBy) {
          case 'email':
            orderBy = { email: sortOrder };
            break;
          case 'firstName':
            orderBy = { firstName: sortOrder };
            break;
          case 'created':
            orderBy = { createdAt: sortOrder };
            break;
          case 'lastLogin':
            orderBy = { lastLoginAt: sortOrder };
            break;
        }
      }

      const users = await prisma.user.findMany({
        where: whereClause,
        select: {
          id: true,
          email: true,
          firstName: true,
          lastName: true,
          role: true,
          isActive: true,
          lastLoginAt: true,
          createdAt: true,
          updatedAt: true,
          _count: {
            select: { projects: true }
          }
        },
        orderBy
      });

      return users.map(user => ({
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        fullName: this.getFullName(user.firstName, user.lastName),
        role: user.role.toLowerCase(),
        isActive: user.isActive,
        lastLoginAt: user.lastLoginAt?.toISOString() || null,
        createdAt: user.createdAt.toISOString(),
        updatedAt: user.updatedAt.toISOString(),
        projectCount: user._count.projects
      }));
    } catch (error) {
      console.error('Ошибка при получении пользователей:', error);
      throw new Error('Не удалось получить пользователей');
    }
  }

  /**
   * Получение пользователя по ID
   */
  async findOne(userId: string) {
    try {
      const user = await prisma.user.findUnique({
        where: { id: userId },
        select: {
          id: true,
          email: true,
          firstName: true,
          lastName: true,
          role: true,
          isActive: true,
          lastLoginAt: true,
          createdAt: true,
          updatedAt: true,
          projects: {
            select: {
              id: true,
              name: true,
              slug: true,
              status: true,
              isPublished: true,
              createdAt: true
            },
            orderBy: { updatedAt: 'desc' }
          }
        }
      });

      if (!user) {
        return null;
      }

      return {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        fullName: this.getFullName(user.firstName, user.lastName),
        role: user.role.toLowerCase(),
        isActive: user.isActive,
        lastLoginAt: user.lastLoginAt?.toISOString() || null,
        createdAt: user.createdAt.toISOString(),
        updatedAt: user.updatedAt.toISOString(),
        projects: user.projects.map(project => ({
          id: project.id,
          name: project.name,
          slug: project.slug,
          status: project.status,
          isPublished: project.isPublished,
          createdAt: project.createdAt.toISOString()
        }))
      };
    } catch (error) {
      console.error('Ошибка при получении пользователя:', error);
      return null;
    }
  }

  /**
   * Получение пользователя по email
   */
  async findByEmail(email: string) {
    try {
      const user = await prisma.user.findUnique({
        where: { email },
        select: {
          id: true,
          email: true,
          firstName: true,
          lastName: true,
          role: true,
          isActive: true,
          lastLoginAt: true,
          createdAt: true,
          updatedAt: true
        }
      });

      if (!user) {
        return null;
      }

      return {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        fullName: this.getFullName(user.firstName, user.lastName),
        role: user.role.toLowerCase(),
        isActive: user.isActive,
        lastLoginAt: user.lastLoginAt?.toISOString() || null,
        createdAt: user.createdAt.toISOString(),
        updatedAt: user.updatedAt.toISOString()
      };
    } catch (error) {
      console.error('Ошибка при получении пользователя по email:', error);
      return null;
    }
  }

  /**
   * Создание нового пользователя (админом)
   */
  async create(data: CreateUserData) {
    try {
      // Проверяем уникальность email
      const existingUser = await prisma.user.findUnique({
        where: { email: data.email }
      });

      if (existingUser) {
        throw new Error('Пользователь с таким email уже существует');
      }

      // Хешируем пароль
      const hashedPassword = await this.hashPassword(data.password);

      const user = await prisma.user.create({
        data: {
          email: data.email,
          password: hashedPassword,
          firstName: data.firstName,
          lastName: data.lastName,
          role: data.role || 'USER',
          isActive: data.isActive !== undefined ? data.isActive : true
        },
        select: {
          id: true,
          email: true,
          firstName: true,
          lastName: true,
          role: true,
          isActive: true,
          createdAt: true,
          updatedAt: true
        }
      });

      return {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        fullName: this.getFullName(user.firstName, user.lastName),
        role: user.role.toLowerCase(),
        isActive: user.isActive,
        createdAt: user.createdAt.toISOString(),
        updatedAt: user.updatedAt.toISOString()
      };
    } catch (error) {
      console.error('Ошибка при создании пользователя:', error);
      throw error;
    }
  }

  /**
   * Регистрация нового пользователя
   */
  async register(data: RegisterData) {
    try {
      // Проверяем уникальность email
      const existingUser = await prisma.user.findUnique({
        where: { email: data.email }
      });

      if (existingUser) {
        throw new Error('Пользователь с таким email уже существует');
      }

      // Хешируем пароль
      const hashedPassword = await this.hashPassword(data.password);

      const user = await prisma.user.create({
        data: {
          email: data.email,
          password: hashedPassword,
          firstName: data.firstName,
          lastName: data.lastName,
          role: 'USER',
          isActive: true
        },
        select: {
          id: true,
          email: true,
          firstName: true,
          lastName: true,
          role: true,
          isActive: true,
          createdAt: true
        }
      });

      // Генерируем JWT токен
      const token = this.generateToken(user.id);

      return {
        user: {
          id: user.id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          fullName: this.getFullName(user.firstName, user.lastName),
          role: user.role.toLowerCase(),
          isActive: user.isActive,
          createdAt: user.createdAt.toISOString()
        },
        token
      };
    } catch (error) {
      console.error('Ошибка при регистрации пользователя:', error);
      throw error;
    }
  }

  /**
   * Авторизация пользователя
   */
  async login(data: LoginData) {
    try {
      // Находим пользователя с паролем
      const user = await prisma.user.findUnique({
        where: { email: data.email },
        select: {
          id: true,
          email: true,
          password: true,
          firstName: true,
          lastName: true,
          role: true,
          isActive: true,
          lastLoginAt: true,
          createdAt: true
        }
      });

      if (!user) {
        throw new Error('Неверный email или пароль');
      }

      if (!user.isActive) {
        throw new Error('Аккаунт деактивирован');
      }

      // Проверяем пароль
      const isPasswordValid = await this.comparePassword(data.password, user.password);
      if (!isPasswordValid) {
        throw new Error('Неверный email или пароль');
      }

      // Обновляем время последнего входа
      await prisma.user.update({
        where: { id: user.id },
        data: { lastLoginAt: new Date() }
      });

      // Генерируем JWT токен
      const token = this.generateToken(user.id);

      return {
        user: {
          id: user.id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          fullName: this.getFullName(user.firstName, user.lastName),
          role: user.role.toLowerCase(),
          isActive: user.isActive,
          lastLoginAt: new Date().toISOString(),
          createdAt: user.createdAt.toISOString()
        },
        token
      };
    } catch (error) {
      console.error('Ошибка при авторизации:', error);
      throw error;
    }
  }

  /**
   * Обновление пользователя
   */
  async update(userId: string, data: UpdateUserData) {
    try {
      // Проверяем уникальность email если он изменяется
      if (data.email) {
        const existingUser = await prisma.user.findFirst({
          where: { 
            email: data.email,
            id: { not: userId }
          }
        });

        if (existingUser) {
          throw new Error('Пользователь с таким email уже существует');
        }
      }

      const updatedUser = await prisma.user.update({
        where: { id: userId },
        data: {
          ...data,
          updatedAt: new Date()
        },
        select: {
          id: true,
          email: true,
          firstName: true,
          lastName: true,
          role: true,
          isActive: true,
          lastLoginAt: true,
          createdAt: true,
          updatedAt: true
        }
      });

      return {
        id: updatedUser.id,
        email: updatedUser.email,
        firstName: updatedUser.firstName,
        lastName: updatedUser.lastName,
        fullName: this.getFullName(updatedUser.firstName, updatedUser.lastName),
        role: updatedUser.role.toLowerCase(),
        isActive: updatedUser.isActive,
        lastLoginAt: updatedUser.lastLoginAt?.toISOString() || null,
        createdAt: updatedUser.createdAt.toISOString(),
        updatedAt: updatedUser.updatedAt.toISOString()
      };
    } catch (error) {
      console.error('Ошибка при обновлении пользователя:', error);
      throw error;
    }
  }

  /**
   * Изменение пароля пользователя
   */
  async changePassword(userId: string, currentPassword: string, newPassword: string) {
    try {
      const user = await prisma.user.findUnique({
        where: { id: userId },
        select: { password: true }
      });

      if (!user) {
        throw new Error('Пользователь не найден');
      }

      // Проверяем текущий пароль
      const isCurrentPasswordValid = await this.comparePassword(currentPassword, user.password);
      if (!isCurrentPasswordValid) {
        throw new Error('Неверный текущий пароль');
      }

      // Хешируем новый пароль
      const hashedNewPassword = await this.hashPassword(newPassword);

      await prisma.user.update({
        where: { id: userId },
        data: { 
          password: hashedNewPassword,
          updatedAt: new Date()
        }
      });

      return { success: true };
    } catch (error) {
      console.error('Ошибка при изменении пароля:', error);
      throw error;
    }
  }

  /**
   * Деактивация пользователя
   */
  async deactivate(userId: string) {
    try {
      const user = await prisma.user.update({
        where: { id: userId },
        data: { 
          isActive: false,
          updatedAt: new Date()
        },
        select: {
          id: true,
          email: true,
          isActive: true
        }
      });

      return {
        id: user.id,
        email: user.email,
        isActive: user.isActive
      };
    } catch (error) {
      console.error('Ошибка при деактивации пользователя:', error);
      throw new Error('Не удалось деактивировать пользователя');
    }
  }

  /**
   * Активация пользователя
   */
  async activate(userId: string) {
    try {
      const user = await prisma.user.update({
        where: { id: userId },
        data: { 
          isActive: true,
          updatedAt: new Date()
        },
        select: {
          id: true,
          email: true,
          isActive: true
        }
      });

      return {
        id: user.id,
        email: user.email,
        isActive: user.isActive
      };
    } catch (error) {
      console.error('Ошибка при активации пользователя:', error);
      throw new Error('Не удалось активировать пользователя');
    }
  }

  /**
   * Удаление пользователя
   */
  async delete(userId: string) {
    try {
      // Сначала удаляем все проекты пользователя
      await prisma.page.deleteMany({
        where: {
          project: { ownerId: userId }
        }
      });

      await prisma.project.deleteMany({
        where: { ownerId: userId }
      });

      // Затем удаляем пользователя
      await prisma.user.delete({
        where: { id: userId }
      });

      return { success: true };
    } catch (error) {
      console.error('Ошибка при удалении пользователя:', error);
      throw new Error('Не удалось удалить пользователя');
    }
  }

  /**
   * Получение статистики пользователей
   */
  async getStatistics() {
    try {
      const [totalUsers, activeUsers, adminUsers, userUsers] = await Promise.all([
        prisma.user.count(),
        prisma.user.count({ where: { isActive: true } }),
        prisma.user.count({ where: { role: 'ADMIN' } }),
        prisma.user.count({ where: { role: 'USER' } })
      ]);

      return {
        totalUsers,
        activeUsers,
        inactiveUsers: totalUsers - activeUsers,
        adminUsers,
        userUsers
      };
    } catch (error) {
      console.error('Ошибка при получении статистики пользователей:', error);
      throw new Error('Не удалось получить статистику пользователей');
    }
  }

  /**
   * Верификация JWT токена
   */
  async verifyToken(token: string) {
    try {
      const decoded = jwt.verify(token, security.jwt.secret) as { userId: string };
      
      const user = await prisma.user.findUnique({
        where: { id: decoded.userId },
        select: {
          id: true,
          email: true,
          firstName: true,
          lastName: true,
          role: true,
          isActive: true
        }
      });

      if (!user || !user.isActive) {
        return null;
      }

      return {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        fullName: this.getFullName(user.firstName, user.lastName),
        role: user.role.toLowerCase(),
        isActive: user.isActive
      };
    } catch (error) {
      console.error('Ошибка при верификации токена:', error);
      return null;
    }
  }

  /**
   * Хеширование пароля
   */
  private async hashPassword(password: string): Promise<string> {
    return await bcrypt.hash(password, security.bcrypt.saltRounds);
  }

  /**
   * Сравнение пароля с хешем
   */
  private async comparePassword(password: string, hash: string): Promise<boolean> {
    return await bcrypt.compare(password, hash);
  }

  /**
   * Генерация JWT токена
   */
  private generateToken(userId: string): string {
    return jwt.sign(
      { userId },
      security.jwt.secret,
      { expiresIn: security.jwt.expiresIn }
    );
  }

  /**
   * Получение полного имени
   */
  private getFullName(firstName?: string | null, lastName?: string | null): string {
    const parts = [firstName, lastName].filter(Boolean);
    return parts.join(' ') || 'Без имени';
  }
}

export default new UserService();