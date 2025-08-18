import React, { useState } from 'react';
import { MenuTypeData, CreateMenuTypeRequest } from '../../../types/menu';

/**
 * Компонент для выбора типа меню и управления типами
 */
interface MenuTypesSelectorProps {
  projectId: string;
  menuTypes: MenuTypeData[];
  selectedMenuType: string;
  onMenuTypeChange: (menuTypeId: string) => void;
  onMenuTypesUpdate: () => void;
}

const MenuTypesSelector: React.FC<MenuTypesSelectorProps> = ({
  projectId,
  menuTypes,
  selectedMenuType,
  onMenuTypeChange,
  onMenuTypesUpdate
}) => {
  const [showCreateTypeModal, setShowCreateTypeModal] = useState(false);

  // Создание нового типа меню
  const handleCreateMenuType = async (data: CreateMenuTypeRequest) => {
    try {
      const response = await fetch('http://localhost:3002/api/menu-types', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });

      const result = await response.json();
      if (result.success) {
        // SSE событие автоматически обновит список типов меню
        onMenuTypesUpdate();
        onMenuTypeChange(result.data.id); // Переключаемся на новый тип
        setShowCreateTypeModal(false);
      } else {
        alert(result.error || 'Ошибка создания типа меню');
      }
    } catch (err) {
      alert('Ошибка сети при создании типа меню');
    }
  };

  return (
    <div className="mb-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-4">
          <h3 className="text-lg font-medium text-dark dark:text-white">Тип меню:</h3>
          <select
            value={selectedMenuType}
            onChange={(e) => onMenuTypeChange(e.target.value)}
            className="px-3 py-2 border border-stroke dark:border-dark-3 rounded-lg bg-white dark:bg-dark-3 text-dark dark:text-white"
          >
            <option value="">Выберите тип меню</option>
            {menuTypes.map((menuType) => (
              <option key={menuType.id} value={menuType.id}>
                {menuType.title} ({menuType.name})
              </option>
            ))}
          </select>
        </div>

        {/* Кнопка создания нового типа меню */}
        <button
          onClick={() => setShowCreateTypeModal(true)}
          className="inline-flex items-center gap-2 rounded-lg bg-green-600 px-4 py-2 text-sm font-medium text-white hover:bg-green-700 transition-colors"
        >
          <svg width="16" height="16" viewBox="0 0 16 16" className="fill-current">
            <path d="M8 1C8.55228 1 9 1.44772 9 2V7H14C14.5523 7 15 7.44772 15 8C15 8.55228 14.5523 9 14 9H9V14C9 14.5523 8.55228 15 8 15C7.44772 15 7 14.5523 7 14V9H2C1.44772 9 1 8.55228 1 8C1 7.44772 1.44772 7 2 7H7V2C7 1.44772 7.44772 1 8 1Z"/>
          </svg>
          Создать тип меню
        </button>
      </div>

      {/* Модальное окно создания типа меню */}
      {showCreateTypeModal && (
        <CreateMenuTypeModal
          projectId={projectId}
          onClose={() => setShowCreateTypeModal(false)}
          onCreate={handleCreateMenuType}
        />
      )}
    </div>
  );
};

// Компонент модального окна создания типа меню
interface CreateMenuTypeModalProps {
  projectId: string;
  onClose: () => void;
  onCreate: (data: CreateMenuTypeRequest) => void;
}

const CreateMenuTypeModal: React.FC<CreateMenuTypeModalProps> = ({
  projectId,
  onClose,
  onCreate
}) => {
  const [formData, setFormData] = useState<Partial<CreateMenuTypeRequest>>({
    isActive: true,
    projectId
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.title) {
      alert('Заполните обязательные поля');
      return;
    }

    onCreate(formData as CreateMenuTypeRequest);
  };

  // Автогенерация name из title
  const generateName = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[а-я]/g, (char) => {
        const map: { [key: string]: string } = {
          'а': 'a', 'б': 'b', 'в': 'v', 'г': 'g', 'д': 'd', 'е': 'e', 'ё': 'yo',
          'ж': 'zh', 'з': 'z', 'и': 'i', 'й': 'y', 'к': 'k', 'л': 'l', 'м': 'm',
          'н': 'n', 'о': 'o', 'п': 'p', 'р': 'r', 'с': 's', 'т': 't', 'у': 'u',
          'ф': 'f', 'х': 'h', 'ц': 'ts', 'ч': 'ch', 'ш': 'sh', 'щ': 'sch',
          'ъ': '', 'ы': 'y', 'ь': '', 'э': 'e', 'ю': 'yu', 'я': 'ya'
        };
        return map[char] || char;
      })
      .replace(/[^a-z0-9]/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '');
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-dark-2 rounded-lg p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium text-dark dark:text-white">
            Создать тип меню
          </h3>
          <button
            onClick={onClose}
            className="text-body-color dark:text-dark-6 hover:text-dark dark:hover:text-white"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" className="fill-current">
              <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Название типа меню */}
          <div>
            <label className="block text-sm font-medium text-dark dark:text-white mb-2">
              Название типа меню *
            </label>
            <input
              type="text"
              value={formData.title || ''}
              onChange={(e) => {
                const title = e.target.value;
                setFormData(prev => ({
                  ...prev,
                  title,
                  name: generateName(title)
                }));
              }}
              className="w-full px-3 py-2 border border-stroke dark:border-dark-3 rounded-lg bg-white dark:bg-dark-3 text-dark dark:text-white"
              placeholder="Например: Главное меню"
            />
          </div>

          {/* Системное имя */}
          <div>
            <label className="block text-sm font-medium text-dark dark:text-white mb-2">
              Системное имя *
            </label>
            <input
              type="text"
              value={formData.name || ''}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              className="w-full px-3 py-2 border border-stroke dark:border-dark-3 rounded-lg bg-white dark:bg-dark-3 text-dark dark:text-white"
              placeholder="main, footer, sidebar..."
            />
            <p className="text-xs text-body-color dark:text-dark-6 mt-1">
              Используется в коде. Только латинские буквы, цифры и дефисы.
            </p>
          </div>

          {/* Описание */}
          <div>
            <label className="block text-sm font-medium text-dark dark:text-white mb-2">
              Описание
            </label>
            <textarea
              value={formData.description || ''}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              className="w-full px-3 py-2 border border-stroke dark:border-dark-3 rounded-lg bg-white dark:bg-dark-3 text-dark dark:text-white"
              placeholder="Краткое описание назначения меню"
              rows={3}
            />
          </div>

          {/* Активность */}
          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              id="isActive"
              checked={formData.isActive || false}
              onChange={(e) => setFormData(prev => ({ ...prev, isActive: e.target.checked }))}
              className="w-4 h-4 text-primary bg-white border-stroke dark:border-dark-3 rounded focus:ring-primary"
            />
            <label htmlFor="isActive" className="text-sm font-medium text-dark dark:text-white">
              Активный тип меню
            </label>
          </div>

          {/* Кнопки */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-stroke dark:border-dark-3 rounded-lg text-dark dark:text-white hover:bg-gray-50 dark:hover:bg-dark-3 transition-colors"
            >
              Отмена
            </button>
            <button
              type="submit"
              disabled={!formData.title || !formData.name}
              className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Создать тип
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default MenuTypesSelector;
