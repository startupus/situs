/**
 * API Client - Клиент для работы с REST API
 * Обеспечивает единую точку доступа к серверным данным
 */

export interface ApiResponse<T = any> {
  data?: T;
  meta?: {
    total?: number;
    page?: number;
    limit?: number;
    totalPages?: number;
  };
  error?: {
    status: number;
    name: string;
    message: string;
    details?: any;
  };
}

export interface RequestConfig {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  headers?: Record<string, string>;
  body?: any;
  params?: Record<string, string>;
}

export interface PaginationParams {
  page?: number;
  limit?: number;
  search?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

class ApiClient {
  private baseURL: string;
  private defaultHeaders: Record<string, string>;

  constructor(baseURL: string = '/api') {
    this.baseURL = baseURL;
    this.defaultHeaders = {
      'Content-Type': 'application/json',
    };
  }

  /**
   * Установка токена авторизации
   */
  setAuthToken(token: string): void {
    this.defaultHeaders['Authorization'] = `Bearer ${token}`;
  }

  /**
   * Удаление токена авторизации
   */
  removeAuthToken(): void {
    delete this.defaultHeaders['Authorization'];
  }

  /**
   * Получение токена из localStorage
   */
  private getStoredToken(): string | null {
    return localStorage.getItem('auth_token');
  }

  /**
   * Основной метод для выполнения запросов
   */
  private async request<T>(endpoint: string, config: RequestConfig = {}): Promise<ApiResponse<T>> {
    const url = new URL(endpoint, window.location.origin + this.baseURL);
    
    // Добавляем параметры запроса
    if (config.params) {
      Object.entries(config.params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          url.searchParams.append(key, value);
        }
      });
    }

    // Подготавливаем заголовки
    const headers = {
      ...this.defaultHeaders,
      ...config.headers,
    };

    // Автоматически добавляем токен из localStorage если он есть
    const storedToken = this.getStoredToken();
    if (storedToken && !headers['Authorization']) {
      headers['Authorization'] = `Bearer ${storedToken}`;
    }

    const requestConfig: RequestInit = {
      method: config.method || 'GET',
      headers,
    };

    // Добавляем тело запроса для методов, которые его поддерживают
    if (config.body && ['POST', 'PUT', 'PATCH'].includes(requestConfig.method!)) {
      requestConfig.body = JSON.stringify(config.body);
    }

