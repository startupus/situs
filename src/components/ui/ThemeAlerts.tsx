// src/components/ui/ThemeAlerts.tsx
import React from 'react';
import { 
  AttentionAlert1,
  AttentionAlert2,
  AttentionAlert3,
  InfoAlert1,
  InfoAlert2,
  InfoAlert3,
  SuccessAlert1,
  SuccessAlert2,
  SuccessAlert3,
  SuccessAlert4,
  WarningAlert1,
  WarningAlert2,
  WarningAlert3
} from './core';

// Интерфейс для пропсов Alert компонентов
interface AlertProps {
  children?: React.ReactNode;
  className?: string;
  title?: string;
  message?: string;
  type?: 'success' | 'info' | 'warning' | 'attention';
  variant?: '1' | '2' | '3' | '4';
  onDismiss?: () => void;
  showActions?: boolean;
}

// Утилита для адаптации стилей под глобальную тему
const adaptAlertProps = (props: AlertProps) => ({
  ...props,
  className: `${props.className || ''} transition-all duration-200`
});

// Attention Alert Variants
export const ThemeAttentionAlert1: React.FC<AlertProps> = (props) => (
  <AttentionAlert1 {...adaptAlertProps(props)} />
);

export const ThemeAttentionAlert2: React.FC<AlertProps> = (props) => (
  <AttentionAlert2 {...adaptAlertProps(props)} />
);

export const ThemeAttentionAlert3: React.FC<AlertProps> = (props) => (
  <AttentionAlert3 {...adaptAlertProps(props)} />
);

// Info Alert Variants
export const ThemeInfoAlert1: React.FC<AlertProps> = (props) => (
  <InfoAlert1 {...adaptAlertProps(props)} />
);

export const ThemeInfoAlert2: React.FC<AlertProps> = (props) => (
  <InfoAlert2 {...adaptAlertProps(props)} />
);

export const ThemeInfoAlert3: React.FC<AlertProps> = (props) => (
  <InfoAlert3 {...adaptAlertProps(props)} />
);

// Success Alert Variants
export const ThemeSuccessAlert1: React.FC<AlertProps> = (props) => (
  <SuccessAlert1 {...adaptAlertProps(props)} />
);

export const ThemeSuccessAlert2: React.FC<AlertProps> = (props) => (
  <SuccessAlert2 {...adaptAlertProps(props)} />
);

export const ThemeSuccessAlert3: React.FC<AlertProps> = (props) => (
  <SuccessAlert3 {...adaptAlertProps(props)} />
);

export const ThemeSuccessAlert4: React.FC<AlertProps> = (props) => (
  <SuccessAlert4 {...adaptAlertProps(props)} />
);

// Warning Alert Variants
export const ThemeWarningAlert1: React.FC<AlertProps> = (props) => (
  <WarningAlert1 {...adaptAlertProps(props)} />
);

export const ThemeWarningAlert2: React.FC<AlertProps> = (props) => (
  <WarningAlert2 {...adaptAlertProps(props)} />
);

export const ThemeWarningAlert3: React.FC<AlertProps> = (props) => (
  <WarningAlert3 {...adaptAlertProps(props)} />
);

// Экспорт всех Alert компонентов как единый объект для удобства
export const ThemeAlerts = {
  // Attention variants
  Attention1: ThemeAttentionAlert1,
  Attention2: ThemeAttentionAlert2,
  Attention3: ThemeAttentionAlert3,
  
  // Info variants
  Info1: ThemeInfoAlert1,
  Info2: ThemeInfoAlert2,
  Info3: ThemeInfoAlert3,
  
  // Success variants
  Success1: ThemeSuccessAlert1,
  Success2: ThemeSuccessAlert2,
  Success3: ThemeSuccessAlert3,
  Success4: ThemeSuccessAlert4,
  
  // Warning variants
  Warning1: ThemeWarningAlert1,
  Warning2: ThemeWarningAlert2,
  Warning3: ThemeWarningAlert3,
};

// Экспорт по умолчанию
export default ThemeAlerts;