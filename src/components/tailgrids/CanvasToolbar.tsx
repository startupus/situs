import React, { useState } from 'react';
import { FaMobile, FaDesktop, FaTabletAlt, FaMoon, FaCode, FaPlus } from 'react-icons/fa';

interface CanvasToolbarProps {
  currentDevice: 'mobile' | 'tablet' | 'desktop';
  onDeviceChange: (device: 'mobile' | 'tablet' | 'desktop') => void;
}

const CanvasToolbar: React.FC<CanvasToolbarProps> = ({ currentDevice, onDeviceChange }) => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [currentLanguage, setCurrentLanguage] = useState('ru');
  const [showCode, setShowCode] = useState(false);

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    // Здесь можно добавить логику для переключения темы контента
  };

  const toggleCodeView = () => {
    setShowCode(!showCode);
    // Здесь можно добавить логику для показа кода страницы
  };

  const languages = [
    { code: 'ru', name: 'Русский', flag: '🇷🇺' },
    { code: 'en', name: 'English', flag: '🇺🇸' },
    { code: 'de', name: 'Deutsch', flag: '🇩🇪' },
  ];

  return (
    <div className="bg-gray-100 border-b border-gray-200 px-4 py-2">
      <div className="flex items-center justify-between">
        {/* Левая часть - языковые флажки */}
        <div className="flex items-center space-x-2">
          <div className="flex items-center space-x-1">
            {languages.map((lang) => (
              <button
                key={lang.code}
                onClick={() => setCurrentLanguage(lang.code)}
                className={`flex items-center justify-center w-7 h-7 rounded-md text-sm transition-colors ${
                  currentLanguage === lang.code
                    ? 'bg-blue-100 text-blue-700 border border-blue-300'
                    : 'text-gray-600 hover:bg-gray-200 border border-transparent'
                }`}
                title={lang.name}
              >
                {lang.flag}
              </button>
            ))}
            <button
              className="flex items-center justify-center w-7 h-7 text-gray-600 hover:text-gray-800 hover:bg-gray-200 rounded-md transition-colors border border-gray-400"
              title="Add new language"
            >
              <FaPlus size={12} />
            </button>
          </div>
        </div>

        {/* Центральная часть - заголовок */}
        <div className="flex-1 text-center">
          <h2 className="text-base font-semibold text-gray-800">Page Editor</h2>
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
          <div className="w-px h-5 bg-gray-300 mx-1"></div>
          <button
            onClick={toggleDarkMode}
            className={`p-1.5 rounded transition-colors ${
              isDarkMode 
                ? 'bg-gray-800 text-white' 
                : 'text-gray-600 hover:text-gray-800 hover:bg-gray-200'
            }`}
            title="Toggle dark mode"
          >
            <FaMoon size={11} />
          </button>
          <div className="w-px h-5 bg-gray-300 mx-1"></div>
          <button
            onClick={toggleCodeView}
            className={`p-1.5 rounded transition-colors ${
              showCode 
                ? 'bg-blue-100 text-blue-600 border border-blue-300' 
                : 'text-gray-600 hover:text-gray-800 hover:bg-gray-200'
            }`}
            title="Show code"
          >
            <FaCode size={11} />
          </button>
        </div>
      </div>
    </div>
  );
};

// Компонент для кнопки устройства
const DeviceButton: React.FC<{
  icon: React.ReactNode;
  active?: boolean;
  onClick?: () => void;
  title?: string;
}> = ({ icon, active = false, onClick, title }) => {
  return (
    <button
      onClick={onClick}
      title={title}
      className={`p-1.5 rounded transition-colors ${
        active 
          ? 'bg-blue-100 text-blue-600 border border-blue-300' 
          : 'text-gray-600 hover:text-gray-800 hover:bg-gray-200'
      }`}
    >
      {icon}
    </button>
  );
};

export default CanvasToolbar; 