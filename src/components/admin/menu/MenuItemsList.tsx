import React from 'react';
import { MenuItemData } from '../../../types/menu';
import MenuItemCard from './MenuItemCard';

/**
 * Компонент иерархического списка пунктов меню
 * Рекурсивно отображает дерево пунктов с возможностью управления
 */
interface MenuItemsListProps {
  menuItems: MenuItemData[];
  onEditItem: (item: MenuItemData) => void;
  onDeleteItem: (itemId: string) => void;
  onCreateItem: () => void;
  maxLevel?: number;
}

const MenuItemsList: React.FC<MenuItemsListProps> = ({
  menuItems,
  onEditItem,
  onDeleteItem,
  onCreateItem,
  maxLevel = 3
}) => {
  // Рекурсивное отображение пунктов меню с иерархией
  const renderMenuItemsHierarchy = (parentItems: MenuItemData[], level = 1): React.ReactNode => {
    if (level > maxLevel) return null;

    return parentItems.map((item) => (
      <MenuItemCard
        key={item.id}
        item={item}
        level={level}
        onEdit={onEditItem}
        onDelete={onDeleteItem}
      >
        {/* Рекурсивно отображаем дочерние пункты */}
        {item.children && item.children.length > 0 && (
          <div className="mt-2">
            {renderMenuItemsHierarchy(item.children, level + 1)}
          </div>
        )}
      </MenuItemCard>
    ));
  };

  // Фильтруем корневые пункты (без родителя)
  const rootItems = menuItems.filter(item => !item.parentId);

  if (menuItems.length === 0) {
    return (
      <div className="text-center py-12 border border-stroke dark:border-dark-3 rounded-lg">
        <div className="text-6xl mb-4">🧭</div>
        <h3 className="text-lg font-medium text-dark dark:text-white mb-2">
          Меню пустое
        </h3>
        <p className="text-body-color dark:text-dark-6 mb-4">
          Создайте первый пункт меню для начала работы
        </p>
        <button
          onClick={onCreateItem}
          className="text-primary hover:text-primary/80 font-medium"
        >
          Создать первый пункт
        </button>
      </div>
    );
  }

  return (
    <div>
      {/* Заголовок и действия */}
      <div className="flex justify-between items-center mb-4">
        <div>
          <h3 className="text-lg font-medium text-dark dark:text-white">
            Пункты меню
          </h3>
          <p className="text-sm text-body-color dark:text-dark-6">
            {rootItems.length} корневых пунктов, {menuItems.length - rootItems.length} подпунктов
          </p>
        </div>
        
        <button
          onClick={onCreateItem}
          className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary/90 transition-colors"
        >
          <svg width="16" height="16" viewBox="0 0 16 16" className="fill-current">
            <path d="M8 1C8.55228 1 9 1.44772 9 2V7H14C14.5523 7 15 7.44772 15 8C15 8.55228 14.5523 9 14 9H9V14C9 14.5523 8.55228 15 8 15C7.44772 15 7 14.5523 7 14V9H2C1.44772 9 1 8.55228 1 8C1 7.44772 1.44772 7 2 7H7V2C7 1.44772 7.44772 1 8 1Z"/>
          </svg>
          Создать пункт меню
        </button>
      </div>

      {/* Иерархический список пунктов */}
      <div className="space-y-4">
        {renderMenuItemsHierarchy(rootItems)}
      </div>

      {/* Подсказки по управлению */}
      <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
        <h4 className="font-medium text-blue-800 dark:text-blue-200 mb-2">
          💡 Подсказки по управлению меню
        </h4>
        <ul className="text-sm text-blue-700 dark:text-blue-300 space-y-1">
          <li>• Максимальная глубина иерархии: {maxLevel} уровня</li>
          <li>• Используйте тип "Заголовок" для группировки пунктов</li>
          <li>• Alias автоматически генерируется из названия</li>
          <li>• Права доступа наследуются от родительских пунктов</li>
        </ul>
      </div>
    </div>
  );
};

export default MenuItemsList;