    try {
      const response = await fetch(url.toString(), requestConfig);
      const data = await response.json();

      if (!response.ok) {
        return {
          error: {
            status: response.status,
            name: data.error?.name || 'ApiError',
            message: data.error?.message || 'Произошла ошибка при выполнении запроса',
            details: data.error?.details
          }
        };
      }

      return { data: data.data || data, meta: data.meta };
    } catch (error) {
      console.error('API Request Error:', error);
      return {
        error: {
          status: 0,
          name: 'NetworkError',
          message: 'Ошибка сети или сервер недоступен'
        }
      };
    }
  }

  /**
   * GET запрос
   */
  async get<T>(endpoint: string, params?: Record<string, string>): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { method: 'GET', params });
  }

  /**
   * POST запрос
   */
  async post<T>(endpoint: string, body?: any): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { method: 'POST', body });
  }

  /**
   * PUT запрос
   */
  async put<T>(endpoint: string, body?: any): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { method: 'PUT', body });
  }

  /**
   * DELETE запрос
   */
  async delete<T>(endpoint: string): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { method: 'DELETE' });
  }

  /**
   * PATCH запрос
   */
  async patch<T>(endpoint: string, body?: any): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { method: 'PATCH', body });
  }

  // === AUTH API ===

  /**
   * Авторизация пользователя
   */
  async login(credentials: { email: string; password: string }): Promise<ApiResponse<{ jwt: string; user: any }>> {
    const response = await this.post<{ jwt: string; user: any }>('/auth/login', credentials);
    
    if (response.data?.jwt) {
      localStorage.setItem('auth_token', response.data.jwt);
      this.setAuthToken(response.data.jwt);
    }
    
    return response;
  }

  /**
   * Регистрация пользователя
   */
  async register(userData: { email: string; password: string; firstName?: string; lastName?: string }): Promise<ApiResponse<{ jwt: string; user: any }>> {
    const response = await this.post<{ jwt: string; user: any }>('/auth/register', userData);
    
    if (response.data?.jwt) {
      localStorage.setItem('auth_token', response.data.jwt);
      this.setAuthToken(response.data.jwt);
    }
    
    return response;
  }

  /**
   * Выход из системы
   */
  async logout(): Promise<ApiResponse<any>> {
    const response = await this.post('/auth/logout');
    localStorage.removeItem('auth_token');
    this.removeAuthToken();
    return response;
  }

  /**
   * Проверка токена
   */
  async verifyToken(): Promise<ApiResponse<{ user: any; valid: boolean }>> {
    return this.post('/auth/verify-token');
  }

  /**
   * Обновление токена
   */
  async refreshToken(): Promise<ApiResponse<{ jwt: string; user: any }>> {
    const response = await this.post<{ jwt: string; user: any }>('/auth/refresh-token');
    
    if (response.data?.jwt) {
      localStorage.setItem('auth_token', response.data.jwt);
      this.setAuthToken(response.data.jwt);
    }
    
    return response;
  }

  // === USERS API ===

  /**
   * Получение профиля текущего пользователя
   */
  async getCurrentUser(): Promise<ApiResponse<any>> {
    return this.get('/users/me');
  }

  /**
   * Обновление профиля текущего пользователя
   */
  async updateCurrentUser(userData: any): Promise<ApiResponse<any>> {
    return this.put('/users/me', userData);
  }

  /**
   * Получение списка пользователей (для админов)
   */
  async getUsers(params?: PaginationParams & { role?: string; isActive?: boolean }): Promise<ApiResponse<any[]>> {
    return this.get('/users', params as Record<string, string>);
  }

  /**
   * Получение пользователя по ID
   */
  async getUser(id: string): Promise<ApiResponse<any>> {
    return this.get(`/users/${id}`);
  }

  /**
   * Создание пользователя (для админов)
   */
  async createUser(userData: any): Promise<ApiResponse<any>> {
    return this.post('/users', userData);
  }

  /**
   * Обновление пользователя (для админов)
   */
  async updateUser(id: string, userData: any): Promise<ApiResponse<any>> {
    return this.put(`/users/${id}`, userData);
  }

  /**
   * Удаление пользователя (для админов)
   */
  async deleteUser(id: string): Promise<ApiResponse<any>> {
    return this.delete(`/users/${id}`);
  }

  /**
   * Активация пользователя (для админов)
   */
  async activateUser(id: string): Promise<ApiResponse<any>> {
    return this.put(`/users/${id}/activate`);
  }

  /**
   * Деактивация пользователя (для админов)
   */
  async deactivateUser(id: string): Promise<ApiResponse<any>> {
    return this.put(`/users/${id}/deactivate`);
  }

  /**
   * Получение статистики пользователей
   */
  async getUsersStatistics(): Promise<ApiResponse<any>> {
    return this.get('/users/statistics');
  }

  // === PROJECTS API ===

  /**
   * Получение списка проектов
   */
  async getProjects(params?: PaginationParams & { status?: string }): Promise<ApiResponse<any[]>> {
    return this.get('/projects', params as Record<string, string>);
  }

  /**
   * Получение проекта по ID
   */
  async getProject(id: string): Promise<ApiResponse<any>> {
    return this.get(`/projects/${id}`);
  }

  /**
   * Создание проекта
   */
  async createProject(projectData: any): Promise<ApiResponse<any>> {
    return this.post('/projects', projectData);
  }

  /**
   * Обновление проекта
   */
  async updateProject(id: string, projectData: any): Promise<ApiResponse<any>> {
    return this.put(`/projects/${id}`, projectData);
  }

  /**
   * Удаление проекта
   */
  async deleteProject(id: string): Promise<ApiResponse<any>> {
    return this.delete(`/projects/${id}`);
  }

  /**
   * Публикация проекта
   */
  async publishProject(id: string): Promise<ApiResponse<any>> {
    return this.put(`/projects/${id}/publish`);
  }

  /**
   * Снятие проекта с публикации
   */
  async unpublishProject(id: string): Promise<ApiResponse<any>> {
    return this.put(`/projects/${id}/unpublish`);
  }

  /**
   * Получение статистики проектов
   */
  async getProjectsStatistics(): Promise<ApiResponse<any>> {
    return this.get('/projects/statistics');
  }

  // === PAGES API ===

  /**
   * Получение списка страниц
   */
  async getPages(params?: PaginationParams & { projectId?: string; status?: string }): Promise<ApiResponse<any[]>> {
    return this.get('/pages', params as Record<string, string>);
  }

  /**
   * Получение страницы по ID
   */
  async getPage(id: string): Promise<ApiResponse<any>> {
    return this.get(`/pages/${id}`);
  }

  /**
   * Создание страницы
   */
  async createPage(pageData: any): Promise<ApiResponse<any>> {
    return this.post('/pages', pageData);
  }

  /**
   * Обновление страницы
   */
  async updatePage(id: string, pageData: any): Promise<ApiResponse<any>> {
    return this.put(`/pages/${id}`, pageData);
  }

  /**
   * Удаление страницы
   */
  async deletePage(id: string): Promise<ApiResponse<any>> {
    return this.delete(`/pages/${id}`);
  }

  /**
   * Дублирование страницы
   */
  async duplicatePage(id: string, title?: string): Promise<ApiResponse<any>> {
    return this.post(`/pages/${id}/duplicate`, { title });
  }

  /**
   * Публикация страницы
   */
  async publishPage(id: string): Promise<ApiResponse<any>> {
    return this.put(`/pages/${id}/publish`);
  }

  /**
   * Снятие страницы с публикации
   */
  async unpublishPage(id: string): Promise<ApiResponse<any>> {
    return this.put(`/pages/${id}/unpublish`);
  }

  // === ANALYTICS API ===

  /**
   * Получение данных роста пользователей
   */
  async getUserGrowthAnalytics(period: '7d' | '30d' | '90d' | '1y' = '30d'): Promise<ApiResponse<any>> {
    return this.get(`/analytics/user-growth?period=${period}`);
  }

  /**
   * Получение распределения проектов по типам
   */
  async getProjectDistributionAnalytics(period: '7d' | '30d' | '90d' | '1y' = '30d'): Promise<ApiResponse<any>> {
    return this.get(`/analytics/project-distribution?period=${period}`);
  }

  /**
   * Получение данных о доходах
   */
  async getRevenueAnalytics(period: '7d' | '30d' | '90d' | '1y' = '30d'): Promise<ApiResponse<any>> {
    return this.get(`/analytics/revenue?period=${period}`);
  }

  /**
   * Получение последней активности
   */
  async getActivityAnalytics(params?: { limit?: number; type?: 'user' | 'project' | 'page' | 'all' }): Promise<ApiResponse<any>> {
    const queryParams = params ? `?${new URLSearchParams(params as any).toString()}` : '';
    return this.get(`/analytics/activity${queryParams}`);
  }

  // === UTILITY METHODS ===

  /**
   * Проверка состояния API
   */
  async healthCheck(): Promise<ApiResponse<any>> {
    return this.get('/health');
  }

  /**
   * Получение информации об API
   */
  async getApiInfo(): Promise<ApiResponse<any>> {
    return this.get('/');
  }
}

// Экспорт singleton instance
export const apiClient = new ApiClient();
export default apiClient;