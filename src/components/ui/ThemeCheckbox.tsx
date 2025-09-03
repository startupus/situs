import React from 'react';
import { FiCheck, FiMinus, FiX } from 'react-icons/fi';

interface ThemeCheckboxProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'primary' | 'secondary' | 'success' | 'danger' | 'warning' | 'info';
  shape?: 'square' | 'rounded' | 'circle';
  indeterminate?: boolean;
  disabled?: boolean;
  label?: string;
  description?: string;
  error?: string;
  className?: string;
  id?: string;
}

const ThemeCheckbox: React.FC<ThemeCheckboxProps> = ({
  checked,
  onChange,
  size = 'md',
  variant = 'primary',
  shape = 'square',
  indeterminate = false,
  disabled = false,
  label,
  description,
  error,
  className = '',
  id,
}) => {
  const getSizeStyles = () => {
    const sizes = {
      sm: 'w-4 h-4',
      md: 'w-5 h-5',
      lg: 'w-6 h-6',
    };
    return sizes[size];
  };

  const getVariantStyles = () => {
    if (disabled) {
      return 'border-gray-300 bg-gray-100 dark:border-gray-600 dark:bg-gray-700';
    }

    if (error) {
      return 'border-red-500 bg-red-50 dark:border-red-400 dark:bg-red-900/20';
    }

    const variants = {
      primary:
        checked || indeterminate
          ? 'border-blue-600 bg-blue-600'
          : 'border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800',
      secondary:
        checked || indeterminate
          ? 'border-gray-600 bg-gray-600'
          : 'border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800',
      success:
        checked || indeterminate
          ? 'border-green-600 bg-green-600'
          : 'border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800',
      danger:
        checked || indeterminate
          ? 'border-red-600 bg-red-600'
          : 'border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800',
      warning:
        checked || indeterminate
          ? 'border-yellow-600 bg-yellow-600'
          : 'border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800',
      info:
        checked || indeterminate
          ? 'border-cyan-600 bg-cyan-600'
          : 'border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800',
    };
    return variants[variant];
  };

  const getShapeStyles = () => {
    const shapes = {
      square: 'rounded-sm',
      rounded: 'rounded-md',
      circle: 'rounded-full',
    };
    return shapes[shape];
  };

  const getIconSize = () => {
    const iconSizes = {
      sm: 'w-3 h-3',
      md: 'w-4 h-4',
      lg: 'w-5 h-5',
    };
    return iconSizes[size];
  };

  const renderIcon = () => {
    if (indeterminate) {
      return <FiMinus className={`${getIconSize()} text-white`} />;
    }
    if (checked) {
      return <FiCheck className={`${getIconSize()} text-white`} />;
    }
    return null;
  };

  const handleChange = () => {
    if (!disabled) {
      onChange(!checked);
    }
  };

  return (
    <div className={`flex items-start ${className}`}>
      <div className="flex items-center h-5">
        <input
          id={id}
          type="checkbox"
          checked={checked}
          onChange={handleChange}
          disabled={disabled}
          className="sr-only"
          aria-describedby={description ? `${id}-description` : undefined}
        />
        <div
          className={`
            ${getSizeStyles()}
            ${getVariantStyles()}
            ${getShapeStyles()}
            border-2 flex items-center justify-center
            ${disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}
            transition-all duration-200 ease-in-out
            hover:${!disabled && !checked && !indeterminate ? 'border-gray-400 dark:border-gray-500' : ''}
            focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500
          `
            .trim()
            .replace(/\s+/g, ' ')}
          onClick={handleChange}
        >
          {renderIcon()}
        </div>
      </div>

      {(label || description || error) && (
        <div className="ml-3 text-sm">
          {label && (
            <label
              htmlFor={id}
              className={`
                font-medium text-gray-900 dark:text-gray-100
                ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
                ${error ? 'text-red-900 dark:text-red-100' : ''}
              `
                .trim()
                .replace(/\s+/g, ' ')}
            >
              {label}
            </label>
          )}
          {description && (
            <p
              id={`${id}-description`}
              className={`text-gray-500 dark:text-gray-400 ${error ? 'text-red-700 dark:text-red-300' : ''}`}
            >
              {description}
            </p>
          )}
          {error && <p className="text-red-600 dark:text-red-400 text-sm mt-1">{error}</p>}
        </div>
      )}
    </div>
  );
};

export default ThemeCheckbox;
