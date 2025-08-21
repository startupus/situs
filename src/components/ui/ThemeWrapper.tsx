// src/components/ui/ThemeWrapper.tsx
import React, { ReactNode } from 'react';

interface ThemeWrapperProps {
  children: ReactNode;
  className?: string;
  themeType?: 'primary' | 'secondary' | 'success' | 'warning' | 'danger' | 'info' | 'dark' | 'light';
}

/**
 * Универсальный компонент для адаптации Core компонентов к глобальной теме
 * Применяет CSS классы для интеграции с системой тем проекта
 */
export const ThemeWrapper: React.FC<ThemeWrapperProps> = ({
  children,
  className = '',
  themeType = 'primary'
}) => {
  // Базовые классы для адаптации к теме
  const themeClasses = [
    // Основной класс для применения тематических стилей
    'theme-core-component',
    // Цветовая адаптация
    'theme-colors',
    // Типографика
    'theme-typography', 
    // Переходы и анимации
    'transition-all duration-200',
    // Тип темы
    `theme-${themeType}`,
    // Кастомные классы
    className
  ].filter(Boolean).join(' ');

  return (
    <div className={themeClasses}>
      {children}
    </div>
  );
};

/**
 * HOC для оборачивания Core компонентов в ThemeWrapper
 */
export const withTheme = <P extends object>(
  Component: React.ComponentType<P>,
  themeType: ThemeWrapperProps['themeType'] = 'primary'
) => {
  const ThemedComponent: React.FC<P & { className?: string }> = ({ className, ...props }) => (
    <ThemeWrapper className={className} themeType={themeType}>
      <Component {...(props as P)} />
    </ThemeWrapper>
  );
  
  ThemedComponent.displayName = `withTheme(${Component.displayName || Component.name})`;
  
  return ThemedComponent;
};

export default ThemeWrapper;