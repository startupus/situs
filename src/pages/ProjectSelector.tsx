import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiPlus, FiGrid, FiBarChart, FiUsers, FiGlobe, FiSettings, FiEye, FiEdit, FiTrash2, FiExternalLink, FiShoppingBag, FiBell } from 'react-icons/fi';
import { useSite } from '../contexts/SiteContext';
import { useUser } from '../contexts/UserContext';
import Header from '../components/Header';
import SidebarControls from '../components/SidebarControls';

const ProjectSelector: React.FC = () => {
  const { state, actions } = useSite();
  const { user } = useUser();
  const navigate = useNavigate();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedProjectType, setSelectedProjectType] = useState<'website' | 'ecommerce' | 'landing' | 'blog'>('website');

  // Статистика проектов
  const projectStats = {
    total: state.sites.length,
    published: state.sites.filter(site => site.status === 'published').length,
    draft: state.sites.filter(site => site.status === 'draft').length,
    archived: state.sites.filter(site => site.status === 'archived').length,
    totalPages: state.sites.reduce((acc, site) => acc + site.pages.length, 0),
    totalVisitors: state.sites.reduce((acc, site) => acc + (site.pages.length * 150), 0), // Моковые данные
    // Моковые данные о заказах для демонстрации
    newOrders: 3,
    totalOrders: 12,
    ordersRevenue: 28500
  };

  const handleCreateProject = async () => {
    const projectName = `Новый ${selectedProjectType === 'website' ? 'сайт' : 
      selectedProjectType === 'ecommerce' ? 'магазин' : 
      selectedProjectType === 'landing' ? 'лендинг' : 'блог'}`;
    
    await actions.createSite({
      name: projectName,
      description: `Описание для ${projectName}`,
      status: 'draft'
    });
    setShowCreateModal(false);
  };

  const getProjectTypeIcon = (type: string) => {
    switch (type) {
      case 'website': return '🌐';
      case 'ecommerce': return '🛒';
      case 'landing': return '📄';
      case 'blog': return '📝';
      default: return '📁';
    }
  };

  const getProjectTypeName = (type: string) => {
    switch (type) {
      case 'website': return 'Сайт';
      case 'ecommerce': return 'Магазин';
      case 'landing': return 'Лендинг';
      case 'blog': return 'Блог';
      default: return 'Проект';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header 
        title="Мои проекты" 
        onNewProject={() => setShowCreateModal(true)}
      />

      <div className="max-w-7xl mx-auto px-6 py-8">
              {/* Статистика */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
        {/* Новые заказы - самая важная метрика */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 border-l-4 border-red-500">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="p-2 bg-red-100 dark:bg-red-900 rounded-lg">
                <FiBell className="w-6 h-6 text-red-600 dark:text-red-400" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Новые заказы</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{projectStats.newOrders}</p>
              </div>
            </div>
            <button
              onClick={() => {
                // Переходим к первому проекту в раздел заказов
                const firstProject = state.sites[0];
                if (firstProject) {
                  navigate(`/situs/project/${firstProject.id}?section=orders`);
                }
              }}
              className="text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 text-sm font-medium"
            >
              Перейти →
            </button>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
              <FiGrid className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Всего проектов</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{projectStats.total}</p>
            </div>
          </div>
        </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 dark:bg-green-900 rounded-lg">
                <FiEye className="w-6 h-6 text-green-600 dark:text-green-400" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Опубликовано</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{projectStats.published}</p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 dark:bg-purple-900 rounded-lg">
                <FiBarChart className="w-6 h-6 text-purple-600 dark:text-purple-400" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Всего страниц</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{projectStats.totalPages}</p>
              </div>
            </div>
          </div>

                  <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 dark:bg-green-900 rounded-lg">
              <FiShoppingBag className="w-6 h-6 text-green-600 dark:text-green-400" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Выручка</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">₽{projectStats.ordersRevenue.toLocaleString()}</p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-2 bg-yellow-100 dark:bg-yellow-900 rounded-lg">
              <FiUsers className="w-6 h-6 text-yellow-600 dark:text-yellow-400" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Посетители</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{projectStats.totalVisitors.toLocaleString()}</p>
            </div>
          </div>
        </div>
        </div>

        {/* Заголовок и фильтры */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Мои проекты</h2>
            <p className="text-gray-600 dark:text-gray-400">Управляйте своими сайтами и приложениями</p>
          </div>
          
          <div className="flex items-center space-x-4">
            <select className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white">
              <option value="all">Все проекты</option>
              <option value="published">Опубликованные</option>
              <option value="draft">Черновики</option>
              <option value="archived">Архив</option>
            </select>
          </div>
        </div>

        {/* Список проектов */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {state.sites.map((site) => (
            <div key={site.id} className="bg-white dark:bg-gray-800 rounded-lg shadow hover:shadow-lg transition-shadow">
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="text-2xl">{getProjectTypeIcon('website')}</div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{site.name}</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">{site.description}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                      site.status === 'published' 
                        ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                        : site.status === 'draft'
                        ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                        : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200'
                    }`}>
                      {site.status === 'published' ? 'Опубликован' : 
                       site.status === 'draft' ? 'Черновик' : 'Архив'}
                    </span>
                  </div>
                </div>

                <div className="space-y-3 mb-4">
                  <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                    <FiGlobe className="w-4 h-4 mr-2" />
                    <span>{site.domain || 'Домен не настроен'}</span>
                  </div>
                                     <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                     <FiBarChart className="w-4 h-4 mr-2" />
                     <span>{site.pages.length} страниц</span>
                   </div>
                  <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                    <FiUsers className="w-4 h-4 mr-2" />
                    <span>~{site.pages.length * 150} посетителей</span>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
                  <div className="flex items-center space-x-2">
                    <button className="p-2 text-gray-500 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700">
                      <FiEye className="w-4 h-4" />
                    </button>
                    <button className="p-2 text-gray-500 hover:text-green-600 dark:text-gray-400 dark:hover:text-green-400 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700">
                      <FiEdit className="w-4 h-4" />
                    </button>
                    <button className="p-2 text-gray-500 hover:text-red-600 dark:text-gray-400 dark:hover:text-red-400 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700">
                      <FiTrash2 className="w-4 h-4" />
                    </button>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    {site.status === 'published' && (
                      <a
                        href={`https://${site.domain}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center space-x-1 text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300"
                      >
                        <FiExternalLink className="w-4 h-4" />
                        <span>Открыть</span>
                      </a>
                    )}
                    <button 
                      onClick={() => navigate(`/situs/project/${site.id}`)}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
                    >
                      Редактировать
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Модальное окно создания проекта */}
        {showCreateModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full mx-4">
              <div className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Создать новый проект
                </h3>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Тип проекта
                    </label>
                    <div className="grid grid-cols-2 gap-3">
                      {[
                        { id: 'website', name: 'Сайт', icon: '🌐' },
                        { id: 'ecommerce', name: 'Магазин', icon: '🛒' },
                        { id: 'landing', name: 'Лендинг', icon: '📄' },
                        { id: 'blog', name: 'Блог', icon: '📝' }
                      ].map((type) => (
                        <button
                          key={type.id}
                          onClick={() => setSelectedProjectType(type.id as any)}
                          className={`p-4 border rounded-lg text-center transition-colors ${
                            selectedProjectType === type.id
                              ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                              : 'border-gray-300 dark:border-gray-600 hover:border-gray-400'
                          }`}
                        >
                          <div className="text-2xl mb-2">{type.icon}</div>
                          <div className="text-sm font-medium text-gray-900 dark:text-white">
                            {type.name}
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-end space-x-3 mt-6">
                  <button
                    onClick={() => setShowCreateModal(false)}
                    className="px-4 py-2 text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
                  >
                    Отмена
                  </button>
                  <button
                    onClick={handleCreateProject}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Создать проект
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Управление интерфейсом */}
      <SidebarControls />
    </div>
  );
};

export default ProjectSelector; 