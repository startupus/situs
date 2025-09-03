import React from 'react';

interface InputTypeProps {
  value: string;
  onChange: (value: string) => void;
  type?: string;
  placeholder?: string;
}

const InputType: React.FC<InputTypeProps> = ({ value, onChange, type = 'text', placeholder }) => {
  return (
    <input
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className="redaktus-input-type"
    />
  );
};

export default InputType;
