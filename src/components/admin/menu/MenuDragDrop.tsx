import React, { useState, useCallback, useRef, useEffect } from 'react';
import { SortableTree, FolderTreeItemWrapper, SimpleTreeItemWrapper } from 'dnd-kit-sortable-tree';
import {
  FiEdit3, 
  FiTrash2, 
  FiMoreVertical
} from 'react-icons/fi';
import { MenuItemData } from '../../../types/menu';
import { useAdminTheme } from '../../../contexts/AdminThemeContext';

/**
 * Drag & Drop для системы меню с бесконечной вложенностью (как в Joomla)
 * Стилизация на основе TailGrids Pro List компонентов
 */
interface MenuDragDropProps {
  menuItems: MenuItemData[];
  onReorderItems: (items: MenuItemData[]) => void;
  onEditItem: (item: MenuItemData) => void;
  onDeleteItem: (id: string) => void;
  onMakeSubmenu?: (itemId: string, parentId: string) => void;
  onMakeRoot?: (itemId: string) => void;
  maxLevel?: number;
  displayStyle?: 'tree' | 'list';
  showSelection?: boolean;
  selectedItems?: string[];
  onSelectItem?: (itemId: string, selected: boolean) => void;
}

// Адаптер для преобразования MenuItemData в формат SortableTree
interface TreeItem {
  id: string;
  children?: TreeItem[];
  collapsed?: boolean;
  data: MenuItemData;
}

// Dropdown компонент для действий (стиль TailGrids Pro)
const MenuItemDropdown: React.FC<{
  onEdit: () => void;
  onDelete: () => void;
}> = ({ onEdit, onDelete }) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const trigger = useRef<HTMLButtonElement>(null);
  const dropdown = useRef<HTMLDivElement>(null);

  // Закрытие по клику вне элемента
  useEffect(() => {
    const clickHandler = ({ target }: any) => {
      if (!dropdown.current) return;
      if (
        !dropdownOpen ||
        dropdown.current.contains(target) ||
        trigger.current?.contains(target)
      )
        return;
      setDropdownOpen(false);
    };
    document.addEventListener('click', clickHandler);
    return () => document.removeEventListener('click', clickHandler);
  });

  // Закрытие по Esc
  useEffect(() => {
    const keyHandler = ({ keyCode }: any) => {
      if (!dropdownOpen || keyCode !== 27) return;
      setDropdownOpen(false);
    };
    document.addEventListener('keydown', keyHandler);
    return () => document.removeEventListener('keydown', keyHandler);
  });

  return (
    <div className="relative">
      <button
        className="text-body-color hover:text-dark dark:hover:text-white p-1 rounded transition-colors"
        ref={trigger}
        onClick={(e) => {
          e.stopPropagation();
          setDropdownOpen(!dropdownOpen);
        }}
        title="Действия"
      >
        <FiMoreVertical className="w-4 h-4" />
      </button>
      <div
        ref={dropdown}
        className={`shadow-card absolute right-0 top-full z-40 w-[140px] space-y-1 rounded bg-white dark:bg-dark-2 p-2 border border-stroke dark:border-dark-3 ${
          dropdownOpen ? 'block' : 'hidden'
        }`}
      >
            <button
          className="text-body-color hover:bg-gray-2 dark:hover:bg-dark-3 w-full rounded-sm py-1.5 px-3 text-left text-sm flex items-center gap-2 transition-colors"
          onClick={(e) => {
            e.stopPropagation();
            onEdit();
            setDropdownOpen(false);
          }}
        >
          <FiEdit3 className="w-3 h-3" />
          Редактировать
            </button>
            <button
          className="text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 w-full rounded-sm py-1.5 px-3 text-left text-sm flex items-center gap-2 transition-colors"
          onClick={(e) => {
            e.stopPropagation();
            onDelete();
            setDropdownOpen(false);
          }}
        >
          <FiTrash2 className="w-3 h-3" />
          Удалить
            </button>
      </div>
    </div>
  );
};

