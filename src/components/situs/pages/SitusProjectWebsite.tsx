import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { getProject, ProjectData, getProjectPages, PageData } from '../../../services/projectApi';
import SiteMenuSettings from '../projects/SiteMenuSettings';
import ProjectTrafficChart from './ProjectTrafficChart';
import ProjectConversionWidget from './ProjectConversionWidget';

const SitusProjectWebsite: React.FC = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const [project, setProject] = useState<ProjectData | null>(null);
  const [pages, setPages] = useState<PageData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'pages' | 'menu' | 'design' | 'seo'>('pages');
  const navigate = useNavigate();

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
        const pagesData = await getProjectPages(projectId);
        setPages(pagesData);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Ошибка загрузки проекта');
        console.error('Ошибка загрузки проекта:', err);
      } finally {
        setLoading(false);
      }
    };

    loadProject();
  }, [projectId]);

  // Слушатель на иконку настроек сайта из верхней панели — хук должен быть до любых ранних return
  useEffect(() => {
    const handler = (e: any) => {
      const tab = e?.detail?.tab as 'menu' | 'design' | 'seo' | undefined;
      setActiveTab(tab || 'menu');
    };
    window.addEventListener('situs:open-website-settings', handler);
    return () => window.removeEventListener('situs:open-website-settings', handler);
  }, []);

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

      {/* Перенос заголовка в верхнюю панель — локальный заголовок убран */}

      {/* Быстрые действия убраны: аналитика будет встроенными виджетами, редактор открывается при выборе страницы */}

      {/* Убираем локальные вкладки: настройки доступны через иконку в верхней панели */}

      {/* Содержимое вкладок */}
      <div className="bg-white dark:bg-dark-2 rounded-lg border border-stroke dark:border-dark-3">
        {activeTab === 'pages' && (
          <div className="p-6">
            {/* Виджеты аналитики сверху */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
              <ProjectTrafficChart
                data={[{ projectName: project.name, traffic: pages.map((_, i) => 50 + i * 5) }]}
                timeLabels={pages.map((_, i) => `День ${i + 1}`)}
              />
              <ProjectConversionWidget
                projects={[{ id: 1, name: project.name, conversionRate: 2.5, visitors: 1240, orders: 36, revenue: 122000, trend: 'up', trendValue: 3.2 }]}
              />
            </div>

            {/* Список страниц (плотный список) */}
            <div className="rounded-lg border border-stroke dark:border-dark-3 overflow-hidden">
              <div className="bg-gray-50 dark:bg-dark-3 px-4 py-2 text-xs font-medium text-body-color dark:text-dark-6 grid grid-cols-12 gap-2">
                <div className="col-span-6">Страница</div>
                <div className="col-span-2">Статус</div>
                <div className="col-span-2">Путь</div>
                <div className="col-span-2 text-right">Действия</div>
              </div>
              <ul className="divide-y divide-stroke dark:divide-dark-3">
                {pages.map((page) => (
                  <li key={page.id} className="px-4 py-3 grid grid-cols-12 gap-2 items-center hover:bg-gray-50 dark:hover:bg-dark-3">
                    <div className="col-span-6 flex items-center gap-2">
                      <span className="text-lg">{page.isHomePage ? '🏠' : '📄'}</span>
                      <button
                        onClick={() => navigate(`/redaktus?projectId=${project.id}&pageId=${page.id}`)}
                        className="text-left font-medium text-dark dark:text-white hover:text-primary truncate"
                      >
                        {page.title}
                      </button>
                    </div>
                    <div className="col-span-2">
                      <span className={`text-xs px-2 py-1 rounded-full ${page.status === 'PUBLISHED' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'}`}>
                        {page.status === 'PUBLISHED' ? 'Опубликована' : 'Черновик'}
                      </span>
                    </div>
                    <div className="col-span-2 text-sm text-body-color dark:text-dark-6 truncate">/{page.slug}</div>
                    <div className="col-span-2 text-right">
                      <button
                        onClick={() => navigate(`/redaktus?projectId=${project.id}&pageId=${page.id}`)}
                        className="text-xs text-primary hover:text-primary/80"
                      >
                        Открыть редактор
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}
        {/* Настройки сайта открываются отдельной страницей/модалкой (иконка в верхней панели), локальные вкладки скрыты */}
      </div>
    </div>
  );
};

export default SitusProjectWebsite;
