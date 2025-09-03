import { useState, useEffect, useCallback } from 'react';

export type Theme = 'light' | 'dark' | 'system';

export const useTheme = () => {
  // По умолчанию используем системную тему
  const [theme, setTheme] = useState<Theme>('system');
  const [resolvedTheme, setResolvedTheme] = useState<'light' | 'dark'>('light');

  // Определяем системную тему
  const getSystemTheme = useCallback((): 'light' | 'dark' => {
    const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    return isDark ? 'dark' : 'light';
  }, []);

  // Применяем тему ГЛОБАЛЬНО к HTML элементу для полного контроля
  const applyTheme = useCallback(
    (newTheme: 'light' | 'dark') => {
      const htmlElement = document.documentElement;

      // ПРИНУДИТЕЛЬНОЕ ПРИМЕНЕНИЕ ТЕМЫ К КОРНЕВОМУ ЭЛЕМЕНТУ
      if (newTheme === 'dark') {
        htmlElement.classList.add('dark');
        console.log('🎨 GLOBAL: Dark theme applied to HTML root');
      } else {
        htmlElement.classList.remove('dark');
        console.log('🎨 GLOBAL: Light theme applied to HTML root');
      }

      // Также применяем к интерфейсу для совместимости
      const interfaceContainer = document.querySelector('.redaktus-interface');
      if (interfaceContainer) {
        interfaceContainer.classList.remove('interface-light', 'interface-dark');
        interfaceContainer.classList.add(`interface-${newTheme}`);

        if (newTheme === 'dark') {
          interfaceContainer.classList.add('dark');
        } else {
          interfaceContainer.classList.remove('dark');
        }
      }

      console.log('🎨 Theme system:', theme, '-> resolved:', newTheme);
    },
    [theme],
  );

  // Обновляем разрешенную тему
  const updateResolvedTheme = useCallback(() => {
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
  }, [theme, resolvedTheme, getSystemTheme, applyTheme]);

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
    setTheme,
  };
};
