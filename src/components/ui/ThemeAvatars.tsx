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
import { withTheme } from './ThemeWrapper';

// Avatar Variants с поддержкой темы
export const ThemeAvatar1 = withTheme(Avatar1, 'primary');
export const ThemeAvatar2 = withTheme(Avatar2, 'primary');
export const ThemeAvatar3 = withTheme(Avatar3, 'primary');
export const ThemeAvatar4 = withTheme(Avatar4, 'primary');
export const ThemeAvatar5 = withTheme(Avatar5, 'primary');
export const ThemeAvatar6 = withTheme(Avatar6, 'primary');
export const ThemeAvatar7 = withTheme(Avatar7, 'primary');
export const ThemeAvatar8 = withTheme(Avatar8, 'primary');
export const ThemeAvatar9 = withTheme(Avatar9, 'primary');

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

export default ThemeAvatars;