import React from 'react';
import { FiPlus, FiEdit3, FiTrash2, FiExternalLink } from 'react-icons/fi';

interface PagesTabProps {
  projectId: string;
}

const PagesTab: React.FC<PagesTabProps> = () => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Левая колонка: меню сайта */}
      <div className="lg:col-span-1 rounded-xl border border-stroke dark:border-dark-3 bg-white dark:bg-dark-2 p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="font-semibold text-dark dark:text-white">Меню сайта</div>
          <button className="inline-flex items-center gap-1 text-sm text-primary">
            <FiPlus /> Новое меню
          </button>
        </div>
        <ul className="space-y-1 text-sm">
          <li className="flex items-center justify-between px-2 py-1 rounded hover:bg-gray-50 dark:hover:bg-dark-3">
            <span>Главное меню</span>
            <button className="text-body-color hover:text-primary">Настроить</button>
          </li>
          <li className="flex items-center justify-between px-2 py-1 rounded hover:bg-gray-50 dark:hover:bg-dark-3">
            <span>Футер</span>
            <button className="text-body-color hover:text-primary">Настроить</button>
          </li>
        </ul>
      </div>

      {/* Правая колонка: список страниц */}
      <div className="lg:col-span-2 rounded-xl border border-stroke dark:border-dark-3 bg-white dark:bg-dark-2 p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="font-semibold text-dark dark:text-white">Страницы</div>
          <button className="inline-flex items-center gap-1 text-sm text-primary">
            <FiPlus /> Новая страница
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="text-left text-body-color dark:text-dark-6">
                <th className="py-2 pr-4">Название</th>
                <th className="py-2 pr-4">Слаг</th>
                <th className="py-2 pr-4">Тип</th>
                <th className="py-2 pr-4">Действия</th>
              </tr>
            </thead>
            <tbody>
              {[
                { title: 'Главная', slug: 'home', type: 'page' },
                { title: 'О компании', slug: 'about', type: 'page' },
                { title: 'Продукты', slug: 'products', type: 'page' },
                { title: 'Блог', slug: 'blog', type: 'product' },
                { title: 'Контакты', slug: 'contacts', type: 'page' },
              ].map((row) => (
                <tr key={row.slug} className="border-t border-stroke dark:border-dark-3">
                  <td className="py-2 pr-4">{row.title}</td>
                  <td className="py-2 pr-4">/{row.slug}</td>
                  <td className="py-2 pr-4">{row.type === 'product' ? 'Продукт' : 'Страница'}</td>
                  <td className="py-2 pr-4">
                    <div className="flex items-center gap-2 text-body-color">
                      <button title="Открыть на сайте" className="hover:text-primary"><FiExternalLink /></button>
                      <button title="Редактировать" className="hover:text-primary"><FiEdit3 /></button>
                      <button title="Удалить" className="hover:text-red-500"><FiTrash2 /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default PagesTab;


