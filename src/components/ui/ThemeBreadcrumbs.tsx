// src/components/ui/ThemeBreadcrumbs.tsx
import React from 'react';
import {
  Breadcrumb1,
  Breadcrumb2,
  Breadcrumb3,
  Breadcrumb4,
  Breadcrumb5,
  Breadcrumb6,
  Breadcrumb7,
  Breadcrumb8,
  Breadcrumb9,
  Breadcrumb10,
  Breadcrumb11,
  Breadcrumb12,
} from './core';

// Интерфейс для пропсов Breadcrumb компонентов
interface BreadcrumbProps {
  children?: React.ReactNode;
  className?: string;
  items?: Array<{
    label: string;
    href?: string;
    current?: boolean;
  }>;
  separator?: 'arrow' | 'slash' | 'chevron';
  variant?: '1' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9' | '10' | '11' | '12';
  showHomeIcon?: boolean;
}

// Утилита для адаптации стилей под глобальную тему
const adaptBreadcrumbProps = (props: BreadcrumbProps) => ({
  ...props,
  className: `${props.className || ''} transition-all duration-200`,
});

// Breadcrumb Variants
export const ThemeBreadcrumb1: React.FC<BreadcrumbProps> = (props) => (
  <Breadcrumb1 {...(adaptBreadcrumbProps(props) as any)} />
);

export const ThemeBreadcrumb2: React.FC<BreadcrumbProps> = (props) => (
  <Breadcrumb2 {...(adaptBreadcrumbProps(props) as any)} />
);

export const ThemeBreadcrumb3: React.FC<BreadcrumbProps> = (props) => (
  <Breadcrumb3 {...(adaptBreadcrumbProps(props) as any)} />
);

export const ThemeBreadcrumb4: React.FC<BreadcrumbProps> = (props) => (
  <Breadcrumb4 {...(adaptBreadcrumbProps(props) as any)} />
);

export const ThemeBreadcrumb5: React.FC<BreadcrumbProps> = (props) => (
  <Breadcrumb5 {...(adaptBreadcrumbProps(props) as any)} />
);

export const ThemeBreadcrumb6: React.FC<BreadcrumbProps> = (props) => (
  <Breadcrumb6 {...(adaptBreadcrumbProps(props) as any)} />
);

export const ThemeBreadcrumb7: React.FC<BreadcrumbProps> = (props) => (
  <Breadcrumb7 {...(adaptBreadcrumbProps(props) as any)} />
);

export const ThemeBreadcrumb8: React.FC<BreadcrumbProps> = (props) => (
  <Breadcrumb8 {...(adaptBreadcrumbProps(props) as any)} />
);

export const ThemeBreadcrumb9: React.FC<BreadcrumbProps> = (props) => (
  <Breadcrumb9 {...(adaptBreadcrumbProps(props) as any)} />
);

export const ThemeBreadcrumb10: React.FC<BreadcrumbProps> = (props) => (
  <Breadcrumb10 {...(adaptBreadcrumbProps(props) as any)} />
);

export const ThemeBreadcrumb11: React.FC<BreadcrumbProps> = (props) => (
  <Breadcrumb11 {...(adaptBreadcrumbProps(props) as any)} />
);

export const ThemeBreadcrumb12: React.FC<BreadcrumbProps> = (props) => (
  <Breadcrumb12 {...(adaptBreadcrumbProps(props) as any)} />
);

// Экспорт всех Breadcrumb компонентов как единый объект для удобства
export const ThemeBreadcrumbs = {
  Breadcrumb1: ThemeBreadcrumb1,
  Breadcrumb2: ThemeBreadcrumb2,
  Breadcrumb3: ThemeBreadcrumb3,
  Breadcrumb4: ThemeBreadcrumb4,
  Breadcrumb5: ThemeBreadcrumb5,
  Breadcrumb6: ThemeBreadcrumb6,
  Breadcrumb7: ThemeBreadcrumb7,
  Breadcrumb8: ThemeBreadcrumb8,
  Breadcrumb9: ThemeBreadcrumb9,
  Breadcrumb10: ThemeBreadcrumb10,
  Breadcrumb11: ThemeBreadcrumb11,
  Breadcrumb12: ThemeBreadcrumb12,
};

// Экспорт по умолчанию
export default ThemeBreadcrumbs;
