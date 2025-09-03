import React, { useState } from 'react';
import { useAdminTheme } from '../../contexts/AdminThemeContext';
import {
  FiSettings,
  FiGrid,
  FiType,
  FiLayout,
  FiZap,
  FiSave,
  FiDownload,
  FiUpload,
  FiRefreshCw,
  FiSun,
  FiMoon,
} from 'react-icons/fi';
import { FaFile } from 'react-icons/fa';

// Типы для управления темами
interface ThemeColors {
  primary: string;
  primaryHover: string;
  primaryActive: string;
  secondary: string;
  accent: string;
  success: string;
  warning: string;
  error: string;
  info: string;
  background: string;
  surface: string;
  text: string;
  textSecondary: string;
  border: string;
  borderLight: string;
}

interface ThemePreset {
  id: string;
  name: string;
  description: string;
  colors: {
    light: Partial<ThemeColors>;
    dark: Partial<ThemeColors>;
  };
  preview: string[];
}

/**
 * Расширенный компонент настроек темы с полным функционалом
 */
const EnhancedThemeSettings: React.FC = () => {
  const { theme, isDarkMode, toggleTheme } = useAdminTheme();

  const [activeTab, setActiveTab] = useState<
    'themes' | 'colors' | 'typography' | 'layout' | 'animations' | 'templates'
  >('themes');
  const [selectedTheme, setSelectedTheme] = useState('classic-blue');
  const [editingColors, setEditingColors] = useState<Partial<ThemeColors>>({
    primary: '#4C1D95',
    primaryHover: '#7C3AED',
    primaryActive: '#5B21B6',
    secondary: '#13C296',
    accent: '#9055FD',
    success: '#22AD5C',
    warning: '#FBBF24',
    error: '#F23030',
    info: '#2D68F8',
    background: '#FFFFFF',
    surface: '#F9FAFB',
    text: '#1F2937',
    textSecondary: '#6B7280',
    border: '#E5E7EB',
    borderLight: '#F3F4F6',
  });

  // Предустановленные темы
  const themePresets: ThemePreset[] = [
    {
      id: 'standard',
      name: 'Стандартная тема',
      description: 'Поддержка: светлая + темная',
      colors: {
        light: { primary: '#4C1D95', secondary: '#13C296', accent: '#6366F1', success: '#22AD5C' },
        dark: { primary: '#7C3AED', secondary: '#10B981', accent: '#8B5CF6', success: '#34D399' },
      },
      preview: ['#4C1D95', '#13C296', '#6366F1', '#22AD5C'],
    },
    {
      id: 'eco',
      name: 'ЭКО тема',
      description: 'Поддержка: светлая + темная',
      colors: {
        light: { primary: '#059669', secondary: '#0EA5E9', accent: '#8B5CF6', success: '#22AD5C' },
        dark: { primary: '#10B981', secondary: '#0EA5E9', accent: '#A855F7', success: '#34D399' },
      },
      preview: ['#059669', '#0EA5E9', '#8B5CF6', '#F59E0B'],
    },
    {
      id: 'classic-blue',
      name: 'Классическая синяя',
      description: 'Поддержка: светлая + темная',
      colors: {
        light: { primary: '#1E40AF', secondary: '#059669', accent: '#7C3AED', success: '#22AD5C' },
        dark: { primary: '#3B82F6', secondary: '#10B981', accent: '#A855F7', success: '#34D399' },
      },
      preview: ['#1E40AF', '#059669', '#7C3AED', '#22AD5C'],
    },
  ];

  const colorCategories = [
    {
      key: 'primary',
      label: 'Primary',
      description: 'Основной цвет интерфейса',
    },
    {
      key: 'primaryHover',
      label: 'Primary Hover',
      description: 'Цвет при наведении',
    },
    {
      key: 'primaryActive',
      label: 'Primary Active',
      description: 'Цвет активного состояния',
    },
    {
      key: 'secondary',
      label: 'Secondary',
      description: 'Вторичный цвет',
    },
    {
      key: 'accent',
      label: 'Accent',
      description: 'Акцентный цвет',
    },
    {
      key: 'success',
      label: 'Success',
      description: 'Цвет успеха',
    },
    {
      key: 'warning',
      label: 'Warning',
      description: 'Цвет предупреждения',
    },
    {
      key: 'error',
      label: 'Error',
      description: 'Цвет ошибки',
    },
    {
      key: 'info',
      label: 'Info',
      description: 'Информационный цвет',
    },
    {
      key: 'background',
      label: 'Background',
      description: 'Цвет фона',
    },
    {
      key: 'surface',
      label: 'Surface',
      description: 'Цвет поверхностей',
    },
    {
      key: 'text',
      label: 'Text',
      description: 'Основной цвет текста',
    },
  ];

  const tabs = [
    { id: 'themes', label: 'Темы', icon: FiSettings },
    { id: 'colors', label: 'Цвета', icon: FiGrid },
    { id: 'typography', label: 'Типографика', icon: FiType },
    { id: 'layout', label: 'Макет', icon: FiLayout },
    { id: 'animations', label: 'Анимации', icon: FiZap },
    { id: 'templates', label: 'Шаблоны', icon: FaFile },
  ];

  const handleColorChange = (colorKey: string, value: string) => {
    setEditingColors((prev) => ({
      ...prev,
      [colorKey]: value,
    }));
  };

  const applyTheme = () => {
    const selectedThemeData = themePresets.find((p) => p.id === selectedTheme);
    if (!selectedThemeData) return;

    // Применяем цвета выбранной темы
    const themeColors = isDarkMode
      ? { ...selectedThemeData.colors.dark, ...editingColors }
      : { ...selectedThemeData.colors.light, ...editingColors };

    // Применение темы к CSS переменным (совместимость с TailGrids)
    const root = document.documentElement;
    Object.entries(themeColors).forEach(([key, value]) => {
      if (value) {
        // Устанавливаем переменные в формате TailGrids
        root.style.setProperty(`--color-${key}`, value);
        // Дублируем в стандартном формате для совместимости
        root.style.setProperty(`--${key}`, value);
      }
    });

    // Применяем основные цвета из классической синей темы
    if (selectedTheme === 'classic-blue') {
      root.style.setProperty('--color-primary', '#1E40AF');
      root.style.setProperty('--primary', '#1E40AF');
      root.style.setProperty('--color-secondary', '#059669');
      root.style.setProperty('--secondary', '#059669');
    }

    // Сохранение в localStorage для AdminThemeContext
    const themeConfig = {
      selectedTheme,
      customColors: editingColors,
      appliedAt: new Date().toISOString(),
    };
    localStorage.setItem('admin-theme-config', JSON.stringify(themeConfig));
    localStorage.setItem('custom-theme-colors', JSON.stringify(editingColors));

    // Уведомляем AdminThemeContext об изменении
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('themeChanged', { detail: themeConfig }));
    }

    console.log('✅ Тема применена:', selectedTheme, themeColors);
  };

  const resetToDefaults = () => {
    const defaultColors = themePresets.find((p) => p.id === 'standard')?.colors.light || {};
    setEditingColors(defaultColors as Partial<ThemeColors>);
  };

  const exportTheme = () => {
    const themeData = {
      name: 'Custom Theme',
      colors: editingColors,
      timestamp: new Date().toISOString(),
    };

    const blob = new Blob([JSON.stringify(themeData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'theme.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Табы */}
      <div className="border-b border-stroke dark:border-gray-700">
        <nav className="flex space-x-8">
          {tabs.map((tab) => (
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
        {/* Таб: Темы */}
        {activeTab === 'themes' && (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-dark dark:text-white">Предустановленные темы</h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {themePresets.map((preset) => (
                <div
                  key={preset.id}
                  className={`border-2 rounded-lg p-4 cursor-pointer transition-all ${
                    selectedTheme === preset.id
                      ? 'border-primary bg-primary/5'
                      : 'border-stroke dark:border-gray-700 hover:border-primary/50'
                  }`}
                  onClick={() => setSelectedTheme(preset.id)}
                >
                  <div className="flex justify-between items-start mb-3">
                    <h4 className="font-medium text-dark dark:text-white">{preset.name}</h4>
                    {selectedTheme === preset.id && <div className="w-2 h-2 bg-primary rounded-full"></div>}
                  </div>

                  <p className="text-sm text-body-color dark:text-dark-6 mb-4">{preset.description}</p>

                  <div className="flex space-x-1">
                    {preset.preview.map((color, index) => (
                      <div key={index} className="w-8 h-8 rounded" style={{ backgroundColor: color }} />
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <div className="bg-gray-50 dark:bg-dark rounded-lg p-4">
              <h4 className="font-medium text-dark dark:text-white mb-2">Текущая конфигурация</h4>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-dark dark:text-white font-medium">
                    Тема: {themePresets.find((p) => p.id === selectedTheme)?.name}
                  </p>
                  <p className="text-xs text-body-color dark:text-dark-6">Режим: {isDarkMode ? 'Темный' : 'Светлый'}</p>
                </div>
                <button
                  onClick={applyTheme}
                  className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
                >
                  Применить тему
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Таб: Цвета */}
        {activeTab === 'colors' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-dark dark:text-white">Редактирование цветов</h3>

              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setEditingColors({ ...themePresets[0].colors.light })}
                  className="flex items-center space-x-2 px-3 py-2 text-sm border border-stroke rounded-lg hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-700"
                >
                  <FiSun size={16} />
                  <span>Светлая тема</span>
                </button>
                <button
                  onClick={() => setEditingColors({ ...themePresets[0].colors.dark })}
                  className="flex items-center space-x-2 px-3 py-2 text-sm border border-stroke rounded-lg hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-700"
                >
                  <FiMoon size={16} />
                  <span>Темная тема</span>
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {colorCategories.map((category) => (
                <div key={category.key} className="space-y-2">
                  <label className="block text-sm font-medium text-dark dark:text-white">{category.label}</label>
                  <div className="flex items-center space-x-3">
                    <input
                      type="color"
                      value={editingColors[category.key as keyof ThemeColors] || '#000000'}
                      onChange={(e) => handleColorChange(category.key, e.target.value)}
                      className="w-12 h-10 rounded border border-stroke dark:border-gray-700"
                    />
                    <input
                      type="text"
                      value={editingColors[category.key as keyof ThemeColors] || ''}
                      onChange={(e) => handleColorChange(category.key, e.target.value)}
                      className="flex-1 px-3 py-2 border border-stroke rounded-lg text-sm dark:border-gray-700 dark:bg-dark dark:text-white"
                      placeholder="#000000"
                    />
                  </div>
                  <p className="text-xs text-body-color dark:text-dark-6">{category.description}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Таб: Типографика */}
        {activeTab === 'typography' && (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-dark dark:text-white">Настройки типографики</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Основной шрифт */}
              <div className="space-y-4">
                <h4 className="font-medium text-dark dark:text-white">Основной шрифт</h4>
                <div>
                  <label className="block text-sm font-medium text-dark dark:text-white mb-2">Семейство шрифтов</label>
                  <select className="w-full rounded-lg border border-stroke px-4 py-3 text-dark outline-none focus:border-primary dark:border-dark-3 dark:bg-dark dark:text-white">
                    <option value="inter">Inter (рекомендуется)</option>
                    <option value="system">System UI</option>
                    <option value="roboto">Roboto</option>
                    <option value="open-sans">Open Sans</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-dark dark:text-white mb-2">Базовый размер</label>
                  <select className="w-full rounded-lg border border-stroke px-4 py-3 text-dark outline-none focus:border-primary dark:border-dark-3 dark:bg-dark dark:text-white">
                    <option value="14px">14px (по умолчанию)</option>
                    <option value="16px">16px</option>
                    <option value="18px">18px</option>
                  </select>
                </div>
              </div>

              {/* Заголовки */}
              <div className="space-y-4">
                <h4 className="font-medium text-dark dark:text-white">Заголовки</h4>
                <div>
                  <label className="block text-sm font-medium text-dark dark:text-white mb-2">Шрифт заголовков</label>
                  <select className="w-full rounded-lg border border-stroke px-4 py-3 text-dark outline-none focus:border-primary dark:border-dark-3 dark:bg-dark dark:text-white">
                    <option value="inherit">Как основной текст</option>
                    <option value="poppins">Poppins</option>
                    <option value="montserrat">Montserrat</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-dark dark:text-white mb-2">Масштаб заголовков</label>
                  <select className="w-full rounded-lg border border-stroke px-4 py-3 text-dark outline-none focus:border-primary dark:border-dark-3 dark:bg-dark dark:text-white">
                    <option value="1.25">Компактный (1.25)</option>
                    <option value="1.333">Классический (1.333)</option>
                    <option value="1.5">Просторный (1.5)</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Дополнительные настройки */}
            <div className="space-y-4">
              <h4 className="font-medium text-dark dark:text-white">Дополнительно</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-dark dark:text-white mb-2">
                    Межстрочный интервал
                  </label>
                  <input type="range" min="1.2" max="2" step="0.1" defaultValue="1.5" className="w-full" />
                  <div className="text-xs text-body-color dark:text-dark-6 mt-1">1.5</div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-dark dark:text-white mb-2">
                    Межбуквенный интервал
                  </label>
                  <input type="range" min="-0.05" max="0.1" step="0.01" defaultValue="0" className="w-full" />
                  <div className="text-xs text-body-color dark:text-dark-6 mt-1">0em</div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-dark dark:text-white mb-2">Толщина шрифта</label>
                  <select className="w-full rounded-lg border border-stroke px-2 py-2 text-sm dark:border-dark-3 dark:bg-dark dark:text-white">
                    <option value="400">Обычный (400)</option>
                    <option value="500">Средний (500)</option>
                    <option value="600">Жирный (600)</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Таб: Макет */}
        {activeTab === 'layout' && (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-dark dark:text-white">Настройки макета</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Отступы */}
              <div className="space-y-4">
                <h4 className="font-medium text-dark dark:text-white">Отступы и интервалы</h4>
                <div>
                  <label className="block text-sm font-medium text-dark dark:text-white mb-2">Базовый интервал</label>
                  <select className="w-full rounded-lg border border-stroke px-4 py-3 text-dark outline-none focus:border-primary dark:border-dark-3 dark:bg-dark dark:text-white">
                    <option value="4px">Компактный (4px)</option>
                    <option value="8px">Стандартный (8px)</option>
                    <option value="16px">Просторный (16px)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-dark dark:text-white mb-2">
                    Отступы контейнеров
                  </label>
                  <input type="range" min="12" max="32" step="4" defaultValue="24" className="w-full" />
                  <div className="text-xs text-body-color dark:text-dark-6 mt-1">24px</div>
                </div>
              </div>

              {/* Радиусы */}
              <div className="space-y-4">
                <h4 className="font-medium text-dark dark:text-white">Скругления</h4>
                <div>
                  <label className="block text-sm font-medium text-dark dark:text-white mb-2">Радиус кнопок</label>
                  <input type="range" min="0" max="24" step="2" defaultValue="8" className="w-full" />
                  <div className="text-xs text-body-color dark:text-dark-6 mt-1">8px</div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-dark dark:text-white mb-2">Радиус карточек</label>
                  <input type="range" min="0" max="24" step="2" defaultValue="12" className="w-full" />
                  <div className="text-xs text-body-color dark:text-dark-6 mt-1">12px</div>
                </div>
              </div>
            </div>

            {/* Сетка */}
            <div className="space-y-4">
              <h4 className="font-medium text-dark dark:text-white">Система сеток</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-dark dark:text-white mb-2">
                    Максимальная ширина
                  </label>
                  <select className="w-full rounded-lg border border-stroke px-3 py-2 text-sm dark:border-dark-3 dark:bg-dark dark:text-white">
                    <option value="1200px">1200px</option>
                    <option value="1400px">1400px</option>
                    <option value="1600px">1600px</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-dark dark:text-white mb-2">Количество колонок</label>
                  <select className="w-full rounded-lg border border-stroke px-3 py-2 text-sm dark:border-dark-3 dark:bg-dark dark:text-white">
                    <option value="12">12 колонок</option>
                    <option value="16">16 колонок</option>
                    <option value="24">24 колонки</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-dark dark:text-white mb-2">
                    Промежуток между колонками
                  </label>
                  <input type="range" min="16" max="48" step="8" defaultValue="24" className="w-full" />
                  <div className="text-xs text-body-color dark:text-dark-6 mt-1">24px</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Таб: Анимации */}
        {activeTab === 'animations' && (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-dark dark:text-white">Настройки анимаций</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Общие настройки */}
              <div className="space-y-4">
                <h4 className="font-medium text-dark dark:text-white">Общие настройки</h4>

                <div className="flex items-center justify-between">
                  <div>
                    <h5 className="font-medium text-dark dark:text-white">Включить анимации</h5>
                    <p className="text-sm text-body-color dark:text-dark-6">Глобальное включение/отключение анимаций</p>
                  </div>
                  <label className="relative inline-flex cursor-pointer items-center">
                    <input type="checkbox" defaultChecked className="peer sr-only" />
                    <div className="peer h-6 w-11 rounded-full bg-gray-200 after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-primary peer-checked:after:translate-x-full peer-checked:after:border-white dark:border-gray-600 dark:bg-gray-700"></div>
                  </label>
                </div>

                <div>
                  <label className="block text-sm font-medium text-dark dark:text-white mb-2">Скорость анимаций</label>
                  <select className="w-full rounded-lg border border-stroke px-4 py-3 text-dark outline-none focus:border-primary dark:border-dark-3 dark:bg-dark dark:text-white">
                    <option value="slow">Медленная (0.5s)</option>
                    <option value="normal">Обычная (0.3s)</option>
                    <option value="fast">Быстрая (0.15s)</option>
                  </select>
                </div>
              </div>

              {/* Типы анимаций */}
              <div className="space-y-4">
                <h4 className="font-medium text-dark dark:text-white">Типы анимаций</h4>

                <div className="flex items-center justify-between">
                  <div>
                    <h5 className="font-medium text-dark dark:text-white">Анимации наведения</h5>
                    <p className="text-sm text-body-color dark:text-dark-6">Эффекты при наведении на элементы</p>
                  </div>
                  <label className="relative inline-flex cursor-pointer items-center">
                    <input type="checkbox" defaultChecked className="peer sr-only" />
                    <div className="peer h-6 w-11 rounded-full bg-gray-200 after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-primary peer-checked:after:translate-x-full peer-checked:after:border-white dark:border-gray-600 dark:bg-gray-700"></div>
                  </label>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <h5 className="font-medium text-dark dark:text-white">Переходы страниц</h5>
                    <p className="text-sm text-body-color dark:text-dark-6">Анимации при смене страниц</p>
                  </div>
                  <label className="relative inline-flex cursor-pointer items-center">
                    <input type="checkbox" defaultChecked className="peer sr-only" />
                    <div className="peer h-6 w-11 rounded-full bg-gray-200 after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-primary peer-checked:after:translate-x-full peer-checked:after:border-white dark:border-gray-600 dark:bg-gray-700"></div>
                  </label>
                </div>
              </div>
            </div>

            {/* Easing функции */}
            <div className="space-y-4">
              <h4 className="font-medium text-dark dark:text-white">Функции плавности</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-dark dark:text-white mb-2">Функция появления</label>
                  <select className="w-full rounded-lg border border-stroke px-4 py-3 text-dark outline-none focus:border-primary dark:border-dark-3 dark:bg-dark dark:text-white">
                    <option value="ease">ease</option>
                    <option value="ease-in">ease-in</option>
                    <option value="ease-out">ease-out</option>
                    <option value="ease-in-out">ease-in-out</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-dark dark:text-white mb-2">
                    Функция исчезновения
                  </label>
                  <select className="w-full rounded-lg border border-stroke px-4 py-3 text-dark outline-none focus:border-primary dark:border-dark-3 dark:bg-dark dark:text-white">
                    <option value="ease">ease</option>
                    <option value="ease-in">ease-in</option>
                    <option value="ease-out">ease-out</option>
                    <option value="ease-in-out">ease-in-out</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Таб: Шаблоны */}
        {activeTab === 'templates' && (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-dark dark:text-white">Шаблоны тем</h3>

            {/* Сохраненные шаблоны */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="font-medium text-dark dark:text-white">Сохраненные шаблоны</h4>
                <button className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors">
                  Создать шаблон
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {/* Пример шаблона */}
                <div className="border border-stroke dark:border-gray-700 rounded-lg p-4">
                  <div className="flex justify-between items-start mb-3">
                    <h5 className="font-medium text-dark dark:text-white">Корпоративная тема</h5>
                    <button className="text-gray-400 hover:text-red-500">
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path
                          fillRule="evenodd"
                          d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </button>
                  </div>
                  <div className="flex space-x-1 mb-3">
                    <div className="w-6 h-6 bg-blue-600 rounded"></div>
                    <div className="w-6 h-6 bg-gray-600 rounded"></div>
                    <div className="w-6 h-6 bg-green-600 rounded"></div>
                  </div>
                  <div className="flex space-x-2">
                    <button className="flex-1 px-3 py-1 text-sm border border-stroke rounded hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-700">
                      Применить
                    </button>
                    <button className="flex-1 px-3 py-1 text-sm border border-stroke rounded hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-700">
                      Экспорт
                    </button>
                  </div>
                </div>

                {/* Пример шаблона 2 */}
                <div className="border border-stroke dark:border-gray-700 rounded-lg p-4">
                  <div className="flex justify-between items-start mb-3">
                    <h5 className="font-medium text-dark dark:text-white">Яркая тема</h5>
                    <button className="text-gray-400 hover:text-red-500">
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path
                          fillRule="evenodd"
                          d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </button>
                  </div>
                  <div className="flex space-x-1 mb-3">
                    <div className="w-6 h-6 bg-purple-600 rounded"></div>
                    <div className="w-6 h-6 bg-pink-600 rounded"></div>
                    <div className="w-6 h-6 bg-orange-600 rounded"></div>
                  </div>
                  <div className="flex space-x-2">
                    <button className="flex-1 px-3 py-1 text-sm border border-stroke rounded hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-700">
                      Применить
                    </button>
                    <button className="flex-1 px-3 py-1 text-sm border border-stroke rounded hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-700">
                      Экспорт
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Импорт шаблонов */}
            <div className="space-y-4">
              <h4 className="font-medium text-dark dark:text-white">Импорт шаблонов</h4>
              <div className="border-2 border-dashed border-stroke dark:border-gray-700 rounded-lg p-6 text-center">
                <FaFile size={32} className="mx-auto text-gray-400 mb-4" />
                <p className="text-dark dark:text-white font-medium mb-2">Перетащите файл темы сюда</p>
                <p className="text-body-color dark:text-dark-6 text-sm mb-4">Поддерживаются файлы .json</p>
                <button className="px-4 py-2 border border-stroke rounded-lg hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-700 transition-colors">
                  Выбрать файл
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Кнопки действий */}
      <div className="flex items-center justify-between pt-6 border-t border-stroke dark:border-gray-700">
        <button
          onClick={resetToDefaults}
          className="px-4 py-2 text-sm font-medium text-body-color dark:text-dark-6 hover:text-dark dark:hover:text-white transition-colors"
        >
          <FiRefreshCw size={16} className="inline-block mr-2" />
          Сбросить к умолчаниям
        </button>

        <div className="flex space-x-3">
          <button
            onClick={exportTheme}
            className="flex items-center space-x-2 px-4 py-2 border border-stroke rounded-lg hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-700 transition-colors"
          >
            <FiDownload size={16} />
            <span>Экспорт</span>
          </button>

          <button className="flex items-center space-x-2 px-4 py-2 border border-stroke rounded-lg hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-700 transition-colors">
            <FiUpload size={16} />
            <span>Импорт</span>
          </button>

          <button
            onClick={applyTheme}
            className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
          >
            <FiSave size={16} className="inline-block mr-2" />
            Сохранить настройки
          </button>
        </div>
      </div>
    </div>
  );
};

export default EnhancedThemeSettings;
