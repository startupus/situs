import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { 
  FiGrid, FiFileText, FiMenu, FiShoppingCart, FiPackage, 
  FiTrendingUp, FiZap, FiSettings, FiHome, FiUsers, FiGlobe,
  FiBarChart, FiEdit, FiPlus, FiTrash2, FiEye, FiDownload, FiArrowLeft
} from 'react-icons/fi';
import { useSite } from '../contexts/SiteContext';
import { useUser } from '../contexts/UserContext';
import { useProject } from '../contexts/ProjectContext';
import Header from './Header';
import EcommerceSection from './sections/EcommerceSection';
import OrdersSection from './sections/OrdersSection';
import PagesSection from './sections/PagesSection';
import InterfaceControls from './InterfaceControls';
import ProjectEditorView from './ProjectEditorView';

// Импортируем новые компоненты
import { DataStats, TableStack, VerticalNavbar, Button } from './index';

const ProjectWorkspace: React.FC = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const { state, actions } = useSite();
  const { user } = useUser();
  const { loadProject, currentProject, isLoading: projectLoading } = useProject();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [activeSection, setActiveSection] = useState<string>('orders');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [showCreatePageModal, setShowCreatePageModal] = useState(false);
  const [newPageTitle, setNewPageTitle] = useState('');
  const [isEditorMode, setIsEditorMode] = useState(false);

  // Обработка URL параметров для прямого перехода в раздел
  useEffect(() => {
    const section = searchParams.get('section');
    if (section) {
      setActiveSection(section);
    }
  }, [searchParams]);

  // Загружаем проект при монтировании
  useEffect(() => {
    if (projectId) {
      loadProject(projectId);
    }
  }, [projectId, loadProject]);

  // Режим редактора страницы
  if (isEditorMode) {
    return (
      <ProjectEditorView 
        onBack={() => setIsEditorMode(false)}
      />
    );
  }

  if (!projectId || !currentProject) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">😕</div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Проект не найден</h2>
          <p className="text-gray-600 dark:text-gray-400">Проект с ID {projectId} не существует</p>
        </div>
      </div>
    );
  }

  const navigationItems = [
    {
      id: 'orders',
      label: 'Заказы и заявки',
      icon: FiShoppingCart,
      description: 'Управление заказами и заявками'
    },
    {
      id: 'dashboard',
      label: 'Дашборд',
      icon: FiHome,
      description: 'Обзор проекта'
    },
    {
      id: 'pages',
      label: 'Страницы',
      icon: FiFileText,
      description: 'Управление страницами'
    },
    {
      id: 'menu',
      label: 'Меню',
      icon: FiMenu,
      description: 'Настройка навигации'
    },
    {
      id: 'ecommerce',
      label: 'E-commerce',
      icon: FiShoppingCart,
      description: 'Управление магазином'
    },
    {
      id: 'extensions',
      label: 'Расширения',
      icon: FiZap,
      description: 'Дополнительные функции'
    },
    {
      id: 'analytics',
      label: 'Аналитика',
      icon: FiBarChart,
      description: 'Статистика и отчеты'
    },
    {
      id: 'settings',
      label: 'Настройки',
      icon: FiSettings,
      description: 'Конфигурация проекта'
    }
  ];

  // Данные для DataStats
  const dashboardStats = [
    {
      title: 'Всего заказов',
      subtitle: 'За этот месяц',
      value: '1,234',
      change: { value: '+12.5%', type: 'increase' as const },
      percent: 85,
      color: '#13C296',
      icon: <FiShoppingCart className="w-6 h-6" />
    },
    {
      title: 'Активные пользователи',
      subtitle: 'За последние 7 дней',
      value: '892',
      change: { value: '+8.2%', type: 'increase' as const },
      percent: 92,
      color: '#3758F9',
      icon: <FiUsers className="w-6 h-6" />
    },
    {
      title: 'Доход',
      subtitle: 'За этот месяц',
      value: '$45,678',
      change: { value: '+15.3%', type: 'increase' as const },
      percent: 78,
      color: '#F2994A',
      icon: <FiTrendingUp className="w-6 h-6" />
    },
    {
      title: 'Страницы',
      subtitle: 'Всего страниц',
      value: currentProject.pages?.length || 0,
      change: { value: '+2', type: 'increase' as const },
      percent: 65,
      color: '#9B51E0',
      icon: <FiFileText className="w-6 h-6" />
    }
  ];

  // Данные для TableStack (пользователи)
  const usersData = [
    {
      id: 1,
      name: 'Иван Петров',
      position: 'Администратор',
      email: 'ivan@example.com',
      status: 'active' as const,
      image: 'https://cdn.tailgrids.com/2.0/image/dashboard/images/users-list/image-01.png'
    },
    {
      id: 2,
      name: 'Мария Сидорова',
      position: 'Менеджер',
      email: 'maria@example.com',
      status: 'active' as const,
      image: 'https://cdn.tailgrids.com/2.0/image/dashboard/images/users-list/image-02.png'
    },
    {
      id: 3,
      name: 'Алексей Козлов',
      position: 'Разработчик',
      email: 'alex@example.com',
      status: 'pending' as const,
      image: 'https://cdn.tailgrids.com/2.0/image/dashboard/images/users-list/image-03.png'
    }
  ];

  const handleCreatePage = async () => {
    if (!newPageTitle.trim()) return;
    
    try {
      // Здесь будет вызов API для создания страницы
      console.log('Creating page:', newPageTitle);
      setShowCreatePageModal(false);
      setNewPageTitle('');
    } catch (error) {
      console.error('Error creating page:', error);
    }
  };

  const handleEditPage = (pageId: string) => {
    setIsEditorMode(true);
  };

  const renderDashboard = () => (
    <div className="space-y-6">
      {/* Статистика */}
      <DataStats cards={dashboardStats} />
      
      {/* Пользователи */}
      <div className="bg-white rounded-lg shadow p-6">
        <TableStack 
          title="Пользователи проекта"
          items={usersData}
          onItemClick={(item) => console.log('User clicked:', item)}
        />
      </div>
      
      {/* Быстрые действия */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold mb-4">Быстрые действия</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Button 
            variant="primary" 
            onClick={() => setActiveSection('pages')}
            className="w-full"
          >
            <FiPlus className="mr-2" />
            Создать страницу
          </Button>
          <Button 
            variant="outline" 
            onClick={() => setActiveSection('ecommerce')}
            className="w-full"
          >
            <FiShoppingCart className="mr-2" />
            Управление товарами
          </Button>
          <Button 
            variant="outline" 
            onClick={() => setActiveSection('analytics')}
            className="w-full"
          >
            <FiBarChart className="mr-2" />
            Просмотр аналитики
          </Button>
        </div>
      </div>
    </div>
  );

  const renderPages = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Страницы</h2>
          <p className="text-gray-600 dark:text-gray-400">Управляйте страницами вашего сайта</p>
        </div>
        <div className="flex items-center space-x-4">
          <button
            onClick={() => navigate('/situs')}
            className="flex items-center space-x-2 px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
          >
            <FiArrowLeft className="w-4 h-4" />
            <span>К проектам</span>
          </button>
          <button 
            onClick={() => setShowCreatePageModal(true)}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <FiPlus className="w-4 h-4" />
            <span>Новая страница</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {currentProject.pages.map((page) => (
          <div key={page.id} className="bg-white dark:bg-gray-800 rounded-lg shadow hover:shadow-lg transition-shadow">
            <div className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{page.title}</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">/{page.slug}</p>
                </div>
                <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                                        page.status === 'published' 
                    ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                    : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                }`}>
                                      {page.status === 'published' ? 'Опубликована' : 'Черновик'}
                </span>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
                <div className="flex items-center space-x-2">
                  <button className="p-2 text-gray-500 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700">
                    <FiEye className="w-4 h-4" />
                  </button>
                  <button 
                    onClick={() => handleEditPage(page.id)}
                    className="p-2 text-gray-500 hover:text-green-600 dark:text-gray-400 dark:hover:text-green-400 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    <FiEdit className="w-4 h-4" />
                  </button>
                  <button className="p-2 text-gray-500 hover:text-red-600 dark:text-gray-400 dark:hover:text-red-400 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700">
                    <FiTrash2 className="w-4 h-4" />
                  </button>
                </div>
                
                <button 
                  onClick={() => handleEditPage(page.id)}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
                >
                  Редактировать
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderContent = () => {
    switch (activeSection) {
      case 'orders':
        return <OrdersSection />;
      case 'dashboard':
        return renderDashboard();
      case 'pages':
        return <PagesSection onEditPage={() => setIsEditorMode(true)} />;
      case 'ecommerce':
        return <EcommerceSection />;
      default:
        return (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🚧</div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              {navigationItems.find(item => item.id === activeSection)?.label}
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              {navigationItems.find(item => item.id === activeSection)?.description}
            </p>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header 
        title={currentProject.name}
        showBalance={true}
        showUserMenu={true}
      />

      <div className="flex">
        {/* Левое меню */}
        <div className={`${sidebarCollapsed ? 'w-16' : 'w-64'} bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 transition-all duration-300`}>
          <div className="p-4">
            <button
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
              className="w-full p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              <FiGrid className="w-5 h-5" />
            </button>
          </div>

          <nav className="px-2">
            {navigationItems.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveSection(item.id)}
                  className={`w-full flex items-center justify-between px-3 py-3 rounded-lg mb-1 transition-colors ${
                    activeSection === item.id
                      ? 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300'
                      : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
                  }`}
                  title={sidebarCollapsed ? item.label : undefined}
                >
                  <div className="flex items-center space-x-3">
                    <Icon className="w-5 h-5 flex-shrink-0" />
                    {!sidebarCollapsed && (
                      <div className="text-left">
                        <div className="text-sm font-medium">{item.label}</div>
                        <div className="text-xs opacity-75">{item.description}</div>
                      </div>
                    )}
                  </div>
                  {!sidebarCollapsed && item.id === 'orders' && (
                    <div className="flex items-center space-x-1 px-2 py-1 bg-red-100 dark:bg-red-900 rounded-full">
                      <span className="text-xs font-medium text-red-600 dark:text-red-400">3</span>
                    </div>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Управление интерфейсом в нижней части */}
          <div className="mt-auto">
            <InterfaceControls collapsed={sidebarCollapsed} />
          </div>
        </div>

        {/* Основной контент */}
        <div className="flex-1 p-6">
          {renderContent()}
        </div>
      </div>

      {/* Модальное окно создания страницы */}
      {showCreatePageModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full mx-4">
            <div className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Создать новую страницу
              </h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Название страницы
                  </label>
                  <input
                    type="text"
                    value={newPageTitle}
                    onChange={(e) => setNewPageTitle(e.target.value)}
                    placeholder="Введите название страницы"
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  {newPageTitle && (
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                      URL: /{newPageTitle.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, '')}
                    </p>
                  )}
                </div>
              </div>

              <div className="flex items-center justify-end space-x-3 mt-6">
                <button
                  onClick={() => {
                    setShowCreatePageModal(false);
                    setNewPageTitle('');
                  }}
                  className="px-4 py-2 text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
                >
                  Отмена
                </button>
                <button
                  onClick={handleCreatePage}
                  disabled={!newPageTitle.trim()}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Создать страницу
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProjectWorkspace; 