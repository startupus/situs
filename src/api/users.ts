// API для управления пользователями
import { User, UserForm, UserFilters, UserStats, UserRole, UserStatus } from '../types/users';

// Базовый URL API (в реальном проекте должен быть из переменных окружения)
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';

// Интерфейсы для API
interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

interface PaginatedResponse<T> {
  success: boolean;
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

interface LoginRequest {
  email: string;
  password: string;
}

interface LoginResponse {
  user: User;
  token: string;
  refreshToken: string;
}

interface CreateUserRequest {
  userData: UserForm;
}

interface UpdateUserRequest {
  userId: string;
  userData: Partial<UserForm>;
}

interface UpdatePermissionsRequest {
  userId: string;
  permissions: string[];
}

// Утилиты для работы с API
class ApiClient {
  private baseUrl: string;
  private token: string | null = null;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
    this.token = localStorage.getItem('auth_token');
  }

  public getHeaders(): HeadersInit {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };

    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }

    return headers;
  }

  public async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    try {
      const response = await fetch(`${this.baseUrl}${endpoint}`, {
        ...options,
        headers: {
          ...this.getHeaders(),
          ...options.headers,
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('API request failed:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  async get<T>(endpoint: string): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { method: 'GET' });
  }

  async post<T>(endpoint: string, data: any): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async put<T>(endpoint: string, data: any): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async delete<T>(endpoint: string): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { method: 'DELETE' });
  }

  setToken(token: string) {
    this.token = token;
    localStorage.setItem('auth_token', token);
  }

  clearToken() {
    this.token = null;
    localStorage.removeItem('auth_token');
  }

  // Публичный метод для специальных запросов
  async customRequest<T>(endpoint: string, options: RequestInit = {}): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, options);
  }

  // Публичный метод для получения заголовков
  getPublicHeaders(): HeadersInit {
    return this.getHeaders();
  }
}

// Создаем экземпляр API клиента
const apiClient = new ApiClient(API_BASE_URL);

// API функции для управления пользователями
export const usersApi = {
  // Аутентификация
  async login(credentials: LoginRequest): Promise<ApiResponse<LoginResponse>> {
    const response = await apiClient.post<LoginResponse>('/auth/login', credentials);
    
    if (response.success && response.data) {
      apiClient.setToken(response.data.token);
    }
    
    return response;
  },

  async logout(): Promise<ApiResponse<void>> {
    const response = await apiClient.post<void>('/auth/logout', {});
    apiClient.clearToken();
    return response;
  },

  async refreshToken(): Promise<ApiResponse<LoginResponse>> {
    return apiClient.post<LoginResponse>('/auth/refresh', {});
  },

  // Получение пользователей
  async getUsers(
    filters: UserFilters = {},
    page: number = 1,
    limit: number = 20
  ): Promise<PaginatedResponse<User>> {
    const queryParams = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
      ...Object.fromEntries(
        Object.entries(filters).filter(([_, value]) => value !== undefined && value !== '')
      ),
    });

    const response = await apiClient.get<{
      users: User[];
      pagination: PaginatedResponse<User>['pagination'];
    }>(`/users?${queryParams}`);

    if (response.success && response.data) {
      return {
        success: true,
        data: response.data.users,
        pagination: response.data.pagination,
      };
    }

    return {
      success: false,
      data: [],
      pagination: { page: 1, limit: 20, total: 0, totalPages: 0 },
    };
  },

  // Получение одного пользователя
  async getUser(userId: string): Promise<ApiResponse<User>> {
    return apiClient.get<User>(`/users/${userId}`);
  },

  // Создание пользователя
  async createUser(userData: UserForm): Promise<ApiResponse<User>> {
    return apiClient.post<User>('/users', { userData });
  },

  // Обновление пользователя
  async updateUser(userId: string, userData: Partial<UserForm>): Promise<ApiResponse<User>> {
    return apiClient.put<User>(`/users/${userId}`, { userData });
  },

  // Удаление пользователя
  async deleteUser(userId: string): Promise<ApiResponse<void>> {
    return apiClient.delete<void>(`/users/${userId}`);
  },

  // Управление правами доступа
  async updateUserPermissions(userId: string, permissions: string[]): Promise<ApiResponse<User>> {
    return apiClient.put<User>(`/users/${userId}/permissions`, { permissions });
  },

  // Изменение статуса пользователя
  async updateUserStatus(userId: string, status: UserStatus): Promise<ApiResponse<User>> {
    return apiClient.put<User>(`/users/${userId}/status`, { status });
  },

  // Изменение роли пользователя
  async updateUserRole(userId: string, role: UserRole): Promise<ApiResponse<User>> {
    return apiClient.put<User>(`/users/${userId}/role`, { role });
  },

  // Статистика пользователей
  async getUserStats(): Promise<ApiResponse<UserStats>> {
    return apiClient.get<UserStats>('/users/stats');
  },

  // Получение текущего пользователя
  async getCurrentUser(): Promise<ApiResponse<User>> {
    return apiClient.get<User>('/users/me');
  },

  // Смена пароля
  async changePassword(oldPassword: string, newPassword: string): Promise<ApiResponse<void>> {
    return apiClient.put<void>('/users/me/password', {
      oldPassword,
      newPassword,
    });
  },

  // Сброс пароля
  async resetPassword(email: string): Promise<ApiResponse<void>> {
    return apiClient.post<void>('/auth/reset-password', { email });
  },

  // Подтверждение email
  async verifyEmail(token: string): Promise<ApiResponse<void>> {
    return apiClient.post<void>('/auth/verify-email', { token });
  },

  // Повторная отправка письма подтверждения
  async resendVerificationEmail(userId: string): Promise<ApiResponse<void>> {
    return apiClient.post<void>(`/users/${userId}/resend-verification`, {});
  },

  // Получение активности пользователя
  async getUserActivity(
    userId: string,
    page: number = 1,
    limit: number = 20
  ): Promise<PaginatedResponse<any>> {
    const response = await apiClient.get<{
      activities: any[];
      pagination: PaginatedResponse<any>['pagination'];
    }>(`/users/${userId}/activity?page=${page}&limit=${limit}`);

    if (response.success && response.data) {
      return {
        success: true,
        data: response.data.activities,
        pagination: response.data.pagination,
      };
    }

    return {
      success: false,
      data: [],
      pagination: { page: 1, limit: 20, total: 0, totalPages: 0 },
    };
  },

  // Массовые операции
  async bulkUpdateUsers(userIds: string[], updates: Partial<UserForm>): Promise<ApiResponse<void>> {
    return apiClient.put<void>('/users/bulk', {
      userIds,
      updates,
    });
  },

  async bulkDeleteUsers(userIds: string[]): Promise<ApiResponse<void>> {
    return apiClient.put<void>('/users/bulk/delete', { userIds });
  },

  // Экспорт пользователей
  async exportUsers(filters: UserFilters = {}): Promise<ApiResponse<Blob>> {
    const queryParams = new URLSearchParams(
      Object.fromEntries(
        Object.entries(filters).filter(([_, value]) => value !== undefined && value !== '')
      )
    );

    try {
      const response = await fetch(`${API_BASE_URL}/users/export?${queryParams}`, {
        headers: apiClient.getPublicHeaders(),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const blob = await response.blob();
      return { success: true, data: blob };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Export failed',
      };
    }
  },
};

