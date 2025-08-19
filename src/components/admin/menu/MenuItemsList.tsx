import React, { useState } from 'react';
import { FiCompass, FiPlus, FiGrid, FiList, FiCheck, FiX, FiEyeOff, FiTrash2 } from 'react-icons/fi';
import { MenuItemData } from '../../../types/menu';
import MenuDragDrop from './MenuDragDrop';
import MenuTypesSelector from './MenuTypesSelector';
import BatchActions, { BatchAction } from '../../ui/BatchActions';

/**
 * Компонент иерархического списка пунктов меню
 * Рекурсивно отображает дерево пунктов с возможностью управления
 */
interface MenuItemsListProps {
  menuItems: MenuItemData[];
  onEditItem: (item: MenuItemData) => void;
  onDeleteItem: (itemId: string) => void;
  onCreateItem: () => void;
  onReorderItems?: (items: MenuItemData[]) => void;
  onUpdateMenuItem?: (id: string, updates: Partial<MenuItemData>) => void;
  maxLevel?: number;
  displayStyle?: 'tree' | 'list';
  selectedMenuType?: string;
  onMenuTypeChange?: (menuTypeId: string) => void;
  menuTypes?: Array<{id: string; name: string; title: string; isActive?: boolean; projectId?: string; createdAt?: string; updatedAt?: string}>;
  onMenuTypesUpdate?: () => void;
  projectId: string;
  onDisplayStyleChange?: (style: 'tree' | 'list') => void;
}



const MenuItemsList: React.FC<MenuItemsListProps> = ({
  menuItems,
  onEditItem,
  onDeleteItem,
  onCreateItem,
  onReorderItems,
  onUpdateMenuItem,
  maxLevel = 3,
  displayStyle = 'tree',
  selectedMenuType = '',
  onMenuTypeChange,
  menuTypes = [],
  onMenuTypesUpdate,
  projectId,
  onDisplayStyleChange
}) => {
  const [selectedItems, setSelectedItems] = useState<string[]>([]);

  // Функции для пакетной обработки
  const handleSelectItem = (itemId: string, selected: boolean) => {
    if (selected) {
      setSelectedItems(prev => [...prev, itemId]);
    } else {
      setSelectedItems(prev => prev.filter(id => id !== itemId));
    }
  };

  const handleSelectAll = (selected: boolean) => {
    if (selected) {
      setSelectedItems(menuItems.map(item => item.id));
    } else {
      setSelectedItems([]);
    }
  };

  const handleClearSelection = () => {
    setSelectedItems([]);
  };

  const batchActions: BatchAction[] = [
    {
      id: 'activate',
      label: 'Активировать',
      icon: <FiCheck size={14} />,
      variant: 'success'
    },
    {
      id: 'deactivate',
      label: 'Деактивировать',
      icon: <FiEyeOff size={14} />,
      variant: 'default'
    },
    {
      id: 'delete',
      label: 'Удалить',
      icon: <FiTrash2 size={14} />,
      variant: 'danger'
    }
  ];

  const handleBatchAction = (actionId: string, itemIds: string[]) => {
    switch (actionId) {
      case 'activate':
        console.log('Активировать пункты:', itemIds);
        // TODO: Реализовать массовую активацию
        break;
      case 'deactivate':
        console.log('Деактивировать пункты:', itemIds);
        // TODO: Реализовать массовую деактивацию
        break;
      case 'delete':
        if (confirm(`Вы уверены, что хотите удалить ${itemIds.length} пунктов меню?`)) {
          console.log('Удалить пункты:', itemIds);
          // TODO: Реализовать массовое удаление
        }
        break;
    }
  };
  
  // Функция для создания подменю
  const handleMakeSubmenu = async (itemId: string, parentId: string) => {
    if (onUpdateMenuItem) {
      const parentItem = menuItems.find(item => item.id === parentId);
      const childrenCount = menuItems.filter(item => item.parentId === parentId).length;
      
      onUpdateMenuItem(itemId, {
        parentId: parentId,
        level: (parentItem?.level || 1) + 1,
        orderIndex: childrenCount
      });
    }
  };

  // Функция для перемещения на корневой уровень
  const handleMakeRoot = async (itemId: string) => {
    if (onUpdateMenuItem) {
      const rootItems = menuItems.filter(item => !item.parentId);
      const maxOrderIndex = Math.max(...rootItems.map(item => item.orderIndex || 0), -1);
      
      onUpdateMenuItem(itemId, {
        parentId: null,
        level: 1,
        orderIndex: maxOrderIndex + 1
      });
    }
  };

  if (menuItems.length === 0) {
    return (
      <div className="text-center py-12 border border-stroke dark:border-dark-3 rounded-lg">
        <div className="text-6xl mb-4 flex justify-center">
          <FiCompass size={64} className="text-body-color dark:text-dark-6" />
        </div>
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

  const rootItems = menuItems.filter(item => !item.parentId);

  return (
    <div>
      {/* Селектор типа меню с переключателями вида */}
      <div className="flex items-center gap-4 mb-4">
        <div className="flex-1">
          {onMenuTypeChange && onMenuTypesUpdate && (
            <MenuTypesSelector
              projectId={projectId}
              menuTypes={menuTypes}
              selectedMenuType={selectedMenuType}
              onMenuTypeChange={onMenuTypeChange}
              onMenuTypesUpdate={onMenuTypesUpdate}
            />
          )}
        </div>


      </div>

      {/* Компонент пакетной обработки */}
      <BatchActions
        selectedItems={selectedItems}
        totalItems={menuItems.length}
        actions={batchActions}
        onAction={handleBatchAction}
        onSelectAll={handleSelectAll}
        onClearSelection={handleClearSelection}
      />

      {/* Проверка выбранного типа меню */}
      {!selectedMenuType ? (
        <div className="text-center py-12 border border-stroke dark:border-dark-3 rounded-lg">
          <div className="text-6xl mb-4 flex justify-center">
            <FiCompass size={64} className="text-body-color dark:text-dark-6" />
          </div>
          <h3 className="text-lg font-medium text-dark dark:text-white mb-2">
            Выберите тип меню
          </h3>
          <p className="text-body-color dark:text-dark-6">
            Выберите тип меню из выпадающего списка выше для начала работы
          </p>
        </div>
      ) : (
        <>


      {/* Drag & Drop с бесконечной вложенностью (как в Joomla) */}
      {onReorderItems ? (
        <MenuDragDrop
          menuItems={menuItems}
          onReorderItems={onReorderItems}
          onEditItem={onEditItem}
          onDeleteItem={onDeleteItem}
          onMakeSubmenu={handleMakeSubmenu}
          onMakeRoot={handleMakeRoot}
          maxLevel={maxLevel}
          displayStyle={displayStyle}
          showSelection={true}
          selectedItems={selectedItems}
          onSelectItem={handleSelectItem}
        />
      ) : (
        <div className="text-center py-8 text-body-color dark:text-dark-6">
          Функция перестановки недоступна
        </div>
      )}
        </>
      )}
    </div>
  );
};

export default MenuItemsList;
