// src/components/ui/ThemeSpinners.tsx
import React from 'react';
import { 
  Spinner1,
  Spinner2,
  Spinner3,
  Spinner4
} from './core';

// Интерфейс для пропсов Spinner компонентов
interface SpinnerProps {
  children?: React.ReactNode;
  className?: string;
  variant?: '1' | '2' | '3' | '4';
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  color?: 'primary' | 'secondary' | 'success' | 'danger' | 'warning' | 'info';
  speed?: 'slow' | 'normal' | 'fast';
}

// Утилита для адаптации стилей под глобальную тему
const adaptSpinnerProps = (props: SpinnerProps) => ({
  ...props,
  className: `${props.className || ''} transition-all duration-200`
});

// Spinner Variants
export const ThemeSpinner1: React.FC<SpinnerProps> = (props) => (
  <Spinner1 {...adaptSpinnerProps(props)} />
);

export const ThemeSpinner2: React.FC<SpinnerProps> = (props) => (
  <Spinner2 {...adaptSpinnerProps(props)} />
);

export const ThemeSpinner3: React.FC<SpinnerProps> = (props) => (
  <Spinner3 {...adaptSpinnerProps(props)} />
);

export const ThemeSpinner4: React.FC<SpinnerProps> = (props) => (
  <Spinner4 {...adaptSpinnerProps(props)} />
);

// Экспорт всех Spinner компонентов как единый объект для удобства
export const ThemeSpinners = {
  Spinner1: ThemeSpinner1,
  Spinner2: ThemeSpinner2,
  Spinner3: ThemeSpinner3,
  Spinner4: ThemeSpinner4,
};

// Экспорт по умолчанию
export default ThemeSpinners;