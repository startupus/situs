// src/components/ui/ThemeWrapper.tsx
import React, { ReactNode } from 'react';
import { useTheme } from '../../contexts/ThemeContext';

interface ThemeWrapperProps {
  children: ReactNode;
  className?: string;
  adaptColors?: boolean;
  adaptTypography?: boolean;
  adaptLayout?: boolean;
  customStyles?: Record<string, string>;
}

/**
 * Универсальный компонент для адаптации Core компонентов к глобальной теме
 * Применяет CSS переменные темы и кастомные стили
 */
export const ThemeWrapper: React.FC<ThemeWrapperProps> = ({
  children,
  className = '',
  adaptColors = true,
  adaptTypography = true,
  adaptLayout = true,
  customStyles = {}
}) => {
  const { currentTheme, isDarkMode } = useTheme();
  
  // Базовые классы для адаптации к теме
  const themeClasses = [
    // Цветовая адаптация
    adaptColors && 'theme-colors',
    // Типографика
    adaptTypography && 'theme-typography',
    // Макет и отступы
    adaptLayout && 'theme-layout',
    // Переходы и анимации
    'transition-all duration-200',
    // Темный режим
    isDarkMode && 'dark',
    // Кастомные классы
    className
  ].filter(Boolean).join(' ');

  // CSS переменные для инлайн стилей
  const themeStyles = {
    '--theme-primary': 'var(--color-primary)',
    '--theme-secondary': 'var(--color-secondary)', 
    '--theme-accent': 'var(--color-accent)',
    '--theme-success': 'var(--color-success)',
    '--theme-warning': 'var(--color-warning)',
    '--theme-error': 'var(--color-error)',
    '--theme-info': 'var(--color-info)',
    '--theme-background': 'var(--color-background)',
    '--theme-surface': 'var(--color-surface)',
    '--theme-text': 'var(--color-text)',
    '--theme-text-secondary': 'var(--color-text-secondary)',
    '--theme-border': 'var(--color-border)',
    '--theme-border-light': 'var(--color-border-light)',
    ...customStyles
  } as React.CSSProperties;

  return (
    <div 
      className={themeClasses}
      style={themeStyles}
    >
      {children}
    </div>
  );
};

/**
 * HOC для оборачивания Core компонентов в ThemeWrapper
 */
export const withTheme = <P extends object>(
  Component: React.ComponentType<P>,
  wrapperProps: Partial<ThemeWrapperProps> = {}
) => {
  const ThemedComponent: React.FC<P> = (props) => (
    <ThemeWrapper {...wrapperProps}>
      <Component {...props} />
    </ThemeWrapper>
  );
  
  ThemedComponent.displayName = `withTheme(${Component.displayName || Component.name})`;
  
  return ThemedComponent;
};

export default ThemeWrapper;