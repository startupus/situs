import { useState, useEffect } from 'react';

export type Theme = 'light' | 'dark' | 'system';

export const useTheme = () => {
  // По умолчанию используем системную тему
  const [theme, setTheme] = useState<Theme>('system');
  const [resolvedTheme, setResolvedTheme] = useState<'light' | 'dark'>('light');

  // Определяем системную тему
  const getSystemTheme = (): 'light' | 'dark' => {
    const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    return isDark ? 'dark' : 'light';
  };

  // Применяем тему к интерфейсу по стандартному TailGrids подходу
  const applyTheme = (newTheme: 'light' | 'dark') => {
    const interfaceContainer = document.querySelector('.redaktus-interface');
    
    if (interfaceContainer) {
      // Убираем все темные классы
      interfaceContainer.classList.remove('interface-light', 'interface-dark');
      
      // Применяем новую тему
      interfaceContainer.classList.add(`interface-${newTheme}`);
      
      // Для совместимости с TailWindCSS dark: модификаторами
      // Добавляем/убираем класс dark на интерфейс контейнер
      if (newTheme === 'dark') {
        interfaceContainer.classList.add('dark');
      } else {
        interfaceContainer.classList.remove('dark');
      }
      
      console.log('🎨 Interface theme applied:', newTheme, 'system:', theme === 'system');
    } else {
      console.warn('🎨 Interface container (.redaktus-interface) not found!');
    }
  };

  // Обновляем разрешенную тему
  const updateResolvedTheme = () => {
    let newResolvedTheme: 'light' | 'dark';
    
    if (theme === 'system') {
      newResolvedTheme = getSystemTheme();
    } else {
      newResolvedTheme = theme;
    }
    
    if (newResolvedTheme !== resolvedTheme) {
      setResolvedTheme(newResolvedTheme);
      applyTheme(newResolvedTheme);
    }
  };

  // Инициализация
  useEffect(() => {
    // Загружаем сохраненную тему
    const savedTheme = localStorage.getItem('interface-theme') as Theme;
    if (savedTheme && ['light', 'dark', 'system'].includes(savedTheme)) {
      setTheme(savedTheme);
    }
    
    // Применяем тему
    updateResolvedTheme();
    
    // Слушаем изменения системной темы
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = () => {
      if (theme === 'system') {
        updateResolvedTheme();
      }
    };
    
    mediaQuery.addEventListener('change', handleChange);
    
    return () => {
      mediaQuery.removeEventListener('change', handleChange);
    };
  }, []);

  // Обновляем тему при изменении
  useEffect(() => {
    updateResolvedTheme();
    localStorage.setItem('interface-theme', theme);
  }, [theme]);

  // Переключение темы
  const toggleTheme = () => {
    console.log('🎨 Interface toggleTheme called!');
    const themes: Theme[] = ['system', 'light', 'dark'];
    const currentIndex = themes.indexOf(theme);
    const nextIndex = (currentIndex + 1) % themes.length;
    const newTheme = themes[nextIndex];
    console.log('🎨 Interface theme toggle:', theme, '->', newTheme);
    setTheme(newTheme);
  };

  return {
    theme,
    resolvedTheme,
    toggleTheme,
    setTheme
  };
}; 