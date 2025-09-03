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
  UnOrderedList6,
} from './core';
import { withTheme } from './ThemeWrapper';

// List Variants с поддержкой темы
export const ThemeOrderedList1 = withTheme(OrderedList1, 'primary');
export const ThemeOrderedList2 = withTheme(OrderedList2, 'primary');
export const ThemeOrderedList3 = withTheme(OrderedList3, 'primary');
export const ThemeUnOrderedList1 = withTheme(UnOrderedList1, 'primary');
export const ThemeUnOrderedList2 = withTheme(UnOrderedList2, 'primary');
export const ThemeUnOrderedList3 = withTheme(UnOrderedList3, 'primary');
export const ThemeUnOrderedList4 = withTheme(UnOrderedList4, 'primary');
export const ThemeUnOrderedList5 = withTheme(UnOrderedList5, 'primary');
export const ThemeUnOrderedList6 = withTheme(UnOrderedList6, 'primary');

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
