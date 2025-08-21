// src/components/ui/ThemeClipboards.tsx
import React from 'react';
import { 
  Clipboard1,
  Clipboard2,
  Clipboard3,
  Clipboard4
} from './core';

// Clipboard Variants - простые обертки
export const ThemeClipboard1: React.FC = () => <Clipboard1 />;
export const ThemeClipboard2: React.FC = () => <Clipboard2 />;
export const ThemeClipboard3: React.FC = () => <Clipboard3 />;
export const ThemeClipboard4: React.FC = () => <Clipboard4 />;

// Экспорт коллекции
export const ThemeClipboards = {
  Clipboard1: ThemeClipboard1,
  Clipboard2: ThemeClipboard2,
  Clipboard3: ThemeClipboard3,
  Clipboard4: ThemeClipboard4,
};

export default ThemeClipboards;