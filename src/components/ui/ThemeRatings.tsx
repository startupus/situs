// src/components/ui/ThemeRatings.tsx
import React from 'react';
import { 
  Rating1,
  Rating2,
  Rating3
} from './core';

// Rating Variants - простые обертки
export const ThemeRating1: React.FC = () => <Rating1 />;
export const ThemeRating2: React.FC = () => <Rating2 />;
export const ThemeRating3: React.FC = () => <Rating3 />;

// Экспорт коллекции
export const ThemeRatings = {
  Rating1: ThemeRating1,
  Rating2: ThemeRating2,
  Rating3: ThemeRating3,
};

export default ThemeRatings;