import React, { useState } from 'react';
import { FiChevronDown, FiPlay } from 'react-icons/fi';

export interface BatchAction {
  id: string;
  label: string;
  icon?: React.ReactNode;
  variant?: 'default' | 'danger' | 'success';
}

interface BatchActionsProps {
  selectedItems: string[];
  totalItems: number;
  actions: BatchAction[];
  onAction: (actionId: string, selectedItems: string[]) => void;
  onSelectAll: (selected: boolean) => void;
  onClearSelection: () => void;
}

const BatchActions: React.FC<BatchActionsProps> = ({
  selectedItems,
  totalItems,
  actions,
  onAction,
  onSelectAll,
  onClearSelection
}) => {
  const [selectedAction, setSelectedAction] = useState<string>('');

  const handleExecuteAction = () => {
    if (selectedAction && selectedItems.length > 0) {
      onAction(selectedAction, selectedItems);
      setSelectedAction('');
      onClearSelection();
    }
  };

  const getActionVariantClass = (variant?: string) => {
    switch (variant) {
      case 'danger':
        return 'bg-red-500 hover:bg-red-600 text-white';
      case 'success':
        return 'bg-green-500 hover:bg-green-600 text-white';
      default:
        return 'bg-primary hover:bg-primary/90 text-white';
    }
  };

  if (selectedItems.length === 0) {
    return null;
  }

  return (
    <div className="bg-white dark:bg-dark-2 border border-stroke dark:border-dark-3 rounded-lg p-4 mb-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          {/* Информация о выбранных элементах */}
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-dark dark:text-white">
              Выбрано: {selectedItems.length} из {totalItems}
            </span>
            
            {selectedItems.length < totalItems && (
              <button
                onClick={() => onSelectAll(true)}
                className="text-sm text-primary hover:text-primary/80 underline"
              >
                Выбрать все
              </button>
            )}
            
            <button
              onClick={onClearSelection}
              className="text-sm text-body-color dark:text-dark-6 hover:text-dark dark:hover:text-white underline"
            >
              Очистить
            </button>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Селектор действий */}
          <div className="relative">
            <select
              value={selectedAction}
              onChange={(e) => setSelectedAction(e.target.value)}
              className="appearance-none bg-white dark:bg-dark-2 border border-stroke dark:border-dark-3 rounded-lg px-4 py-2 pr-8 text-sm text-dark dark:text-white focus:border-primary outline-hidden"
            >
              <option value="">Выберите действие</option>
              {actions.map(action => (
                <option key={action.id} value={action.id}>
                  {action.label}
                </option>
              ))}
            </select>
            <span className="absolute top-1/2 right-2 -translate-y-1/2 pointer-events-none">
              <FiChevronDown size={16} className="text-body-color" />
            </span>
          </div>

          {/* Кнопка применения */}
          <button
            onClick={handleExecuteAction}
            disabled={!selectedAction}
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
              selectedAction 
                ? getActionVariantClass(actions.find(a => a.id === selectedAction)?.variant)
                : 'bg-gray-300 dark:bg-gray-600 text-gray-500 dark:text-gray-400'
            }`}
          >
            <FiPlay size={14} />
            Применить
          </button>
        </div>
      </div>
    </div>
  );
};

export default BatchActions;
