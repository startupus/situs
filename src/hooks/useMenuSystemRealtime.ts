import { useState, useEffect, useCallback } from 'react';
import { MenuTypeData, MenuItemData } from '../types/menu';

/**
 * Расширенный хук для работы с системой меню с real-time обновлениями
 * Автоматически синхронизирует изменения через SSE события
 */
export const useMenuSystemRealtime = (projectId: string, selectedMenuTypeId?: string) => {
  const [menuTypes, setMenuTypes] = useState<MenuTypeData[]>([]);
  const [menuItems, setMenuItems] = useState<MenuItemData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());

  // Загрузка типов меню
  const loadMenuTypes = useCallback(async () => {
    if (!projectId) return;
    
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch(`http://localhost:3002/api/menu-types?projectId=${projectId}`);
      const data = await response.json();
      
      if (data.success) {
        setMenuTypes(data.data);
        setLastUpdate(new Date());
      } else {
        setError(data.error || 'Ошибка загрузки типов меню');
      }
    } catch (err) {
      setError('Ошибка сети при загрузке типов меню');
    } finally {
      setLoading(false);
    }
  }, [projectId]);

  // Загрузка пунктов меню
  const loadMenuItems = useCallback(async (menuTypeId: string) => {
    if (!menuTypeId) return;
    
    try {
      const response = await fetch(`http://localhost:3002/api/menu-items?menuTypeId=${menuTypeId}`);
      const data = await response.json();
      
      if (data.success) {
        setMenuItems(data.data);
        setLastUpdate(new Date());
      } else {
        setError('Ошибка загрузки пунктов меню');
      }
    } catch (err) {
      setError('Ошибка сети при загрузки пунктов меню');
    }
  }, []);

  // SSE подписка для real-time синхронизации
  useEffect(() => {
    if (!projectId) return;

    console.log('[MENU_RT] Подключение к SSE для проекта:', projectId);
    const eventSource = new EventSource('/api/projects/events');
    
    eventSource.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        
        // Фильтруем события только для нашего проекта
        if (data.payload?.projectId !== projectId) return;

        console.log('[MENU_RT] Получено событие:', data.type, data.payload);

        switch (data.type) {
          case 'menu_type_created':
            // Добавляем новый тип меню
            setMenuTypes(prev => [...prev, data.payload.menuType]);
            setLastUpdate(new Date());
            break;
            
          case 'menu_type_updated':
            // Обновляем существующий тип меню
            setMenuTypes(prev => 
              prev.map(mt => 
                mt.id === data.payload.menuType.id 
                  ? { ...mt, ...data.payload.menuType }
                  : mt
              )
            );
            setLastUpdate(new Date());
            break;
            
          case 'menu_type_deleted':
            // Удаляем тип меню
            setMenuTypes(prev => prev.filter(mt => mt.id !== data.payload.menuTypeId));
            setLastUpdate(new Date());
            break;
            
          case 'menu_item_created':
            // Добавляем новый пункт меню (только если это текущий тип)
            if (data.payload.menuItem.menuTypeId === selectedMenuTypeId) {
              setMenuItems(prev => [...prev, data.payload.menuItem]);
              setLastUpdate(new Date());
            }
            break;
            
          case 'menu_item_updated':
            // Обновляем пункт меню
            if (data.payload.menuItem.menuTypeId === selectedMenuTypeId) {
              setMenuItems(prev => 
                prev.map(item => 
                  item.id === data.payload.menuItem.id 
                    ? { ...item, ...data.payload.menuItem }
                    : item
                )
              );
              setLastUpdate(new Date());
            }
            break;
            
          case 'menu_item_deleted':
            // Удаляем пункт меню
            if (data.payload.menuTypeId === selectedMenuTypeId) {
              setMenuItems(prev => prev.filter(item => item.id !== data.payload.menuItemId));
              setLastUpdate(new Date());
            }
            break;
            
          case 'menu_items_reordered':
            // Обновляем порядок пунктов меню
            if (data.payload.menuTypeId === selectedMenuTypeId) {
              loadMenuItems(selectedMenuTypeId); // Полная перезагрузка для правильного порядка
            }
            break;
            
          case 'menu_structure_changed':
            // Изменилась структура меню
            if (data.payload.menuTypeId === selectedMenuTypeId) {
              loadMenuItems(selectedMenuTypeId); // Полная перезагрузка
            }
            break;
        }
      } catch (err) {
        console.warn('Ошибка обработки SSE события меню:', err);
      }
    };

    eventSource.onopen = () => {
      console.log('[MENU_RT] SSE подключение установлено');
    };

    eventSource.onerror = (error) => {
      console.warn('[MENU_RT] SSE ошибка:', error);
    };

    return () => {
      console.log('[MENU_RT] Закрытие SSE подключения');
      eventSource.close();
    };
  }, [projectId, selectedMenuTypeId, loadMenuItems]);

  // Загрузка типов меню при монтировании
  useEffect(() => {
    loadMenuTypes();
  }, [loadMenuTypes]);

  // Загрузка пунктов меню при смене типа
  useEffect(() => {
    if (selectedMenuTypeId) {
      loadMenuItems(selectedMenuTypeId);
    } else {
      setMenuItems([]);
    }
  }, [selectedMenuTypeId, loadMenuItems]);

  return {
    menuTypes,
    menuItems,
    loading,
    error,
    lastUpdate,
    loadMenuTypes,
    loadMenuItems
  };
};
