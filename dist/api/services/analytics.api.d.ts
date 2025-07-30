/**
 * Analytics API Service
 * Получение данных для дашборда и аналитики
 */
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
declare class AnalyticsApiService {
    private readonly baseEndpoint;
    /**
     * Получить основную статистику для дашборда
     */
    getDashboardStats(): Promise<DashboardStats>;
    /**
     * Получить данные трафика для графика
     */
    getTrafficData(filters?: AnalyticsFilters): Promise<ChartData>;
    /**
     * Получить данные конверсии для графика
     */
    getConversionData(filters?: AnalyticsFilters): Promise<ChartData>;
    /**
     * Получить метрики по проектам
     */
    getProjectMetrics(filters?: AnalyticsFilters): Promise<ProjectMetrics[]>;
    /**
     * Получить топ страницы по трафику
     */
    getTopPages(filters?: AnalyticsFilters): Promise<{
        page: string;
        views: number;
        visitors: number;
        bounceRate: number;
    }[]>;
    /**
     * Получить источники трафика
     */
    getTrafficSources(filters?: AnalyticsFilters): Promise<{
        source: string;
        visitors: number;
        percentage: number;
    }[]>;
    /**
     * Получить данные о устройствах пользователей
     */
    getDeviceStats(filters?: AnalyticsFilters): Promise<{
        device: string;
        users: number;
        percentage: number;
    }[]>;
    /**
     * Экспорт данных аналитики
     */
    exportData(format: 'csv' | 'json' | 'xlsx', filters?: AnalyticsFilters): Promise<Blob>;
}
export declare const analyticsApi: AnalyticsApiService;
export default analyticsApi;
//# sourceMappingURL=analytics.api.d.ts.map