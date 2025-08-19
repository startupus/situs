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


      {/* Переключатель вкладок и вида */}
      {menuState.selectedMenuType && (
        <div className="mb-6">
          <div className="flex items-center justify-between">
            {/* Вкладки */}
            <div className="flex items-center gap-2 bg-white dark:bg-dark-2 rounded-lg p-1 border border-stroke dark:border-dark-3 w-fit">
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

            {/* Переключатель вида (только для вкладки "Пункты меню") */}
            {menuState.activeTab === 'items' && (
              <div className="inline-flex rounded-md border border-stroke dark:border-dark-3 overflow-hidden">
                <button
                  onClick={() => menuState.setDisplayStyle('tree')}
                  className={`p-2 ${menuState.displayStyle === 'tree' ? 'bg-primary text-white' : 'text-body-color dark:text-dark-6 hover:bg-gray-2 dark:hover:bg-dark-3'}`}
                  title="Дерево"
                >
                  <FiGrid size={16} />
                </button>
                <button
                  onClick={() => menuState.setDisplayStyle('list')}
                  className={`p-2 ${menuState.displayStyle === 'list' ? 'bg-primary text-white' : 'text-body-color dark:text-dark-6 hover:bg-gray-2 dark:hover:bg-dark-3'}`}
                  title="Список"
                >
                  <FiList size={16} />
                </button>
              </div>
            )}
          </div>
        </div>
      )}

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
