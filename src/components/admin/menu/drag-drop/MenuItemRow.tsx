import React, { useState } from 'react';
import { FiEdit, FiTrash2, FiChevronDown, FiChevronRight } from 'react-icons/fi';
import { MenuItemProps } from './types';
import ToggleSwitch from '../../../ui/ToggleSwitch';

/**
 * Компонент отдельного пункта меню с поддержкой Drag & Drop
 */
const MenuItemRow: React.FC<MenuItemProps> = ({
  item,
  depth = 0,
  maxDepth = 3,
  isDragging = false,
  dragState,
  onDragStart,
  onDragEnd,
  onDragOver,
  onDragLeave,
  onDrop,
  onEditItem,
  onDeleteItem,
  onToggleStatus,
  showSelection = false,
  selectedItems = [],
  onSelectItem
}) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  // Получение CSS классов для индикации drop зоны
  const getDropIndicatorClass = () => {
    if (dragState.dragOverItem?.id !== item.id) return '';
    
    switch (dragState.dropPosition) {
      case 'before':
        return 'border-t-2 border-primary';
      case 'after':
        return 'border-b-2 border-primary';
      case 'inside':
        return 'bg-primary/10 border border-primary';
      default:
        return '';
    }
  };

  const displayDepth = Math.min(depth, maxDepth);

  return (
    <div>
      <div
        draggable
        onDragStart={(e) => onDragStart(e, item)}
        onDragEnd={onDragEnd}
        onDragOver={(e) => onDragOver(e, item)}
        onDragLeave={onDragLeave}
        onDrop={(e) => onDrop(e, item)}
        className={`
          flex items-center gap-3 p-3 rounded-lg cursor-move transition-all
          ${isDragging ? 'opacity-50 bg-gray-100 dark:bg-gray-800' : 'hover:bg-gray-50 dark:hover:bg-dark-3'}
          ${getDropIndicatorClass()}
        `}
        style={{ marginLeft: `${displayDepth * 20}px` }}
      >
        {/* Иконка перетаскивания */}
        <div className="text-body-color dark:text-dark-6 cursor-move">
          ⋮⋮
        </div>

        {/* Чекбокс для пакетной обработки */}
        {showSelection && onSelectItem && (
          <input
            type="checkbox"
            data-no-drag="true"
            checked={selectedItems.includes(item.id)}
            onChange={(e) => {
              e.stopPropagation();
              onSelectItem(item.id, e.target.checked);
            }}
            onMouseDown={(e) => {
              e.preventDefault();
              e.stopPropagation();
            }}
            onMouseUp={(e) => {
              e.preventDefault();
              e.stopPropagation();
            }}
            onClick={(e) => e.stopPropagation()}
            className="w-4 h-4 text-primary bg-transparent border-2 border-stroke dark:border-dark-3 rounded focus:ring-primary focus:ring-2"
          />
        )}

        {/* Иконка сворачивания/разворачивания */}
        {item.children && item.children.length > 0 ? (
          <button
            data-no-drag="true"
            onClick={(e) => {
              e.stopPropagation();
              setIsCollapsed(!isCollapsed);
            }}
            onMouseDown={(e) => e.stopPropagation()}
            className="text-xs bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors flex items-center justify-center"
            title={isCollapsed ? "Развернуть подменю" : "Свернуть подменю"}
          >
            {isCollapsed ? <FiChevronRight size={12} /> : <FiChevronDown size={12} />}
          </button>
        ) : (
          <div className="w-8 h-6" /> // Пустое место для выравнивания
        )}

        {/* Название */}
        <div className="flex-1">
          <h4 className="font-medium text-dark dark:text-white">
            {item.title}
          </h4>
          <p className="text-sm text-body-color dark:text-dark-6">
            /{item.alias}
            {item.component && ` • ${item.component}`}
            {item.view && ` • ${item.view}`}
            {item.targetId && ` → ${item.targetId}`}
            {' • '}
            {item.accessLevel === 'PUBLIC' ? 'PUBLIC' : 
             item.accessLevel === 'REGISTERED' ? 'REGISTERED' : 
             item.accessLevel === 'SPECIAL' ? 'SPECIAL' : 'ALL'}
            {' • '}
            {item.language === '*' ? 'Все языки' : item.language}
          </p>
        </div>

        {/* Функциональные элементы справа */}
        <div className="flex items-center gap-2">
          {/* Тумблер статуса */}
          {onToggleStatus && (
            <div
              data-no-drag="true"
              onMouseDown={(e) => e.stopPropagation()}
              onMouseUp={(e) => e.stopPropagation()}
              onClick={(e) => e.stopPropagation()}
            >
              <ToggleSwitch
                checked={item.isPublished ?? true}
                onChange={async (checked) => {
                  try {
                    await onToggleStatus(item.id, checked);
                  } catch (error) {
                    console.error('Ошибка изменения статуса пункта меню:', error);
                  }
                }}
                size="sm"
              />
            </div>
          )}

          {/* Кнопка редактирования */}
          {onEditItem && (
            <button
              data-no-drag="true"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onEditItem(item);
              }}
              onMouseDown={(e) => {
                e.preventDefault();
                e.stopPropagation();
              }}
              onMouseUp={(e) => {
                e.preventDefault();
                e.stopPropagation();
              }}
              className="text-body-color dark:text-dark-6 hover:text-primary transition-colors p-1"
              title="Редактировать пункт меню"
            >
              <FiEdit size={16} />
            </button>
          )}

          {/* Кнопка удаления */}
          {onDeleteItem && (
            <button
              data-no-drag="true"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                if (confirm('Вы уверены, что хотите удалить этот пункт меню?')) {
                  onDeleteItem(item.id);
                }
              }}
              onMouseDown={(e) => {
                e.preventDefault();
                e.stopPropagation();
              }}
              onMouseUp={(e) => {
                e.preventDefault();
                e.stopPropagation();
              }}
              className="text-body-color dark:text-dark-6 hover:text-red-500 transition-colors p-1"
              title="Удалить пункт меню"
            >
              <FiTrash2 size={16} />
            </button>
          )}
        </div>
      </div>

      {/* Рендерим дочерние элементы (только если не свернуто) */}
      {item.children && item.children.length > 0 && !isCollapsed && (
        <div className="ml-4">
          {item.children.map(child => (
            <MenuItemRow
              key={child.id}
              item={child}
              depth={depth + 1}
              maxDepth={maxDepth}
              isDragging={dragState.draggedItem?.id === child.id}
              dragState={dragState}
              onDragStart={onDragStart}
              onDragEnd={onDragEnd}
              onDragOver={onDragOver}
              onDragLeave={onDragLeave}
              onDrop={onDrop}
              onEditItem={onEditItem}
              onDeleteItem={onDeleteItem}
              onToggleStatus={onToggleStatus}
              showSelection={showSelection}
              selectedItems={selectedItems}
              onSelectItem={onSelectItem}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default MenuItemRow;
