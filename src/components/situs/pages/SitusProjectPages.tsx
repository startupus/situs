import React, { useState, useEffect } from 'react';
import { FiAlertTriangle, FiFileText, FiCompass, FiPenTool, FiSearch, FiHome } from 'react-icons/fi';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { getProject, ProjectData, getProjectPages, PageData } from '../../../services/projectApi';
import SiteMenuSettings from '../projects/SiteMenuSettings';
import ProjectTrafficChart from './ProjectTrafficChart';
import ProjectConversionWidget from './ProjectConversionWidget';
import { apiClient } from '../../../api/client';
import { PagesCategoriesManager } from '../../admin/pages/PagesCategoriesManager';
import { PageCategorySelector } from '../../admin/pages/PageCategorySelector';

const SitusProjectPages: React.FC = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const [project, setProject] = useState<ProjectData | null>(null);
  const [pages, setPages] = useState<PageData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'pages' | 'categories' | 'menu' | 'design' | 'seo'>('pages');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [creating, setCreating] = useState(false);
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
    window.addEventListener('situs:open-pages-settings', handler);
    return () => window.removeEventListener('situs:open-pages-settings', handler);
  }, []);

  // Функция создания страницы
  const handleCreatePage = async (pageData: { title: string; slug: string }) => {
    if (!project) return;
    
    try {
      setCreating(true);
      
      // Найдем Pages продукт
      const pagesProduct = (project as any).products?.find((p: any) => p.type === 'WEBSITE');
      if (!pagesProduct) {
        throw new Error('Pages продукт не найден');
      }

      const response = await apiClient.createPage({
        title: pageData.title,
        slug: pageData.slug,
        content: JSON.stringify([]), // Пустой контент
        productId: pagesProduct.id,
        status: 'DRAFT',
        pageType: 'PAGE'
      });

      if (response.success && response.data) {
        setPages(prev => [...prev, response.data]);
        setShowCreateModal(false);
      }
    } catch (err) {
      console.error('Ошибка создания страницы:', err);
      alert('Ошибка создания страницы: ' + (err instanceof Error ? err.message : 'Неизвестная ошибка'));
    } finally {
      setCreating(false);
    }
  };

  // Функция удаления страницы
  const handleDeletePage = async (pageId: string, isHomePage: boolean) => {
    if (isHomePage) {
      alert('Нельзя удалить главную страницу');
      return;
    }

    if (!confirm('Вы уверены, что хотите удалить эту страницу?')) {
      return;
    }

    try {
      const response = await apiClient.deletePage(pageId);
      if (response.success) {
        setPages(prev => prev.filter(p => p.id !== pageId));
      } else {
        alert(response.error || 'Ошибка удаления страницы');
      }
    } catch (err) {
      console.error('Ошибка удаления страницы:', err);
      alert('Ошибка удаления страницы');
    }
  };

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
          <div className="text-red-500 mb-4 text-4xl flex justify-center"><FiAlertTriangle aria-hidden /></div>
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
    { id: 'pages', name: 'Страницы', icon: <FiFileText aria-hidden /> },
    { id: 'categories', name: 'Категории', icon: <FiCompass aria-hidden /> },
    { id: 'menu', name: 'Меню', icon: <FiCompass aria-hidden /> },
    { id: 'design', name: 'Дизайн', icon: <FiPenTool aria-hidden /> },
    { id: 'seo', name: 'SEO', icon: <FiSearch aria-hidden /> },
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

      {/* Вкладки настроек сайта */}
      <div className="border-b border-stroke dark:border-dark-3 mb-6">
        <nav className="flex space-x-8">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors flex items-center gap-2 ${
                activeTab === tab.id
                  ? 'border-primary text-primary'
                  : 'border-transparent text-body-color dark:text-dark-6 hover:text-dark dark:hover:text-white'
              }`}
            >
              <span>{tab.icon}</span>
              {tab.name}
            </button>
          ))}
        </nav>
      </div>

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

            {/* Заголовок и кнопка создания */}
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium text-dark dark:text-white">Страницы сайта</h3>
              <button
                onClick={() => setShowCreateModal(true)}
                className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary/90 transition-colors"
              >
                <svg width="16" height="16" viewBox="0 0 16 16" className="fill-current">
                  <path d="M8 1C8.55228 1 9 1.44772 9 2V7H14C14.5523 7 15 7.44772 15 8C15 8.55228 14.5523 9 14 9H9V14C9 14.5523 8.55228 15 8 15C7.44772 15 7 14.5523 7 14V9H2C1.44772 9 1 8.55228 1 8C1 7.44772 1.44772 7 2 7H7V2C7 1.44772 7.44772 1 8 1Z"/>
                </svg>
                Создать страницу
              </button>
            </div>

            {/* Список страниц (плотный список) */}
            <div className="rounded-lg border border-stroke dark:border-dark-3 overflow-hidden">
              <div className="bg-gray-50 dark:bg-dark-3 px-4 py-2 text-xs font-medium text-body-color dark:text-dark-6 grid grid-cols-12 gap-2">
                <div className="col-span-4">Страница</div>
                <div className="col-span-2">Категории</div>
                <div className="col-span-2">Статус</div>
                <div className="col-span-1">Путь</div>
                <div className="col-span-3 text-right">Действия</div>
              </div>
              <ul className="divide-y divide-stroke dark:divide-dark-3">
                {pages.map((page) => (
                  <li key={page.id} className="px-4 py-3 grid grid-cols-12 gap-2 items-center hover:bg-gray-50 dark:hover:bg-dark-3">
                    <div className="col-span-4 flex items-center gap-2">
                      <span className="text-lg">{page.isHomePage ? <FiHome aria-hidden /> : <FiFileText aria-hidden />}</span>
                      <button
                        onClick={() => navigate(`/redaktus?projectId=${project.id}&pageId=${page.id}`)}
                        className="text-left font-medium text-dark dark:text-white hover:text-primary truncate"
                      >
                        {page.title}
                      </button>
                    </div>
                    <div className="col-span-2">
                      {page.webCategories && page.webCategories.length > 0 ? (
                        <div className="flex flex-wrap gap-1">
                          {page.webCategories.slice(0, 2).map(({ category }) => (
                            <span
                              key={category.id}
                              className={`text-xs px-2 py-1 rounded-full ${
                                category.id === page.primaryCategoryId
                                  ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
                                  : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200'
                              }`}
                            >
                              {category.name}
                            </span>
                          ))}
                          {page.webCategories.length > 2 && (
                            <span className="text-xs text-gray-500 dark:text-gray-400">
                              +{page.webCategories.length - 2}
                            </span>
                          )}
                        </div>
                      ) : (
                        <span className="text-xs text-gray-400 dark:text-gray-500">Без категорий</span>
                      )}
                    </div>
                    <div className="col-span-2">
                      <span className={`text-xs px-2 py-1 rounded-full ${page.status === 'PUBLISHED' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'}`}>
                        {page.status === 'PUBLISHED' ? 'Опубликована' : 'Черновик'}
                      </span>
                    </div>
                    <div className="col-span-1 text-sm text-body-color dark:text-dark-6 truncate">/{page.slug}</div>
                    <div className="col-span-3 text-right flex gap-2 justify-end">
                      <button
                        onClick={() => navigate(`/redaktus?projectId=${project.id}&pageId=${page.id}`)}
                        className="text-xs text-primary hover:text-primary/80 px-2 py-1 rounded"
                      >
                        Редактировать
                      </button>
                      {!page.isHomePage && (
                        <button
                          onClick={() => handleDeletePage(page.id, !!page.isHomePage)}
                          className="text-xs text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 px-2 py-1 rounded"
                        >
                          Удалить
                        </button>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {activeTab === 'categories' && (
          <div className="p-6">
            <PagesCategoriesManager projectId={projectId!} />
          </div>
        )}

        {activeTab === 'menu' && (
          <div className="p-6">
            <h3 className="text-lg font-medium text-dark dark:text-white mb-4">Настройки меню</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-dark dark:text-white mb-2">
                  Тип меню
                </label>
                <select className="w-full px-3 py-2 border border-stroke dark:border-dark-3 rounded-lg bg-white dark:bg-dark-3 text-dark dark:text-white">
                  <option>Горизонтальное</option>
                  <option>Вертикальное</option>
                  <option>Мега-меню</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-dark dark:text-white mb-2">
                  Позиция
                </label>
                <select className="w-full px-3 py-2 border border-stroke dark:border-dark-3 rounded-lg bg-white dark:bg-dark-3 text-dark dark:text-white">
                  <option>Верх страницы</option>
                  <option>Боковая панель</option>
                  <option>Подвал</option>
                </select>
              </div>
              <div className="pt-4">
                <button className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors">
                  Сохранить настройки меню
                </button>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'design' && (
          <div className="p-6">
            <h3 className="text-lg font-medium text-dark dark:text-white mb-4">Настройки дизайна</h3>
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-dark dark:text-white mb-2">
                  Основной цвет
                </label>
                <input 
                  type="color" 
                  defaultValue="#3B82F6"
                  className="w-16 h-10 border border-stroke dark:border-dark-3 rounded-lg"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-dark dark:text-white mb-2">
                  Шрифт
                </label>
                <select className="w-full px-3 py-2 border border-stroke dark:border-dark-3 rounded-lg bg-white dark:bg-dark-3 text-dark dark:text-white">
                  <option>Inter</option>
                  <option>Roboto</option>
                  <option>Open Sans</option>
                  <option>Lato</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-dark dark:text-white mb-2">
                  Шаблон
                </label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {['Минимализм', 'Корпоративный', 'Креативный'].map((template) => (
                    <div key={template} className="border border-stroke dark:border-dark-3 rounded-lg p-3 cursor-pointer hover:border-primary transition-colors">
                      <div className="aspect-video bg-gray-100 dark:bg-gray-600 rounded mb-2"></div>
                      <p className="text-sm text-center text-dark dark:text-white">{template}</p>
                    </div>
                  ))}
                </div>
              </div>
              <div className="pt-4">
                <button className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors">
                  Применить дизайн
                </button>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'seo' && (
          <div className="p-6">
            <h3 className="text-lg font-medium text-dark dark:text-white mb-4">SEO настройки</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-dark dark:text-white mb-2">
                  Заголовок сайта (Title)
                </label>
                <input 
                  type="text" 
                  placeholder="Название вашего сайта"
                  className="w-full px-3 py-2 border border-stroke dark:border-dark-3 rounded-lg bg-white dark:bg-dark-3 text-dark dark:text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-dark dark:text-white mb-2">
                  Описание сайта (Meta Description)
                </label>
                <textarea 
                  rows={3}
                  placeholder="Краткое описание вашего сайта"
                  className="w-full px-3 py-2 border border-stroke dark:border-dark-3 rounded-lg bg-white dark:bg-dark-3 text-dark dark:text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-dark dark:text-white mb-2">
                  Ключевые слова
                </label>
                <input 
                  type="text" 
                  placeholder="ключевые, слова, через, запятую"
                  className="w-full px-3 py-2 border border-stroke dark:border-dark-3 rounded-lg bg-white dark:bg-dark-3 text-dark dark:text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-dark dark:text-white mb-2">
                  Домен
                </label>
                <div className="flex gap-2">
                  <input 
                    type="text" 
                    placeholder="example.com"
                    className="flex-1 px-3 py-2 border border-stroke dark:border-dark-3 rounded-lg bg-white dark:bg-dark-3 text-dark dark:text-white"
                  />
                  <button className="px-4 py-2 border border-stroke dark:border-dark-3 rounded-lg text-body-color dark:text-dark-6 hover:text-dark dark:hover:text-white transition-colors">
                    Проверить
                  </button>
                </div>
              </div>
              <div className="pt-4">
                <button className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors">
                  Сохранить SEO настройки
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Модальное окно создания страницы */}
      {showCreateModal && (
        <CreatePageModal
          onClose={() => setShowCreateModal(false)}
          onCreate={handleCreatePage}
          isCreating={creating}
        />
      )}
    </div>
  );
};

// Компонент модального окна создания страницы
interface CreatePageModalProps {
  onClose: () => void;
  onCreate: (data: { title: string; slug: string; categories?: string[]; primaryCategoryId?: string }) => void;
  isCreating: boolean;
}

const CreatePageModal: React.FC<CreatePageModalProps> = ({ onClose, onCreate, isCreating }) => {
  const { projectId } = useParams<{ projectId: string }>();
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [primaryCategoryId, setPrimaryCategoryId] = useState<string>();

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9а-я\s-]/gi, '')
      .replace(/[\s-]+/g, '-')
      .replace(/^-|-$/g, '');
  };

  const handleTitleChange = (value: string) => {
    setTitle(value);
    if (!slug || slug === generateSlug(title)) {
      setSlug(generateSlug(value));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !slug.trim()) return;
    onCreate({ 
      title: title.trim(), 
      slug: slug.trim(),
      categories: selectedCategories,
      primaryCategoryId 
    });
  };

  const handleCategoriesChange = (categories: string[], primaryId?: string) => {
    setSelectedCategories(categories);
    setPrimaryCategoryId(primaryId);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-dark-2 rounded-lg p-6 w-full max-w-lg mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium text-dark dark:text-white">Создать страницу</h3>
          <button
            onClick={onClose}
            className="text-body-color dark:text-dark-6 hover:text-dark dark:hover:text-white"
          >
            <svg width="20" height="20" viewBox="0 0 20 20" className="fill-current">
              <path d="M15 5L5 15M5 5L15 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-dark dark:text-white mb-2">
              Название страницы
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => handleTitleChange(e.target.value)}
              className="w-full px-3 py-2 border border-stroke dark:border-dark-3 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent bg-white dark:bg-dark-3 text-dark dark:text-white"
              placeholder="Введите название страницы"
              disabled={isCreating}
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-dark dark:text-white mb-2">
              URL (slug)
            </label>
            <input
              type="text"
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              className="w-full px-3 py-2 border border-stroke dark:border-dark-3 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent bg-white dark:bg-dark-3 text-dark dark:text-white"
              placeholder="url-stranitsy"
              disabled={isCreating}
              required
            />
            <p className="text-xs text-body-color dark:text-dark-6 mt-1">
              Используется в адресе страницы: /url-stranitsy
            </p>
          </div>

          <div className="mb-6">
            <PageCategorySelector
              projectId={projectId!}
              selectedCategories={selectedCategories}
              primaryCategoryId={primaryCategoryId}
              onChange={handleCategoriesChange}
              disabled={isCreating}
            />
          </div>

          <div className="flex gap-3 justify-end">
            <button
              type="button"
              onClick={onClose}
              disabled={isCreating}
              className="px-4 py-2 text-sm font-medium text-body-color dark:text-dark-6 hover:text-dark dark:hover:text-white border border-stroke dark:border-dark-3 rounded-lg hover:bg-gray-50 dark:hover:bg-dark-3 transition-colors"
            >
              Отмена
            </button>
            <button
              type="submit"
              disabled={isCreating || !title.trim() || !slug.trim()}
              className="px-4 py-2 text-sm font-medium text-white bg-primary hover:bg-primary/90 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isCreating ? 'Создание...' : 'Создать страницу'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SitusProjectPages;
