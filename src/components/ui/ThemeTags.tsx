// src/components/ui/ThemeTags.tsx
import React from 'react';
import { 
  Tag1,
  Tag2,
  Tag3,
  Tag4
} from './core';

// Tag Variants - простые обертки
export const ThemeTag1: React.FC = () => <Tag1 />;
export const ThemeTag2: React.FC = () => <Tag2 />;
export const ThemeTag3: React.FC = () => <Tag3 />;
export const ThemeTag4: React.FC = () => <Tag4 />;

// Экспорт коллекции
export const ThemeTags = {
  Tag1: ThemeTag1,
  Tag2: ThemeTag2,
  Tag3: ThemeTag3,
  Tag4: ThemeTag4,
};

export default ThemeTags;