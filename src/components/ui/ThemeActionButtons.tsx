import React from 'react';
import { FiEdit, FiTrash2 } from 'react-icons/fi';

interface ThemeActionButtonsProps {
  onEdit?: () => void;
  onDelete?: () => void;
  editTitle?: string;
  deleteTitle?: string;
  className?: string;
}

/**
 * Корпоративные кнопки действий (редактировать/удалить)
 * Используют единый стиль как в разделе меню
 */
export const ThemeActionButtons: React.FC<ThemeActionButtonsProps> = ({
  onEdit,
  onDelete,
  editTitle = "Редактировать",
  deleteTitle = "Удалить",
  className = ""
}) => {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      {onEdit && (
        <button
          onClick={onEdit}
          className="text-body-color dark:text-dark-6 hover:text-primary transition-colors p-1"
          title={editTitle}
        >
          <FiEdit size={16} />
        </button>
      )}
      {onDelete && (
        <button
          onClick={onDelete}
          className="text-body-color dark:text-dark-6 hover:text-red-500 transition-colors p-1"
          title={deleteTitle}
        >
          <FiTrash2 size={16} />
        </button>
      )}
    </div>
  );
};

export default ThemeActionButtons;
