import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { MenuItemData } from '../../types/menu';

/**
 * Компонент для отслеживания активного пункта меню и построения хлебных крошек
 * Автоматически определяет активный пункт на основе текущего URL
 */
interface ActiveMenuTrackerProps {
  projectId: string;
  menuTypeName?: string;
  onActiveItemChange?: (activeItem: MenuItemData | null, breadcrumbs: MenuItemData[]) => void;
  children?: (activeItem: MenuItemData | null, breadcrumbs: MenuItemData[]) => React.ReactNode;
}

const ActiveMenuTracker: React.FC<ActiveMenuTrackerProps> = ({
  projectId,
  menuTypeName = 'main',
  onActiveItemChange,
  children
}) => {
  const location = useLocation();
  const [activeItem, setActiveItem] = useState<MenuItemData | null>(null);
  const [breadcrumbs, setBreadcrumbs] = useState<MenuItemData[]>([]);
  const [loading, setLoading] = useState(false);

  // Определение активного пункта меню по текущему URL
  const findActiveMenuItem = async (currentPath: string) => {
    try {
      setLoading(true);

      // Получаем тип меню
      const menuTypesResponse = await fetch(`http://localhost:3002/api/menu-types?projectId=${projectId}`);
      const menuTypesResult = await menuTypesResponse.json();
      
      if (!menuTypesResult.success) return;

      const menuType = menuTypesResult.data.find((mt: any) => mt.name === menuTypeName);
      if (!menuType) return;

      // Ищем активный пункт меню
      const activeResponse = await fetch(
        `http://localhost:3002/api/menu-items/active-by-path?menuTypeId=${menuType.id}&path=${encodeURIComponent(currentPath)}`
      );
      const activeResult = await activeResponse.json();

      if (activeResult.success && activeResult.data) {
        const { activeItem: foundItem, breadcrumbs: foundBreadcrumbs } = activeResult.data;
        
        setActiveItem(foundItem);
        setBreadcrumbs(foundBreadcrumbs || []);
        
        // Уведомляем родительский компонент
        if (onActiveItemChange) {
          onActiveItemChange(foundItem, foundBreadcrumbs || []);
        }
      } else {
        // Если точного совпадения нет, пытаемся найти по алгоритму
        const fallbackItem = await findFallbackMenuItem(menuType.id, currentPath);
        
        setActiveItem(fallbackItem);
        setBreadcrumbs(fallbackItem ? await buildBreadcrumbs(fallbackItem) : []);
        
        if (onActiveItemChange) {
          onActiveItemChange(fallbackItem, fallbackItem ? await buildBreadcrumbs(fallbackItem) : []);
        }
      }
    } catch (error) {
      console.error('Ошибка определения активного пункта меню:', error);
      setActiveItem(null);
      setBreadcrumbs([]);
      
      if (onActiveItemChange) {
        onActiveItemChange(null, []);
      }
    } finally {
      setLoading(false);
    }
  };

  // Поиск пункта меню по алгоритму fallback
  const findFallbackMenuItem = async (menuTypeId: string, currentPath: string): Promise<MenuItemData | null> => {
    try {
      // Получаем все пункты меню
      const response = await fetch(`http://localhost:3002/api/menu-items?menuTypeId=${menuTypeId}`);
      const result = await response.json();
      
      if (!result.success) return null;

      const allItems: MenuItemData[] = result.data;
      const pathSegments = currentPath.split('/').filter(s => s.length > 0);

      // Алгоритм поиска (по приоритету):
      
      // 1. Точное совпадение по alias
      for (const segment of pathSegments) {
        const exactMatch = allItems.find(item => item.alias === segment);
        if (exactMatch) return exactMatch;
      }

      // 2. Совпадение по targetId
      for (const segment of pathSegments) {
        const targetMatch = allItems.find(item => item.targetId === segment);
        if (targetMatch) return targetMatch;
      }

      // 3. Частичное совпадение по alias
      for (const segment of pathSegments) {
        const partialMatch = allItems.find(item => 
          item.alias && (item.alias.includes(segment) || segment.includes(item.alias))
        );
        if (partialMatch) return partialMatch;
      }

      // 4. Совпадение по компоненту и view
      if (pathSegments.includes('website') || pathSegments.includes('pages')) {
        const websiteMatch = allItems.find(item => item.component === 'Website');
        if (websiteMatch) return websiteMatch;
      }

      if (pathSegments.includes('store') || pathSegments.includes('shop')) {
        const storeMatch = allItems.find(item => item.component === 'Store');
        if (storeMatch) return storeMatch;
      }

      if (pathSegments.includes('blog') || pathSegments.includes('news')) {
        const blogMatch = allItems.find(item => item.component === 'Blog');
        if (blogMatch) return blogMatch;
      }

      return null;
    } catch (error) {
      console.error('Ошибка fallback поиска:', error);
      return null;
    }
  };

  // Построение хлебных крошек от корня до активного пункта
  const buildBreadcrumbs = async (item: MenuItemData): Promise<MenuItemData[]> => {
    const breadcrumbs: MenuItemData[] = [];
    let currentItem: MenuItemData | null = item;

    // Идем вверх по иерархии
    while (currentItem) {
      breadcrumbs.unshift(currentItem);
      
      if (currentItem.parentId) {
        try {
          const response = await fetch(`http://localhost:3002/api/menu-items/${currentItem.parentId}`);
          const result = await response.json();
          currentItem = result.success ? result.data : null;
        } catch (error) {
          console.error('Ошибка получения родительского пункта:', error);
          break;
        }
      } else {
        break;
      }
    }

    return breadcrumbs;
  };

  // Отслеживание изменений URL
  useEffect(() => {
    findActiveMenuItem(location.pathname);
  }, [location.pathname, projectId, menuTypeName]);

  // Рендеринг через children prop или null
  if (children) {
    return <>{children(activeItem, breadcrumbs)}</>;
  }

  return null;
};

