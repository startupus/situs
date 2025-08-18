import React from 'react';
import { MenuItemData } from '../../../types/menu';

/**
 * Модальное окно редактирования пункта меню
 * TODO: Реализовать полную форму редактирования
 */
interface EditMenuItemModalProps {
  item: MenuItemData;
  onClose: () => void;
  onUpdate: (item: MenuItemData) => void;
}

const EditMenuItemModal: React.FC<EditMenuItemModalProps> = ({ 
  item, 
  onClose, 
  onUpdate 
}) => {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-dark-2 rounded-lg p-6 w-full max-w-md">
        <div className="text-center">
          <div className="text-4xl mb-4">🚧</div>
          <h3 className="text-lg font-medium text-dark dark:text-white mb-2">
            Редактирование: {item.title}
          </h3>
          <p className="text-body-color dark:text-dark-6 mb-4">
            Функция редактирования будет реализована в следующих итерациях.
            Сейчас доступны: создание, удаление, просмотр.
          </p>
          
          {/* Информация о пункте */}
          <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-3 mb-4 text-left">
            <div className="text-sm space-y-1">
              <div><strong>Alias:</strong> {item.alias}</div>
              <div><strong>Тип:</strong> {item.type}</div>
              <div><strong>Компонент:</strong> {item.component || 'Не указан'}</div>
              <div><strong>View:</strong> {item.view || 'Не указан'}</div>
              <div><strong>Target:</strong> {item.targetId || 'Не указан'}</div>
              <div><strong>Доступ:</strong> {item.accessLevel}</div>
              <div><strong>Язык:</strong> {item.language}</div>
            </div>
          </div>
          
          <button
            onClick={onClose}
            className="w-full px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
          >
            Закрыть
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditMenuItemModal;
