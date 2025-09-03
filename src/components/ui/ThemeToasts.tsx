// src/components/ui/ThemeToasts.tsx
import React from 'react';
import { Toast1, Toast2, Toast3, Toast4, Toast5, Toast6, Toast7, Toast8 } from './core';
import { withTheme } from './ThemeWrapper';

// Toast Variants с поддержкой темы
export const ThemeToast1 = withTheme(Toast1, 'info');
export const ThemeToast2 = withTheme(Toast2, 'success');
export const ThemeToast3 = withTheme(Toast3, 'warning');
export const ThemeToast4 = withTheme(Toast4, 'danger');
export const ThemeToast5 = withTheme(Toast5, 'info');
export const ThemeToast6 = withTheme(Toast6, 'primary');
export const ThemeToast7 = withTheme(Toast7, 'secondary');
export const ThemeToast8 = withTheme(Toast8, 'dark');

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
