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

// Интерфейс для пропсов Badge компонентов
interface BadgeProps {
  children?: React.ReactNode;
  className?: string;
  variant?: 'solid' | 'outline' | 'opacity';
  rounded?: 'none' | 'sm' | 'md' | 'lg' | 'full';
  size?: 'xs' | 'sm' | 'md' | 'lg';
}

// Утилита для адаптации стилей под глобальную тему
const adaptBadgeProps = (props: BadgeProps) => ({
  ...props,
  className: `${props.className || ''} transition-colors duration-200`
});

// Обертки с префиксом Theme для всех Badge компонентов
export const ThemeDangerBadge: React.FC<BadgeProps> = (props) => (
  <DangerBadge {...adaptBadgeProps(props)} />
);

export const ThemeDarkBadge: React.FC<BadgeProps> = (props) => (
  <DarkBadge {...adaptBadgeProps(props)} />
);

export const ThemeGrayBadge: React.FC<BadgeProps> = (props) => (
  <GrayBadge {...adaptBadgeProps(props)} />
);

export const ThemeInfoBadge: React.FC<BadgeProps> = (props) => (
  <InfoBadge {...adaptBadgeProps(props)} />
);

export const ThemeLightBadge: React.FC<BadgeProps> = (props) => (
  <LightBadge {...adaptBadgeProps(props)} />
);

export const ThemePrimaryBadge: React.FC<BadgeProps> = (props) => (
  <PrimaryBadge {...adaptBadgeProps(props)} />
);

export const ThemeSecondaryBadge: React.FC<BadgeProps> = (props) => (
  <SecondaryBadge {...adaptBadgeProps(props)} />
);

export const ThemeSuccessBadge: React.FC<BadgeProps> = (props) => (
  <SuccessBadge {...adaptBadgeProps(props)} />
);

export const ThemeWarningBadge: React.FC<BadgeProps> = (props) => (
  <WarningBadge {...adaptBadgeProps(props)} />
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

// Экспорт по умолчанию
export default ThemeBadges;