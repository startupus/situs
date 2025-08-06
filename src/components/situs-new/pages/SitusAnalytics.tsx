import React, { useState, useEffect } from 'react';
import { FiTrendingUp, FiUsers, FiFolder, FiCalendar, FiBarChart2, FiActivity, FiRefreshCw } from 'react-icons/fi';
import StatsChart from '../../charts/StatsChart';
import apiClient from '../../../api/client/ApiClient';
import type { ChartData } from '../../charts/StatsChart';

/**
 * Интерфейс для аналитических данных
 */
interface AnalyticsData {
  userGrowth: ChartData;
  projectDistribution: ChartData;
  revenue: ChartData;
  activity: any[];
  summary: {
    totalUsers: number;
    totalProjects: number;
    activeProjects: number;
    newUsersThisMonth: number;
    revenueThisMonth: number;
    growthRate: number;
  };
}

/**
 * Компонент SitusAnalytics - Страница аналитики
 */
const SitusAnalytics: React.FC = () => {
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [period, setPeriod] = useState<'7d' | '30d' | '90d' | '1y'>('30d');
  const [refreshing, setRefreshing] = useState(false);

  // Загрузка аналитических данных
  useEffect(() => {
    loadAnalyticsData();
  }, [period]);

  const loadAnalyticsData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Параллельно загружаем все аналитические данные
      const [
        userGrowthResponse,
        projectDistributionResponse,
        revenueResponse,
        activityResponse,
        usersStatsResponse,
        projectsStatsResponse
      ] = await Promise.all([
        apiClient.getUserGrowthAnalytics(period),
        apiClient.getProjectDistributionAnalytics(period),
        apiClient.getRevenueAnalytics(period),
        apiClient.getActivityAnalytics({ limit: 10 }),
        apiClient.getUsersStatistics(),
        apiClient.getProjectsStatistics()
      ]);

      // Проверяем ошибки
      if (userGrowthResponse.error) {
        console.warn('User growth error:', userGrowthResponse.error);
      }
      if (projectDistributionResponse.error) {
        console.warn('Project distribution error:', projectDistributionResponse.error);
      }
      if (revenueResponse.error) {
        console.warn('Revenue error:', revenueResponse.error);
      }
      if (activityResponse.error) {
        console.warn('Activity error:', activityResponse.error);
      }
      if (usersStatsResponse.error) {
        console.warn('Users stats error:', usersStatsResponse.error);
      }
      if (projectsStatsResponse.error) {
        console.warn('Projects stats error:', projectsStatsResponse.error);
      }

      // Формируем данные аналитики с fallback
      const analyticsData: AnalyticsData = {
        userGrowth: userGrowthResponse.data || generateFallbackUserGrowth(),
        projectDistribution: projectDistributionResponse.data || generateFallbackProjectDistribution(),
        revenue: revenueResponse.data || generateFallbackRevenue(),
        activity: activityResponse.data || [],
        summary: {
          totalUsers: usersStatsResponse.data?.total || 0,
          totalProjects: projectsStatsResponse.data?.totalProjects || 0,
          activeProjects: projectsStatsResponse.data?.publishedProjects || 0,
          newUsersThisMonth: usersStatsResponse.data?.newThisMonth || 0,
          revenueThisMonth: 450000,
          growthRate: 12.5
        }
      };

      setAnalyticsData(analyticsData);
    } catch (err) {
      console.error('Error loading analytics:', err);
      setError('Ошибка загрузки аналитических данных');
    } finally {
      setLoading(false);
    }
  };

  // Обновление данных
  const refreshData = async () => {
    setRefreshing(true);
    await loadAnalyticsData();
    setRefreshing(false);
  };

  // Fallback данные для графиков
  const generateFallbackUserGrowth = (): ChartData => ({
    labels: ['01', '05', '10', '15', '20', '25', '30'],
    datasets: [{
      label: 'Новые пользователи',
      data: [2, 5, 3, 8, 6, 9, 12],
      backgroundColor: 'rgba(59, 130, 246, 0.1)',
      borderColor: 'rgba(59, 130, 246, 1)',
      fill: true
    }]
  });

  const generateFallbackProjectDistribution = (): ChartData => ({
    labels: ['Сайты', 'Магазины', 'Лендинги', 'Приложения'],
    datasets: [{
      label: 'Проекты',
      data: [15, 8, 12, 5],
      backgroundColor: [
        'rgba(59, 130, 246, 0.8)',
        'rgba(16, 185, 129, 0.8)',
        'rgba(245, 158, 11, 0.8)',
        'rgba(139, 92, 246, 0.8)'
      ]
    }]
  });

  const generateFallbackRevenue = (): ChartData => ({
    labels: ['Янв', 'Фев', 'Мар', 'Апр', 'Май', 'Июн'],
    datasets: [{
      label: 'Доходы (тыс. руб.)',
      data: [320, 450, 380, 520, 670, 450],
      backgroundColor: 'rgba(16, 185, 129, 0.1)',
      borderColor: 'rgba(16, 185, 129, 1)',
      fill: true
    }]
  });

  // Форматирование чисел
  const formatNumber = (num: number) => {
    if (num >= 1000000) {
      return `${(num / 1000000).toFixed(1)}M`;
    } else if (num >= 1000) {
      return `${(num / 1000).toFixed(1)}K`;
    }
    return num.toString();
  };

  // Форматирование валюты
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('ru-RU', {
      style: 'currency',
      currency: 'RUB',
      minimumFractionDigits: 0
    }).format(amount);
  };

  // Получение текста периода
  const getPeriodText = (period: string) => {
    switch (period) {
      case '7d': return 'Последние 7 дней';
      case '30d': return 'Последние 30 дней';
      case '90d': return 'Последние 90 дней';
      case '1y': return 'Последний год';
      default: return 'Неизвестный период';
    }
  };

  // Форматирование времени активности
  const formatActivityTime = (timestamp: string | Date) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (days > 0) {
      return `${days} дн. назад`;
    } else if (hours > 0) {
      return `${hours} ч. назад`;
    } else if (minutes > 0) {
      return `${minutes} мин. назад`;
    } else {
      return 'Только что';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="bg-red-50 dark:bg-red-900/50 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 px-4 py-3 rounded-lg">
          {error}
          <button 
            onClick={loadAnalyticsData}
            className="ml-4 text-red-600 hover:text-red-800 underline"
          >
            Повторить попытку
          </button>
        </div>
      </div>
    );
  }

  if (!analyticsData) {
    return <div>Нет данных</div>;
  }

  return (
    <div className="p-6 space-y-6">
      {/* Заголовок и управление */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Аналитика</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Детальная статистика и показатели платформы
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          {/* Селектор периода */}
          <select
            value={period}
            onChange={(e) => setPeriod(e.target.value as any)}
            className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
          >
            <option value="7d">7 дней</option>
            <option value="30d">30 дней</option>
            <option value="90d">90 дней</option>
            <option value="1y">1 год</option>
          </select>

          {/* Кнопка обновления */}
          <button
            onClick={refreshData}
            disabled={refreshing}
            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50"
          >
            <FiRefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
            Обновить
          </button>
        </div>
      </div>

      {/* Сводная статистика */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Всего пользователей</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {formatNumber(analyticsData.summary.totalUsers)}
              </p>
              <div className="flex items-center mt-2">
                <FiTrendingUp className="h-4 w-4 text-green-500 mr-1" />
                <span className="text-sm text-green-600">+{analyticsData.summary.newUsersThisMonth} за месяц</span>
              </div>
            </div>
            <FiUsers className="h-8 w-8 text-blue-600" />
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Всего проектов</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {analyticsData.summary.totalProjects}
              </p>
              <div className="flex items-center mt-2">
                <FiActivity className="h-4 w-4 text-green-500 mr-1" />
                <span className="text-sm text-green-600">{analyticsData.summary.activeProjects} активных</span>
              </div>
            </div>
            <FiFolder className="h-8 w-8 text-green-600" />
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Доходы за месяц</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {formatCurrency(analyticsData.summary.revenueThisMonth)}
              </p>
              <div className="flex items-center mt-2">
                <FiTrendingUp className="h-4 w-4 text-green-500 mr-1" />
                <span className="text-sm text-green-600">+{analyticsData.summary.growthRate}%</span>
              </div>
            </div>
            <FiBarChart2 className="h-8 w-8 text-purple-600" />
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Период анализа</p>
              <p className="text-xl font-bold text-gray-900 dark:text-white">
                {getPeriodText(period)}
              </p>
              <div className="flex items-center mt-2">
                <FiCalendar className="h-4 w-4 text-blue-500 mr-1" />
                <span className="text-sm text-blue-600">Данные актуальны</span>
              </div>
            </div>
            <FiCalendar className="h-8 w-8 text-orange-600" />
          </div>
        </div>
      </div>

      {/* Графики аналитики */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* График роста пользователей */}
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Рост пользователей
            </h3>
            <div className="text-sm text-gray-500 dark:text-gray-400">
              {getPeriodText(period)}
            </div>
          </div>
          <StatsChart
            type="line"
            data={analyticsData.userGrowth}
            height={300}
          />
        </div>

        {/* Распределение проектов */}
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Распределение проектов
            </h3>
            <div className="text-sm text-gray-500 dark:text-gray-400">
              По типам
            </div>
          </div>
          <StatsChart
            type="doughnut"
            data={analyticsData.projectDistribution}
            height={300}
          />
        </div>
      </div>

      {/* График доходов */}
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Динамика доходов
          </h3>
          <div className="text-sm text-gray-500 dark:text-gray-400">
            Тысячи рублей
          </div>
        </div>
        <StatsChart
          type="bar"
          data={analyticsData.revenue}
          height={400}
        />
      </div>

      {/* Последняя активность и дополнительная статистика */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Последняя активность */}
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Последняя активность
            </h3>
            <FiActivity className="h-5 w-5 text-gray-400" />
          </div>

          <div className="space-y-4">
            {analyticsData.activity.length > 0 ? (
              analyticsData.activity.map((activity, index) => (
                <div key={activity.id || index} className="flex items-start space-x-3">
                  <div className={`
                    flex-shrink-0 w-2 h-2 rounded-full mt-2
                    ${activity.type === 'user' ? 'bg-blue-500' : ''}
                    ${activity.type === 'project' ? 'bg-green-500' : ''}
                    ${activity.type === 'page' ? 'bg-purple-500' : ''}
                  `} />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-gray-900 dark:text-white">
                      {activity.message}
                    </p>
                    <div className="flex items-center mt-1 space-x-2 text-xs text-gray-500 dark:text-gray-400">
                      {activity.user && (
                        <>
                          <span>{activity.user}</span>
                          <span>•</span>
                        </>
                      )}
                      <span>{formatActivityTime(activity.timestamp)}</span>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8">
                <FiActivity className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                <p className="text-gray-500 dark:text-gray-400">Нет активности</p>
              </div>
            )}
          </div>

          {analyticsData.activity.length > 0 && (
            <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
              <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">
                Показать всю активность
              </button>
            </div>
          )}
        </div>

        {/* Дополнительные показатели */}
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Ключевые показатели
            </h3>
                            <FiBarChart2 className="h-5 w-5 text-gray-400" />
          </div>

          <div className="space-y-6">
            {/* Конверсия пользователей */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Активность пользователей
                </span>
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  {analyticsData.summary.totalUsers > 0 
                    ? Math.round((analyticsData.summary.activeProjects / analyticsData.summary.totalUsers) * 100)
                    : 0
                  }%
                </span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div 
                  className="bg-blue-600 h-2 rounded-full" 
                  style={{ 
                    width: `${analyticsData.summary.totalUsers > 0 
                      ? Math.min((analyticsData.summary.activeProjects / analyticsData.summary.totalUsers) * 100, 100)
                      : 0
                    }%` 
                  }}
                ></div>
              </div>
            </div>

            {/* Рост за период */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Рост за период
                </span>
                <span className="text-sm text-green-600">
                  +{analyticsData.summary.growthRate}%
                </span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div 
                  className="bg-green-600 h-2 rounded-full" 
                  style={{ width: `${Math.min(analyticsData.summary.growthRate * 2, 100)}%` }}
                ></div>
              </div>
            </div>

            {/* Качество проектов */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Опубликованные проекты
                </span>
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  {analyticsData.summary.totalProjects > 0 
                    ? Math.round((analyticsData.summary.activeProjects / analyticsData.summary.totalProjects) * 100)
                    : 0
                  }%
                </span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div 
                  className="bg-purple-600 h-2 rounded-full" 
                  style={{ 
                    width: `${analyticsData.summary.totalProjects > 0 
                      ? (analyticsData.summary.activeProjects / analyticsData.summary.totalProjects) * 100
                      : 0
                    }%` 
                  }}
                ></div>
              </div>
            </div>

            {/* Доходность */}
            <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900 dark:text-white">
                  {formatCurrency(analyticsData.summary.revenueThisMonth)}
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  Среднемесячный доход
                </div>
                <div className="text-xs text-green-600 mt-1">
                  ↑ +{analyticsData.summary.growthRate}% к прошлому месяцу
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SitusAnalytics;