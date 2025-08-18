import React, { useState } from 'react';
import { MenuItemData } from '../../../types/menu';

/**
 * Компонент для Drag & Drop перестановки пунктов меню
 * Позволяет изменять порядок и вложенность пунктов
 */
interface MenuItemDragDropProps {
  items: MenuItemData[];
  onReorder: (reorderedItems: Array<{
    id: string;
    orderIndex: number;
    level: number;
    parentId: string | null;
  }>) => Promise<void>;
}

interface DragState {
  draggedItem: MenuItemData | null;
  dragOverItem: MenuItemData | null;
  dropPosition: 'before' | 'after' | 'inside' | null;
}

const MenuItemDragDrop: React.FC<MenuItemDragDropProps> = ({
  items,
  onReorder
}) => {
  const [dragState, setDragState] = useState<DragState>({
    draggedItem: null,
    dragOverItem: null,
    dropPosition: null
  });

  // Начало перетаскивания
  const handleDragStart = (e: React.DragEvent, item: MenuItemData) => {
    setDragState(prev => ({ ...prev, draggedItem: item }));
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/html', item.title);
  };

  // Завершение перетаскивания
  const handleDragEnd = () => {
    setDragState({
      draggedItem: null,
      dragOverItem: null,
      dropPosition: null
    });
  };

  // Перетаскивание над элементом
  const handleDragOver = (e: React.DragEvent, item: MenuItemData) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';

    if (!dragState.draggedItem || dragState.draggedItem.id === item.id) {
      return;
    }

    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    const y = e.clientY - rect.top;
    const height = rect.height;

    let position: 'before' | 'after' | 'inside';
    
    if (y < height * 0.25) {
      position = 'before';
    } else if (y > height * 0.75) {
      position = 'after';
    } else {
      position = 'inside';
    }

    setDragState(prev => ({
      ...prev,
      dragOverItem: item,
      dropPosition: position
    }));
  };

  // Покидание области перетаскивания
  const handleDragLeave = () => {
    setDragState(prev => ({
      ...prev,
      dragOverItem: null,
      dropPosition: null
    }));
  };

  // Сброс элемента
  const handleDrop = async (e: React.DragEvent, targetItem: MenuItemData) => {
    e.preventDefault();
    
    const { draggedItem, dropPosition } = dragState;
    if (!draggedItem || !dropPosition || draggedItem.id === targetItem.id) {
      return;
    }

    // Строим новую структуру
    const reorderedItems = calculateNewOrder(
      items,
      draggedItem,
      targetItem,
      dropPosition
    );

    try {
      await onReorder(reorderedItems);
    } catch (error) {
      console.error('Ошибка перестановки пунктов меню:', error);
      alert('Ошибка при изменении порядка пунктов меню');
    }

    handleDragEnd();
  };

  // Расчет нового порядка элементов
  const calculateNewOrder = (
    allItems: MenuItemData[],
    draggedItem: MenuItemData,
    targetItem: MenuItemData,
    position: 'before' | 'after' | 'inside'
  ) => {
    const result: Array<{
      id: string;
      orderIndex: number;
      level: number;
      parentId: string | null;
    }> = [];

    // Создаем плоский список всех элементов кроме перетаскиваемого
    const otherItems = allItems.filter(item => item.id !== draggedItem.id);
    
    // Находим позицию для вставки
    const targetIndex = otherItems.findIndex(item => item.id === targetItem.id);
    
    let newLevel: number;
    let newParentId: string | null;
    let insertIndex: number;

    switch (position) {
      case 'before':
        newLevel = targetItem.level;
        newParentId = targetItem.parentId;
        insertIndex = targetIndex;
        break;
      
      case 'after':
        newLevel = targetItem.level;
        newParentId = targetItem.parentId;
        insertIndex = targetIndex + 1;
        break;
      
      case 'inside':
        newLevel = targetItem.level + 1;
        newParentId = targetItem.id;
        insertIndex = targetIndex + 1;
        break;
    }

    // Ограничиваем максимальный уровень
    if (newLevel > 3) {
      newLevel = 3;
    }

    // Вставляем перетаскиваемый элемент в новую позицию
    const reorderedItems = [
      ...otherItems.slice(0, insertIndex),
      { ...draggedItem, level: newLevel, parentId: newParentId },
      ...otherItems.slice(insertIndex)
    ];

    // Пересчитываем orderIndex для всех элементов
    reorderedItems.forEach((item, index) => {
      result.push({
        id: item.id,
        orderIndex: index,
        level: item.level,
        parentId: item.parentId
      });
    });

    return result;
  };

  // Получение CSS классов для индикации drop зоны
  const getDropIndicatorClass = (item: MenuItemData) => {
    if (dragState.dragOverItem?.id !== item.id) return '';
    
    switch (dragState.dropPosition) {
      case 'before':
        return 'border-t-2 border-primary';
      case 'after':
        return 'border-b-2 border-primary';
      case 'inside':
        return 'bg-primary/10 border border-primary';
      default:
        return '';
    }
  };

  // Рендеринг пункта меню с поддержкой Drag & Drop
  const renderDragDropItem = (item: MenuItemData, depth = 0): React.ReactNode => {
    const isDragging = dragState.draggedItem?.id === item.id;
    const maxDepth = Math.min(depth, 3); // Максимум 3 уровня отступа

    return (
      <div key={item.id}>
        <div
          draggable
          onDragStart={(e) => handleDragStart(e, item)}
          onDragEnd={handleDragEnd}
          onDragOver={(e) => handleDragOver(e, item)}
          onDragLeave={handleDragLeave}
          onDrop={(e) => handleDrop(e, item)}
          className={`
            flex items-center gap-3 p-3 rounded-lg cursor-move transition-all
            ${isDragging ? 'opacity-50 bg-gray-100 dark:bg-gray-800' : 'hover:bg-gray-50 dark:hover:bg-dark-3'}
            ${getDropIndicatorClass(item)}
          `}
          style={{ marginLeft: `${maxDepth * 20}px` }}
        >
          {/* Иконка перетаскивания */}
          <div className="text-body-color dark:text-dark-6 cursor-move">
            ⋮⋮
          </div>

          {/* Уровень */}
          <span className="text-xs bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">
            L{item.level}
          </span>

          {/* Тип пункта */}
          <span className="text-sm">
            {item.type === 'COMPONENT' ? '🧩' : 
             item.type === 'URL' ? '🔗' : 
             item.type === 'HEADING' ? '📂' : '❓'}
          </span>

          {/* Название */}
          <div className="flex-1">
            <h4 className="font-medium text-dark dark:text-white">
              {item.title}
            </h4>
            <p className="text-sm text-body-color dark:text-dark-6">
              /{item.alias}
              {item.component && ` • ${item.component}`}
              {item.view && ` • ${item.view}`}
              {item.targetId && ` → ${item.targetId}`}
            </p>
          </div>

          {/* Статус */}
          <div className="flex items-center gap-2 text-sm">
            <span className={item.isPublished ? 'text-green-600' : 'text-red-600'}>
              {item.isPublished ? '✅' : '❌'}
            </span>
            <span className="text-body-color dark:text-dark-6">
              {item.accessLevel === 'PUBLIC' ? '🌐' : 
               item.accessLevel === 'REGISTERED' ? '👤' : 
               item.accessLevel === 'SPECIAL' ? '⭐' : '🔧'}
            </span>
            <span className="text-body-color dark:text-dark-6">
              {item.language === '*' ? '🌍' : item.language}
            </span>
          </div>
        </div>

        {/* Рендерим дочерние элементы */}
        {item.children && item.children.length > 0 && (
          <div className="ml-4">
            {item.children.map(child => renderDragDropItem(child, depth + 1))}
          </div>
        )}
      </div>
    );
  };

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

  return (
    <div className="space-y-2">
      {/* Инструкция */}
      <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-3 mb-4">
        <h4 className="font-medium text-blue-800 dark:text-blue-200 mb-2">
          🖱️ Drag & Drop управление
        </h4>
        <ul className="text-sm text-blue-700 dark:text-blue-300 space-y-1">
          <li>• Перетащите пункт для изменения порядка</li>
          <li>• Бросьте в верхнюю четверть - вставить перед</li>
          <li>• Бросьте в нижнюю четверть - вставить после</li>
          <li>• Бросьте в середину - сделать дочерним элементом</li>
          <li>• Максимальная глубина вложенности: 3 уровня</li>
        </ul>
      </div>

      {/* Список пунктов с Drag & Drop */}
      <div className="bg-white dark:bg-dark-2 rounded-lg border border-stroke dark:border-dark-3">
        <div className="p-4 border-b border-stroke dark:border-dark-3">
          <h3 className="text-lg font-semibold text-dark dark:text-white">
            Перетаскивание пунктов меню
          </h3>
          <p className="text-sm text-body-color dark:text-dark-6">
            Используйте перетаскивание для изменения порядка и вложенности
          </p>
        </div>
        
        <div className="p-4 space-y-2">
          {items.map(item => renderDragDropItem(item))}
        </div>
      </div>
    </div>
  );
};

export default MenuItemDragDrop;
