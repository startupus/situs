import React from 'react';
import { MenuItemData } from '../../../types/menu';
import { FiBox, FiLink, FiFolder, FiMinus, FiHelpCircle, FiGlobe, FiEdit, FiTrash2 } from 'react-icons/fi';
import ToggleSwitch from '../../ui/ToggleSwitch';

/**
 * Компонент карточки пункта меню
 * Отображает информацию о пункте меню с возможностью редактирования/удаления
 */
interface MenuItemCardProps {
  item: MenuItemData;
  level: number;
  onEdit: (item: MenuItemData) => void;
  onDelete: (itemId: string) => void;
  children?: React.ReactNode; // Для дочерних пунктов
  isSelected?: boolean;
  onSelect?: (itemId: string, selected: boolean) => void;
  showSelection?: boolean;
}

const MenuItemCard: React.FC<MenuItemCardProps> = ({
  item,
  level,
  onEdit,
  onDelete,
  children,
  isSelected = false,
  onSelect,
  showSelection = false
}) => {
  // Получение иконки по типу пункта меню
  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'COMPONENT': return <FiBox size={16} className="text-primary" />;
      case 'URL': return <FiLink size={16} className="text-primary" />;
      case 'HEADING': return <FiFolder size={16} className="text-primary" />;
      case 'SEPARATOR': return <FiMinus size={16} className="text-primary" />;
      default: return <FiHelpCircle size={16} className="text-primary" />;
    }
  };

  // Получение цвета по уровню доступа
  const getAccessLevelColor = (accessLevel: string) => {
    switch (accessLevel) {
      case 'PUBLIC': return 'text-green-600 dark:text-green-400';
      case 'REGISTERED': return 'text-blue-600 dark:text-blue-400';
      case 'SPECIAL': return 'text-purple-600 dark:text-purple-400';
      case 'CUSTOM': return 'text-orange-600 dark:text-orange-400';
      default: return 'text-gray-600 dark:text-gray-400';
    }
  };

  return (
    <div className={`${level > 1 ? 'ml-6 border-l-2 border-primary/20 pl-4' : ''}`}>
      <div className="border border-stroke dark:border-dark-3 rounded-lg p-4 hover:shadow-md transition-shadow mb-2" data-testid="menu-item">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-3">
              {/* Чекбокс выбора */}
              {showSelection && onSelect && (
                <input
                  type="checkbox"
                  checked={isSelected}
                  onChange={(e) => onSelect(item.id, e.target.checked)}
                  className="w-4 h-4 text-primary bg-transparent border-2 border-stroke dark:border-dark-3 rounded focus:ring-primary focus:ring-2"
                />
              )}
              
              {/* Иконка по типу пункта меню */}
              <span className="text-lg" title={`Тип: ${item.type}`}>
                {getTypeIcon(item.type)}
              </span>
              
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h4 className="font-medium text-dark dark:text-white">
                    {item.title}
                  </h4>
                  
                  {/* Бейджи состояния */}
                  <span className="text-xs bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 px-2 py-1 rounded">
                    Level {level}
                  </span>
                  
                  {!item.isPublished && (
                    <span className="text-xs bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200 px-2 py-1 rounded">
                      Скрыто
                    </span>
                  )}

                  <span className={`text-xs px-2 py-1 rounded ${getAccessLevelColor(item.accessLevel)}`}>
                    {item.accessLevel}
                  </span>
                </div>
                
                {/* Детальная информация */}
                <div className="flex flex-wrap items-center gap-3 text-sm text-body-color dark:text-dark-6">
                  <span className="font-mono text-xs bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">
                    /{item.alias}
                  </span>
                  
                  {item.component && (
                    <span className="flex items-center gap-1">
                      <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                      {item.component}
                    </span>
                  )}
                  
                  {item.view && (
                    <span className="text-purple-600 dark:text-purple-400">
                      view: {item.view}
                    </span>
                  )}
                  
                  {item.targetId && (
                    <span className="text-green-600 dark:text-green-400">
                      → {item.targetId}
                    </span>
                  )}

                  {item.externalUrl && (
                    <span className="text-blue-600 dark:text-blue-400 truncate max-w-32">
                      {item.externalUrl}
                    </span>
                  )}
                  
                  <span className="text-gray-500 dark:text-gray-400 flex items-center gap-1">
                    <FiGlobe size={12} />
                    {item.language === '*' ? 'Все языки' : item.language}
                  </span>
                </div>

                {/* Дополнительные параметры */}
                {item.parameters && item.parameters !== '{}' && (
                  <div className="mt-2 text-xs">
                    <details className="text-gray-600 dark:text-gray-400">
                      <summary className="cursor-pointer hover:text-gray-800 dark:hover:text-gray-200">
                        Параметры ({Object.keys(JSON.parse(item.parameters)).length})
                      </summary>
                      <pre className="mt-1 p-2 bg-gray-100 dark:bg-gray-800 rounded text-xs overflow-x-auto">
                        {JSON.stringify(JSON.parse(item.parameters), null, 2)}
                      </pre>
                    </details>
                  </div>
                )}
              </div>
            </div>
          </div>
          
          {/* Действия */}
          <div className="flex items-center gap-2 ml-4">
            {/* Тумблер активности */}
            <ToggleSwitch
              checked={item.isPublished ?? true}
              onChange={(checked) => {
                // TODO: Реализовать изменение статуса пункта меню
                console.log('Toggle menu item status:', item.id, checked);
              }}
              size="sm"
            />
            
            <button
              onClick={() => onEdit(item)}
              className="text-primary hover:text-primary/80 text-sm px-3 py-1 rounded border border-primary/20 hover:bg-primary/5 transition-colors flex items-center gap-1"
              title="Редактировать пункт меню"
            >
              <FiEdit size={14} />
            </button>
            
            <button
              onClick={() => onDelete(item.id)}
              className="text-red-600 hover:text-red-700 dark:text-red-400 text-sm px-3 py-1 rounded border border-red-200 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors flex items-center gap-1"
              title="Удалить пункт меню"
            >
              <FiTrash2 size={14} />
            </button>
          </div>
        </div>
      </div>
      
      {/* Дочерние пункты */}
      {children}
    </div>
  );
};

export default MenuItemCard;
