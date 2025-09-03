import React from 'react';
import { MenuItemData } from '../../../types/menu';
import { FiBox, FiLink, FiFolder, FiMinus, FiHelpCircle, FiGlobe, FiEdit, FiTrash2 } from 'react-icons/fi';
import ToggleSwitch from '../../ui/ToggleSwitch';
import { testIds } from '../../ui/testids';
import IconPreview from './IconPreview';

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
  showSelection = false,
}) => {
  // Получение иконки пункта меню (приоритет: пользовательская -> по типу)
  const getMenuIcon = () => {
    // Если есть пользовательская иконка, используем её
    if (item.icon) {
      return <IconPreview iconName={item.icon} iconLibrary={item.iconLibrary} size={16} className="text-primary" />;
    }

    // Fallback на иконки по типу пункта меню
    switch (item.type) {
      case 'COMPONENT':
        return <FiBox size={16} className="text-primary" />;
      case 'URL':
        return <FiLink size={16} className="text-primary" />;
      case 'HEADING':
        return <FiFolder size={16} className="text-primary" />;
      case 'SEPARATOR':
        return <FiMinus size={16} className="text-primary" />;
      default:
        return <FiHelpCircle size={16} className="text-primary" />;
    }
  };

  // Получение цвета по уровню доступа
  const getAccessLevelColor = (accessLevel: string) => {
    switch (accessLevel) {
      case 'PUBLIC':
        return 'text-green-600 dark:text-green-400';
      case 'REGISTERED':
        return 'text-blue-600 dark:text-blue-400';
      case 'SPECIAL':
        return 'text-purple-600 dark:text-purple-400';
      case 'CUSTOM':
        return 'text-orange-600 dark:text-orange-400';
      default:
        return 'text-gray-600 dark:text-gray-400';
    }
  };

  return (
    <div className={`${level > 1 ? 'ml-6 border-l-2 border-primary/20 pl-4' : ''}`}>
      <div className="border border-stroke dark:border-dark-3 rounded-lg mb-2" data-testid={testIds.menu.item}>
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center gap-3 flex-1">
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
              {getMenuIcon()}
            </span>

            <div className="flex-1">
              {/* Основная информация */}
              <div className="flex items-center gap-2 mb-1">
                <h4 className="font-medium text-dark dark:text-white">{item.title}</h4>

                {/* Компактные бейджи */}
                <span className="text-xs text-body-color dark:text-dark-6">Level {level}</span>

                <span className={`text-xs ${getAccessLevelColor(item.accessLevel)}`}>{item.accessLevel}</span>

                {!item.isPublished && <span className="text-xs text-yellow-600 dark:text-yellow-400">Скрыто</span>}
              </div>

              {/* Вторичная информация */}
              <div className="flex items-center gap-3 text-sm text-body-color dark:text-dark-6">
                <span className="font-mono text-xs">{item.alias}</span>

                {item.component && (
                  <span className="flex items-center gap-1">
                    <span className="w-1.5 h-1.5 bg-primary rounded-full"></span>
                    {item.component}
                  </span>
                )}

                {item.view && <span>{item.view}</span>}

                {item.targetId && <span>→ {item.targetId}</span>}

                {item.externalUrl && <span className="truncate max-w-32">{item.externalUrl}</span>}

                <span className="flex items-center gap-1">
                  <FiGlobe size={12} />
                  {item.language === '*' ? 'Все' : item.language}
                </span>
              </div>
            </div>
          </div>

          {/* Действия в корпоративном стиле */}
          <div className="flex items-center gap-2">
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
              className="text-body-color dark:text-dark-6 hover:text-primary transition-colors p-1"
              title="Редактировать пункт меню"
            >
              <FiEdit size={16} />
            </button>

            <button
              onClick={() => onDelete(item.id)}
              className="text-body-color dark:text-dark-6 hover:text-red-500 transition-colors p-1"
              title="Удалить пункт меню"
            >
              <FiTrash2 size={16} />
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
