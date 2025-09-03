import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { ProjectTheme, ProjectThemeSettings } from '../types/theme';

interface ProjectThemeContextType {
  theme: ProjectTheme;
  isDarkMode: boolean;
  inheritFromSite: boolean;
  customColors?: {
    primary?: string;
    secondary?: string;
    accent?: string;
    background?: string;
    text?: string;
  };
  toggleTheme: () => void;
  setTheme: (theme: ProjectTheme) => void;
  setInheritFromSite: (inherit: boolean) => void;
  setCustomColors: (colors: ProjectThemeSettings['customColors']) => void;
}

const ProjectThemeContext = createContext<ProjectThemeContextType | undefined>(undefined);

interface ProjectThemeProviderProps {
  children: ReactNode;
}

export const ProjectThemeProvider: React.FC<ProjectThemeProviderProps> = ({ children }) => {
  const [theme, setThemeState] = useState<ProjectTheme>('inherit');
  const [isDarkMode, setIsDarkMode] = useState<boolean>(false);
  const [inheritFromSite, setInheritFromSiteState] = useState<boolean>(true);
  const [customColors, setCustomColorsState] = useState<ProjectThemeSettings['customColors']>({});

  // Загрузка настроек при инициализации
  useEffect(() => {
    const savedSettings = localStorage.getItem('project-theme-settings');
    if (savedSettings) {
      const settings: ProjectThemeSettings = JSON.parse(savedSettings);
      setThemeState(settings.theme);
      setIsDarkMode(settings.isDarkMode);
      setInheritFromSiteState(settings.inheritFromSite);
      setCustomColorsState(settings.customColors || {});
    }
  }, []);

  // Применение темы к контенту сайта (только к блокам внутри канваса)
  useEffect(() => {
    const canvasContainer = document.querySelector('.redaktus-canvas') as HTMLElement;
    if (!canvasContainer) return;

    // Создаем или обновляем стили для контента сайта
    let projectStyles = document.getElementById('project-theme-styles');
    if (!projectStyles) {
      projectStyles = document.createElement('style');
      projectStyles.id = 'project-theme-styles';
      document.head.appendChild(projectStyles);
    }

    let css = '';

    if (theme === 'inherit') {
      // Наследуем от сайта - не применяем никаких стилей
      css = '';
    } else {
      // Применяем тему только к контенту сайта
      const isDark = theme === 'dark' || (theme === 'system' && isDarkMode);

      css = `
        .redaktus-canvas .site-content {
          ${isDark ? 'background-color: #111827; color: #f9fafb;' : 'background-color: #ffffff; color: #1f2937;'}
        }
        
        .redaktus-canvas .site-content * {
          ${isDark ? 'color: inherit;' : 'color: inherit;'}
        }
      `;

      // Применяем кастомные цвета если есть
      if (customColors) {
        css += `
          .redaktus-canvas .site-content {
            ${customColors.primary ? `--site-primary: ${customColors.primary};` : ''}
            ${customColors.secondary ? `--site-secondary: ${customColors.secondary};` : ''}
            ${customColors.accent ? `--site-accent: ${customColors.accent};` : ''}
            ${customColors.background ? `--site-background: ${customColors.background};` : ''}
            ${customColors.text ? `--site-text: ${customColors.text};` : ''}
          }
        `;
      }
    }

    projectStyles.textContent = css;
  }, [theme, isDarkMode, customColors]);

  const setTheme = (newTheme: ProjectTheme) => {
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
    const settings: ProjectThemeSettings = {
      theme: newTheme,
      isDarkMode: newIsDarkMode,
      inheritFromSite,
      customColors,
    };
    localStorage.setItem('project-theme-settings', JSON.stringify(settings));
  };

  const setInheritFromSite = (inherit: boolean) => {
    setInheritFromSiteState(inherit);

    const settings: ProjectThemeSettings = {
      theme,
      isDarkMode,
      inheritFromSite: inherit,
      customColors,
    };
    localStorage.setItem('project-theme-settings', JSON.stringify(settings));
  };

  const setCustomColors = (colors: ProjectThemeSettings['customColors']) => {
    setCustomColorsState(colors);

    const settings: ProjectThemeSettings = {
      theme,
      isDarkMode,
      inheritFromSite,
      customColors: colors,
    };
    localStorage.setItem('project-theme-settings', JSON.stringify(settings));
  };

  const toggleTheme = () => {
    const themes: ProjectTheme[] = ['inherit', 'system', 'light', 'dark'];
    const currentIndex = themes.indexOf(theme);
    const nextIndex = (currentIndex + 1) % themes.length;
    setTheme(themes[nextIndex]);
  };

  const contextValue: ProjectThemeContextType = {
    theme,
    isDarkMode,
    inheritFromSite,
    customColors,
    toggleTheme,
    setTheme,
    setInheritFromSite,
    setCustomColors,
  };

  return <ProjectThemeContext.Provider value={contextValue}>{children}</ProjectThemeContext.Provider>;
};

export const useProjectTheme = (): ProjectThemeContextType => {
  const context = useContext(ProjectThemeContext);
  if (context === undefined) {
    throw new Error('useProjectTheme должен использоваться внутри ProjectThemeProvider');
  }
  return context;
};
