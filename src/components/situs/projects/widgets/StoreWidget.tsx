import React from 'react';

const StoreWidget: React.FC = () => {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="rounded-lg border border-stroke dark:border-dark-3 p-3 bg-gray-50 dark:bg-dark-3">
          <div className="text-xs text-body-color dark:text-dark-6">Выручка</div>
          <div className="text-xl font-semibold text-dark dark:text-white">—</div>
        </div>
        <div className="rounded-lg border border-stroke dark:border-dark-3 p-3 bg-gray-50 dark:bg-dark-3">
          <div className="text-xs text-body-color dark:text-dark-6">Заказы</div>
          <div className="text-xl font-semibold text-dark dark:text-white">—</div>
        </div>
        <div className="rounded-lg border border-stroke dark:border-dark-3 p-3 bg-gray-50 dark:bg-dark-3">
          <div className="text-xs text-body-color dark:text-dark-6">Конверсия</div>
          <div className="text-xl font-semibold text-dark dark:text-white">—</div>
        </div>
        <div className="rounded-lg border border-stroke dark:border-dark-3 p-3 bg-gray-50 dark:bg-dark-3">
          <div className="text-xs text-body-color dark:text-dark-6">Товары</div>
          <div className="text-xl font-semibold text-dark dark:text-white">—</div>
        </div>
      </div>
    </div>
  );
};

export default StoreWidget;


