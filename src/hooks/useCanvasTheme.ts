import { useState, useEffect, useCallback } from 'react';

export type CanvasTheme = 'light' | 'dark' | 'system';

export const useCanvasTheme = () => {
  // По умолчанию используем системную тему
  const [theme, setTheme] = useState<CanvasTheme>('system');
  const [resolvedTheme, setResolvedTheme] = useState<'light' | 'dark'>('light');

  // Определяем системную тему
  const getSystemTheme = useCallback((): 'light' | 'dark' => {
    const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    console.log('🎨 Canvas: System theme detected:', isDark ? 'dark' : 'light');
    return isDark ? 'dark' : 'light';
  }, []);

  // Применяем тему к канвасу по стандартному TailGrids подходу
  const applyTheme = useCallback((newTheme: 'light' | 'dark') => {
    console.log('🎨 Canvas: Attempting to apply theme:', newTheme);
    const canvasContainer = document.querySelector('.redaktus-canvas');
    console.log('🎨 Canvas: Container found:', !!canvasContainer);
    
    if (canvasContainer) {
      console.log('🎨 Canvas: Classes before:', canvasContainer.className);
      
      // Убираем все темные классы
      canvasContainer.classList.remove('canvas-light', 'canvas-dark');
      
      // Применяем новую тему
      canvasContainer.classList.add(`canvas-${newTheme}`);
      
      // Для совместимости с TailWindCSS dark: модификаторами
      // Добавляем/убираем класс dark на канвас контейнер
      if (newTheme === 'dark') {
        canvasContainer.classList.add('dark');
      } else {
        canvasContainer.classList.remove('dark');
      }
      
      console.log('🎨 Canvas: Classes after:', canvasContainer.className);
      console.log('🎨 Canvas: Theme applied successfully:', newTheme);
    } else {
      console.warn('🎨 Canvas: Container (.redaktus-canvas) not found!');
    }
  }, []);



  // Инициализация только один раз
  useEffect(() => {
    console.log('🎨 Canvas: useEffect initialization');
    
    // Загружаем сохраненную тему
    const savedTheme = localStorage.getItem('canvas-theme') as CanvasTheme;
    console.log('🎨 Canvas: Saved theme from localStorage:', savedTheme);
    
    if (savedTheme && ['light', 'dark', 'system'].includes(savedTheme)) {
      console.log('🎨 Canvas: Setting theme to:', savedTheme);
      setTheme(savedTheme);
    }
  }, []);

  // Слушаем изменения системной темы
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = () => {
      console.log('🎨 Canvas: System theme changed');
      if (theme === 'system') {
        const systemTheme = getSystemTheme();
        if (systemTheme !== resolvedTheme) {
          setResolvedTheme(systemTheme);
          applyTheme(systemTheme);
        }
      }
    };
    
    mediaQuery.addEventListener('change', handleChange);
    
    return () => {
      mediaQuery.removeEventListener('change', handleChange);
    };
  }, [theme, resolvedTheme]);

  // Обновляем тему при изменении
  useEffect(() => {
    console.log('🎨 Canvas: Theme changed to:', theme);
    
    let newResolvedTheme: 'light' | 'dark';
    
    if (theme === 'system') {
      newResolvedTheme = getSystemTheme();
    } else {
      newResolvedTheme = theme;
    }
    
    console.log('🎨 Canvas: Updating resolved theme from', resolvedTheme, 'to', newResolvedTheme);
    
    if (newResolvedTheme !== resolvedTheme) {
      setResolvedTheme(newResolvedTheme);
      applyTheme(newResolvedTheme);
    }
    
    localStorage.setItem('canvas-theme', theme);
  }, [theme, resolvedTheme]);

  // Переключение темы
  const toggleTheme = () => {
    console.log('🎨 Canvas: toggleTheme called! Current theme:', theme);
    const themes: CanvasTheme[] = ['system', 'light', 'dark'];
    const currentIndex = themes.indexOf(theme);
    const nextIndex = (currentIndex + 1) % themes.length;
    const newTheme = themes[nextIndex];
    console.log('🎨 Canvas: Theme toggle:', theme, '->', newTheme);
    setTheme(newTheme);
  };

  return {
    theme,
    resolvedTheme,
    toggleTheme,
    setTheme
  };
}; 