import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getProject, ProjectData } from '../../../services/projectApi';
import ProjectProducts from '../projects/ProjectProducts';
import ProjectSettings from '../projects/ProjectSettings';
import ProjectPages from '../projects/ProjectPages';

const SitusProjectDetail: React.FC = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const [project, setProject] = useState<ProjectData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'products' | 'pages' | 'settings'>('overview');

  useEffect(() => {
    const loadProject = async () => {
      if (!projectId) {
        setError('ID проекта не указан');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        const data = await getProject(projectId);
        setProject(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Ошибка загрузки проекта');
        console.error('Ошибка загрузки проекта:', err);
      } finally {
        setLoading(false);
      }
    };

    loadProject();
  }, [projectId]);

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 dark:bg-dark-3 rounded mb-4 w-1/3"></div>
          <div className="h-4 bg-gray-200 dark:bg-dark-3 rounded mb-6 w-2/3"></div>
          <div className="flex space-x-4 mb-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-10 bg-gray-200 dark:bg-dark-3 rounded w-24"></div>
            ))}
          </div>
          <div className="h-96 bg-gray-200 dark:bg-dark-3 rounded"></div>
        </div>
      </div>
    );
  }

  if (error || !project) {
    return (
      <div className="p-6">
        <div className="text-center py-12">
          <div className="text-red-500 mb-4 text-4xl">⚠️</div>
          <h3 className="text-lg font-semibold text-dark dark:text-white mb-2">
            Ошибка загрузки проекта
          </h3>
          <p className="text-body-color dark:text-dark-6 mb-4">{error}</p>
          <Link
            to="/projects"
            className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary/90 transition-colors"
          >
            ← Вернуться к проектам
          </Link>
        </div>
      </div>
    );
  }

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
        return 'Опубликован';
      case 'draft':
        return 'Черновик';
      case 'archived':
        return 'Архив';
      default:
        return status;
    }
  };

  const tabs = [
    { id: 'overview', name: 'Обзор', icon: '📊' },
    { id: 'products', name: 'Продукты', icon: '🛠️' },
    { id: 'pages', name: 'Страницы', icon: '📄' },
    { id: 'settings', name: 'Настройки', icon: '⚙️' }
  ];

  return (
    <div className="p-6">
      {/* Хлебные крошки */}
      <nav className="flex items-center space-x-2 text-sm text-body-color dark:text-dark-6 mb-4">
        <Link to="/projects" className="hover:text-primary transition-colors">
          Проекты
        </Link>
        <span>/</span>
        <span className="text-dark dark:text-white">{project.name}</span>
      </nav>

      {/* Заголовок проекта */}
      <div className="mb-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-2xl font-bold text-dark dark:text-white">
                {project.name}
              </h1>
              <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(project.status)}`}>
                {getStatusText(project.status)}
              </span>
            </div>
            {project.description && (
              <p className="text-body-color dark:text-dark-6 mb-3">
                {project.description}
              </p>
            )}
            <div className="flex items-center gap-4 text-sm text-body-color dark:text-dark-6">
              <span>Тип: {project.type}</span>
              <span>Страниц: {project.pages?.length || 0}</span>
              <span>Создан: {new Date(project.createdAt).toLocaleDateString('ru-RU')}</span>
              {project.domain && (
                <a
                  href={`https://${project.domain}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:text-primary/80 transition-colors"
                >
                  {project.domain} ↗
                </a>
              )}
            </div>
          </div>
          <div className="flex gap-2">
            <Link
              to={`/redaktus?projectId=${project.id}`}
              className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary/90 transition-colors"
            >
              ✏️ Редактировать
            </Link>
            <button className="inline-flex items-center gap-2 rounded-lg bg-gray-100 dark:bg-dark-3 px-4 py-2 text-sm font-medium text-dark dark:text-white hover:bg-gray-200 dark:hover:bg-dark-4 transition-colors">
              👁️ Предпросмотр
            </button>
          </div>
        </div>

        {/* Вкладки */}
        <div className="border-b border-stroke dark:border-dark-3">
          <nav className="flex space-x-8">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 py-3 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === tab.id
                    ? 'border-primary text-primary'
                    : 'border-transparent text-body-color dark:text-dark-6 hover:text-dark dark:hover:text-white hover:border-gray-300'
                }`}
              >
                <span>{tab.icon}</span>
                <span>{tab.name}</span>
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Содержимое вкладок */}
      <div className="bg-white dark:bg-dark-2 rounded-lg border border-stroke dark:border-dark-3">
        {activeTab === 'overview' && (
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Статистика */}
              <div className="bg-gray-50 dark:bg-dark-3 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-dark dark:text-white mb-3">
                  Статистика
                </h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-body-color dark:text-dark-6">Страниц:</span>
                    <span className="font-medium text-dark dark:text-white">{project.pages?.length || 0}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-body-color dark:text-dark-6">Тип:</span>
                    <span className="font-medium text-dark dark:text-white">{project.type}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-body-color dark:text-dark-6">Статус:</span>
                    <span className={`text-sm px-2 py-1 rounded ${getStatusColor(project.status)}`}>
                      {getStatusText(project.status)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Последняя активность */}
              <div className="bg-gray-50 dark:bg-dark-3 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-dark dark:text-white mb-3">
                  Последняя активность
                </h3>
                <div className="space-y-2 text-sm">
                  <div>
                    <span className="text-body-color dark:text-dark-6">Обновлен:</span>
                    <br />
                    <span className="font-medium text-dark dark:text-white">
                      {new Date(project.updatedAt).toLocaleString('ru-RU')}
                    </span>
                  </div>
                </div>
              </div>

              {/* Настройки домена */}
              <div className="bg-gray-50 dark:bg-dark-3 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-dark dark:text-white mb-3">
                  Домен
                </h3>
                <div className="space-y-2 text-sm">
                  {project.domain ? (
                    <div>
                      <span className="text-body-color dark:text-dark-6">Основной:</span>
                      <br />
                      <a
                        href={`https://${project.domain}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-medium text-primary hover:text-primary/80 transition-colors"
                      >
                        {project.domain} ↗
                      </a>
                    </div>
                  ) : (
                    <div>
                      <span className="text-body-color dark:text-dark-6">Домен не настроен</span>
                    </div>
                  )}
                  {project.customDomain && (
                    <div>
                      <span className="text-body-color dark:text-dark-6">Кастомный:</span>
                      <br />
                      <span className="font-medium text-dark dark:text-white">{project.customDomain}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'products' && (
          <ProjectProducts project={project} />
        )}

        {activeTab === 'pages' && (
          <ProjectPages project={project} />
        )}

        {activeTab === 'settings' && (
          <ProjectSettings project={project} onUpdate={setProject} />
        )}
      </div>
    </div>
  );
};

export default SitusProjectDetail;
