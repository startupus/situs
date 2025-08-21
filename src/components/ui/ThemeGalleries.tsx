// src/components/ui/ThemeGalleries.tsx
import React from 'react';
import { 
  Gallery1,
  Gallery2,
  Gallery3,
  Gallery4,
  Gallery5
} from './core';

// Gallery Variants - простые обертки
export const ThemeGallery1: React.FC = () => <Gallery1 />;
export const ThemeGallery2: React.FC = () => <Gallery2 />;
export const ThemeGallery3: React.FC = () => <Gallery3 />;
export const ThemeGallery4: React.FC = () => <Gallery4 />;
export const ThemeGallery5: React.FC = () => <Gallery5 />;

// Экспорт коллекции
export const ThemeGalleries = {
  Gallery1: ThemeGallery1,
  Gallery2: ThemeGallery2,
  Gallery3: ThemeGallery3,
  Gallery4: ThemeGallery4,
  Gallery5: ThemeGallery5,
};

export default ThemeGalleries;