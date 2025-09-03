import React from 'react';

interface InputProps {
  value: string;
  onChange: (value: string) => void;
  type?: string;
  placeholder?: string;
}

const Input: React.FC<InputProps> = ({ value, onChange, type = 'text', placeholder }) => {
  return (
    <input
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className="redaktus-input"
    />
  );
};

export default Input;
