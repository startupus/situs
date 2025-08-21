// src/components/ui/ThemeVerificationInputs.tsx
import React from 'react';
import { 
  VerificationCodeInput1,
  VerificationCodeInput2,
  VerificationCodeInput3,
  VerificationCodeInput4
} from './core';

// Интерфейс для пропсов VerificationCodeInput компонентов
interface VerificationCodeInputProps {
  children?: React.ReactNode;
  className?: string;
  length?: number;
  value?: string;
  onChange?: (value: string) => void;
  variant?: '1' | '2' | '3' | '4';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  autoFocus?: boolean;
  placeholder?: string;
  type?: 'text' | 'number';
}

// Утилита для адаптации стилей под глобальную тему
const adaptVerificationCodeInputProps = (props: VerificationCodeInputProps) => ({
  ...props,
  className: `${props.className || ''} transition-all duration-200`
});

// VerificationCodeInput Variants
export const ThemeVerificationCodeInput1: React.FC<VerificationCodeInputProps> = (props) => (
  <VerificationCodeInput1 {...adaptVerificationCodeInputProps(props)} />
);

export const ThemeVerificationCodeInput2: React.FC<VerificationCodeInputProps> = (props) => (
  <VerificationCodeInput2 {...adaptVerificationCodeInputProps(props)} />
);

export const ThemeVerificationCodeInput3: React.FC<VerificationCodeInputProps> = (props) => (
  <VerificationCodeInput3 {...adaptVerificationCodeInputProps(props)} />
);

export const ThemeVerificationCodeInput4: React.FC<VerificationCodeInputProps> = (props) => (
  <VerificationCodeInput4 {...adaptVerificationCodeInputProps(props)} />
);

// Экспорт всех VerificationCodeInput компонентов как единый объект для удобства
export const ThemeVerificationInputs = {
  VerificationCodeInput1: ThemeVerificationCodeInput1,
  VerificationCodeInput2: ThemeVerificationCodeInput2,
  VerificationCodeInput3: ThemeVerificationCodeInput3,
  VerificationCodeInput4: ThemeVerificationCodeInput4,
};

// Экспорт по умолчанию
export default ThemeVerificationInputs;