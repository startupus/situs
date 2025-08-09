import React from 'react';

const StoreTab: React.FC = () => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Левая панель фильтров */}
      <div className="lg:col-span-1 rounded-xl border border-stroke dark:border-dark-3 bg-white dark:bg-dark-2 p-4">
        <div className="font-semibold text-dark dark:text-white mb-3">Фильтры</div>
        <div className="space-y-3 text-sm text-body-color dark:text-dark-6">
          <div>
            <div className="font-medium text-dark dark:text-white mb-1">Категории</div>
            <div className="space-y-1">
              <label className="flex items-center gap-2"><input type="checkbox"/> Все</label>
              <label className="flex items-center gap-2"><input type="checkbox"/> Новинки</label>
              <label className="flex items-center gap-2"><input type="checkbox"/> Распродажа</label>
            </div>
          </div>
          <div>
            <div className="font-medium text-dark dark:text-white mb-1">Свойства</div>
            <div className="space-y-1">
              <label className="flex items-center gap-2"><input type="checkbox"/> В наличии</label>
              <label className="flex items-center gap-2"><input type="checkbox"/> С доставкой</label>
            </div>
          </div>
        </div>
      </div>

      {/* Правая часть: список + верхнее горизонтальное меню */}
      <div className="lg:col-span-2 space-y-4">
        <div className="rounded-xl border border-stroke dark:border-dark-3 bg-white dark:bg-dark-2 p-2">
          <nav className="flex items-center gap-2 text-sm">
            {['Товары', 'Заказы', 'Свойства', 'Настройки'].map((t) => (
              <button key={t} className="px-3 py-2 rounded hover:bg-gray-100 dark:hover:bg-dark-3">
                {t}
              </button>
            ))}
          </nav>
        </div>
        <div className="rounded-xl border border-stroke dark:border-dark-3 bg-white dark:bg-dark-2 p-4">
          <div className="font-semibold text-dark dark:text-white mb-3">Товары</div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {[1,2,3,4].map((i) => (
              <div key={i} className="rounded-lg border border-stroke dark:border-dark-3 p-3">
                <div className="text-sm font-medium text-dark dark:text-white">Товар {i}</div>
                <div className="text-xs text-body-color dark:text-dark-6">Описание товара...</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StoreTab;


