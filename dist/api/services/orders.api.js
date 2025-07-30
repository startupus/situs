/**
 * Orders API Service
 * Управление заказами, продуктами и услугами
 */
import { apiClient, ApiUtils } from '../client';
class OrdersApiService {
    baseEndpoint = '/api/orders';
    /**
     * Получить список заказов
     */
    async getOrders(filters) {
        try {
            const response = await apiClient.get(this.baseEndpoint, filters);
            if (ApiUtils.isSuccess(response)) {
                return response.data;
            }
            throw new Error(response.error || 'Ошибка при загрузке заказов');
        }
        catch (error) {
            console.error('Orders API Error:', error);
            throw new Error(ApiUtils.handleError(error));
        }
    }
    /**
     * Получить отдельный заказ
     */
    async getOrder(orderId) {
        try {
            const response = await apiClient.get(`${this.baseEndpoint}/${orderId}`);
            if (ApiUtils.isSuccess(response)) {
                return response.data;
            }
            throw new Error(response.error || 'Заказ не найден');
        }
        catch (error) {
            console.error('Get Order API Error:', error);
            throw new Error(ApiUtils.handleError(error));
        }
    }
    /**
     * Создать новый заказ
     */
    async createOrder(data) {
        try {
            const response = await apiClient.post(this.baseEndpoint, data);
            if (ApiUtils.isSuccess(response)) {
                return response.data;
            }
            throw new Error(response.error || 'Ошибка при создании заказа');
        }
        catch (error) {
            console.error('Create Order API Error:', error);
            throw new Error(ApiUtils.handleError(error));
        }
    }
    /**
     * Обновить заказ
     */
    async updateOrder(orderId, data) {
        try {
            const response = await apiClient.put(`${this.baseEndpoint}/${orderId}`, data);
            if (ApiUtils.isSuccess(response)) {
                return response.data;
            }
            throw new Error(response.error || 'Ошибка при обновлении заказа');
        }
        catch (error) {
            console.error('Update Order API Error:', error);
            throw new Error(ApiUtils.handleError(error));
        }
    }
    /**
     * Удалить заказ
     */
    async deleteOrder(orderId) {
        try {
            const response = await apiClient.delete(`${this.baseEndpoint}/${orderId}`);
            if (!ApiUtils.isSuccess(response)) {
                throw new Error(response.error || 'Ошибка при удалении заказа');
            }
        }
        catch (error) {
            console.error('Delete Order API Error:', error);
            throw new Error(ApiUtils.handleError(error));
        }
    }
    /**
     * Изменить статус заказа
     */
    async updateOrderStatus(orderId, status) {
        try {
            const response = await apiClient.patch(`${this.baseEndpoint}/${orderId}/status`, { status });
            if (ApiUtils.isSuccess(response)) {
                return response.data;
            }
            throw new Error(response.error || 'Ошибка при обновлении статуса');
        }
        catch (error) {
            console.error('Update Order Status API Error:', error);
            throw new Error(ApiUtils.handleError(error));
        }
    }
    /**
     * Получить статистику заказов
     */
    async getOrderStats(filters) {
        try {
            const response = await apiClient.get(`${this.baseEndpoint}/stats`, filters);
            if (ApiUtils.isSuccess(response)) {
                return response.data;
            }
            throw new Error(response.error || 'Ошибка при загрузке статистики');
        }
        catch (error) {
            console.error('Order Stats API Error:', error);
            throw new Error(ApiUtils.handleError(error));
        }
    }
    /**
     * Получить заказы по проекту
     */
    async getOrdersByProject(projectId, filters) {
        try {
            const response = await apiClient.get(`${this.baseEndpoint}/project/${projectId}`, filters);
            if (ApiUtils.isSuccess(response)) {
                return response.data;
            }
            throw new Error(response.error || 'Ошибка при загрузке заказов проекта');
        }
        catch (error) {
            console.error('Project Orders API Error:', error);
            throw new Error(ApiUtils.handleError(error));
        }
    }
    /**
     * Экспорт заказов
     */
    async exportOrders(format, filters) {
        try {
            const response = await fetch(`${apiClient['baseURL']}${this.baseEndpoint}/export?format=${format}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    ...(localStorage.getItem('auth_token') && {
                        'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
                    })
                },
                body: JSON.stringify(filters || {})
            });
            if (!response.ok) {
                throw new Error('Ошибка при экспорте заказов');
            }
            return await response.blob();
        }
        catch (error) {
            console.error('Export Orders API Error:', error);
            throw new Error(ApiUtils.handleError(error));
        }
    }
    /**
     * Создать refund для заказа
     */
    async refundOrder(orderId, amount, reason) {
        try {
            const response = await apiClient.post(`${this.baseEndpoint}/${orderId}/refund`, { amount, reason });
            if (ApiUtils.isSuccess(response)) {
                return response.data;
            }
            throw new Error(response.error || 'Ошибка при возврате средств');
        }
        catch (error) {
            console.error('Refund Order API Error:', error);
            throw new Error(ApiUtils.handleError(error));
        }
    }
}
export const ordersApi = new OrdersApiService();
export default ordersApi;
//# sourceMappingURL=orders.api.js.map