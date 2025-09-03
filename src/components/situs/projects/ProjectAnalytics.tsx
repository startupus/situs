import React from 'react';
import { ProjectData } from '../../../types/project';

interface ProjectAnalyticsProps {
  project: ProjectData;
  showOverview?: boolean;
  showProducts?: boolean;
}

const ProjectAnalytics: React.FC<ProjectAnalyticsProps> = ({ project, showOverview = true, showProducts = false }) => {
  // Общая аналитика по всем продуктам проекта
  const totalAnalytics = project.products?.reduce(
    (acc, product) => {
      if (product.analytics) {
        acc.visitors += product.analytics.visitors;
        acc.pageViews += product.analytics.pageViews;
        acc.revenue += product.analytics.revenue;
        acc.conversionRate = (acc.conversionRate + product.analytics.conversionRate) / 2;
      }
      return acc;
    },
    {
      visitors: 0,
      pageViews: 0,
      revenue: 0,
      conversionRate: 0,
    },
  ) || {
    visitors: 0,
    pageViews: 0,
    revenue: 0,
    conversionRate: 0,
  };

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('ru-RU').format(num);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('ru-RU', {
      style: 'currency',
      currency: 'RUB',
    }).format(amount);
  };

  return (
    <div className="space-y-6">
      {/* Общая статистика (опционально) */}
      {showOverview && (
        <div>
          <h2 className="text-lg font-semibold text-dark dark:text-white mb-4">Общая статистика проекта</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white dark:bg-dark-2 rounded-lg p-4 border border-stroke dark:border-dark-3">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-body-color dark:text-dark-6">Посетители</p>
                  <p className="text-2xl font-bold text-dark dark:text-white">
                    {formatNumber(totalAnalytics.visitors)}
                  </p>
                </div>
                <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/20 rounded-lg flex items-center justify-center">
                  <svg width="20" height="20" viewBox="0 0 20 20" className="fill-current text-blue-600">
                    <path d="M10 2C5.58 2 2 5.58 2 10C2 14.42 5.58 18 10 18C14.42 18 18 14.42 18 10C18 5.58 14.42 2 10 2ZM10 16C6.69 16 4 13.31 4 10C4 6.69 6.69 4 10 4C13.31 4 16 6.69 16 10C16 13.31 13.31 16 10 16Z" />
                    <path d="M10 6C8.34 6 7 7.34 7 9C7 10.66 8.34 12 10 12C11.66 12 13 10.66 13 9C13 7.34 11.66 6 10 6ZM10 10C9.45 10 9 9.55 9 9C9 8.45 9.45 8 10 8C10.55 8 11 8.45 11 9C11 9.55 10.55 10 10 10Z" />
                  </svg>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-dark-2 rounded-lg p-4 border border-stroke dark:border-dark-3">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-body-color dark:text-dark-6">Просмотры</p>
                  <p className="text-2xl font-bold text-dark dark:text-white">
                    {formatNumber(totalAnalytics.pageViews)}
                  </p>
                </div>
                <div className="w-12 h-12 bg-green-100 dark:bg-green-900/20 rounded-lg flex items-center justify-center">
                  <svg width="20" height="20" viewBox="0 0 20 20" className="fill-current text-green-600">
                    <path d="M10 2C5.58 2 2 5.58 2 10C2 14.42 5.58 18 10 18C14.42 18 18 14.42 18 10C18 5.58 14.42 2 10 2ZM10 16C6.69 16 4 13.31 4 10C4 6.69 6.69 4 10 4C13.31 4 16 6.69 16 10C16 13.31 13.31 16 10 16Z" />
                    <path d="M10 6C8.34 6 7 7.34 7 9C7 10.66 8.34 12 10 12C11.66 12 13 10.66 13 9C13 7.34 11.66 6 10 6ZM10 10C9.45 10 9 9.55 9 9C9 8.45 9.45 8 10 8C10.55 8 11 8.45 11 9C11 9.55 10.55 10 10 10Z" />
                  </svg>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-dark-2 rounded-lg p-4 border border-stroke dark:border-dark-3">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-body-color dark:text-dark-6">Конверсия</p>
                  <p className="text-2xl font-bold text-dark dark:text-white">
                    {totalAnalytics.conversionRate.toFixed(1)}%
                  </p>
                </div>
                <div className="w-12 h-12 bg-yellow-100 dark:bg-yellow-900/20 rounded-lg flex items-center justify-center">
                  <svg width="20" height="20" viewBox="0 0 20 20" className="fill-current text-yellow-600">
                    <path d="M10 2C5.58 2 2 5.58 2 10C2 14.42 5.58 18 10 18C14.42 18 18 14.42 18 10C18 5.58 14.42 2 10 2ZM10 16C6.69 16 4 13.31 4 10C4 6.69 6.69 4 10 4C13.31 4 16 6.69 16 10C16 13.31 13.31 16 10 16Z" />
                    <path d="M10 6C8.34 6 7 7.34 7 9C7 10.66 8.34 12 10 12C11.66 12 13 10.66 13 9C13 7.34 11.66 6 10 6ZM10 10C9.45 10 9 9.55 9 9C9 8.45 9.45 8 10 8C10.55 8 11 8.45 11 9C11 9.55 10.55 10 10 10Z" />
                  </svg>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-dark-2 rounded-lg p-4 border border-stroke dark:border-dark-3">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-body-color dark:text-dark-6">Доход</p>
                  <p className="text-2xl font-bold text-dark dark:text-white">
                    {formatCurrency(totalAnalytics.revenue)}
                  </p>
                </div>
                <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/20 rounded-lg flex items-center justify-center">
                  <svg width="20" height="20" viewBox="0 0 20 20" className="fill-current text-purple-600">
                    <path d="M10 2C5.58 2 2 5.58 2 10C2 14.42 5.58 18 10 18C14.42 18 18 14.42 18 10C18 5.58 14.42 2 10 2ZM10 16C6.69 16 4 13.31 4 10C4 6.69 6.69 4 10 4C13.31 4 16 6.69 16 10C16 13.31 13.31 16 10 16Z" />
                    <path d="M10 6C8.34 6 7 7.34 7 9C7 10.66 8.34 12 10 12C11.66 12 13 10.66 13 9C13 7.34 11.66 6 10 6ZM10 10C9.45 10 9 9.55 9 9C9 8.45 9.45 8 10 8C10.55 8 11 8.45 11 9C11 9.55 10.55 10 10 10Z" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Аналитика по продуктам (опционально) */}
      {showProducts && (
        <div>
          <h2 className="text-lg font-semibold text-dark dark:text-white mb-4">Аналитика по продуктам</h2>
          <div className="bg-white dark:bg-dark-2 rounded-lg border border-stroke dark:border-dark-3 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 dark:bg-dark-3">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-body-color dark:text-dark-6 uppercase tracking-wider">
                      Продукт
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-body-color dark:text-dark-6 uppercase tracking-wider">
                      Посетители
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-body-color dark:text-dark-6 uppercase tracking-wider">
                      Просмотры
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-body-color dark:text-dark-6 uppercase tracking-wider">
                      Конверсия
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-body-color dark:text-dark-6 uppercase tracking-wider">
                      Доход
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stroke dark:divide-dark-3">
                  {project.products?.map((product) => (
                    <tr key={product.id} className="hover:bg-gray-50 dark:hover:bg-dark-3">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-dark dark:text-white">{product.name}</div>
                          <div className="text-sm text-body-color dark:text-dark-6">{product.type}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-dark dark:text-white">
                        {product.analytics ? formatNumber(product.analytics.visitors) : '0'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-dark dark:text-white">
                        {product.analytics ? formatNumber(product.analytics.pageViews) : '0'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-dark dark:text-white">
                        {product.analytics ? `${product.analytics.conversionRate.toFixed(1)}%` : '0%'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-dark dark:text-white">
                        {product.analytics ? formatCurrency(product.analytics.revenue) : '₽0'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProjectAnalytics;
