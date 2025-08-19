import React, { useState } from 'react';
import { FiX } from 'react-icons/fi';
import { MenuTypeData } from '../../../types/menu';

interface EditMenuTypeModalProps {
  menuType: MenuTypeData;
  onClose: () => void;
  onUpdate: (typeId: string, updates: { title?: string; name?: string; description?: string; isActive?: boolean }) => Promise<void>;
}

const EditMenuTypeModal: React.FC<EditMenuTypeModalProps> = ({
  menuType,
  onClose,
  onUpdate
}) => {
  const [formData, setFormData] = useState({
    title: menuType.title || '',
    name: menuType.name || '',
    description: menuType.description || '',
    isActive: menuType.isActive ?? true
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.name.trim()) return;

    setIsLoading(true);
    try {
      await onUpdate(menuType.id, formData);
      onClose();
    } catch (error) {
      console.error('Ошибка обновления типа меню:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white dark:bg-dark-2 rounded-lg border border-stroke dark:border-dark-3 p-6 w-full max-w-md">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-medium text-dark dark:text-white">
            Редактировать тип меню
          </h3>
          <button
            onClick={onClose}
            className="text-body-color dark:text-dark-6 hover:text-dark dark:hover:text-white"
          >
            <FiX size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="mb-2 block text-sm font-medium text-dark dark:text-white">
              Название типа меню *
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full rounded-lg border border-stroke dark:border-dark-3 bg-transparent py-2 px-3 text-dark dark:text-white outline-none focus:border-primary"
              placeholder="Например: Главное меню"
              required
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-dark dark:text-white">
              Системное имя *
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full rounded-lg border border-stroke dark:border-dark-3 bg-transparent py-2 px-3 text-dark dark:text-white outline-none focus:border-primary"
              placeholder="main, footer, sidebar..."
              required
            />
            <p className="mt-1 text-xs text-body-color dark:text-dark-6">
              Используется в коде. Только латинские буквы, цифры и дефисы.
            </p>
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-dark dark:text-white">
              Описание
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full rounded-lg border border-stroke dark:border-dark-3 bg-transparent py-2 px-3 text-dark dark:text-white outline-none focus:border-primary"
              placeholder="Краткое описание назначения меню"
              rows={3}
            />
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="isActive"
              checked={formData.isActive}
              onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
              className="w-4 h-4 text-primary bg-transparent border-2 border-stroke dark:border-dark-3 rounded focus:ring-primary focus:ring-2"
            />
            <label htmlFor="isActive" className="text-sm text-dark dark:text-white">
              Активный тип меню
            </label>
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm text-body-color dark:text-dark-6 hover:text-dark dark:hover:text-white border border-stroke dark:border-dark-3 rounded-lg"
              disabled={isLoading}
            >
              Отмена
            </button>
            <button
              type="submit"
              disabled={!formData.title.trim() || !formData.name.trim() || isLoading}
              className="px-4 py-2 text-sm bg-primary text-white rounded-lg hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Сохранение...' : 'Сохранить изменения'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditMenuTypeModal;
