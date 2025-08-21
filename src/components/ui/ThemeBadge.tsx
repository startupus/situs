import React, { ReactNode } from 'react';

interface ThemeBadgeProps {
  children: ReactNode;
  variant?: 'primary' | 'secondary' | 'success' | 'danger' | 'warning' | 'info' | 'light' | 'dark' | 'gray';
  size?: 'sm' | 'md' | 'lg';
  rounded?: 'none' | 'sm' | 'md' | 'lg' | 'full';
  outline?: boolean;
  opacity?: boolean;
  className?: string;
}

const ThemeBadge: React.FC<ThemeBadgeProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  rounded = 'md',
  outline = false,
  opacity = false,
  className = ''
}) => {
  const getVariantStyles = () => {
    const baseStyles = {
      primary: outline 
        ? 'border-blue-600 text-blue-600 dark:text-blue-400 dark:border-blue-400'
        : opacity 
          ? 'bg-blue-600/10 text-blue-600 dark:text-blue-400'
          : 'bg-blue-600 text-white dark:bg-blue-500',
      secondary: outline
        ? 'border-gray-600 text-gray-600 dark:text-gray-400 dark:border-gray-400'
        : opacity
          ? 'bg-gray-600/10 text-gray-600 dark:text-gray-400'
          : 'bg-gray-600 text-white dark:bg-gray-500',
      success: outline
        ? 'border-green-600 text-green-600 dark:text-green-400 dark:border-green-400'
        : opacity
          ? 'bg-green-600/10 text-green-600 dark:text-green-400'
          : 'bg-green-600 text-white dark:bg-green-500',
      danger: outline
        ? 'border-red-600 text-red-600 dark:text-red-400 dark:border-red-400'
        : opacity
          ? 'bg-red-600/10 text-red-600 dark:text-red-400'
          : 'bg-red-600 text-white dark:bg-red-500',
      warning: outline
        ? 'border-yellow-600 text-yellow-600 dark:text-yellow-400 dark:border-yellow-400'
        : opacity
          ? 'bg-yellow-600/10 text-yellow-600 dark:text-yellow-400'
          : 'bg-yellow-600 text-white dark:bg-yellow-500',
      info: outline
        ? 'border-cyan-600 text-cyan-600 dark:text-cyan-400 dark:border-cyan-400'
        : opacity
          ? 'bg-cyan-600/10 text-cyan-600 dark:text-cyan-400'
          : 'bg-cyan-600 text-white dark:bg-cyan-500',
      light: outline
        ? 'border-gray-300 text-gray-700 dark:text-gray-300 dark:border-gray-600'
        : opacity
          ? 'bg-gray-100/50 text-gray-700 dark:text-gray-300 dark:bg-gray-700/50'
          : 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300',
      dark: outline
        ? 'border-gray-800 text-gray-800 dark:text-gray-200 dark:border-gray-200'
        : opacity
          ? 'bg-gray-800/10 text-gray-800 dark:text-gray-200 dark:bg-gray-200/10'
          : 'bg-gray-800 text-white dark:bg-gray-200 dark:text-gray-800',
      gray: outline
        ? 'border-gray-500 text-gray-500 dark:text-gray-400 dark:border-gray-400'
        : opacity
          ? 'bg-gray-500/10 text-gray-500 dark:text-gray-400'
          : 'bg-gray-500 text-white dark:bg-gray-400 dark:text-gray-800'
    };
    return baseStyles[variant];
  };

  const getSizeStyles = () => {
    const sizes = {
      sm: 'px-2 py-0.5 text-xs',
      md: 'px-2.5 py-1 text-xs',
      lg: 'px-3 py-1.5 text-sm'
    };
    return sizes[size];
  };

  const getRoundedStyles = () => {
    const roundedStyles = {
      none: 'rounded-none',
      sm: 'rounded-sm',
      md: 'rounded-md',
      lg: 'rounded-lg',
      full: 'rounded-full'
    };
    return roundedStyles[rounded];
  };

  return (
    <span
      className={`
        inline-flex items-center font-medium
        ${getSizeStyles()}
        ${getRoundedStyles()}
        ${getVariantStyles()}
        ${outline ? 'border' : ''}
        ${className}
      `.trim().replace(/\s+/g, ' ')}
    >
      {children}
    </span>
  );
};

export default ThemeBadge;
