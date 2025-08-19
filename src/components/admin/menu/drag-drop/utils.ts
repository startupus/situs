import { MenuItemData } from '../../../../types/menu';

/**
 * Утилиты для работы с иерархией меню
 */

/**
 * Строит иерархическую структуру из плоского списка пунктов меню
 */
export const buildMenuHierarchy = (flatItems: MenuItemData[]): MenuItemData[] => {
  // Создаем карту для быстрого поиска элементов по ID
  const itemsMap = new Map<string, MenuItemData>();
  
  // Инициализируем все элементы с пустым массивом children
  flatItems.forEach(item => {
    itemsMap.set(item.id, { ...item, children: [] });
  });

  const rootItems: MenuItemData[] = [];

  // Строим иерархию
  flatItems.forEach(item => {
    const currentItem = itemsMap.get(item.id)!;
    
    if (!item.parentId) {
      // Корневой элемент
      rootItems.push(currentItem);
    } else {
      // Дочерний элемент - добавляем к родителю
      const parent = itemsMap.get(item.parentId);
      if (parent) {
        if (!parent.children) {
          parent.children = [];
        }
        parent.children.push(currentItem);
      } else {
        // Если родитель не найден, считаем элемент корневым
        console.warn(`Parent with ID ${item.parentId} not found for item ${item.id}. Treating as root item.`);
        rootItems.push(currentItem);
      }
    }
  });

  // Сортируем элементы по orderIndex на каждом уровне
  const sortByOrderIndex = (items: MenuItemData[]) => {
    items.sort((a, b) => (a.orderIndex || 0) - (b.orderIndex || 0));
    items.forEach(item => {
      if (item.children && item.children.length > 0) {
        sortByOrderIndex(item.children);
      }
    });
  };

  sortByOrderIndex(rootItems);
  
  return rootItems;
};

/**
 * Преобразует иерархическую структуру обратно в плоский список
 */
export const flattenMenuHierarchy = (hierarchicalItems: MenuItemData[]): MenuItemData[] => {
  const result: MenuItemData[] = [];

  const traverse = (items: MenuItemData[], parentId: string | null = null, level: number = 1) => {
    items.forEach((item, index) => {
      const flatItem: MenuItemData = {
        ...item,
        parentId,
        level,
        orderIndex: index,
        children: [] // Убираем children из плоского списка
      };
      
      result.push(flatItem);

      // Рекурсивно обрабатываем дочерние элементы
      if (item.children && item.children.length > 0) {
        traverse(item.children, item.id, level + 1);
      }
    });
  };

  traverse(hierarchicalItems);
  return result;
};

/**
 * Проверяет корректность иерархии меню
 */
export const validateMenuHierarchy = (items: MenuItemData[]): { isValid: boolean; errors: string[] } => {
  const errors: string[] = [];
  const itemIds = new Set(items.map(item => item.id));

  items.forEach(item => {
    // Проверяем, что parentId существует (если указан)
    if (item.parentId && !itemIds.has(item.parentId)) {
      errors.push(`Item "${item.title}" (${item.id}) has invalid parentId: ${item.parentId}`);
    }

    // Проверяем корректность level
    if (item.parentId) {
      const parent = items.find(p => p.id === item.parentId);
      if (parent && item.level !== parent.level + 1) {
        errors.push(`Item "${item.title}" (${item.id}) has incorrect level ${item.level}, should be ${parent.level + 1}`);
      }
    } else if (item.level !== 1) {
      errors.push(`Root item "${item.title}" (${item.id}) should have level 1, but has level ${item.level}`);
    }
  });

  return {
    isValid: errors.length === 0,
    errors
  };
};
