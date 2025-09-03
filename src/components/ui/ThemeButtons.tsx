// src/components/ui/ThemeButtons.tsx
import React from 'react';
import {
  PrimaryButton,
  PrimaryButtonWithIcon,
  PrimaryOutlineButton,
  PrimaryOutlineButtonWithIcon,
  PrimaryOutlineFullRoundedButtonWithIcon,
  PrimaryOutlineSemiRoundedButtonWithIcon,
  PrimaryRoundedButton,
  PrimaryRoundedButtonWithIcon,
  PrimarySemiRoundedButton,
  PrimarySemiRoundedButtonWithIcon,
  SecondaryButton,
  SecondaryButtonWithIcon,
  SecondaryOutlineButton,
  SecondaryRoundedButton,
  SecondaryRoundedButtonWithIcon,
  SecondarySemiRoundedButton,
  SecondarySemiRoundedButtonWithIcon,
  DarkButton,
  DarkButtonWithIcon,
  DarkOutlineButton,
  DarkRoundedButton,
  DarkRoundedButtonWithIcon,
  DarkSemiRoundedButton,
  DarkSemiRoundedButtonWithIcon,
  WhiteButton,
  WhiteButtonWithIcon,
  WhiteOutlineButtonWithIcon,
  WhiteOutlineRoundedButtonWithIcon,
  WhiteOutlineSemiRoundedButtonWithIcon,
  WhiteRoundedButton,
  WhiteRoundedButtonWithIcon,
  WhiteSemiRoundedButton,
  WhiteSemiRoundedButtonWithIcon,
} from './core';
import { withTheme } from './ThemeWrapper';

// Primary Button Variants с поддержкой темы
export const ThemePrimaryButton = withTheme(PrimaryButton, 'primary');
export const ThemePrimaryButtonWithIcon = withTheme(PrimaryButtonWithIcon, 'primary');
export const ThemePrimaryOutlineButton = withTheme(PrimaryOutlineButton, 'primary');
export const ThemePrimaryOutlineButtonWithIcon = withTheme(PrimaryOutlineButtonWithIcon, 'primary');
export const ThemePrimaryOutlineFullRoundedButtonWithIcon = withTheme(
  PrimaryOutlineFullRoundedButtonWithIcon,
  'primary',
);
export const ThemePrimaryOutlineSemiRoundedButtonWithIcon = withTheme(
  PrimaryOutlineSemiRoundedButtonWithIcon,
  'primary',
);
export const ThemePrimaryRoundedButton = withTheme(PrimaryRoundedButton, 'primary');
export const ThemePrimaryRoundedButtonWithIcon = withTheme(PrimaryRoundedButtonWithIcon, 'primary');
export const ThemePrimarySemiRoundedButton = withTheme(PrimarySemiRoundedButton, 'primary');
export const ThemePrimarySemiRoundedButtonWithIcon = withTheme(PrimarySemiRoundedButtonWithIcon, 'primary');

// Secondary Button Variants с поддержкой темы
export const ThemeSecondaryButton = withTheme(SecondaryButton, 'secondary');
export const ThemeSecondaryButtonWithIcon = withTheme(SecondaryButtonWithIcon, 'secondary');
export const ThemeSecondaryOutlineButton = withTheme(SecondaryOutlineButton, 'secondary');
export const ThemeSecondaryRoundedButton = withTheme(SecondaryRoundedButton, 'secondary');
export const ThemeSecondaryRoundedButtonWithIcon = withTheme(SecondaryRoundedButtonWithIcon, 'secondary');
export const ThemeSecondarySemiRoundedButton = withTheme(SecondarySemiRoundedButton, 'secondary');
export const ThemeSecondarySemiRoundedButtonWithIcon = withTheme(SecondarySemiRoundedButtonWithIcon, 'secondary');

// Dark Button Variants с поддержкой темы
export const ThemeDarkButton = withTheme(DarkButton, 'dark');
export const ThemeDarkButtonWithIcon = withTheme(DarkButtonWithIcon, 'dark');
export const ThemeDarkOutlineButton = withTheme(DarkOutlineButton, 'dark');
export const ThemeDarkRoundedButton = withTheme(DarkRoundedButton, 'dark');
export const ThemeDarkRoundedButtonWithIcon = withTheme(DarkRoundedButtonWithIcon, 'dark');
export const ThemeDarkSemiRoundedButton = withTheme(DarkSemiRoundedButton, 'dark');
export const ThemeDarkSemiRoundedButtonWithIcon = withTheme(DarkSemiRoundedButtonWithIcon, 'dark');

