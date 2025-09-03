// src/components/ui/ThemeStickyBars.tsx
import React from 'react';
import { StickyBar1, StickyBar2, StickyBar3, StickyBar4 } from './core';

// StickyBar Variants - простые обертки
export const ThemeStickyBar1: React.FC = () => <StickyBar1 />;
export const ThemeStickyBar2: React.FC = () => <StickyBar2 />;
export const ThemeStickyBar3: React.FC = () => <StickyBar3 />;
export const ThemeStickyBar4: React.FC = () => <StickyBar4 />;

// Экспорт коллекции
export const ThemeStickyBars = {
  StickyBar1: ThemeStickyBar1,
  StickyBar2: ThemeStickyBar2,
  StickyBar3: ThemeStickyBar3,
  StickyBar4: ThemeStickyBar4,
};

export default ThemeStickyBars;
