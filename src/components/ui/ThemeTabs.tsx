// src/components/ui/ThemeTabs.tsx
import React from 'react';
import { 
  Tab1,
  Tab2,
  Tab3,
  Tab4,
  Tab5,
  Tab6,
  Tab7,
  Tab8,
  Tab9,
  Tab10,
  Tab11
} from './core';

// Tab Variants - простые обертки
export const ThemeTab1: React.FC = () => <Tab1 />;
export const ThemeTab2: React.FC = () => <Tab2 />;
export const ThemeTab3: React.FC = () => <Tab3 />;
export const ThemeTab4: React.FC = () => <Tab4 />;
export const ThemeTab5: React.FC = () => <Tab5 />;
export const ThemeTab6: React.FC = () => <Tab6 />;
export const ThemeTab7: React.FC = () => <Tab7 />;
export const ThemeTab8: React.FC = () => <Tab8 />;
export const ThemeTab9: React.FC = () => <Tab9 />;
export const ThemeTab10: React.FC = () => <Tab10 />;
export const ThemeTab11: React.FC = () => <Tab11 />;

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