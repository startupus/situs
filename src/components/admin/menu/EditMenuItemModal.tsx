import React, { useState } from 'react';
import { MenuItemData, CreateMenuItemRequest } from '../../../types/menu';
import { FiBox, FiLink, FiFolder, FiGlobe, FiUsers, FiStar, FiSettings, FiX } from 'react-icons/fi';
import CorporateSelect from '../../ui/CorporateSelect';
import CorporateInput from '../../ui/CorporateInput';
import CorporateTextarea from '../../ui/CorporateTextarea';

/**
 * Модальное окно редактирования пункта меню
 * Полная форма редактирования с валидацией
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
  const [formData, setFormData] = useState({
    title: item.title,
    alias: item.alias,
    type: item.type,
    component: item.component || '',
    view: item.view || '',
    layout: item.layout || '',
    targetId: item.targetId || '',
    accessLevel: item.accessLevel,
    language: item.language,
    isPublished: item.isPublished,
    parameters: item.parameters || '{}'
  });
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Валидация параметров JSON
      let parsedParameters = {};
      if (formData.parameters.trim()) {
        try {
          parsedParameters = JSON.parse(formData.parameters);
        } catch (err) {
          throw new Error('Некорректный формат JSON в параметрах');
        }
      }

      const response = await fetch(`http://localhost:3002/api/menu-items/${item.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          parameters: JSON.stringify(parsedParameters)
        })
      });

      const result = await response.json();
      if (result.success) {
        onUpdate({ ...item, ...formData });
        onClose();
      } else {
        setError(result.error || 'Ошибка обновления пункта меню');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ошибка сети');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-dark-2 rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-bold text-dark dark:text-white">
              Редактирование пункта меню
            </h3>
            <button
              onClick={onClose}
              className="text-body-color dark:text-dark-6 hover:text-dark dark:hover:text-white p-1"
            >
              <FiX size={20} />
            </button>
          </div>

          {error && (
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-3 mb-4">
              <p className="text-red-600 dark:text-red-400 text-sm">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Основные поля */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <CorporateInput
                label="Название пункта"
                value={formData.title}
                onChange={(value) => handleChange('title', value)}
                required
              />

              <CorporateInput
                label="Alias (для URL)"
                value={formData.alias}
                onChange={(value) => handleChange('alias', value.toLowerCase().replace(/[^a-z0-9-]/g, '-'))}
                required
              />
            </div>

            {/* Тип пункта */}
            <CorporateSelect
              label="Тип пункта"
              value={formData.type}
              onChange={(value) => handleChange('type', value)}
              options={[
                { value: 'COMPONENT', label: 'Компонент' },
                { value: 'URL', label: 'Внешняя ссылка' },
                { value: 'HEADING', label: 'Заголовок (разделитель)' }
              ]}
              required
            />

            {/* Настройки компонента */}
            {formData.type === 'COMPONENT' && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <CorporateSelect
                  label="Компонент"
                  value={formData.component}
                  onChange={(value) => handleChange('component', value)}
                  options={[
                    { value: '', label: 'Выберите компонент' },
                    { value: 'Website', label: 'Website' },
                    { value: 'Shop', label: 'Shop' },
                    { value: 'Blog', label: 'Blog' },
                    { value: 'Landing', label: 'Landing' }
                  ]}
                />

                <CorporateInput
                  label="View"
                  value={formData.view}
                  onChange={(value) => handleChange('view', value)}
                  placeholder="page, list, category"
                />

                <CorporateInput
                  label="Layout"
                  value={formData.layout}
                  onChange={(value) => handleChange('layout', value)}
                  placeholder="default, grid, list"
                />
              </div>
            )}

            {/* Target ID */}
            {formData.type === 'COMPONENT' && (
              <CorporateInput
                label="Target ID"
                value={formData.targetId}
                onChange={(value) => handleChange('targetId', value)}
                placeholder="ID страницы, категории или товара"
              />
            )}

            {/* Права доступа и язык */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <CorporateSelect
                label="Права доступа"
                value={formData.accessLevel}
                onChange={(value) => handleChange('accessLevel', value)}
                options={[
                  { value: 'PUBLIC', label: 'Публичный доступ' },
                  { value: 'REGISTERED', label: 'Только для зарегистрированных' },
                  { value: 'SPECIAL', label: 'Специальные права' },
                  { value: 'CUSTOM', label: 'Пользовательские права' }
                ]}
              />

              <CorporateSelect
                label="Язык"
                value={formData.language}
                onChange={(value) => handleChange('language', value)}
                options={[
                  { value: '*', label: 'Все языки' },
                  { value: 'ru-RU', label: 'Русский' },
                  { value: 'en-GB', label: 'English' },
                  { value: 'es-ES', label: 'Español' }
                ]}
              />
            </div>

            {/* Параметры JSON */}
            <CorporateTextarea
              label="Параметры (JSON)"
              value={formData.parameters}
              onChange={(value) => handleChange('parameters', value)}
              placeholder='{"showBreadcrumbs": true, "itemsPerPage": 20}'
              rows={3}
              className="font-mono text-sm"
            />

            {/* Статус публикации */}
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                id="isPublished"
                checked={formData.isPublished}
                onChange={(e) => handleChange('isPublished', e.target.checked)}
                className="w-4 h-4 text-primary border-stroke dark:border-dark-3 rounded focus:ring-primary"
              />
              <label htmlFor="isPublished" className="text-sm font-medium text-dark dark:text-white flex items-center gap-2">
                <FiGlobe size={16} />
                Опубликовано (видно пользователям)
              </label>
            </div>

            {/* Кнопки */}
            <div className="flex gap-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-4 py-2 border border-stroke dark:border-dark-3 rounded-lg text-body-color dark:text-dark-6 hover:bg-gray-50 dark:hover:bg-dark-3 transition-colors"
              >
                Отмена
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex-1 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50"
              >
                {loading ? 'Сохранение...' : 'Сохранить изменения'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditMenuItemModal;
