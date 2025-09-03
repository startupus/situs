import React from 'react';

interface SummaryTabProps {
  projectId: string;
}

const SummaryTab: React.FC<SummaryTabProps> = ({ projectId }) => {
  return (
    <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
      {/* Карточки-метрики */}
      <div className="xl:col-span-2 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Заявки', value: '—' },
          { label: 'Страницы', value: '5' },
          { label: 'Показы', value: '—' },
          { label: 'Новые пользователи', value: '—' },
        ].map((card) => (
          <div
            key={card.label}
            className="rounded-xl border border-stroke dark:border-dark-3 bg-white dark:bg-dark-2 p-4"
          >
            <div className="text-sm text-body-color dark:text-dark-6">{card.label}</div>
            <div className="mt-1 text-2xl font-semibold text-dark dark:text-white">{card.value}</div>
          </div>
        ))}
      </div>

      {/* Недавняя активность */}
      <div className="rounded-xl border border-stroke dark:border-dark-3 bg-white dark:bg-dark-2 p-4">
        <div className="font-semibold text-dark dark:text-white mb-3">Активность проекта</div>
        <ul className="space-y-2 text-sm text-body-color dark:text-dark-6">
          <li>• Создан проект</li>
          <li>• Автосоздано 5 страниц</li>
          <li>• Активированы продукты: Сайт, Блог, Магазин</li>
        </ul>
      </div>
    </div>
  );
};

export default SummaryTab;
