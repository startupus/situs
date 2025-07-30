import React from 'react';
import { FiSun, FiMoon } from 'react-icons/fi';
import { useTheme } from '../../../hooks/useTheme';

/**
 * SitusDarkModeToggle - Переключатель темной темы
 */
const SitusDarkModeToggle: React.FC = () => {
  const { theme, setTheme, resolvedTheme } = useTheme();

  const toggleTheme = () => {
    setTheme(resolvedTheme === 'dark' ? 'light' : 'dark');
  };

  return (
    <button
      onClick={toggleTheme}
      className="p-2 text-gray-400 hover:text-gray-500 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors duration-200"
      title={resolvedTheme === 'dark' ? 'Переключить на светлую тему' : 'Переключить на темную тему'}
    >
      {resolvedTheme === 'dark' ? (
        <FiSun className="h-5 w-5" />
      ) : (
        <FiMoon className="h-5 w-5" />
      )}
    </button>
  );
};

export default SitusDarkModeToggle;