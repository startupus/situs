import React from 'react';
import { MenuItemData, MenuTypeData, CreateMenuItemRequest, CreateMenuTypeRequest } from '../../../types/menu';
import CreateMenuItemModal from './CreateMenuItemModal';
import EditMenuItemModal from './EditMenuItemModal';
import { CreateMenuTypeModal } from './MenuTypesSelector';
import EditMenuTypeModal from './EditMenuTypeModal';

interface MenuManagerModalsProps {
  // Состояния модальных окон
  showCreateItemModal: boolean;
  showCreateTypeModal: boolean;
  editingItem: MenuItemData | null;
  editingMenuType: MenuTypeData | null;
  deletingMenuType: MenuTypeData | null;
  
  // Данные
  selectedMenuType: string;
  menuItems: MenuItemData[];
  allMenuItems: MenuItemData[];
  projectId: string;
  
  // Обработчики
  onCloseCreateItem: () => void;
  onCloseCreateType: () => void;
  onCloseEditItem: () => void;
  onCloseEditType: () => void;
  onCloseDeleteType: () => void;
  onCreateMenuItem: (data: CreateMenuItemRequest) => Promise<void>;
  onCreateMenuType: (data: CreateMenuTypeRequest) => Promise<void>;
  onUpdateMenuItem: (id: string, updates: Partial<MenuItemData>) => Promise<void>;
  onUpdateMenuType: (typeId: string, updates: { title?: string; name?: string; description?: string; isActive?: boolean }) => Promise<void>;
  onDeleteMenuType: (typeId: string) => Promise<void>;
}

const MenuManagerModals: React.FC<MenuManagerModalsProps> = ({
  showCreateItemModal,
  showCreateTypeModal,
  editingItem,
  editingMenuType,
  deletingMenuType,
  selectedMenuType,
  menuItems,
  allMenuItems,
  projectId,
  onCloseCreateItem,
  onCloseCreateType,
  onCloseEditItem,
  onCloseEditType,
  onCloseDeleteType,
  onCreateMenuItem,
  onCreateMenuType,
  onUpdateMenuItem,
  onUpdateMenuType,
  onDeleteMenuType
}) => {
  return (
    <>
      {/* Модальное окно создания пункта меню */}
      {showCreateItemModal && (
        <CreateMenuItemModal
          menuTypeId={selectedMenuType}
          parentItems={menuItems.filter(item => item.level < 3)} // Максимум 3 уровня
          onClose={onCloseCreateItem}
          onCreate={onCreateMenuItem}
        />
      )}

      {/* Модальное окно редактирования пункта меню */}
      {editingItem && (
        <EditMenuItemModal
          item={editingItem}
          onClose={onCloseEditItem}
          onUpdate={(updatedItem) => {
            // Обновляем через API, SSE автоматически обновит данные
            onUpdateMenuItem(updatedItem.id, updatedItem);
            onCloseEditItem();
          }}
        />
      )}

      {/* Модальное окно создания типа меню */}
      {showCreateTypeModal && (
        <CreateMenuTypeModal
          projectId={projectId}
          onClose={onCloseCreateType}
          onCreate={onCreateMenuType}
        />
      )}

      {/* Модальное окно редактирования типа меню */}
      {editingMenuType && (
        <EditMenuTypeModal
          menuType={editingMenuType}
          onClose={onCloseEditType}
          onUpdate={onUpdateMenuType}
        />
      )}

      {/* Модальное окно подтверждения удаления типа меню */}
      {deletingMenuType && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white dark:bg-dark-2 rounded-lg border border-stroke dark:border-dark-3 p-6 w-full max-w-md">
            <h3 className="text-lg font-medium text-dark dark:text-white mb-4">Удалить тип меню</h3>
            <p className="text-body-color dark:text-dark-6 mb-4">
              Вы уверены, что хотите удалить тип меню "<strong>{deletingMenuType.title}</strong>"?
            </p>
            <p className="text-sm text-red-500 mb-4">
              Внимание: Все пункты меню этого типа ({allMenuItems.filter(item => item.menuTypeId === deletingMenuType.id).length} шт.) также будут удалены!
            </p>
            <div className="flex justify-end gap-2">
              <button
                onClick={onCloseDeleteType}
                className="px-4 py-2 text-sm text-body-color dark:text-dark-6 hover:text-dark dark:hover:text-white border border-stroke dark:border-dark-3 rounded-lg"
              >
                Отмена
              </button>
              <button
                onClick={async () => {
                  await onDeleteMenuType(deletingMenuType.id);
                  onCloseDeleteType();
                }}
                className="px-4 py-2 text-sm bg-red-500 text-white rounded-lg hover:bg-red-600"
              >
                Удалить
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default MenuManagerModals;
