import React, { useState } from 'react';
import { FaMobile, FaTabletAlt, FaDesktop, FaCode, FaSun, FaMoon } from 'react-icons/fa';
import { useCanvasTheme } from '../../hooks/useCanvasTheme';
import { useLanguage } from '../../contexts/LanguageContext';

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
  const { theme: canvasTheme, resolvedTheme: canvasResolvedTheme, toggleTheme: toggleCanvasTheme } = useCanvasTheme();
  const { language, setLanguage, t } = useLanguage();
  const [showCode, setShowCode] = useState(false);

  // Языки по умолчанию
  const languages: Language[] = [
    { id: 'ru', code: 'ru', name: 'Russian', flag: '🇷🇺', isDefault: true },
    { id: 'en', code: 'en', name: 'English', flag: '🇺🇸' },
    { id: 'de', code: 'de', name: 'German', flag: '🇩🇪' }
  ];

  const toggleCodeView = () => {
    setShowCode(!showCode);
    onCode?.();
  };

  const handleLanguageChange = (languageCode: string) => {
    setLanguage(languageCode as any);
    if (onLanguageChange) {
      onLanguageChange(languageCode);
    }
  };

  const getCanvasThemeIcon = () => {
    // Простое переключение только между light и dark
    return canvasResolvedTheme === 'light' ? <FaMoon size={11} /> : <FaSun size={11} />;
  };

  const getCanvasThemeLabel = () => {
    // Простое переключение только между light и dark
    return canvasResolvedTheme === 'light' 
      ? 'Текущая тема канваса: Светлая → Темная. Нажмите для смены.'
      : 'Текущая тема канваса: Темная → Светлая. Нажмите для смены.';
  };





  return (
    <div 
      className="redaktus-canvas-toolbar border-b px-4 py-3 transition-colors duration-200 bg-white dark:bg-gray-800 shadow-sm border-gray-200 dark:border-gray-700 font-inter"
      style={{ zIndex: 10 }}
    >
      <div className="flex items-center justify-between">
        {/* Левая часть - компактные языковые вкладки */}
        <div className="flex items-center space-x-1">
          {languages.map((lang) => (
            <button
              key={lang.id}
              onClick={() => handleLanguageChange(lang.code)}
              className={`flex items-center justify-center w-8 h-8 rounded text-sm transition-colors ${
                language === lang.code
                  ? 'bg-white text-gray-700 shadow-sm dark:bg-gray-600 dark:text-gray-200'
                  : 'text-gray-600 hover:text-gray-800 hover:bg-gray-200 dark:text-gray-300 dark:hover:text-gray-100 dark:hover:bg-gray-700'
              }`}
              title={lang.name}
            >
              <span>{lang.flag}</span>
            </button>
          ))}
        </div>

        {/* Центральная часть - заголовок */}
        <div className="flex-1 text-center">
          <h2 className="text-base font-semibold transition-colors duration-200 text-gray-800 dark:text-gray-100">
            {t('editor.title')}
          </h2>
        </div>

        {/* Правая часть - варианты демонстрации */}
        <div className="flex items-center space-x-1">
          <DeviceButton
            icon={<FaMobile size={11} />}
            active={currentDevice === 'mobile'}
            onClick={() => onDeviceChange('mobile')}
            title={t('editor.canvas.toolbar.device.mobile')}
          />
          <DeviceButton
            icon={<FaTabletAlt size={11} />}
            active={currentDevice === 'tablet'}
            onClick={() => onDeviceChange('tablet')}
            title={t('editor.canvas.toolbar.device.tablet')}
          />
          <DeviceButton
            icon={<FaDesktop size={11} />}
            active={currentDevice === 'desktop'}
            onClick={() => onDeviceChange('desktop')}
            title={t('editor.canvas.toolbar.device.desktop')}
          />
          <div className="w-px h-5 mx-1 bg-gray-300 dark:bg-gray-600"></div>
          {/* Кнопка переключения темы канваса */}
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              console.log('🎨 CanvasToolbar: Canvas theme toggle clicked');
              toggleCanvasTheme();
            }}
            className={`p-1.5 rounded transition-colors border border-gray-300 dark:border-gray-600 ${
              canvasResolvedTheme === 'dark'
                ? 'bg-gray-100 text-gray-700 dark:bg-gray-600 dark:text-gray-200' 
                : 'text-gray-600 hover:text-gray-800 hover:bg-gray-200 dark:text-gray-300 dark:hover:text-gray-100 dark:hover:bg-gray-700'
            }`}
            title={getCanvasThemeLabel()}
            style={{ minWidth: '32px', minHeight: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
          >
            {getCanvasThemeIcon()}
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