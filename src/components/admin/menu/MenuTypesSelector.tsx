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
  onMenuTypesUpdate,
}) => {
  const [showCreateTypeModal, setShowCreateTypeModal] = useState(false);

  // Создание нового типа меню
  const handleCreateMenuType = async (data: CreateMenuTypeRequest) => {
    try {
      const response = await fetch('http://localhost:3002/api/menu-types', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
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
      <div className="flex items-center gap-4">
        <div className="flex-1 max-w-md">
          <label htmlFor="menu-type-select" className="mb-2 block text-base font-medium text-dark dark:text-white">
            Тип меню
          </label>
          <div className="relative">
            <select
              id="menu-type-select"
              value={selectedMenuType}
              onChange={(e) => {
                if (e.target.value === '__create_new__') {
                  setShowCreateTypeModal(true);
                } else {
                  onMenuTypeChange(e.target.value);
                }
              }}
              className="w-full appearance-none rounded-lg border border-stroke bg-transparent py-3 pl-5 pr-12 text-dark outline-hidden focus:border-primary dark:border-dark-3 dark:text-white"
            >
              <option value="">Выберите тип меню</option>
              {menuTypes.map((menuType) => (
                <option key={menuType.id} value={menuType.id}>
                  {menuType.title} ({menuType.name})
                </option>
              ))}
              <option value="__create_new__">+ Создать новый тип</option>
            </select>
            <span className="pointer-events-none absolute right-0 top-0 flex h-full w-12 items-center justify-center text-dark-5">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M2.29645 5.15354L2.29642 5.15357L2.30065 5.1577L7.65065 10.3827L8.00167 10.7255L8.35105 10.381L13.7011 5.10603L13.7011 5.10604L13.7036 5.10354C13.7221 5.08499 13.7386 5.08124 13.75 5.08124C13.7614 5.08124 13.7779 5.08499 13.7964 5.10354C13.815 5.12209 13.8188 5.13859 13.8188 5.14999C13.8188 5.1612 13.8151 5.17734 13.7974 5.19552L8.04956 10.8433L8.04955 10.8433L8.04645 10.8464C8.01604 10.8768 7.99596 10.8921 7.98519 10.8992C7.97756 10.8983 7.97267 10.8968 7.96862 10.8952C7.96236 10.8929 7.94954 10.887 7.92882 10.8721L2.20263 5.2455C2.18488 5.22733 2.18125 5.2112 2.18125 5.19999C2.18125 5.18859 2.18501 5.17209 2.20355 5.15354C2.2221 5.13499 2.2386 5.13124 2.25 5.13124C2.2614 5.13124 2.2779 5.13499 2.29645 5.15354Z"
                  fill="currentColor"
                  stroke="currentColor"
                />
              </svg>
            </span>
          </div>
        </div>
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

const CreateMenuTypeModal: React.FC<CreateMenuTypeModalProps> = ({ projectId, onClose, onCreate }) => {
  const [formData, setFormData] = useState<Partial<CreateMenuTypeRequest>>({
    isActive: true,
    projectId,
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
          а: 'a',
          б: 'b',
          в: 'v',
          г: 'g',
          д: 'd',
          е: 'e',
          ё: 'yo',
          ж: 'zh',
          з: 'z',
          и: 'i',
          й: 'y',
          к: 'k',
          л: 'l',
          м: 'm',
          н: 'n',
          о: 'o',
          п: 'p',
          р: 'r',
          с: 's',
          т: 't',
          у: 'u',
          ф: 'f',
          х: 'h',
          ц: 'ts',
          ч: 'ch',
          ш: 'sh',
          щ: 'sch',
          ъ: '',
          ы: 'y',
          ь: '',
          э: 'e',
          ю: 'yu',
          я: 'ya',
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
          <h3 className="text-lg font-medium text-dark dark:text-white">Создать тип меню</h3>
          <button onClick={onClose} className="text-body-color dark:text-dark-6 hover:text-dark dark:hover:text-white">
            <svg width="24" height="24" viewBox="0 0 24 24" className="fill-current">
              <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Название типа меню */}
          <div>
            <label className="block text-sm font-medium text-dark dark:text-white mb-2">Название типа меню *</label>
            <input
              type="text"
              value={formData.title || ''}
              onChange={(e) => {
                const title = e.target.value;
                setFormData((prev) => ({
                  ...prev,
                  title,
                  name: generateName(title),
                }));
              }}
              className="w-full px-3 py-2 border border-stroke dark:border-dark-3 rounded-lg bg-white dark:bg-dark-3 text-dark dark:text-white"
              placeholder="Например: Главное меню"
            />
          </div>

          {/* Системное имя */}
          <div>
            <label className="block text-sm font-medium text-dark dark:text-white mb-2">Системное имя *</label>
            <input
              type="text"
              value={formData.name || ''}
              onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
              className="w-full px-3 py-2 border border-stroke dark:border-dark-3 rounded-lg bg-white dark:bg-dark-3 text-dark dark:text-white"
              placeholder="main, footer, sidebar..."
            />
            <p className="text-xs text-body-color dark:text-dark-6 mt-1">
              Используется в коде. Только латинские буквы, цифры и дефисы.
            </p>
          </div>

          {/* Описание */}
          <div>
            <label className="block text-sm font-medium text-dark dark:text-white mb-2">Описание</label>
            <textarea
              value={formData.description || ''}
              onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
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
              onChange={(e) => setFormData((prev) => ({ ...prev, isActive: e.target.checked }))}
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
export { CreateMenuTypeModal };
