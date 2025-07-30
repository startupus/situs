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
declare class ApiClient {
    private baseURL;
    private defaultHeaders;
    constructor();
    private getBaseURL;
    /**
     * Установка JWT токена для аутентификации
     */
    setAuthToken(token: string): void;
    /**
     * Удаление токена аутентификации
     */
    removeAuthToken(): void;
    /**
     * Получение токена из localStorage
     */
    private getStoredToken;
    /**
     * Базовый метод для выполнения HTTP запросов
     */
    private request;
    /**
     * GET запрос
     */
    get<T>(endpoint: string, params?: Record<string, any>): Promise<T>;
    /**
     * POST запрос
     */
    post<T>(endpoint: string, data?: any): Promise<T>;
    /**
     * PUT запрос
     */
    put<T>(endpoint: string, data?: any): Promise<T>;
    /**
     * PATCH запрос
     */
    patch<T>(endpoint: string, data?: any): Promise<T>;
    /**
     * DELETE запрос
     */
    delete<T>(endpoint: string): Promise<T>;
    /**
     * Upload файлов
     */
    upload<T>(endpoint: string, formData: FormData): Promise<T>;
}
/**
 * Кастомная ошибка для API клиента
 */
export declare class ApiClientError extends Error {
    statusCode: number;
    apiError: ApiError;
    constructor(message: string, statusCode: number | undefined, apiError: ApiError);
}
/**
 * Singleton instance API клиента
 */
export declare const apiClient: ApiClient;
/**
 * Типы для стандартизированных API ответов
 */
export type { ApiResponse, ApiError };
/**
 * Хелперы для работы с API ответами
 */
export declare const ApiUtils: {
    /**
     * Проверка успешности ответа
     */
    isSuccess<T>(response: ApiResponse<T>): response is ApiResponse<T> & {
        success: true;
        data: T;
    };
    /**
     * Извлечение данных из ответа
     */
    getData<T>(response: ApiResponse<T>): T | null;
    /**
     * Обработка ошибки API
     */
    handleError(error: unknown): string;
};
export default apiClient;
//# sourceMappingURL=client.d.ts.map