import React, { useState } from 'react';
import { FaMobile, FaDesktop, FaTabletAlt, FaMoon, FaCode, FaPlus } from 'react-icons/fa';


interface CanvasToolbarProps {
  currentDevice: 'mobile' | 'tablet' | 'desktop';
  onDeviceChange: (device: 'mobile' | 'tablet' | 'desktop') => void;
  onPreview?: () => void;
  onCode?: () => void;
  onUndo?: () => void;
  onRedo?: () => void;
  onSave?: () => void;
}

const CanvasToolbar: React.FC<CanvasToolbarProps> = ({ 
  currentDevice, 
  onDeviceChange,
  onPreview,
  onCode,
  onUndo,
  onRedo,
  onSave
}) => {
  const [currentLanguage, setCurrentLanguage] = useState('ru');
  const [showCode, setShowCode] = useState(false);

  const toggleCodeView = () => {
    setShowCode(!showCode);
    onCode?.();
  };

  const languages = [
    { code: 'ru', name: 'Русский', flag: '🇷🇺' },
    { code: 'en', name: 'English', flag: '🇺🇸' },
    { code: 'de', name: 'Deutsch', flag: '🇩🇪' },
  ];

  return (
    <div 
      className="redaktus-canvas-toolbar border-b px-4 py-2 transition-colors duration-200 bg-gray-100 border-gray-200 dark:bg-gray-800 dark:border-gray-700"
    >
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
                    ? 'bg-gray-100 text-gray-700 border border-gray-300 dark:bg-gray-600 dark:text-gray-200 dark:border-gray-500'
                    : 'text-gray-600 hover:bg-gray-200 border border-transparent dark:text-gray-300 dark:hover:bg-gray-700'
                }`}
                title={lang.name}
              >
                {lang.flag}
              </button>
            ))}
            <button
              className="flex items-center justify-center w-7 h-7 rounded-md transition-colors border text-gray-600 hover:text-gray-800 hover:bg-gray-200 border-gray-400 dark:text-gray-300 dark:hover:text-gray-100 dark:hover:bg-gray-700 dark:border-gray-600"
              title="Add new language"
            >
              <FaPlus size={12} />
            </button>
          </div>
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