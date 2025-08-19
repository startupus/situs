import { useState } from 'react';
import { MenuItemData } from '../../../../types/menu';
import { DragState, ReorderItem } from './types';

/**
 * Хук для управления состоянием Drag & Drop
 */
export const useDragDrop = (
  items: MenuItemData[],
  onReorder: (reorderedItems: ReorderItem[]) => Promise<void>
) => {
  const [dragState, setDragState] = useState<DragState>({
    draggedItem: null,
    dragOverItem: null,
    dropPosition: null
  });

  // Начало перетаскивания
  const handleDragStart = (e: React.DragEvent, item: MenuItemData) => {
    // Проверяем, не является ли цель элементом с data-no-drag
    const target = e.target as HTMLElement;
    if (target.closest('[data-no-drag="true"]')) {
      e.preventDefault();
      return;
    }

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

  return {
    dragState,
    handleDragStart,
    handleDragEnd,
    handleDragOver,
    handleDragLeave,
    handleDrop
  };
};

// Расчет нового порядка элементов
const calculateNewOrder = (
  allItems: MenuItemData[],
  draggedItem: MenuItemData,
  targetItem: MenuItemData,
  position: 'before' | 'after' | 'inside'
): ReorderItem[] => {
  const result: ReorderItem[] = [];

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
