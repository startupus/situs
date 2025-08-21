// src/components/ui/ThemePageTitles.tsx
import React from 'react';
import { 
  PageTitle1,
  PageTitle2,
  PageTitle3,
  PageTitle4,
  PageTitle5
} from './core';

// PageTitle Variants - простые обертки
export const ThemePageTitle1: React.FC = () => <PageTitle1 />;
export const ThemePageTitle2: React.FC = () => <PageTitle2 />;
export const ThemePageTitle3: React.FC = () => <PageTitle3 />;
export const ThemePageTitle4: React.FC = () => <PageTitle4 />;
export const ThemePageTitle5: React.FC = () => <PageTitle5 />;

// Экспорт коллекции
export const ThemePageTitles = {
  PageTitle1: ThemePageTitle1,
  PageTitle2: ThemePageTitle2,
  PageTitle3: ThemePageTitle3,
  PageTitle4: ThemePageTitle4,
  PageTitle5: ThemePageTitle5,
};

export default ThemePageTitles;