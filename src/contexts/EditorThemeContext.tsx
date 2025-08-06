import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { EditorTheme, EditorThemeSettings } from '../types/theme';

interface EditorThemeContextType {
  theme: EditorTheme;
  isDarkMode: boolean;
  toggleTheme: () => void;
  setTheme: (theme: EditorTheme) => void;
}

const EditorThemeContext = createContext<EditorThemeContextType | undefined>(undefined);

interface EditorThemeProviderProps {
  children: ReactNode;
}

export const EditorThemeProvider: React.FC<EditorThemeProviderProps> = ({ children }) => {
  const [theme, setThemeState] = useState<EditorTheme>('system');
  const [isDarkMode, setIsDarkMode] = useState<boolean>(false);

  // Загрузка настроек при инициализации
  useEffect(() => {
    const savedSettings = localStorage.getItem('editor-theme-settings');
    if (savedSettings) {
      const settings: EditorThemeSettings = JSON.parse(savedSettings);
      setThemeState(settings.theme);
      setIsDarkMode(settings.isDarkMode);
    }
  }, []);

  // Применение темы к DOM
  useEffect(() => {
    const root = document.documentElement;
    
    if (isDarkMode) {
      root.classList.add('editor-dark');
      root.classList.remove('editor-light');
    } else {
      root.classList.add('editor-light');
      root.classList.remove('editor-dark');
    }
  }, [isDarkMode]);

  const setTheme = (newTheme: EditorTheme) => {
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
    const settings: EditorThemeSettings = {
      theme: newTheme,
      isDarkMode: newIsDarkMode
    };
    localStorage.setItem('editor-theme-settings', JSON.stringify(settings));
  };

  const toggleTheme = () => {
    const themes: EditorTheme[] = ['system', 'light', 'dark'];
    const currentIndex = themes.indexOf(theme);
    const nextIndex = (currentIndex + 1) % themes.length;
    setTheme(themes[nextIndex]);
  };

  const contextValue: EditorThemeContextType = {
    theme,
    isDarkMode,
    toggleTheme,
    setTheme
  };

  return (
    <EditorThemeContext.Provider value={contextValue}>
      {children}
    </EditorThemeContext.Provider>
  );
};

export const useEditorTheme = (): EditorThemeContextType => {
  const context = useContext(EditorThemeContext);
  if (context === undefined) {
    throw new Error('useEditorTheme должен использоваться внутри EditorThemeProvider');
  }
  return context;
};
