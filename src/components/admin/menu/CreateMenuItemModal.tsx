import React, { useState, useEffect } from 'react';
import { MenuItemData, CreateMenuItemRequest } from '../../../types/menu';
import { FiX, FiGlobe, FiShoppingCart, FiEdit, FiTarget, FiChevronDown, FiInfo } from 'react-icons/fi';

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

interface ViewOption {
  value: string;
  label: string;
  description: string;
  component: string;
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

  // Данные для селекторов View
  const viewOptions: ViewOption[] = [
    // Website
    { value: 'page', label: 'Страница', description: 'Отдельная страница сайта', component: 'Website' },
    { value: 'home', label: 'Главная страница', description: 'Домашняя страница', component: 'Website' },
    { value: 'about', label: 'О нас', description: 'Страница о компании', component: 'Website' },
    { value: 'contacts', label: 'Контакты', description: 'Страница контактов', component: 'Website' },
    
    // Store
    { value: 'categories', label: 'Список категорий', description: 'Каталог товаров', component: 'Store' },
    { value: 'category', label: 'Категория товаров', description: 'Конкретная категория', component: 'Store' },
    { value: 'product', label: 'Товар', description: 'Страница товара', component: 'Store' },
    { value: 'cart', label: 'Корзина', description: 'Корзина покупок', component: 'Store' },
    
    // Blog
    { value: 'list', label: 'Список статей', description: 'Лента новостей/блога', component: 'Blog' },
    { value: 'article', label: 'Статья', description: 'Отдельная статья', component: 'Blog' },
    { value: 'category', label: 'Категория статей', description: 'Статьи по категории', component: 'Blog' },
    
    // Landing
    { value: 'page', label: 'Лендинг', description: 'Посадочная страница', component: 'Landing' },
    { value: 'form', label: 'Форма', description: 'Страница с формой', component: 'Landing' }
  ];



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

  // Фильтрация опций View по выбранному компоненту
  const getFilteredViewOptions = () => {
    if (!formData.component) return [];
    return viewOptions.filter(option => option.component === formData.component);
  };

