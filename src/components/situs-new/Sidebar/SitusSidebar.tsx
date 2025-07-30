import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  FiHome, 
  FiFolder, 
  FiUsers, 
  FiBarChart3, 
  FiX 
} from 'react-icons/fi';

/**
 * Интерфейс пропсов для боковой панели
 */
interface SitusSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

/**
 * Интерфейс элемента навигации
 */
interface NavigationItem {
  name: string;
  href: string;
  icon: React.ComponentType<any>;
}

/**
 * SitusSidebar - Боковая панель навигации
 */
const SitusSidebar: React.FC<SitusSidebarProps> = ({ isOpen, onClose }) => {
  // Элементы навигации
  const navigation: NavigationItem[] = [
    { name: 'Дашборд', href: '/', icon: FiHome },
    { name: 'Проекты', href: '/projects', icon: FiFolder },
    { name: 'Пользователи', href: '/users', icon: FiUsers },
    { name: 'Аналитика', href: '/analytics', icon: FiBarChart3 },
  ];

  return (
    <>
      {/* Оверлей для мобильных устройств */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black bg-opacity-25 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Боковая панель */}
      <div className={`
        fixed inset-y-0 left-0 z-50 w-64 bg-white dark:bg-gray-800 shadow-lg transform transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        lg:translate-x-0 lg:static lg:inset-0
      `}>
        {/* Заголовок */}
        <div className="flex items-center justify-between h-16 px-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="h-8 w-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">S</span>
              </div>
            </div>
            <div className="ml-3">
              <h1 className="text-lg font-semibold text-gray-900 dark:text-white">
                Situs
              </h1>
            </div>
          </div>
          
          {/* Кнопка закрытия (только на мобильных) */}
          <button
            onClick={onClose}
            className="lg:hidden p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            <FiX className="h-5 w-5" />
          </button>
        </div>

        {/* Навигация */}
        <nav className="flex-1 px-4 py-6 space-y-2">
          {navigation.map((item) => (
            <NavLink
              key={item.name}
              to={item.href}
              onClick={() => {
                // Закрываем мобильное меню при переходе
                if (window.innerWidth < 1024) {
                  onClose();
                }
              }}
              className={({ isActive }) =>
                `group flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors duration-200 ${
                  isActive
                    ? 'bg-blue-50 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300'
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white'
                }`
              }
            >
              <item.icon
                className="mr-3 h-5 w-5 flex-shrink-0"
                aria-hidden="true"
              />
              {item.name}
            </NavLink>
          ))}
        </nav>

        {/* Подвал */}
        <div className="p-4 border-t border-gray-200 dark:border-gray-700">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="h-8 w-8 bg-gray-300 dark:bg-gray-600 rounded-full flex items-center justify-center">
                <span className="text-xs font-medium text-gray-700 dark:text-gray-300">
                  U
                </span>
              </div>
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-900 dark:text-white">
                Пользователь
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                user@example.com
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default SitusSidebar;