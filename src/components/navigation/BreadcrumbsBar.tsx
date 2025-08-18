import React from 'react';
import { Link } from 'react-router-dom';
import { MenuItemData } from '../../types/menu';
import ActiveMenuTracker, { Breadcrumbs } from './ActiveMenuTracker';

/**
 * Компонент панели хлебных крошек
 * Автоматически отслеживает текущую позицию в меню и показывает путь
 */
interface BreadcrumbsBarProps {
  projectId: string;
  menuTypeName?: string;
  className?: string;
  showHome?: boolean;
  homeTitle?: string;
  homeUrl?: string;
}

const BreadcrumbsBar: React.FC<BreadcrumbsBarProps> = ({
  projectId,
  menuTypeName = 'main',
  className = '',
  showHome = true,
  homeTitle = 'Главная',
  homeUrl = '/'
}) => {
  return (
    <div className={`bg-gray-50 dark:bg-gray-800 border-b border-stroke dark:border-dark-3 px-6 py-3 ${className}`}>
      <ActiveMenuTracker
        projectId={projectId}
        menuTypeName={menuTypeName}
      >
        {(activeItem, breadcrumbs) => (
          <div className="flex items-center justify-between">
            {/* Хлебные крошки */}
            <nav className="flex items-center space-x-2 text-sm" aria-label="Навигация">
              {showHome && (
                <>
                  <Link 
                    to={homeUrl}
                    className="text-body-color dark:text-dark-6 hover:text-primary transition-colors"
                  >
                    🏠 {homeTitle}
                  </Link>
                  {breadcrumbs.length > 0 && (
                    <span className="text-body-color dark:text-dark-6 mx-2">/</span>
                  )}
                </>
              )}
              
              <Breadcrumbs 
                breadcrumbs={breadcrumbs}
                showIcons={true}
                separator="/"
              />
            </nav>

            {/* Информация об активном пункте */}
            {activeItem && (
              <div className="flex items-center gap-3 text-sm">
                <div className="flex items-center gap-2">
                  <span className="text-body-color dark:text-dark-6">Активный пункт:</span>
                  <span className="font-medium text-dark dark:text-white">
                    {activeItem.title}
                  </span>
                </div>
                
                <div className="flex items-center gap-2">
                  <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded">
                    {activeItem.component}
                  </span>
                  {activeItem.view && (
                    <span className="text-xs bg-gray-100 dark:bg-gray-700 text-body-color dark:text-dark-6 px-2 py-1 rounded">
                      {activeItem.view}
                    </span>
                  )}
                </div>
              </div>
            )}
          </div>
        )}
      </ActiveMenuTracker>
    </div>
  );
};

export default BreadcrumbsBar;
