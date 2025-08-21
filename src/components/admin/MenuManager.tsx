import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { MenuItemData, CreateMenuItemRequest, CreateMenuTypeRequest } from '../../types/menu';
import { useMenuSystemRealtime } from '../../hooks/useMenuSystemRealtime';
import { useMenuAPI } from '../../hooks/useMenuAPI';
import { useMenuManagerState } from '../../hooks/useMenuManagerState';
import { FiList, FiGrid } from 'react-icons/fi';
import MenuTypesTab from './menu/MenuTypesTab';
import MenuItemsTab from './menu/MenuItemsTab';
import MenuManagerModals from './menu/MenuManagerModals';

/**
 * Главный компонент управления меню проекта
 * Контейнер-оркестратор для всех компонентов системы меню
 */
const MenuManager: React.FC = () => {
  const { projectId } = useParams<{ projectId: string }>();
  
  // Используем новые хуки для разделения логики
  const menuState = useMenuManagerState();
  const menuAPI = useMenuAPI(projectId!);
  
  // Используем real-time хук для автоматической синхронизации
  const { 
    menuTypes, 
    menuItems, 
    loading, 
    error, 
    lastUpdate,
    loadMenuTypes,
    loadMenuItems 
  } = useMenuSystemRealtime(projectId!, menuState.selectedMenuType);

  // Автоматический выбор главного меню при загрузке
  useEffect(() => {
    menuState.autoSelectMainMenu(menuTypes);
  }, [menuTypes, menuState]);

  // Загрузка всех пунктов при загрузке типов меню
  useEffect(() => {
    if (menuTypes.length > 0) {
      menuAPI.loadAllMenuItems()
        .then(items => menuState.setAllMenuItems(items))
        .catch(error => console.error('Ошибка загрузки всех пунктов меню:', error));
    }
  }, [menuTypes, menuAPI, menuState]);

  // ==================== ОБРАБОТЧИКИ API С ИНТЕГРАЦИЕЙ SSE ====================

  // Создание пункта меню
  const handleCreateMenuItem = async (data: CreateMenuItemRequest) => {
    try {
      await menuAPI.handleCreateMenuItem(data);
      menuState.closeCreateItemModal();
      // SSE событие автоматически обновит список пунктов меню
    } catch (error) {
      alert(error instanceof Error ? error.message : 'Ошибка создания пункта меню');
    }
  };

  // Обновление пункта меню
  const handleUpdateMenuItem = async (id: string, updates: Partial<MenuItemData>) => {
    try {
      await menuAPI.handleUpdateMenuItem(id, updates);
      // SSE событие автоматически обновит список пунктов меню
    } catch (error) {
      alert(error instanceof Error ? error.message : 'Ошибка обновления пункта меню');
    }
  };

  // Удаление пункта меню
  const handleDeleteMenuItem = async (itemId: string) => {
    if (!confirm('Вы уверены, что хотите удалить этот пункт меню?')) return;

    try {
      await menuAPI.handleDeleteMenuItem(itemId);
      // SSE событие автоматически обновит список пунктов меню
    } catch (error) {
      alert(error instanceof Error ? error.message : 'Ошибка удаления пункта меню');
    }
  };

  // Изменение статуса пункта меню
  const handleToggleMenuItemStatus = async (itemId: string, isActive: boolean) => {
    try {
      await menuAPI.handleUpdateMenuItem(itemId, { isPublished: isActive });
      // SSE событие автоматически обновит список пунктов меню
    } catch (error) {
      alert(error instanceof Error ? error.message : 'Ошибка изменения статуса пункта меню');
    }
  };

  // Изменение порядка пунктов меню
  const handleReorderItems = async (reorderedItems: MenuItemData[] | Array<{
    id: string;
    orderIndex: number;
    level: number;
    parentId: string | null;
  }>) => {
    try {
      await menuAPI.handleReorderItems(reorderedItems);
      // SSE событие автоматически обновит список пунктов меню
    } catch (error) {
      console.error('Ошибка reorder:', error);
      throw error;
    }
  };

  // Создание типа меню
  const handleCreateMenuType = async (data: CreateMenuTypeRequest) => {
    try {
      const newType = await menuAPI.handleCreateMenuType(data);
      loadMenuTypes();
      menuState.setSelectedMenuType(newType.id); // Переключаемся на новый тип
      menuState.closeCreateTypeModal();
      // SSE событие автоматически обновит список типов меню
    } catch (error) {
      alert(error instanceof Error ? error.message : 'Ошибка создания типа меню');
    }
  };

  // Изменение статуса типа меню
  const handleToggleMenuTypeStatus = async (typeId: string, isActive: boolean) => {
    try {
      await menuAPI.handleToggleMenuTypeStatus(typeId, isActive);
      loadMenuTypes();
      // SSE событие автоматически обновит список типов меню
    } catch (error) {
      alert(error instanceof Error ? error.message : 'Ошибка изменения статуса типа меню');
    }
  };

  // Обновление типа меню
  const handleUpdateMenuType = async (typeId: string, updates: { 
    title?: string; 
    name?: string; 
    description?: string; 
    isActive?: boolean 
  }) => {
    try {
      await menuAPI.handleUpdateMenuType(typeId, updates);
      loadMenuTypes();
      // SSE событие автоматически обновит список типов меню
    } catch (error) {
      alert(error instanceof Error ? error.message : 'Ошибка обновления типа меню');
    }
  };

  // Удаление типа меню
  const handleDeleteMenuType = async (typeId: string) => {
    try {
      await menuAPI.handleDeleteMenuType(typeId);
      loadMenuTypes();
      // SSE событие автоматически обновит список типов меню
    } catch (error) {
      alert(error instanceof Error ? error.message : 'Ошибка удаления типа меню');
    }
  };

  // Пакетное изменение статуса типов меню
  const handleBatchToggleMenuTypeStatus = async (typeIds: string[], isActive: boolean) => {
    try {
      await menuAPI.handleBatchToggleMenuTypeStatus(typeIds, isActive);
      loadMenuTypes();
      // SSE событие автоматически обновит список типов меню
    } catch (error) {
      alert(error instanceof Error ? error.message : 'Ошибка пакетного изменения статуса типов меню');
    }
  };

  // Пакетное удаление типов меню
  const handleBatchDeleteMenuTypes = async (typeIds: string[]) => {
    try {
      await menuAPI.handleBatchDeleteMenuTypes(typeIds);
      loadMenuTypes();
      // SSE событие автоматически обновит список типов меню
    } catch (error) {
      alert(error instanceof Error ? error.message : 'Ошибка пакетного удаления типов меню');
    }
  };

  // Пакетное изменение статуса пунктов меню
  const handleBatchToggleMenuItemStatus = async (itemIds: string[], isActive: boolean) => {
    try {
      await menuAPI.handleBatchToggleMenuItemStatus(itemIds, isActive);
      // SSE событие автоматически обновит список пунктов меню
    } catch (error) {
      alert(error instanceof Error ? error.message : 'Ошибка пакетного изменения статуса пунктов меню');
    }
  };

  // Пакетное удаление пунктов меню
  const handleBatchDeleteMenuItems = async (itemIds: string[]) => {
    try {
      await menuAPI.handleBatchDeleteMenuItems(itemIds);
      // SSE событие автоматически обновит список пунктов меню
    } catch (error) {
      alert(error instanceof Error ? error.message : 'Ошибка пакетного удаления пунктов меню');
    }
  };



  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2"></div>
          <p className="text-body-color dark:text-dark-6">Загрузка меню...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
        <h3 className="text-lg font-medium text-red-800 dark:text-red-200 mb-2">Ошибка</h3>
        <p className="text-red-600 dark:text-red-400">{error}</p>
      </div>
    );
  }

  return (
    <div className="p-6" data-testid="menu-manager">


      {/* Переключатель вкладок с селектором типа меню */}
      <div className="mb-6">
        <div className="flex items-center justify-between">
          {/* Вкладки */}
          <div className="flex items-center gap-2 bg-white dark:bg-dark-2 rounded-lg p-1 border border-stroke dark:border-dark-3 w-fit" data-testid="menu-mode-tabs">
            <button
              onClick={() => menuState.setActiveTab('items')}
              className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                menuState.activeTab === 'items' 
                  ? 'bg-primary text-white' 
                  : 'text-body-color dark:text-dark-6 hover:text-dark dark:hover:text-white'
              }`}
            >
              <FiList size={16} />
              Пункты меню
            </button>

            <button
              onClick={() => menuState.setActiveTab('types')}
              className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                menuState.activeTab === 'types' 
                  ? 'bg-primary text-white' 
                  : 'text-body-color dark:text-dark-6 hover:text-dark dark:hover:text-white'
              }`}
            >
              <FiGrid size={16} />
              Типы меню
            </button>
          </div>

          {/* Селектор типа меню (без заголовка, только на вкладке "Пункты меню") */}
          {menuTypes.length > 0 && menuState.activeTab === 'items' && (
            <div className="relative max-w-xs">
              <select
                data-testid="menu-type-select"
                value={menuState.selectedMenuType}
                onChange={(e) => {
                  if (e.target.value === '__create_new__') {
                    menuState.openCreateTypeModal();
                  } else {
                    menuState.setSelectedMenuType(e.target.value);
                  }
                }}
                className="w-full appearance-none rounded-lg border border-stroke bg-transparent py-3 pl-5 pr-12 text-dark outline-hidden focus:border-primary dark:border-dark-3 dark:text-white"
              >
                <option value="">Выберите тип меню</option>
                {menuTypes.map((menuType) => (
                  <option key={menuType.id} value={menuType.id}>
                    {menuType.title} ({menuType.name})
                  </option>
                ))}
                <option value="__create_new__">+ Создать новый тип</option>
              </select>
              <span className="pointer-events-none absolute right-0 top-0 flex h-full w-12 items-center justify-center text-dark-5">
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 16 16"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M2.29645 5.15354L2.29642 5.15357L2.30065 5.1577L7.65065 10.3827L8.00167 10.7255L8.35105 10.381L13.7011 5.10603L13.7011 5.10604L13.7036 5.10354C13.7221 5.08499 13.7386 5.08124 13.75 5.08124C13.7614 5.08124 13.7779 5.08499 13.7964 5.10354C13.815 5.12209 13.8188 5.13859 13.8188 5.14999C13.8188 5.1612 13.8151 5.17734 13.7974 5.19552L8.04956 10.8433L8.04955 10.8433L8.04645 10.8464C8.01604 10.8768 7.99596 10.8921 7.98519 10.8992C7.97756 10.8983 7.97267 10.8968 7.96862 10.8952C7.96236 10.8929 7.94954 10.887 7.92882 10.8721L2.20263 5.2455C2.18488 5.22733 2.18125 5.2112 2.18125 5.19999C2.18125 5.18859 2.18501 5.17209 2.20355 5.15354C2.2221 5.13499 2.2386 5.13124 2.25 5.13124C2.2614 5.13124 2.2779 5.13499 2.29645 5.15354Z"
                    fill="currentColor"
                    stroke="currentColor"
                  />
                </svg>
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Вкладка: Пункты меню */}
      {menuState.activeTab === 'items' && (
        <MenuItemsTab
          menuItems={menuItems}
          menuTypes={menuTypes}
          selectedMenuType={menuState.selectedMenuType}
          displayStyle={menuState.displayStyle}
          projectId={projectId!}
          onEditItem={menuState.openEditItemModal}
          onDeleteItem={handleDeleteMenuItem}
          onCreateItem={menuState.openCreateItemModal}
          onReorderItems={handleReorderItems}
          onUpdateMenuItem={handleUpdateMenuItem}
          onToggleItemStatus={handleToggleMenuItemStatus}
          onBatchToggleStatus={handleBatchToggleMenuItemStatus}
          onBatchDelete={handleBatchDeleteMenuItems}
          onMenuTypeChange={menuState.setSelectedMenuType}
          onMenuTypesUpdate={loadMenuTypes}
          onDisplayStyleChange={menuState.setDisplayStyle}
        />
      )}

      {/* Вкладка: Типы меню */}
      {menuState.activeTab === 'types' && (
        <MenuTypesTab
          menuTypes={menuTypes}
          allMenuItems={menuState.allMenuItems}
          onToggleStatus={handleToggleMenuTypeStatus}
          onEditType={menuState.openEditTypeModal}
          onDeleteType={menuState.openDeleteTypeModal}
          onSelectMenuType={menuState.setSelectedMenuType}
          onSetActiveTab={menuState.setActiveTab}
          onBatchToggleStatus={handleBatchToggleMenuTypeStatus}
          onBatchDelete={handleBatchDeleteMenuTypes}
        />
      )}

      {/* Модальные окна */}
      <MenuManagerModals
        showCreateItemModal={menuState.showCreateItemModal}
        showCreateTypeModal={menuState.showCreateTypeModal}
        editingItem={menuState.editingItem}
        editingMenuType={menuState.editingMenuType}
        deletingMenuType={menuState.deletingMenuType}
        selectedMenuType={menuState.selectedMenuType}
        menuItems={menuItems}
        allMenuItems={menuState.allMenuItems}
        projectId={projectId!}
        onCloseCreateItem={menuState.closeCreateItemModal}
        onCloseCreateType={menuState.closeCreateTypeModal}
        onCloseEditItem={menuState.closeEditItemModal}
        onCloseEditType={menuState.closeEditTypeModal}
        onCloseDeleteType={menuState.closeDeleteTypeModal}
        onCreateMenuItem={handleCreateMenuItem}
        onCreateMenuType={handleCreateMenuType}
        onUpdateMenuItem={handleUpdateMenuItem}
        onUpdateMenuType={handleUpdateMenuType}
        onDeleteMenuType={handleDeleteMenuType}
      />
    </div>
  );
};



export default MenuManager;
