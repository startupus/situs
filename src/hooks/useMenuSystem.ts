import { useState, useEffect, useRef } from 'react';
import { MenuTypeData, MenuItemData } from '../types/menu';

/**
 * Хук для работы с универсальной системой меню
 * Предоставляет функции для загрузки, фильтрации и навигации по меню
 */
export const useMenuSystem = (projectId?: string) => {
  const [menuTypes, setMenuTypes] = useState<MenuTypeData[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Загрузка типов меню для проекта
  const loadMenuTypes = async () => {
    if (!projectId) return;

    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch(`/api/menu-types?projectId=${projectId}`);
      const data = await response.json();
      
      if (data.success) {
        setMenuTypes(data.data);
      } else {
        setError(data.error || 'Ошибка загрузки типов меню');
      }
    } catch (err) {
      setError('Ошибка сети при загрузке типов меню');
    } finally {
      setLoading(false);
    }
  };

  // Загрузка пунктов меню по типу
  const loadMenuItems = async (menuTypeId: string): Promise<MenuItemData[]> => {
    try {
      const response = await fetch(`/api/menu-items?menuTypeId=${menuTypeId}`);
      const data = await response.json();
      
      if (data.success) {
        return data.data;
      } else {
        throw new Error(data.error || 'Ошибка загрузки пунктов меню');
      }
    } catch (err) {
      throw new Error('Ошибка сети при загрузке пунктов меню');
    }
  };

  // Получение авторизованных пунктов меню (с учетом прав доступа)
  const getAuthorizedMenuItems = async (
    menuTypeId: string, 
    accessLevels: string[] = ['PUBLIC'],
    language: string = '*'
  ): Promise<MenuItemData[]> => {
    try {
      const levels = accessLevels.join(',');
      const params = new URLSearchParams({ menuTypeId, accessLevels: levels });
      if (language) params.set('language', language);
      const response = await fetch(
        `/api/menu-items/authorized?${params.toString()}`
      );
      const data = await response.json();
      
      if (data.success) {
        return data.data;
      } else {
        throw new Error(data.error || 'Ошибка загрузки авторизованных пунктов меню');
      }
    } catch (err) {
      throw new Error('Ошибка сети при загрузке авторизованных пунктов меню');
    }
  };

  // Получение lookup таблицы для роутинга
  const getMenuLookup = async (menuTypeId: string, language = '*') => {
    try {
      const response = await fetch(
        `/api/menu-items/lookup?menuTypeId=${menuTypeId}&language=${language}`
      );
      const data = await response.json();
      
      if (data.success) {
        return data.data;
      } else {
        throw new Error(data.error || 'Ошибка загрузки lookup таблицы');
      }
    } catch (err) {
      throw new Error('Ошибка сети при загрузке lookup таблицы');
    }
  };

  // Разрешение пункта меню в данные компонента
  const resolveMenuItem = async (menuItemId: string) => {
    try {
      const response = await fetch(`/api/menu-items/${menuItemId}/resolve`);
      const data = await response.json();
      
      if (data.success) {
        return data.data;
      } else {
        throw new Error(data.error || 'Ошибка разрешения пункта меню');
      }
    } catch (err) {
      throw new Error('Ошибка сети при разрешении пункта меню');
    }
  };

  // Получение активного пункта меню и хлебных крошек для текущего пути
  const getActiveMenuItem = async (menuTypeId: string, currentPath: string, language: string = '*') => {
    try {
      const response = await fetch(
        `/api/menu-items/active-by-path?menuTypeId=${menuTypeId}&path=${encodeURIComponent(currentPath)}&language=${language}`
      );
      const data = await response.json();
      
      if (data.success) {
        return data.data; // { activeItem, breadcrumbs }
      } else {
        throw new Error(data.error || 'Ошибка определения активного пункта меню');
      }
    } catch (err) {
      throw new Error('Ошибка сети при определении активного пункта меню');
    }
  };

  // Построение иерархического дерева меню из плоского списка
  const buildMenuTree = (items: MenuItemData[]): MenuItemData[] => {
    const itemsMap = new Map<string, MenuItemData>();
    const rootItems: MenuItemData[] = [];

    // Создаем карту всех пунктов
    items.forEach(item => {
      itemsMap.set(item.id, { ...item, children: [] });
    });

    // Строим дерево
    items.forEach(item => {
      const itemWithChildren = itemsMap.get(item.id)!;
      
      if (item.parentId) {
        const parent = itemsMap.get(item.parentId);
        if (parent) {
          parent.children = parent.children || [];
          parent.children.push(itemWithChildren);
        }
      } else {
        rootItems.push(itemWithChildren);
      }
    });

    // Сортируем на каждом уровне
    const sortItems = (items: MenuItemData[]) => {
      items.sort((a, b) => {
        if (a.orderIndex !== b.orderIndex) {
          return a.orderIndex - b.orderIndex;
        }
        return a.title.localeCompare(b.title);
      });
      
      items.forEach(item => {
        if (item.children && item.children.length > 0) {
          sortItems(item.children);
        }
      });
    };

    sortItems(rootItems);
    return rootItems;
  };

  // SSE подписка для real-time обновлений
  useEffect(() => {
    if (!projectId) return;

    const eventSource = new EventSource('/api/realtime/projects');
    
    eventSource.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        
        // Обрабатываем только события для нашего проекта
        if (data.payload?.projectId !== projectId) return;

        switch (data.type) {
          case 'menu_type_created':
          case 'menu_type_updated':
          case 'menu_type_deleted':
            // Перезагружаем типы меню
            loadMenuTypes();
            break;
            
          case 'menu_item_created':
          case 'menu_item_updated':
          case 'menu_item_deleted':
          case 'menu_items_reordered':
          case 'menu_structure_changed':
            // Уведомляем компоненты об изменениях пунктов меню
            // Конкретные компоненты должны подписаться на эти события
            console.log('[MENU_SSE]', data.type, data.payload);
            break;
        }
      } catch (err) {
        console.warn('Ошибка обработки SSE события меню:', err);
      }
    };

    eventSource.onerror = (error) => {
      console.warn('SSE подключение прервано:', error);
    };

    return () => {
      eventSource.close();
    };
  }, [projectId]);

  // Автоматическая загрузка при монтировании
  useEffect(() => {
    loadMenuTypes();
  }, [projectId]);

  return {
    menuTypes,
    loading,
    error,
    loadMenuTypes,
    loadMenuItems,
    getAuthorizedMenuItems,
    getMenuLookup,
    resolveMenuItem,
    getActiveMenuItem,
    buildMenuTree
  };
};

