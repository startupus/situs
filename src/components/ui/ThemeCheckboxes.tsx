// src/components/ui/ThemeCheckboxes.tsx
import React from 'react';
import { 
  Checkbox1,
  Checkbox2,
  Checkbox3,
  Checkbox4,
  Checkbox5
} from './core';

// Интерфейс для пропсов Checkbox компонентов
interface CheckboxProps {
  children?: React.ReactNode;
  className?: string;
  checked?: boolean;
  onChange?: (checked: boolean) => void;
  disabled?: boolean;
  label?: string;
  variant?: '1' | '2' | '3' | '4' | '5';
  size?: 'sm' | 'md' | 'lg';
  color?: 'primary' | 'secondary' | 'success' | 'danger' | 'warning';
}

// Утилита для адаптации стилей под глобальную тему
const adaptCheckboxProps = (props: CheckboxProps) => ({
  ...props,
  className: `${props.className || ''} transition-all duration-200`
});

// Checkbox Variants
export const ThemeCheckbox1: React.FC<CheckboxProps> = (props) => (
  <Checkbox1 {...adaptCheckboxProps(props)} />
);

export const ThemeCheckbox2: React.FC<CheckboxProps> = (props) => (
  <Checkbox2 {...adaptCheckboxProps(props)} />
);

export const ThemeCheckbox3: React.FC<CheckboxProps> = (props) => (
  <Checkbox3 {...adaptCheckboxProps(props)} />
);

export const ThemeCheckbox4: React.FC<CheckboxProps> = (props) => (
  <Checkbox4 {...adaptCheckboxProps(props)} />
);

export const ThemeCheckbox5: React.FC<CheckboxProps> = (props) => (
  <Checkbox5 {...adaptCheckboxProps(props)} />
);

// Экспорт всех Checkbox компонентов как единый объект для удобства
export const ThemeCheckboxes = {
  Checkbox1: ThemeCheckbox1,
  Checkbox2: ThemeCheckbox2,
  Checkbox3: ThemeCheckbox3,
  Checkbox4: ThemeCheckbox4,
  Checkbox5: ThemeCheckbox5,
};

// Экспорт по умолчанию
export default ThemeCheckboxes;