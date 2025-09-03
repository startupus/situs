// src/components/ui/ThemeClipboards.tsx
import React from 'react';
import { Clipboard1, Clipboard2, Clipboard3, Clipboard4 } from './core';
import { withTheme } from './ThemeWrapper';

// Clipboard Variants с поддержкой темы
export const ThemeClipboard1 = withTheme(Clipboard1, 'primary');
export const ThemeClipboard2 = withTheme(Clipboard2, 'primary');
export const ThemeClipboard3 = withTheme(Clipboard3, 'primary');
export const ThemeClipboard4 = withTheme(Clipboard4, 'primary');

// Экспорт коллекции
export const ThemeClipboards = {
  Clipboard1: ThemeClipboard1,
  Clipboard2: ThemeClipboard2,
  Clipboard3: ThemeClipboard3,
  Clipboard4: ThemeClipboard4,
};

export default ThemeClipboards;
