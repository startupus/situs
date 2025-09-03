import React from 'react';
import { MenuItemData } from '../../../types/menu';
import { FiBox, FiLink, FiFolder, FiMinus, FiGlobe, FiUsers, FiStar, FiSettings } from 'react-icons/fi';

/**
 * Компонент статистики меню
 * Отображает ключевые метрики выбранного типа меню
 */
interface MenuStatisticsProps {
  menuItems: MenuItemData[];
  className?: string;
}

const MenuStatistics: React.FC<MenuStatisticsProps> = ({ menuItems, className = '' }) => {
  const totalItems = menuItems.length;
  const publishedItems = menuItems.filter((item) => item.isPublished).length;
  const maxLevel = Math.max(...menuItems.map((item) => item.level), 0);
  const hiddenItems = totalItems - publishedItems;

  // Статистика по типам пунктов
  const typeStats = menuItems.reduce(
    (acc, item) => {
      acc[item.type] = (acc[item.type] || 0) + 1;
      return acc;
    },
    {} as Record<string, number>,
  );

  // Статистика по компонентам
  const componentStats = menuItems.reduce(
    (acc, item) => {
      if (item.component) {
        acc[item.component] = (acc[item.component] || 0) + 1;
      }
      return acc;
    },
    {} as Record<string, number>,
  );

  // Статистика по уровням доступа
  const accessStats = menuItems.reduce(
    (acc, item) => {
      acc[item.accessLevel] = (acc[item.accessLevel] || 0) + 1;
      return acc;
    },
    {} as Record<string, number>,
  );

  return (
    <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 ${className}`}>
      {/* Общая статистика */}
      <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
        <h4 className="font-medium text-blue-800 dark:text-blue-200 mb-1">Всего пунктов</h4>
        <p className="text-2xl font-bold text-blue-900 dark:text-blue-100">{totalItems}</p>
        <p className="text-xs text-blue-600 dark:text-blue-400 mt-1">{hiddenItems > 0 && `${hiddenItems} скрыто`}</p>
      </div>

      <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
        <h4 className="font-medium text-green-800 dark:text-green-200 mb-1">Опубликованных</h4>
        <p className="text-2xl font-bold text-green-900 dark:text-green-100">{publishedItems}</p>
        <p className="text-xs text-green-600 dark:text-green-400 mt-1">
          {totalItems > 0 ? `${Math.round((publishedItems / totalItems) * 100)}%` : '0%'}
        </p>
      </div>

      <div className="bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800 rounded-lg p-4">
        <h4 className="font-medium text-purple-800 dark:text-purple-200 mb-1">Уровней</h4>
        <p className="text-2xl font-bold text-purple-900 dark:text-purple-100">{maxLevel}</p>
        <p className="text-xs text-purple-600 dark:text-purple-400 mt-1">Максимальная глубина</p>
      </div>

      <div className="bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 rounded-lg p-4">
        <h4 className="font-medium text-orange-800 dark:text-orange-200 mb-1">Компоненты</h4>
        <p className="text-2xl font-bold text-orange-900 dark:text-orange-100">{Object.keys(componentStats).length}</p>
        <div className="text-xs text-orange-600 dark:text-orange-400 mt-1">
          {Object.entries(componentStats).map(([component, count]) => (
            <div key={component} className="flex justify-between">
              <span>{component}:</span>
              <span>{count}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Детальная статистика (занимает всю ширину) */}
      {totalItems > 0 && (
        <div className="md:col-span-2 lg:col-span-4 bg-gray-50 dark:bg-gray-900/20 border border-gray-200 dark:border-gray-800 rounded-lg p-4">
          <h4 className="font-medium text-gray-800 dark:text-gray-200 mb-3">Детальная статистика</h4>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            {/* По типам пунктов */}
            <div>
              <h5 className="font-medium text-gray-700 dark:text-gray-300 mb-2">По типам:</h5>
              {Object.entries(typeStats).map(([type, count]) => (
                <div key={type} className="flex justify-between items-center">
                  <span className="text-gray-600 dark:text-gray-400">
                    <span className="flex items-center gap-1">
                      {type === 'COMPONENT' ? (
                        <FiBox size={14} />
                      ) : type === 'URL' ? (
                        <FiLink size={14} />
                      ) : type === 'HEADING' ? (
                        <FiFolder size={14} />
                      ) : type === 'SEPARATOR' ? (
                        <FiMinus size={14} />
                      ) : null}
                      {type === 'COMPONENT'
                        ? 'Компонент'
                        : type === 'URL'
                          ? 'Ссылка'
                          : type === 'HEADING'
                            ? 'Заголовок'
                            : type === 'SEPARATOR'
                              ? 'Разделитель'
                              : type}
                      :
                    </span>
                  </span>
                  <span className="font-medium text-gray-800 dark:text-gray-200">{count}</span>
                </div>
              ))}
            </div>

            {/* По правам доступа */}
            <div>
              <h5 className="font-medium text-gray-700 dark:text-gray-300 mb-2">По доступу:</h5>
              {Object.entries(accessStats).map(([access, count]) => (
                <div key={access} className="flex justify-between items-center">
                  <span className="text-gray-600 dark:text-gray-400">
                    <span className="flex items-center gap-1">
                      {access === 'PUBLIC' ? (
                        <FiGlobe size={14} />
                      ) : access === 'REGISTERED' ? (
                        <FiUsers size={14} />
                      ) : access === 'SPECIAL' ? (
                        <FiStar size={14} />
                      ) : access === 'CUSTOM' ? (
                        <FiSettings size={14} />
                      ) : null}
                      {access === 'PUBLIC'
                        ? 'Публичный'
                        : access === 'REGISTERED'
                          ? 'Зарегистрированные'
                          : access === 'SPECIAL'
                            ? 'Специальный'
                            : access === 'CUSTOM'
                              ? 'Пользовательский'
                              : access}
                      :
                    </span>
                  </span>
                  <span className="font-medium text-gray-800 dark:text-gray-200">{count}</span>
                </div>
              ))}
            </div>

            {/* По языкам */}
            <div>
              <h5 className="font-medium text-gray-700 dark:text-gray-300 mb-2">По языкам:</h5>
              {Object.entries(
                menuItems.reduce(
                  (acc, item) => {
                    acc[item.language] = (acc[item.language] || 0) + 1;
                    return acc;
                  },
                  {} as Record<string, number>,
                ),
              ).map(([language, count]) => (
                <div key={language} className="flex justify-between items-center">
                  <span className="text-gray-600 dark:text-gray-400">
                    <span className="flex items-center gap-1">
                      <FiGlobe size={14} />
                      {language === '*'
                        ? 'Все языки'
                        : language === 'ru-RU'
                          ? 'Русский'
                          : language === 'en-GB'
                            ? 'English'
                            : language}
                      :
                    </span>
                  </span>
                  <span className="font-medium text-gray-800 dark:text-gray-200">{count}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MenuStatistics;
