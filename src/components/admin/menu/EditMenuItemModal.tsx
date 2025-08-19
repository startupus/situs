import React, { useState } from 'react';
import { MenuItemData, CreateMenuItemRequest } from '../../../types/menu';
import { FiBox, FiLink, FiFolder, FiGlobe, FiUsers, FiStar, FiSettings } from 'react-icons/fi';

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
              className="text-body-color dark:text-dark-6 hover:text-dark dark:hover:text-white"
            >
              ✕
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
              <div>
                <label className="block text-sm font-medium text-dark dark:text-white mb-2">
                  Название пункта *
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => handleChange('title', e.target.value)}
                  className="w-full px-3 py-2 border border-stroke dark:border-dark-3 rounded-lg bg-transparent text-dark dark:text-white focus:border-primary focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-dark dark:text-white mb-2">
                  Alias (для URL) *
                </label>
                <input
                  type="text"
                  value={formData.alias}
                  onChange={(e) => handleChange('alias', e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '-'))}
                  className="w-full px-3 py-2 border border-stroke dark:border-dark-3 rounded-lg bg-transparent text-dark dark:text-white focus:border-primary focus:outline-none"
                  required
                />
              </div>
            </div>

            {/* Тип пункта */}
            <div>
              <label className="block text-sm font-medium text-dark dark:text-white mb-2">
                Тип пункта *
              </label>
              <select
                value={formData.type}
                onChange={(e) => handleChange('type', e.target.value)}
                className="w-full px-3 py-2 border border-stroke dark:border-dark-3 rounded-lg bg-white dark:bg-dark-2 text-dark dark:text-white focus:border-primary focus:outline-none"
                required
              >
                <option value="COMPONENT">Компонент</option>
                <option value="URL">Внешняя ссылка</option>
                <option value="HEADING">Заголовок (разделитель)</option>
              </select>
            </div>

            {/* Настройки компонента */}
            {formData.type === 'COMPONENT' && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-dark dark:text-white mb-2">
                    Компонент
                  </label>
                  <select
                    value={formData.component}
                    onChange={(e) => handleChange('component', e.target.value)}
                    className="w-full px-3 py-2 border border-stroke dark:border-dark-3 rounded-lg bg-white dark:bg-dark-2 text-dark dark:text-white focus:border-primary focus:outline-none"
                  >
                    <option value="">Выберите компонент</option>
                    <option value="Website">Website</option>
                    <option value="Shop">Shop</option>
                    <option value="Blog">Blog</option>
                    <option value="Landing">Landing</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-dark dark:text-white mb-2">
                    View
                  </label>
                  <input
                    type="text"
                    value={formData.view}
                    onChange={(e) => handleChange('view', e.target.value)}
                    placeholder="page, list, category"
                    className="w-full px-3 py-2 border border-stroke dark:border-dark-3 rounded-lg bg-transparent text-dark dark:text-white focus:border-primary focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-dark dark:text-white mb-2">
                    Layout
                  </label>
                  <input
                    type="text"
                    value={formData.layout}
                    onChange={(e) => handleChange('layout', e.target.value)}
                    placeholder="default, grid, list"
                    className="w-full px-3 py-2 border border-stroke dark:border-dark-3 rounded-lg bg-transparent text-dark dark:text-white focus:border-primary focus:outline-none"
                  />
                </div>
              </div>
            )}

            {/* Target ID */}
            {formData.type === 'COMPONENT' && (
              <div>
                <label className="block text-sm font-medium text-dark dark:text-white mb-2">
                  Target ID
                </label>
                <input
                  type="text"
                  value={formData.targetId}
                  onChange={(e) => handleChange('targetId', e.target.value)}
                  placeholder="ID страницы, категории или товара"
                  className="w-full px-3 py-2 border border-stroke dark:border-dark-3 rounded-lg bg-transparent text-dark dark:text-white focus:border-primary focus:outline-none"
                />
              </div>
            )}

            {/* Права доступа и язык */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-dark dark:text-white mb-2">
                  Права доступа
                </label>
                <select
                  value={formData.accessLevel}
                  onChange={(e) => handleChange('accessLevel', e.target.value)}
                  className="w-full px-3 py-2 border border-stroke dark:border-dark-3 rounded-lg bg-white dark:bg-dark-2 text-dark dark:text-white focus:border-primary focus:outline-none"
                >
                  <option value="PUBLIC">Публичный доступ</option>
                  <option value="REGISTERED">Только для зарегистрированных</option>
                  <option value="SPECIAL">Специальные права</option>
                  <option value="CUSTOM">Пользовательские права</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-dark dark:text-white mb-2">
                  Язык
                </label>
                <select
                  value={formData.language}
                  onChange={(e) => handleChange('language', e.target.value)}
                  className="w-full px-3 py-2 border border-stroke dark:border-dark-3 rounded-lg bg-white dark:bg-dark-2 text-dark dark:text-white focus:border-primary focus:outline-none"
                >
                  <option value="*">Все языки</option>
                  <option value="ru-RU">Русский</option>
                  <option value="en-GB">English</option>
                  <option value="es-ES">Español</option>
                </select>
              </div>
            </div>

            {/* Параметры JSON */}
            <div>
              <label className="block text-sm font-medium text-dark dark:text-white mb-2">
                Параметры (JSON)
              </label>
              <textarea
                value={formData.parameters}
                onChange={(e) => handleChange('parameters', e.target.value)}
                placeholder='{"showBreadcrumbs": true, "itemsPerPage": 20}'
                className="w-full px-3 py-2 border border-stroke dark:border-dark-3 rounded-lg bg-transparent text-dark dark:text-white focus:border-primary focus:outline-none font-mono text-sm"
                rows={3}
              />
            </div>

            {/* Статус публикации */}
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                id="isPublished"
                checked={formData.isPublished}
                onChange={(e) => handleChange('isPublished', e.target.checked)}
                className="w-4 h-4 text-primary border-stroke dark:border-dark-3 rounded focus:ring-primary"
              />
              <label htmlFor="isPublished" className="text-sm font-medium text-dark dark:text-white">
                ✅ Опубликовано (видно пользователям)
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
