import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { 
  ThemeConfig, 
  ThemeSettings, 
  ThemeContextType, 
  ThemeColors,
  ThemeTypography,
  ThemeLayout,
  ThemeAnimations,
  ThemeGradients,
  ThemeTemplate,
  CustomColorPalette,
  DEFAULT_THEMES,
  DEFAULT_THEME_SETTINGS 
} from '../types/theme';

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

interface ThemeProviderProps {
  children: ReactNode;
}

/**
 * Провайдер темы - централизованное управление темой интерфейса
 */
export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const [settings, setSettings] = useState<ThemeSettings>(DEFAULT_THEME_SETTINGS);
  const [currentTheme, setCurrentTheme] = useState<ThemeConfig>(DEFAULT_THEMES[0]);
  const [isDarkMode, setIsDarkMode] = useState<boolean>(false);
  const [colorPalettes, setColorPalettes] = useState<CustomColorPalette[]>([]);

  // Загрузка настроек темы при инициализации
  useEffect(() => {
    loadThemeSettings();
    // Авто-миграция: если в localStorage есть тема, а в БД нет — сохраним при первом заходе
    try {
      const saved = localStorage.getItem('situs-theme-settings');
      if (saved) {
        // Отложим миграцию: компонент менеджера вызовет PUT при сохранении; здесь только отметка
        console.log('Theme settings detected in localStorage (ready for migration)');
      }
    } catch {}
  }, []);

  // Применение CSS переменных при изменении темы или режима
  useEffect(() => {
    applyThemeToDOM(currentTheme, isDarkMode);
  }, [currentTheme, isDarkMode]);

  /**
   * Применение темы к DOM через CSS переменные
   */
  const applyThemeToDOM = (theme: ThemeConfig, darkMode: boolean) => {
    const root = document.documentElement;
    
    // Выбираем нужный вариант цветов (светлый или темный)
    const colors = darkMode ? theme.colors.dark : theme.colors.light;
    
    // Применяем основные цвета
    root.style.setProperty('--color-primary', colors.primary);
    root.style.setProperty('--color-primary-hover', colors.primaryHover);
    root.style.setProperty('--color-primary-active', colors.primaryActive);
    root.style.setProperty('--color-secondary', colors.secondary);
    root.style.setProperty('--color-accent', colors.accent);
    
    // Статусные цвета
    root.style.setProperty('--color-success', colors.success);
    root.style.setProperty('--color-warning', colors.warning);
    root.style.setProperty('--color-error', colors.error);
    root.style.setProperty('--color-info', colors.info);
    
    // Базовые цвета
    root.style.setProperty('--color-background', colors.background);
    root.style.setProperty('--color-surface', colors.surface);
    root.style.setProperty('--color-text', colors.text);
    root.style.setProperty('--color-text-secondary', colors.textSecondary);
    root.style.setProperty('--color-border', colors.border);
    root.style.setProperty('--color-border-light', colors.borderLight);

    // Устаревшие переменные для совместимости
    root.style.setProperty('--color-body-color', colors.textSecondary);
    root.style.setProperty('--color-dark', colors.text);
    root.style.setProperty('--color-gray-3', colors.borderLight);
    
    // Управление темной темой
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }

    // Применение кастомного CSS если есть
    if (theme.customCss) {
      let customStyleElement = document.getElementById('custom-theme-styles');
      if (!customStyleElement) {
        customStyleElement = document.createElement('style');
        customStyleElement.id = 'custom-theme-styles';
        document.head.appendChild(customStyleElement);
      }
      customStyleElement.textContent = theme.customCss;
    }
  };

  /**
   * Переключение темного режима
   */
  const toggleDarkMode = () => {
    const newDarkMode = !isDarkMode;
    setIsDarkMode(newDarkMode);
    const newSettings = {
      ...settings,
      isDarkMode: newDarkMode
    };
    setSettings(newSettings);
    
    // Автоматически сохраняем настройки
    localStorage.setItem('situs-theme-settings', JSON.stringify(newSettings));
    console.log('Режим темы изменен:', newDarkMode ? 'темный' : 'светлый');
  };

  /**
   * Обновление темы по ID
   */
  const updateTheme = (themeId: string) => {
    const theme = settings.availableThemes.find(t => t.id === themeId);
    if (theme) {
      setCurrentTheme(theme);
      const newSettings = {
        ...settings,
        currentTheme: themeId,
        customTheme: undefined // Сбрасываем кастомную тему при выборе предустановленной
      };
      setSettings(newSettings);
      
      // Автоматически сохраняем настройки
      localStorage.setItem('situs-theme-settings', JSON.stringify(newSettings));
      console.log('Тема автоматически сохранена:', theme.name);
    }
  };

  /**
   * Обновление конкретного варианта темы (светлого или темного)
   */
  const updateThemeVariant = (variant: 'light' | 'dark', colors: Partial<ThemeColors>) => {
    const updatedTheme: ThemeConfig = {
      ...currentTheme,
      colors: {
        ...currentTheme.colors,
        [variant]: {
          ...currentTheme.colors[variant],
          ...colors
        }
      }
    };

    setCurrentTheme(updatedTheme);
    const newSettings = {
      ...settings,
      customTheme: updatedTheme
    };
    setSettings(newSettings);
    
    // Автоматически сохраняем кастомную тему
    localStorage.setItem('situs-theme-settings', JSON.stringify(newSettings));
    console.log(`${variant === 'light' ? 'Светлый' : 'Темный'} вариант темы сохранен`);
  };

  /**
   * Обновление типографики
   */
  const updateTypography = (typography: Partial<ThemeTypography>) => {
    const updatedTheme: ThemeConfig = {
      ...currentTheme,
      typography: {
        ...currentTheme.typography,
        ...typography
      }
    };
    setCurrentTheme(updatedTheme);
    saveThemeChanges(updatedTheme);
  };

  /**
   * Обновление макета
   */
  const updateLayout = (layout: Partial<ThemeLayout>) => {
    const updatedTheme: ThemeConfig = {
      ...currentTheme,
      layout: {
        ...currentTheme.layout,
        ...layout
      }
    };
    setCurrentTheme(updatedTheme);
    saveThemeChanges(updatedTheme);
  };

  /**
   * Обновление анимаций
   */
  const updateAnimations = (animations: Partial<ThemeAnimations>) => {
    const updatedTheme: ThemeConfig = {
      ...currentTheme,
      animations: {
        ...currentTheme.animations,
        ...animations
      }
    };
    setCurrentTheme(updatedTheme);
    saveThemeChanges(updatedTheme);
  };

  /**
   * Обновление градиентов
   */
  const updateGradients = (gradients: Partial<ThemeGradients>) => {
    const updatedTheme: ThemeConfig = {
      ...currentTheme,
      gradients: {
        ...currentTheme.gradients,
        ...gradients
      }
    };
    setCurrentTheme(updatedTheme);
    saveThemeChanges(updatedTheme);
  };

  /**
   * Сохранение изменений темы
   */
  const saveThemeChanges = (theme: ThemeConfig) => {
    const newSettings = {
      ...settings,
      customTheme: theme
    };
    setSettings(newSettings);
    localStorage.setItem('situs-theme-settings', JSON.stringify(newSettings));
  };

  /**
   * Сброс к теме по умолчанию
   */
  const resetToDefault = () => {
    const defaultTheme = DEFAULT_THEMES[0];
    setCurrentTheme(defaultTheme);
    const newSettings = {
      ...settings,
      currentTheme: defaultTheme.id,
      customTheme: undefined
    };
    setSettings(newSettings);
    
    // Автоматически сохраняем сброс
    localStorage.setItem('situs-theme-settings', JSON.stringify(newSettings));
    console.log('Сброс к дефолтной теме сохранен');
  };

  /**
   * Сохранение настроек темы
   */
  const saveThemeSettings = async () => {
    try {
      // Сохраняем в localStorage
      localStorage.setItem('situs-theme-settings', JSON.stringify(settings));
      
      // TODO: Сохранение в API для синхронизации между устройствами
      // await apiClient.saveThemeSettings(settings);
      
      console.log('Настройки темы сохранены');
    } catch (error) {
      console.error('Ошибка сохранения настроек темы:', error);
    }
  };

  /**
   * Миграция старых настроек к новому формату
   */
  const migrateOldSettings = (oldSettings: any): ThemeSettings => {
    const migratedSettings: ThemeSettings = {
      currentTheme: 'standard-theme',
      isDarkMode: false,
      allowCustomization: true,
      availableThemes: DEFAULT_THEMES,
      templates: []
    };

    // Если есть старые темы, пытаемся найти аналог
    if (oldSettings.currentTheme) {
      switch (oldSettings.currentTheme) {
        case 'purple-dark':
          migratedSettings.currentTheme = 'standard-theme';
          break;
        case 'blue-classic':
          migratedSettings.currentTheme = 'blue-classic-theme';
          break;
        case 'green-eco':
          migratedSettings.currentTheme = 'eco-theme';
          break;
        case 'dark-mode':
          migratedSettings.currentTheme = 'standard-theme';
          migratedSettings.isDarkMode = true;
          break;
        default:
          migratedSettings.currentTheme = 'standard-theme';
      }
    }

    return migratedSettings;
  };

  /**
   * Загрузка настроек темы
   */
  const loadThemeSettings = async () => {
    try {
      // Загружаем из localStorage
      const saved = localStorage.getItem('situs-theme-settings');
      if (saved) {
        const savedData = JSON.parse(saved);
        
        // Проверяем, нужна ли миграция (если нет isDarkMode поля)
        let savedSettings: ThemeSettings;
        if (savedData.isDarkMode === undefined) {
          console.log('Выполняется миграция настроек темы...');
          savedSettings = migrateOldSettings(savedData);
          // Сохраняем мигрированные настройки
          localStorage.setItem('situs-theme-settings', JSON.stringify(savedSettings));
        } else {
          savedSettings = savedData;
        }
        
        setSettings(savedSettings);
        setIsDarkMode(savedSettings.isDarkMode || false);
        
        // Находим текущую тему
        let theme = savedSettings.availableThemes.find(t => t.id === savedSettings.currentTheme);
        
        // Если кастомная тема
        if (savedSettings.customTheme) {
          theme = savedSettings.customTheme;
        }
        
        if (theme) {
          setCurrentTheme(theme);
        }
      }
      
      // Загружаем палитры
      const savedPalettes = localStorage.getItem('situs-color-palettes');
      if (savedPalettes) {
        setColorPalettes(JSON.parse(savedPalettes));
      }
      
    } catch (error) {
      console.error('Ошибка загрузки настроек темы:', error);
      // В случае ошибки используем дефолтные настройки
      setSettings(DEFAULT_THEME_SETTINGS);
      setCurrentTheme(DEFAULT_THEMES[0]);
      setIsDarkMode(false);
    }
  };

  /**
   * Создание новой цветовой палитры
   */
  const createColorPalette = (name: string, colors: string[]): CustomColorPalette => {
    const newPalette: CustomColorPalette = {
      id: `palette-${Date.now()}`,
      name,
      colors,
      createdAt: new Date()
    };
    
    const updatedPalettes = [...colorPalettes, newPalette];
    setColorPalettes(updatedPalettes);
    localStorage.setItem('situs-color-palettes', JSON.stringify(updatedPalettes));
    
    return newPalette;
  };

  /**
   * Удаление цветовой палитры
   */
  const deleteColorPalette = (id: string) => {
    const updatedPalettes = colorPalettes.filter(p => p.id !== id);
    setColorPalettes(updatedPalettes);
    localStorage.setItem('situs-color-palettes', JSON.stringify(updatedPalettes));
  };

  /**
   * Сохранение темы как шаблона
   */
  const saveTemplate = (name: string, description?: string, tags?: string[]): ThemeTemplate => {
    const template: ThemeTemplate = {
      id: `template-${Date.now()}`,
      name,
      description,
      config: currentTheme,
      createdAt: new Date(),
      isBuiltIn: false,
      tags
    };
    
    const updatedSettings = {
      ...settings,
      templates: [...settings.templates, template]
    };
    setSettings(updatedSettings);
    localStorage.setItem('situs-theme-settings', JSON.stringify(updatedSettings));
    
    return template;
  };

  /**
   * Удаление шаблона
   */
  const deleteTemplate = (id: string) => {
    const updatedSettings = {
      ...settings,
      templates: settings.templates.filter(t => t.id !== id)
    };
    setSettings(updatedSettings);
    localStorage.setItem('situs-theme-settings', JSON.stringify(updatedSettings));
  };

  /**
   * Загрузка шаблона
   */
  const loadTemplate = (id: string) => {
    const template = settings.templates.find(t => t.id === id);
    if (template) {
      setCurrentTheme(template.config);
      console.log('Шаблон загружен:', template.name);
    }
  };

  /**
   * Экспорт темы
   */
  const exportTheme = (): string => {
    const exportData = {
      theme: currentTheme,
      isDarkMode,
      timestamp: new Date().toISOString()
    };
    return JSON.stringify(exportData, null, 2);
  };

  /**
   * Импорт темы
   */
  const importTheme = (themeData: string): boolean => {
    try {
      const importedData = JSON.parse(themeData);
      if (importedData.theme) {
        setCurrentTheme(importedData.theme);
        if (importedData.isDarkMode !== undefined) {
          setIsDarkMode(importedData.isDarkMode);
        }
        console.log('Тема успешно импортирована');
        return true;
      }
      return false;
    } catch (error) {
      console.error('Ошибка импорта темы:', error);
      return false;
    }
  };

  // Вычисляем текущие активные цвета
  const currentColors = isDarkMode ? currentTheme.colors.dark : currentTheme.colors.light;

  const contextValue: ThemeContextType = {
    currentTheme,
    isDarkMode,
    currentColors,
    settings,
    updateTheme,
    toggleDarkMode,
    updateThemeVariant,
    updateTypography,
    updateLayout,
    updateAnimations,
    updateGradients,
    resetToDefault,
    saveThemeSettings,
    loadThemeSettings,
    colorPalettes,
    createColorPalette,
    deleteColorPalette,
    saveTemplate,
    deleteTemplate,
    loadTemplate,
    exportTheme,
    importTheme
  };

  return (
    <ThemeContext.Provider value={contextValue}>
      {children}
    </ThemeContext.Provider>
  );
};

/**
 * Хук для использования темы
 */
export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme должен использоваться внутри ThemeProvider');
  }
  return context;
};

export default ThemeProvider;
