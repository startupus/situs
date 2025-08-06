import { useState, useEffect, useCallback } from 'react';

export type CanvasTheme = 'light' | 'dark' | 'system';

export const useCanvasTheme = () => {
  // По умолчанию используем светлую тему для канваса
  const [theme, setTheme] = useState<CanvasTheme>('light');
  const [resolvedTheme, setResolvedTheme] = useState<'light' | 'dark'>('light');

  // Определяем системную тему
  const getSystemTheme = useCallback((): 'light' | 'dark' => {
    const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    console.log('🎨 Canvas Theme: System theme detected:', isDark ? 'dark' : 'light');
    return isDark ? 'dark' : 'light';
  }, []);

  // Применение темы канваса с ПОЛНОЙ изоляцией от темы интерфейса
  const applyTheme = useCallback((newTheme: 'light' | 'dark') => {
    console.log('🎨 Canvas Theme: Applying isolated theme:', newTheme);
    const canvasContainer = document.querySelector('.redaktus-canvas') as HTMLElement;
    
    if (canvasContainer) {
      // Полная очистка всех стилей и классов
      canvasContainer.removeAttribute('style');
      canvasContainer.classList.remove('dark', 'light', 'canvas-interface-dark', 'canvas-interface-light', 'canvas-light', 'canvas-dark');
      
      // Устанавливаем атрибуты для изоляции
      canvasContainer.setAttribute('data-canvas-theme', newTheme);
      canvasContainer.setAttribute('data-canvas-isolated', 'true');
      
      // Применяем тему канваса
      canvasContainer.classList.add(`canvas-${newTheme}`);
      
      // Добавляем класс dark для Tailwind dark режима
      if (newTheme === 'dark') {
        canvasContainer.classList.add('dark');
      }
      
      // Создаем изолированные CSS переменные для канваса
      const canvasStyles = {
        // Базовые стили канваса
        '--canvas-bg': newTheme === 'dark' ? '#111827' : '#ffffff',
        '--canvas-text': newTheme === 'dark' ? '#f9fafb' : '#1f2937',
        '--canvas-border': newTheme === 'dark' ? '#374151' : '#e5e7eb',
        '--canvas-surface': newTheme === 'dark' ? '#1f2937' : '#f9fafb',
        
        // UI элементы канваса
        '--canvas-ui-bg': newTheme === 'dark' ? '#1f2937' : '#f9fafb',
        '--canvas-ui-text': newTheme === 'dark' ? '#f9fafb' : '#1f2937',
        '--canvas-ui-border': newTheme === 'dark' ? '#374151' : '#e5e7eb',
        
        // Контент сайта
        '--canvas-content-bg': newTheme === 'dark' ? '#111827' : '#ffffff',
        '--canvas-content-text': newTheme === 'dark' ? '#f9fafb' : '#1f2937',
        '--canvas-content-surface': newTheme === 'dark' ? '#1f2937' : '#f9fafb',
        
        // Изоляция от интерфейса
        '--interface-theme-inheritance': 'none',
        '--tw-bg-opacity': '1',
        '--tw-text-opacity': '1',
        '--tw-border-opacity': '1',
        
        // Принудительная тема
        'color-scheme': newTheme,
        'background-color': newTheme === 'dark' ? '#111827' : '#ffffff',
        'color': newTheme === 'dark' ? '#f9fafb' : '#1f2937'
      };
      
      // Применяем все стили
      Object.entries(canvasStyles).forEach(([property, value]) => {
        canvasContainer.style.setProperty(property, value);
      });
      
      console.log('🎨 Canvas Theme: Fully isolated theme applied:', newTheme);
    } else {
      console.warn('🎨 Canvas Theme: Canvas container not found!');
    }
  }, []);

  // Инициализация только один раз при монтировании
  useEffect(() => {
    console.log('🎨 Canvas Theme: useEffect initialization');
    
    // Загружаем сохраненную тему канваса
    const savedTheme = localStorage.getItem('canvas-theme') as CanvasTheme;
    console.log('🎨 Canvas Theme: Saved theme from localStorage:', savedTheme);
    
    if (savedTheme && ['light', 'dark', 'system'].includes(savedTheme)) {
      console.log('🎨 Canvas Theme: Setting theme to:', savedTheme);
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
      // При первом запуске ВСЕГДА начинаем со светлой темы канваса
      // чтобы избежать наследования системной темы интерфейса
      console.log('🎨 Canvas Theme: First time - starting with light theme');
      setTheme('light');
      setResolvedTheme('light');
      applyTheme('light');
    }
  }, [getSystemTheme, applyTheme]);

  // Слушаем изменения системной темы
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = () => {
      console.log('🎨 Canvas Theme: System theme changed');
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
    console.log('🎨 Canvas Theme: Theme effect triggered for:', theme);
    
    let newResolvedTheme: 'light' | 'dark';
    
    if (theme === 'system') {
      newResolvedTheme = getSystemTheme();
    } else {
      newResolvedTheme = theme;
    }
    
    console.log('🎨 Canvas Theme: Updating resolved theme to:', newResolvedTheme);
    
    setResolvedTheme(newResolvedTheme);
    applyTheme(newResolvedTheme);
    
    // Сохраняем тему канваса в localStorage
    localStorage.setItem('canvas-theme', theme);
  }, [theme, getSystemTheme, applyTheme]);

  // Переключение темы канваса (только light ↔ dark)
  const toggleTheme = useCallback(() => {
    console.log('🎨 Canvas Theme: toggleTheme called! Current theme:', theme);
    
    // Простое переключение между light и dark (без system)
    const newTheme: CanvasTheme = resolvedTheme === 'light' ? 'dark' : 'light';
    
    console.log('🎨 Canvas Theme: Theme toggle:', resolvedTheme, '->', newTheme);
    setTheme(newTheme);
  }, [theme, resolvedTheme]);

  return {
    theme,
    resolvedTheme,
    toggleTheme,
    setTheme
  };
}; 