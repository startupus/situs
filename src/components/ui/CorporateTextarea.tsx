import React from 'react';

/**
 * Corporate textarea component based on react-pro-components-main
 */
interface CorporateTextareaProps {
  label?: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  required?: boolean;
  className?: string;
  rows?: number;
  disabled?: boolean;
}

const CorporateTextarea: React.FC<CorporateTextareaProps> = ({
  label,
  value,
  onChange,
  placeholder,
  required = false,
  className = '',
  rows = 4,
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
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        required={required}
        disabled={disabled}
        rows={rows}
        className="w-full rounded-lg border border-stroke bg-transparent py-3 pl-5 pr-5 text-dark outline-hidden focus:border-primary dark:border-dark-3 dark:text-white disabled:bg-gray-100 dark:disabled:bg-dark-3 disabled:cursor-not-allowed resize-vertical"
      />
    </div>
  );
};

export default CorporateTextarea;