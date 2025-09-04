// src/components/ui/ThemeProgressBars.tsx
import React from 'react';
import { ProgressBar1, ProgressBar2, ProgressBar3 } from './core';

// Интерфейс для пропсов ProgressBar компонентов
interface ProgressBarProps {
  children?: React.ReactNode;
  className?: string;
  value?: number;
  max?: number;
  variant?: '1' | '2' | '3';
  size?: 'sm' | 'md' | 'lg';
  color?: 'primary' | 'secondary' | 'success' | 'danger' | 'warning' | 'info';
  showPercentage?: boolean;
  animated?: boolean;
  striped?: boolean;
}

// Утилита для адаптации стилей под глобальную тему
const adaptProgressBarProps = (props: ProgressBarProps) => ({
  ...props,
  className: `${props.className || ''} transition-all duration-200`,
});

// ProgressBar Variants
export const ThemeProgressBar1: React.FC<ProgressBarProps> = (props) => (
  <ProgressBar1 {...(adaptProgressBarProps(props) as any)} />
);

export const ThemeProgressBar2: React.FC<ProgressBarProps> = (props) => (
  <ProgressBar2 {...(adaptProgressBarProps(props) as any)} />
);

export const ThemeProgressBar3: React.FC<ProgressBarProps> = (props) => (
  <ProgressBar3 {...(adaptProgressBarProps(props) as any)} />
);

// Экспорт всех ProgressBar компонентов как единый объект для удобства
export const ThemeProgressBars = {
  ProgressBar1: ThemeProgressBar1,
  ProgressBar2: ThemeProgressBar2,
  ProgressBar3: ThemeProgressBar3,
};

// Экспорт по умолчанию
export default ThemeProgressBars;
