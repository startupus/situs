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
  WhiteSemiRoundedButtonWithIcon
} from './core';

// Интерфейс для пропсов Button компонентов
interface ButtonProps {
  children?: React.ReactNode;
  className?: string;
  onClick?: () => void;
  disabled?: boolean;
  type?: 'button' | 'submit' | 'reset';
  variant?: 'primary' | 'secondary' | 'dark' | 'white';
  style?: 'solid' | 'outline';
  rounded?: 'none' | 'semi' | 'full';
  withIcon?: boolean;
}

// Утилита для адаптации стилей под глобальную тему
const adaptButtonProps = (props: ButtonProps) => ({
  ...props,
  className: `${props.className || ''} transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2`
});

// Primary Button Variants
export const ThemePrimaryButton: React.FC<ButtonProps> = (props) => (
  <PrimaryButton {...adaptButtonProps(props)} />
);

export const ThemePrimaryButtonWithIcon: React.FC<ButtonProps> = (props) => (
  <PrimaryButtonWithIcon {...adaptButtonProps(props)} />
);

export const ThemePrimaryOutlineButton: React.FC<ButtonProps> = (props) => (
  <PrimaryOutlineButton {...adaptButtonProps(props)} />
);

export const ThemePrimaryOutlineButtonWithIcon: React.FC<ButtonProps> = (props) => (
  <PrimaryOutlineButtonWithIcon {...adaptButtonProps(props)} />
);

export const ThemePrimaryOutlineFullRoundedButtonWithIcon: React.FC<ButtonProps> = (props) => (
  <PrimaryOutlineFullRoundedButtonWithIcon {...adaptButtonProps(props)} />
);

export const ThemePrimaryOutlineSemiRoundedButtonWithIcon: React.FC<ButtonProps> = (props) => (
  <PrimaryOutlineSemiRoundedButtonWithIcon {...adaptButtonProps(props)} />
);

export const ThemePrimaryRoundedButton: React.FC<ButtonProps> = (props) => (
  <PrimaryRoundedButton {...adaptButtonProps(props)} />
);

export const ThemePrimaryRoundedButtonWithIcon: React.FC<ButtonProps> = (props) => (
  <PrimaryRoundedButtonWithIcon {...adaptButtonProps(props)} />
);

export const ThemePrimarySemiRoundedButton: React.FC<ButtonProps> = (props) => (
  <PrimarySemiRoundedButton {...adaptButtonProps(props)} />
);

export const ThemePrimarySemiRoundedButtonWithIcon: React.FC<ButtonProps> = (props) => (
  <PrimarySemiRoundedButtonWithIcon {...adaptButtonProps(props)} />
);

// Secondary Button Variants
export const ThemeSecondaryButton: React.FC<ButtonProps> = (props) => (
  <SecondaryButton {...adaptButtonProps(props)} />
);

export const ThemeSecondaryButtonWithIcon: React.FC<ButtonProps> = (props) => (
  <SecondaryButtonWithIcon {...adaptButtonProps(props)} />
);

export const ThemeSecondaryOutlineButton: React.FC<ButtonProps> = (props) => (
  <SecondaryOutlineButton {...adaptButtonProps(props)} />
);

export const ThemeSecondaryRoundedButton: React.FC<ButtonProps> = (props) => (
  <SecondaryRoundedButton {...adaptButtonProps(props)} />
);

export const ThemeSecondaryRoundedButtonWithIcon: React.FC<ButtonProps> = (props) => (
  <SecondaryRoundedButtonWithIcon {...adaptButtonProps(props)} />
);

export const ThemeSecondarySemiRoundedButton: React.FC<ButtonProps> = (props) => (
  <SecondarySemiRoundedButton {...adaptButtonProps(props)} />
);

export const ThemeSecondarySemiRoundedButtonWithIcon: React.FC<ButtonProps> = (props) => (
  <SecondarySemiRoundedButtonWithIcon {...adaptButtonProps(props)} />
);

// Dark Button Variants
export const ThemeDarkButton: React.FC<ButtonProps> = (props) => (
  <DarkButton {...adaptButtonProps(props)} />
);

export const ThemeDarkButtonWithIcon: React.FC<ButtonProps> = (props) => (
  <DarkButtonWithIcon {...adaptButtonProps(props)} />
);

export const ThemeDarkOutlineButton: React.FC<ButtonProps> = (props) => (
  <DarkOutlineButton {...adaptButtonProps(props)} />
);

export const ThemeDarkRoundedButton: React.FC<ButtonProps> = (props) => (
  <DarkRoundedButton {...adaptButtonProps(props)} />
);

export const ThemeDarkRoundedButtonWithIcon: React.FC<ButtonProps> = (props) => (
  <DarkRoundedButtonWithIcon {...adaptButtonProps(props)} />
);

export const ThemeDarkSemiRoundedButton: React.FC<ButtonProps> = (props) => (
  <DarkSemiRoundedButton {...adaptButtonProps(props)} />
);

export const ThemeDarkSemiRoundedButtonWithIcon: React.FC<ButtonProps> = (props) => (
  <DarkSemiRoundedButtonWithIcon {...adaptButtonProps(props)} />
);

// White Button Variants
export const ThemeWhiteButton: React.FC<ButtonProps> = (props) => (
  <WhiteButton {...adaptButtonProps(props)} />
);

export const ThemeWhiteButtonWithIcon: React.FC<ButtonProps> = (props) => (
  <WhiteButtonWithIcon {...adaptButtonProps(props)} />
);

export const ThemeWhiteOutlineButtonWithIcon: React.FC<ButtonProps> = (props) => (
  <WhiteOutlineButtonWithIcon {...adaptButtonProps(props)} />
);

export const ThemeWhiteOutlineRoundedButtonWithIcon: React.FC<ButtonProps> = (props) => (
  <WhiteOutlineRoundedButtonWithIcon {...adaptButtonProps(props)} />
);

export const ThemeWhiteOutlineSemiRoundedButtonWithIcon: React.FC<ButtonProps> = (props) => (
  <WhiteOutlineSemiRoundedButtonWithIcon {...adaptButtonProps(props)} />
);

export const ThemeWhiteRoundedButton: React.FC<ButtonProps> = (props) => (
  <WhiteRoundedButton {...adaptButtonProps(props)} />
);

export const ThemeWhiteRoundedButtonWithIcon: React.FC<ButtonProps> = (props) => (
  <WhiteRoundedButtonWithIcon {...adaptButtonProps(props)} />
);

export const ThemeWhiteSemiRoundedButton: React.FC<ButtonProps> = (props) => (
  <WhiteSemiRoundedButton {...adaptButtonProps(props)} />
);

export const ThemeWhiteSemiRoundedButtonWithIcon: React.FC<ButtonProps> = (props) => (
  <WhiteSemiRoundedButtonWithIcon {...adaptButtonProps(props)} />
);

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

// Экспорт по умолчанию
export default ThemeButtons;