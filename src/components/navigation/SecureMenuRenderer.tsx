import React from 'react';
import { MenuItemData } from '../../types/menu';

/**
 * Компонент для безопасного рендеринга меню с учетом прав доступа
 * Скрывает недоступные пункты и показывает сообщения о недостатке прав
 */
interface SecureMenuRendererProps {
  menuItems: MenuItemData[];
  userAccessLevels: string[];
  onAccessDenied?: (item: MenuItemData) => void;
  showAccessDeniedMessage?: boolean;
  gracefulDegradation?: boolean;
  children: (filteredItems: MenuItemData[], stats: AccessStats) => React.ReactNode;
}

interface AccessStats {
  total: number;
  visible: number;
  hidden: number;
  byAccessLevel: { [level: string]: number };
}

const SecureMenuRenderer: React.FC<SecureMenuRendererProps> = ({
  menuItems,
  userAccessLevels,
  onAccessDenied,
  showAccessDeniedMessage = false,
  gracefulDegradation = true,
  children
}) => {

  // Проверка доступа к пункту меню
  const hasAccess = (item: MenuItemData): boolean => {
    return userAccessLevels.includes(item.accessLevel);
  };

  // Фильтрация пунктов меню рекурсивно
  const filterMenuItems = (items: MenuItemData[]): MenuItemData[] => {
    return items
      .filter(item => {
        const access = hasAccess(item);
        
        if (!access && onAccessDenied) {
          onAccessDenied(item);
        }
        
        return access;
      })
      .map(item => ({
        ...item,
        children: item.children ? filterMenuItems(item.children) : []
      }));
  };

  // Подсчет статистики доступа
  const calculateStats = (items: MenuItemData[]): AccessStats => {
    const stats: AccessStats = {
      total: 0,
      visible: 0,
      hidden: 0,
      byAccessLevel: {}
    };

    const processItems = (itemList: MenuItemData[]) => {
      itemList.forEach(item => {
        stats.total++;
        
        if (hasAccess(item)) {
          stats.visible++;
        } else {
          stats.hidden++;
        }

        // Подсчет по уровням доступа
        stats.byAccessLevel[item.accessLevel] = (stats.byAccessLevel[item.accessLevel] || 0) + 1;

        if (item.children) {
          processItems(item.children);
        }
      });
    };

    processItems(items);
    return stats;
  };

  const filteredItems = filterMenuItems(menuItems);
  const stats = calculateStats(menuItems);

  return (
    <>
      {children(filteredItems, stats)}
      
      {/* Сообщение о недостатке прав */}
      {showAccessDeniedMessage && stats.hidden > 0 && (
        <div className="mt-4 p-3 bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 rounded-lg">
          <div className="flex items-start gap-2">
            <span className="text-orange-600 dark:text-orange-400">⚠️</span>
            <div className="text-sm">
              <p className="font-medium text-orange-800 dark:text-orange-200">
                Ограниченный доступ
              </p>
              <p className="text-orange-700 dark:text-orange-300">
                {stats.hidden} пунктов меню скрыто из-за недостаточных прав доступа.
                {!gracefulDegradation && ' Обратитесь к администратору для получения доступа.'}
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

/**
 * Хук для работы с безопасным меню
 */
export const useSecureMenu = (
  menuItems: MenuItemData[],
  userAccessLevels: string[]
) => {
  const [deniedItems, setDeniedItems] = React.useState<MenuItemData[]>([]);

  const handleAccessDenied = (item: MenuItemData) => {
    setDeniedItems(prev => [...prev, item]);
  };

  const clearDeniedItems = () => {
    setDeniedItems([]);
  };

  return {
    deniedItems,
    handleAccessDenied,
    clearDeniedItems
  };
};

/**
 * Компонент для отображения информации о правах доступа
 */
interface AccessInfoProps {
  stats: AccessStats;
  userAccessLevels: string[];
  className?: string;
}

export const AccessInfo: React.FC<AccessInfoProps> = ({
  stats,
  userAccessLevels,
  className = ''
}) => {
  return (
    <div className={`bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-3 ${className}`}>
      <h4 className="font-medium text-blue-800 dark:text-blue-200 mb-2">
        🔐 Информация о доступе
      </h4>
      
      <div className="grid grid-cols-2 gap-4 text-sm">
        <div>
          <p className="text-blue-700 dark:text-blue-300">
            <strong>Доступно:</strong> {stats.visible} из {stats.total}
          </p>
          <p className="text-blue-700 dark:text-blue-300">
            <strong>Скрыто:</strong> {stats.hidden}
          </p>
        </div>
        
        <div>
          <p className="text-blue-700 dark:text-blue-300 mb-1">
            <strong>Ваши права:</strong>
          </p>
          <div className="flex flex-wrap gap-1">
            {userAccessLevels.map(level => (
              <span key={level} className="text-xs bg-blue-100 dark:bg-blue-800 text-blue-800 dark:text-blue-200 px-2 py-1 rounded">
                {level === 'PUBLIC' ? '🌐 Публичный' :
                 level === 'REGISTERED' ? '👤 Пользователь' :
                 level === 'SPECIAL' ? '⭐ Специальный' :
                 level === 'CUSTOM' ? '🔧 Админ' : level}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SecureMenuRenderer;
