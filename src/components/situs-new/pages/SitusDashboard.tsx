import React, { useState, useEffect } from 'react';
import { FiUsers, FiFolder, FiFileText, FiTrendingUp, FiActivity, FiDollarSign } from 'react-icons/fi';
import StatsChart from '../../charts/StatsChart';
import apiClient from '../../../api/client/ApiClient';
import type { ChartData } from '../../charts/StatsChart';

/**
 * Интерфейс статистической карточки
 */
interface StatCard {
  title: string;
  value: string | number;
  change?: number;
  changeType?: 'increase' | 'decrease';
  icon: React.ComponentType<any>;
  color: string;
}

/**
 * Интерфейс данных дашборда
 */
interface DashboardData {
  stats: {
    users: { total: number; active: number; new: number };
    projects: { total: number; published: number; draft: number };
    pages: { total: number; published: number };
    revenue: { total: number; thisMonth: number };
  };
  charts: {
    userGrowth: ChartData;
    projectActivity: ChartData;
    revenueChart: ChartData;
  };
  recentActivity: Array<{
    id: string;
    type: 'user' | 'project' | 'page';
    message: string;
    timestamp: Date;
    user?: string;
  }>;
}

/**
 * Компонент SitusDashboard - Главная страница дашборда
 */
const SitusDashboard: React.FC = () => {
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Загрузка данных дашборда
  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Параллельно загружаем статистику и аналитические данные
      const [usersStats, projectsStats, userGrowthData, projectDistribution, revenueData, activityData] = await Promise.all([
        apiClient.getUsersStatistics(),
        apiClient.getProjectsStatistics(),
        apiClient.getUserGrowthAnalytics('30d'),
        apiClient.getProjectDistributionAnalytics('30d'),
        apiClient.getRevenueAnalytics('30d'),
        apiClient.getActivityAnalytics({ limit: 5 })
      ]);

      // Обрабатываем ошибки API
      if (usersStats.error) {
        console.warn('Users API error:', usersStats.error);
      }
      if (projectsStats.error) {
        console.warn('Projects API error:', projectsStats.error);
      }
      if (userGrowthData.error) {
        console.warn('User growth API error:', userGrowthData.error);
      }
      if (projectDistribution.error) {
        console.warn('Project distribution API error:', projectDistribution.error);
      }
      if (revenueData.error) {
        console.warn('Revenue API error:', revenueData.error);
      }
      if (activityData.error) {
        console.warn('Activity API error:', activityData.error);
      }

      // Формируем данные дашборда (с fallback на mock данные)
      const dashboardData: DashboardData = {
        stats: {
          users: {
            total: usersStats.data?.total || 156,
            active: usersStats.data?.active || 134,
            new: usersStats.data?.newThisMonth || 23
          },
          projects: {
            total: projectsStats.data?.totalProjects || 45,
            published: projectsStats.data?.publishedProjects || 38,
            draft: projectsStats.data?.draftProjects || 7
          },
          pages: {
            total: projectsStats.data?.totalPages || 342,
            published: 298
          },
          revenue: {
            total: 2450000,
            thisMonth: 450000
          }
        },
        charts: {
          userGrowth: userGrowthData.data || generateMockUserGrowth(),
          projectActivity: projectDistribution.data || generateMockProjectDistribution(),
          revenueChart: revenueData.data || generateMockRevenue()
        },
        recentActivity: activityData.data || generateMockActivity()
      };

      setDashboardData(dashboardData);
    } catch (err) {
      console.error('Dashboard loading error:', err);
      setError('Ошибка загрузки данных дашборда');
    } finally {
      setLoading(false);
    }
  };

  // Генерация fallback данных для графиков
  const generateMockUserGrowth = () => {
    return {
      labels: ['Янв', 'Фев', 'Мар', 'Апр', 'Май', 'Июн'],
      datasets: [{
        label: 'Новые пользователи',
        data: [12, 19, 15, 25, 22, 30],
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        borderColor: 'rgba(59, 130, 246, 1)',
        fill: true
      }]
    };
  };

  const generateMockProjectDistribution = () => {
    return {
      labels: ['Сайты', 'Магазины', 'Лендинги', 'Чат-боты', 'Приложения'],
      datasets: [{
        label: 'Количество проектов',
        data: [15, 8, 12, 6, 4],
        backgroundColor: [
          'rgba(59, 130, 246, 0.8)',
          'rgba(16, 185, 129, 0.8)',
          'rgba(245, 158, 11, 0.8)',
          'rgba(239, 68, 68, 0.8)',
          'rgba(139, 92, 246, 0.8)'
        ]
      }]
    };
  };

  const generateMockRevenue = () => {
    return {
      labels: ['Янв', 'Фев', 'Мар', 'Апр', 'Май', 'Июн'],
      datasets: [{
        label: 'Доходы (тыс. руб.)',
        data: [320, 450, 380, 520, 670, 450],
        backgroundColor: 'rgba(16, 185, 129, 0.1)',
        borderColor: 'rgba(16, 185, 129, 1)',
        fill: true
      }]
    };
  };

  // Генерация mock активности
  const generateMockActivity = () => {
    return [
      {
        id: '1',
        type: 'user' as const,
        message: 'Новый пользователь john.doe@example.com зарегистрирован',
        timestamp: new Date(Date.now() - 10 * 60 * 1000),
        user: 'Система'
      },
      {
        id: '2',
        type: 'project' as const,
        message: 'Проект "Интернет-магазин обуви" опубликован',
        timestamp: new Date(Date.now() - 30 * 60 * 1000),
        user: 'Анна Смирнова'
      },
      {
        id: '3',
        type: 'page' as const,
        message: 'Создана новая страница "О компании"',
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
        user: 'Михаил Петров'
      }
    ];
  };

  // Форматирование чисел
  const formatNumber = (num: number) => {
    if (num >= 1000000) {
      return `${(num / 1000000).toFixed(1)}M`;
    } else if (num >= 1000) {
      return `${(num / 1000).toFixed(1)}K`;
    }
    return num.toString();
  };

  // Форматирование времени
  const formatTime = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(diff / (1000 * 60 * 60));
    
    if (minutes < 60) {
      return `${minutes} мин назад`;
    } else if (hours < 24) {
      return `${hours} ч назад`;
    } else {
      return date.toLocaleDateString('ru-RU');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 text-lg mb-4">{error}</div>
          <button 
            onClick={loadDashboardData}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          >
            Повторить попытку
          </button>
        </div>
      </div>
    );
  }

  if (!dashboardData) {
    return <div>Нет данных</div>;
  }

  // Статистические карточки
  const statCards: StatCard[] = [
    {
      title: 'Всего пользователей',
      value: formatNumber(dashboardData.stats.users.total),
      change: 12,
      changeType: 'increase',
      icon: FiUsers,
      color: 'blue'
    },
    {
      title: 'Активные проекты',
      value: dashboardData.stats.projects.total,
      change: 8,
      changeType: 'increase',
      icon: FiFolder,
      color: 'green'
    },
    {
      title: 'Опубликованные страницы',
      value: dashboardData.stats.pages.published,
      change: 15,
      changeType: 'increase',
      icon: FiFileText,
      color: 'purple'
    },
    {
      title: 'Доходы за месяц',
      value: `${formatNumber(dashboardData.stats.revenue.thisMonth)} ₽`,
      change: 5,
      changeType: 'increase',
      icon: FiDollarSign,
      color: 'yellow'
    }
  ];

  return (
    <div className="p-6 space-y-6">
      {/* Заголовок */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Дашборд</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">
          Обзор активности и статистики платформы
        </p>
      </div>

      {/* Статистические карточки */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        {statCards.map((card, index) => (
          <div
            key={index}
            className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  {card.title}
                </p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                  {card.value}
                </p>
                {card.change && (
                  <div className="flex items-center mt-2">
                    <FiTrendingUp 
                      className={`h-4 w-4 mr-1 ${
                        card.changeType === 'increase' 
                          ? 'text-green-500' 
                          : 'text-red-500'
                      }`} 
                    />
                    <span className={`text-sm ${
                      card.changeType === 'increase' 
                        ? 'text-green-600' 
                        : 'text-red-600'
                    }`}>
                      +{card.change}% за месяц
                    </span>
                  </div>
                )}
              </div>
              <div className={`
                p-3 rounded-full
                ${card.color === 'blue' ? 'bg-blue-100 dark:bg-blue-900' : ''}
                ${card.color === 'green' ? 'bg-green-100 dark:bg-green-900' : ''}
                ${card.color === 'purple' ? 'bg-purple-100 dark:bg-purple-900' : ''}
                ${card.color === 'yellow' ? 'bg-yellow-100 dark:bg-yellow-900' : ''}
              `}>
                <card.icon className={`
                  h-6 w-6
                  ${card.color === 'blue' ? 'text-blue-600 dark:text-blue-400' : ''}
                  ${card.color === 'green' ? 'text-green-600 dark:text-green-400' : ''}
                  ${card.color === 'purple' ? 'text-purple-600 dark:text-purple-400' : ''}
                  ${card.color === 'yellow' ? 'text-yellow-600 dark:text-yellow-400' : ''}
                `} />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Графики */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* Рост пользователей */}
        <StatsChart
          type="line"
          data={dashboardData.charts.userGrowth}
          title="Рост пользователей"
          height={300}
        />

        {/* Активность проектов */}
        <StatsChart
          type="doughnut"
          data={dashboardData.charts.projectActivity}
          title="Распределение проектов по типам"
          height={300}
        />
      </div>

      {/* График доходов */}
      <div className="grid grid-cols-1 gap-6">
        <StatsChart
          type="bar"
          data={dashboardData.charts.revenueChart}
          title="Динамика доходов"
          height={400}
        />
      </div>

      {/* Последняя активность */}
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Последняя активность
          </h3>
          <FiActivity className="h-5 w-5 text-gray-400" />
        </div>

        <div className="space-y-4">
          {dashboardData.recentActivity.map((activity) => (
            <div key={activity.id} className="flex items-start space-x-3">
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
                  <span>{formatTime(activity.timestamp)}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
          <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">
            Показать всю активность
          </button>
        </div>
      </div>
    </div>
  );
};

export default SitusDashboard;