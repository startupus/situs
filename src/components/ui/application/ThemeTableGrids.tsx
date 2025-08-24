// src/components/ui/application/ThemeTableGrids.tsx
import React from 'react';
import TableGrid1 from '../core/application/TableGrid/TableGrid1';
import TableGrid2 from '../core/application/TableGrid/TableGrid2';

// Интерфейс для пропсов TableGrid компонентов
interface TableGridProps {
  children?: React.ReactNode;
  className?: string;
}

// Утилита для адаптации стилей под глобальную тему
const adaptTableGridProps = (props: TableGridProps) => ({
  ...props,
  className: `${props.className || ''} transition-colors duration-200`
});

// TableGrid Variants с поддержкой темы
export const ThemeTableGrid1: React.FC<TableGridProps> = (props) => (
  <TableGrid1 {...adaptTableGridProps(props)} />
);

export const ThemeTableGrid2: React.FC<TableGridProps> = (props) => (
  <TableGrid2 {...adaptTableGridProps(props)} />
);

export const ThemeTableGrid3: React.FC<TableGridProps> = (props) => (
  <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded border border-blue-200 dark:border-blue-800">
    <p className="text-gray-600 dark:text-gray-400">TableGrid3 - будет добавлен позже</p>
  </div>
);

export const ThemeTableGrid4: React.FC<TableGridProps> = (props) => (
  <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded border border-blue-200 dark:border-blue-800">
    <p className="text-gray-600 dark:text-gray-400">TableGrid4 - будет добавлен позже</p>
  </div>
);

// Экспорт всех TableGrid компонентов как единый объект для удобства
export const ThemeTableGrids = {
  TableGrid1: ThemeTableGrid1,
  TableGrid2: ThemeTableGrid2,
  TableGrid3: ThemeTableGrid3,
  TableGrid4: ThemeTableGrid4,
};

export default ThemeTableGrids;