import React, { useState } from 'react';
import { useInterfaceTheme } from '../../hooks/useInterfaceTheme';
import { FiMonitor, FiSun, FiMoon, FiSettings, FiEye, FiZap, FiGrid, FiEdit, FiBox } from 'react-icons/fi';

/**
 * Компонент настроек интерфейса редактора
 * Позволяет управлять темой интерфейса редактора отдельно от темы сайта
 */
const EditorInterfaceSettings: React.FC = () => {
  const {
    theme: interfaceTheme,
    toggleTheme: toggleInterfaceTheme,
    resolvedTheme: interfaceResolvedTheme,
  } = useInterfaceTheme();

  const [activeTab, setActiveTab] = useState<'theme' | 'appearance' | 'layout' | 'typography' | 'animations'>('theme');
  const [settings, setSettings] = useState({
    // Настройки внешнего вида
    contrast: 'medium', // low, medium, high
    saturation: 'normal', // muted, normal, vibrant
    borderStyle: 'solid', // solid, dashed, dotted
    borderWidth: '1px',
    borderRadius: '8px',

    // Настройки макета
    sidebarWidth: '280px',
    panelSpacing: '16px',
    contentPadding: '24px',

    // Настройки типографики
    fontSize: '14px',
    lineHeight: '1.5',
    fontFamily: 'Inter, system-ui, sans-serif',

    // Настройки анимаций
    animationsEnabled: true,
    animationSpeed: 'normal', // slow, normal, fast
    reducedMotion: false,
  });

  const handleSettingChange = (key: string, value: any) => {
    setSettings((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const applySettings = () => {
    // Применяем настройки к интерфейсу редактора
    const root = document.documentElement;

    // Применяем CSS переменные
    root.style.setProperty('--interface-border-width', settings.borderWidth);
    root.style.setProperty('--interface-border-radius', settings.borderRadius);
    root.style.setProperty('--interface-font-size', settings.fontSize);
    root.style.setProperty('--interface-line-height', settings.lineHeight);
    root.style.setProperty('--interface-font-family', settings.fontFamily);

    // Сохраняем в localStorage
    localStorage.setItem('editor-interface-settings', JSON.stringify(settings));
  };

  const resetToDefault = () => {
    const defaultSettings = {
      contrast: 'medium',
      saturation: 'normal',
      borderStyle: 'solid',
      borderWidth: '1px',
      borderRadius: '8px',
      sidebarWidth: '280px',
      panelSpacing: '16px',
      contentPadding: '24px',
      fontSize: '14px',
      lineHeight: '1.5',
      fontFamily: 'Inter, system-ui, sans-serif',
      animationsEnabled: true,
      animationSpeed: 'normal',
      reducedMotion: false,
    };

    setSettings(defaultSettings);
    localStorage.setItem('editor-interface-settings', JSON.stringify(defaultSettings));
  };

  return (
    <div className="bg-white dark:bg-dark-2 rounded-lg p-6 space-y-6">
      {/* Заголовок */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-dark dark:text-white">Настройки интерфейса редактора</h2>
          <p className="text-body-color dark:text-dark-6 mt-1">
            Управление внешним видом и поведением интерфейса редактора
          </p>
        </div>

        {/* Переключатель темы интерфейса */}
        <div className="flex items-center space-x-3">
          <span className="text-sm text-body-color dark:text-dark-6">Тема интерфейса:</span>
          <button
            onClick={toggleInterfaceTheme}
            className="flex items-center space-x-2 px-4 py-2 rounded-lg bg-gray-100 dark:bg-dark text-dark dark:text-white hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
            title={`Переключить тему интерфейса (текущая: ${interfaceResolvedTheme === 'dark' ? 'темная' : 'светлая'})`}
          >
            {interfaceResolvedTheme === 'dark' ? (
              <>
                <FiSun size={16} />
                <span>Светлая</span>
              </>
            ) : (
              <>
                <FiMoon size={16} />
                <span>Темная</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Табы */}
      <div className="border-b border-stroke dark:border-gray-700">
        <nav className="flex space-x-8">
          {[
            { id: 'theme', label: 'Тема', icon: FiMonitor },
            { id: 'appearance', label: 'Внешний вид', icon: FiGrid },
            { id: 'layout', label: 'Макет', icon: FiBox },
            { id: 'typography', label: 'Типографика', icon: FiEdit },
            { id: 'animations', label: 'Анимации', icon: FiZap },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center space-x-2 py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === tab.id
                  ? 'border-primary text-primary'
                  : 'border-transparent text-body-color hover:text-dark dark:text-gray-400 dark:hover:text-gray-300'
              }`}
            >
              <tab.icon />
              <span>{tab.label}</span>
            </button>
          ))}
        </nav>
      </div>

      {/* Содержимое табов */}
      <div className="space-y-6">
        {/* Таб: Тема */}
        {activeTab === 'theme' && (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-dark dark:text-white mb-4">Настройки темы</h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Текущая тема */}
                <div className="bg-gray-50 dark:bg-dark rounded-lg p-4">
                  <h4 className="font-medium text-dark dark:text-white mb-3">Текущая тема интерфейса</h4>
                  <div className="flex items-center space-x-3">
                    <div
                      className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                        interfaceResolvedTheme === 'dark'
                          ? 'bg-gray-800 text-white'
                          : 'bg-white text-gray-800 border border-gray-200'
                      }`}
                    >
                      {interfaceResolvedTheme === 'dark' ? <FiMoon size={16} /> : <FiSun size={16} />}
                    </div>
                    <div>
                      <p className="font-medium text-dark dark:text-white">
                        {interfaceResolvedTheme === 'dark' ? 'Темная тема' : 'Светлая тема'}
                      </p>
                      <p className="text-sm text-body-color dark:text-dark-6">
                        {interfaceResolvedTheme === 'dark' ? 'Контрастный темный интерфейс' : 'Яркий светлый интерфейс'}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Автоматическое переключение */}
                <div className="bg-gray-50 dark:bg-dark rounded-lg p-4">
                  <h4 className="font-medium text-dark dark:text-white mb-3">Автоматическое переключение</h4>
                  <div className="space-y-3">
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={false}
                        onChange={() => {
                          // Логика переключения на системную тему
                        }}
                        className="mr-3"
                      />
                      <span className="text-sm text-dark dark:text-white">Следовать системной теме</span>
                    </label>
                    <p className="text-xs text-body-color dark:text-dark-6">
                      Автоматически переключаться между светлой и темной темой в зависимости от настроек системы
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Другие табы - заглушки для начала */}
        {activeTab !== 'theme' && (
          <div className="bg-gray-50 dark:bg-dark rounded-lg p-6">
            <p className="text-body-color dark:text-dark-6 text-center">
              Настройки раздела "{activeTab}" будут добавлены в следующих версиях.
            </p>
          </div>
        )}
      </div>

      {/* Кнопки действий */}
      <div className="flex items-center justify-between pt-6 border-t border-stroke dark:border-gray-700">
        <button
          onClick={resetToDefault}
          className="px-4 py-2 text-sm font-medium text-body-color dark:text-dark-6 hover:text-dark dark:hover:text-white transition-colors"
        >
          Сбросить к умолчаниям
        </button>

        <div className="flex space-x-3">
          <button
            onClick={applySettings}
            className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
          >
            Применить настройки
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditorInterfaceSettings;
