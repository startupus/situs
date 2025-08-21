// src/components/ui/ThemeInputRanges.tsx
import React from 'react';
import { 
  InputRange1,
  InputRange2,
  InputRange3
} from './core';

// Интерфейс для пропсов InputRange компонентов
interface InputRangeProps {
  children?: React.ReactNode;
  className?: string;
  min?: number;
  max?: number;
  value?: number | [number, number];
  onChange?: (value: number | [number, number]) => void;
  variant?: '1' | '2' | '3';
  step?: number;
  disabled?: boolean;
  showLabels?: boolean;
  showValue?: boolean;
  color?: 'primary' | 'secondary' | 'success' | 'danger' | 'warning';
  size?: 'sm' | 'md' | 'lg';
  orientation?: 'horizontal' | 'vertical';
}

// Утилита для адаптации стилей под глобальную тему
const adaptInputRangeProps = (props: InputRangeProps) => ({
  ...props,
  className: `${props.className || ''} transition-all duration-200`
});

// InputRange Variants
export const ThemeInputRange1: React.FC<InputRangeProps> = (props) => (
  <InputRange1 {...adaptInputRangeProps(props)} />
);

export const ThemeInputRange2: React.FC<InputRangeProps> = (props) => (
  <InputRange2 {...adaptInputRangeProps(props)} />
);

export const ThemeInputRange3: React.FC<InputRangeProps> = (props) => (
  <InputRange3 {...adaptInputRangeProps(props)} />
);

// Экспорт всех InputRange компонентов как единый объект для удобства
export const ThemeInputRanges = {
  InputRange1: ThemeInputRange1,
  InputRange2: ThemeInputRange2,
  InputRange3: ThemeInputRange3,
};

// Экспорт по умолчанию
export default ThemeInputRanges;