import React, { useState } from 'react';
import { FiBarChart2, FiChevronDown, FiChevronRight } from 'react-icons/fi';
import ComponentDisplay from '../ComponentDisplay';

// Импорты Dashboard Components
import { 
  Calendar1, Calendar2,
  Chart1, Chart2,
  DataStats1, DataStats2,
  Profile1, Profile2,
  ChatBox1, ChatList1,
  Dropdown1, Dropdown2,
  HorizontalMenu1, VerticalNavbar1
} from '@/components/ui/dashboard';

interface DashboardComponentGroup {
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

const DashboardComponentsDemo: React.FC = () => {
  const [expandedGroups, setExpandedGroups] = useState<string[]>(['calendar']);

  const toggleGroup = (groupId: string) => {
    setExpandedGroups(prev => 
      prev.includes(groupId) 
        ? prev.filter(id => id !== groupId)
        : [...prev, groupId]
    );
  };

  const componentGroups: DashboardComponentGroup[] = [
    {
      id: 'calendar',
      title: 'Calendar',
      description: 'Компоненты календаря',
      components: [
        {
          id: 'dashboard-calendar-1',
          title: 'Calendar 1',
          component: <Calendar1 />,
          filePath: 'src/components/ui/dashboard/Calendar/Calendar1.tsx',
          description: 'Базовый календарь с навигацией'
        },
        {
          id: 'dashboard-calendar-2',
          title: 'Calendar 2',
          component: <Calendar2 />,
          filePath: 'src/components/ui/dashboard/Calendar/Calendar2.tsx',
          description: 'Календарь с выбором диапазона дат'
        }
      ]
    },
    {
      id: 'charts',
      title: 'Charts',
      description: 'Диаграммы и графики',
      components: [
        {
          id: 'dashboard-chart-1',
          title: 'Chart 1',
          component: <Chart1 />,
          filePath: 'src/components/ui/dashboard/Chart/Chart1.tsx',
          description: 'Линейная диаграмма'
        },
        {
          id: 'dashboard-chart-2',
          title: 'Chart 2',
          component: <Chart2 />,
          filePath: 'src/components/ui/dashboard/Chart/Chart2.tsx',
          description: 'Столбчатая диаграмма'
        }
      ]
    },
    {
      id: 'data-stats',
      title: 'Data Stats',
      description: 'Карточки статистики',
      components: [
        {
          id: 'dashboard-stats-1',
          title: 'Data Stats 1',
          component: <DataStats1 />,
          filePath: 'src/components/ui/dashboard/DataStats/DataStats1.tsx',
          description: 'Базовые карточки статистики'
        },
        {
          id: 'dashboard-stats-2',
          title: 'Data Stats 2',
          component: <DataStats2 />,
          filePath: 'src/components/ui/dashboard/DataStats/DataStats2.tsx',
          description: 'Расширенные карточки статистики'
        }
      ]
    },
    {
      id: 'profile',
      title: 'Profile',
      description: 'Компоненты профиля',
      components: [
        {
          id: 'dashboard-profile-1',
          title: 'Profile 1',
          component: <Profile1 />,
          filePath: 'src/components/ui/dashboard/Profile/Profile1.tsx',
          description: 'Базовый профиль пользователя'
        },
        {
          id: 'dashboard-profile-2',
          title: 'Profile 2',
          component: <Profile2 />,
          filePath: 'src/components/ui/dashboard/Profile/Profile2.tsx',
          description: 'Расширенный профиль пользователя'
        }
      ]
    },
    {
      id: 'chat',
      title: 'Chat',
      description: 'Компоненты чата',
      components: [
        {
          id: 'dashboard-chatbox-1',
          title: 'Chat Box 1',
          component: <ChatBox1 />,
          filePath: 'src/components/ui/dashboard/ChatBox/ChatBox1.tsx',
          description: 'Окно чата'
        },
        {
          id: 'dashboard-chatlist-1',
          title: 'Chat List 1',
          component: <ChatList1 />,
          filePath: 'src/components/ui/dashboard/ChatList/ChatList1.tsx',
          description: 'Список чатов'
        }
      ]
    },
    {
      id: 'navigation',
      title: 'Navigation',
      description: 'Компоненты навигации',
      components: [
        {
          id: 'dashboard-dropdown-1',
          title: 'Dropdown 1',
          component: <Dropdown1 />,
          filePath: 'src/components/ui/dashboard/Dropdown/Dropdown1.tsx',
          description: 'Выпадающее меню'
        },
        {
          id: 'dashboard-dropdown-2',
          title: 'Dropdown 2',
          component: <Dropdown2 />,
          filePath: 'src/components/ui/dashboard/Dropdown/Dropdown2.tsx',
          description: 'Выпадающее меню с иконками'
        },
        {
          id: 'dashboard-horizontal-menu-1',
          title: 'Horizontal Menu 1',
          component: <HorizontalMenu1 />,
          filePath: 'src/components/ui/dashboard/HorizontalMenu/HorizontalMenu1.tsx',
          description: 'Горизонтальное меню'
        },
        {
          id: 'dashboard-vertical-navbar-1',
          title: 'Vertical Navbar 1',
          component: <VerticalNavbar1 />,
          filePath: 'src/components/ui/dashboard/VerticalNavbar/VerticalNavbar1.tsx',
          description: 'Вертикальная навигация'
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
            <FiBarChart2 className="mr-3" />
            Dashboard Components
          </h1>
          <p className="text-body-color dark:text-dark-6">
            Компоненты панели управления с интерактивной функциональностью
          </p>
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
                        category="Dashboard"
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

export default DashboardComponentsDemo;