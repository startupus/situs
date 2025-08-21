import React from 'react';

interface ThemeSpinnerProps {
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'primary' | 'secondary' | 'success' | 'danger' | 'warning' | 'info' | 'light' | 'dark';
  type?: 'border' | 'grow' | 'dots' | 'pulse';
  className?: string;
}

const ThemeSpinner: React.FC<ThemeSpinnerProps> = ({
  size = 'md',
  variant = 'primary',
  type = 'border',
  className = ''
}) => {
  const getSizeStyles = () => {
    const sizes = {
      xs: 'w-3 h-3',
      sm: 'w-4 h-4',
      md: 'w-6 h-6',
      lg: 'w-8 h-8',
      xl: 'w-12 h-12'
    };
    return sizes[size];
  };

  const getVariantStyles = () => {
    const variants = {
      primary: 'border-blue-600',
      secondary: 'border-gray-600',
      success: 'border-green-600',
      danger: 'border-red-600',
      warning: 'border-yellow-600',
      info: 'border-cyan-600',
      light: 'border-gray-300',
      dark: 'border-gray-800'
    };
    return variants[variant];
  };

  const getBorderSpinner = () => (
    <div
      className={`
        ${getSizeStyles()}
        border-2 border-gray-200 dark:border-gray-700
        ${getVariantStyles()}
        border-t-transparent
        rounded-full animate-spin
        ${className}
      `.trim().replace(/\s+/g, ' ')}
      role="status"
      aria-label="Загрузка"
    >
      <span className="sr-only">Загрузка...</span>
    </div>
  );

  const getGrowSpinner = () => (
    <div
      className={`
        ${getSizeStyles()}
        ${getVariantStyles().replace('border-', 'bg-')}
        rounded-full animate-ping
        ${className}
      `.trim().replace(/\s+/g, ' ')}
      role="status"
      aria-label="Загрузка"
    >
      <span className="sr-only">Загрузка...</span>
    </div>
  );

  const getDotsSpinner = () => {
    const dotSize = size === 'xs' ? 'w-1 h-1' : size === 'sm' ? 'w-1.5 h-1.5' : size === 'md' ? 'w-2 h-2' : size === 'lg' ? 'w-2.5 h-2.5' : 'w-3 h-3';
    const bgColor = getVariantStyles().replace('border-', 'bg-');
    
    return (
      <div className={`flex space-x-1 ${className}`} role="status" aria-label="Загрузка">
        <div className={`${dotSize} ${bgColor} rounded-full animate-bounce`} style={{ animationDelay: '0ms' }}></div>
        <div className={`${dotSize} ${bgColor} rounded-full animate-bounce`} style={{ animationDelay: '150ms' }}></div>
        <div className={`${dotSize} ${bgColor} rounded-full animate-bounce`} style={{ animationDelay: '300ms' }}></div>
        <span className="sr-only">Загрузка...</span>
      </div>
    );
  };

  const getPulseSpinner = () => (
    <div
      className={`
        ${getSizeStyles()}
        ${getVariantStyles().replace('border-', 'bg-')}
        rounded-full animate-pulse
        ${className}
      `.trim().replace(/\s+/g, ' ')}
      role="status"
      aria-label="Загрузка"
    >
      <span className="sr-only">Загрузка...</span>
    </div>
  );

  switch (type) {
    case 'grow':
      return getGrowSpinner();
    case 'dots':
      return getDotsSpinner();
    case 'pulse':
      return getPulseSpinner();
    case 'border':
    default:
      return getBorderSpinner();
  }
};

export default ThemeSpinner;
