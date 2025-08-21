// src/components/ui/ThemeFileUploads.tsx
import React from 'react';
import { 
  FileUpload1,
  FileUpload2,
  FileUpload3,
  FileUpload4,
  FileUpload5
} from './core';

// FileUpload Variants - простые обертки
export const ThemeFileUpload1: React.FC = () => <FileUpload1 />;
export const ThemeFileUpload2: React.FC = () => <FileUpload2 />;
export const ThemeFileUpload3: React.FC = () => <FileUpload3 />;
export const ThemeFileUpload4: React.FC = () => <FileUpload4 />;
export const ThemeFileUpload5: React.FC = () => <FileUpload5 />;

// Экспорт коллекции
export const ThemeFileUploads = {
  FileUpload1: ThemeFileUpload1,
  FileUpload2: ThemeFileUpload2,
  FileUpload3: ThemeFileUpload3,
  FileUpload4: ThemeFileUpload4,
  FileUpload5: ThemeFileUpload5,
};

export default ThemeFileUploads;