import React, { useState, useEffect } from 'react';
import { FiEye, FiGlobe, FiShoppingCart, FiEdit, FiTarget, FiGrid, FiSmartphone, FiList, FiUser, FiUsers, FiStar, FiInfo, FiChevronDown } from 'react-icons/fi';
import { MenuItemData } from '../../../types/menu';
import { useMenuSystemRealtime } from '../../../hooks/useMenuSystemRealtime';

/**
 * Компонент предпросмотра меню в реальном времени
 * Показывает, как меню выглядит для пользователей
 */
interface MenuPreviewProps {
  projectId: string;
  selectedMenuType: string;
  menuItems: MenuItemData[];  // Получаем пункты меню от родителя
}

const MenuPreview: React.FC<MenuPreviewProps> = ({
  projectId,
  selectedMenuType,
  menuItems
}) => {
  const [previewStyle, setPreviewStyle] = useState<'horizontal' | 'vertical' | 'mobile'>('horizontal');
  const [userRole, setUserRole] = useState<'guest' | 'user' | 'admin'>('guest');
  const [language, setLanguage] = useState<string>('*');

  // Фильтрация пунктов меню по правам доступа
  const getFilteredItems = (): MenuItemData[] => {
    const accessLevels = {
      guest: ['PUBLIC'],
      user: ['PUBLIC', 'REGISTERED'],
      admin: ['PUBLIC', 'REGISTERED', 'SPECIAL', 'CUSTOM']
    };

    return menuItems.filter(item => {
      // Фильтр по правам доступа
      if (!accessLevels[userRole].includes(item.accessLevel)) {
        return false;
      }

      // Фильтр по языку
      if (language !== '*' && item.language !== '*' && item.language !== language) {
        return false;
      }

      return item.isPublished;
    });
  };

  const filteredItems = getFilteredItems();

  // Построение дерева меню
  const buildMenuTree = (items: MenuItemData[]): MenuItemData[] => {
    const itemsMap = new Map<string, MenuItemData>();
    const rootItems: MenuItemData[] = [];

    // Создаем карту всех пунктов
    items.forEach(item => {
      itemsMap.set(item.id, { ...item, children: [] });
    });

    // Строим дерево
    items.forEach(item => {
      const itemWithChildren = itemsMap.get(item.id)!;
      
      if (item.parentId) {
        const parent = itemsMap.get(item.parentId);
        if (parent) {
          parent.children = parent.children || [];
          parent.children.push(itemWithChildren);
        }
      } else {
        rootItems.push(itemWithChildren);
      }
    });

    return rootItems.sort((a, b) => a.orderIndex - b.orderIndex);
  };

  const menuTree = buildMenuTree(filteredItems);

  // Рендеринг пункта меню для предпросмотра
  const renderPreviewItem = (item: MenuItemData, depth = 0): React.ReactNode => {
    if (item.type === 'SEPARATOR') {
      return <div key={item.id} className="border-t border-gray-200 dark:border-gray-700 my-2" />;
    }

    if (item.type === 'HEADING') {
      return (
        <div key={item.id} className="font-semibold text-gray-600 dark:text-gray-400 text-sm uppercase tracking-wider py-2">
          {item.title}
        </div>
      );
    }

    const hasChildren = item.children && item.children.length > 0;
    const indentStyle = previewStyle === 'vertical' ? { paddingLeft: `${depth * 16}px` } : {};

    return (
      <div key={item.id}>
        <div 
          className={`
            flex items-center gap-2 px-3 py-2 rounded-lg transition-colors cursor-pointer
            ${previewStyle === 'horizontal' ? 'hover:bg-primary/10' : 'hover:bg-gray-100 dark:hover:bg-gray-800'}
            ${depth > 0 ? 'text-sm' : ''}
          `}
          style={indentStyle}
        >
          {/* Иконка */}
          {item.component && (
            <span className="text-xs">
              {item.component === 'Website' ? <FiGlobe size={14} /> :
               item.component === 'Store' ? <FiShoppingCart size={14} /> :
               item.component === 'Blog' ? <FiEdit size={14} /> :
               item.component === 'Landing' ? <FiTarget size={14} /> : <FiGrid size={14} />}
            </span>
          )}
          
          {/* Название */}
          <span className="text-dark dark:text-white">
            {item.title}
          </span>

          {/* Индикатор дочерних элементов */}
          {hasChildren && (
            <FiChevronDown size={12} className="text-gray-500" />
          )}
        </div>

        {/* Дочерние элементы */}
        {hasChildren && previewStyle === 'vertical' && (
          <div className="ml-4">
            {item.children!.map(child => renderPreviewItem(child, depth + 1))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="bg-white dark:bg-dark-2 rounded-lg border border-stroke dark:border-dark-3" data-testid="menu-preview">
      {/* Заголовок */}
      <div className="p-4 border-b border-stroke dark:border-dark-3">
        <h3 className="text-lg font-semibold text-dark dark:text-white mb-2 flex items-center gap-2">
          <FiEye size={20} />
          Предпросмотр меню
        </h3>
        <p className="text-sm text-body-color dark:text-dark-6">
          Как меню выглядит для пользователей с разными правами доступа
        </p>
      </div>

      {/* Настройки предпросмотра */}
      <div className="p-4 border-b border-stroke dark:border-dark-3">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Стиль отображения */}
          <div>
            <label className="block text-sm font-medium text-dark dark:text-white mb-2">
              Стиль
            </label>
            <select
              data-testid="menu-preview-style"
              value={previewStyle}
              onChange={(e) => setPreviewStyle(e.target.value as any)}
              className="w-full px-3 py-2 border border-stroke dark:border-dark-3 rounded-lg bg-white dark:bg-dark-2 text-dark dark:text-white"
            >
              <option value="horizontal">Горизонтальное</option>
              <option value="vertical">Вертикальное</option>
              <option value="mobile">Мобильное</option>
            </select>
          </div>

          {/* Роль пользователя */}
          <div>
            <label className="block text-sm font-medium text-dark dark:text-white mb-2">
              Роль пользователя
            </label>
            <select
              data-testid="menu-preview-role"
              value={userRole}
              onChange={(e) => setUserRole(e.target.value as any)}
              className="w-full px-3 py-2 border border-stroke dark:border-dark-3 rounded-lg bg-white dark:bg-dark-2 text-dark dark:text-white"
            >
              <option value="guest">Гость (PUBLIC)</option>
              <option value="user">Пользователь (REGISTERED)</option>
              <option value="admin">Администратор (ALL)</option>
            </select>
          </div>

          {/* Язык */}
          <div>
            <label className="block text-sm font-medium text-dark dark:text-white mb-2">
              Язык
            </label>
            <select
              data-testid="menu-preview-language"
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="w-full px-3 py-2 border border-stroke dark:border-dark-3 rounded-lg bg-white dark:bg-dark-2 text-dark dark:text-white"
            >
              <option value="*">Все языки</option>
              <option value="ru-RU">Русский</option>
              <option value="en-GB">English</option>
              <option value="es-ES">Español</option>
            </select>
          </div>
        </div>

        {/* Статистика фильтрации */}
        <div className="mt-3 text-sm text-body-color dark:text-dark-6" data-testid="menu-preview-stats">
          Показано: <strong>{filteredItems.length}</strong> из {menuItems.length} пунктов
          {userRole !== 'admin' && menuItems.length > filteredItems.length && (
            <span className="text-orange-600 dark:text-orange-400 ml-2">
              (скрыто {menuItems.length - filteredItems.length} по правам доступа)
            </span>
          )}
        </div>
      </div>

      {/* Предпросмотр */}
      <div className="p-4">
        {filteredItems.length === 0 ? (
          <div className="text-center py-8">
            <div className="text-4xl mb-4 flex justify-center">
              <FiEye size={64} className="text-body-color dark:text-dark-6" />
            </div>
            <h3 className="text-lg font-medium text-dark dark:text-white mb-2">
              Меню скрыто
            </h3>
            <p className="text-body-color dark:text-dark-6">
              Для роли "{userRole}" и языка "{language}" нет доступных пунктов меню
            </p>
          </div>
        ) : (
          <div className={`
            ${previewStyle === 'horizontal' ? 'flex flex-wrap gap-4' : 'space-y-1'}
            ${previewStyle === 'mobile' ? 'space-y-2' : ''}
          `}>
            {menuTree.map(item => renderPreviewItem(item))}
          </div>
        )}
      </div>

      {/* Информация о предпросмотре */}
      <div className="p-4 bg-gray-50 dark:bg-gray-800 border-t border-stroke dark:border-dark-3">
        <div className="flex items-start gap-3">
          <div className="text-blue-600 dark:text-blue-400 text-lg">
            <FiInfo size={20} />
          </div>
          <div className="text-sm text-body-color dark:text-dark-6">
            <p className="font-medium mb-1">Предпросмотр обновляется в реальном времени</p>
            <p>Изменения в меню мгновенно отражаются здесь. Проверьте, как меню выглядит для разных ролей пользователей.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MenuPreview;
