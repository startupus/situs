// src/components/ui/application/ThemeCards.tsx
import React from 'react';
import Card1 from '../core/application/Card/Card1';

// Интерфейс для пропсов Card компонентов
interface CardProps {
  children?: React.ReactNode;
  className?: string;
}

// Утилита для адаптации стилей под глобальную тему
const adaptCardProps = (props: CardProps) => ({
  ...props,
  className: `${props.className || ''} transition-colors duration-200`
});

// Card Variants с поддержкой темы
export const ThemeCard1: React.FC<CardProps> = (props) => (
  <Card1 {...adaptCardProps(props)} />
);

// Заглушки для остальных Card компонентов (будут добавлены позже)
export const ThemeCard2: React.FC<CardProps> = (props) => (
  <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded border border-blue-200 dark:border-blue-800">
    <p className="text-gray-600 dark:text-gray-400">Card2 - будет добавлен позже</p>
  </div>
);

export const ThemeCard3: React.FC<CardProps> = (props) => (
  <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded border border-blue-200 dark:border-blue-800">
    <p className="text-gray-600 dark:text-gray-400">Card3 - будет добавлен позже</p>
  </div>
);

export const ThemeCard4: React.FC<CardProps> = (props) => (
  <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded border border-blue-200 dark:border-blue-800">
    <p className="text-gray-600 dark:text-gray-400">Card4 - будет добавлен позже</p>
  </div>
);

export const ThemeCard5: React.FC<CardProps> = (props) => (
  <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded border border-blue-200 dark:border-blue-800">
    <p className="text-gray-600 dark:text-gray-400">Card5 - будет добавлен позже</p>
  </div>
);

export const ThemeCard6: React.FC<CardProps> = (props) => (
  <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded border border-blue-200 dark:border-blue-800">
    <p className="text-gray-600 dark:text-gray-400">Card6 - будет добавлен позже</p>
  </div>
);

export const ThemeCard7: React.FC<CardProps> = (props) => (
  <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded border border-blue-200 dark:border-blue-800">
    <p className="text-gray-600 dark:text-gray-400">Card7 - будет добавлен позже</p>
  </div>
);

export const ThemeCard8: React.FC<CardProps> = (props) => (
  <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded border border-blue-200 dark:border-blue-800">
    <p className="text-gray-600 dark:text-gray-400">Card8 - будет добавлен позже</p>
  </div>
);

export const ThemeCard9: React.FC<CardProps> = (props) => (
  <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded border border-blue-200 dark:border-blue-800">
    <p className="text-gray-600 dark:text-gray-400">Card9 - будет добавлен позже</p>
  </div>
);

export const ThemeCard10: React.FC<CardProps> = (props) => (
  <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded border border-blue-200 dark:border-blue-800">
    <p className="text-gray-600 dark:text-gray-400">Card10 - будет добавлен позже</p>
  </div>
);

export const ThemeCard11: React.FC<CardProps> = (props) => (
  <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded border border-blue-200 dark:border-blue-800">
    <p className="text-gray-600 dark:text-gray-400">Card11 - будет добавлен позже</p>
  </div>
);

export const ThemeCard12: React.FC<CardProps> = (props) => (
  <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded border border-blue-200 dark:border-blue-800">
    <p className="text-gray-600 dark:text-gray-400">Card12 - будет добавлен позже</p>
  </div>
);

export const ThemeCard13: React.FC<CardProps> = (props) => (
  <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded border border-blue-200 dark:border-blue-800">
    <p className="text-gray-600 dark:text-gray-400">Card13 - будет добавлен позже</p>
  </div>
);

export const ThemeCard14: React.FC<CardProps> = (props) => (
  <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded border border-blue-200 dark:border-blue-800">
    <p className="text-gray-600 dark:text-gray-400">Card14 - будет добавлен позже</p>
  </div>
);

export const ThemeCard15: React.FC<CardProps> = (props) => (
  <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded border border-blue-200 dark:border-blue-800">
    <p className="text-gray-600 dark:text-gray-400">Card15 - будет добавлен позже</p>
  </div>
);

export const ThemeCard16: React.FC<CardProps> = (props) => (
  <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded border border-blue-200 dark:border-blue-800">
    <p className="text-gray-600 dark:text-gray-400">Card16 - будет добавлен позже</p>
  </div>
);

// Экспорт всех Card компонентов как единый объект для удобства
export const ThemeCards = {
  Card1: ThemeCard1,
  Card2: ThemeCard2,
  Card3: ThemeCard3,
  Card4: ThemeCard4,
  Card5: ThemeCard5,
  Card6: ThemeCard6,
  Card7: ThemeCard7,
  Card8: ThemeCard8,
  Card9: ThemeCard9,
  Card10: ThemeCard10,
  Card11: ThemeCard11,
  Card12: ThemeCard12,
  Card13: ThemeCard13,
  Card14: ThemeCard14,
  Card15: ThemeCard15,
  Card16: ThemeCard16,
};

export default ThemeCards;