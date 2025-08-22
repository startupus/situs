// src/components/ui/application/ThemeErrors.tsx
import React from 'react';
import Error1 from '../core/application/Error/Error1';
import Error2 from '../core/application/Error/Error2';
import Error5 from '../core/application/Error/Error5';

// Интерфейс для пропсов Error компонентов
interface ErrorProps {
  children?: React.ReactNode;
  className?: string;
}

// Утилита для адаптации стилей под глобальную тему
const adaptErrorProps = (props: ErrorProps) => ({
  ...props,
  className: `${props.className || ''} transition-colors duration-200`
});

// Error Variants с поддержкой темы
export const ThemeError1: React.FC<ErrorProps> = (props) => (
  <Error1 {...adaptErrorProps(props)} />
);

export const ThemeError2: React.FC<ErrorProps> = (props) => (
  <Error2 {...adaptErrorProps(props)} />
);

export const ThemeError3: React.FC<ErrorProps> = (props) => (
  <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded border border-blue-200 dark:border-blue-800">
    <p className="text-gray-600 dark:text-gray-400">Error3 - будет добавлен позже</p>
  </div>
);

export const ThemeError4: React.FC<ErrorProps> = (props) => (
  <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded border border-blue-200 dark:border-blue-800">
    <p className="text-gray-600 dark:text-gray-400">Error4 - будет добавлен позже</p>
  </div>
);

export const ThemeError5: React.FC<ErrorProps> = (props) => (
  <Error5 {...adaptErrorProps(props)} />
);

export const ThemeError6: React.FC<ErrorProps> = (props) => (
  <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded border border-blue-200 dark:border-blue-800">
    <p className="text-gray-600 dark:text-gray-400">Error6 - будет добавлен позже</p>
  </div>
);

export const ThemeError7: React.FC<ErrorProps> = (props) => (
  <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded border border-blue-200 dark:border-blue-800">
    <p className="text-gray-600 dark:text-gray-400">Error7 - будет добавлен позже</p>
  </div>
);

export const ThemeError8: React.FC<ErrorProps> = (props) => (
  <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded border border-blue-200 dark:border-blue-800">
    <p className="text-gray-600 dark:text-gray-400">Error8 - будет добавлен позже</p>
  </div>
);

// Экспорт всех Error компонентов как единый объект для удобства
export const ThemeErrors = {
  Error1: ThemeError1,
  Error2: ThemeError2,
  Error3: ThemeError3,
  Error4: ThemeError4,
  Error5: ThemeError5,
  Error6: ThemeError6,
  Error7: ThemeError7,
  Error8: ThemeError8,
};

export default ThemeErrors;