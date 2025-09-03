import React from 'react';

interface ThemeSwitchProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'primary' | 'secondary' | 'success' | 'danger' | 'warning' | 'info';
  disabled?: boolean;
  label?: string;
  description?: string;
  className?: string;
  id?: string;
}

const ThemeSwitch: React.FC<ThemeSwitchProps> = ({
  checked,
  onChange,
  size = 'md',
  variant = 'primary',
  disabled = false,
  label,
  description,
  className = '',
  id,
}) => {
  const getSizeStyles = () => {
    const sizes = {
      sm: {
        switch: 'w-8 h-4',
        thumb: 'w-3 h-3',
        translate: 'translate-x-4',
      },
      md: {
        switch: 'w-11 h-6',
        thumb: 'w-5 h-5',
        translate: 'translate-x-5',
      },
      lg: {
        switch: 'w-14 h-7',
        thumb: 'w-6 h-6',
        translate: 'translate-x-7',
      },
    };
    return sizes[size];
  };

  const getVariantStyles = () => {
    const variants = {
      primary: checked ? 'bg-blue-600' : 'bg-gray-200 dark:bg-gray-700',
      secondary: checked ? 'bg-gray-600' : 'bg-gray-200 dark:bg-gray-700',
      success: checked ? 'bg-green-600' : 'bg-gray-200 dark:bg-gray-700',
      danger: checked ? 'bg-red-600' : 'bg-gray-200 dark:bg-gray-700',
      warning: checked ? 'bg-yellow-600' : 'bg-gray-200 dark:bg-gray-700',
      info: checked ? 'bg-cyan-600' : 'bg-gray-200 dark:bg-gray-700',
    };
    return variants[variant];
  };

  const sizeStyles = getSizeStyles();
  const variantStyles = getVariantStyles();

  const handleChange = () => {
    if (!disabled) {
      onChange(!checked);
    }
  };

  return (
    <div className={`flex items-center ${className}`}>
      <div className="flex items-center">
        <button
          type="button"
          className={`
            ${sizeStyles.switch}
            relative inline-flex items-center rounded-full
            ${variantStyles}
            ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
            transition-colors duration-200 ease-in-out
            focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500
          `
            .trim()
            .replace(/\s+/g, ' ')}
          role="switch"
          aria-checked={checked}
          aria-disabled={disabled}
          onClick={handleChange}
          id={id}
        >
          <span
            className={`
              ${sizeStyles.thumb}
              inline-block rounded-full bg-white shadow-lg
              transform transition-transform duration-200 ease-in-out
              ${checked ? sizeStyles.translate : 'translate-x-0.5'}
            `
              .trim()
              .replace(/\s+/g, ' ')}
          />
        </button>

        {(label || description) && (
          <div className="ml-3">
            {label && (
              <label
                htmlFor={id}
                className={`
                  text-sm font-medium text-gray-900 dark:text-gray-100
                  ${disabled ? 'opacity-50' : 'cursor-pointer'}
                `
                  .trim()
                  .replace(/\s+/g, ' ')}
              >
                {label}
              </label>
            )}
            {description && <p className="text-sm text-gray-500 dark:text-gray-400">{description}</p>}
          </div>
        )}
      </div>
    </div>
  );
};

export default ThemeSwitch;
