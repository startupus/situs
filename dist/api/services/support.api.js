/**
 * Support API Service
 * Система поддержки, тикеты и FAQ
 */
import { apiClient, ApiUtils } from '../client';
class SupportApiService {
    baseEndpoint = '/api/support';
    /**
     * Получить список тикетов
     */
    async getTickets(filters) {
        try {
            const response = await apiClient.get(`${this.baseEndpoint}/tickets`, filters);
            if (ApiUtils.isSuccess(response)) {
                return response.data;
            }
            throw new Error(response.error || 'Ошибка при загрузке тикетов');
        }
        catch (error) {
            console.error('Tickets API Error:', error);
            throw new Error(ApiUtils.handleError(error));
        }
    }
    /**
     * Получить отдельный тикет
     */
    async getTicket(ticketId) {
        try {
            const response = await apiClient.get(`${this.baseEndpoint}/tickets/${ticketId}`);
            if (ApiUtils.isSuccess(response)) {
                return response.data;
            }
            throw new Error(response.error || 'Тикет не найден');
        }
        catch (error) {
            console.error('Get Ticket API Error:', error);
            throw new Error(ApiUtils.handleError(error));
        }
    }
    /**
     * Создать новый тикет
     */
    async createTicket(data) {
        try {
            const formData = new FormData();
            formData.append('title', data.title);
            formData.append('description', data.description);
            formData.append('category', data.category);
            if (data.priority)
                formData.append('priority', data.priority);
            if (data.tags)
                formData.append('tags', JSON.stringify(data.tags));
            if (data.attachments) {
                data.attachments.forEach((file, index) => {
                    formData.append(`attachment_${index}`, file);
                });
            }
            const response = await apiClient.upload(`${this.baseEndpoint}/tickets`, formData);
            if (ApiUtils.isSuccess(response)) {
                return response.data;
            }
            throw new Error(response.error || 'Ошибка при создании тикета');
        }
        catch (error) {
            console.error('Create Ticket API Error:', error);
            throw new Error(ApiUtils.handleError(error));
        }
    }
    /**
     * Обновить тикет
     */
    async updateTicket(ticketId, data) {
        try {
            const response = await apiClient.put(`${this.baseEndpoint}/tickets/${ticketId}`, data);
            if (ApiUtils.isSuccess(response)) {
                return response.data;
            }
            throw new Error(response.error || 'Ошибка при обновлении тикета');
        }
        catch (error) {
            console.error('Update Ticket API Error:', error);
            throw new Error(ApiUtils.handleError(error));
        }
    }
    /**
     * Добавить сообщение к тикету
     */
    async addMessage(ticketId, content, isInternal = false, attachments) {
        try {
            const formData = new FormData();
            formData.append('content', content);
            formData.append('isInternal', isInternal.toString());
            if (attachments) {
                attachments.forEach((file, index) => {
                    formData.append(`attachment_${index}`, file);
                });
            }
            const response = await apiClient.upload(`${this.baseEndpoint}/tickets/${ticketId}/messages`, formData);
            if (ApiUtils.isSuccess(response)) {
                return response.data;
            }
            throw new Error(response.error || 'Ошибка при добавлении сообщения');
        }
        catch (error) {
            console.error('Add Message API Error:', error);
            throw new Error(ApiUtils.handleError(error));
        }
    }
    /**
     * Назначить тикет агенту
     */
    async assignTicket(ticketId, agentId) {
        try {
            const response = await apiClient.patch(`${this.baseEndpoint}/tickets/${ticketId}/assign`, { assignedTo: agentId });
            if (ApiUtils.isSuccess(response)) {
                return response.data;
            }
            throw new Error(response.error || 'Ошибка при назначении тикета');
        }
        catch (error) {
            console.error('Assign Ticket API Error:', error);
            throw new Error(ApiUtils.handleError(error));
        }
    }
    /**
     * Изменить статус тикета
     */
    async updateTicketStatus(ticketId, status) {
        try {
            const response = await apiClient.patch(`${this.baseEndpoint}/tickets/${ticketId}/status`, { status });
            if (ApiUtils.isSuccess(response)) {
                return response.data;
            }
            throw new Error(response.error || 'Ошибка при обновлении статуса');
        }
        catch (error) {
            console.error('Update Ticket Status API Error:', error);
            throw new Error(ApiUtils.handleError(error));
        }
    }
    /**
     * Получить FAQ
     */
    async getFAQ(category) {
        try {
            const params = category ? { category } : undefined;
            const response = await apiClient.get(`${this.baseEndpoint}/faq`, params);
            if (ApiUtils.isSuccess(response)) {
                return response.data;
            }
            throw new Error(response.error || 'Ошибка при загрузке FAQ');
        }
        catch (error) {
            console.error('FAQ API Error:', error);
            throw new Error(ApiUtils.handleError(error));
        }
    }
    /**
     * Получить категории FAQ
     */
    async getFAQCategories() {
        try {
            const response = await apiClient.get(`${this.baseEndpoint}/faq/categories`);
            if (ApiUtils.isSuccess(response)) {
                return response.data;
            }
            throw new Error(response.error || 'Ошибка при загрузке категорий');
        }
        catch (error) {
            console.error('FAQ Categories API Error:', error);
            throw new Error(ApiUtils.handleError(error));
        }
    }
    /**
     * Поиск в FAQ
     */
    async searchFAQ(query) {
        try {
            const response = await apiClient.get(`${this.baseEndpoint}/faq/search`, { q: query });
            if (ApiUtils.isSuccess(response)) {
                return response.data;
            }
            throw new Error(response.error || 'Ошибка поиска');
        }
        catch (error) {
            console.error('FAQ Search API Error:', error);
            throw new Error(ApiUtils.handleError(error));
        }
    }
    /**
     * Получить статистику поддержки
     */
    async getSupportStats(dateFrom, dateTo) {
        try {
            const params = { dateFrom, dateTo };
            const response = await apiClient.get(`${this.baseEndpoint}/stats`, params);
            if (ApiUtils.isSuccess(response)) {
                return response.data;
            }
            throw new Error(response.error || 'Ошибка при загрузке статистики');
        }
        catch (error) {
            console.error('Support Stats API Error:', error);
            throw new Error(ApiUtils.handleError(error));
        }
    }
    /**
     * Получить мои тикеты (для текущего пользователя)
     */
    async getMyTickets(filters) {
        try {
            const response = await apiClient.get(`${this.baseEndpoint}/my-tickets`, filters);
            if (ApiUtils.isSuccess(response)) {
                return response.data;
            }
            throw new Error(response.error || 'Ошибка при загрузке тикетов');
        }
        catch (error) {
            console.error('My Tickets API Error:', error);
            throw new Error(ApiUtils.handleError(error));
        }
    }
    /**
     * Отправить отзыв о качестве поддержки
     */
    async submitFeedback(ticketId, rating, comment) {
        try {
            const response = await apiClient.post(`${this.baseEndpoint}/tickets/${ticketId}/feedback`, { rating, comment });
            if (!ApiUtils.isSuccess(response)) {
                throw new Error(response.error || 'Ошибка при отправке отзыва');
            }
        }
        catch (error) {
            console.error('Submit Feedback API Error:', error);
            throw new Error(ApiUtils.handleError(error));
        }
    }
}
export const supportApi = new SupportApiService();
export default supportApi;
//# sourceMappingURL=support.api.js.map