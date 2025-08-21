// src/components/ui/ThemeRatings.tsx
import React from 'react';
import { 
  Rating1,
  Rating2,
  Rating3
} from './core';
import { withTheme } from './ThemeWrapper';

// Rating Variants с поддержкой темы
export const ThemeRating1 = withTheme(Rating1, 'warning');
export const ThemeRating2 = withTheme(Rating2, 'warning');
export const ThemeRating3 = withTheme(Rating3, 'warning');

// Экспорт коллекции
export const ThemeRatings = {
  Rating1: ThemeRating1,
  Rating2: ThemeRating2,
  Rating3: ThemeRating3,
};

export default ThemeRatings;