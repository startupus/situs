import React, { useState } from 'react';
import { FiMenu, FiSearch, FiBell, FiChevronDown, FiSun, FiMoon } from 'react-icons/fi';
import SitusNotifications from './SitusNotifications';
import SitusUserDropdown from './SitusUserDropdown';
import SitusDarkModeToggle from '../UI/SitusDarkModeToggle';

/**
 * Интерфейс пропсов для хедера
 */
interface SitusHeaderProps {
  onMenuClick: () => void;
}

/**
 * SitusHeader - Верхняя панель интерфейса
 */
const SitusHeader: React.FC<SitusHeaderProps> = ({ onMenuClick }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserDropdown, setShowUserDropdown] = useState(false);

  return (
    <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Левая часть */}
          <div className="flex items-center">
            {/* Кнопка меню для мобильных */}
            <button
              onClick={onMenuClick}
              className="lg:hidden p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              <FiMenu className="h-6 w-6" />
            </button>

            {/* Поиск */}
            <div className="ml-4 flex-1 max-w-lg">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiSearch className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Поиск..."
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg leading-5 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent sm:text-sm"
                />
              </div>
            </div>
          </div>

          {/* Правая часть */}
          <div className="flex items-center space-x-4">
            {/* Переключатель темы */}
            <SitusDarkModeToggle />

            {/* Уведомления */}
            <div className="relative">
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="p-2 text-gray-400 hover:text-gray-500 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg relative"
              >
                <FiBell className="h-6 w-6" />
                {/* Индикатор новых уведомлений */}
                <span className="absolute top-1 right-1 block h-2 w-2 rounded-full bg-red-400 ring-2 ring-white dark:ring-gray-800"></span>
              </button>

              {/* Выпадающий список уведомлений */}
              {showNotifications && (
                <SitusNotifications 
                  onClose={() => setShowNotifications(false)}
                />
              )}
            </div>

            {/* Профиль пользователя */}
            <div className="relative">
              <button
                onClick={() => setShowUserDropdown(!showUserDropdown)}
                className="flex items-center text-sm rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 p-2"
              >
                <div className="h-8 w-8 rounded-full bg-gray-300 dark:bg-gray-600 flex items-center justify-center">
                  <span className="text-sm font-medium">U</span>
                </div>
                <span className="ml-2 hidden md:block">Пользователь</span>
                <FiChevronDown className="ml-1 h-4 w-4" />
              </button>

              {/* Выпадающий список пользователя */}
              {showUserDropdown && (
                <SitusUserDropdown 
                  onClose={() => setShowUserDropdown(false)}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default SitusHeader;