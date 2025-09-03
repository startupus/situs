import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { MenuItemData } from '../../types/menu';
import { useNavigationMenu } from '../../hooks/useMenuSystem';
import { useLanguage } from '../../hooks/useLanguage';
import { useActiveMenuItem } from './ActiveMenuTracker';
import IconPreview from '../admin/menu/IconPreview';

/**
 * Компонент навигационного меню
 * Универсально отображает любой тип меню с поддержкой иерархии
 */
interface NavigationMenuProps {
  projectId: string;
  menuTypeName?: string;
  accessLevels?: string[];
  className?: string;
  orientation?: 'horizontal' | 'vertical';
  showIcons?: boolean;
  maxLevel?: number;
}

const NavigationMenu: React.FC<NavigationMenuProps> = ({
  projectId,
  menuTypeName = 'main',
  accessLevels = ['PUBLIC'],
  className = '',
  orientation = 'horizontal',
  showIcons = true,
  maxLevel = 3,
}) => {
  const location = useLocation();
  const { language } = useLanguage();
  const languageCode = language === 'ru' ? 'ru-RU' : 'en-GB';
  const { menuTree, loading, error } = useNavigationMenu(projectId, menuTypeName, accessLevels, languageCode);
  const { activeItem } = useActiveMenuItem(projectId, menuTypeName);

  // Определение активного пункта меню
  const isActiveMenuItem = (item: MenuItemData): boolean => {
    // Используем данные из ActiveMenuTracker
    if (activeItem && activeItem.id === item.id) {
      return true;
    }

    // Проверяем дочерние элементы
    if (item.children && item.children.length > 0) {
      return item.children.some((child) => isActiveMenuItem(child));
    }

    // Fallback: проверяем по URL
    if (item.alias && location.pathname.includes(item.alias)) {
      return true;
    }

    if (item.targetId && location.pathname.includes(item.targetId)) {
      return true;
    }

    return false;
  };

  // Построение URL для пункта меню
  const buildMenuItemUrl = (item: MenuItemData): string => {
    if (item.type === 'URL' && item.externalUrl) {
      return item.externalUrl;
    }

    if (item.component && item.view && item.targetId) {
      switch (item.component) {
        case 'Website':
          return `/projects/${projectId}/pages#${item.targetId}`;
        case 'Store':
          if (item.view === 'categories') {
            return `/projects/${projectId}/store`;
          }
          if (item.view === 'category') {
            return `/projects/${projectId}/store#category-${item.targetId}`;
          }
          break;
        case 'Blog':
          return `/projects/${projectId}/blog/${item.targetId}`;
        case 'Landing':
          return `/projects/${projectId}/landing/${item.targetId}`;
      }
    }

    return `/${item.alias}`;
  };

  // Рендеринг пункта меню
  const renderMenuItem = (item: MenuItemData, level = 1): React.ReactNode => {
    if (level > maxLevel) return null;
    if (item.type === 'SEPARATOR') {
      return <li key={item.id} className="border-t border-stroke dark:border-dark-3 my-2" />;
    }

    const isActive = isActiveMenuItem(item);
    const hasChildren = item.children && item.children.length > 0;
    const url = buildMenuItemUrl(item);

    const itemContent = (
      <div
        className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors ${
          isActive ? 'bg-primary text-white' : 'text-dark dark:text-white hover:bg-gray-100 dark:hover:bg-dark-3'
        }`}
      >
        {showIcons && (
          <span className="text-sm">
            {item.icon ? (
              <IconPreview
                iconName={item.icon}
                iconLibrary={item.iconLibrary}
                size={16}
                className={isActive ? 'text-white' : 'text-primary'}
              />
            ) : // Fallback на эмодзи
            item.type === 'COMPONENT' ? (
              '🧩'
            ) : item.type === 'URL' ? (
              '🔗'
            ) : item.type === 'HEADING' ? (
              '📂'
            ) : (
              '❓'
            )}
          </span>
        )}
        <span className={level > 1 ? 'text-sm' : ''}>{item.title}</span>
        {hasChildren && (
          <svg
            width="12"
            height="12"
            viewBox="0 0 12 12"
            className={`fill-current transition-transform ${isActive ? 'rotate-90' : ''}`}
          >
            <path d="M4 2L8 6L4 10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        )}
      </div>
    );

    return (
      <li key={item.id} className={level > 1 ? 'ml-4' : ''}>
        {item.type === 'HEADING' ? (
          <div className="font-medium text-body-color dark:text-dark-6 text-sm uppercase tracking-wider mb-2 mt-4">
            {itemContent}
          </div>
        ) : (
          <Link to={url} className="block">
            {itemContent}
          </Link>
        )}

        {/* Рендерим дочерние пункты */}
        {hasChildren && (isActive || item.type === 'HEADING') && (
          <ul className={`mt-2 space-y-1 ${orientation === 'vertical' ? 'block' : 'hidden lg:block'}`}>
            {item.children!.map((child) => renderMenuItem(child, level + 1))}
          </ul>
        )}
      </li>
    );
  };

  if (loading) {
    return (
      <div className={`animate-pulse ${className}`}>
        <div className="h-8 bg-gray-200 dark:bg-dark-3 rounded mb-2"></div>
        <div className="h-6 bg-gray-200 dark:bg-dark-3 rounded mb-2"></div>
        <div className="h-6 bg-gray-200 dark:bg-dark-3 rounded"></div>
      </div>
    );
  }

  if (error) {
    return <div className={`text-red-600 dark:text-red-400 text-sm ${className}`}>Ошибка загрузки меню: {error}</div>;
  }

  if (menuTree.length === 0) {
    return <div className={`text-body-color dark:text-dark-6 text-sm ${className}`}>Меню пустое</div>;
  }

  return (
    <nav className={className}>
      <ul className={`space-y-1 ${orientation === 'horizontal' ? 'lg:flex lg:space-y-0 lg:space-x-4' : ''}`}>
        {menuTree.map((item) => renderMenuItem(item))}
      </ul>
    </nav>
  );
};

export default NavigationMenu;
