import React from 'react';

interface StatsCardProps {
  icon: React.ReactNode;
  color: string;
  title: string;
  subtitle?: string;
  value: string | number;
  trend?: {
    value: string;
    direction: 'up' | 'down';
  };
  progress?: number;
}

const StatsCard: React.FC<StatsCardProps> = ({ icon, color, title, subtitle, value, trend, progress }) => {
  return (
    <div className="w-full px-4 sm:w-1/2 lg:w-1/3">
      <div className="mb-8 rounded-lg bg-white p-6 shadow-lg dark:bg-gray-800 dark:shadow-gray-900/20">
        <div className="mb-5 flex items-center">
          <div className="relative mr-4 flex h-12 w-12 items-center justify-center rounded-lg" style={{ color: color }}>
            {icon}
            <div className="absolute inset-0 h-full w-full rounded-lg opacity-10" style={{ backgroundColor: color }} />
          </div>
          <div>
            <h5 className="text-base font-medium text-gray-900 dark:text-white">{title}</h5>
            {subtitle && <p className="text-sm text-gray-500 dark:text-gray-400">{subtitle}</p>}
          </div>
        </div>

        <div>
          <div className="mb-4 flex items-end">
            <p className="mr-2 text-2xl font-bold leading-none text-gray-900 dark:text-white">{value}</p>
            {trend && (
              <p
                className={`inline-flex items-center text-sm font-medium ${
                  trend.direction === 'up' ? 'text-green-600' : 'text-red-600'
                }`}
              >
                {trend.value}
                <span className="ml-1">
                  {trend.direction === 'up' ? (
                    <svg width="10" height="11" viewBox="0 0 10 11" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path
                        d="M4.35716 2.8925L0.908974 6.245L5.0443e-07 5.36125L5 0.499999L10 5.36125L9.09103 6.245L5.64284 2.8925L5.64284 10.5L4.35716 10.5L4.35716 2.8925Z"
                        fill="currentColor"
                      />
                    </svg>
                  ) : (
                    <svg width="10" height="11" viewBox="0 0 10 11" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path
                        d="M5.64284 8.1075L9.09102 4.755L10 5.63875L5 10.5L-8.98488e-07 5.63875L0.908973 4.755L4.35716 8.1075L4.35716 0.500001L5.64284 0.500001L5.64284 8.1075Z"
                        fill="currentColor"
                      />
                    </svg>
                  )}
                </span>
              </p>
            )}
          </div>

          {progress !== undefined && (
            <div className="relative h-2 w-full rounded-full bg-gray-200 dark:bg-gray-700">
              <div
                className="h-full rounded-full transition-all duration-300"
                style={{ backgroundColor: color, width: `${progress}%` }}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

interface StatsGridProps {
  children: React.ReactNode;
  className?: string;
}

export const StatsGrid: React.FC<StatsGridProps> = ({ children, className = '' }) => {
  return <div className={`-mx-4 flex flex-wrap ${className}`}>{children}</div>;
};

export default StatsCard;
