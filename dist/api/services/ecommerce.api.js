/**
 * E-commerce API Service
 * Управление магазинами, продуктами и продажами
 */
import { apiClient, ApiUtils } from '../client';
class EcommerceApiService {
    baseEndpoint = '/api/ecommerce';
    /**
     * Получить список магазинов
     */
    async getStores(filters) {
        try {
            const response = await apiClient.get(`${this.baseEndpoint}/stores`, filters);
            if (ApiUtils.isSuccess(response)) {
                return response.data;
            }
            throw new Error(response.error || 'Ошибка при загрузке магазинов');
        }
        catch (error) {
            console.error('Stores API Error:', error);
            throw new Error(ApiUtils.handleError(error));
        }
    }
    /**
     * Получить отдельный магазин
     */
    async getStore(storeId) {
        try {
            const response = await apiClient.get(`${this.baseEndpoint}/stores/${storeId}`);
            if (ApiUtils.isSuccess(response)) {
                return response.data;
            }
            throw new Error(response.error || 'Магазин не найден');
        }
        catch (error) {
            console.error('Get Store API Error:', error);
            throw new Error(ApiUtils.handleError(error));
        }
    }
    /**
     * Создать новый магазин
     */
    async createStore(data) {
        try {
            const response = await apiClient.post(`${this.baseEndpoint}/stores`, data);
            if (ApiUtils.isSuccess(response)) {
                return response.data;
            }
            throw new Error(response.error || 'Ошибка при создании магазина');
        }
        catch (error) {
            console.error('Create Store API Error:', error);
            throw new Error(ApiUtils.handleError(error));
        }
    }
    /**
     * Обновить магазин
     */
    async updateStore(storeId, data) {
        try {
            const response = await apiClient.put(`${this.baseEndpoint}/stores/${storeId}`, data);
            if (ApiUtils.isSuccess(response)) {
                return response.data;
            }
            throw new Error(response.error || 'Ошибка при обновлении магазина');
        }
        catch (error) {
            console.error('Update Store API Error:', error);
            throw new Error(ApiUtils.handleError(error));
        }
    }
    /**
     * Получить продукты магазина
     */
    async getProducts(storeId, filters) {
        try {
            const response = await apiClient.get(`${this.baseEndpoint}/stores/${storeId}/products`, filters);
            if (ApiUtils.isSuccess(response)) {
                return response.data;
            }
            throw new Error(response.error || 'Ошибка при загрузке продуктов');
        }
        catch (error) {
            console.error('Products API Error:', error);
            throw new Error(ApiUtils.handleError(error));
        }
    }
    /**
     * Получить отдельный продукт
     */
    async getProduct(storeId, productId) {
        try {
            const response = await apiClient.get(`${this.baseEndpoint}/stores/${storeId}/products/${productId}`);
            if (ApiUtils.isSuccess(response)) {
                return response.data;
            }
            throw new Error(response.error || 'Продукт не найден');
        }
        catch (error) {
            console.error('Get Product API Error:', error);
            throw new Error(ApiUtils.handleError(error));
        }
    }
    /**
     * Создать новый продукт
     */
    async createProduct(storeId, data) {
        try {
            const response = await apiClient.post(`${this.baseEndpoint}/stores/${storeId}/products`, data);
            if (ApiUtils.isSuccess(response)) {
                return response.data;
            }
            throw new Error(response.error || 'Ошибка при создании продукта');
        }
        catch (error) {
            console.error('Create Product API Error:', error);
            throw new Error(ApiUtils.handleError(error));
        }
    }
    /**
     * Обновить продукт
     */
    async updateProduct(storeId, productId, data) {
        try {
            const response = await apiClient.put(`${this.baseEndpoint}/stores/${storeId}/products/${productId}`, data);
            if (ApiUtils.isSuccess(response)) {
                return response.data;
            }
            throw new Error(response.error || 'Ошибка при обновлении продукта');
        }
        catch (error) {
            console.error('Update Product API Error:', error);
            throw new Error(ApiUtils.handleError(error));
        }
    }
    /**
     * Удалить продукт
     */
    async deleteProduct(storeId, productId) {
        try {
            const response = await apiClient.delete(`${this.baseEndpoint}/stores/${storeId}/products/${productId}`);
            if (!ApiUtils.isSuccess(response)) {
                throw new Error(response.error || 'Ошибка при удалении продукта');
            }
        }
        catch (error) {
            console.error('Delete Product API Error:', error);
            throw new Error(ApiUtils.handleError(error));
        }
    }
    /**
     * Получить категории магазина
     */
    async getCategories(storeId) {
        try {
            const response = await apiClient.get(`${this.baseEndpoint}/stores/${storeId}/categories`);
            if (ApiUtils.isSuccess(response)) {
                return response.data;
            }
            throw new Error(response.error || 'Ошибка при загрузке категорий');
        }
        catch (error) {
            console.error('Categories API Error:', error);
            throw new Error(ApiUtils.handleError(error));
        }
    }
    /**
     * Создать категорию
     */
    async createCategory(storeId, data) {
        try {
            const response = await apiClient.post(`${this.baseEndpoint}/stores/${storeId}/categories`, data);
            if (ApiUtils.isSuccess(response)) {
                return response.data;
            }
            throw new Error(response.error || 'Ошибка при создании категории');
        }
        catch (error) {
            console.error('Create Category API Error:', error);
            throw new Error(ApiUtils.handleError(error));
        }
    }
    /**
     * Получить статистику магазина
     */
    async getStoreAnalytics(storeId, dateFrom, dateTo) {
        try {
            const params = { dateFrom, dateTo };
            const response = await apiClient.get(`${this.baseEndpoint}/stores/${storeId}/analytics`, params);
            if (ApiUtils.isSuccess(response)) {
                return response.data;
            }
            throw new Error(response.error || 'Ошибка при загрузке аналитики');
        }
        catch (error) {
            console.error('Store Analytics API Error:', error);
            throw new Error(ApiUtils.handleError(error));
        }
    }
    /**
     * Загрузить изображения продукта
     */
    async uploadProductImages(storeId, productId, files) {
        try {
            const formData = new FormData();
            files.forEach((file, index) => {
                formData.append(`image_${index}`, file);
            });
            const response = await apiClient.upload(`${this.baseEndpoint}/stores/${storeId}/products/${productId}/images`, formData);
            if (ApiUtils.isSuccess(response)) {
                return response.data;
            }
            throw new Error(response.error || 'Ошибка при загрузке изображений');
        }
        catch (error) {
            console.error('Upload Product Images API Error:', error);
            throw new Error(ApiUtils.handleError(error));
        }
    }
}
export const ecommerceApi = new EcommerceApiService();
export default ecommerceApi;
//# sourceMappingURL=ecommerce.api.js.map