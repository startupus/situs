// src/components/ui/ThemeTags.tsx
import React from 'react';
import { Tag1, Tag2, Tag3, Tag4 } from './core';
import { withTheme } from './ThemeWrapper';

// Tag Variants с поддержкой темы
export const ThemeTag1 = withTheme(Tag1, 'primary');
export const ThemeTag2 = withTheme(Tag2, 'secondary');
export const ThemeTag3 = withTheme(Tag3, 'success');
export const ThemeTag4 = withTheme(Tag4, 'info');

// Экспорт коллекции
export const ThemeTags = {
  Tag1: ThemeTag1,
  Tag2: ThemeTag2,
  Tag3: ThemeTag3,
  Tag4: ThemeTag4,
};

export default ThemeTags;
