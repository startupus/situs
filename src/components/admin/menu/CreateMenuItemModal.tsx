import React, { useState } from 'react';
import { MenuItemData, CreateMenuItemRequest } from '../../../types/menu';

/**
 * Модальное окно создания пункта меню
 * Полная форма с валидацией и автогенерацией полей
 */
interface CreateMenuItemModalProps {
  menuTypeId: string;
  parentItems: MenuItemData[];
  onClose: () => void;
  onCreate: (data: CreateMenuItemRequest) => void;
}

const CreateMenuItemModal: React.FC<CreateMenuItemModalProps> = ({
  menuTypeId,
  parentItems,
  onClose,
  onCreate
}) => {
  const [formData, setFormData] = useState<Partial<CreateMenuItemRequest>>({
    type: 'COMPONENT',
    accessLevel: 'PUBLIC',
    language: '*',
    level: 1,
    menuTypeId
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title || !formData.alias) {
      alert('Заполните обязательные поля');
      return;
    }

    // Валидация для типа COMPONENT
    if (formData.type === 'COMPONENT' && (!formData.component || !formData.view)) {
      alert('Для типа "Компонент" обязательно укажите компонент и view');
      return;
    }

    // Валидация для типа URL
    if (formData.type === 'URL' && !formData.externalUrl) {
      alert('Для типа "Внешняя ссылка" обязательно укажите URL');
      return;
    }

    onCreate(formData as CreateMenuItemRequest);
  };

  // Автогенерация alias из title
  const generateAlias = (title: string) => {
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

  // Получение предустановленных значений для компонента
  const getComponentDefaults = (component: string) => {
    switch (component) {
      case 'Website':
        return { view: 'page', targetId: '' };
      case 'Store':
        return { view: 'categories', targetId: '' };
      case 'Blog':
        return { view: 'list', targetId: 'news' };
      case 'Landing':
        return { view: 'page', targetId: '' };
      default:
        return { view: '', targetId: '' };
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-dark-2 rounded-lg p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium text-dark dark:text-white">
            Создать пункт меню
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
          {/* Основные поля */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Название */}
            <div>
              <label className="block text-sm font-medium text-dark dark:text-white mb-2">
                Название пункта меню *
              </label>
              <input
                type="text"
                value={formData.title || ''}
                onChange={(e) => {
                  const title = e.target.value;
                  setFormData(prev => ({
                    ...prev,
                    title,
                    alias: generateAlias(title)
                  }));
                }}
                className="w-full px-3 py-2 border border-stroke dark:border-dark-3 rounded-lg bg-white dark:bg-dark-3 text-dark dark:text-white"
                placeholder="Введите название"
              />
            </div>

            {/* Alias */}
            <div>
              <label className="block text-sm font-medium text-dark dark:text-white mb-2">
                Alias (URL) *
              </label>
              <input
                type="text"
                value={formData.alias || ''}
                onChange={(e) => setFormData(prev => ({ ...prev, alias: e.target.value }))}
                className="w-full px-3 py-2 border border-stroke dark:border-dark-3 rounded-lg bg-white dark:bg-dark-3 text-dark dark:text-white"
                placeholder="url-alias"
              />
            </div>
          </div>

          {/* Тип и иерархия */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Тип пункта меню */}
            <div>
              <label className="block text-sm font-medium text-dark dark:text-white mb-2">
                Тип пункта
              </label>
              <select
                value={formData.type || 'COMPONENT'}
                onChange={(e) => setFormData(prev => ({ ...prev, type: e.target.value as any }))}
                className="w-full px-3 py-2 border border-stroke dark:border-dark-3 rounded-lg bg-white dark:bg-dark-3 text-dark dark:text-white"
              >
                <option value="COMPONENT">🧩 Компонент</option>
                <option value="URL">🔗 Внешняя ссылка</option>
                <option value="HEADING">📂 Заголовок группы</option>
                <option value="SEPARATOR">➖ Разделитель</option>
              </select>
            </div>

            {/* Родительский пункт */}
            <div>
              <label className="block text-sm font-medium text-dark dark:text-white mb-2">
                Родительский пункт
              </label>
              <select
                value={formData.parentId || ''}
                onChange={(e) => {
                  const parentId = e.target.value || undefined;
                  const parent = parentItems.find(item => item.id === parentId);
                  setFormData(prev => ({ 
                    ...prev, 
                    parentId,
                    level: parent ? parent.level + 1 : 1
                  }));
                }}
                className="w-full px-3 py-2 border border-stroke dark:border-dark-3 rounded-lg bg-white dark:bg-dark-3 text-dark dark:text-white"
              >
                <option value="">Корневой уровень</option>
                {parentItems.map((item) => (
                  <option key={item.id} value={item.id}>
                    {'  '.repeat(item.level - 1)}📁 {item.title} (Level {item.level})
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Настройки компонента (если тип COMPONENT) */}
          {formData.type === 'COMPONENT' && (
            <div className="border border-blue-200 dark:border-blue-800 rounded-lg p-4 bg-blue-50 dark:bg-blue-900/20">
              <h4 className="font-medium text-blue-800 dark:text-blue-200 mb-3">
                🧩 Настройки компонента
              </h4>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Компонент */}
                <div>
                  <label className="block text-sm font-medium text-dark dark:text-white mb-2">
                    Компонент *
                  </label>
                  <select
                    value={formData.component || ''}
                    onChange={(e) => {
                      const component = e.target.value;
                      const defaults = getComponentDefaults(component);
                      setFormData(prev => ({ 
                        ...prev, 
                        component,
                        ...defaults
                      }));
                    }}
                    className="w-full px-3 py-2 border border-stroke dark:border-dark-3 rounded-lg bg-white dark:bg-dark-3 text-dark dark:text-white"
                  >
                    <option value="">Выберите компонент</option>
                    <option value="Website">🌐 Website</option>
                    <option value="Store">🛒 Store</option>
                    <option value="Blog">📝 Blog</option>
                    <option value="Landing">🎯 Landing</option>
                  </select>
                </div>

                {/* View */}
                <div>
                  <label className="block text-sm font-medium text-dark dark:text-white mb-2">
                    View *
                  </label>
                  <input
                    type="text"
                    value={formData.view || ''}
                    onChange={(e) => setFormData(prev => ({ ...prev, view: e.target.value }))}
                    className="w-full px-3 py-2 border border-stroke dark:border-dark-3 rounded-lg bg-white dark:bg-dark-3 text-dark dark:text-white"
                    placeholder="page, category, list..."
                  />
                </div>

                {/* Target ID */}
                <div>
                  <label className="block text-sm font-medium text-dark dark:text-white mb-2">
                    Target ID
                  </label>
                  <input
                    type="text"
                    value={formData.targetId || ''}
                    onChange={(e) => setFormData(prev => ({ ...prev, targetId: e.target.value }))}
                    className="w-full px-3 py-2 border border-stroke dark:border-dark-3 rounded-lg bg-white dark:bg-dark-3 text-dark dark:text-white"
                    placeholder="ID страницы, категории..."
                  />
                </div>
              </div>

              {/* Подсказки по компоненту */}
              {formData.component && (
                <div className="mt-3 p-3 bg-white dark:bg-dark-3 rounded border text-xs text-body-color dark:text-dark-6">
                  <strong>Подсказки для {formData.component}:</strong>
                  {formData.component === 'Website' && (
                    <ul className="mt-1 space-y-1">
                      <li>• view: page (отдельная страница)</li>
                      <li>• targetId: slug страницы (home, about, contacts)</li>
                    </ul>
                  )}
                  {formData.component === 'Store' && (
                    <ul className="mt-1 space-y-1">
                      <li>• view: categories (список категорий), category (конкретная категория)</li>
                      <li>• targetId: ID категории или пустое для списка</li>
                    </ul>
                  )}
                  {formData.component === 'Blog' && (
                    <ul className="mt-1 space-y-1">
                      <li>• view: list (список статей), article (конкретная статья)</li>
                      <li>• targetId: slug категории или ID статьи</li>
                    </ul>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Внешняя ссылка (если тип URL) */}
          {formData.type === 'URL' && (
            <div className="border border-green-200 dark:border-green-800 rounded-lg p-4 bg-green-50 dark:bg-green-900/20">
              <h4 className="font-medium text-green-800 dark:text-green-200 mb-3">
                🔗 Внешняя ссылка
              </h4>
              <div>
                <label className="block text-sm font-medium text-dark dark:text-white mb-2">
                  URL адрес *
                </label>
                <input
                  type="url"
                  value={formData.externalUrl || ''}
                  onChange={(e) => setFormData(prev => ({ ...prev, externalUrl: e.target.value }))}
                  className="w-full px-3 py-2 border border-stroke dark:border-dark-3 rounded-lg bg-white dark:bg-dark-3 text-dark dark:text-white"
                  placeholder="https://example.com"
                />
              </div>
            </div>
          )}

          {/* Права доступа и язык */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Права доступа */}
            <div>
              <label className="block text-sm font-medium text-dark dark:text-white mb-2">
                Уровень доступа
              </label>
              <select
                value={formData.accessLevel || 'PUBLIC'}
                onChange={(e) => setFormData(prev => ({ ...prev, accessLevel: e.target.value as any }))}
                className="w-full px-3 py-2 border border-stroke dark:border-dark-3 rounded-lg bg-white dark:bg-dark-3 text-dark dark:text-white"
              >
                <option value="PUBLIC">🌐 Публичный (все пользователи)</option>
                <option value="REGISTERED">👤 Зарегистрированные</option>
                <option value="SPECIAL">⭐ Специальный (админы)</option>
                <option value="CUSTOM">🔧 Пользовательский</option>
              </select>
            </div>

            {/* Язык */}
            <div>
              <label className="block text-sm font-medium text-dark dark:text-white mb-2">
                Язык
              </label>
              <select
                value={formData.language || '*'}
                onChange={(e) => setFormData(prev => ({ ...prev, language: e.target.value }))}
                className="w-full px-3 py-2 border border-stroke dark:border-dark-3 rounded-lg bg-white dark:bg-dark-3 text-dark dark:text-white"
              >
                <option value="*">🌍 Все языки</option>
                <option value="ru-RU">🇷🇺 Русский</option>
                <option value="en-GB">🇬🇧 English</option>
                <option value="es-ES">🇪🇸 Español</option>
              </select>
            </div>
          </div>

          {/* SEO поля (дополнительно) */}
          <details className="border border-gray-200 dark:border-gray-700 rounded-lg">
            <summary className="p-3 cursor-pointer hover:bg-gray-50 dark:hover:bg-dark-3 font-medium text-dark dark:text-white">
              🔍 SEO настройки (опционально)
            </summary>
            <div className="p-4 border-t border-gray-200 dark:border-gray-700 space-y-3">
              <div>
                <label className="block text-sm font-medium text-dark dark:text-white mb-2">
                  Meta Title
                </label>
                <input
                  type="text"
                  value={formData.metaTitle || ''}
                  onChange={(e) => setFormData(prev => ({ ...prev, metaTitle: e.target.value }))}
                  className="w-full px-3 py-2 border border-stroke dark:border-dark-3 rounded-lg bg-white dark:bg-dark-3 text-dark dark:text-white"
                  placeholder="Заголовок для поисковых систем"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-dark dark:text-white mb-2">
                  Meta Description
                </label>
                <textarea
                  value={formData.metaDescription || ''}
                  onChange={(e) => setFormData(prev => ({ ...prev, metaDescription: e.target.value }))}
                  className="w-full px-3 py-2 border border-stroke dark:border-dark-3 rounded-lg bg-white dark:bg-dark-3 text-dark dark:text-white"
                  placeholder="Описание для поисковых систем"
                  rows={2}
                />
              </div>
            </div>
          </details>

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
              disabled={!formData.title || !formData.alias}
              className="flex-1 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Создать пункт
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateMenuItemModal;
