import React from 'react';

/**
 * Corporate input component based on react-pro-components-main
 */
interface CorporateInputProps {
  label?: string;
  type?: 'text' | 'email' | 'password' | 'number';
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  required?: boolean;
  className?: string;
  disabled?: boolean;
}

const CorporateInput: React.FC<CorporateInputProps> = ({
  label,
  type = 'text',
  value,
  onChange,
  placeholder,
  required = false,
  className = '',
  disabled = false
}) => {
  return (
    <div className={`w-full ${className}`}>
      {label && (
        <label className="mb-2.5 block text-base font-medium text-dark dark:text-white">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        required={required}
        disabled={disabled}
        className="w-full rounded-lg border border-stroke bg-transparent py-3 pl-5 pr-5 text-dark outline-hidden focus:border-primary dark:border-dark-3 dark:text-white disabled:bg-gray-100 dark:disabled:bg-dark-3 disabled:cursor-not-allowed"
      />
    </div>
  );
};

export default CorporateInput;