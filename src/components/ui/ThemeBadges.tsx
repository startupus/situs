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

// Простые обертки без пропсов (Core компоненты демонстрационные)
export const ThemeDangerBadge: React.FC = () => <DangerBadge />;
export const ThemeDarkBadge: React.FC = () => <DarkBadge />;
export const ThemeGrayBadge: React.FC = () => <GrayBadge />;
export const ThemeInfoBadge: React.FC = () => <InfoBadge />;
export const ThemeLightBadge: React.FC = () => <LightBadge />;
export const ThemePrimaryBadge: React.FC = () => <PrimaryBadge />;
export const ThemeSecondaryBadge: React.FC = () => <SecondaryBadge />;
export const ThemeSuccessBadge: React.FC = () => <SuccessBadge />;
export const ThemeWarningBadge: React.FC = () => <WarningBadge />;

// Экспорт коллекции
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