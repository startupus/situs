import React, { useState } from 'react';
import { FiCompass, FiPlus, FiGrid, FiList, FiCheck, FiX, FiEyeOff, FiTrash2 } from 'react-icons/fi';
import { MenuItemData, MenuTypeData } from '../../../types/menu';
import { MenuItemDragDrop } from './drag-drop';
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
  onToggleItemStatus?: (itemId: string, isActive: boolean) => Promise<void>;
  onBatchToggleStatus?: (itemIds: string[], isActive: boolean) => Promise<void>;
  onBatchDelete?: (itemIds: string[]) => Promise<void>;
  maxLevel?: number;
  displayStyle?: 'tree' | 'list';
  selectedMenuType?: string;
  onMenuTypeChange?: (menuTypeId: string) => void;
  menuTypes?: MenuTypeData[];
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
  onToggleItemStatus,
  onBatchToggleStatus,
  onBatchDelete,
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

  const handleBatchAction = async (actionId: string, itemIds: string[]) => {
    try {
      switch (actionId) {
        case 'activate':
          if (onBatchToggleStatus) {
            await onBatchToggleStatus(itemIds, true);
          }
          break;
        case 'deactivate':
          if (onBatchToggleStatus) {
            await onBatchToggleStatus(itemIds, false);
          }
          break;
        case 'delete':
          if (confirm(`Вы уверены, что хотите удалить ${itemIds.length} пунктов меню?`)) {
            if (onBatchDelete) {
              await onBatchDelete(itemIds);
            }
          }
          break;
      }
      // Очищаем выбор после выполнения действия
      setSelectedItems([]);
    } catch (error) {
      console.error('Ошибка пакетной обработки пунктов меню:', error);
      alert('Произошла ошибка при выполнении операции');
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
        parentId: undefined,
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
        <MenuItemDragDrop
          items={menuItems}
          onReorder={async (reorderedItems) => {
            // Преобразуем данные для совместимости
            const updatedItems = reorderedItems.map(item => ({
              ...menuItems.find(mi => mi.id === item.id)!,
              orderIndex: item.orderIndex,
              level: item.level,
              parentId: item.parentId || undefined
            }));
            onReorderItems(updatedItems);
          }}
          onEditItem={onEditItem}
          onDeleteItem={onDeleteItem}
          onToggleStatus={onToggleItemStatus}
          showSelection={true}
          selectedItems={selectedItems}
          onSelectItem={handleSelectItem}
        />
      ) : (
        <div className="text-center py-8 text-body-color dark:text-dark-6" data-testid="menu-dragdrop">
          Функция перестановки недоступна
        </div>
      )}
        </>
      )}
    </div>
  );
};

export default MenuItemsList;
