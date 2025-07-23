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

  // Применение темы канваса с максимальной изоляцией от интерфейса
  const applyTheme = useCallback((newTheme: 'light' | 'dark') => {
    console.log('🎨 Canvas: Applying theme:', newTheme);
    const canvasContainer = document.querySelector('.redaktus-canvas') as HTMLElement;
    
    if (canvasContainer) {
      // МАКСИМАЛЬНАЯ ЗАЩИТА: убираем ВСЕ возможные классы темы
      canvasContainer.classList.remove('dark', 'light', 'canvas-dark', 'canvas-light', 'interface-dark', 'interface-light');
      
      // Убираем наследуемые атрибуты темы
      canvasContainer.removeAttribute('data-theme');
      canvasContainer.removeAttribute('data-color-scheme');
      
      // Устанавливаем наш атрибут для отладки
      canvasContainer.setAttribute('data-canvas-theme', newTheme);
      
      if (newTheme === 'dark') {
        // Темная тема канваса
        canvasContainer.classList.add('dark');
        canvasContainer.style.backgroundColor = '#111827';
        canvasContainer.style.color = '#f9fafb';
        canvasContainer.style.colorScheme = 'dark';
      } else {
        // Светлая тема канваса - принудительно светлая
        canvasContainer.style.backgroundColor = '#ffffff';
        canvasContainer.style.color = '#1f2937';
        canvasContainer.style.colorScheme = 'light';
      }
      
      // Принудительная изоляция от родительских стилей
      canvasContainer.style.isolation = 'isolate';
      canvasContainer.style.contain = 'layout style';
      canvasContainer.style.position = 'relative';
      canvasContainer.style.zIndex = '1';
      
      console.log('🎨 Canvas: Theme applied:', newTheme, 'dark class:', canvasContainer.classList.contains('dark'));
      console.log('🎨 Canvas: Background:', canvasContainer.style.backgroundColor);
    } else {
      console.warn('🎨 Canvas: Container not found!');
    }
  }, []);

  // Инициализация только один раз при монтировании
  useEffect(() => {
    console.log('🎨 Canvas: useEffect initialization');
    
    // Загружаем сохраненную тему
    const savedTheme = localStorage.getItem('canvas-theme') as CanvasTheme;
    console.log('🎨 Canvas: Saved theme from localStorage:', savedTheme);
    
    if (savedTheme && ['light', 'dark', 'system'].includes(savedTheme)) {
      console.log('🎨 Canvas: Setting theme to:', savedTheme);
      setTheme(savedTheme);
      
      // Определяем resolved тему
      let resolved: 'light' | 'dark';
      if (savedTheme === 'system') {
        resolved = getSystemTheme();
      } else {
        resolved = savedTheme;
      }
      setResolvedTheme(resolved);
      applyTheme(resolved);
    } else {
      // При первом запуске ВСЕГДА начинаем со светлой темы
      // чтобы избежать наследования системной темы
      console.log('🎨 Canvas: First time - starting with light theme');
      setTheme('light');
      setResolvedTheme('light');
      applyTheme('light');
    }
  }, [getSystemTheme, applyTheme]);

  // Слушаем изменения системной темы
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = () => {
      console.log('🎨 Canvas: System theme changed');
      if (theme === 'system') {
        const systemTheme = getSystemTheme();
        setResolvedTheme(systemTheme);
        applyTheme(systemTheme);
      }
    };
    
    mediaQuery.addEventListener('change', handleChange);
    
    return () => {
      mediaQuery.removeEventListener('change', handleChange);
    };
  }, [theme, getSystemTheme, applyTheme]);

  // Обновляем тему при изменении theme (НЕ при инициализации!)
  useEffect(() => {
    // Пропускаем эффект при первом рендере
    console.log('🎨 Canvas: Theme effect triggered for:', theme);
    
    let newResolvedTheme: 'light' | 'dark';
    
    if (theme === 'system') {
      newResolvedTheme = getSystemTheme();
    } else {
      newResolvedTheme = theme;
    }
    
    console.log('🎨 Canvas: Updating resolved theme to:', newResolvedTheme);
    
    setResolvedTheme(newResolvedTheme);
    applyTheme(newResolvedTheme);
    
    // Сохраняем тему в localStorage
    localStorage.setItem('canvas-theme', theme);
  }, [theme, getSystemTheme, applyTheme]);

  // Переключение темы
  const toggleTheme = useCallback(() => {
    console.log('🎨 Canvas: toggleTheme called! Current theme:', theme);
    const themes: CanvasTheme[] = ['system', 'light', 'dark'];
    const currentIndex = themes.indexOf(theme);
    const nextIndex = (currentIndex + 1) % themes.length;
    const newTheme = themes[nextIndex];
    console.log('🎨 Canvas: Theme toggle:', theme, '->', newTheme);
    setTheme(newTheme);
  }, [theme]);

  return {
    theme,
    resolvedTheme,
    toggleTheme,
    setTheme
  };
}; 