// Хуки для React Query (опциональные)
export const userQueryKeys = {
  all: ['users'] as const,
  lists: () => [...userQueryKeys.all, 'list'] as const,
  list: (filters: UserFilters) => [...userQueryKeys.lists(), filters] as const,
  details: () => [...userQueryKeys.all, 'detail'] as const,
  detail: (id: string) => [...userQueryKeys.details(), id] as const,
  stats: () => [...userQueryKeys.all, 'stats'] as const,
};

// Вспомогательные функции
export const userHelpers = {
  // Проверка прав доступа
  hasPermission(user: User, permission: string): boolean {
    return user.permissions.includes('all') || user.permissions.includes(permission);
  },

  // Проверка роли
  hasRole(user: User, roles: UserRole[]): boolean {
    return roles.includes(user.role);
  },

  // Проверка уровня доступа
  hasMinimumRole(user: User, minimumRole: UserRole): boolean {
    const roleHierarchy: Record<UserRole, number> = {
      client: 1,
      editor: 2,
      moderator: 3,
      admin: 4,
      company_admin: 5,
      super_admin: 6,
    };

    return roleHierarchy[user.role] >= roleHierarchy[minimumRole];
  },

  // Форматирование имени пользователя
  getFullName(user: User): string {
    return `${user.firstName} ${user.lastName}`.trim();
  },

  // Получение инициалов
  getInitials(user: User): string {
    return `${user.firstName[0] || ''}${user.lastName[0] || ''}`.toUpperCase();
  },

  // Проверка активности
  isActive(user: User): boolean {
    return user.status === 'active';
  },

  // Форматирование последнего входа
  getLastLoginDisplay(user: User): string {
    if (!user.lastLoginAt) return 'Никогда';
    
    const now = new Date();
    const lastLogin = new Date(user.lastLoginAt);
    const diffInHours = Math.floor((now.getTime() - lastLogin.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Только что';
    if (diffInHours < 24) return `${diffInHours} ч. назад`;
    if (diffInHours < 24 * 7) return `${Math.floor(diffInHours / 24)} дн. назад`;
    
    return lastLogin.toLocaleDateString('ru-RU');
  },
};

// Мок-режим для разработки (временно, пока нет бэкенда)
const MOCK_MODE = process.env.REACT_APP_MOCK_API === 'true';

if (MOCK_MODE) {
  console.warn('🚧 API работает в mock-режиме. Подключите реальный бэкенд для продакшна.');
}

export default usersApi; 