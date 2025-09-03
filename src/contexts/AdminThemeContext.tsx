import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { AdminTheme, AdminThemeSettings } from '../types/theme';

interface AdminThemeContextType {
  theme: AdminTheme;
  isDarkMode: boolean;
  toggleTheme: () => void;
  setTheme: (theme: AdminTheme) => void;
  applyCustomTheme: (themeConfig: any) => void;
  loadSavedTheme: () => void;
}

const AdminThemeContext = createContext<AdminThemeContextType | undefined>(undefined);

interface AdminThemeProviderProps {
  children: ReactNode;
}

export const AdminThemeProvider: React.FC<AdminThemeProviderProps> = ({ children }) => {
  const [theme, setThemeState] = useState<AdminTheme>('system');
  const [isDarkMode, setIsDarkMode] = useState<boolean>(false);

  // Загрузка настроек при инициализации
  useEffect(() => {
    const savedSettings = localStorage.getItem('admin-theme-settings');
    if (savedSettings) {
      const settings: AdminThemeSettings = JSON.parse(savedSettings);
      setThemeState(settings.theme);
      setIsDarkMode(settings.isDarkMode);
    }
  }, []);

  // Применение темы к DOM
  useEffect(() => {
    const root = document.documentElement;

    if (isDarkMode) {
      root.classList.add('admin-dark');
      root.classList.remove('admin-light');
    } else {
      root.classList.add('admin-light');
      root.classList.remove('admin-dark');
    }
  }, [isDarkMode]);

  const setTheme = (newTheme: AdminTheme) => {
    setThemeState(newTheme);

    let newIsDarkMode = false;
    if (newTheme === 'dark') {
      newIsDarkMode = true;
    } else if (newTheme === 'light') {
      newIsDarkMode = false;
    } else if (newTheme === 'system') {
      newIsDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
    }

    setIsDarkMode(newIsDarkMode);

    // Сохранение настроек
    const settings: AdminThemeSettings = {
      theme: newTheme,
      isDarkMode: newIsDarkMode,
    };
    localStorage.setItem('admin-theme-settings', JSON.stringify(settings));
  };

  const toggleTheme = () => {
    const themes: AdminTheme[] = ['system', 'light', 'dark'];
    const currentIndex = themes.indexOf(theme);
    const nextIndex = (currentIndex + 1) % themes.length;
    setTheme(themes[nextIndex]);
  };

  const applyCustomTheme = (themeConfig: any) => {
    // Применяем кастомную тему
    const root = document.documentElement;

    if (themeConfig.customColors) {
      Object.entries(themeConfig.customColors).forEach(([key, value]) => {
        if (value) {
          root.style.setProperty(`--color-${key}`, value as string);
          root.style.setProperty(`--${key}`, value as string);
        }
      });
    }

    // Специальная обработка для классической синей темы
    if (themeConfig.selectedTheme === 'classic-blue') {
      root.style.setProperty('--color-primary', '#1E40AF');
      root.style.setProperty('--primary', '#1E40AF');
      root.style.setProperty('--color-secondary', '#059669');
      root.style.setProperty('--secondary', '#059669');
      root.style.setProperty('--color-accent', '#7C3AED');
      root.style.setProperty('--accent', '#7C3AED');
    }

    console.log('🎨 Применена кастомная тема:', themeConfig.selectedTheme);
  };

  const loadSavedTheme = () => {
    const savedThemeConfig = localStorage.getItem('admin-theme-config');
    if (savedThemeConfig) {
      try {
        const themeConfig = JSON.parse(savedThemeConfig);
        applyCustomTheme(themeConfig);
        console.log('📝 Загружена сохранённая тема:', themeConfig.selectedTheme);
      } catch (error) {
        console.error('Ошибка загрузки темы:', error);
      }
    }
  };

  // Загружаем сохранённую тему при инициализации
  useEffect(() => {
    loadSavedTheme();

    // Слушаем события изменения темы
    const handleThemeChange = (event: CustomEvent) => {
      applyCustomTheme(event.detail);
    };

    window.addEventListener('themeChanged', handleThemeChange as EventListener);

    return () => {
      window.removeEventListener('themeChanged', handleThemeChange as EventListener);
    };
  }, []);

  const contextValue: AdminThemeContextType = {
    theme,
    isDarkMode,
    toggleTheme,
    setTheme,
    applyCustomTheme,
    loadSavedTheme,
  };

  return <AdminThemeContext.Provider value={contextValue}>{children}</AdminThemeContext.Provider>;
};

export const useAdminTheme = (): AdminThemeContextType => {
  const context = useContext(AdminThemeContext);
  if (context === undefined) {
    throw new Error('useAdminTheme должен использоваться внутри AdminThemeProvider');
  }
  return context;
};