  return (
    <div className="fixed inset-0 bg-dark/90 flex items-center justify-center z-50 px-4 py-5">
      <div className="bg-white dark:bg-dark-2 rounded-[20px] w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        {/* Заголовок модала */}
        <div className="flex justify-between items-center p-8 pb-6">
          <h3 className="text-2xl font-semibold text-dark dark:text-white">
            Создать пункт меню
          </h3>
          <button
            onClick={onClose}
            className="flex items-center justify-center w-8 h-8 rounded-full text-body-color dark:text-dark-6 hover:text-dark dark:hover:text-white hover:bg-gray-2 dark:hover:bg-dark-3 transition-colors"
          >
            <FiX size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="px-8 pb-8">
          {/* Основные поля */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            {/* Название */}
            <div>
              <label className="mb-[10px] block text-base font-medium text-dark dark:text-white">
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
                className="w-full bg-transparent rounded-md border border-stroke dark:border-dark-3 py-[10px] px-5 text-dark-6 outline-hidden transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-gray-2"
                placeholder="Введите название"
              />
            </div>

            {/* Alias */}
            <div>
              <label className="mb-[10px] block text-base font-medium text-dark dark:text-white">
                Alias (URL) *
              </label>
              <input
                type="text"
                value={formData.alias || ''}
                onChange={(e) => setFormData(prev => ({ ...prev, alias: e.target.value }))}
                className="w-full bg-transparent rounded-md border border-stroke dark:border-dark-3 py-[10px] px-5 text-dark-6 outline-hidden transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-gray-2"
                placeholder="url-alias"
              />
            </div>
          </div>

          {/* Тип и иерархия */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            {/* Тип пункта меню */}
            <div>
              <label className="mb-[10px] block text-base font-medium text-dark dark:text-white">
                Тип пункта
              </label>
              <div className="relative z-20">
                <select 
                  value={formData.type || 'COMPONENT'}
                  onChange={(e) => setFormData(prev => ({ ...prev, type: e.target.value as any }))}
                  className="relative z-20 w-full appearance-none rounded-md border border-stroke dark:border-dark-3 bg-transparent py-[10px] px-5 text-dark-6 outline-hidden transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-gray-2"
                >
                  <option value="COMPONENT" className="dark:bg-dark-2">Компонент</option>
                  <option value="URL" className="dark:bg-dark-2">Внешняя ссылка</option>
                  <option value="HEADING" className="dark:bg-dark-2">Заголовок группы</option>
                  <option value="SEPARATOR" className="dark:bg-dark-2">Разделитель</option>
                </select>
                <span className="absolute top-1/2 right-4 z-10 -translate-y-1/2">
                  <FiChevronDown size={20} className="text-body-color" />
                </span>
              </div>
            </div>

            {/* Родительский пункт */}
            <div>
              <label className="mb-[10px] block text-base font-medium text-dark dark:text-white">
                Родительский пункт
              </label>
              <div className="relative z-20">
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
                  className="relative z-20 w-full appearance-none rounded-md border border-stroke dark:border-dark-3 bg-transparent py-[10px] px-5 text-dark-6 outline-hidden transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-gray-2"
                >
                  <option value="" className="dark:bg-dark-2">Корневой уровень</option>
                  {parentItems.map((item) => (
                    <option key={item.id} value={item.id} className="dark:bg-dark-2">
                      {'  '.repeat(item.level - 1)}{item.title} (Level {item.level})
                    </option>
                  ))}
                </select>
                <span className="absolute top-1/2 right-4 z-10 -translate-y-1/2">
                  <FiChevronDown size={20} className="text-body-color" />
                </span>
              </div>
            </div>
          </div>

          {/* Настройки компонента (если тип COMPONENT) */}
          {formData.type === 'COMPONENT' && (
            <div className="border border-primary/20 dark:border-primary/30 rounded-lg p-6 bg-primary/5 dark:bg-primary/10 mb-6">
              <div className="flex items-center gap-2 mb-4">
                <FiTarget className="text-primary" size={20} />
                <h4 className="text-lg font-medium text-dark dark:text-white">
                  Настройки компонента
                </h4>
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Компонент */}
                <div>
                  <label className="mb-[10px] block text-base font-medium text-dark dark:text-white">
                    Компонент *
                  </label>
                  <div className="relative z-20">
                    <span className="absolute top-1/2 left-4 -translate-y-1/2">
                      {formData.component === 'Website' && <FiGlobe className="text-body-color" size={16} />}
                      {formData.component === 'Store' && <FiShoppingCart className="text-body-color" size={16} />}
                      {formData.component === 'Blog' && <FiEdit className="text-body-color" size={16} />}
                      {formData.component === 'Landing' && <FiTarget className="text-body-color" size={16} />}
                    </span>
                    <select
                      value={formData.component || ''}
                      onChange={(e) => {
                        const component = e.target.value;
                        const defaults = getComponentDefaults(component);
                        setFormData(prev => ({ 
                          ...prev, 
                          component,
                          view: '',
                          targetId: '',
                          ...defaults
                        }));
                      }}
                      className="relative z-20 w-full appearance-none rounded-md border border-stroke dark:border-dark-3 bg-transparent py-[10px] px-12 text-dark-6 outline-hidden transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-gray-2"
                    >
                      <option value="" className="dark:bg-dark-2">Выберите компонент</option>
                      <option value="Website" className="dark:bg-dark-2">Website</option>
                      <option value="Store" className="dark:bg-dark-2">Store</option>
                      <option value="Blog" className="dark:bg-dark-2">Blog</option>
                      <option value="Landing" className="dark:bg-dark-2">Landing</option>
                    </select>
                    <span className="absolute top-1/2 right-4 z-10 -translate-y-1/2">
                      <FiChevronDown size={20} className="text-body-color" />
                    </span>
                  </div>
                </div>

                {/* View */}
                <div>
                  <label className="mb-[10px] block text-base font-medium text-dark dark:text-white">
                    View *
                  </label>
                  <div className="relative z-20">
                    <select
                      value={formData.view || ''}
                      onChange={(e) => setFormData(prev => ({ ...prev, view: e.target.value, targetId: '' }))}
                      className="relative z-20 w-full appearance-none rounded-md border border-stroke dark:border-dark-3 bg-transparent py-[10px] px-5 text-dark-6 outline-hidden transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-gray-2"
                      disabled={!formData.component}
                    >
                      <option value="" className="dark:bg-dark-2">
                        {formData.component ? 'Выберите view' : 'Сначала выберите компонент'}
                      </option>
                      {getFilteredViewOptions().map((option) => (
                        <option key={option.value} value={option.value} className="dark:bg-dark-2">
                          {option.label}
                        </option>
                      ))}
                    </select>
                    <span className="absolute top-1/2 right-4 z-10 -translate-y-1/2">
                      <FiChevronDown size={20} className="text-body-color" />
                    </span>
                  </div>
                  {formData.view && (
                    <p className="mt-2 text-sm text-body-color dark:text-dark-6">
                      {getFilteredViewOptions().find(opt => opt.value === formData.view)?.description}
                    </p>
                  )}
                </div>

                {/* Параметры */}
                <div>
                  <label className="mb-[10px] block text-base font-medium text-dark dark:text-white">
                    Параметры
                  </label>
                  <input
                    type="text"
                    value={formData.targetId || ''}
                    onChange={(e) => setFormData(prev => ({ ...prev, targetId: e.target.value }))}
                    className="w-full bg-transparent rounded-md border border-stroke dark:border-dark-3 py-[10px] px-5 text-dark-6 outline-hidden transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-gray-2"
                    placeholder="Дополнительные параметры (опционально)"
                  />
                  <p className="mt-2 text-sm text-body-color dark:text-dark-6">
                    Дополнительные параметры для компонента (например: id=123, category=news)
                  </p>
                </div>
              </div>

              {/* Подсказки по компоненту */}
              {formData.component && (
                <div className="mt-4 p-4 bg-white dark:bg-dark-3 rounded-lg border border-stroke dark:border-dark-3">
                  <div className="flex items-center gap-2 mb-2">
                    <FiInfo size={16} className="text-primary" />
                    <strong className="text-dark dark:text-white">Подсказки для {formData.component}:</strong>
                  </div>
                  {formData.component === 'Website' && (
                    <ul className="text-sm text-body-color dark:text-dark-6 space-y-1">
                      <li>• <strong>View:</strong> page (отдельная страница), home (главная)</li>
                      <li>• <strong>Параметры:</strong> slug=about, id=123</li>
                    </ul>
                  )}
                  {formData.component === 'Store' && (
                    <ul className="text-sm text-body-color dark:text-dark-6 space-y-1">
                      <li>• <strong>View:</strong> categories (список), category (конкретная категория)</li>
                      <li>• <strong>Параметры:</strong> category_id=5, featured=true</li>
                    </ul>
                  )}
                  {formData.component === 'Blog' && (
                    <ul className="text-sm text-body-color dark:text-dark-6 space-y-1">
                      <li>• <strong>View:</strong> list (список статей), article (статья)</li>
                      <li>• <strong>Параметры:</strong> category=news, limit=10</li>
                    </ul>
                  )}
                  {formData.component === 'Landing' && (
                    <ul className="text-sm text-body-color dark:text-dark-6 space-y-1">
                      <li>• <strong>View:</strong> page (лендинг), form (форма)</li>
                      <li>• <strong>Параметры:</strong> template=modern, theme=dark</li>
                    </ul>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Внешняя ссылка (если тип URL) */}
          {formData.type === 'URL' && (
            <div className="border border-primary/20 dark:border-primary/30 rounded-lg p-6 bg-primary/5 dark:bg-primary/10 mb-6">
              <div className="flex items-center gap-2 mb-4">
                <FiGlobe className="text-primary" size={20} />
                <h4 className="text-lg font-medium text-dark dark:text-white">
                  Внешняя ссылка
                </h4>
              </div>
              <div>
                <label className="mb-[10px] block text-base font-medium text-dark dark:text-white">
                  URL адрес *
                </label>
                <input
                  type="url"
                  value={formData.externalUrl || ''}
                  onChange={(e) => setFormData(prev => ({ ...prev, externalUrl: e.target.value }))}
                  className="w-full bg-transparent rounded-md border border-stroke dark:border-dark-3 py-[10px] px-5 text-dark-6 outline-hidden transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-gray-2"
                  placeholder="https://example.com"
                />
              </div>
            </div>
          )}

          {/* Права доступа и язык */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            {/* Права доступа */}
            <div>
              <label className="mb-[10px] block text-base font-medium text-dark dark:text-white">
                Уровень доступа
              </label>
              <div className="relative z-20">
                <select
                  value={formData.accessLevel || 'PUBLIC'}
                  onChange={(e) => setFormData(prev => ({ ...prev, accessLevel: e.target.value as any }))}
                  className="relative z-20 w-full appearance-none rounded-md border border-stroke dark:border-dark-3 bg-transparent py-[10px] px-5 text-dark-6 outline-hidden transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-gray-2"
                >
                  <option value="PUBLIC" className="dark:bg-dark-2">Публичный (все пользователи)</option>
                  <option value="REGISTERED" className="dark:bg-dark-2">Зарегистрированные</option>
                  <option value="SPECIAL" className="dark:bg-dark-2">Специальный (админы)</option>
                  <option value="CUSTOM" className="dark:bg-dark-2">Пользовательский</option>
                </select>
                <span className="absolute top-1/2 right-4 z-10 -translate-y-1/2">
                  <FiChevronDown size={20} className="text-body-color" />
                </span>
              </div>
            </div>

            {/* Язык */}
            <div>
              <label className="mb-[10px] block text-base font-medium text-dark dark:text-white">
                Язык
              </label>
              <div className="relative z-20">
                <select
                  value={formData.language || '*'}
                  onChange={(e) => setFormData(prev => ({ ...prev, language: e.target.value }))}
                  className="relative z-20 w-full appearance-none rounded-md border border-stroke dark:border-dark-3 bg-transparent py-[10px] px-5 text-dark-6 outline-hidden transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-gray-2"
                >
                  <option value="*" className="dark:bg-dark-2">Все языки</option>
                  <option value="ru-RU" className="dark:bg-dark-2">Русский</option>
                  <option value="en-GB" className="dark:bg-dark-2">English</option>
                  <option value="es-ES" className="dark:bg-dark-2">Español</option>
                </select>
                <span className="absolute top-1/2 right-4 z-10 -translate-y-1/2">
                  <FiChevronDown size={20} className="text-body-color" />
                </span>
              </div>
            </div>
          </div>

          {/* SEO поля (дополнительно) */}
          <details className="border border-stroke dark:border-dark-3 rounded-lg mb-6">
            <summary className="p-4 cursor-pointer hover:bg-gray-2 dark:hover:bg-dark-3 font-medium text-dark dark:text-white flex items-center gap-2">
              <FiTarget size={16} className="text-primary" />
              SEO настройки (опционально)
            </summary>
            <div className="p-4 border-t border-stroke dark:border-dark-3 space-y-4">
              <div>
                <label className="mb-[10px] block text-base font-medium text-dark dark:text-white">
                  Meta Title
                </label>
                <input
                  type="text"
                  value={formData.metaTitle || ''}
                  onChange={(e) => setFormData(prev => ({ ...prev, metaTitle: e.target.value }))}
                  className="w-full bg-transparent rounded-md border border-stroke dark:border-dark-3 py-[10px] px-5 text-dark-6 outline-hidden transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-gray-2"
                  placeholder="Заголовок для поисковых систем"
                />
              </div>
              
              <div>
                <label className="mb-[10px] block text-base font-medium text-dark dark:text-white">
                  Meta Description
                </label>
                <textarea
                  value={formData.metaDescription || ''}
                  onChange={(e) => setFormData(prev => ({ ...prev, metaDescription: e.target.value }))}
                  className="w-full bg-transparent rounded-md border border-stroke dark:border-dark-3 py-[10px] px-5 text-dark-6 outline-hidden transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-gray-2"
                  placeholder="Описание для поисковых систем"
                  rows={3}
                />
              </div>
            </div>
          </details>

          {/* Кнопки */}
          <div className="flex gap-4 pt-6">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 rounded-md border border-stroke dark:border-dark-3 p-3 text-center text-base font-medium text-dark dark:text-white transition hover:border-red-600 hover:bg-red-600 hover:text-white"
            >
              Отмена
            </button>
            <button
              type="submit"
              disabled={!formData.title || !formData.alias}
              className="flex-1 rounded-md border border-primary bg-primary p-3 text-center text-base font-medium text-white transition hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed"
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
