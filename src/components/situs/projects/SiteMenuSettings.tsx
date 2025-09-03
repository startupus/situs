import React, { useState } from 'react';
import { ProjectData, PageData } from '../../../services/projectApi';
import IconPreview from '../../admin/menu/IconPreview';
import IconSelector from '../../admin/menu/IconSelector';

interface SiteMenuSettingsProps {
  project: ProjectData;
  onUpdate?: (menuConfig: MenuConfig) => void;
}

interface MenuItem {
  id: string;
  title: string;
  type: 'page' | 'link' | 'dropdown';
  url?: string;
  pageId?: string;
  children?: MenuItem[];
  order: number;
  visible: boolean;
  icon?: string; // Название React иконки
  iconLibrary?: string; // Библиотека иконок
}

interface MenuConfig {
  items: MenuItem[];
  position: 'top' | 'sidebar' | 'footer';
  style: 'horizontal' | 'vertical' | 'burger';
  maxDepth: number;
}

const SiteMenuSettings: React.FC<SiteMenuSettingsProps> = ({ project, onUpdate }) => {
  const [menuConfig, setMenuConfig] = useState<MenuConfig>({
    items: project.pages.map((page, index) => ({
      id: page.id,
      title: page.title,
      type: 'page',
      pageId: page.id,
      order: index,
      visible: !page.isHomePage, // Скрываем главную страницу из меню по умолчанию
    })),
    position: 'top',
    style: 'horizontal',
    maxDepth: 2,
  });

  const [draggedItem, setDraggedItem] = useState<string | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showIconSelector, setShowIconSelector] = useState(false);
  const [newMenuItem, setNewMenuItem] = useState<Partial<MenuItem>>({
    title: '',
    type: 'page',
    visible: true,
    iconLibrary: 'fi',
  });

  const handleDragStart = (e: React.DragEvent, itemId: string) => {
    setDraggedItem(itemId);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e: React.DragEvent, targetId: string) => {
    e.preventDefault();

    if (!draggedItem || draggedItem === targetId) return;

    const newItems = [...menuConfig.items];
    const draggedIndex = newItems.findIndex((item) => item.id === draggedItem);
    const targetIndex = newItems.findIndex((item) => item.id === targetId);

    if (draggedIndex !== -1 && targetIndex !== -1) {
      const [draggedElement] = newItems.splice(draggedIndex, 1);
      newItems.splice(targetIndex, 0, draggedElement);

      // Обновляем порядок
      newItems.forEach((item, index) => {
        item.order = index;
      });

      setMenuConfig((prev) => ({ ...prev, items: newItems }));
    }

    setDraggedItem(null);
  };

  const handleToggleVisibility = (itemId: string) => {
    setMenuConfig((prev) => ({
      ...prev,
      items: prev.items.map((item) => (item.id === itemId ? { ...item, visible: !item.visible } : item)),
    }));
  };

  const handleDeleteItem = (itemId: string) => {
    setMenuConfig((prev) => ({
      ...prev,
      items: prev.items.filter((item) => item.id !== itemId),
    }));
  };

  const handleAddMenuItem = () => {
    if (!newMenuItem.title) return;

    const newItem: MenuItem = {
      id: Date.now().toString(),
      title: newMenuItem.title,
      type: newMenuItem.type || 'link',
      url: newMenuItem.url,
      pageId: newMenuItem.pageId,
      icon: newMenuItem.icon,
      iconLibrary: newMenuItem.iconLibrary || 'fi',
      order: menuConfig.items.length,
      visible: true,
    };

    setMenuConfig((prev) => ({
      ...prev,
      items: [...prev.items, newItem],
    }));

    setNewMenuItem({ title: '', type: 'page', visible: true, iconLibrary: 'fi' });
    setShowAddModal(false);
  };

  const handleSave = async () => {
    try {
      // Здесь будет API вызов для сохранения конфигурации меню
      console.log('💾 Сохранение конфигурации меню:', menuConfig);

      // Временно сохраняем в localStorage
      localStorage.setItem(`menu-config-${project.id}`, JSON.stringify(menuConfig));

      onUpdate?.(menuConfig);

      // Показываем уведомление об успешном сохранении
      alert('Настройки меню сохранены');
    } catch (error) {
      console.error('Ошибка сохранения меню:', error);
      alert('Ошибка при сохранении настроек меню');
    }
  };

  const getItemIcon = (item: MenuItem) => {
    // Если есть пользовательская иконка, используем её
    if (item.icon) {
      return <IconPreview iconName={item.icon} iconLibrary={item.iconLibrary} size={20} className="text-primary" />;
    }

    // Fallback на эмодзи по типу
    switch (item.type) {
      case 'page':
        return '📄';
      case 'link':
        return '🔗';
      case 'dropdown':
        return '📁';
      default:
        return '📄';
    }
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-semibold text-dark dark:text-white mb-2">Настройки меню сайта</h2>
          <p className="text-body-color dark:text-dark-6">Управляйте структурой и видимостью элементов навигации</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setShowAddModal(true)}
            className="inline-flex items-center gap-2 rounded-lg bg-gray-100 dark:bg-dark-3 px-4 py-2 text-sm font-medium text-dark dark:text-white hover:bg-gray-200 dark:hover:bg-dark-4 transition-colors"
          >
            ➕ Добавить пункт
          </button>
          <button
            onClick={handleSave}
            className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary/90 transition-colors"
          >
            💾 Сохранить
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Настройки меню */}
        <div className="bg-white dark:bg-dark-2 rounded-lg p-6 border border-stroke dark:border-dark-3">
          <h3 className="text-lg font-semibold text-dark dark:text-white mb-4">Общие настройки</h3>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-dark dark:text-white mb-2">Расположение меню</label>
              <select
                value={menuConfig.position}
                onChange={(e) => setMenuConfig((prev) => ({ ...prev, position: e.target.value as any }))}
                className="w-full px-3 py-2 border border-stroke dark:border-dark-3 rounded-lg bg-white dark:bg-dark-2 text-dark dark:text-white focus:border-primary focus:outline-none transition-colors"
              >
                <option value="top">Верхнее меню</option>
                <option value="sidebar">Боковое меню</option>
                <option value="footer">Меню в подвале</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-dark dark:text-white mb-2">Стиль отображения</label>
              <select
                value={menuConfig.style}
                onChange={(e) => setMenuConfig((prev) => ({ ...prev, style: e.target.value as any }))}
                className="w-full px-3 py-2 border border-stroke dark:border-dark-3 rounded-lg bg-white dark:bg-dark-2 text-dark dark:text-white focus:border-primary focus:outline-none transition-colors"
              >
                <option value="horizontal">Горизонтальное</option>
                <option value="vertical">Вертикальное</option>
                <option value="burger">Бургер-меню</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-dark dark:text-white mb-2">
                Максимальная вложенность
              </label>
              <select
                value={menuConfig.maxDepth}
                onChange={(e) => setMenuConfig((prev) => ({ ...prev, maxDepth: parseInt(e.target.value) }))}
                className="w-full px-3 py-2 border border-stroke dark:border-dark-3 rounded-lg bg-white dark:bg-dark-2 text-dark dark:text-white focus:border-primary focus:outline-none transition-colors"
              >
                <option value={1}>1 уровень</option>
                <option value={2}>2 уровня</option>
                <option value={3}>3 уровня</option>
              </select>
            </div>
          </div>
        </div>

        {/* Список пунктов меню */}
        <div className="lg:col-span-2 bg-white dark:bg-dark-2 rounded-lg p-6 border border-stroke dark:border-dark-3">
          <h3 className="text-lg font-semibold text-dark dark:text-white mb-4">Пункты меню</h3>

          {menuConfig.items.length === 0 ? (
            <div className="text-center py-8">
              <div className="text-4xl mb-4">📋</div>
              <p className="text-body-color dark:text-dark-6 mb-4">Меню пусто</p>
              <button
                onClick={() => setShowAddModal(true)}
                className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary/90 transition-colors"
              >
                ➕ Добавить первый пункт
              </button>
            </div>
          ) : (
            <div className="space-y-2">
              {menuConfig.items
                .sort((a, b) => a.order - b.order)
                .map((item) => (
                  <div
                    key={item.id}
                    draggable
                    onDragStart={(e) => handleDragStart(e, item.id)}
                    onDragOver={handleDragOver}
                    onDrop={(e) => handleDrop(e, item.id)}
                    className={`flex items-center gap-3 p-3 border rounded-lg transition-all cursor-move ${
                      draggedItem === item.id
                        ? 'border-primary bg-primary/5'
                        : 'border-stroke dark:border-dark-3 hover:border-gray-300'
                    } ${!item.visible ? 'opacity-50' : ''}`}
                  >
                    <div className="flex items-center gap-2 flex-1">
                      <span className="text-lg">{getItemIcon(item)}</span>
                      <div className="flex-1">
                        <div className="font-medium text-dark dark:text-white">{item.title}</div>
                        <div className="text-xs text-body-color dark:text-dark-6">
                          {item.type === 'page' && item.pageId && (
                            <>Страница: {project.pages.find((p) => p.id === item.pageId)?.slug}</>
                          )}
                          {item.type === 'link' && item.url && <>Ссылка: {item.url}</>}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleToggleVisibility(item.id)}
                        className={`p-1 rounded ${
                          item.visible ? 'text-green-600 hover:bg-green-50' : 'text-gray-400 hover:bg-gray-50'
                        }`}
                        title={item.visible ? 'Скрыть' : 'Показать'}
                      >
                        {item.visible ? '👁️' : '🙈'}
                      </button>
                      <button
                        onClick={() => handleDeleteItem(item.id)}
                        className="p-1 text-red-600 hover:bg-red-50 rounded"
                        title="Удалить"
                      >
                        🗑️
                      </button>
                    </div>
                  </div>
                ))}
            </div>
          )}
        </div>
      </div>

      {/* Модальное окно добавления пункта */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-dark-2 rounded-lg w-full max-w-md">
            <div className="flex items-center justify-between p-6 border-b border-stroke dark:border-dark-3">
              <h2 className="text-xl font-semibold text-dark dark:text-white">Добавить пункт меню</h2>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
              >
                <svg width="24" height="24" viewBox="0 0 24 24" className="fill-current">
                  <path d="M19 6.41L17.59 5L12 10.59L6.41 5L5 6.41L10.59 12L5 17.59L6.41 19L12 13.41L17.59 19L19 17.59L13.41 12L19 6.41Z" />
                </svg>
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-dark dark:text-white mb-2">Название пункта *</label>
                <input
                  type="text"
                  value={newMenuItem.title || ''}
                  onChange={(e) => setNewMenuItem((prev) => ({ ...prev, title: e.target.value }))}
                  className="w-full px-3 py-2 border border-stroke dark:border-dark-3 rounded-lg bg-white dark:bg-dark-2 text-dark dark:text-white focus:border-primary focus:outline-none transition-colors"
                  placeholder="Введите название"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-dark dark:text-white mb-2">Тип пункта</label>
                <select
                  value={newMenuItem.type || 'page'}
                  onChange={(e) => setNewMenuItem((prev) => ({ ...prev, type: e.target.value as any }))}
                  className="w-full px-3 py-2 border border-stroke dark:border-dark-3 rounded-lg bg-white dark:bg-dark-2 text-dark dark:text-white focus:border-primary focus:outline-none transition-colors"
                >
                  <option value="page">Страница сайта</option>
                  <option value="link">Внешняя ссылка</option>
                  <option value="dropdown">Выпадающее меню</option>
                </select>
              </div>

              {newMenuItem.type === 'page' && (
                <div>
                  <label className="block text-sm font-medium text-dark dark:text-white mb-2">Выберите страницу</label>
                  <select
                    value={newMenuItem.pageId || ''}
                    onChange={(e) => setNewMenuItem((prev) => ({ ...prev, pageId: e.target.value }))}
                    className="w-full px-3 py-2 border border-stroke dark:border-dark-3 rounded-lg bg-white dark:bg-dark-2 text-dark dark:text-white focus:border-primary focus:outline-none transition-colors"
                  >
                    <option value="">Выберите страницу</option>
                    {project.pages.map((page) => (
                      <option key={page.id} value={page.id}>
                        {page.title} ({page.slug})
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {newMenuItem.type === 'link' && (
                <div>
                  <label className="block text-sm font-medium text-dark dark:text-white mb-2">URL ссылки</label>
                  <input
                    type="url"
                    value={newMenuItem.url || ''}
                    onChange={(e) => setNewMenuItem((prev) => ({ ...prev, url: e.target.value }))}
                    className="w-full px-3 py-2 border border-stroke dark:border-dark-3 rounded-lg bg-white dark:bg-dark-2 text-dark dark:text-white focus:border-primary focus:outline-none transition-colors"
                    placeholder="https://example.com"
                  />
                </div>
              )}

              {/* Выбор иконки */}
              <div>
                <label className="block text-sm font-medium text-dark dark:text-white mb-2">Иконка пункта меню</label>
                <div className="flex items-center gap-3">
                  {/* Предварительный просмотр */}
                  <div className="flex items-center gap-2 p-2 bg-gray-50 dark:bg-dark-3 rounded border border-stroke dark:border-dark-3">
                    <IconPreview
                      iconName={newMenuItem.icon}
                      iconLibrary={newMenuItem.iconLibrary}
                      size={20}
                      className="text-primary"
                    />
                    <span className="text-sm text-dark dark:text-white">{newMenuItem.icon || 'По умолчанию'}</span>
                  </div>

                  {/* Кнопки управления */}
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => setShowIconSelector(true)}
                      className="px-3 py-1.5 bg-primary text-white rounded text-sm hover:bg-primary/90 transition-colors"
                    >
                      Выбрать
                    </button>
                    {newMenuItem.icon && (
                      <button
                        type="button"
                        onClick={() => setNewMenuItem((prev) => ({ ...prev, icon: undefined }))}
                        className="px-3 py-1.5 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 rounded text-sm hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                      >
                        Убрать
                      </button>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 px-4 py-2 text-sm font-medium text-body-color dark:text-dark-6 bg-gray-100 dark:bg-dark-3 rounded-lg hover:bg-gray-200 dark:hover:bg-dark-4 transition-colors"
                >
                  Отмена
                </button>
                <button
                  onClick={handleAddMenuItem}
                  disabled={!newMenuItem.title}
                  className="flex-1 px-4 py-2 text-sm font-medium text-white bg-primary rounded-lg hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Добавить
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Селектор иконок */}
      {showIconSelector && (
        <IconSelector
          selectedIcon={newMenuItem.icon}
          selectedLibrary={newMenuItem.iconLibrary}
          onSelect={(icon, library) => {
            setNewMenuItem((prev) => ({ ...prev, icon, iconLibrary: library }));
          }}
          onClose={() => setShowIconSelector(false)}
        />
      )}
    </div>
  );
};

export default SiteMenuSettings;
