import React, { useEffect, useRef } from 'react';
import { FiUser, FiSettings, FiLogOut, FiX } from 'react-icons/fi';

/**
 * Интерфейс пропсов для выпадающего меню пользователя
 */
interface SitusUserDropdownProps {
  onClose: () => void;
}

/**
 * SitusUserDropdown - Выпадающее меню пользователя
 */
const SitusUserDropdown: React.FC<SitusUserDropdownProps> = ({ onClose }) => {
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Закрытие при клике вне области
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [onClose]);

  // Обработчики действий
  const handleProfile = () => {
    console.log('Opening profile...');
    onClose();
  };

  const handleSettings = () => {
    console.log('Opening settings...');
    onClose();
  };

  const handleLogout = () => {
    console.log('Logging out...');
    onClose();
  };

  return (
    <div
      ref={dropdownRef}
      className="absolute right-0 mt-2 w-56 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-50"
    >
      {/* Информация о пользователе */}
      <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center">
          <div className="h-10 w-10 rounded-full bg-gray-300 dark:bg-gray-600 flex items-center justify-center">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">U</span>
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

      {/* Меню действий */}
      <div className="py-1">
        <button
          onClick={handleProfile}
          className="flex items-center w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
        >
          <FiUser className="mr-3 h-4 w-4" />
          Профиль
        </button>

        <button
          onClick={handleSettings}
          className="flex items-center w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
        >
          <FiSettings className="mr-3 h-4 w-4" />
          Настройки
        </button>

        <div className="border-t border-gray-200 dark:border-gray-700 my-1"></div>

        <button
          onClick={handleLogout}
          className="flex items-center w-full px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-700"
        >
          <FiLogOut className="mr-3 h-4 w-4" />
          Выйти
        </button>
      </div>
    </div>
  );
};

export default SitusUserDropdown;