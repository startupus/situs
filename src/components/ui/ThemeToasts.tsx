// src/components/ui/ThemeToasts.tsx
import React from 'react';
import { 
  Toast1,
  Toast2,
  Toast3,
  Toast4,
  Toast5,
  Toast6,
  Toast7,
  Toast8
} from './core';

// Toast Variants - простые обертки
export const ThemeToast1: React.FC = () => <Toast1 />;
export const ThemeToast2: React.FC = () => <Toast2 />;
export const ThemeToast3: React.FC = () => <Toast3 />;
export const ThemeToast4: React.FC = () => <Toast4 />;
export const ThemeToast5: React.FC = () => <Toast5 />;
export const ThemeToast6: React.FC = () => <Toast6 />;
export const ThemeToast7: React.FC = () => <Toast7 />;
export const ThemeToast8: React.FC = () => <Toast8 />;

// Экспорт коллекции
export const ThemeToasts = {
  Toast1: ThemeToast1,
  Toast2: ThemeToast2,
  Toast3: ThemeToast3,
  Toast4: ThemeToast4,
  Toast5: ThemeToast5,
  Toast6: ThemeToast6,
  Toast7: ThemeToast7,
  Toast8: ThemeToast8,
};

export default ThemeToasts;