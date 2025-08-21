import React from 'react';
import { ReactNode } from 'react';

interface ProButtonProps {
  children: ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  variant?: 'primary' | 'secondary' | 'outline' | 'danger' | 'success';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  type?: 'button' | 'submit' | 'reset';
}

const ProButton: React.FC<ProButtonProps> = ({
  children,
  onClick,
  disabled = false,
  variant = 'primary',
  size = 'md',
  className = '',
  type = 'button'
}) => {
  const baseClasses = 'inline-flex items-center justify-center text-center font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed';
  
  const variantClasses = {
    primary: 'bg-primary border-primary border text-white hover:bg-[#1B44C8] hover:border-[#1B44C8] focus:ring-primary active:bg-[#1B44C8] active:border-[#1B44C8]',
    secondary: 'bg-gray-600 border-gray-600 border text-white hover:bg-gray-700 hover:border-gray-700 focus:ring-gray-500 active:bg-gray-700',
    outline: 'bg-transparent border-primary border text-primary hover:bg-primary hover:text-white focus:ring-primary',
    danger: 'bg-red-600 border-red-600 border text-white hover:bg-red-700 hover:border-red-700 focus:ring-red-500 active:bg-red-700',
    success: 'bg-green-600 border-green-600 border text-white hover:bg-green-700 hover:border-green-700 focus:ring-green-500 active:bg-green-700'
  };
  
  const sizeClasses = {
    sm: 'py-2 px-4 text-sm rounded',
    md: 'py-3 px-7 text-base rounded-md',
    lg: 'py-4 px-8 text-lg rounded-lg'
  };
  
  const classes = `${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`;
  
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={classes}
    >
      {children}
    </button>
  );
};

export default ProButton;
