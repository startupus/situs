/**
 * Analytics API Service
 * Получение данных для дашборда и аналитики
 */

import { apiClient, ApiResponse, ApiUtils } from '../client';

export interface DashboardStats {
  projects: {
    total: number;
    active: number;
    published: number;
    draft: number;
  };
  users: {
    total: number;
    active: number;
    newThisMonth: number;
  };
  traffic: {
    totalViews: number;
    uniqueVisitors: number;
    averageSessionDuration: number;
    bounceRate: number;
  };
  revenue: {
    totalRevenue: number;
    monthlyRecurring: number;
    conversionRate: number;
    averageOrderValue: number;
  };
}

export interface ChartData {
  labels: string[];
  datasets: {
    label: string;
    data: number[];
    borderColor?: string;
    backgroundColor?: string;
    fill?: boolean;
  }[];
}

export interface TrafficData {
  date: string;
  views: number;
  visitors: number;
  sessions: number;
}

export interface ConversionData {
  date: string;
  conversions: number;
  visitors: number;
  rate: number;
}

export interface ProjectMetrics {
  projectId: string;
  projectName: string;
  views: number;
  visitors: number;
  conversions: number;
  revenue: number;
  lastUpdated: string;
}

export interface AnalyticsFilters {
  startDate?: string;
  endDate?: string;
  projectId?: string;
  period?: 'day' | 'week' | 'month' | 'year';
}

class AnalyticsApiService {
  private readonly baseEndpoint = '/api/analytics';

  /**
   * Получить основную статистику для дашборда
   */
  async getDashboardStats(): Promise<DashboardStats> {
    try {
      const response = await apiClient.get<ApiResponse<DashboardStats>>(
        `${this.baseEndpoint}/dashboard`
      );

      if (ApiUtils.isSuccess(response)) {
        return response.data;
      }

      throw new Error(response.error || 'Ошибка при загрузке статистики');
    } catch (error) {
      console.error('Dashboard Stats API Error:', error);
      throw new Error(ApiUtils.handleError(error));
    }
  }

  /**
   * Получить данные трафика для графика
   */
  async getTrafficData(filters?: AnalyticsFilters): Promise<ChartData> {
    try {
      const response = await apiClient.get<ApiResponse<TrafficData[]>>(
        `${this.baseEndpoint}/traffic`,
        filters
      );

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
    } catch (error) {
      console.error('Traffic Data API Error:', error);
      throw new Error(ApiUtils.handleError(error));
    }
  }

  /**
   * Получить данные конверсии для графика
   */
  async getConversionData(filters?: AnalyticsFilters): Promise<ChartData> {
    try {
      const response = await apiClient.get<ApiResponse<ConversionData[]>>(
        `${this.baseEndpoint}/conversions`,
        filters
      );

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
    } catch (error) {
      console.error('Conversion Data API Error:', error);
      throw new Error(ApiUtils.handleError(error));
    }
  }

  /**
   * Получить метрики по проектам
   */
  async getProjectMetrics(filters?: AnalyticsFilters): Promise<ProjectMetrics[]> {
    try {
      const response = await apiClient.get<ApiResponse<ProjectMetrics[]>>(
        `${this.baseEndpoint}/projects`,
        filters
      );

      if (ApiUtils.isSuccess(response)) {
        return response.data;
      }

      throw new Error(response.error || 'Ошибка при загрузке метрик проектов');
    } catch (error) {
      console.error('Project Metrics API Error:', error);
      throw new Error(ApiUtils.handleError(error));
    }
  }

  /**
   * Получить топ страницы по трафику
   */
  async getTopPages(filters?: AnalyticsFilters): Promise<{
    page: string;
    views: number;
    visitors: number;
    bounceRate: number;
  }[]> {
    try {
      const response = await apiClient.get<ApiResponse<{
        page: string;
        views: number;
        visitors: number;
        bounceRate: number;
      }[]>>(
        `${this.baseEndpoint}/top-pages`,
        filters
      );

      if (ApiUtils.isSuccess(response)) {
        return response.data;
      }

      throw new Error(response.error || 'Ошибка при загрузке топ страниц');
    } catch (error) {
      console.error('Top Pages API Error:', error);
      throw new Error(ApiUtils.handleError(error));
    }
  }

  /**
   * Получить источники трафика
   */
  async getTrafficSources(filters?: AnalyticsFilters): Promise<{
    source: string;
    visitors: number;
    percentage: number;
  }[]> {
    try {
      const response = await apiClient.get<ApiResponse<{
        source: string;
        visitors: number;
        percentage: number;
      }[]>>(
        `${this.baseEndpoint}/traffic-sources`,
        filters
      );

      if (ApiUtils.isSuccess(response)) {
        return response.data;
      }

      throw new Error(response.error || 'Ошибка при загрузке источников трафика');
    } catch (error) {
      console.error('Traffic Sources API Error:', error);
      throw new Error(ApiUtils.handleError(error));
    }
  }

  /**
   * Получить данные о устройствах пользователей
   */
  async getDeviceStats(filters?: AnalyticsFilters): Promise<{
    device: string;
    users: number;
    percentage: number;
  }[]> {
    try {
      const response = await apiClient.get<ApiResponse<{
        device: string;
        users: number;
        percentage: number;
      }[]>>(
        `${this.baseEndpoint}/devices`,
        filters
      );

      if (ApiUtils.isSuccess(response)) {
        return response.data;
      }

      throw new Error(response.error || 'Ошибка при загрузке статистики устройств');
    } catch (error) {
      console.error('Device Stats API Error:', error);
      throw new Error(ApiUtils.handleError(error));
    }
  }

  /**
   * Экспорт данных аналитики
   */
  async exportData(format: 'csv' | 'json' | 'xlsx', filters?: AnalyticsFilters): Promise<Blob> {
    try {
      const response = await fetch(
        `${apiClient['baseURL']}${this.baseEndpoint}/export?format=${format}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            ...(localStorage.getItem('auth_token') && {
              'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
            })
          },
          body: JSON.stringify(filters || {})
        }
      );

      if (!response.ok) {
        throw new Error('Ошибка при экспорте данных');
      }

      return await response.blob();
    } catch (error) {
      console.error('Export Data API Error:', error);
      throw new Error(ApiUtils.handleError(error));
    }
  }
}

export const analyticsApi = new AnalyticsApiService();
export default analyticsApi;