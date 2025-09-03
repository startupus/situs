// src/components/ui/ThemeTabs.tsx
import React from 'react';
import { Tab1, Tab2, Tab3, Tab4, Tab5, Tab6, Tab7, Tab8, Tab9, Tab10, Tab11 } from './core';
import { withTheme } from './ThemeWrapper';

// Tab Variants с поддержкой темы
export const ThemeTab1 = withTheme(Tab1, 'primary');
export const ThemeTab2 = withTheme(Tab2, 'primary');
export const ThemeTab3 = withTheme(Tab3, 'primary');
export const ThemeTab4 = withTheme(Tab4, 'primary');
export const ThemeTab5 = withTheme(Tab5, 'primary');
export const ThemeTab6 = withTheme(Tab6, 'primary');
export const ThemeTab7 = withTheme(Tab7, 'primary');
export const ThemeTab8 = withTheme(Tab8, 'primary');
export const ThemeTab9 = withTheme(Tab9, 'primary');
export const ThemeTab10 = withTheme(Tab10, 'primary');
export const ThemeTab11 = withTheme(Tab11, 'primary');

// Экспорт коллекции
export const ThemeTabs = {
  Tab1: ThemeTab1,
  Tab2: ThemeTab2,
  Tab3: ThemeTab3,
  Tab4: ThemeTab4,
  Tab5: ThemeTab5,
  Tab6: ThemeTab6,
  Tab7: ThemeTab7,
  Tab8: ThemeTab8,
  Tab9: ThemeTab9,
  Tab10: ThemeTab10,
  Tab11: ThemeTab11,
};

export default ThemeTabs;
