// src/components/ui/ThemeSwitchers.tsx
import React from 'react';
import {
  Switcher1,
  Switcher2,
  Switcher3,
  Switcher4,
  Switcher5,
  Switcher6,
  Switcher7,
  Switcher8,
  Switcher9,
  Switcher10,
  Switcher11,
  Switcher12,
  Switcher13,
} from './core';
import { withTheme } from './ThemeWrapper';

// Switcher Variants с поддержкой темы
export const ThemeSwitcher1 = withTheme(Switcher1, 'primary');
export const ThemeSwitcher2 = withTheme(Switcher2, 'primary');
export const ThemeSwitcher3 = withTheme(Switcher3, 'primary');
export const ThemeSwitcher4 = withTheme(Switcher4, 'primary');
export const ThemeSwitcher5 = withTheme(Switcher5, 'primary');
export const ThemeSwitcher6 = withTheme(Switcher6, 'primary');
export const ThemeSwitcher7 = withTheme(Switcher7, 'primary');
export const ThemeSwitcher8 = withTheme(Switcher8, 'primary');
export const ThemeSwitcher9 = withTheme(Switcher9, 'primary');
export const ThemeSwitcher10 = withTheme(Switcher10, 'primary');
export const ThemeSwitcher11 = withTheme(Switcher11, 'primary');
export const ThemeSwitcher12 = withTheme(Switcher12, 'primary');
export const ThemeSwitcher13 = withTheme(Switcher13, 'primary');

// Экспорт коллекции
export const ThemeSwitchers = {
  Switcher1: ThemeSwitcher1,
  Switcher2: ThemeSwitcher2,
  Switcher3: ThemeSwitcher3,
  Switcher4: ThemeSwitcher4,
  Switcher5: ThemeSwitcher5,
  Switcher6: ThemeSwitcher6,
  Switcher7: ThemeSwitcher7,
  Switcher8: ThemeSwitcher8,
  Switcher9: ThemeSwitcher9,
  Switcher10: ThemeSwitcher10,
  Switcher11: ThemeSwitcher11,
  Switcher12: ThemeSwitcher12,
  Switcher13: ThemeSwitcher13,
};

export default ThemeSwitchers;
