// src/components/ui/ThemeFormElements.tsx
import React from 'react';
import { 
  FormElementInput,
  FormElementSelect,
  FormElementTextarea,
  FormElementFileUpload
} from './core';

// Интерфейс для пропсов FormElement компонентов
interface FormElementProps {
  children?: React.ReactNode;
  className?: string;
  label?: string;
  placeholder?: string;
  value?: string | number;
  onChange?: (value: string | File | File[]) => void;
  disabled?: boolean;
  required?: boolean;
  error?: string;
  helperText?: string;
  variant?: 'input' | 'select' | 'textarea' | 'fileupload';
  size?: 'sm' | 'md' | 'lg';
  type?: 'text' | 'email' | 'password' | 'number' | 'tel' | 'url';
  rows?: number;
  accept?: string;
  multiple?: boolean;
  options?: Array<{ value: string; label: string; }>;
}

// Утилита для адаптации стилей под глобальную тему
const adaptFormElementProps = (props: FormElementProps) => ({
  ...props,
  className: `${props.className || ''} transition-all duration-200`
});

// FormElement Variants
export const ThemeFormElementInput: React.FC<FormElementProps> = (props) => (
  <FormElementInput {...adaptFormElementProps(props)} />
);

export const ThemeFormElementSelect: React.FC<FormElementProps> = (props) => (
  <FormElementSelect {...adaptFormElementProps(props)} />
);

export const ThemeFormElementTextarea: React.FC<FormElementProps> = (props) => (
  <FormElementTextarea {...adaptFormElementProps(props)} />
);

export const ThemeFormElementFileUpload: React.FC<FormElementProps> = (props) => (
  <FormElementFileUpload {...adaptFormElementProps(props)} />
);

// Экспорт всех FormElement компонентов как единый объект для удобства
export const ThemeFormElements = {
  Input: ThemeFormElementInput,
  Select: ThemeFormElementSelect,
  Textarea: ThemeFormElementTextarea,
  FileUpload: ThemeFormElementFileUpload,
};

// Экспорт по умолчанию
export default ThemeFormElements;