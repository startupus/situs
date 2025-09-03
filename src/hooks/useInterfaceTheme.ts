import { useState, useEffect, useCallback } from 'react';

export type InterfaceTheme = 'light' | 'dark';

export const useInterfaceTheme = () => {
  const [theme, setTheme] = useState<InterfaceTheme>('system');
  const [resolvedTheme, setResolvedTheme] = useState<'light' | 'dark'>('light');

  // Применяем тему ТОЛЬКО к интерфейсу редактора
  const applyInterfaceTheme = useCallback((newTheme: 'light' | 'dark') => {
    console.log('🎨 Interface Theme: Applying theme to interface only:', newTheme);

    // Находим контейнер интерфейса
    const interfaceContainer = document.querySelector('.redaktus-interface') as HTMLElement;
    const adminContainer = document.querySelector('.redaktus-admin') as HTMLElement;

    if (interfaceContainer) {
      // Убираем все возможные классы темы
      interfaceContainer.classList.remove('interface-light', 'interface-dark', 'dark', 'light');

      // Применяем тему только к интерфейсу
      interfaceContainer.classList.add(`interface-${newTheme}`);
      interfaceContainer.setAttribute('data-interface-theme', newTheme);

      // Устанавливаем CSS переменные для интерфейса
      if (newTheme === 'dark') {
        interfaceContainer.style.setProperty('--interface-bg', '#1f2937');
        interfaceContainer.style.setProperty('--interface-text', '#f9fafb');
        interfaceContainer.style.setProperty('--interface-border', '#374151');
        interfaceContainer.style.setProperty('--interface-surface', '#374151');
      } else {
        interfaceContainer.style.setProperty('--interface-bg', '#ffffff');
        interfaceContainer.style.setProperty('--interface-text', '#1f2937');
        interfaceContainer.style.setProperty('--interface-border', '#e5e7eb');
        interfaceContainer.style.setProperty('--interface-surface', '#f9fafb');
      }

      console.log('🎨 Interface Theme: Interface theme applied:', newTheme);
    }

    // Применяем тему ко ВСЕМ панелям интерфейса
    const interfacePanels = document.querySelectorAll('.redaktus-interface-panel') as NodeListOf<HTMLElement>;
    interfacePanels.forEach((panel) => {
      panel.setAttribute('data-interface-theme', newTheme);

      // Устанавливаем CSS переменные для каждой панели
      if (newTheme === 'dark') {
        panel.style.setProperty('--interface-bg', '#1f2937');
        panel.style.setProperty('--interface-text', '#f9fafb');
        panel.style.setProperty('--interface-border', '#374151');
        panel.style.setProperty('--interface-surface', '#374151');
      } else {
        panel.style.setProperty('--interface-bg', '#ffffff');
        panel.style.setProperty('--interface-text', '#1f2937');
        panel.style.setProperty('--interface-border', '#e5e7eb');
        panel.style.setProperty('--interface-surface', '#f9fafb');
      }
    });

    if (adminContainer) {
      // Также применяем к админскому контейнеру
      adminContainer.classList.remove('admin-light', 'admin-dark', 'dark', 'light');
      adminContainer.classList.add(`admin-${newTheme}`);
      adminContainer.setAttribute('data-admin-theme', newTheme);
    }

    console.log('🎨 Interface Theme: Applied to', interfacePanels.length, 'panels');
    // НЕ применяем тему к document.documentElement - это изолирует интерфейс
  }, []);

  // Обновляем разрешенную тему
  const updateResolvedTheme = useCallback(() => {
    // Теперь тема всегда равна resolvedTheme
    if (theme !== resolvedTheme) {
      setResolvedTheme(theme);
      applyInterfaceTheme(theme);
    }
  }, [theme, resolvedTheme, applyInterfaceTheme]);

  // Инициализация
  useEffect(() => {
    // Загружаем сохраненную тему интерфейса
    const savedTheme = localStorage.getItem('interface-theme') as InterfaceTheme;
    if (savedTheme && ['light', 'dark'].includes(savedTheme)) {
      setTheme(savedTheme);
    } else {
      // Если сохранена тема system или нет сохраненной темы, устанавливаем light
      setTheme('light');
      localStorage.setItem('interface-theme', 'light');
    }

    // Применяем тему
    updateResolvedTheme();

    // Слушаем изменения системной темы (больше не нужно для интерфейса)
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = () => {
      // Убираем обработчик системной темы для интерфейса
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

  // Переключение темы - только между light и dark
  const toggleTheme = () => {
    console.log('🎨 Interface Theme: toggleTheme called!');

    // Переключаем только между light и dark
    const newTheme: InterfaceTheme = theme === 'light' ? 'dark' : 'light';
    console.log('🎨 Interface Theme: Theme toggle:', theme, '->', newTheme);
    setTheme(newTheme);
  };

  return {
    theme,
    resolvedTheme,
    toggleTheme,
    setTheme,
  };
};
