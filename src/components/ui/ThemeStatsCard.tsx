import React, { ReactNode } from 'react';

interface ThemeStatsCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon?: ReactNode;
  color?: 'primary' | 'success' | 'warning' | 'danger' | 'info' | 'gray';
  className?: string;
}

const ThemeStatsCard: React.FC<ThemeStatsCardProps> = ({
  title,
  value,
  subtitle,
  icon,
  color = 'gray',
  className = '',
}) => {
  const colorClasses = {
    primary: 'text-primary',
    success: 'text-green-600',
    warning: 'text-yellow-600',
    danger: 'text-red-600',
    info: 'text-blue-600',
    gray: 'text-gray-600',
  };

  return (
    <div
      className={`bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6 ${className}`}
    >
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <div className={`text-2xl font-bold ${colorClasses[color]} dark:text-white`}>{value}</div>
          <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">{title}</div>
          {subtitle && <div className="text-xs text-gray-500 dark:text-gray-500 mt-1">{subtitle}</div>}
        </div>
        {icon && <div className={`ml-4 ${colorClasses[color]}`}>{icon}</div>}
      </div>
    </div>
  );
};

export default ThemeStatsCard;
