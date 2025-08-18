import React, { useState } from 'react';
import { MenuItemData } from '../../../types/menu';

/**
 * Модальное окно редактирования пункта меню
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
  const [formData, setFormData] = useState<Partial<MenuItemData>>({ ...item });
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.alias) return;

    try {
      setSaving(true);
      const response = await fetch(`http://localhost:3002/api/menu-items/${item.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: formData.title,
          alias: formData.alias,
          type: formData.type,
          level: formData.level,
          parentId: formData.parentId,
          orderIndex: formData.orderIndex,
          component: formData.component,
          view: formData.view,
          layout: formData.layout,
          targetId: formData.targetId,
          externalUrl: formData.externalUrl,
          isPublished: formData.isPublished,
          accessLevel: formData.accessLevel,
          language: formData.language,
          parameters: typeof (formData as any).parameters === 'string' ? (formData as any).parameters : JSON.stringify((formData as any).parameters || {}),
          metaTitle: formData.metaTitle,
          metaDescription: formData.metaDescription,
          metaKeywords: formData.metaKeywords,
          cssClass: formData.cssClass,
          menuImage: formData.menuImage,
          menuTypeId: formData.menuTypeId,
        }),
      });
      const data = await response.json();
      if (data.success) {
        onUpdate(data.data as MenuItemData);
      } else {
        alert(data.error || 'Ошибка сохранения пункта меню');
      }
    } catch (err) {
      alert('Ошибка сети при сохранении пункта меню');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-dark-2 rounded-lg p-6 w-full max-w-xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium text-dark dark:text-white">Редактировать пункт меню</h3>
          <button onClick={onClose} className="text-body-color dark:text-dark-6 hover:text-dark dark:hover:text-white">
            <svg width="20" height="20" viewBox="0 0 20 20" className="fill-current"><path d="M15 5L5 15M5 5L15 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-dark dark:text-white mb-2">Название *</label>
              <input
                type="text"
                value={formData.title || ''}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                className="w-full px-3 py-2 border border-stroke dark:border-dark-3 rounded-lg bg-white dark:bg-dark-3 text-dark dark:text-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-dark dark:text-white mb-2">Alias *</label>
              <input
                type="text"
                value={formData.alias || ''}
                onChange={(e) => setFormData(prev => ({ ...prev, alias: e.target.value }))}
                className="w-full px-3 py-2 border border-stroke dark:border-dark-3 rounded-lg bg-white dark:bg-dark-3 text-dark dark:text-white"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-dark dark:text-white mb-2">Тип</label>
              <select
                value={formData.type || 'COMPONENT'}
                onChange={(e) => setFormData(prev => ({ ...prev, type: e.target.value as any }))}
                className="w-full px-3 py-2 border border-stroke dark:border-dark-3 rounded-lg bg-white dark:bg-dark-3 text-dark dark:text-white"
              >
                <option value="COMPONENT">🧩 Компонент</option>
                <option value="URL">🔗 Внешняя ссылка</option>
                <option value="HEADING">📂 Заголовок</option>
                <option value="SEPARATOR">➖ Разделитель</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-dark dark:text-white mb-2">Родитель</label>
              <input
                type="text"
                value={formData.parentId || ''}
                onChange={(e) => setFormData(prev => ({ ...prev, parentId: e.target.value || undefined }))}
                placeholder="ID родителя"
                className="w-full px-3 py-2 border border-stroke dark:border-dark-3 rounded-lg bg-white dark:bg-dark-3 text-dark dark:text-white"
              />
            </div>
          </div>

          {formData.type === 'COMPONENT' && (
            <div className="border border-blue-200 dark:border-blue-800 rounded-lg p-4 bg-blue-50 dark:bg-blue-900/20">
              <h4 className="font-medium text-blue-800 dark:text-blue-200 mb-3">🧩 Компонент</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-dark dark:text-white mb-2">Компонент</label>
                  <select
                    value={formData.component || ''}
                    onChange={(e) => setFormData(prev => ({ ...prev, component: e.target.value as any }))}
                    className="w-full px-3 py-2 border border-stroke dark:border-dark-3 rounded-lg bg-white dark:bg-dark-3 text-dark dark:text-white"
                  >
                    <option value="">—</option>
                    <option value="Website">🌐 Website</option>
                    <option value="Store">🛒 Store</option>
                    <option value="Blog">📝 Blog</option>
                    <option value="Landing">🎯 Landing</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-dark dark:text-white mb-2">View</label>
                  <input
                    type="text"
                    value={formData.view || ''}
                    onChange={(e) => setFormData(prev => ({ ...prev, view: e.target.value }))}
                    className="w-full px-3 py-2 border border-stroke dark:border-dark-3 rounded-lg bg-white dark:bg-dark-3 text-dark dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-dark dark:text-white mb-2">Target ID</label>
                  <input
                    type="text"
                    value={formData.targetId || ''}
                    onChange={(e) => setFormData(prev => ({ ...prev, targetId: e.target.value }))}
                    className="w-full px-3 py-2 border border-stroke dark:border-dark-3 rounded-lg bg-white dark:bg-dark-3 text-dark dark:text-white"
                  />
                </div>
              </div>
            </div>
          )}

          {formData.type === 'URL' && (
            <div className="border border-green-200 dark:border-green-800 rounded-lg p-4 bg-green-50 dark:bg-green-900/20">
              <h4 className="font-medium text-green-800 dark:text-green-200 mb-3">🔗 Внешняя ссылка</h4>
              <div>
                <label className="block text-sm font-medium text-dark dark:text-white mb-2">URL</label>
                <input
                  type="url"
                  value={formData.externalUrl || ''}
                  onChange={(e) => setFormData(prev => ({ ...prev, externalUrl: e.target.value }))}
                  className="w-full px-3 py-2 border border-stroke dark:border-dark-3 rounded-lg bg-white dark:bg-dark-3 text-dark dark:text-white"
                />
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-dark dark:text-white mb-2">Доступ</label>
              <select
                value={formData.accessLevel || 'PUBLIC'}
                onChange={(e) => setFormData(prev => ({ ...prev, accessLevel: e.target.value as any }))}
                className="w-full px-3 py-2 border border-stroke dark:border-dark-3 rounded-lg bg-white dark:bg-dark-3 text-dark dark:text-white"
              >
                <option value="PUBLIC">🌐 Публичный</option>
                <option value="REGISTERED">👤 Зарегистрированные</option>
                <option value="SPECIAL">⭐ Специальный</option>
                <option value="CUSTOM">🔧 Пользовательский</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-dark dark:text-white mb-2">Язык</label>
              <select
                value={formData.language || '*'}
                onChange={(e) => setFormData(prev => ({ ...prev, language: e.target.value }))}
                className="w-full px-3 py-2 border border-stroke dark:border-dark-3 rounded-lg bg-white dark:bg-dark-3 text-dark dark:text-white"
              >
                <option value="*">🌍 Все</option>
                <option value="ru-RU">🇷🇺 Русский</option>
                <option value="en-GB">🇬🇧 English</option>
                <option value="es-ES">🇪🇸 Español</option>
              </select>
            </div>
            <div className="flex items-center gap-2 pt-6">
              <input
                id="isPublished"
                type="checkbox"
                checked={!!formData.isPublished}
                onChange={(e) => setFormData(prev => ({ ...prev, isPublished: e.target.checked }))}
                className="w-4 h-4 text-primary bg-white border-stroke dark:border-dark-3 rounded focus:ring-primary"
              />
              <label htmlFor="isPublished" className="text-sm text-dark dark:text-white">Опубликовано</label>
            </div>
          </div>

          <details className="border border-gray-200 dark:border-gray-700 rounded-lg">
            <summary className="p-3 cursor-pointer hover:bg-gray-50 dark:hover:bg-dark-3 font-medium text-dark dark:text-white">🔍 SEO</summary>
            <div className="p-4 border-t border-gray-200 dark:border-gray-700 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-dark dark:text-white mb-2">Meta Title</label>
                <input
                  type="text"
                  value={formData.metaTitle || ''}
                  onChange={(e) => setFormData(prev => ({ ...prev, metaTitle: e.target.value }))}
                  className="w-full px-3 py-2 border border-stroke dark:border-dark-3 rounded-lg bg-white dark:bg-dark-3 text-dark dark:text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-dark dark:text-white mb-2">Meta Description</label>
                <input
                  type="text"
                  value={formData.metaDescription || ''}
                  onChange={(e) => setFormData(prev => ({ ...prev, metaDescription: e.target.value }))}
                  className="w-full px-3 py-2 border border-stroke dark:border-dark-3 rounded-lg bg-white dark:bg-dark-3 text-dark dark:text-white"
                />
              </div>
            </div>
          </details>

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-stroke dark:border-dark-3 rounded-lg text-dark dark:text-white hover:bg-gray-50 dark:hover:bg-dark-3 transition-colors"
            >
              Отмена
            </button>
            <button
              type="submit"
              disabled={saving || !formData.title || !formData.alias}
              className="flex-1 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {saving ? 'Сохранение...' : 'Сохранить'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditMenuItemModal;
