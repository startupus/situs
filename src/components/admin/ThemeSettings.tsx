import React, { useState } from 'react';
import { useTheme } from '../../contexts/ThemeContext';
import { ThemeConfig, ThemeColors } from '../../types/theme';
import { FiSettings, FiEye, FiSave, FiRotateCcw, FiCheck } from 'react-icons/fi';

/**
 * Компонент настроек темы для админ-панели
 */
const ThemeSettings: React.FC = () => {
  const { currentTheme, settings, updateTheme, updateCustomTheme, resetToDefault, saveThemeSettings } = useTheme();

  const [isCustomizing, setIsCustomizing] = useState(false);
  const [customColors, setCustomColors] = useState<Partial<ThemeColors>>(currentTheme.colors);
  const [previewMode, setPreviewMode] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  /**
   * Обработка выбора предустановленной темы
   */
  const handleThemeSelect = (themeId: string) => {
    updateTheme(themeId);
    setIsCustomizing(false);
    setCustomColors(currentTheme.colors);
  };

  /**
   * Обработка изменения кастомного цвета
   */
  const handleColorChange = (colorKey: keyof ThemeColors, value: string) => {
    const newColors = { ...customColors, [colorKey]: value };
    setCustomColors(newColors);

    if (previewMode) {
      updateCustomTheme(newColors);
    }
  };

  /**
   * Применение кастомных цветов
   */
  const applyCustomColors = () => {
    updateCustomTheme(customColors);
    setIsCustomizing(false);
  };

  /**
   * Сохранение настроек
   */
  const handleSave = async () => {
    setIsSaving(true);
    try {
      await saveThemeSettings();
    } finally {
      setIsSaving(false);
    }
  };

  /**
   * Переключение режима предпросмотра
   */
  const togglePreview = () => {
    if (previewMode) {
      // Возвращаем текущую тему
      updateTheme(currentTheme.id);
    } else {
      // Применяем предпросмотр
      updateCustomTheme(customColors);
    }
    setPreviewMode(!previewMode);
  };

  return (
    <div className="bg-white dark:bg-dark-2 rounded-xl border border-stroke dark:border-dark-3 p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
            <FiSettings className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-dark dark:text-white">Настройки темы</h2>
            <p className="text-body-color dark:text-dark-6">Управление цветовой схемой интерфейса</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={togglePreview}
            className={`px-4 py-2 rounded-lg border transition-colors ${
              previewMode
                ? 'bg-primary text-white border-primary'
                : 'bg-transparent text-primary border-primary hover:bg-primary/10'
            }`}
          >
            <FiEye className="w-4 h-4 mr-2 inline" />
            {previewMode ? 'Предпросмотр включен' : 'Предпросмотр'}
          </button>

          <button
            onClick={handleSave}
            disabled={isSaving}
            className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-hover transition-colors disabled:opacity-50"
          >
            <FiSave className="w-4 h-4 mr-2 inline" />
            {isSaving ? 'Сохранение...' : 'Сохранить'}
          </button>
        </div>
      </div>

      {/* Предустановленные темы */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold text-dark dark:text-white mb-4">Предустановленные темы</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {settings.availableThemes.map((theme) => (
            <div
              key={theme.id}
              className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${
                currentTheme.id === theme.id
                  ? 'border-primary bg-primary/5'
                  : 'border-stroke dark:border-dark-3 hover:border-primary/50'
              }`}
              onClick={() => handleThemeSelect(theme.id)}
            >
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-semibold text-dark dark:text-white">{theme.name}</h4>
                {currentTheme.id === theme.id && <FiCheck className="w-5 h-5 text-primary" />}
              </div>

              {/* Цветовая палитра темы */}
              <div className="flex gap-2">
                <div
                  className="w-6 h-6 rounded-full border border-stroke"
                  style={{ backgroundColor: theme.colors.primary }}
                  title={`Primary: ${theme.colors.primary}`}
                />
                <div
                  className="w-6 h-6 rounded-full border border-stroke"
                  style={{ backgroundColor: theme.colors.secondary }}
                  title={`Secondary: ${theme.colors.secondary}`}
                />
                <div
                  className="w-6 h-6 rounded-full border border-stroke"
                  style={{ backgroundColor: theme.colors.accent }}
                  title={`Accent: ${theme.colors.accent}`}
                />
                <div
                  className="w-6 h-6 rounded-full border border-stroke"
                  style={{ backgroundColor: theme.colors.success }}
                  title={`Success: ${theme.colors.success}`}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Кастомизация цветов */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-dark dark:text-white">Настройка цветов</h3>
          <div className="flex gap-2">
            <button
              onClick={() => setIsCustomizing(!isCustomizing)}
              className="px-4 py-2 text-primary border border-primary rounded-lg hover:bg-primary/10 transition-colors"
            >
              {isCustomizing ? 'Свернуть' : 'Настроить'}
            </button>
            <button
              onClick={resetToDefault}
              className="px-4 py-2 text-body-color border border-stroke rounded-lg hover:bg-gray-50 transition-colors"
            >
              <FiRotateCcw className="w-4 h-4 mr-2 inline" />
              Сбросить
            </button>
          </div>
        </div>

        {isCustomizing && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Основные цвета */}
            <div>
              <h4 className="font-medium text-dark dark:text-white mb-3">Основные цвета</h4>
              <div className="space-y-3">
                <ColorInput
                  label="Основной цвет"
                  value={customColors.primary || ''}
                  onChange={(value) => handleColorChange('primary', value)}
                />
                <ColorInput
                  label="Hover состояние"
                  value={customColors.primaryHover || ''}
                  onChange={(value) => handleColorChange('primaryHover', value)}
                />
                <ColorInput
                  label="Вторичный цвет"
                  value={customColors.secondary || ''}
                  onChange={(value) => handleColorChange('secondary', value)}
                />
              </div>
            </div>

            {/* Статусные цвета */}
            <div>
              <h4 className="font-medium text-dark dark:text-white mb-3">Статусные цвета</h4>
              <div className="space-y-3">
                <ColorInput
                  label="Успех"
                  value={customColors.success || ''}
                  onChange={(value) => handleColorChange('success', value)}
                />
                <ColorInput
                  label="Предупреждение"
                  value={customColors.warning || ''}
                  onChange={(value) => handleColorChange('warning', value)}
                />
                <ColorInput
                  label="Ошибка"
                  value={customColors.error || ''}
                  onChange={(value) => handleColorChange('error', value)}
                />
              </div>
            </div>

            {/* Интерфейсные цвета */}
            <div>
              <h4 className="font-medium text-dark dark:text-white mb-3">Интерфейс</h4>
              <div className="space-y-3">
                <ColorInput
                  label="Фон"
                  value={customColors.background || ''}
                  onChange={(value) => handleColorChange('background', value)}
                />
                <ColorInput
                  label="Поверхность"
                  value={customColors.surface || ''}
                  onChange={(value) => handleColorChange('surface', value)}
                />
                <ColorInput
                  label="Границы"
                  value={customColors.border || ''}
                  onChange={(value) => handleColorChange('border', value)}
                />
              </div>
            </div>
          </div>
        )}

        {isCustomizing && (
          <div className="mt-6 flex justify-end gap-3">
            <button
              onClick={() => setIsCustomizing(false)}
              className="px-4 py-2 text-body-color border border-stroke rounded-lg hover:bg-gray-50 transition-colors"
            >
              Отмена
            </button>
            <button
              onClick={applyCustomColors}
              className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-hover transition-colors"
            >
              Применить изменения
            </button>
          </div>
        )}
      </div>

      {/* Информация о текущей теме */}
      <div className="bg-gray-50 dark:bg-dark-3 rounded-lg p-4">
        <h4 className="font-medium text-dark dark:text-white mb-2">Текущая тема: {currentTheme.name}</h4>
        <p className="text-body-color dark:text-dark-6 text-sm">
          ID: {currentTheme.id} | Тип: {currentTheme.isDark ? 'Темная' : 'Светлая'}
        </p>
      </div>
    </div>
  );
};

/**
 * Компонент для ввода цвета
 */
interface ColorInputProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
}

const ColorInput: React.FC<ColorInputProps> = ({ label, value, onChange }) => {
  return (
    <div>
      <label className="block text-sm font-medium text-dark dark:text-white mb-1">{label}</label>
      <div className="flex gap-2">
        <input
          type="color"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-12 h-10 rounded border border-stroke cursor-pointer"
        />
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="#000000"
          className="flex-1 px-3 py-2 border border-stroke rounded-lg focus:border-primary focus:outline-none"
        />
      </div>
    </div>
  );
};

export default ThemeSettings;
