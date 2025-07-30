/**
 * Analytics API Service
 * Получение данных для дашборда и аналитики
 */
import { apiClient, ApiUtils } from '../client';
class AnalyticsApiService {
    baseEndpoint = '/api/analytics';
    /**
     * Получить основную статистику для дашборда
     */
    async getDashboardStats() {
        try {
            const response = await apiClient.get(`${this.baseEndpoint}/dashboard`);
            if (ApiUtils.isSuccess(response)) {
                return response.data;
            }
            throw new Error(response.error || 'Ошибка при загрузке статистики');
        }
        catch (error) {
            console.error('Dashboard Stats API Error:', error);
            throw new Error(ApiUtils.handleError(error));
        }
    }
    /**
     * Получить данные трафика для графика
     */
    async getTrafficData(filters) {
        try {
            const response = await apiClient.get(`${this.baseEndpoint}/traffic`, filters);
            if (ApiUtils.isSuccess(response)) {
                // Преобразуем данные в формат для графика
                const data = response.data;
                return {
                    labels: data.map(item => item.date),
                    datasets: [
                        {
                            label: 'Просмотры',
                            data: data.map(item => item.views),
                            borderColor: '#3B82F6',
                            backgroundColor: 'rgba(59, 130, 246, 0.1)',
                            fill: true
                        },
                        {
                            label: 'Посетители',
                            data: data.map(item => item.visitors),
                            borderColor: '#8B5CF6',
                            backgroundColor: 'rgba(139, 92, 246, 0.1)',
                            fill: true
                        }
                    ]
                };
            }
            throw new Error(response.error || 'Ошибка при загрузке данных трафика');
        }
        catch (error) {
            console.error('Traffic Data API Error:', error);
            throw new Error(ApiUtils.handleError(error));
        }
    }
    /**
     * Получить данные конверсии для графика
     */
    async getConversionData(filters) {
        try {
            const response = await apiClient.get(`${this.baseEndpoint}/conversions`, filters);
            if (ApiUtils.isSuccess(response)) {
                const data = response.data;
                return {
                    labels: data.map(item => item.date),
                    datasets: [
                        {
                            label: 'Конверсии',
                            data: data.map(item => item.conversions),
                            borderColor: '#10B981',
                            backgroundColor: 'rgba(16, 185, 129, 0.1)',
                            fill: true
                        },
                        {
                            label: 'Коэффициент конверсии (%)',
                            data: data.map(item => item.rate),
                            borderColor: '#F59E0B',
                            backgroundColor: 'rgba(245, 158, 11, 0.1)',
                            fill: false
                        }
                    ]
                };
            }
            throw new Error(response.error || 'Ошибка при загрузке данных конверсии');
        }
        catch (error) {
            console.error('Conversion Data API Error:', error);
            throw new Error(ApiUtils.handleError(error));
        }
    }
    /**
     * Получить метрики по проектам
     */
    async getProjectMetrics(filters) {
        try {
            const response = await apiClient.get(`${this.baseEndpoint}/projects`, filters);
            if (ApiUtils.isSuccess(response)) {
                return response.data;
            }
            throw new Error(response.error || 'Ошибка при загрузке метрик проектов');
        }
        catch (error) {
            console.error('Project Metrics API Error:', error);
            throw new Error(ApiUtils.handleError(error));
        }
    }
    /**
     * Получить топ страницы по трафику
     */
    async getTopPages(filters) {
        try {
            const response = await apiClient.get(`${this.baseEndpoint}/top-pages`, filters);
            if (ApiUtils.isSuccess(response)) {
                return response.data;
            }
            throw new Error(response.error || 'Ошибка при загрузке топ страниц');
        }
        catch (error) {
            console.error('Top Pages API Error:', error);
            throw new Error(ApiUtils.handleError(error));
        }
    }
    /**
     * Получить источники трафика
     */
    async getTrafficSources(filters) {
        try {
            const response = await apiClient.get(`${this.baseEndpoint}/traffic-sources`, filters);
            if (ApiUtils.isSuccess(response)) {
                return response.data;
            }
            throw new Error(response.error || 'Ошибка при загрузке источников трафика');
        }
        catch (error) {
            console.error('Traffic Sources API Error:', error);
            throw new Error(ApiUtils.handleError(error));
        }
    }
    /**
     * Получить данные о устройствах пользователей
     */
    async getDeviceStats(filters) {
        try {
            const response = await apiClient.get(`${this.baseEndpoint}/devices`, filters);
            if (ApiUtils.isSuccess(response)) {
                return response.data;
            }
            throw new Error(response.error || 'Ошибка при загрузке статистики устройств');
        }
        catch (error) {
            console.error('Device Stats API Error:', error);
            throw new Error(ApiUtils.handleError(error));
        }
    }
    /**
     * Экспорт данных аналитики
     */
    async exportData(format, filters) {
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
                throw new Error('Ошибка при экспорте данных');
            }
            return await response.blob();
        }
        catch (error) {
            console.error('Export Data API Error:', error);
            throw new Error(ApiUtils.handleError(error));
        }
    }
}
export const analyticsApi = new AnalyticsApiService();
export default analyticsApi;
//# sourceMappingURL=analytics.api.js.map