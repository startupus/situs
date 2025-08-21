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
  WarningBadge 
} from './core';
import { ThemeWrapper } from './ThemeWrapper';

// Интерфейс для пропсов Badge компонентов
interface BadgeProps {
  children?: React.ReactNode;
  className?: string;
  variant?: 'solid' | 'outline' | 'opacity';
  rounded?: 'none' | 'sm' | 'md' | 'lg' | 'full';
  size?: 'xs' | 'sm' | 'md' | 'lg';
}

// Обертки с префиксом Theme для всех Badge компонентов с поддержкой глобальной темы
export const ThemeDangerBadge: React.FC<BadgeProps> = (props) => (
  <ThemeWrapper className={props.className} adaptColors adaptTypography>
    <DangerBadge />
  </ThemeWrapper>
);

export const ThemeDarkBadge: React.FC<BadgeProps> = (props) => (
  <ThemeWrapper className={props.className} adaptColors adaptTypography>
    <DarkBadge />
  </ThemeWrapper>
);

export const ThemeGrayBadge: React.FC<BadgeProps> = (props) => (
  <ThemeWrapper className={props.className} adaptColors adaptTypography>
    <GrayBadge />
  </ThemeWrapper>
);

export const ThemeInfoBadge: React.FC<BadgeProps> = (props) => (
  <ThemeWrapper className={props.className} adaptColors adaptTypography>
    <InfoBadge />
  </ThemeWrapper>
);

export const ThemeLightBadge: React.FC<BadgeProps> = (props) => (
  <ThemeWrapper className={props.className} adaptColors adaptTypography>
    <LightBadge />
  </ThemeWrapper>
);

export const ThemePrimaryBadge: React.FC<BadgeProps> = (props) => (
  <ThemeWrapper className={props.className} adaptColors adaptTypography>
    <PrimaryBadge />
  </ThemeWrapper>
);

export const ThemeSecondaryBadge: React.FC<BadgeProps> = (props) => (
  <ThemeWrapper className={props.className} adaptColors adaptTypography>
    <SecondaryBadge />
  </ThemeWrapper>
);

export const ThemeSuccessBadge: React.FC<BadgeProps> = (props) => (
  <ThemeWrapper className={props.className} adaptColors adaptTypography>
    <SuccessBadge />
  </ThemeWrapper>
);

export const ThemeWarningBadge: React.FC<BadgeProps> = (props) => (
  <ThemeWrapper className={props.className} adaptColors adaptTypography>
    <WarningBadge />
  </ThemeWrapper>
);

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