// src/components/ui/ThemeButtonGroups.tsx
import React from 'react';
import { ButtonGroup1, ButtonGroup2, ButtonGroup3 } from './core';

// ButtonGroup Variants - простые обертки
export const ThemeButtonGroup1: React.FC = () => <ButtonGroup1 />;
export const ThemeButtonGroup2: React.FC = () => <ButtonGroup2 />;
export const ThemeButtonGroup3: React.FC = () => <ButtonGroup3 />;

// Экспорт коллекции
export const ThemeButtonGroups = {
  ButtonGroup1: ThemeButtonGroup1,
  ButtonGroup2: ThemeButtonGroup2,
  ButtonGroup3: ThemeButtonGroup3,
};

export default ThemeButtonGroups;
