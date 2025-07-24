import React from 'react';
import { useTheme } from '../hooks/useTheme';
import { FiSun, FiMoon, FiMonitor } from 'react-icons/fi';

const ThemeToggle: React.FC = () => {
  const { theme, resolvedTheme, toggleTheme } = useTheme();

  const getIcon = () => {
    if (theme === 'system') {
      return <FiMonitor className="w-4 h-4" />;
    } else if (resolvedTheme === 'dark') {
      return <FiSun className="w-4 h-4" />;
    } else {
      return <FiMoon className="w-4 h-4" />;
    }
  };

  const getLabel = () => {
    if (theme === 'system') {
      return `Система (${resolvedTheme === 'dark' ? 'темная' : 'светлая'})`;
    } else if (resolvedTheme === 'dark') {
      return 'Светлая тема';
    } else {
      return 'Темная тема';
    }
  };

  return (
    <button
      onClick={toggleTheme}
      className="flex items-center space-x-2 px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md transition-colors duration-200"
      title={getLabel()}
    >
      {getIcon()}
      <span>{getLabel()}</span>
    </button>
  );
};

export default ThemeToggle; 