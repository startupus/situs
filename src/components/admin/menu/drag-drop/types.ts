import { MenuItemData } from '../../../../types/menu';

/**
 * Типы для системы Drag & Drop меню
 */

export interface DragState {
  draggedItem: MenuItemData | null;
  dragOverItem: MenuItemData | null;
  dropPosition: 'before' | 'after' | 'inside' | null;
}

export interface ReorderItem {
  id: string;
  orderIndex: number;
  level: number;
  parentId: string | null;
}

export interface MenuItemDragDropProps {
  items: MenuItemData[];
  onReorder: (reorderedItems: ReorderItem[]) => Promise<void>;
  onEditItem?: (item: MenuItemData) => void;
  onDeleteItem?: (itemId: string) => void;
  onToggleStatus?: (itemId: string, isActive: boolean) => Promise<void>;
  showSelection?: boolean;
  selectedItems?: string[];
  onSelectItem?: (itemId: string, selected: boolean) => void;
}

export interface MenuItemProps {
  item: MenuItemData;
  depth?: number;
  maxDepth?: number;
  isDragging?: boolean;
  dragState: DragState;
  onDragStart: (e: React.DragEvent, item: MenuItemData) => void;
  onDragEnd: () => void;
  onDragOver: (e: React.DragEvent, item: MenuItemData) => void;
  onDragLeave: () => void;
  onDrop: (e: React.DragEvent, item: MenuItemData) => void;
  onEditItem?: (item: MenuItemData) => void;
  onDeleteItem?: (itemId: string) => void;
  onToggleStatus?: (itemId: string, isActive: boolean) => Promise<void>;
  showSelection?: boolean;
  selectedItems?: string[];
  onSelectItem?: (itemId: string, selected: boolean) => void;
}
