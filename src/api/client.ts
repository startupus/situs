/**
 * Centralized API Client для Situs Platform
 * Следует принципам Strapi CMS для стандартизированного API
 */

interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

interface ApiError {
  error: string;
  message: string;
  statusCode?: number;
  timestamp?: string;
}

class ApiClient {
  private baseURL: string;
  private defaultHeaders: Record<string, string>;

  constructor() {
    // Определяем базовый URL в зависимости от окружения
    this.baseURL = this.getBaseURL();
    this.defaultHeaders = {
      'Content-Type': 'application/json',
    };
  }

  private getBaseURL(): string {
    // В браузере по умолчанию работаем через тот же origin, чтобы избежать CORS и использовать Vite proxy
    if (typeof window !== 'undefined') {
      const envBase = (import.meta as any)?.env?.VITE_API_BASE_URL as string | undefined;
      return envBase && envBase.trim().length > 0 ? envBase : window.location.origin;
    }
    // На сервере читаем из переменных окружения, иначе localhost (используется редко)
    return process.env.API_BASE_URL || 'http://localhost:3001';
  }

  /**
   * Установка JWT токена для аутентификации
   */
  setAuthToken(token: string) {
    this.defaultHeaders['Authorization'] = `Bearer ${token}`;
  }

  /**
   * Удаление токена аутентификации
   */
  removeAuthToken() {
    delete this.defaultHeaders['Authorization'];
  }

  /**
   * Получение токена из localStorage
   */
  private getStoredToken(): string | null {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('auth_token');
    }
    return null;
  }

  /**
   * Базовый метод для выполнения HTTP запросов
   */
  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    // Для health endpoint используем прямой путь
    const isHealthCheck = endpoint.startsWith('/health');
    const baseUrl = this.baseURL; // базовый URL без /api — endpoint включает нужный префикс
    const url = `${baseUrl}${endpoint}`;
    
    // Автоматически добавляем токен если он есть
    const token = this.getStoredToken();
    const headers = { ...this.defaultHeaders };
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const config: RequestInit = {
      headers,
      ...options,
    };

    try {
      const response = await fetch(url, config);
      
      // Обработка ответов с ошибками
      if (!response.ok) {
        const status = response.status;
        const fallbackMsg = `HTTP ${status}: ${response.statusText}`;
        const errorData: ApiError = await response.json().catch(() => ({
          error: 'Network Error',
          message: fallbackMsg,
          statusCode: status,
        }));
        const friendly = (() => {
          if (status === 401) return 'Требуется авторизация';
          if (status === 403) return 'Недостаточно прав (доступ запрещён)';
          if (status === 404) return 'Ресурс не найден';
          if (status >= 500) return 'Ошибка сервера. Попробуйте позже';
          return errorData.message || fallbackMsg;
        })();
        throw new ApiClientError(friendly, errorData.statusCode ?? status, errorData);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      if (error instanceof ApiClientError) {
        throw error;
      }
      
      // Обработка сетевых ошибок
      throw new ApiClientError(
        'Ошибка сети. Проверьте подключение к интернету.',
        0,
        { error: 'NetworkError', message: String(error) }
      );
    }
  }

  /**
   * GET запрос
   */
  async get<T>(endpoint: string, params?: Record<string, any>): Promise<T> {
    const searchParams = params ? '?' + new URLSearchParams(params).toString() : '';
    return this.request<T>(`${endpoint}${searchParams}`, {
      method: 'GET',
    });
  }

  /**
   * POST запрос
   */
  async post<T>(endpoint: string, data?: any): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  /**
   * PUT запрос
   */
  async put<T>(endpoint: string, data?: any): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  /**
   * PATCH запрос
   */
  async patch<T>(endpoint: string, data?: any): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'PATCH',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  /**
   * DELETE запрос
   */
  async delete<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'DELETE',
    });
  }

  /**
   * Upload файлов
   */
  async upload<T>(endpoint: string, formData: FormData): Promise<T> {
    const headers = { ...this.defaultHeaders };
    delete headers['Content-Type']; // Позволяем браузеру установить правильный Content-Type для FormData
    
    const token = this.getStoredToken();
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    return this.request<T>(endpoint, {
      method: 'POST',
      headers,
      body: formData,
    });
  }

  // === PAGES API ===

  /**
   * Получение списка страниц
   */
  async getPages(params?: any): Promise<ApiResponse<any[]>> {
    return this.get('/api/pages', params);
  }

  /**
   * Получение страницы по ID
   */
  async getPage(id: string): Promise<ApiResponse<any>> {
    return this.get(`/api/pages/${id}`);
  }

  /**
   * Создание страницы
   */
  async createPage(pageData: any): Promise<ApiResponse<any>> {
    return this.post('/api/pages', pageData);
  }

  /**
   * Обновление страницы
   */
  async updatePage(id: string, pageData: any): Promise<ApiResponse<any>> {
    return this.put(`/api/pages/${id}`, pageData);
  }

  /**
   * Удаление страницы
   */
  async deletePage(id: string): Promise<ApiResponse<any>> {
    return this.delete(`/api/pages/${id}`);
  }
}

/**
 * Кастомная ошибка для API клиента
 */
export class ApiClientError extends Error {
  public statusCode: number;
  public apiError: ApiError;

  constructor(message: string, statusCode: number = 0, apiError: ApiError) {
    super(message);
    this.name = 'ApiClientError';
    this.statusCode = statusCode;
    this.apiError = apiError;
  }
}

/**
 * Singleton instance API клиента
 */
export const apiClient = new ApiClient();

/**
 * Типы для стандартизированных API ответов
 */
export type { ApiResponse, ApiError };

/**
 * Хелперы для работы с API ответами
 */
export const ApiUtils = {
  /**
   * Проверка успешности ответа
   */
  isSuccess<T>(response: ApiResponse<T>): response is ApiResponse<T> & { success: true; data: T } {
    return response.success === true && response.data !== undefined;
  },

  /**
   * Извлечение данных из ответа
   */
  getData<T>(response: ApiResponse<T>): T | null {
    return this.isSuccess(response) ? response.data : null;
  },

  /**
   * Обработка ошибки API
   */
  handleError(error: unknown): string {
    if (error instanceof ApiClientError) {
      return error.message;
    }
    if (error instanceof Error) {
      return error.message;
    }
    return 'Произошла неизвестная ошибка';
  }
};

export default apiClient;