// src/components/ui/ThemePaginations.tsx
import React from 'react';
import { 
  Pagination1,
  Pagination2,
  Pagination3
} from './core';

// Интерфейс для пропсов Pagination компонентов
interface PaginationProps {
  children?: React.ReactNode;
  className?: string;
  currentPage?: number;
  totalPages?: number;
  onPageChange?: (page: number) => void;
  variant?: '1' | '2' | '3';
  showFirstLast?: boolean;
  showPrevNext?: boolean;
  maxVisiblePages?: number;
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
}

// Утилита для адаптации стилей под глобальную тему
const adaptPaginationProps = (props: PaginationProps) => ({
  ...props,
  className: `${props.className || ''} transition-all duration-200`
});

// Pagination Variants
export const ThemePagination1: React.FC<PaginationProps> = (props) => (
  <Pagination1 {...adaptPaginationProps(props)} />
);

export const ThemePagination2: React.FC<PaginationProps> = (props) => (
  <Pagination2 {...adaptPaginationProps(props)} />
);

export const ThemePagination3: React.FC<PaginationProps> = (props) => (
  <Pagination3 {...adaptPaginationProps(props)} />
);

// Экспорт всех Pagination компонентов как единый объект для удобства
export const ThemePaginations = {
  Pagination1: ThemePagination1,
  Pagination2: ThemePagination2,
  Pagination3: ThemePagination3,
};

// Экспорт по умолчанию
export default ThemePaginations;