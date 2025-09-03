// src/components/ui/ThemeSwitches.tsx
import React from 'react';
import { withTheme } from './ThemeWrapper';

// Импортируем Switch компонент напрямую
const SwitchComponent = React.lazy(() => import('./core/Switch/index'));

// Switch Variants с поддержкой темы
export const ThemeSwitch1: React.FC = () => (
  <React.Suspense fallback={<div>Loading...</div>}>
    <div className="theme-colors theme-typography">
      <SwitchComponent />
    </div>
  </React.Suspense>
);

// Экспорт коллекции
export const ThemeSwitches = {
  Switch1: ThemeSwitch1,
};

export default ThemeSwitches;
