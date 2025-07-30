/**
 * Centralized API Client для Situs Platform
 * Следует принципам Strapi CMS для стандартизированного API
 */
class ApiClient {
    baseURL;
    defaultHeaders;
    constructor() {
        // Определяем базовый URL в зависимости от окружения
        this.baseURL = this.getBaseURL();
        this.defaultHeaders = {
            'Content-Type': 'application/json',
        };
    }
    getBaseURL() {
        // Проверяем переменные окружения
        if (typeof window !== 'undefined') {
            // Frontend environment
            return import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001';
        }
        // Fallback for server-side
        return process.env.API_BASE_URL || 'http://localhost:3001';
    }
    /**
     * Установка JWT токена для аутентификации
     */
    setAuthToken(token) {
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
    getStoredToken() {
        if (typeof window !== 'undefined') {
            return localStorage.getItem('auth_token');
        }
        return null;
    }
    /**
     * Базовый метод для выполнения HTTP запросов
     */
    async request(endpoint, options = {}) {
        const url = `${this.baseURL}${endpoint}`;
        // Автоматически добавляем токен если он есть
        const token = this.getStoredToken();
        const headers = { ...this.defaultHeaders };
        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
        }
        const config = {
            headers,
            ...options,
        };
        try {
            const response = await fetch(url, config);
            // Обработка ответов с ошибками
            if (!response.ok) {
                const errorData = await response.json().catch(() => ({
                    error: 'Network Error',
                    message: `HTTP ${response.status}: ${response.statusText}`,
                    statusCode: response.status
                }));
                throw new ApiClientError(errorData.message, errorData.statusCode, errorData);
            }
            const data = await response.json();
            return data;
        }
        catch (error) {
            if (error instanceof ApiClientError) {
                throw error;
            }
            // Обработка сетевых ошибок
            throw new ApiClientError('Ошибка сети. Проверьте подключение к интернету.', 0, { error: 'NetworkError', message: String(error) });
        }
    }
    /**
     * GET запрос
     */
    async get(endpoint, params) {
        const searchParams = params ? '?' + new URLSearchParams(params).toString() : '';
        return this.request(`${endpoint}${searchParams}`, {
            method: 'GET',
        });
    }
    /**
     * POST запрос
     */
    async post(endpoint, data) {
        return this.request(endpoint, {
            method: 'POST',
            body: data ? JSON.stringify(data) : undefined,
        });
    }
    /**
     * PUT запрос
     */
    async put(endpoint, data) {
        return this.request(endpoint, {
            method: 'PUT',
            body: data ? JSON.stringify(data) : undefined,
        });
    }
    /**
     * PATCH запрос
     */
    async patch(endpoint, data) {
        return this.request(endpoint, {
            method: 'PATCH',
            body: data ? JSON.stringify(data) : undefined,
        });
    }
    /**
     * DELETE запрос
     */
    async delete(endpoint) {
        return this.request(endpoint, {
            method: 'DELETE',
        });
    }
    /**
     * Upload файлов
     */
    async upload(endpoint, formData) {
        const headers = { ...this.defaultHeaders };
        delete headers['Content-Type']; // Позволяем браузеру установить правильный Content-Type для FormData
        const token = this.getStoredToken();
        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
        }
        return this.request(endpoint, {
            method: 'POST',
            headers,
            body: formData,
        });
    }
}
/**
 * Кастомная ошибка для API клиента
 */
export class ApiClientError extends Error {
    statusCode;
    apiError;
    constructor(message, statusCode = 0, apiError) {
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
 * Хелперы для работы с API ответами
 */
export const ApiUtils = {
    /**
     * Проверка успешности ответа
     */
    isSuccess(response) {
        return response.success === true && response.data !== undefined;
    },
    /**
     * Извлечение данных из ответа
     */
    getData(response) {
        return this.isSuccess(response) ? response.data : null;
    },
    /**
     * Обработка ошибки API
     */
    handleError(error) {
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
//# sourceMappingURL=client.js.map