const MenuDragDrop: React.FC<MenuDragDropProps> = ({
  menuItems,
  onReorderItems,
  onEditItem,
  onDeleteItem,
  maxLevel = 999,
  displayStyle = 'tree',
  showSelection = false,
  selectedItems = [],
  onSelectItem
}) => {
  const { isDarkMode } = useAdminTheme();

  // Преобразуем MenuItemData в TreeItem формат
  const collapsedStateRef = useRef<Record<string, boolean>>({});

  const convertToTreeItems = useCallback((items: MenuItemData[]): TreeItem[] => {
    const itemsMap = new Map<string, TreeItem>();
    const rootItems: TreeItem[] = [];

    // Создаем карту всех элементов
    items.forEach(item => {
      itemsMap.set(item.id, {
        id: item.id,
        children: [],
        collapsed: Boolean(collapsedStateRef.current[item.id]) && Boolean(item.children && item.children.length),
        data: item
      });
    });

    // Строим дерево
    items.forEach(item => {
      const treeItem = itemsMap.get(item.id)!;
      
      if (item.parentId) {
        const parent = itemsMap.get(item.parentId);
        if (parent) {
          parent.children = parent.children || [];
          parent.children.push(treeItem);
        }
      } else {
        rootItems.push(treeItem);
      }
    });

    // Сортируем по orderIndex на каждом уровне
    const sortLevel = (items: TreeItem[]): TreeItem[] => {
      return items.sort((a, b) => a.data.orderIndex - b.data.orderIndex).map(item => ({
        ...item,
        children: item.children ? sortLevel(item.children) : []
      }));
    };

    return sortLevel(rootItems);
  }, []);

  // Преобразуем TreeItem обратно в MenuItemData
  const convertFromTreeItems = useCallback((treeItems: TreeItem[]): MenuItemData[] => {
    const result: MenuItemData[] = [];
    
    const flatten = (items: TreeItem[], parentId: string | null = null, level: number = 1) => {
      items.forEach((item, index) => {
        const menuItem: MenuItemData = {
          ...item.data,
          parentId,
          level,
          orderIndex: index,
          children: undefined // Убираем children из плоской структуры
        };
        
        result.push(menuItem);
        
        if (item.children && item.children.length > 0) {
          flatten(item.children, item.id, level + 1);
        }
      });
    };

    flatten(treeItems);
    return result;
  }, []);

  const [treeItems, setTreeItems] = useState<TreeItem[]>(() => convertToTreeItems(menuItems));

  // Обновляем treeItems при изменении menuItems
  useEffect(() => {
    setTreeItems(convertToTreeItems(menuItems));
  }, [menuItems, convertToTreeItems]);

  const prevStructureSigRef = useRef<string>('');

  const signatureFor = (items: MenuItemData[]) => {
    const sig = items.map(i => `${i.id}:${i.parentId ?? ''}:${i.level}:${i.orderIndex}`).join('|');
    return sig;
  };

  const handleItemsChanged = (newTreeItems: TreeItem[]) => {
    // Сохраняем collapsed состояния
    try {
      const nextCollapsed: Record<string, boolean> = {};
      newTreeItems.forEach(function walk(t) {
        nextCollapsed[t.id] = Boolean(t.collapsed);
        (t.children || []).forEach(walk as any);
      } as any);
      collapsedStateRef.current = nextCollapsed;
    } catch {}

    setTreeItems(newTreeItems);

    // Вычисляем, менялась ли структура (а не только collapsed)
    const newFlat = convertFromTreeItems(newTreeItems);
    const newSig = signatureFor(newFlat);
    if (newSig !== prevStructureSigRef.current) {
      prevStructureSigRef.current = newSig;
      onReorderItems(newFlat);
    }
  };

  // Убраны декоративные иконки типа/доступа по требованию: оставляем только точки (drag handle)

  // Компонент для отображения элемента меню (стиль TailGrids Pro List)
  const TreeItemComponent = React.forwardRef<HTMLDivElement, any>((props, ref) => {
    const { item } = props;
    const menuItem: MenuItemData = item.data;
    const level = props.depth + 1;

  const Wrapper = displayStyle === 'tree' ? FolderTreeItemWrapper : SimpleTreeItemWrapper;
  const wrapperProps: any = displayStyle === 'tree'
    ? { disableCollapseOnItemClick: true }
    : { disableCollapseOnItemClick: true, hideCollapseButton: true };

  return (
      <Wrapper {...props} ref={ref} {...wrapperProps}>
                <div className="text-body-color dark:text-dark-6 flex text-base py-3 hover:bg-gray-2 dark:hover:bg-dark-3 transition-colors cursor-grab active:cursor-grabbing border-b border-stroke dark:border-dark-3 last:border-b-0">
          {/* Drag handle: используем встроенный из библиотеки; собственный не рисуем, чтобы не дублировать иконки */}
          
          {/* Чекбокс выбора */}
          {showSelection && onSelectItem && (
            <div className="flex items-center px-3">
              <input
                type="checkbox"
                checked={selectedItems.includes(menuItem.id)}
                onChange={(e) => onSelectItem(menuItem.id, e.target.checked)}
                className="w-4 h-4 text-primary bg-transparent border-2 border-stroke dark:border-dark-3 rounded focus:ring-primary focus:ring-2"
              />
            </div>
          )}
          
          {/* Основной контент */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1 flex-wrap">
              <span className="font-medium text-dark dark:text-white">
                {menuItem.title}
              </span>
              
              {/* Badge уровня */}
              <span className="inline-block rounded py-1 px-2 text-xs font-medium bg-primary/10 text-primary">
                Level {level}
              </span>
              
              {/* Badge доступа */}
              <span className={`inline-flex items-center gap-1 rounded py-1 px-2 text-xs font-medium ${
                menuItem.accessLevel === 'PUBLIC' ? 'bg-secondary/10 text-secondary' :
                menuItem.accessLevel === 'REGISTERED' ? 'bg-primary/10 text-primary' :
                menuItem.accessLevel === 'SPECIAL' ? 'bg-accent/10 text-accent' :
                'bg-warning/10 text-warning'
              }`}>
                <span>{menuItem.accessLevel}</span>
              </span>
            </div>

            {/* Детальная информация */}
            <div className="flex items-center gap-3 text-sm text-body-color dark:text-dark-6 flex-wrap">
              <span className="font-mono bg-gray-2 dark:bg-dark-2 px-2 py-0.5 rounded text-xs">
                {menuItem.alias}
              </span>
              
              {menuItem.component && (
                <div className="flex items-center gap-2">
                  <span className="font-medium text-primary">{menuItem.component}</span>
                  {menuItem.view && (
                    <span className="bg-gray-3 dark:bg-dark-4 px-2 py-0.5 rounded text-xs">
                      {menuItem.view}
                </span>
                  )}
                  {menuItem.targetId && (
                    <span className="font-mono text-xs text-body-color">→ {menuItem.targetId}</span>
                  )}
                </div>
              )}
              
              <div className="flex items-center gap-1" title={`Язык: ${menuItem.language === '*' ? 'Все языки' : menuItem.language}`}>
                <span className="text-xs">{menuItem.language === '*' ? 'Все' : menuItem.language}</span>
              </div>
            </div>
          </div>

          {/* Dropdown действий */}
          <div className="ml-3 flex-shrink-0">
            <MenuItemDropdown 
              onEdit={() => onEditItem(menuItem)}
              onDelete={() => onDeleteItem(menuItem.id)}
            />
          </div>
        </div>
      </Wrapper>
    );
  });

  return (
    <div className="w-full">
      {/* Список меню в стиле TailGrids Pro */}
      <ul className="space-y-0 bg-white dark:bg-dark-2 rounded-lg border border-stroke dark:border-dark-3 overflow-hidden">
        <SortableTree
          items={treeItems}
          onItemsChanged={handleItemsChanged}
          TreeItemComponent={TreeItemComponent}
          pointerSensorOptions={{
            activationConstraint: {
              distance: 5
            }
          }}
          indentationWidth={24}
        />
      </ul>
    </div>
  );
};

export default MenuDragDrop;