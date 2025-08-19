import React, { useState } from 'react';
import { FiPlus, FiEdit, FiTrash2 } from 'react-icons/fi';
import { MenuTypeData } from '../../../types/menu';
import ToggleSwitch from '../../ui/ToggleSwitch';
import BatchActions from '../../ui/BatchActions';

interface MenuTypesTabProps {
  menuTypes: MenuTypeData[];
  allMenuItems: any[];
  onToggleStatus: (typeId: string, isActive: boolean) => Promise<void>;
  onEditType: (type: MenuTypeData) => void;
  onDeleteType: (type: MenuTypeData) => void;
  onSelectMenuType: (typeId: string) => void;
  onSetActiveTab: (tab: 'items' | 'types') => void;
  onBatchToggleStatus: (typeIds: string[], isActive: boolean) => Promise<void>;
  onBatchDelete: (typeIds: string[]) => Promise<void>;
}

const MenuTypesTab: React.FC<MenuTypesTabProps> = ({
  menuTypes,
  allMenuItems,
  onToggleStatus,
  onEditType,
  onDeleteType,
  onSelectMenuType,
  onSetActiveTab,
  onBatchToggleStatus,
  onBatchDelete
}) => {
  // Состояние для пакетной обработки
  const [selectedMenuTypes, setSelectedMenuTypes] = useState<string[]>([]);

  // Функции для пакетной обработки
  const handleSelectMenuType = (typeId: string, selected: boolean) => {
    if (selected) {
      setSelectedMenuTypes(prev => [...prev, typeId]);
    } else {
      setSelectedMenuTypes(prev => prev.filter(id => id !== typeId));
    }
  };

  const handleSelectAllMenuTypes = (selected: boolean) => {
    if (selected) {
      setSelectedMenuTypes(menuTypes.map(type => type.id));
    } else {
      setSelectedMenuTypes([]);
    }
  };

  const handleClearMenuTypesSelection = () => {
    setSelectedMenuTypes([]);
  };

  const menuTypesBatchActions = [
    {
      id: 'activate',
      label: 'Активировать',
      variant: 'success' as const
    },
    {
      id: 'deactivate',
      label: 'Деактивировать',
      variant: 'default' as const
    },
    {
      id: 'delete',
      label: 'Удалить',
      variant: 'danger' as const
    }
  ];

  const handleMenuTypesBatchAction = async (actionId: string, typeIds: string[]) => {
    try {
      switch (actionId) {
        case 'activate':
          await onBatchToggleStatus(typeIds, true);
          break;
        case 'deactivate':
          await onBatchToggleStatus(typeIds, false);
          break;
        case 'delete':
          if (confirm(`Вы уверены, что хотите удалить ${typeIds.length} типов меню?`)) {
            await onBatchDelete(typeIds);
          }
          break;
      }
      // Очищаем выбор после выполнения действия
      setSelectedMenuTypes([]);
    } catch (error) {
      console.error('Ошибка пакетной обработки:', error);
      alert('Произошла ошибка при выполнении операции');
    }
  };

  return (
    <div className="bg-white dark:bg-dark-2 rounded-lg border border-stroke dark:border-dark-3 p-6">
      {/* Компонент пакетной обработки */}
      <BatchActions
        selectedItems={selectedMenuTypes}
        totalItems={menuTypes.length}
        actions={menuTypesBatchActions}
        onAction={handleMenuTypesBatchAction}
        onSelectAll={handleSelectAllMenuTypes}
        onClearSelection={handleClearMenuTypesSelection}
      />

      <div className="space-y-4">
        {menuTypes.map(type => (
          <div key={type.id} className="border border-stroke dark:border-dark-3 rounded-lg">
            <div className="flex items-center justify-between p-4">
              <div className="flex items-center gap-3 flex-1">
                {/* Чекбокс для пакетной обработки */}
                <input
                  type="checkbox"
                  checked={selectedMenuTypes.includes(type.id)}
                  onChange={(e) => handleSelectMenuType(type.id, e.target.checked)}
                  className="w-4 h-4 text-primary bg-transparent border-2 border-stroke dark:border-dark-3 rounded focus:ring-primary focus:ring-2"
                />
                
                <div className="flex-1">
                  <h4 className="font-medium text-dark dark:text-white">{type.title}</h4>
                  <p className="text-sm text-body-color dark:text-dark-6">{type.name}</p>
                  <p className="text-xs text-body-color dark:text-dark-6 mt-1">
                    {allMenuItems.filter(item => item.menuTypeId === type.id).length} пунктов
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button 
                  onClick={() => {
                    onSelectMenuType(type.id);
                    onSetActiveTab('items');
                  }}
                  className="inline-flex items-center gap-1 px-3 py-1.5 text-sm text-primary hover:text-primary/80 border border-primary/20 rounded-md hover:bg-primary/5 transition-colors"
                >
                  <FiPlus size={14} />
                  Добавить пункт
                </button>
                
                {/* Тумблер активности */}
                <ToggleSwitch
                  checked={type.isActive ?? true}
                  onChange={(checked) => onToggleStatus(type.id, checked)}
                  size="sm"
                />
                
                <button 
                  onClick={() => onEditType(type)}
                  className="text-body-color dark:text-dark-6 hover:text-primary transition-colors p-1"
                  title="Редактировать тип меню"
                >
                  <FiEdit size={16} />
                </button>
                <button 
                  onClick={() => onDeleteType(type)}
                  className="text-body-color dark:text-dark-6 hover:text-red-500 transition-colors p-1"
                  title="Удалить тип меню"
                >
                  <FiTrash2 size={16} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MenuTypesTab;
