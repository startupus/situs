import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { MenuTypeData, MenuItemData, CreateMenuItemRequest } from '../../types/menu';
import { useMenuSystemRealtime } from '../../hooks/useMenuSystemRealtime';
import MenuTypesSelector from './menu/MenuTypesSelector';
import MenuStatistics from './menu/MenuStatistics';
import MenuItemsList from './menu/MenuItemsList';
import MenuItemDragDrop from './menu/MenuItemDragDrop';
import MenuPreview from './menu/MenuPreview';
import CreateMenuItemModal from './menu/CreateMenuItemModal';
import EditMenuItemModal from './menu/EditMenuItemModal';

/**
 * Главный компонент управления меню проекта
 * Контейнер-оркестратор для всех компонентов системы меню
 */
const MenuManager: React.FC = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const [selectedMenuType, setSelectedMenuType] = useState<string>('');
  const [showCreateItemModal, setShowCreateItemModal] = useState(false);
  const [editingItem, setEditingItem] = useState<MenuItemData | null>(null);
  const [viewMode, setViewMode] = useState<'list' | 'dragdrop' | 'preview'>('list');

  // Используем real-time хук для автоматической синхронизации
  const { 
    menuTypes, 
    menuItems, 
    loading, 
    error, 
    lastUpdate,
    loadMenuTypes,
    loadMenuItems 
  } = useMenuSystemRealtime(projectId!, selectedMenuType);

  // Автоматический выбор главного меню при загрузке
  useEffect(() => {
    if (menuTypes.length > 0 && !selectedMenuType) {
      const mainMenu = menuTypes.find((mt: MenuTypeData) => mt.name === 'main');
      if (mainMenu) {
        setSelectedMenuType(mainMenu.id);
      }
    }
  }, [menuTypes, selectedMenuType]);



  // Создание пункта меню (SSE автоматически обновит список)
  const handleCreateMenuItem = async (data: CreateMenuItemRequest) => {
    try {
      const response = await fetch('http://localhost:3002/api/menu-items', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });

      const result = await response.json();
      if (result.success) {
        setShowCreateItemModal(false);
        // SSE событие автоматически обновит список пунктов меню
      } else {
        alert(result.error || 'Ошибка создания пункта меню');
      }
    } catch (err) {
      alert('Ошибка сети при создании пункта меню');
    }
  };

  // Изменение порядка пунктов меню
  const handleReorderItems = async (reorderedItems: Array<{
    id: string;
    orderIndex: number;
    level: number;
    parentId: string | null;
  }>) => {
    try {
      const response = await fetch('http://localhost:3002/api/menu-items/reorder', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ items: reorderedItems })
      });

      const result = await response.json();
      if (!result.success) {
        throw new Error(result.error || 'Ошибка изменения порядка');
      }

      // Данные обновятся автоматически через SSE
    } catch (error) {
      console.error('Ошибка reorder:', error);
      throw error;
    }
  };

  // Удаление пункта меню (SSE автоматически обновит список)
  const handleDeleteMenuItem = async (itemId: string) => {
    if (!confirm('Вы уверены, что хотите удалить этот пункт меню?')) return;

    try {
      const response = await fetch(`http://localhost:3002/api/menu-items/${itemId}`, {
        method: 'DELETE'
      });

      const result = await response.json();
      if (result.success) {
        // SSE событие автоматически обновит список пунктов меню
      } else {
        alert(result.error || 'Ошибка удаления пункта меню');
      }
    } catch (err) {
      alert('Ошибка сети при удалении пункта меню');
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
      {/* Заголовок */}
      <div className="mb-6">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-2xl font-bold text-dark dark:text-white mb-2">
              Управление меню
            </h1>
            <p className="text-body-color dark:text-dark-6">
              Универсальная система меню с иерархической структурой и привязкой к компонентам
            </p>
          </div>
          
          {/* Индикатор real-time статуса */}
          <div className="flex items-center gap-2 text-sm">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-body-color dark:text-dark-6">
              Синхронизация
            </span>
            <span className="text-xs text-gray-500 dark:text-gray-400">
              {lastUpdate.toLocaleTimeString()}
            </span>
          </div>
        </div>
      </div>

      {/* Переключатель типов меню */}
      <MenuTypesSelector
        projectId={projectId!}
        menuTypes={menuTypes}
        selectedMenuType={selectedMenuType}
        onMenuTypeChange={setSelectedMenuType}
        onMenuTypesUpdate={loadMenuTypes} // SSE обновит автоматически
      />

      {/* Статистика меню */}
      {selectedMenuType && menuItems.length > 0 && (
        <MenuStatistics menuItems={menuItems} className="mb-6" />
      )}

      {/* Переключатель режимов */}
      {selectedMenuType && (
        <div className="mb-6">
          <div className="flex items-center gap-2 bg-white dark:bg-dark-2 rounded-lg p-1 border border-stroke dark:border-dark-3 w-fit">
            <button
              onClick={() => setViewMode('list')}
              className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                viewMode === 'list' 
                  ? 'bg-primary text-white' 
                  : 'text-body-color dark:text-dark-6 hover:text-dark dark:hover:text-white'
              }`}
            >
              📋 Список
            </button>
            <button
              onClick={() => setViewMode('dragdrop')}
              className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                viewMode === 'dragdrop' 
                  ? 'bg-primary text-white' 
                  : 'text-body-color dark:text-dark-6 hover:text-dark dark:hover:text-white'
              }`}
            >
              🖱️ Перетаскивание
            </button>
            <button
              onClick={() => setViewMode('preview')}
              className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                viewMode === 'preview' 
                  ? 'bg-primary text-white' 
                  : 'text-body-color dark:text-dark-6 hover:text-dark dark:hover:text-white'
              }`}
            >
              👁️ Предпросмотр
            </button>
          </div>
        </div>
      )}

      {/* Список пунктов меню */}
      {selectedMenuType && viewMode === 'list' && (
        <MenuItemsList
          menuItems={menuItems}
          onEditItem={setEditingItem}
          onDeleteItem={handleDeleteMenuItem}
          onCreateItem={() => setShowCreateItemModal(true)}
        />
      )}

      {/* Drag & Drop режим */}
      {selectedMenuType && viewMode === 'dragdrop' && (
        <MenuItemDragDrop 
          items={menuItems}
          onReorder={handleReorderItems}
        />
      )}

      {/* Предпросмотр меню */}
      {selectedMenuType && viewMode === 'preview' && (
        <MenuPreview 
          projectId={projectId!}
          selectedMenuType={selectedMenuType}
          menuItems={menuItems}
        />
      )}

      {/* Модальное окно создания пункта меню */}
      {showCreateItemModal && (
        <CreateMenuItemModal
          menuTypeId={selectedMenuType}
          parentItems={menuItems.filter(item => item.level < 3)} // Максимум 3 уровня
          onClose={() => setShowCreateItemModal(false)}
          onCreate={handleCreateMenuItem}
        />
      )}

      {/* Модальное окно редактирования пункта меню */}
      {editingItem && (
        <EditMenuItemModal
          item={editingItem}
          onClose={() => setEditingItem(null)}
          onUpdate={(updatedItem) => {
            // Обновляем локальный стейт
            setMenuItems(items => 
              items.map(item => item.id === updatedItem.id ? updatedItem : item)
            );
            setEditingItem(null);
          }}
        />
      )}
    </div>
  );
};



export default MenuManager;
