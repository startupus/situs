// src/components/ui/ThemeSkeletons.tsx
import React from 'react';
import { 
  Skeleton1,
  Skeleton2,
  Skeleton3
} from './core';
import { withTheme } from './ThemeWrapper';

// Skeleton Variants с поддержкой темы
export const ThemeSkeleton1 = withTheme(Skeleton1, 'secondary');
export const ThemeSkeleton2 = withTheme(Skeleton2, 'secondary');
export const ThemeSkeleton3 = withTheme(Skeleton3, 'secondary');

// Экспорт коллекции
export const ThemeSkeletons = {
  Skeleton1: ThemeSkeleton1,
  Skeleton2: ThemeSkeleton2,
  Skeleton3: ThemeSkeleton3,
};

export default ThemeSkeletons;