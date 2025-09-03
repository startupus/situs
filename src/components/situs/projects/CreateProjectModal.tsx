import React, { useState } from 'react';
import { CreateProjectData } from '../../../types/project';

interface CreateProjectModalProps {
  onClose: () => void;
  onSuccess: () => void;
}

const CreateProjectModal: React.FC<CreateProjectModalProps> = ({ onClose, onSuccess }) => {
  const [projectData, setProjectData] = useState<CreateProjectData>({
    name: '',
    description: '',
    domain: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const projectTypes = [
    {
      id: 'WEBSITE',
      name: 'Веб-сайт',
      description: 'Корпоративный сайт или портфолио',
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" className="fill-current">
          <path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM12 20C7.59 20 4 16.41 4 12C4 7.59 7.59 4 12 4C16.41 4 20 7.59 20 12C20 16.41 16.41 20 12 20Z" />
          <path d="M8 8H16V10H8V8ZM8 12H16V14H8V12Z" />
        </svg>
      ),
    },
    {
      id: 'ECOMMERCE',
      name: 'Интернет-магазин',
      description: 'Онлайн-продажи и каталог товаров',
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" className="fill-current">
          <path d="M3 3V5H4V19C4 19.55 4.45 20 5 20H19C19.55 20 20 19.55 20 19V5H21V3H3ZM6 5H18V19H6V5Z" />
          <path d="M8 7V9H9V7H8ZM12 7V9H13V7H12Z" />
        </svg>
      ),
    },
    {
      id: 'LANDING',
      name: 'Лендинг',
      description: 'Одностраничный сайт для продвижения',
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" className="fill-current">
          <path d="M3 3H21V5H3V3ZM3 7H21V9H3V7ZM3 11H21V13H3V11ZM3 15H21V17H3V15ZM3 19H21V21H3V19Z" />
        </svg>
      ),
    },
    {
      id: 'BLOG',
      name: 'Блог',
      description: 'Платформа для публикации статей',
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" className="fill-current">
          <path d="M19 3H5C3.89 3 3 3.89 3 5V19C3 20.11 3.89 21 5 21H19C20.11 21 21 20.11 21 19V5C21 3.89 20.11 3 19 3ZM19 19H5V5H19V19Z" />
          <path d="M7 7H17V9H7V7ZM7 11H17V13H7V11ZM7 15H14V17H7V15Z" />
        </svg>
      ),
    },
    {
      id: 'APP',
      name: 'Приложение',
      description: 'Веб-приложение или SaaS',
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" className="fill-current">
          <path d="M6 2H18C19.1046 2 20 2.89543 20 4V20C20 21.1046 19.1046 22 18 22H6C4.89543 22 4 21.1046 4 20V4C4 2.89543 4.89543 2 6 2ZM6 4V20H18V4H6Z" />
          <path d="M8 6H16V8H8V6ZM8 10H16V12H8V10Z" />
        </svg>
      ),
    },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Используем централизованный API клиент
      const { projectsApi } = await import('../../../api/services/projects.api');
      await projectsApi.createProject({
        name: projectData.name,
        description: projectData.description,
      } as any);
      onSuccess();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Неизвестная ошибка');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-dark-2 rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Заголовок */}
        <div className="flex items-center justify-between p-6 border-b border-stroke dark:border-dark-3">
          <h2 className="text-xl font-semibold text-dark dark:text-white">Создать новый проект</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" className="fill-current">
              <path d="M19 6.41L17.59 5L12 10.59L6.41 5L5 6.41L10.59 12L5 17.59L6.41 19L12 13.41L17.59 19L19 17.59L13.41 12L19 6.41Z" />
            </svg>
          </button>
        </div>

        {/* Форма */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Название проекта */}
          <div>
            <label className="block text-sm font-medium text-dark dark:text-white mb-2">Название проекта *</label>
            <input
              type="text"
              value={projectData.name}
              onChange={(e) => setProjectData({ ...projectData, name: e.target.value })}
              placeholder="Введите название проекта"
              className="w-full px-3 py-2 border border-stroke dark:border-dark-3 rounded-lg bg-white dark:bg-dark-2 text-dark dark:text-white placeholder-body-color dark:placeholder-dark-6 focus:border-primary focus:outline-none transition-colors"
              required
            />
          </div>

          {/* Описание */}
          <div>
            <label className="block text-sm font-medium text-dark dark:text-white mb-2">Описание</label>
            <textarea
              value={projectData.description}
              onChange={(e) => setProjectData({ ...projectData, description: e.target.value })}
              placeholder="Краткое описание проекта"
              rows={3}
              className="w-full px-3 py-2 border border-stroke dark:border-dark-3 rounded-lg bg-white dark:bg-dark-2 text-dark dark:text-white placeholder-body-color dark:placeholder-dark-6 focus:border-primary focus:outline-none transition-colors resize-none"
            />
          </div>

          {/* Информация о структуре проекта */}
          <div className="p-4 border rounded-lg text-sm text-body-color dark:text-dark-6">
            Проект — контейнер: домен, владельцы и доступы. Продукты (сайт, магазин, блог) добавляются внутри проекта.
          </div>

          {/* Домен */}
          <div>
            <label className="block text-sm font-medium text-dark dark:text-white mb-2">Домен (опционально)</label>
            <input
              type="text"
              value={projectData.domain}
              onChange={(e) => setProjectData({ ...projectData, domain: e.target.value })}
              placeholder="example.com или оставьте пустым"
              className="w-full px-3 py-2 border border-stroke dark:border-dark-3 rounded-lg bg-white dark:bg-dark-2 text-dark dark:text-white placeholder-body-color dark:placeholder-dark-6 focus:border-primary focus:outline-none transition-colors"
            />
          </div>

          {/* Ошибка */}
          {error && (
            <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
              <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
            </div>
          )}

          {/* Кнопки */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 text-sm font-medium text-body-color dark:text-dark-6 bg-gray-100 dark:bg-dark-3 rounded-lg hover:bg-gray-200 dark:hover:bg-dark-4 transition-colors"
            >
              Отмена
            </button>
            <button
              type="submit"
              disabled={loading || !projectData.name}
              className="flex-1 px-4 py-2 text-sm font-medium text-white bg-primary rounded-lg hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? 'Создание...' : 'Создать проект'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateProjectModal;
