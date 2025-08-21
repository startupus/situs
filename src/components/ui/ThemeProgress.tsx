import React from 'react';

interface ThemeProgressProps {
  value: number;
  max?: number;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'primary' | 'secondary' | 'success' | 'danger' | 'warning' | 'info';
  showLabel?: boolean;
  label?: string;
  showPercentage?: boolean;
  animated?: boolean;
  striped?: boolean;
  className?: string;
}

const ThemeProgress: React.FC<ThemeProgressProps> = ({
  value,
  max = 100,
  size = 'md',
  variant = 'primary',
  showLabel = false,
  label,
  showPercentage = false,
  animated = false,
  striped = false,
  className = ''
}) => {
  const percentage = Math.min(Math.max((value / max) * 100, 0), 100);

  const getSizeStyles = () => {
    const sizes = {
      sm: 'h-2',
      md: 'h-3',
      lg: 'h-4'
    };
    return sizes[size];
  };

  const getVariantStyles = () => {
    const variants = {
      primary: 'bg-blue-600',
      secondary: 'bg-gray-600',
      success: 'bg-green-600',
      danger: 'bg-red-600',
      warning: 'bg-yellow-600',
      info: 'bg-cyan-600'
    };
    return variants[variant];
  };

  const getStripedStyles = () => {
    if (!striped) return '';
    return 'bg-gradient-to-r from-transparent via-white/20 to-transparent bg-[length:1rem_1rem]';
  };

  const getAnimatedStyles = () => {
    if (!animated) return '';
    return 'animate-pulse';
  };

  return (
    <div className={`w-full ${className}`}>
      {(showLabel || showPercentage) && (
        <div className="flex justify-between items-center mb-2">
          {showLabel && label && (
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              {label}
            </span>
          )}
          {showPercentage && (
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              {Math.round(percentage)}%
            </span>
          )}
        </div>
      )}
      
      <div className={`
        w-full bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden
        ${getSizeStyles()}
      `.trim().replace(/\s+/g, ' ')}>
        <div
          className={`
            ${getSizeStyles()}
            ${getVariantStyles()}
            ${getStripedStyles()}
            ${getAnimatedStyles()}
            rounded-full transition-all duration-300 ease-in-out
          `.trim().replace(/\s+/g, ' ')}
          style={{ width: `${percentage}%` }}
          role="progressbar"
          aria-valuenow={value}
          aria-valuemin={0}
          aria-valuemax={max}
        />
      </div>
    </div>
  );
};

export default ThemeProgress;
