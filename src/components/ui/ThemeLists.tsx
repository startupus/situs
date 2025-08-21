// src/components/ui/ThemeLists.tsx
import React from 'react';
import { 
  OrderedList1,
  OrderedList2,
  OrderedList3,
  UnOrderedList1,
  UnOrderedList2,
  UnOrderedList3,
  UnOrderedList4,
  UnOrderedList5,
  UnOrderedList6
} from './core';

// List Variants - простые обертки
export const ThemeOrderedList1: React.FC = () => <OrderedList1 />;
export const ThemeOrderedList2: React.FC = () => <OrderedList2 />;
export const ThemeOrderedList3: React.FC = () => <OrderedList3 />;
export const ThemeUnOrderedList1: React.FC = () => <UnOrderedList1 />;
export const ThemeUnOrderedList2: React.FC = () => <UnOrderedList2 />;
export const ThemeUnOrderedList3: React.FC = () => <UnOrderedList3 />;
export const ThemeUnOrderedList4: React.FC = () => <UnOrderedList4 />;
export const ThemeUnOrderedList5: React.FC = () => <UnOrderedList5 />;
export const ThemeUnOrderedList6: React.FC = () => <UnOrderedList6 />;

// Экспорт коллекции
export const ThemeLists = {
  OrderedList1: ThemeOrderedList1,
  OrderedList2: ThemeOrderedList2,
  OrderedList3: ThemeOrderedList3,
  UnOrderedList1: ThemeUnOrderedList1,
  UnOrderedList2: ThemeUnOrderedList2,
  UnOrderedList3: ThemeUnOrderedList3,
  UnOrderedList4: ThemeUnOrderedList4,
  UnOrderedList5: ThemeUnOrderedList5,
  UnOrderedList6: ThemeUnOrderedList6,
};

export default ThemeLists;