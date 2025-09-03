import React from 'react';
import { FiMoon, FiSun, FiGlobe } from 'react-icons/fi';
import { useCanvasTheme } from '../hooks/useCanvasTheme';

const SidebarControls: React.FC = () => {
  const { theme, toggleTheme } = useCanvasTheme();
  const [currentLanguage, setCurrentLanguage] = React.useState('ru');

  const languages = [
    { code: 'ru', name: 'Русский', flag: '🇷🇺' },
    { code: 'en', name: 'English', flag: '🇺🇸' },
    { code: 'es', name: 'Español', flag: '🇪🇸' },
    { code: 'fr', name: 'Français', flag: '🇫🇷' },
  ];

  const handleLanguageChange = (langCode: string) => {
    setCurrentLanguage(langCode);
    console.log('Switching language to:', langCode);
  };

  return (
    <div className="fixed bottom-6 left-6 bg-surface dark:bg-gray-800 rounded-lg shadow-xl border border-stroke dark:border-gray-700 p-4 space-y-4 z-50">
      {/* Переключатель темы */}
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-dark dark:text-white">Тема</span>
        <button
          onClick={toggleTheme}
          className={`relative inline-flex items-center h-6 w-11 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 ${
            theme === 'dark' ? 'bg-primary' : 'bg-gray-200'
          }`}
        >
          <span
            className={`inline-block w-4 h-4 rounded-full bg-white transition-transform ${
              theme === 'dark' ? 'translate-x-6' : 'translate-x-1'
            }`}
          />
        </button>
      </div>

      {/* Индикатор текущей темы */}
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

      <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
        {/* Выбор языка */}
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-dark dark:text-white">Язык</span>
          <select
            value={currentLanguage}
            onChange={(e) => handleLanguageChange(e.target.value)}
            className="w-full px-3 py-2 text-sm border border-stroke dark:border-gray-600 rounded-lg bg-surface dark:bg-gray-700 text-dark dark:text-white focus:border-primary focus:outline-none transition-colors"
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
      <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
        <div className="text-xs text-gray-500 dark:text-gray-400 space-y-1">
          <div>Situs Platform</div>
          <div>v1.0 © 2024</div>
        </div>
      </div>
    </div>
  );
};

export default SidebarControls;
