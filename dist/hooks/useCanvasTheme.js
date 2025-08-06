import { useState, useEffect, useCallback } from 'react';
export const useCanvasTheme = () => {
    // По умолчанию используем системную тему
    const [theme, setTheme] = useState('system');
    const [resolvedTheme, setResolvedTheme] = useState('light');
    // Определяем системную тему
    const getSystemTheme = useCallback(() => {
        const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        console.log('🎨 Canvas Interface: System theme detected:', isDark ? 'dark' : 'light');
        return isDark ? 'dark' : 'light';
    }, []);
    // Применение темы интерфейса канваса (только для UI элементов, не для контента)
    const applyTheme = useCallback((newTheme) => {
        console.log('🎨 Canvas Interface: Applying theme:', newTheme);
        const canvasContainer = document.querySelector('.redaktus-canvas');
        if (canvasContainer) {
            // Убираем все возможные классы темы интерфейса
            canvasContainer.classList.remove('canvas-interface-dark', 'canvas-interface-light');
            // Устанавливаем атрибут для отладки
            canvasContainer.setAttribute('data-canvas-interface-theme', newTheme);
            if (newTheme === 'dark') {
                // Темная тема интерфейса канваса
                canvasContainer.classList.add('canvas-interface-dark');
                // Применяем стили только к UI элементам канваса, не к контенту
                canvasContainer.style.setProperty('--canvas-ui-bg', '#1f2937');
                canvasContainer.style.setProperty('--canvas-ui-text', '#f9fafb');
                canvasContainer.style.setProperty('--canvas-ui-border', '#374151');
            }
            else {
                // Светлая тема интерфейса канваса
                canvasContainer.classList.add('canvas-interface-light');
                canvasContainer.style.setProperty('--canvas-ui-bg', '#f9fafb');
                canvasContainer.style.setProperty('--canvas-ui-text', '#1f2937');
                canvasContainer.style.setProperty('--canvas-ui-border', '#e5e7eb');
            }
            console.log('🎨 Canvas Interface: Theme applied:', newTheme);
        }
        else {
            console.warn('🎨 Canvas Interface: Container not found!');
        }
    }, []);
    // Инициализация только один раз при монтировании
    useEffect(() => {
        console.log('🎨 Canvas Interface: useEffect initialization');
        // Загружаем сохраненную тему
        const savedTheme = localStorage.getItem('canvas-interface-theme');
        console.log('🎨 Canvas Interface: Saved theme from localStorage:', savedTheme);
        if (savedTheme && ['light', 'dark', 'system'].includes(savedTheme)) {
            console.log('🎨 Canvas Interface: Setting theme to:', savedTheme);
            setTheme(savedTheme);
            // Определяем resolved тему
            let resolved;
            if (savedTheme === 'system') {
                resolved = getSystemTheme();
            }
            else {
                resolved = savedTheme;
            }
            setResolvedTheme(resolved);
            applyTheme(resolved);
        }
        else {
            // При первом запуске ВСЕГДА начинаем со светлой темы
            // чтобы избежать наследования системной темы
            console.log('🎨 Canvas Interface: First time - starting with light theme');
            setTheme('light');
            setResolvedTheme('light');
            applyTheme('light');
        }
    }, [getSystemTheme, applyTheme]);
    // Слушаем изменения системной темы
    useEffect(() => {
        const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
        const handleChange = () => {
            console.log('🎨 Canvas Interface: System theme changed');
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
        console.log('🎨 Canvas Interface: Theme effect triggered for:', theme);
        let newResolvedTheme;
        if (theme === 'system') {
            newResolvedTheme = getSystemTheme();
        }
        else {
            newResolvedTheme = theme;
        }
        console.log('🎨 Canvas Interface: Updating resolved theme to:', newResolvedTheme);
        setResolvedTheme(newResolvedTheme);
        applyTheme(newResolvedTheme);
        // Сохраняем тему в localStorage
        localStorage.setItem('canvas-interface-theme', theme);
    }, [theme, getSystemTheme, applyTheme]);
    // Переключение темы
    const toggleTheme = useCallback(() => {
        console.log('🎨 Canvas Interface: toggleTheme called! Current theme:', theme);
        const themes = ['system', 'light', 'dark'];
        const currentIndex = themes.indexOf(theme);
        const nextIndex = (currentIndex + 1) % themes.length;
        const newTheme = themes[nextIndex];
        console.log('🎨 Canvas Interface: Theme toggle:', theme, '->', newTheme);
        setTheme(newTheme);
    }, [theme]);
    return {
        theme,
        resolvedTheme,
        toggleTheme,
        setTheme
    };
};
//# sourceMappingURL=useCanvasTheme.js.map