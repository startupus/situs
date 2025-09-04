import React from 'react';
type ProjectData = any;

interface ProjectKpiStripProps {
  project: ProjectData;
}

const ProjectKpiStrip: React.FC<ProjectKpiStripProps> = ({ project }) => {
  const total = project.products?.reduce(
    (acc, product) => {
      const a: any = (product as any).analytics;
      if (a) {
        acc.visitors += a.visitors || 0;
        acc.pageViews += a.pageViews || 0;
        acc.revenue += a.revenue || 0;
        acc._convSum += a.conversionRate || 0;
        acc._convCount += 1;
      }
      return acc;
    },
    { visitors: 0, pageViews: 0, revenue: 0, _convSum: 0, _convCount: 0 },
  ) as any;

  const conversionRate = total._convCount > 0 ? total._convSum / total._convCount : 0;

  const formatNumber = (num: number) => new Intl.NumberFormat('ru-RU').format(num);
  const formatCurrency = (amount: number) =>
    new Intl.NumberFormat('ru-RU', { style: 'currency', currency: 'RUB' }).format(amount);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
      <div className="bg-white dark:bg-dark-2 rounded-lg p-4 border border-stroke dark:border-dark-3">
        <p className="text-xs text-body-color dark:text-dark-6">Посетители</p>
        <p className="text-xl font-semibold text-dark dark:text-white">{formatNumber(total.visitors)}</p>
      </div>
      <div className="bg-white dark:bg-dark-2 rounded-lg p-4 border border-stroke dark:border-dark-3">
        <p className="text-xs text-body-color dark:text-dark-6">Просмотры</p>
        <p className="text-xl font-semibold text-dark dark:text-white">{formatNumber(total.pageViews)}</p>
      </div>
      <div className="bg-white dark:bg-dark-2 rounded-lg p-4 border border-stroke dark:border-dark-3">
        <p className="text-xs text-body-color dark:text-dark-6">Конверсия</p>
        <p className="text-xl font-semibold text-dark dark:text-white">{conversionRate.toFixed(1)}%</p>
      </div>
      <div className="bg-white dark:bg-dark-2 rounded-lg p-4 border border-stroke dark:border-dark-3">
        <p className="text-xs text-body-color dark:text-dark-6">Доход</p>
        <p className="text-xl font-semibold text-dark dark:text-white">{formatCurrency(total.revenue)}</p>
      </div>
    </div>
  );
};

export default ProjectKpiStrip;
