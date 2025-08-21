import React, { useState, useEffect } from 'react';
import { FiChevronRight, FiChevronDown } from 'react-icons/fi';

interface MenuItem {
  id: string;
  title: string;
  icon: string;
  children?: MenuItem[];
}

const menuItems: MenuItem[] = [
  {
    id: 'theme-components',
    title: 'Theme Components',
    icon: '🎨',
    children: [
      { id: 'theme-alerts', title: 'Alerts', icon: '🚨' },
      { id: 'theme-avatars', title: 'Avatars', icon: '👤' },
      { id: 'theme-badges', title: 'Badges', icon: '🏷️' },
      { id: 'theme-breadcrumb', title: 'Breadcrumb', icon: '🍞' },
      { id: 'theme-forms', title: 'Forms', icon: '📝' },
      { id: 'theme-progress', title: 'Progress', icon: '📊' },
      { id: 'theme-pagination', title: 'Pagination', icon: '📄' },
    ]
  },
  {
    id: 'core-components',
    title: 'Core Components',
    icon: '🔧',
    children: [
      { id: 'core-selects', title: 'Selects', icon: '📋' },
      { id: 'core-form-elements', title: 'Form Elements', icon: '📝' },
      { id: 'core-input-range', title: 'Input Range', icon: '🎚️' },
      { id: 'core-verification', title: 'Verification Inputs', icon: '🔐' },
      { id: 'core-buttons', title: 'Buttons', icon: '🔘' },
    ]
  },
  {
    id: 'dashboard-components',
    title: 'Dashboard Components',
    icon: '📊',
    children: [
      { id: 'dashboard-calendar', title: 'Calendar', icon: '📅' },
      { id: 'dashboard-charts', title: 'Charts', icon: '📈' },
      { id: 'dashboard-stats', title: 'Data Stats', icon: '📊' },
      { id: 'dashboard-profile', title: 'Profile', icon: '👤' },
      { id: 'dashboard-chat', title: 'Chat', icon: '💬' },
      { id: 'dashboard-dropdown', title: 'Dropdown', icon: '⬇️' },
      { id: 'dashboard-navigation', title: 'Navigation', icon: '🧭' },
    ]
  }
];

interface AppearanceDemoSidebarProps {
  activeSection?: string;
  onSectionChange?: (sectionId: string) => void;
}

const AppearanceDemoSidebar: React.FC<AppearanceDemoSidebarProps> = ({
  activeSection,
  onSectionChange
}) => {
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set(['theme-components']));
  const [currentActive, setCurrentActive] = useState(activeSection || 'theme-components');

  useEffect(() => {
    // Автоматически определяем активную секцию по скроллу
    const handleScroll = () => {
      const sections = document.querySelectorAll('[id]');
      let current = '';

      sections.forEach((section) => {
        const rect = section.getBoundingClientRect();
        if (rect.top <= 100 && rect.bottom >= 100) {
          current = section.id;
        }
      });

      if (current && current !== currentActive) {
        setCurrentActive(current);
        onSectionChange?.(current);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [currentActive, onSectionChange]);

  const toggleSection = (sectionId: string) => {
    const newExpanded = new Set(expandedSections);
    if (newExpanded.has(sectionId)) {
      newExpanded.delete(sectionId);
    } else {
      newExpanded.add(sectionId);
    }
    setExpandedSections(newExpanded);
  };

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      setCurrentActive(sectionId);
      onSectionChange?.(sectionId);
    }
  };

  const renderMenuItem = (item: MenuItem, level = 0) => {
    const isExpanded = expandedSections.has(item.id);
    const isActive = currentActive === item.id;
    const hasChildren = item.children && item.children.length > 0;

    return (
      <div key={item.id} className="mb-1">
        <button
          onClick={() => {
            if (hasChildren) {
              toggleSection(item.id);
            } else {
              scrollToSection(item.id);
            }
          }}
          className={`
            w-full flex items-center justify-between px-3 py-2 text-left rounded-md transition-colors
            ${level === 0 ? 'font-medium' : 'font-normal text-sm'}
            ${isActive 
              ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300' 
              : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
            }
            ${level > 0 ? 'ml-4' : ''}
          `.trim().replace(/\s+/g, ' ')}
        >
          <div className="flex items-center">
            <span className="mr-2">{item.icon}</span>
            <span>{item.title}</span>
          </div>
          {hasChildren && (
            <span className="text-gray-400">
              {isExpanded ? <FiChevronDown size={16} /> : <FiChevronRight size={16} />}
            </span>
          )}
        </button>

        {hasChildren && isExpanded && (
          <div className="mt-1 ml-2 border-l border-gray-200 dark:border-gray-600 pl-2">
            {item.children!.map(child => renderMenuItem(child, level + 1))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="w-64 h-screen bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 overflow-y-auto sticky top-0">
      <div className="p-4">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
          Компоненты
        </h2>
        
        <nav className="space-y-1">
          {menuItems.map(item => renderMenuItem(item))}
        </nav>

        {/* Дополнительная информация */}
        <div className="mt-8 p-3 bg-gray-50 dark:bg-gray-900 rounded-md">
          <h3 className="text-sm font-medium text-gray-900 dark:text-gray-100 mb-2">
            Статистика
          </h3>
          <div className="text-xs text-gray-600 dark:text-gray-400 space-y-1">
            <div>Theme Components: 11</div>
            <div>Core Components: 200+</div>
            <div>Dashboard Components: 100+</div>
            <div className="font-medium text-blue-600 dark:text-blue-400 mt-2">
              Всего: 300+ компонентов
            </div>
          </div>
        </div>

        {/* Быстрые действия */}
        <div className="mt-4 space-y-2">
          <button
            onClick={() => scrollToSection('theme-components')}
            className="w-full px-3 py-2 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            К началу
          </button>
          <button
            onClick={() => window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' })}
            className="w-full px-3 py-2 text-sm bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors"
          >
            В конец
          </button>
        </div>
      </div>
    </div>
  );
};

export default AppearanceDemoSidebar;
