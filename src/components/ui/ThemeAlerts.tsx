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
import { withTheme } from './ThemeWrapper';

// Alert Variants с поддержкой темы
export const ThemeAttentionAlert1 = withTheme(AttentionAlert1, 'warning');
export const ThemeAttentionAlert2 = withTheme(AttentionAlert2, 'warning');
export const ThemeAttentionAlert3 = withTheme(AttentionAlert3, 'warning');

export const ThemeInfoAlert1 = withTheme(InfoAlert1, 'info');
export const ThemeInfoAlert2 = withTheme(InfoAlert2, 'info');
export const ThemeInfoAlert3 = withTheme(InfoAlert3, 'info');

export const ThemeSuccessAlert1 = withTheme(SuccessAlert1, 'success');
export const ThemeSuccessAlert2 = withTheme(SuccessAlert2, 'success');
export const ThemeSuccessAlert3 = withTheme(SuccessAlert3, 'success');
export const ThemeSuccessAlert4 = withTheme(SuccessAlert4, 'success');

export const ThemeWarningAlert1 = withTheme(WarningAlert1, 'warning');
export const ThemeWarningAlert2 = withTheme(WarningAlert2, 'warning');
export const ThemeWarningAlert3 = withTheme(WarningAlert3, 'warning');

// Экспорт всех Alert компонентов как единый объект для удобства
export const ThemeAlerts = {
  Attention1: ThemeAttentionAlert1,
  Attention2: ThemeAttentionAlert2,
  Attention3: ThemeAttentionAlert3,
  Info1: ThemeInfoAlert1,
  Info2: ThemeInfoAlert2,
  Info3: ThemeInfoAlert3,
  Success1: ThemeSuccessAlert1,
  Success2: ThemeSuccessAlert2,
  Success3: ThemeSuccessAlert3,
  Success4: ThemeSuccessAlert4,
  Warning1: ThemeWarningAlert1,
  Warning2: ThemeWarningAlert2,
  Warning3: ThemeWarningAlert3,
};

export default ThemeAlerts;