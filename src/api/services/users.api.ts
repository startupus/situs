/**
 * Users API Service
 * Управление пользователями, аутентификация и профили
 */

import { apiClient, ApiResponse, ApiUtils } from '../client';

export interface User {
  id: string;
  username: string;
  email: string;
  role: 'ADMIN' | 'USER';
  status: 'ACTIVE' | 'INACTIVE' | 'SUSPENDED';
  createdAt: string;
  updatedAt: string;
  profile?: UserProfile;
  balances?: UserBalance[];
}

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
  role?: 'ADMIN' | 'USER';
}

export interface UpdateUserData {
  username?: string;
  email?: string;
  role?: 'ADMIN' | 'USER';
  status?: 'ACTIVE' | 'INACTIVE' | 'SUSPENDED';
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

class UsersApiService {
  private readonly baseEndpoint = '/api/users';
  private readonly authEndpoint = '/api/auth';

  /**
   * Аутентификация пользователя
   */
  async login(credentials: AuthCredentials): Promise<AuthResponse> {
    try {
      const response = await apiClient.post<ApiResponse<AuthResponse>>(
        `${this.authEndpoint}/login`,
        credentials
      );

      if (ApiUtils.isSuccess(response)) {
        // Сохраняем токен в localStorage
        localStorage.setItem('auth_token', response.data.token);
        apiClient.setAuthToken(response.data.token);
        
        return response.data;
      }

      throw new Error(response.error || 'Ошибка аутентификации');
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
      const response = await apiClient.post<ApiResponse<AuthResponse>>(
        `${this.authEndpoint}/register`,
        userData
      );

      if (ApiUtils.isSuccess(response)) {
        // Сохраняем токен в localStorage
        localStorage.setItem('auth_token', response.data.token);
        apiClient.setAuthToken(response.data.token);
        
        return response.data;
      }

      throw new Error(response.error || 'Ошибка регистрации');
    } catch (error) {
      console.error('Register API Error:', error);
      throw new Error(ApiUtils.handleError(error));
    }
  }

  /**
   * Выход из системы
   */
  logout(): void {
    localStorage.removeItem('auth_token');
    apiClient.removeAuthToken();
  }

  /**
   * Получить текущего пользователя
   */
  async getCurrentUser(): Promise<User> {
    try {
      const response = await apiClient.get<ApiResponse<User>>(
        `${this.authEndpoint}/me`
      );

      if (ApiUtils.isSuccess(response)) {
        return response.data;
      }

      throw new Error(response.error || 'Ошибка получения профиля');
    } catch (error) {
      console.error('Get Current User API Error:', error);
      throw new Error(ApiUtils.handleError(error));
    }
  }

  /**
   * Получить список пользователей (только для админов)
   */
  async getUsers(filters?: UserFilters): Promise<UsersListResponse> {
    try {
      const response = await apiClient.get<ApiResponse<UsersListResponse>>(
        this.baseEndpoint,
        filters
      );

      if (ApiUtils.isSuccess(response)) {
        return response.data;
      }

      throw new Error(response.error || 'Ошибка при загрузке пользователей');
    } catch (error) {
      console.error('Users API Error:', error);
      throw new Error(ApiUtils.handleError(error));
    }
  }

  /**
   * Получить отдельного пользователя
   */
  async getUser(userId: string): Promise<User> {
    try {
      const response = await apiClient.get<ApiResponse<User>>(
        `${this.baseEndpoint}/${userId}`
      );

      if (ApiUtils.isSuccess(response)) {
        return response.data;
      }

      throw new Error(response.error || 'Пользователь не найден');
    } catch (error) {
      console.error('Get User API Error:', error);
      throw new Error(ApiUtils.handleError(error));
    }
  }

  /**
   * Создать нового пользователя (только для админов)
   */
  async createUser(data: CreateUserData): Promise<User> {
    try {
      const response = await apiClient.post<ApiResponse<User>>(
        this.baseEndpoint,
        data
      );

      if (ApiUtils.isSuccess(response)) {
        return response.data;
      }

      throw new Error(response.error || 'Ошибка при создании пользователя');
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
      const response = await apiClient.put<ApiResponse<User>>(
        `${this.baseEndpoint}/${userId}`,
        data
      );

      if (ApiUtils.isSuccess(response)) {
        return response.data;
      }

      throw new Error(response.error || 'Ошибка при обновлении пользователя');
    } catch (error) {
      console.error('Update User API Error:', error);
      throw new Error(ApiUtils.handleError(error));
    }
  }

  /**
   * Обновить профиль текущего пользователя
   */
  async updateProfile(data: Partial<UserProfile>): Promise<User> {
    try {
      const response = await apiClient.patch<ApiResponse<User>>(
        `${this.authEndpoint}/profile`,
        { profile: data }
      );

      if (ApiUtils.isSuccess(response)) {
        return response.data;
      }

      throw new Error(response.error || 'Ошибка при обновлении профиля');
    } catch (error) {
      console.error('Update Profile API Error:', error);
      throw new Error(ApiUtils.handleError(error));
    }
  }

  /**
   * Удалить пользователя (только для админов)
   */
  async deleteUser(userId: string): Promise<void> {
    try {
      const response = await apiClient.delete<ApiResponse<void>>(
        `${this.baseEndpoint}/${userId}`
      );

      if (!ApiUtils.isSuccess(response)) {
        throw new Error(response.error || 'Ошибка при удалении пользователя');
      }
    } catch (error) {
      console.error('Delete User API Error:', error);
      throw new Error(ApiUtils.handleError(error));
    }
  }

  /**
   * Изменить статус пользователя
   */
  async updateUserStatus(userId: string, status: 'ACTIVE' | 'INACTIVE' | 'SUSPENDED'): Promise<void> {
    try {
      const response = await apiClient.patch<ApiResponse<void>>(
        `${this.baseEndpoint}/${userId}/status`,
        { status }
      );

      if (!ApiUtils.isSuccess(response)) {
        throw new Error(response.error || 'Ошибка при обновлении статуса');
      }
    } catch (error) {
      console.error('Update User Status API Error:', error);
      throw new Error(ApiUtils.handleError(error));
    }
  }

  /**
   * Загрузить аватар пользователя
   */
  async uploadAvatar(file: File): Promise<{ url: string }> {
    try {
      const formData = new FormData();
      formData.append('avatar', file);

      const response = await apiClient.upload<ApiResponse<{ url: string }>>(
        `${this.authEndpoint}/avatar`,
        formData
      );

      if (ApiUtils.isSuccess(response)) {
        return response.data;
      }

      throw new Error(response.error || 'Ошибка при загрузке аватара');
    } catch (error) {
      console.error('Upload Avatar API Error:', error);
      throw new Error(ApiUtils.handleError(error));
    }
  }

  /**
   * Смена пароля
   */
  async changePassword(currentPassword: string, newPassword: string): Promise<void> {
    try {
      const response = await apiClient.post<ApiResponse<void>>(
        `${this.authEndpoint}/change-password`,
        { currentPassword, newPassword }
      );

      if (!ApiUtils.isSuccess(response)) {
        throw new Error(response.error || 'Ошибка при смене пароля');
      }
    } catch (error) {
      console.error('Change Password API Error:', error);
      throw new Error(ApiUtils.handleError(error));
    }
  }
}

export const usersApi = new UsersApiService();
export default usersApi;