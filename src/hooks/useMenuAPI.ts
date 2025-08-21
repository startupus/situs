import { MenuItemData, CreateMenuItemRequest, CreateMenuTypeRequest } from '../types/menu';

/**
 * Хук для всех API операций с меню
 * Централизует все запросы к бэкенду и обработку ошибок
 */
export const useMenuAPI = (projectId: string) => {
  // ==================== ПУНКТЫ МЕНЮ ====================

  /**
   * Создание пункта меню
   */
  const handleCreateMenuItem = async (data: CreateMenuItemRequest) => {
    try {
      const response = await fetch('/api/menu-items', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });

      const result = await response.json();
      if (!result.success) {
        throw new Error(result.error || 'Ошибка создания пункта меню');
      }

      return result.data;
    } catch (error) {
      console.error('Ошибка создания пункта меню:', error);
      throw error;
    }
  };

  /**
   * Обновление пункта меню
   */
  const handleUpdateMenuItem = async (id: string, updates: Partial<MenuItemData>) => {
    try {
      const response = await fetch(`/api/menu-items/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates)
      });

      const result = await response.json();
      if (!result.success) {
        throw new Error(result.error || 'Ошибка обновления пункта меню');
      }

      return result.data;
    } catch (error) {
      console.error('Ошибка обновления пункта меню:', error);
      throw error;
    }
  };

  /**
   * Удаление пункта меню
   */
  const handleDeleteMenuItem = async (itemId: string) => {
    try {
      const response = await fetch(`/api/menu-items/${itemId}`, {
        method: 'DELETE'
      });

      const result = await response.json();
      if (!result.success) {
        throw new Error(result.error || 'Ошибка удаления пункта меню');
      }

      return result.data;
    } catch (error) {
      console.error('Ошибка удаления пункта меню:', error);
      throw error;
    }
  };

  /**
   * Изменение порядка пунктов меню
   */
  const handleReorderItems = async (reorderedItems: MenuItemData[] | Array<{
    id: string;
    orderIndex: number;
    level: number;
    parentId: string | null;
  }>) => {
    try {
      // Преобразуем MenuItemData[] в нужный формат
      const itemsToSend = reorderedItems.map(item => ({
        id: item.id,
        orderIndex: item.orderIndex || 0,
        level: item.level || 1,
        parentId: item.parentId || null
      }));

      const response = await fetch('/api/menu-items/reorder', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ items: itemsToSend })
      });

      const result = await response.json();
      if (!result.success) {
        throw new Error(result.error || 'Ошибка изменения порядка');
      }

      return result.data;
    } catch (error) {
      console.error('Ошибка reorder:', error);
      throw error;
    }
  };

  // ==================== ТИПЫ МЕНЮ ====================

  /**
   * Создание типа меню
   */
  const handleCreateMenuType = async (data: CreateMenuTypeRequest) => {
    try {
      const response = await fetch('/api/menu-types', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });

      const result = await response.json();
      if (!result.success) {
        throw new Error(result.error || 'Ошибка создания типа меню');
      }

      return result.data;
    } catch (error) {
      console.error('Ошибка создания типа меню:', error);
      throw error;
    }
  };

  /**
   * Обновление типа меню
   */
  const handleUpdateMenuType = async (typeId: string, updates: { 
    title?: string; 
    name?: string; 
    description?: string; 
    isActive?: boolean 
  }) => {
    try {
      // Добавляем projectId к данным обновления
      const updateData = {
        ...updates,
        projectId
      };

      const response = await fetch(`/api/menu-types/${typeId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updateData)
      });

      const result = await response.json();
      if (!result.success) {
        throw new Error(result.error || 'Ошибка обновления типа меню');
      }

      return result.data;
    } catch (error) {
      console.error('Ошибка обновления типа меню:', error);
      throw error;
    }
  };

  /**
   * Удаление типа меню
   */
  const handleDeleteMenuType = async (typeId: string) => {
    try {
      const response = await fetch(`/api/menu-types/${typeId}`, {
        method: 'DELETE'
      });

      const result = await response.json();
      if (!result.success) {
        throw new Error(result.error || 'Ошибка удаления типа меню');
      }

      return result.data;
    } catch (error) {
      console.error('Ошибка удаления типа меню:', error);
      throw error;
    }
  };

  /**
   * Изменение статуса типа меню
   */
  const handleToggleMenuTypeStatus = async (typeId: string, isActive: boolean) => {
    try {
      const response = await fetch(`/api/menu-types/${typeId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isActive, projectId })
      });

      const result = await response.json();
      if (!result.success) {
        throw new Error(result.error || 'Ошибка изменения статуса типа меню');
      }

      return result.data;
    } catch (error) {
      console.error('Ошибка изменения статуса типа меню:', error);
      throw error;
    }
  };

  // ==================== ПАКЕТНЫЕ ОПЕРАЦИИ ====================

  /**
   * Пакетное изменение статуса типов меню
   */
  const handleBatchToggleMenuTypeStatus = async (typeIds: string[], isActive: boolean) => {
    try {
      // Выполняем запросы параллельно для всех выбранных типов
      const promises = typeIds.map(typeId => 
        fetch(`/api/menu-types/${typeId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ isActive, projectId })
        })
      );

      const responses = await Promise.all(promises);
      const results = await Promise.all(responses.map(r => r.json()));
      
      // Проверяем, что все запросы успешны
      const failedResults = results.filter(r => !r.success);
      if (failedResults.length > 0) {
        throw new Error(`Ошибка изменения статуса ${failedResults.length} типов меню`);
      }

      return results.map(r => r.data);
    } catch (error) {
      console.error('Ошибка пакетного изменения статуса типов меню:', error);
      throw error;
    }
  };

  /**
   * Пакетное удаление типов меню
   */
  const handleBatchDeleteMenuTypes = async (typeIds: string[]) => {
    try {
      // Выполняем запросы параллельно для всех выбранных типов
      const promises = typeIds.map(typeId => 
        fetch(`/api/menu-types/${typeId}`, {
          method: 'DELETE'
        })
      );

      const responses = await Promise.all(promises);
      const results = await Promise.all(responses.map(r => r.json()));
      
      // Проверяем, что все запросы успешны
      const failedResults = results.filter(r => !r.success);
      if (failedResults.length > 0) {
        throw new Error(`Ошибка удаления ${failedResults.length} типов меню`);
      }

      return results.map(r => r.data);
    } catch (error) {
      console.error('Ошибка пакетного удаления типов меню:', error);
      throw error;
    }
  };

  /**
   * Пакетное изменение статуса пунктов меню
   */
  const handleBatchToggleMenuItemStatus = async (itemIds: string[], isActive: boolean) => {
    try {
      // Выполняем запросы параллельно для всех выбранных пунктов
      const promises = itemIds.map(itemId => 
        fetch(`/api/menu-items/${itemId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ isPublished: isActive })
        })
      );

      const responses = await Promise.all(promises);
      const results = await Promise.all(responses.map(r => r.json()));
      
      // Проверяем, что все запросы успешны
      const failedResults = results.filter(r => !r.success);
      if (failedResults.length > 0) {
        throw new Error(`Ошибка изменения статуса ${failedResults.length} пунктов меню`);
      }

      return results.map(r => r.data);
    } catch (error) {
      console.error('Ошибка пакетного изменения статуса пунктов меню:', error);
      throw error;
    }
  };

  /**
   * Пакетное удаление пунктов меню
   */
  const handleBatchDeleteMenuItems = async (itemIds: string[]) => {
    try {
      // Выполняем запросы параллельно для всех выбранных пунктов
      const promises = itemIds.map(itemId => 
        fetch(`/api/menu-items/${itemId}`, {
          method: 'DELETE'
        })
      );

      const responses = await Promise.all(promises);
      const results = await Promise.all(responses.map(r => r.json()));
      
      // Проверяем, что все запросы успешны
      const failedResults = results.filter(r => !r.success);
      if (failedResults.length > 0) {
        throw new Error(`Ошибка удаления ${failedResults.length} пунктов меню`);
      }

      return results.map(r => r.data);
    } catch (error) {
      console.error('Ошибка пакетного удаления пунктов меню:', error);
      throw error;
    }
  };

  /**
   * Загрузка всех пунктов меню для подсчета
   */
  const loadAllMenuItems = async () => {
    try {
      const response = await fetch(`/api/menu-items?projectId=${projectId}`);
      const data = await response.json();
      
      if (!data.success) {
        throw new Error(data.error || 'Ошибка загрузки пунктов меню');
      }

      return data.data;
    } catch (error) {
      console.error('Ошибка загрузки всех пунктов меню:', error);
      throw error;
    }
  };

  return {
    // Пункты меню
    handleCreateMenuItem,
    handleUpdateMenuItem,
    handleDeleteMenuItem,
    handleReorderItems,
    
    // Типы меню
    handleCreateMenuType,
    handleUpdateMenuType,
    handleDeleteMenuType,
    handleToggleMenuTypeStatus,
    
    // Пакетные операции - типы меню
    handleBatchToggleMenuTypeStatus,
    handleBatchDeleteMenuTypes,
    
    // Пакетные операции - пункты меню
    handleBatchToggleMenuItemStatus,
    handleBatchDeleteMenuItems,
    
    // Утилиты
    loadAllMenuItems
  };
};
