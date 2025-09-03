import React from 'react';

interface ToggleSwitchProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
  size?: 'sm' | 'md';
}

const ToggleSwitch: React.FC<ToggleSwitchProps> = ({ checked, onChange, disabled = false, size = 'sm' }) => {
  const sizeClasses = size === 'sm' ? 'h-5 w-9' : 'h-8 w-14';

  const dotSizeClasses = size === 'sm' ? 'h-4 w-4 left-0.5 top-0.5' : 'h-6 w-6 left-1 top-1';

  return (
    <label
      className={`flex cursor-pointer select-none items-center ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
    >
      <div className="relative">
        <input
          type="checkbox"
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
          disabled={disabled}
          className="sr-only"
        />
        <div
          className={`box block ${sizeClasses} rounded-full transition-colors ${
            checked ? 'bg-primary' : 'bg-stroke dark:bg-dark-3'
          }`}
        />
        <div
          className={`absolute ${dotSizeClasses} flex items-center justify-center rounded-full bg-white transition-transform ${
            checked ? 'translate-x-full' : ''
          }`}
        />
      </div>
    </label>
  );
};

export default ToggleSwitch;
