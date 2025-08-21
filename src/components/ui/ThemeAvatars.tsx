// src/components/ui/ThemeAvatars.tsx
import React from 'react';
import { 
  Avatar1,
  Avatar2,
  Avatar3,
  Avatar4,
  Avatar5,
  Avatar6,
  Avatar7,
  Avatar8,
  Avatar9
} from './core';

// Интерфейс для пропсов Avatar компонентов
interface AvatarProps {
  children?: React.ReactNode;
  className?: string;
  src?: string;
  alt?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  fallback?: string;
  status?: 'online' | 'offline' | 'away' | 'busy';
  showStatus?: boolean;
  variant?: '1' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9';
  rounded?: boolean;
}

// Утилита для адаптации стилей под глобальную тему
const adaptAvatarProps = (props: AvatarProps) => ({
  ...props,
  className: `${props.className || ''} transition-all duration-200`
});

// Avatar Variants
export const ThemeAvatar1: React.FC<AvatarProps> = (props) => (
  <Avatar1 {...adaptAvatarProps(props)} />
);

export const ThemeAvatar2: React.FC<AvatarProps> = (props) => (
  <Avatar2 {...adaptAvatarProps(props)} />
);

export const ThemeAvatar3: React.FC<AvatarProps> = (props) => (
  <Avatar3 {...adaptAvatarProps(props)} />
);

export const ThemeAvatar4: React.FC<AvatarProps> = (props) => (
  <Avatar4 {...adaptAvatarProps(props)} />
);

export const ThemeAvatar5: React.FC<AvatarProps> = (props) => (
  <Avatar5 {...adaptAvatarProps(props)} />
);

export const ThemeAvatar6: React.FC<AvatarProps> = (props) => (
  <Avatar6 {...adaptAvatarProps(props)} />
);

export const ThemeAvatar7: React.FC<AvatarProps> = (props) => (
  <Avatar7 {...adaptAvatarProps(props)} />
);

export const ThemeAvatar8: React.FC<AvatarProps> = (props) => (
  <Avatar8 {...adaptAvatarProps(props)} />
);

export const ThemeAvatar9: React.FC<AvatarProps> = (props) => (
  <Avatar9 {...adaptAvatarProps(props)} />
);

// Экспорт всех Avatar компонентов как единый объект для удобства
export const ThemeAvatars = {
  Avatar1: ThemeAvatar1,
  Avatar2: ThemeAvatar2,
  Avatar3: ThemeAvatar3,
  Avatar4: ThemeAvatar4,
  Avatar5: ThemeAvatar5,
  Avatar6: ThemeAvatar6,
  Avatar7: ThemeAvatar7,
  Avatar8: ThemeAvatar8,
  Avatar9: ThemeAvatar9,
};

// Экспорт по умолчанию
export default ThemeAvatars;