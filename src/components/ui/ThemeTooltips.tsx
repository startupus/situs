// src/components/ui/ThemeTooltips.tsx
import React from 'react';
import { Tooltip1, Tooltip2, Tooltip3 } from './core';

// Интерфейс для пропсов Tooltip компонентов
interface TooltipProps {
  children?: React.ReactNode;
  className?: string;
  content?: string;
  position?: 'top' | 'bottom' | 'left' | 'right';
  variant?: '1' | '2' | '3';
  trigger?: 'hover' | 'click' | 'focus';
  delay?: number;
  arrow?: boolean;
  theme?: 'dark' | 'light';
}

// Утилита для адаптации стилей под глобальную тему
const adaptTooltipProps = (props: TooltipProps) => ({
  ...props,
  className: `${props.className || ''} transition-all duration-200`,
});

// Tooltip Variants
export const ThemeTooltip1: React.FC<TooltipProps> = (props) => <Tooltip1 {...(adaptTooltipProps(props) as any)} />;

export const ThemeTooltip2: React.FC<TooltipProps> = (props) => <Tooltip2 {...(adaptTooltipProps(props) as any)} />;

export const ThemeTooltip3: React.FC<TooltipProps> = (props) => <Tooltip3 {...(adaptTooltipProps(props) as any)} />;

// Экспорт всех Tooltip компонентов как единый объект для удобства
export const ThemeTooltips = {
  Tooltip1: ThemeTooltip1,
  Tooltip2: ThemeTooltip2,
  Tooltip3: ThemeTooltip3,
};

// Экспорт по умолчанию
export default ThemeTooltips;