// White Button Variants с поддержкой темы
export const ThemeWhiteButton = withTheme(WhiteButton, 'light');
export const ThemeWhiteButtonWithIcon = withTheme(WhiteButtonWithIcon, 'light');
export const ThemeWhiteOutlineButtonWithIcon = withTheme(WhiteOutlineButtonWithIcon, 'light');
export const ThemeWhiteOutlineRoundedButtonWithIcon = withTheme(WhiteOutlineRoundedButtonWithIcon, 'light');
export const ThemeWhiteOutlineSemiRoundedButtonWithIcon = withTheme(WhiteOutlineSemiRoundedButtonWithIcon, 'light');
export const ThemeWhiteRoundedButton = withTheme(WhiteRoundedButton, 'light');
export const ThemeWhiteRoundedButtonWithIcon = withTheme(WhiteRoundedButtonWithIcon, 'light');
export const ThemeWhiteSemiRoundedButton = withTheme(WhiteSemiRoundedButton, 'light');
export const ThemeWhiteSemiRoundedButtonWithIcon = withTheme(WhiteSemiRoundedButtonWithIcon, 'light');

// Экспорт всех Button компонентов как единый объект для удобства
export const ThemeButtons = {
  // Primary variants
  Primary: ThemePrimaryButton,
  PrimaryWithIcon: ThemePrimaryButtonWithIcon,
  PrimaryOutline: ThemePrimaryOutlineButton,
  PrimaryOutlineWithIcon: ThemePrimaryOutlineButtonWithIcon,
  PrimaryOutlineFullRoundedWithIcon: ThemePrimaryOutlineFullRoundedButtonWithIcon,
  PrimaryOutlineSemiRoundedWithIcon: ThemePrimaryOutlineSemiRoundedButtonWithIcon,
  PrimaryRounded: ThemePrimaryRoundedButton,
  PrimaryRoundedWithIcon: ThemePrimaryRoundedButtonWithIcon,
  PrimarySemiRounded: ThemePrimarySemiRoundedButton,
  PrimarySemiRoundedWithIcon: ThemePrimarySemiRoundedButtonWithIcon,

  // Secondary variants
  Secondary: ThemeSecondaryButton,
  SecondaryWithIcon: ThemeSecondaryButtonWithIcon,
  SecondaryOutline: ThemeSecondaryOutlineButton,
  SecondaryRounded: ThemeSecondaryRoundedButton,
  SecondaryRoundedWithIcon: ThemeSecondaryRoundedButtonWithIcon,
  SecondarySemiRounded: ThemeSecondarySemiRoundedButton,
  SecondarySemiRoundedWithIcon: ThemeSecondarySemiRoundedButtonWithIcon,

  // Dark variants
  Dark: ThemeDarkButton,
  DarkWithIcon: ThemeDarkButtonWithIcon,
  DarkOutline: ThemeDarkOutlineButton,
  DarkRounded: ThemeDarkRoundedButton,
  DarkRoundedWithIcon: ThemeDarkRoundedButtonWithIcon,
  DarkSemiRounded: ThemeDarkSemiRoundedButton,
  DarkSemiRoundedWithIcon: ThemeDarkSemiRoundedButtonWithIcon,

  // White variants
  White: ThemeWhiteButton,
  WhiteWithIcon: ThemeWhiteButtonWithIcon,
  WhiteOutlineWithIcon: ThemeWhiteOutlineButtonWithIcon,
  WhiteOutlineRoundedWithIcon: ThemeWhiteOutlineRoundedButtonWithIcon,
  WhiteOutlineSemiRoundedWithIcon: ThemeWhiteOutlineSemiRoundedButtonWithIcon,
  WhiteRounded: ThemeWhiteRoundedButton,
  WhiteRoundedWithIcon: ThemeWhiteRoundedButtonWithIcon,
  WhiteSemiRounded: ThemeWhiteSemiRoundedButton,
  WhiteSemiRoundedWithIcon: ThemeWhiteSemiRoundedButtonWithIcon,
};

export default ThemeButtons;
