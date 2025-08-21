// src/components/ui/ThemeSkeletons.tsx
import React from 'react';
import { 
  Skeleton1,
  Skeleton2,
  Skeleton3
} from './core';

// Skeleton Variants - простые обертки
export const ThemeSkeleton1: React.FC = () => <Skeleton1 />;
export const ThemeSkeleton2: React.FC = () => <Skeleton2 />;
export const ThemeSkeleton3: React.FC = () => <Skeleton3 />;

// Экспорт коллекции
export const ThemeSkeletons = {
  Skeleton1: ThemeSkeleton1,
  Skeleton2: ThemeSkeleton2,
  Skeleton3: ThemeSkeleton3,
};

export default ThemeSkeletons;