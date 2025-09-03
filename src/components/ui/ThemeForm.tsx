import React, { ReactNode } from 'react';

interface ThemeInputProps {
  label?: string;
  placeholder?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  type?: 'text' | 'email' | 'password' | 'number';
  required?: boolean;
  disabled?: boolean;
  className?: string;
  error?: string;
  icon?: ReactNode;
}

export const ThemeInput: React.FC<ThemeInputProps> = ({
  label,
  placeholder,
  value,
  onChange,
  type = 'text',
  required = false,
  disabled = false,
  className = '',
  error,
  icon,
}) => {
  return (
    <div className={`mb-4 ${className}`}>
      {label && (
        <label className="mb-2.5 block text-base font-medium text-dark dark:text-white">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      <div className="relative">
        <input
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          required={required}
          disabled={disabled}
          className={`w-full appearance-none rounded-lg border border-stroke bg-transparent py-3 text-dark outline-hidden focus:border-primary dark:border-dark-3 dark:text-white ${
            icon ? 'pl-12 pr-5' : 'pl-5 pr-5'
          } ${error ? 'border-red-500 focus:border-red-500' : ''} ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
        />
        {icon && (
          <span className="pointer-events-none absolute left-0 top-0 flex h-full w-12 items-center justify-center text-dark-5">
            {icon}
          </span>
        )}
      </div>
      {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
    </div>
  );
};

interface ThemeSelectProps {
  label?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  options: { value: string; label: string }[];
  required?: boolean;
  disabled?: boolean;
  className?: string;
  error?: string;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'badge';
}

export const ThemeSelect: React.FC<ThemeSelectProps> = ({
  label,
  value,
  onChange,
  options,
  required = false,
  disabled = false,
  className = '',
  error,
  size = 'md',
  variant = 'default',
}) => {
  const getSizeClasses = () => {
    switch (size) {
      case 'sm':
        return 'py-2 pl-3 pr-8 text-sm';
      case 'lg':
        return 'py-4 pl-6 pr-12 text-lg';
      default:
        return 'py-3 pl-5 pr-12 text-base';
    }
  };

  const getVariantClasses = () => {
    if (variant === 'badge') {
      return 'text-xs px-2 py-1 rounded-full font-medium border-0 bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200';
    }
    return `w-full appearance-none rounded-lg border border-stroke bg-transparent text-dark outline-hidden focus:border-primary dark:border-dark-3 dark:text-white ${
      error ? 'border-red-500 focus:border-red-500' : ''
    } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`;
  };

  if (variant === 'badge') {
    return (
      <div className={className}>
        <select
          value={value}
          onChange={onChange}
          required={required}
          disabled={disabled}
          className={`${getVariantClasses()} ${getSizeClasses()}`}
        >
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>
    );
  }

  return (
    <div className={`mb-4 ${className}`}>
      {label && (
        <label className="mb-2.5 block text-base font-medium text-dark dark:text-white">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      <div className="relative">
        <select
          value={value}
          onChange={onChange}
          required={required}
          disabled={disabled}
          className={`${getVariantClasses()} ${getSizeClasses()}`}
        >
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <span className="pointer-events-none absolute right-0 top-0 flex h-full w-12 items-center justify-center text-dark-5">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M2.29645 5.15354L2.29642 5.15357L2.30065 5.1577L7.65065 10.3827L8.00167 10.7255L8.35105 10.381L13.7011 5.10603L13.7011 5.10604L13.7036 5.10354C13.7221 5.08499 13.7386 5.08124 13.75 5.08124C13.7614 5.08124 13.7779 5.08499 13.7964 5.10354C13.815 5.12209 13.8188 5.13859 13.8188 5.14999C13.8188 5.1612 13.8151 5.17734 13.7974 5.19552L8.04956 10.8433L8.04955 10.8433L8.04645 10.8464C8.01604 10.8768 7.99596 10.8921 7.98519 10.8992C7.97756 10.8983 7.97267 10.8968 7.96862 10.8952C7.96236 10.8929 7.94954 10.887 7.92882 10.8721L2.20263 5.2455C2.18488 5.22733 2.18125 5.2112 2.18125 5.19999C2.18125 5.18859 2.18501 5.17209 2.20355 5.15354C2.2221 5.13499 2.2386 5.13124 2.25 5.13124C2.2614 5.13124 2.2779 5.13499 2.29645 5.15354Z"
              fill="currentColor"
              stroke="currentColor"
            />
          </svg>
        </span>
      </div>
      {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
    </div>
  );
};

interface ThemeTextareaProps {
  label?: string;
  placeholder?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  rows?: number;
  required?: boolean;
  disabled?: boolean;
  className?: string;
  error?: string;
}

export const ThemeTextarea: React.FC<ThemeTextareaProps> = ({
  label,
  placeholder,
  value,
  onChange,
  rows = 3,
  required = false,
  disabled = false,
  className = '',
  error,
}) => {
  return (
    <div className={`mb-4 ${className}`}>
      {label && (
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      <textarea
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        rows={rows}
        required={required}
        disabled={disabled}
        className={`w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent dark:bg-gray-700 dark:text-white transition-colors resize-vertical ${
          error ? 'border-red-500 focus:ring-red-500' : ''
        } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
      />
      {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
    </div>
  );
};

interface ThemeFormProps {
  children: ReactNode;
  onSubmit?: (e: React.FormEvent) => void;
  className?: string;
}

export const ThemeForm: React.FC<ThemeFormProps> = ({ children, onSubmit, className = '' }) => {
  return (
    <form onSubmit={onSubmit} className={`space-y-4 ${className}`}>
      {children}
    </form>
  );
};
