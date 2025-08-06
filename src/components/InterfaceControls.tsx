import React from 'react';
import { FiMoon, FiSun, FiGlobe } from 'react-icons/fi';
import { useCanvasTheme } from '../hooks/useCanvasTheme';

interface InterfaceControlsProps {
  collapsed?: boolean;
}

const InterfaceControls: React.FC<InterfaceControlsProps> = ({ collapsed = false }) => {
  const { theme, toggleTheme } = useCanvasTheme();
  const [currentLanguage, setCurrentLanguage] = React.useState('ru');

  const languages = [
    { code: 'ru', name: 'Русский', flag: '🇷🇺' },
    { code: 'en', name: 'English', flag: '🇺🇸' },
    { code: 'es', name: 'Español', flag: '🇪🇸' },
    { code: 'fr', name: 'Français', flag: '🇫🇷' }
  ];

  const currentLang = languages.find(lang => lang.code === currentLanguage) || languages[0];

  const handleLanguageChange = (langCode: string) => {
    setCurrentLanguage(langCode);
    // Здесь будет логика смены языка
    console.log('Switching language to:', langCode);
  };

  if (collapsed) {
    return (
      <div className="p-2 space-y-2">
        {/* Тема */}
        <button
          onClick={toggleTheme}
          className="w-full flex items-center justify-center p-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
          title={theme === 'dark' ? 'Светлая тема' : 'Темная тема'}
        >
          {theme === 'dark' ? (
            <FiSun className="w-5 h-5" />
          ) : (
            <FiMoon className="w-5 h-5" />
          )}
        </button>
        
        {/* Язык */}
        <div className="relative group">
          <button
            className="w-full flex items-center justify-center p-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
            title="Язык интерфейса"
          >
            <FiGlobe className="w-5 h-5" />
          </button>
          
          {/* Выпадающее меню языков */}
          <div className="absolute bottom-full left-0 mb-2 w-48 bg-surface dark:bg-gray-800 rounded-lg shadow-xl border border-stroke dark:border-gray-700 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
            <div className="p-3">
              <h3 className="text-sm font-medium text-dark dark:text-white mb-2">Настройки интерфейса</h3>
              <p className="text-xs text-body-color dark:text-gray-400 mb-3">
                Управление темой и языком интерфейса
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 border-t border-gray-200 dark:border-gray-700 space-y-3">
      {/* Переключатель темы */}
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
          Тема интерфейса
        </span>
        <button
          onClick={toggleTheme}
          className={`relative inline-flex items-center h-6 w-11 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
            theme === 'dark'
              ? 'bg-blue-600'
              : 'bg-gray-200'
          }`}
        >
          <span
            className={`inline-block w-4 h-4 rounded-full bg-white transition-transform ${
              theme === 'dark' ? 'translate-x-6' : 'translate-x-1'
            }`}
          />
        </button>
      </div>

      {/* Текущая тема */}
      <div className="flex items-center space-x-2 text-xs text-gray-500 dark:text-gray-400">
        {theme === 'dark' ? (
          <>
            <FiMoon className="w-4 h-4" />
            <span>Темная тема</span>
          </>
        ) : (
          <>
            <FiSun className="w-4 h-4" />
            <span>Светлая тема</span>
          </>
        )}
      </div>

      {/* Выбор языка */}
      <div className="space-y-2">
        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
          Язык интерфейса
        </span>
        
        <div className="relative">
          <select
            value={currentLanguage}
            onChange={(e) => handleLanguageChange(e.target.value)}
            className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            {languages.map((lang) => (
              <option key={lang.code} value={lang.code}>
                {lang.flag} {lang.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Информация о версии */}
      <div className="pt-2 border-t border-gray-200 dark:border-gray-700">
        <div className="text-xs text-gray-500 dark:text-gray-400 space-y-1">
          <div>Situs Platform v1.0</div>
          <div>© 2024 Стартапус</div>
        </div>
      </div>
    </div>
  );
};

export default InterfaceControls; 