// src/components/ui/ThemeBadges.tsx
import React from 'react';
import {
  DangerBadge,
  DarkBadge,
  GrayBadge,
  InfoBadge,
  LightBadge,
  PrimaryBadge,
  SecondaryBadge,
  SuccessBadge,
  WarningBadge,
} from './core';
import { withTheme } from './ThemeWrapper';

// Интерфейс для пропсов Badge компонентов с поддержкой темы
interface ThemeBadgeProps {
  children?: React.ReactNode;
  className?: string;
  variant?: 'solid' | 'outline' | 'opacity';
  rounded?: 'none' | 'sm' | 'md' | 'lg' | 'full';
  size?: 'xs' | 'sm' | 'md' | 'lg';
}

// Обертки с префиксом Theme для всех Badge компонентов с поддержкой глобальной темы
export const ThemeDangerBadge = withTheme(DangerBadge, 'danger');
export const ThemeDarkBadge = withTheme(DarkBadge, 'dark');
export const ThemeGrayBadge = withTheme(GrayBadge, 'secondary');
export const ThemeInfoBadge = withTheme(InfoBadge, 'info');
export const ThemeLightBadge = withTheme(LightBadge, 'light');
export const ThemePrimaryBadge = withTheme(PrimaryBadge, 'primary');
export const ThemeSecondaryBadge = withTheme(SecondaryBadge, 'secondary');
export const ThemeSuccessBadge = withTheme(SuccessBadge, 'success');
export const ThemeWarningBadge = withTheme(WarningBadge, 'warning');

// Экспорт всех Badge компонентов как единый объект для удобства
export const ThemeBadges = {
  Danger: ThemeDangerBadge,
  Dark: ThemeDarkBadge,
  Gray: ThemeGrayBadge,
  Info: ThemeInfoBadge,
  Light: ThemeLightBadge,
  Primary: ThemePrimaryBadge,
  Secondary: ThemeSecondaryBadge,
  Success: ThemeSuccessBadge,
  Warning: ThemeWarningBadge,
};

export default ThemeBadges;
