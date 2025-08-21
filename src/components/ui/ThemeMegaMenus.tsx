// src/components/ui/ThemeMegaMenus.tsx
import React from 'react';
import { 
  MegaMenu1,
  MegaMenu2,
  MegaMenu3
} from './core';

// MegaMenu Variants - простые обертки
export const ThemeMegaMenu1: React.FC = () => <MegaMenu1 />;
export const ThemeMegaMenu2: React.FC = () => <MegaMenu2 />;
export const ThemeMegaMenu3: React.FC = () => <MegaMenu3 />;

// Экспорт коллекции
export const ThemeMegaMenus = {
  MegaMenu1: ThemeMegaMenu1,
  MegaMenu2: ThemeMegaMenu2,
  MegaMenu3: ThemeMegaMenu3,
};

export default ThemeMegaMenus;