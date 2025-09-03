import React from 'react';
import { useParams, Link } from 'react-router-dom';

// Настройки компонента "Страницы". Заголовок и крошки рендерятся верхней панелью.
const SitusProjectPagesSettings: React.FC = () => {
  const { projectId } = useParams<{ projectId: string }>();

  return (
    <div className="p-6">
      <div className="grid gap-6 md:grid-cols-2">
        <div className="bg-white dark:bg-dark-2 rounded-lg border border-stroke dark:border-dark-3 p-6">
          <h3 className="text-lg font-semibold text-dark dark:text-white mb-4">Отображение списка страниц</h3>
          <div className="space-y-4 text-sm text-body-color dark:text-dark-6">
            <div className="flex items-center justify-between">
              <span>Показывать категории в списке</span>
              <input type="checkbox" className="h-4 w-4" defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <span>Показывать статус публикации</span>
              <input type="checkbox" className="h-4 w-4" defaultChecked />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-dark-2 rounded-lg border border-stroke dark:border-dark-3 p-6">
          <h3 className="text-lg font-semibold text-dark dark:text-white mb-4">Поведение при создании</h3>
          <div className="space-y-4 text-sm text-body-color dark:text-dark-6">
            <div>
              <label className="block text-sm font-medium text-dark dark:text-white mb-2">Тип по умолчанию</label>
              <select className="w-full px-3 py-2 rounded-lg border border-stroke dark:border-dark-3 bg-white dark:bg-dark-3 text-dark dark:text-white">
                <option>PAGE</option>
                <option>BLOG_POST</option>
              </select>
            </div>
            <div className="flex items-center justify-between">
              <span>Открывать редактор после создания</span>
              <input type="checkbox" className="h-4 w-4" defaultChecked />
            </div>
          </div>
        </div>
      </div>

      <div className="mt-6 flex gap-3">
        <button className="rounded-lg bg-primary px-4 py-2 text-white hover:bg-primary/90">Сохранить</button>
        <Link
          to={`/projects/${projectId}/pages`}
          className="rounded-lg border border-stroke dark:border-dark-3 px-4 py-2 text-body-color dark:text-dark-6 hover:text-dark dark:hover:text-white"
        >
          Отмена
        </Link>
      </div>
    </div>
  );
};

export default SitusProjectPagesSettings;
