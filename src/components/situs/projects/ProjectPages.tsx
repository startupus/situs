import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ProjectData, PageData } from '../../../services/projectApi';

interface ProjectPagesProps {
  project: ProjectData;
}

const ProjectPages: React.FC<ProjectPagesProps> = ({ project }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [showCreateModal, setShowCreateModal] = useState(false);

  const filteredPages = project.pages.filter(page => {
    const matchesSearch = page.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         page.slug.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || page.status.toLowerCase() === statusFilter.toLowerCase();
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'published':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'draft':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'archived':
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
      default:
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
    }
  };

  const getStatusText = (status: string) => {
    switch (status.toLowerCase()) {
      case 'published':
        return 'Опубликована';
      case 'draft':
        return 'Черновик';
      case 'archived':
        return 'Архив';
      default:
        return status;
    }
  };

  const getPageTypeIcon = (pageType: string, isHomePage: boolean) => {
    if (isHomePage) return '🏠';
    
    switch (pageType.toLowerCase()) {
      case 'page':
        return '📄';
      case 'blog':
        return '📝';
      case 'contact':
        return '📞';
      case 'about':
        return 'ℹ️';
      default:
        return '📄';
    }
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-semibold text-dark dark:text-white mb-2">
            Страницы сайта
          </h2>
          <p className="text-body-color dark:text-dark-6">
            Управляйте страницами проекта {project.name}
          </p>
        </div>
        <div className="flex gap-2">
          <Link
            to={`/redaktus?projectId=${project.id}`}
            className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary/90 transition-colors"
          >
            ✏️ Открыть редактор
          </Link>
          <button
            onClick={() => setShowCreateModal(true)}
            className="inline-flex items-center gap-2 rounded-lg bg-gray-100 dark:bg-dark-3 px-4 py-2 text-sm font-medium text-dark dark:text-white hover:bg-gray-200 dark:hover:bg-dark-4 transition-colors"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" className="fill-current">
              <path d="M8 1C8.55228 1 9 1.44772 9 2V7H14C14.5523 7 15 7.44772 15 8C15 8.55228 14.5523 9 14 9H9V14C9 14.5523 8.55228 15 8 15C7.44772 15 7 14.5523 7 14V9H2C1.44772 9 1 8.55228 1 8C1 7.44772 1.44772 7 2 7H7V2C7 1.44772 7.44772 1 8 1Z"/>
            </svg>
            Добавить страницу
          </button>
        </div>
      </div>

      {/* Фильтры */}
      <div className="mb-6 space-y-4">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Поиск */}
          <div className="flex-1">
            <div className="relative">
              <input
                type="text"
                placeholder="Поиск страниц..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-stroke dark:border-dark-3 rounded-lg bg-white dark:bg-dark-2 text-dark dark:text-white placeholder-body-color dark:placeholder-dark-6 focus:border-primary focus:outline-none transition-colors"
              />
              <svg
                width="16"
                height="16"
                viewBox="0 0 16 16"
                className="absolute left-3 top-1/2 transform -translate-y-1/2 fill-current text-body-color dark:text-dark-6"
              >
                <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z"/>
              </svg>
            </div>
          </div>

          {/* Фильтр по статусу */}
          <div className="w-full md:w-48">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-3 py-2 border border-stroke dark:border-dark-3 rounded-lg bg-white dark:bg-dark-2 text-dark dark:text-white focus:border-primary focus:outline-none transition-colors"
            >
              <option value="all">Все статусы</option>
              <option value="draft">Черновики</option>
              <option value="published">Опубликованные</option>
              <option value="archived">Архив</option>
            </select>
          </div>
        </div>
      </div>

      {/* Список страниц */}
      {filteredPages.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-4xl mb-4">📄</div>
          <h3 className="text-lg font-semibold text-dark dark:text-white mb-2">
            {searchTerm || statusFilter !== 'all' ? 'Страницы не найдены' : 'Нет страниц'}
          </h3>
          <p className="text-body-color dark:text-dark-6 mb-4">
            {searchTerm || statusFilter !== 'all' 
              ? 'Попробуйте изменить фильтры поиска'
              : 'Создайте первую страницу в редакторе'
            }
          </p>
          {!searchTerm && statusFilter === 'all' && (
            <Link
              to={`/redaktus?projectId=${project.id}`}
              className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary/90 transition-colors"
            >
              ✏️ Открыть редактор
            </Link>
          )}
        </div>
      ) : (
        <div className="space-y-3">
          {filteredPages.map((page) => (
            <div
              key={page.id}
              className="bg-white dark:bg-dark-3 rounded-lg p-4 border border-stroke dark:border-dark-3 hover:border-primary dark:hover:border-primary transition-all duration-200"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-xl">
                      {getPageTypeIcon(page.pageType, page.isHomePage)}
                    </span>
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-dark dark:text-white">
                        {page.title}
                        {page.isHomePage && (
                          <span className="ml-2 text-xs bg-primary text-white px-2 py-1 rounded-full">
                            Главная
                          </span>
                        )}
                      </h3>
                      <p className="text-sm text-body-color dark:text-dark-6">
                        /{page.slug}
                      </p>
                    </div>
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(page.status)}`}>
                      {getStatusText(page.status)}
                    </span>
                  </div>

                  {page.metaDescription && (
                    <p className="text-sm text-body-color dark:text-dark-6 mb-3 line-clamp-2">
                      {page.metaDescription}
                    </p>
                  )}

                  <div className="flex items-center gap-4 text-xs text-body-color dark:text-dark-6">
                    <span>Тип: {page.pageType}</span>
                    <span>Обновлена: {new Date(page.updatedAt).toLocaleDateString('ru-RU')}</span>
                    {page.content?.blocks && (
                      <span>Блоков: {page.content.blocks.length}</span>
                    )}
                  </div>
                </div>

                <div className="flex gap-2 ml-4">
                  <Link
                    to={`/redaktus?projectId=${project.id}&pageId=${page.id}`}
                    className="inline-flex items-center gap-1 rounded-lg bg-primary px-3 py-2 text-xs font-medium text-white hover:bg-primary/90 transition-colors"
                  >
                    ✏️ Редактировать
                  </Link>
                  <button className="inline-flex items-center gap-1 rounded-lg bg-gray-100 dark:bg-dark-4 px-3 py-2 text-xs font-medium text-dark dark:text-white hover:bg-gray-200 dark:hover:bg-dark-5 transition-colors">
                    👁️ Просмотр
                  </button>
                  <button className="inline-flex items-center gap-1 rounded-lg bg-gray-100 dark:bg-dark-4 px-3 py-2 text-xs font-medium text-dark dark:text-white hover:bg-gray-200 dark:hover:bg-dark-5 transition-colors">
                    ⚙️
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Модальное окно создания страницы */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-dark-2 rounded-lg w-full max-w-md">
            <div className="flex items-center justify-between p-6 border-b border-stroke dark:border-dark-3">
              <h2 className="text-xl font-semibold text-dark dark:text-white">
                Создать страницу
              </h2>
              <button
                onClick={() => setShowCreateModal(false)}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
              >
                <svg width="24" height="24" viewBox="0 0 24 24" className="fill-current">
                  <path d="M19 6.41L17.59 5L12 10.59L6.41 5L5 6.41L10.59 12L5 17.59L6.41 19L12 13.41L17.59 19L19 17.59L13.41 12L19 6.41Z"/>
                </svg>
              </button>
            </div>

            <div className="p-6">
              <p className="text-body-color dark:text-dark-6 mb-4">
                Для создания новых страниц используйте редактор Redaktus
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowCreateModal(false)}
                  className="flex-1 px-4 py-2 text-sm font-medium text-body-color dark:text-dark-6 bg-gray-100 dark:bg-dark-3 rounded-lg hover:bg-gray-200 dark:hover:bg-dark-4 transition-colors"
                >
                  Отмена
                </button>
                <Link
                  to={`/redaktus?projectId=${project.id}`}
                  onClick={() => setShowCreateModal(false)}
                  className="flex-1 px-4 py-2 text-sm font-medium text-white bg-primary rounded-lg hover:bg-primary/90 transition-colors text-center"
                >
                  Открыть редактор
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProjectPages;
