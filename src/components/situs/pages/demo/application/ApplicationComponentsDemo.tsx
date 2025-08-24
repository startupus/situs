import React, { useState } from 'react';
import { FiLayers, FiChevronDown, FiChevronRight } from 'react-icons/fi';
import ComponentDisplay from '../ComponentDisplay';

// Импорты Application Components
import { 
  ThemeError1, ThemeError2, ThemeError3, ThemeError5,
  ThemeCard1, ThemeCard8,
  ThemeTableGrid1, ThemeTableGrid2
} from '@/components/ui/application';

interface ApplicationComponentGroup {
  id: string;
  title: string;
  description: string;
  components: Array<{
    id: string;
    title: string;
    component: React.ReactNode;
    filePath: string;
    description?: string;
  }>;
}

const ApplicationComponentsDemo: React.FC = () => {
  const [expandedGroups, setExpandedGroups] = useState<string[]>(['error']);

  const toggleGroup = (groupId: string) => {
    setExpandedGroups(prev => 
      prev.includes(groupId) 
        ? prev.filter(id => id !== groupId)
        : [...prev, groupId]
    );
  };

  const componentGroups: ApplicationComponentGroup[] = [
    {
      id: 'error',
      title: 'Error Pages',
      description: 'Страницы ошибок 404, 500 и т.д.',
      components: [
        {
          id: 'app-error-1',
          title: 'Error Page 1',
          component: <ThemeError1 />,
          filePath: 'src/components/ui/core/application/Error/Error1.tsx',
          description: '404 страница с градиентным фоном'
        },
        {
          id: 'app-error-2',
          title: 'Error Page 2',
          component: <ThemeError2 />,
          filePath: 'src/components/ui/core/application/Error/Error2.tsx',
          description: '404 страница с центрированным блоком'
        },
        {
          id: 'app-error-3',
          title: 'Error Page 3',
          component: <ThemeError3 />,
          filePath: 'src/components/ui/core/application/Error/Error3.tsx',
          description: '404 страница с иллюстрацией'
        },
        {
          id: 'app-error-5',
          title: 'Error Page 5',
          component: <ThemeError5 />,
          filePath: 'src/components/ui/core/application/Error/Error5.tsx',
          description: '404 страница с изображением'
        }
      ]
    },
    {
      id: 'cards',
      title: 'Cards',
      description: 'Карточки контента',
      components: [
        {
          id: 'app-card-1',
          title: 'Card 1',
          component: <ThemeCard1 />,
          filePath: 'src/components/ui/core/application/Card/Card1.tsx',
          description: 'Базовые карточки с изображениями'
        },
        {
          id: 'app-card-8',
          title: 'Card 8',
          component: <ThemeCard8 />,
          filePath: 'src/components/ui/core/application/Card/Card8.tsx',
          description: 'Простые карточки без изображений'
        }
      ]
    },
    {
      id: 'table-grids',
      title: 'Table Grids',
      description: 'Сетки данных',
      components: [
        {
          id: 'app-tablegrid-1',
          title: 'Table Grid 1',
          component: <ThemeTableGrid1 />,
          filePath: 'src/components/ui/core/application/TableGrid/TableGrid1.tsx',
          description: 'Сетка изображений с метаданными'
        },
        {
          id: 'app-tablegrid-2',
          title: 'Table Grid 2',
          component: <ThemeTableGrid2 />,
          filePath: 'src/components/ui/core/application/TableGrid/TableGrid2.tsx',
          description: 'Сетка профилей фрилансеров'
        }
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-dark py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-dark dark:text-white mb-4 flex items-center">
            <FiLayers className="mr-3" />
            Application Components
          </h1>
          <p className="text-body-color dark:text-dark-6">
            Компоненты приложений для создания полноценных интерфейсов
          </p>
          <div className="mt-4 p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded border border-yellow-200 dark:border-yellow-800">
            <p className="text-sm text-yellow-800 dark:text-yellow-200">
              <strong>В разработке:</strong> Показаны только адаптированные компоненты. 
              Полная интеграция 98 компонентов в процессе.
            </p>
          </div>
        </div>

        {/* Groups */}
        <div className="space-y-6">
          {componentGroups.map((group) => (
            <div key={group.id} className="bg-white dark:bg-dark-2 rounded-lg border border-stroke dark:border-dark-3">
              {/* Group Header */}
              <div 
                className="p-4 border-b border-stroke dark:border-dark-3 cursor-pointer hover:bg-gray-50 dark:hover:bg-dark-3 transition-colors"
                onClick={() => toggleGroup(group.id)}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-xl font-semibold text-dark dark:text-white flex items-center">
                      {expandedGroups.includes(group.id) ? (
                        <FiChevronDown className="mr-2" />
                      ) : (
                        <FiChevronRight className="mr-2" />
                      )}
                      {group.title}
                      <span className="ml-3 px-2 py-1 text-xs bg-primary/10 text-primary rounded">
                        {group.components.length} компонентов
                      </span>
                    </h2>
                    <p className="text-sm text-body-color dark:text-dark-6 mt-1">
                      {group.description}
                    </p>
                  </div>
                </div>
              </div>

              {/* Group Components */}
              {expandedGroups.includes(group.id) && (
                <div className="p-6">
                  <div className="space-y-6">
                    {group.components.map((comp) => (
                      <ComponentDisplay
                        key={comp.id}
                        id={comp.id}
                        title={comp.title}
                        component={comp.component}
                        category="Application"
                        subcategory={group.title}
                        filePath={comp.filePath}
                        description={comp.description}
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ApplicationComponentsDemo;