/**
 * Хук для рендеринга навигационного меню
 * Автоматически загружает и строит дерево меню для отображения
 */
export const useNavigationMenu = (
  projectId: string, 
  menuTypeName: string = 'main',
  accessLevels: string[] = ['PUBLIC'],
  language: string = '*'
) => {
  const [menuItems, setMenuItems] = useState<MenuItemData[]>([]);
  const [menuTree, setMenuTree] = useState<MenuItemData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { menuTypes, loadMenuTypes, getAuthorizedMenuItems, buildMenuTree } = useMenuSystem(projectId);

  useEffect(() => {
    const loadMenu = async () => {
      try {
        setLoading(true);
        setError(null);

        // Находим нужный тип меню
        const menuType = menuTypes.find(mt => mt.name === menuTypeName);
        if (!menuType) {
          if (menuTypes.length > 0) {
            setError(`Тип меню "${menuTypeName}" не найден`);
          }
          return;
        }

        // Загружаем авторизованные пункты
        const items = await getAuthorizedMenuItems(menuType.id, accessLevels, language);
        setMenuItems(items);

        // Строим дерево
        const tree = buildMenuTree(items);
        setMenuTree(tree);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Ошибка загрузки меню');
      } finally {
        setLoading(false);
      }
    };

    if (menuTypes.length > 0) {
      loadMenu();
    }
  }, [menuTypes, menuTypeName, accessLevels, language]);

  return {
    menuItems,
    menuTree,
    loading,
    error
  };
};
