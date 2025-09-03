// src/components/ui/ThemeDatePickers.tsx
import React from 'react';
import { DatePicker1, DatePicker2 } from './core';

// DatePicker Variants - простые обертки
export const ThemeDatePicker1: React.FC = () => <DatePicker1 />;
export const ThemeDatePicker2: React.FC = () => <DatePicker2 />;

// Экспорт коллекции
export const ThemeDatePickers = {
  DatePicker1: ThemeDatePicker1,
  DatePicker2: ThemeDatePicker2,
};

export default ThemeDatePickers;
