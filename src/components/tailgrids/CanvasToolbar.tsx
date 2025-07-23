import React, { useState } from 'react';
import { FaMobile, FaTabletAlt, FaDesktop, FaCode, FaSun, FaMoon } from 'react-icons/fa';
import { useCanvasTheme } from '../../hooks/useCanvasTheme';

interface Language {
  id: string;
  code: string;
  name: string;
  flag: string;
  isDefault?: boolean;
}

interface CanvasToolbarProps {
  currentDevice: 'mobile' | 'tablet' | 'desktop';
  onDeviceChange: (device: 'mobile' | 'tablet' | 'desktop') => void;
  onLanguageChange?: (languageCode: string) => void;
  onPreview?: () => void;
  onCode?: () => void;
  onUndo?: () => void;
  onRedo?: () => void;
  onSave?: () => void;
}

const CanvasToolbar: React.FC<CanvasToolbarProps> = ({ 
  currentDevice, 
  onDeviceChange,
  onLanguageChange,
  onPreview,
  onCode,
  onUndo,
  onRedo,
  onSave
}) => {
  const { theme, resolvedTheme, toggleTheme } = useCanvasTheme();
  const [showCode, setShowCode] = useState(false);
  const [currentLanguageId, setCurrentLanguageId] = useState('ru');

  // Языки по умолчанию
  const [languages, setLanguages] = useState<Language[]>([
    { id: 'ru', code: 'ru', name: 'Russian', flag: '🇷🇺', isDefault: true },
    { id: 'en', code: 'en', name: 'English', flag: '🇺🇸' },
    { id: 'de', code: 'de', name: 'German', flag: '🇩🇪' }
  ]);

  const toggleCodeView = () => {
    setShowCode(!showCode);
    onCode?.();
  };

  const handleLanguageChange = (languageId: string) => {
    setCurrentLanguageId(languageId);
    const language = languages.find(lang => lang.id === languageId);
    if (language && onLanguageChange) {
      onLanguageChange(language.code);
    }
  };

  const addNewLanguage = () => {
    const newLanguage: Language = {
      id: `lang-${Date.now()}`,
      code: 'new',
      name: 'New Language',
      flag: '🌐'
    };
    setLanguages([...languages, newLanguage]);
    setCurrentLanguageId(newLanguage.id);
  };

  const removeLanguage = (languageId: string, event: React.MouseEvent) => {
    event.stopPropagation();
    const languageToRemove = languages.find(lang => lang.id === languageId);
    
    if (languageToRemove && !languageToRemove.isDefault) {
      const updatedLanguages = languages.filter(lang => lang.id !== languageId);
      setLanguages(updatedLanguages);
      
      // Если удаляем текущий язык, переключаемся на дефолтный
      if (currentLanguageId === languageId) {
        const defaultLang = updatedLanguages.find(lang => lang.isDefault);
        if (defaultLang) {
          setCurrentLanguageId(defaultLang.id);
          if (onLanguageChange) {
            onLanguageChange(defaultLang.code);
          }
        }
      }
    }
  };

  const getThemeIcon = () => {
    if (theme === 'system') {
      return <FaMoon size={11} />;
    } else if (resolvedTheme === 'dark') {
      return <FaSun size={11} />;
    } else {
      return <FaMoon size={11} />;
    }
  };

  const getThemeLabel = () => {
    if (theme === 'system') {
      return `Система (${resolvedTheme === 'dark' ? 'темная' : 'светлая'})`;
    } else if (resolvedTheme === 'dark') {
      return 'Светлая тема';
    } else {
      return 'Темная тема';
    }
  };

  return (
    <div 
      className="redaktus-canvas-toolbar border-b px-4 py-2 transition-colors duration-200"
    >
      <div className="flex items-center justify-between">
        {/* Левая часть - компактные языковые вкладки */}
        <div className="flex items-center space-x-1">
          {languages.map((lang) => (
            <div
              key={lang.id}
              className="relative group"
            >
              <button
                onClick={() => handleLanguageChange(lang.id)}
                className={`flex items-center justify-center w-8 h-8 rounded text-sm transition-colors ${
                  currentLanguageId === lang.id
                    ? 'bg-white text-gray-700 shadow-sm dark:bg-gray-600 dark:text-gray-200'
                    : 'text-gray-600 hover:text-gray-800 hover:bg-gray-200 dark:text-gray-300 dark:hover:text-gray-100 dark:hover:bg-gray-700'
                }`}
                title={lang.name}
              >
                <span>{lang.flag}</span>
              </button>
              
              {/* Кнопка удаления только для активной не-дефолтной вкладки */}
              {currentLanguageId === lang.id && !lang.isDefault && (
                <div
                  onClick={(e) => removeLanguage(lang.id, e)}
                  className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600 cursor-pointer"
                  title={`Remove ${lang.name}`}
                >
                  <span 
                    className="text-xs font-bold leading-none" 
                    style={{ display: 'block', lineHeight: '1' }}
                  >
                    ×
                  </span>
                </div>
              )}
            </div>
          ))}
          
          {/* Кнопка добавления с нормальной иконкой */}
          <button
            onClick={addNewLanguage}
            className="flex items-center justify-center w-8 h-8 rounded transition-colors text-gray-600 hover:text-gray-800 hover:bg-gray-200 dark:text-gray-300 dark:hover:text-gray-100 dark:hover:bg-gray-700 border border-dashed border-gray-400 dark:border-gray-500"
            style={{ minWidth: '32px', minHeight: '32px' }}
            title="Add new language"
          >
            <span 
              className="text-lg font-bold leading-none" 
              style={{ display: 'block', lineHeight: '1' }}
            >
              +
            </span>
          </button>
        </div>

        {/* Центральная часть - заголовок */}
        <div className="flex-1 text-center">
          <h2 className="text-base font-semibold transition-colors duration-200 text-gray-800 dark:text-gray-100">
            Page Editor
          </h2>
        </div>

        {/* Правая часть - варианты демонстрации */}
        <div className="flex items-center space-x-1">
          <DeviceButton
            icon={<FaMobile size={11} />}
            active={currentDevice === 'mobile'}
            onClick={() => onDeviceChange('mobile')}
            title="Mobile view"
          />
          <DeviceButton
            icon={<FaTabletAlt size={11} />}
            active={currentDevice === 'tablet'}
            onClick={() => onDeviceChange('tablet')}
            title="Tablet view"
          />
          <DeviceButton
            icon={<FaDesktop size={11} />}
            active={currentDevice === 'desktop'}
            onClick={() => onDeviceChange('desktop')}
            title="Desktop view"
          />
          <div className="w-px h-5 mx-1 bg-gray-300 dark:bg-gray-600"></div>
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              console.log('🎨 CanvasToolbar: Theme toggle clicked');
              toggleTheme();
            }}
            className={`p-1.5 rounded transition-colors border border-gray-300 dark:border-gray-600 ${
              resolvedTheme === 'dark'
                ? 'bg-gray-100 text-gray-700 dark:bg-gray-600 dark:text-gray-200' 
                : 'text-gray-600 hover:text-gray-800 hover:bg-gray-200 dark:text-gray-300 dark:hover:text-gray-100 dark:hover:bg-gray-700'
            }`}
            title={`Текущая тема канваса: ${getThemeLabel()}. Нажмите для смены.`}
            style={{ minWidth: '32px', minHeight: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
          >
            {getThemeIcon()}
          </button>
          <button
            onClick={toggleCodeView}
            className={`p-1.5 rounded transition-colors ${
              showCode 
                ? 'bg-gray-100 text-gray-700 dark:bg-gray-600 dark:text-gray-200' 
                : 'text-gray-600 hover:text-gray-800 hover:bg-gray-200 dark:text-gray-300 dark:hover:text-gray-100 dark:hover:bg-gray-700'
            }`}
            title="Toggle code view"
          >
            <FaCode size={11} />
          </button>
        </div>
      </div>
    </div>
  );
};

const DeviceButton: React.FC<{
  icon: React.ReactNode;
  active?: boolean;
  onClick?: () => void;
  title?: string;
}> = ({ icon, active = false, onClick, title }) => {
  return (
    <button
      onClick={onClick}
      className={`p-1.5 rounded transition-colors ${
        active 
          ? 'bg-gray-100 text-gray-700 dark:bg-gray-600 dark:text-gray-200'
          : 'text-gray-600 hover:text-gray-800 hover:bg-gray-200 dark:text-gray-300 dark:hover:text-gray-100 dark:hover:bg-gray-700'
      }`}
      title={title}
    >
      {icon}
    </button>
  );
};

export default CanvasToolbar; 