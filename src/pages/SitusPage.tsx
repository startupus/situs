import React, { useState } from 'react';
import { FiGrid, FiLayers, FiShoppingCart, FiBarChart, FiUsers, FiSettings, FiCode, FiDroplet } from 'react-icons/fi';
import ComponentViewer from '../components/ComponentViewer';

interface Section {
  id: string;
  name: string;
  icon: React.ReactNode;
  description: string;
  components: Component[];
}

interface Component {
  id: string;
  name: string;
  description: string;
  category: string;
}

const SitusPage: React.FC = () => {
  const [selectedSection, setSelectedSection] = useState<string>('core');
  const [selectedComponent, setSelectedComponent] = useState<string | null>(null);

  const sections: Section[] = [
    {
      id: 'core',
      name: 'Основные компоненты',
      icon: <FiGrid className="w-5 h-5" />,
      description: 'Базовые UI компоненты',
      components: [
        { id: 'buttons', name: 'Кнопки', description: 'Различные типы кнопок', category: 'CoreComponents' },
        { id: 'forms', name: 'Формы', description: 'Элементы форм и ввода', category: 'CoreComponents' },
        { id: 'alerts', name: 'Уведомления', description: 'Алерты и уведомления', category: 'CoreComponents' },
        { id: 'modals', name: 'Модальные окна', description: 'Диалоговые окна', category: 'CoreComponents' },
        { id: 'tables', name: 'Таблицы', description: 'Таблицы данных', category: 'CoreComponents' },
        { id: 'cards', name: 'Карточки', description: 'Карточки контента', category: 'CoreComponents' },
      ]
    },
    {
      id: 'dashboard',
      name: 'Дашборд',
      icon: <FiBarChart className="w-5 h-5" />,
      description: 'Компоненты для дашбордов',
      components: [
        { id: 'charts', name: 'Графики', description: 'Различные типы графиков', category: 'DashboardComponents' },
        { id: 'stats', name: 'Статистика', description: 'Статистические карточки', category: 'DashboardComponents' },
        { id: 'widgets', name: 'Виджеты', description: 'Информационные виджеты', category: 'DashboardComponents' },
        { id: 'analytics', name: 'Аналитика', description: 'Аналитические компоненты', category: 'DashboardComponents' },
      ]
    },
    {
      id: 'ecommerce',
      name: 'E-commerce',
      icon: <FiShoppingCart className="w-5 h-5" />,
      description: 'Компоненты для интернет-магазинов',
      components: [
        { id: 'product-cards', name: 'Карточки товаров', description: 'Отображение товаров', category: 'EcommerceComponents' },
        { id: 'shopping-cart', name: 'Корзина', description: 'Корзина покупок', category: 'EcommerceComponents' },
        { id: 'checkout', name: 'Оформление заказа', description: 'Процесс покупки', category: 'EcommerceComponents' },
        { id: 'product-details', name: 'Детали товара', description: 'Страница товара', category: 'EcommerceComponents' },
      ]
    },
    {
      id: 'marketing',
      name: 'Маркетинг',
      icon: <FiUsers className="w-5 h-5" />,
      description: 'Маркетинговые компоненты',
      components: [
        { id: 'hero-sections', name: 'Главные секции', description: 'Hero блоки', category: 'MarketingComponents' },
        { id: 'testimonials', name: 'Отзывы', description: 'Отзывы клиентов', category: 'MarketingComponents' },
        { id: 'pricing', name: 'Ценообразование', description: 'Тарифные планы', category: 'MarketingComponents' },
        { id: 'newsletter', name: 'Рассылка', description: 'Подписка на новости', category: 'MarketingComponents' },
      ]
    },
    {
      id: 'templates',
      name: 'Шаблоны',
      icon: <FiLayers className="w-5 h-5" />,
      description: 'Готовые шаблоны страниц',
      components: [
        { id: 'startup', name: 'Стартап', description: 'Шаблон для стартапов', category: 'Templates' },
        { id: 'agency', name: 'Агентство', description: 'Шаблон для агентств', category: 'Templates' },
        { id: 'saas', name: 'SaaS', description: 'Шаблон для SaaS проектов', category: 'Templates' },
        { id: 'ecommerce-template', name: 'E-commerce', description: 'Шаблон магазина', category: 'Templates' },
      ]
    },
    {
      id: 'ai',
      name: 'AI компоненты',
      icon: <FiCode className="w-5 h-5" />,
      description: 'Компоненты с ИИ',
      components: [
        { id: 'ai-chat', name: 'AI чат', description: 'Чат с искусственным интеллектом', category: 'AiComponents' },
        { id: 'ai-assistant', name: 'AI ассистент', description: 'Интеллектуальный помощник', category: 'AiComponents' },
        { id: 'ai-generator', name: 'AI генератор', description: 'Генерация контента', category: 'AiComponents' },
      ]
    },
    {
      id: 'customization',
      name: 'Настройки',
      icon: <FiSettings className="w-5 h-5" />,
      description: 'Настройки и конфигурация',
      components: [
        { id: 'theme-customizer', name: 'Настройка темы', description: 'Кастомизация внешнего вида', category: 'Customization' },
        { id: 'layout-builder', name: 'Конструктор макетов', description: 'Создание макетов', category: 'Customization' },
        { id: 'component-editor', name: 'Редактор компонентов', description: 'Редактирование компонентов', category: 'Customization' },
      ]
    }
  ];

  const currentSection = sections.find(section => section.id === selectedSection);

  const handleComponentClick = (componentId: string, componentName: string) => {
    setSelectedComponent(componentId);
  };

  const handleCloseViewer = () => {
    setSelectedComponent(null);
  };

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
      {/* Левая панель */}
      <div className="w-80 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 flex flex-col">
        {/* Заголовок */}
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <FiDroplet className="w-6 h-6 text-blue-600" />
            Situs Components
          </h1>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            Библиотека готовых компонентов
          </p>
        </div>

        {/* Навигация по разделам */}
        <div className="flex-1 overflow-y-auto">
          <div className="p-4">
            <h2 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3 uppercase tracking-wide">
              Разделы
            </h2>
            <nav className="space-y-1">
              {sections.map((section) => (
                <button
                  key={section.id}
                  onClick={() => setSelectedSection(section.id)}
                  className={`w-full flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                    selectedSection === section.id
                      ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300'
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                  }`}
                >
                  {section.icon}
                  <div className="text-left">
                    <div className="font-medium">{section.name}</div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      {section.description}
                    </div>
                  </div>
                </button>
              ))}
            </nav>
          </div>
        </div>
      </div>

      {/* Основная область */}
      <div className="flex-1 flex flex-col">
        {/* Заголовок раздела */}
        <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center gap-3">
            {currentSection?.icon}
            <div>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                {currentSection?.name}
              </h2>
              <p className="text-gray-600 dark:text-gray-400">
                {currentSection?.description}
              </p>
            </div>
          </div>
        </div>

        {/* Содержимое раздела */}
        <div className="flex-1 p-6 overflow-y-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {currentSection?.components.map((component) => (
              <div
                key={component.id}
                className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6 hover:shadow-lg transition-shadow cursor-pointer"
                onClick={() => setSelectedComponent(component.id)}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                      {component.name}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 text-sm">
                      {component.description}
                    </p>
                  </div>
                  <div className="ml-4">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200">
                      {component.category}
                    </span>
                  </div>
                </div>
                
                                 <div className="flex items-center justify-between">
                   <button 
                     onClick={() => handleComponentClick(component.id, component.name)}
                     className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 text-sm font-medium"
                   >
                     Просмотреть
                   </button>
                   <button className="text-green-600 dark:text-green-400 hover:text-green-700 dark:hover:text-green-300 text-sm font-medium">
                     Использовать
                   </button>
                 </div>
              </div>
            ))}
          </div>
                 </div>
       </div>

       {/* Component Viewer Modal */}
       {selectedComponent && (
         <ComponentViewer
           componentId={selectedComponent}
           componentName={currentSection?.components.find(c => c.id === selectedComponent)?.name || ''}
           onClose={handleCloseViewer}
         />
       )}
     </div>
   );
 };

export default SitusPage; 