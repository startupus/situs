import React from 'react';
import { FiGrid, FiBarChart2, FiLayers, FiCode, FiEye } from 'react-icons/fi';

interface DemoNavigationProps {
  onCategorySelect: (category: string) => void;
  selectedCategory?: string;
}

const DemoNavigation: React.FC<DemoNavigationProps> = ({ onCategorySelect, selectedCategory }) => {
  const categories = [
    {
      id: 'core',
      title: 'Core Components',
      description: '200+ базовых UI компонентов',
      icon: FiGrid,
      count: 200,
      subcategories: [
        'Avatars', 'Badges', 'Buttons', 'Alerts', 'Forms', 
        'Input Range', 'Verification Inputs', 'Breadcrumbs', 
        'Checkboxes', 'Progress', 'Spinners', 'Tooltips',
        'Paginations', 'Tags', 'Tabs', 'Lists', 'Switchers',
        'Clipboards', 'Ratings', 'Skeletons', 'Toasts',
        'File Uploads', 'Date Pickers', 'Galleries', 'Selects'
      ]
    },
    {
      id: 'dashboard',
      title: 'Dashboard Components',
      description: '100+ компонентов панели управления',
      icon: FiBarChart2,
      count: 100,
      subcategories: [
        'Calendar', 'Charts', 'Data Stats', 'Profile',
        'Chat Box', 'Chat List', 'Dropdowns', 'Navigation',
        'Horizontal Menu', 'Vertical Navbar', 'Settings',
        'Table Stack', 'Shopping Cart', 'Steps'
      ]
    },
    {
      id: 'application',
      title: 'Application Components',
      description: '98 компонентов приложений',
      icon: FiLayers,
      count: 98,
      subcategories: [
        'Blog', 'Cards', 'Contact', 'Error Pages',
        'Footer', 'Modal', 'Navbar', 'Sign In',
        'Tables', 'Table Grids'
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-dark py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-dark dark:text-white mb-4">
            <FiCode className="inline mr-3" />
            Situs Components Demo
          </h1>
          <p className="text-lg text-body-color dark:text-dark-6 max-w-2xl mx-auto">
            Полная библиотека из 398+ React компонентов с поддержкой глобальной темы, 
            TypeScript типизации и responsive дизайна
          </p>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {categories.map((category) => (
            <div
              key={category.id}
              onClick={() => onCategorySelect(category.id)}
              className={`
                cursor-pointer rounded-lg border-2 p-6 transition-all duration-300 hover:shadow-lg
                ${selectedCategory === category.id 
                  ? 'border-primary bg-primary/5 shadow-lg' 
                  : 'border-stroke dark:border-dark-3 bg-white dark:bg-dark-2 hover:border-primary/50'
                }
              `}
            >
              <div className="flex items-center mb-4">
                <div className="p-3 bg-primary/10 rounded-lg mr-4">
                  <category.icon className="w-8 h-8 text-primary" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-dark dark:text-white">
                    {category.title}
                  </h3>
                  <p className="text-sm text-primary font-medium">
                    {category.count}+ компонентов
                  </p>
                </div>
              </div>
              
              <p className="text-body-color dark:text-dark-6 mb-4">
                {category.description}
              </p>

              <div className="space-y-2">
                <h4 className="text-sm font-semibold text-dark dark:text-white">
                  Категории:
                </h4>
                <div className="flex flex-wrap gap-1">
                  {category.subcategories.slice(0, 6).map((sub, index) => (
                    <span
                      key={index}
                      className="px-2 py-1 text-xs bg-gray-100 dark:bg-dark-3 text-gray-600 dark:text-gray-400 rounded"
                    >
                      {sub}
                    </span>
                  ))}
                  {category.subcategories.length > 6 && (
                    <span className="px-2 py-1 text-xs text-gray-500 dark:text-gray-500">
                      +{category.subcategories.length - 6} еще
                    </span>
                  )}
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-gray-200 dark:border-dark-3">
                <button className="w-full flex items-center justify-center px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors">
                  <FiEye className="mr-2" />
                  Просмотреть компоненты
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Stats */}
        <div className="bg-white dark:bg-dark-2 rounded-lg p-6 border border-stroke dark:border-dark-3">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
            <div>
              <h3 className="text-3xl font-bold text-primary mb-2">398+</h3>
              <p className="text-body-color dark:text-dark-6">Всего компонентов</p>
            </div>
            <div>
              <h3 className="text-3xl font-bold text-green-600 mb-2">100%</h3>
              <p className="text-body-color dark:text-dark-6">TypeScript поддержка</p>
            </div>
            <div>
              <h3 className="text-3xl font-bold text-blue-600 mb-2">∞</h3>
              <p className="text-body-color dark:text-dark-6">Кастомизация темы</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DemoNavigation;