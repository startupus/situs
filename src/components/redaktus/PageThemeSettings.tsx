import React from 'react';
import { useTranslation } from 'react-i18next';
import { useProjectTheme } from '../../contexts/ProjectThemeContext';
import { FaPalette, FaEye, FaCog } from 'react-icons/fa';

const PageThemeSettings: React.FC = () => {
  const { t } = useTranslation();
  const { 
    theme, 
    isDarkMode, 
    inheritFromSite, 
    customColors,
    setTheme, 
    setInheritFromSite, 
    setCustomColors 
  } = useProjectTheme();

  const handleThemeChange = (newTheme: string) => {
    setTheme(newTheme as any);
  };

  const handleInheritChange = (inherit: boolean) => {
    setInheritFromSite(inherit);
  };

  const handleColorChange = (colorType: string, value: string) => {
    setCustomColors({
      ...customColors,
      [colorType]: value
    });
  };

  return (
    <div className="space-y-6">
      {/* Заголовок секции */}
      <div className="flex items-center space-x-2">
        <FaPalette className="text-gray-500" />
        <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">
          {t('editor.settings.page.theme.title')}
        </h4>
      </div>

      {/* Наследование от сайта */}
      <div className="space-y-3">
        <label className="flex items-center space-x-2">
          <input
            type="checkbox"
            checked={inheritFromSite}
            onChange={(e) => handleInheritChange(e.target.checked)}
            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
          />
          <span className="text-sm text-gray-600 dark:text-gray-400">
            {t('editor.settings.page.theme.inheritFromSite')}
          </span>
        </label>
      </div>

      {/* Выбор темы */}
      {!inheritFromSite && (
        <div className="space-y-3">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            {t('editor.settings.page.theme.pageTheme')}
          </label>
          <select
            value={theme}
            onChange={(e) => handleThemeChange(e.target.value)}
            className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
          >
            <option value="inherit">{t('editor.settings.page.theme.inheritFromSite')}</option>
            <option value="system">{t('editor.settings.page.theme.systemTheme')}</option>
            <option value="light">{t('editor.settings.page.theme.lightTheme')}</option>
            <option value="dark">{t('editor.settings.page.theme.darkTheme')}</option>
          </select>
        </div>
      )}

      {/* Кастомные цвета */}
      {!inheritFromSite && theme !== 'inherit' && (
        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <FaCog className="text-gray-500" />
            <h5 className="text-sm font-medium text-gray-700 dark:text-gray-300">
              {t('editor.settings.page.theme.customTheme')}
            </h5>
          </div>
          
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs text-gray-600 dark:text-gray-400 mb-1">
                Primary
              </label>
              <input
                type="color"
                value={customColors?.primary || '#3b82f6'}
                onChange={(e) => handleColorChange('primary', e.target.value)}
                className="w-full h-8 rounded border border-gray-300 cursor-pointer"
              />
            </div>
            
            <div>
              <label className="block text-xs text-gray-600 dark:text-gray-400 mb-1">
                Secondary
              </label>
              <input
                type="color"
                value={customColors?.secondary || '#6b7280'}
                onChange={(e) => handleColorChange('secondary', e.target.value)}
                className="w-full h-8 rounded border border-gray-300 cursor-pointer"
              />
            </div>
            
            <div>
              <label className="block text-xs text-gray-600 dark:text-gray-400 mb-1">
                Accent
              </label>
              <input
                type="color"
                value={customColors?.accent || '#10b981'}
                onChange={(e) => handleColorChange('accent', e.target.value)}
                className="w-full h-8 rounded border border-gray-300 cursor-pointer"
              />
            </div>
            
            <div>
              <label className="block text-xs text-gray-600 dark:text-gray-400 mb-1">
                Background
              </label>
              <input
                type="color"
                value={customColors?.background || '#ffffff'}
                onChange={(e) => handleColorChange('background', e.target.value)}
                className="w-full h-8 rounded border border-gray-300 cursor-pointer"
              />
            </div>
            
            <div className="col-span-2">
              <label className="block text-xs text-gray-600 dark:text-gray-400 mb-1">
                Text
              </label>
              <input
                type="color"
                value={customColors?.text || '#1f2937'}
                onChange={(e) => handleColorChange('text', e.target.value)}
                className="w-full h-8 rounded border border-gray-300 cursor-pointer"
              />
            </div>
          </div>
        </div>
      )}

      {/* Предварительный просмотр */}
      <div className="space-y-2">
        <div className="flex items-center space-x-2">
          <FaEye className="text-gray-500" />
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Preview
          </span>
        </div>
        <div 
          className="w-full h-16 rounded border border-gray-300 p-3 text-sm"
          style={{
            backgroundColor: customColors?.background || '#ffffff',
            color: customColors?.text || '#1f2937'
          }}
        >
          <div className="flex items-center space-x-2">
            <div 
              className="w-4 h-4 rounded"
              style={{ backgroundColor: customColors?.primary || '#3b82f6' }}
            />
            <span>Primary Color</span>
            <div 
              className="w-4 h-4 rounded"
              style={{ backgroundColor: customColors?.secondary || '#6b7280' }}
            />
            <span>Secondary</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PageThemeSettings;
