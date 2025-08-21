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
  Switcher13
} from './core';

// Switcher Variants - простые обертки
export const ThemeSwitcher1: React.FC = () => <Switcher1 />;
export const ThemeSwitcher2: React.FC = () => <Switcher2 />;
export const ThemeSwitcher3: React.FC = () => <Switcher3 />;
export const ThemeSwitcher4: React.FC = () => <Switcher4 />;
export const ThemeSwitcher5: React.FC = () => <Switcher5 />;
export const ThemeSwitcher6: React.FC = () => <Switcher6 />;
export const ThemeSwitcher7: React.FC = () => <Switcher7 />;
export const ThemeSwitcher8: React.FC = () => <Switcher8 />;
export const ThemeSwitcher9: React.FC = () => <Switcher9 />;
export const ThemeSwitcher10: React.FC = () => <Switcher10 />;
export const ThemeSwitcher11: React.FC = () => <Switcher11 />;
export const ThemeSwitcher12: React.FC = () => <Switcher12 />;
export const ThemeSwitcher13: React.FC = () => <Switcher13 />;

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