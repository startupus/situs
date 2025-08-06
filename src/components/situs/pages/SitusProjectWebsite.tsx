import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getProject, ProjectData } from '../../../services/projectApi';
import SiteMenuSettings from '../projects/SiteMenuSettings';

const SitusProjectWebsite: React.FC = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const [project, setProject] = useState<ProjectData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'pages' | 'menu' | 'design' | 'seo'>('pages');

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
            to={`/projects/${projectId}`}
            className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary/90 transition-colors"
          >
            ← Вернуться к проекту
          </Link>
        </div>
      </div>
    );
  }

  const tabs = [
    { id: 'pages', name: 'Страницы', icon: '📄' },
    { id: 'menu', name: 'Меню', icon: '🧭' },
    { id: 'design', name: 'Дизайн', icon: '🎨' },
    { id: 'seo', name: 'SEO', icon: '🔍' }
  ];

  return (
    <div className="p-6">
      {/* Хлебные крошки */}
      <nav className="flex items-center space-x-2 text-sm text-body-color dark:text-dark-6 mb-4">
        <Link to="/projects" className="hover:text-primary transition-colors">
          Проекты
        </Link>
        <span>/</span>
        <Link to={`/projects/${projectId}`} className="hover:text-primary transition-colors">
          {project.name}
        </Link>
        <span>/</span>
        <span className="text-dark dark:text-white">Продукт: Сайт</span>
      </nav>

      {/* Заголовок */}
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-2">
          <span className="text-2xl">🌐</span>
          <h1 className="text-2xl font-bold text-dark dark:text-white">
            Управление сайтом
          </h1>
        </div>
        <p className="text-body-color dark:text-dark-6">
          Настройки и управление основным сайтом проекта {project.name}
        </p>
        
        <div className="flex items-center gap-4 mt-3 text-sm text-body-color dark:text-dark-6">
          <span>📄 Страниц: {project.pages?.length || 0}</span>
          <span>🏠 Главная: {project.pages?.find(p => p.isHomePage)?.title || 'Не настроена'}</span>
          {project.domain && (
            <a
              href={`https://${project.domain}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:text-primary/80 transition-colors"
            >
              🌐 {project.domain} ↗
            </a>
          )}
        </div>
      </div>

      {/* Быстрые действия */}
      <div className="flex gap-2 mb-6">
        <Link
          to={`/redaktus?projectId=${project.id}`}
          className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary/90 transition-colors"
        >
          ✏️ Открыть редактор
        </Link>
        <button className="inline-flex items-center gap-2 rounded-lg bg-gray-100 dark:bg-dark-3 px-4 py-2 text-sm font-medium text-dark dark:text-white hover:bg-gray-200 dark:hover:bg-dark-4 transition-colors">
          👁️ Предпросмотр
        </button>
        <button className="inline-flex items-center gap-2 rounded-lg bg-gray-100 dark:bg-dark-3 px-4 py-2 text-sm font-medium text-dark dark:text-white hover:bg-gray-200 dark:hover:bg-dark-4 transition-colors">
          📊 Аналитика
        </button>
      </div>

      {/* Вкладки */}
      <div className="border-b border-stroke dark:border-dark-3 mb-6">
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

      {/* Содержимое вкладок */}
      <div className="bg-white dark:bg-dark-2 rounded-lg border border-stroke dark:border-dark-3">
        {activeTab === 'pages' && (
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-dark dark:text-white">
                Страницы сайта
              </h3>
              <Link
                to={`/redaktus?projectId=${project.id}`}
                className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary/90 transition-colors"
              >
                ✏️ Редактировать страницы
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {project.pages.map((page) => (
                <div
                  key={page.id}
                  className="border border-stroke dark:border-dark-3 rounded-lg p-4 hover:border-primary transition-colors"
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="text-lg">
                        {page.isHomePage ? '🏠' : '📄'}
                      </span>
                      <h4 className="font-medium text-dark dark:text-white">
                        {page.title}
                      </h4>
                    </div>
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      page.status === 'PUBLISHED'
                        ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                        : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                    }`}>
                      {page.status === 'PUBLISHED' ? 'Опубликована' : 'Черновик'}
                    </span>
                  </div>
                  <p className="text-sm text-body-color dark:text-dark-6 mb-3">
                    /{page.slug}
                  </p>
                  <Link
                    to={`/redaktus?projectId=${project.id}&pageId=${page.id}`}
                    className="text-xs text-primary hover:text-primary/80 transition-colors"
                  >
                    Редактировать →
                  </Link>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'menu' && (
          <SiteMenuSettings project={project} />
        )}

        {activeTab === 'design' && (
          <div className="p-6">
            <div className="text-center py-12">
              <div className="text-4xl mb-4">🎨</div>
              <h3 className="text-lg font-semibold text-dark dark:text-white mb-2">
                Настройки дизайна
              </h3>
              <p className="text-body-color dark:text-dark-6 mb-4">
                Управление цветами, шрифтами и стилями сайта
              </p>
              <div className="text-sm text-body-color dark:text-dark-6">
                🚧 В разработке
              </div>
            </div>
          </div>
        )}

        {activeTab === 'seo' && (
          <div className="p-6">
            <div className="text-center py-12">
              <div className="text-4xl mb-4">🔍</div>
              <h3 className="text-lg font-semibold text-dark dark:text-white mb-2">
                SEO настройки
              </h3>
              <p className="text-body-color dark:text-dark-6 mb-4">
                Оптимизация сайта для поисковых систем
              </p>
              <div className="text-sm text-body-color dark:text-dark-6">
                🚧 В разработке
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SitusProjectWebsite;
