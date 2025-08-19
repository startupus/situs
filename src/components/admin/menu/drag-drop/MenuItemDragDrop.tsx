import React from 'react';
import { MenuItemDragDropProps } from './types';
import { useDragDrop } from './useDragDrop';
import { buildMenuHierarchy, validateMenuHierarchy } from './utils';
import MenuItemRow from './MenuItemRow';

/**
 * Основной компонент для Drag & Drop перестановки пунктов меню
 * Позволяет изменять порядок и вложенность пунктов
 */
const MenuItemDragDrop: React.FC<MenuItemDragDropProps> = ({
  items,
  onReorder,
  onEditItem,
  onDeleteItem,
  onToggleStatus,
  showSelection = false,
  selectedItems = [],
  onSelectItem
}) => {
  const {
    dragState,
    handleDragStart,
    handleDragEnd,
    handleDragOver,
    handleDragLeave,
    handleDrop
  } = useDragDrop(items, onReorder);

  if (items.length === 0) {
    return (
      <div className="text-center py-8">
        <div className="text-4xl mb-4">📋</div>
        <h3 className="text-lg font-medium text-dark dark:text-white mb-2">
          Пункты меню не найдены
        </h3>
        <p className="text-body-color dark:text-dark-6">
          Создайте первый пункт меню для начала работы
        </p>
      </div>
    );
  }

  // ИСПРАВЛЕНИЕ: Строим правильную иерархию из плоского списка
  const hierarchicalItems = buildMenuHierarchy(items);
  
  // Валидируем иерархию и выводим предупреждения в консоль (отключено для уменьшения спама)
  // const validation = validateMenuHierarchy(items);
  // if (!validation.isValid) {
  //   console.warn('Menu hierarchy validation errors:', validation.errors);
  // }

  return (
    <div className="space-y-2">
      {/* Список пунктов с Drag & Drop */}
      <div className="bg-white dark:bg-dark-2 rounded-lg border border-stroke dark:border-dark-3">
        <div className="p-4 space-y-2">
          {hierarchicalItems.map(item => (
            <MenuItemRow
              key={item.id}
              item={item}
              depth={0}
              maxDepth={3}
              isDragging={dragState.draggedItem?.id === item.id}
              dragState={dragState}
              onDragStart={handleDragStart}
              onDragEnd={handleDragEnd}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onEditItem={onEditItem}
              onDeleteItem={onDeleteItem}
              onToggleStatus={onToggleStatus}
              showSelection={showSelection}
              selectedItems={selectedItems}
              onSelectItem={onSelectItem}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default MenuItemDragDrop;
