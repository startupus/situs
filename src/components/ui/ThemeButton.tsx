import React from 'react';
import { ReactNode } from 'react';

interface ThemeButtonProps {
  children: ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  variant?: 'primary' | 'secondary' | 'outline' | 'danger' | 'success' | 'dark';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  type?: 'button' | 'submit' | 'reset';
  icon?: ReactNode;
  iconPosition?: 'left' | 'right';
  rounded?: boolean;
}

const ThemeButton: React.FC<ThemeButtonProps> = ({
  children,
  onClick,
  disabled = false,
  variant = 'primary',
  size = 'md',
  className = '',
  type = 'button',
  icon,
  iconPosition = 'left',
  rounded = false
}) => {
  const baseClasses = 'inline-flex items-center justify-center text-center font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed border';
  
  const variantClasses = {
    primary: 'bg-primary border-primary text-white hover:bg-[#1B44C8] hover:border-[#1B44C8] focus:ring-primary active:bg-[#1B44C8] active:border-[#1B44C8]',
    secondary: 'bg-gray-600 border-gray-600 text-white hover:bg-gray-700 hover:border-gray-700 focus:ring-gray-500 active:bg-gray-700',
    outline: 'bg-transparent border-primary text-primary hover:bg-primary hover:text-white focus:ring-primary',
    danger: 'bg-red-600 border-red-600 text-white hover:bg-red-700 hover:border-red-700 focus:ring-red-500 active:bg-red-700',
    success: 'bg-green-600 border-green-600 text-white hover:bg-green-700 hover:border-green-700 focus:ring-green-500 active:bg-green-700',
    dark: 'bg-dark border-dark text-white hover:bg-dark-2 hover:border-dark-2 focus:ring-dark active:bg-dark-2'
  };
  
  const sizeClasses = {
    sm: 'py-2 px-4 text-sm',
    md: 'py-3 px-7 text-base',
    lg: 'py-4 px-8 text-lg'
  };
  
  const roundedClass = rounded ? 'rounded-full' : 'rounded-md';
  
  const classes = `${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${roundedClass} ${className}`;
  
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={classes}
    >
      {icon && iconPosition === 'left' && (
        <span className="mr-2">
          {icon}
        </span>
      )}
      {children}
      {icon && iconPosition === 'right' && (
        <span className="ml-2">
          {icon}
        </span>
      )}
    </button>
  );
};

export default ThemeButton;