/**
 * Компонент хлебных крошек на основе активного пункта меню
 */
interface BreadcrumbsProps {
  breadcrumbs: MenuItemData[];
  className?: string;
  separator?: string;
  showIcons?: boolean;
}

export const Breadcrumbs: React.FC<BreadcrumbsProps> = ({
  breadcrumbs,
  className = '',
  separator = '/',
  showIcons = true
}) => {
  if (breadcrumbs.length === 0) {
    return null;
  }

  return (
    <nav className={`flex items-center space-x-2 text-sm ${className}`} aria-label="Хлебные крошки">
      {breadcrumbs.map((item, index) => (
        <React.Fragment key={item.id}>
          {index > 0 && (
            <span className="text-body-color dark:text-dark-6 mx-2">
              {separator}
            </span>
          )}
          
          <div className="flex items-center gap-1">
            {showIcons && item.component && (
              <span className="text-xs">
                {item.component === 'Website' ? '🌐' :
                 item.component === 'Store' ? '🛒' :
                 item.component === 'Blog' ? '📝' :
                 item.component === 'Landing' ? '🎯' : '🧩'}
              </span>
            )}
            
            <span className={`
              ${index === breadcrumbs.length - 1 
                ? 'text-dark dark:text-white font-medium' 
                : 'text-body-color dark:text-dark-6 hover:text-dark dark:hover:text-white cursor-pointer'
              }
            `}>
              {item.title}
            </span>
          </div>
        </React.Fragment>
      ))}
    </nav>
  );
};

/**
 * Хук для использования активного пункта меню
 */
export const useActiveMenuItem = (projectId: string, menuTypeName: string = 'main') => {
  const location = useLocation();
  const [activeItem, setActiveItem] = useState<MenuItemData | null>(null);
  const [breadcrumbs, setBreadcrumbs] = useState<MenuItemData[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const findActive = async () => {
      try {
        setLoading(true);
        
        // Получаем тип меню
        const menuTypesResponse = await fetch(`http://localhost:3002/api/menu-types?projectId=${projectId}`);
        const menuTypesResult = await menuTypesResponse.json();
        
        if (!menuTypesResult.success) return;

        const menuType = menuTypesResult.data.find((mt: any) => mt.name === menuTypeName);
        if (!menuType) return;

        // Ищем активный пункт
        const activeResponse = await fetch(
          `http://localhost:3002/api/menu-items/active-by-path?menuTypeId=${menuType.id}&path=${encodeURIComponent(location.pathname)}`
        );
        const activeResult = await activeResponse.json();

        if (activeResult.success && activeResult.data) {
          setActiveItem(activeResult.data.activeItem);
          setBreadcrumbs(activeResult.data.breadcrumbs || []);
        } else {
          setActiveItem(null);
          setBreadcrumbs([]);
        }
      } catch (error) {
        console.error('Ошибка получения активного пункта:', error);
        setActiveItem(null);
        setBreadcrumbs([]);
      } finally {
        setLoading(false);
      }
    };

    findActive();
  }, [location.pathname, projectId, menuTypeName]);

  return { activeItem, breadcrumbs, loading };
};

export default ActiveMenuTracker;
