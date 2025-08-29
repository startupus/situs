/**
 * Users API Service
 * Управление пользователями, аутентификация и профили
 */

import { apiClient, ApiResponse, ApiUtils } from '../client';
import { User, UserRole, UserStatus, UserFilters as UserFiltersType, UserStats } from '../../types/users';

export interface UserProfile {
  firstName?: string;
  lastName?: string;
  avatar?: string;
  phone?: string;
  bio?: string;
  company?: string;
  position?: string;
  socialLinks?: {
    linkedin?: string;
    twitter?: string;
    github?: string;
    instagram?: string;
  };
}

export interface UserBalance {
  amount: number;
  currency: string;
  symbol: string;
}

export interface CreateUserData {
  username: string;
  email: string;
  password: string;
  role?: UserRole;
}

export interface UpdateUserData {
  username?: string;
  email?: string;
  role?: UserRole;
  status?: UserStatus;
  profile?: Partial<UserProfile>;
}

export interface UserFilters {
  search?: string;
  role?: string;
  status?: string;
  sortBy?: 'username' | 'email' | 'created' | 'updated';
  sortOrder?: 'asc' | 'desc';
  page?: number;
  limit?: number;
}

export interface UsersListResponse {
  users: User[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface AuthCredentials {
  email: string;
  password: string;
}

export interface AuthResponse {
  user: User;
  token: string;
  expiresIn: number;
}

// Mock данные для разработки
const mockUsers: User[] = [
  {
    id: '1',
    email: 'admin@situs.com',
    firstName: 'Дмитрий',
    lastName: 'Иванов',
    avatar: '/images/avatars/admin.jpg',
    role: 'super_admin',
    status: 'active',
    createdAt: new Date('2024-01-01T10:00:00Z'),
    updatedAt: new Date('2024-12-23T15:30:00Z'),
    lastLoginAt: new Date('2024-12-23T15:30:00Z'),
    isEmailVerified: true,
    phone: '+7 (495) 123-45-67',
    company: 'Стартапус',
    position: 'Главный администратор',
    projectsCount: 15,
    ordersCount: 45,
    permissions: ['projects.*', 'users.*', 'orders.*', 'marketing.*', 'settings.*', 'reports.*']
  },
  {
    id: '2',
    email: 'manager@company.ru',
    firstName: 'Анна',
    lastName: 'Петрова',
    avatar: '/images/avatars/manager.jpg',
    role: 'company_admin',
    status: 'active',
    createdAt: new Date('2024-02-15T09:00:00Z'),
    updatedAt: new Date('2024-12-20T12:15:00Z'),
    lastLoginAt: new Date('2024-12-20T12:15:00Z'),
    isEmailVerified: true,
    phone: '+7 (495) 234-56-78',
    company: 'ООО "Инновации"',
    position: 'Менеджер проектов',
    projectsCount: 8,
    ordersCount: 23,
    permissions: ['projects.view', 'projects.edit', 'orders.view', 'orders.edit']
  },
  {
    id: '3',
    email: 'dev@startup.com',
    firstName: 'Алексей',
    lastName: 'Козлов',
    avatar: '/images/avatars/developer.jpg',
    role: 'editor',
    status: 'active',
    createdAt: new Date('2024-03-10T14:20:00Z'),
    updatedAt: new Date('2024-12-22T16:45:00Z'),
    lastLoginAt: new Date('2024-12-22T16:45:00Z'),
    isEmailVerified: true,
    phone: '+7 (495) 345-67-89',
    company: 'Стартапус',
    position: 'Ведущий разработчик',
    projectsCount: 12,
    ordersCount: 18,
    permissions: ['projects.view', 'projects.edit']
  },
  {
    id: '4',
    email: 'design@creative.ru',
    firstName: 'Мария',
    lastName: 'Сидорова',
    avatar: '/images/avatars/designer.jpg',
    role: 'editor',
    status: 'inactive',
    createdAt: new Date('2024-04-05T11:30:00Z'),
    updatedAt: new Date('2024-12-18T10:15:00Z'),
    lastLoginAt: new Date('2024-12-10T14:20:00Z'),
    isEmailVerified: true,
    phone: '+7 (495) 456-78-90',
    company: 'Студия дизайна',
    position: 'UI/UX дизайнер',
    projectsCount: 6,
    ordersCount: 12,
    permissions: ['projects.view', 'projects.edit']
  },
  {
    id: '5',
    email: 'test@qa.com',
    firstName: 'Игорь',
    lastName: 'Новиков',
    avatar: '/images/avatars/tester.jpg',
    role: 'client',
    status: 'suspended',
    createdAt: new Date('2024-05-20T16:45:00Z'),
    updatedAt: new Date('2024-12-15T13:20:00Z'),
    lastLoginAt: new Date('2024-12-01T09:30:00Z'),
    isEmailVerified: false,
    phone: '+7 (495) 567-89-01',
    company: 'QA Lab',
    position: 'Тестировщик',
    projectsCount: 2,
    ordersCount: 5,
    permissions: ['projects.view']
  }
];

class UsersApiService {
  private readonly baseEndpoint = '/api/users';
  private readonly authEndpoint = '/api/auth';

  /**
   * Аутентификация пользователя
   */
  async login(credentials: AuthCredentials): Promise<AuthResponse> {
    try {
      const res = await apiClient.post<AuthResponse>(`${this.authEndpoint}/login`, credentials);
      const data = res.data || res as any;
      if (typeof window !== 'undefined' && data?.token) {
        localStorage.setItem('auth_token', data.token);
      }
      return data;
    } catch (error) {
      console.error('Login API Error:', error);
      throw new Error(ApiUtils.handleError(error));
    }
  }

  /**
   * Регистрация нового пользователя
   */
  async register(userData: CreateUserData): Promise<AuthResponse> {
    try {
      const res = await apiClient.post<AuthResponse>(`${this.authEndpoint}/register`, userData as any);
      const data = res.data || res as any;
      if (typeof window !== 'undefined' && data?.token) {
        localStorage.setItem('auth_token', data.token);
      }
      return data;
    } catch (error) {
      console.error('Register API Error:', error);
      throw new Error(ApiUtils.handleError(error));
    }
  }

  /**
   * Выход из системы
   */
  logout(): void {
    // Очищаем токен из localStorage
    if (typeof window !== 'undefined') {
      localStorage.removeItem('auth_token');
    }
  }

  /**
   * Получить текущего пользователя
   */
  async getCurrentUser(): Promise<User> {
    try {
      const res = await apiClient.get<User>(`/api/users/me`);
      const data = res.data || res as any;
      return data;
    } catch (error) {
      console.error('Get Current User API Error:', error);
      throw new Error(ApiUtils.handleError(error));
    }
  }

  /**
   * Получить список пользователей
   */
  async getUsers(filters?: UserFilters): Promise<UsersListResponse> {
    try {
      // Имитация задержки сети
      await new Promise(resolve => setTimeout(resolve, 300));

      let filteredUsers = [...mockUsers];

      // Применяем фильтры
      if (filters?.search) {
        const searchLower = filters.search.toLowerCase();
        filteredUsers = filteredUsers.filter(user => 
          user.firstName.toLowerCase().includes(searchLower) ||
          user.lastName.toLowerCase().includes(searchLower) ||
          user.email.toLowerCase().includes(searchLower) ||
          user.company?.toLowerCase().includes(searchLower)
        );
      }

      if (filters?.role) {
        filteredUsers = filteredUsers.filter(user => user.role === filters.role);
      }

      if (filters?.status) {
        filteredUsers = filteredUsers.filter(user => user.status === filters.status);
      }

      // Сортировка
      if (filters?.sortBy) {
        filteredUsers.sort((a, b) => {
          let aValue: any, bValue: any;
          
          switch (filters.sortBy) {
            case 'username':
              aValue = `${a.firstName} ${a.lastName}`;
              bValue = `${b.firstName} ${b.lastName}`;
              break;
            case 'email':
              aValue = a.email;
              bValue = b.email;
              break;
            case 'created':
              aValue = a.createdAt;
              bValue = b.createdAt;
              break;
            case 'updated':
              aValue = a.updatedAt;
              bValue = b.updatedAt;
              break;
            default:
              aValue = `${a.firstName} ${a.lastName}`;
              bValue = `${b.firstName} ${b.lastName}`;
          }

          if (filters.sortOrder === 'desc') {
            return aValue > bValue ? -1 : 1;
          }
          return aValue < bValue ? -1 : 1;
        });
      }

      // Пагинация
      const page = filters?.page || 1;
      const limit = filters?.limit || 20;
      const startIndex = (page - 1) * limit;
      const endIndex = startIndex + limit;
      const paginatedUsers = filteredUsers.slice(startIndex, endIndex);

      return {
        users: paginatedUsers,
        pagination: {
          page,
          limit,
          total: filteredUsers.length,
          totalPages: Math.ceil(filteredUsers.length / limit)
        }
      };
    } catch (error) {
      console.error('Get Users API Error:', error);
      throw new Error(ApiUtils.handleError(error));
    }
  }

  /**
   * Получить отдельного пользователя
   */
  async getUser(userId: string): Promise<User> {
    try {
      const user = mockUsers.find(u => u.id === userId);
      if (!user) {
        throw new Error('Пользователь не найден');
      }
      return user;
    } catch (error) {
      console.error('Get User API Error:', error);
      throw new Error(ApiUtils.handleError(error));
    }
  }

  /**
   * Создать нового пользователя
   */
  async createUser(data: CreateUserData): Promise<User> {
    try {
      const newUser: User = {
        id: `user_${Date.now()}`,
        email: data.email,
        firstName: '',
        lastName: '',
        role: data.role || 'client',
        status: 'active',
        createdAt: new Date(),
        updatedAt: new Date(),
        isEmailVerified: false,
        projectsCount: 0,
        ordersCount: 0,
        permissions: ['projects.view']
      };

      mockUsers.push(newUser);
      return newUser;
    } catch (error) {
      console.error('Create User API Error:', error);
      throw new Error(ApiUtils.handleError(error));
    }
  }

  /**
   * Обновить пользователя
   */
  async updateUser(userId: string, data: UpdateUserData): Promise<User> {
    try {
      const userIndex = mockUsers.findIndex(u => u.id === userId);
      if (userIndex === -1) {
        throw new Error('Пользователь не найден');
      }

      mockUsers[userIndex] = {
        ...mockUsers[userIndex],
        ...data,
        updatedAt: new Date()
      };

      return mockUsers[userIndex];
    } catch (error) {
      console.error('Update User API Error:', error);
      throw new Error(ApiUtils.handleError(error));
    }
  }

  /**
   * Обновить профиль пользователя
   */
  async updateProfile(data: Partial<UserProfile>): Promise<User> {
    try {
      // Обновляем первого пользователя как текущего
      mockUsers[0] = {
        ...mockUsers[0],
        firstName: data.firstName || mockUsers[0].firstName,
        lastName: data.lastName || mockUsers[0].lastName,
        phone: data.phone || mockUsers[0].phone,
        company: data.company || mockUsers[0].company,
        position: data.position || mockUsers[0].position,
        updatedAt: new Date()
      };

      return mockUsers[0];
    } catch (error) {
      console.error('Update Profile API Error:', error);
      throw new Error(ApiUtils.handleError(error));
    }
  }

  /**
   * Удалить пользователя
   */
  async deleteUser(userId: string): Promise<void> {
    try {
      const userIndex = mockUsers.findIndex(u => u.id === userId);
      if (userIndex === -1) {
        throw new Error('Пользователь не найден');
      }

      mockUsers.splice(userIndex, 1);
    } catch (error) {
      console.error('Delete User API Error:', error);
      throw new Error(ApiUtils.handleError(error));
    }
  }

  /**
   * Обновить статус пользователя
   */
  async updateUserStatus(userId: string, status: UserStatus): Promise<void> {
    try {
      const user = mockUsers.find(u => u.id === userId);
      if (!user) {
        throw new Error('Пользователь не найден');
      }

      user.status = status;
      user.updatedAt = new Date();
    } catch (error) {
      console.error('Update User Status API Error:', error);
      throw new Error(ApiUtils.handleError(error));
    }
  }

  /**
   * Загрузить аватар
   */
  async uploadAvatar(file: File): Promise<{ url: string }> {
    try {
      // Mock загрузка файла
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      return {
        url: `/images/avatars/${file.name}`
      };
    } catch (error) {
      console.error('Upload Avatar API Error:', error);
      throw new Error(ApiUtils.handleError(error));
    }
  }

  /**
   * Сменить пароль
   */
  async changePassword(currentPassword: string, newPassword: string): Promise<void> {
    try {
      // Mock смена пароля
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // В реальном приложении здесь была бы проверка текущего пароля
      if (currentPassword === 'wrong') {
        throw new Error('Неверный текущий пароль');
      }
    } catch (error) {
      console.error('Change Password API Error:', error);
      throw new Error(ApiUtils.handleError(error));
    }
  }
}

export const usersApi = new UsersApiService();
export default usersApi;