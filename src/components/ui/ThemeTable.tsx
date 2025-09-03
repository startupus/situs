import React, { ReactNode } from 'react';

interface ThemeTableProps {
  children: ReactNode;
  className?: string;
}

export const ThemeTable: React.FC<ThemeTableProps> = ({ children, className = '' }) => {
  return (
    <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
      <div className="overflow-x-auto">
        <table className={`min-w-full divide-y divide-gray-200 dark:divide-gray-700 ${className}`}>{children}</table>
      </div>
    </div>
  );
};

interface ThemeTableHeaderProps {
  children: ReactNode;
  className?: string;
}

export const ThemeTableHeader: React.FC<ThemeTableHeaderProps> = ({ children, className = '' }) => {
  return <thead className={`bg-gray-50 dark:bg-gray-900 ${className}`}>{children}</thead>;
};

interface ThemeTableBodyProps {
  children: ReactNode;
  className?: string;
}

export const ThemeTableBody: React.FC<ThemeTableBodyProps> = ({ children, className = '' }) => {
  return (
    <tbody className={`bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700 ${className}`}>
      {children}
    </tbody>
  );
};

interface ThemeTableRowProps {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
}

export const ThemeTableRow: React.FC<ThemeTableRowProps> = ({ children, className = '', onClick }) => {
  return (
    <tr
      className={`hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors ${onClick ? 'cursor-pointer' : ''} ${className}`}
      onClick={onClick}
    >
      {children}
    </tr>
  );
};

interface ThemeTableCellProps {
  children: ReactNode;
  className?: string;
  header?: boolean;
}

export const ThemeTableCell: React.FC<ThemeTableCellProps> = ({ children, className = '', header = false }) => {
  const baseClasses = 'px-6 py-4 text-left';
  const headerClasses = 'text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider';
  const cellClasses = 'text-sm text-gray-900 dark:text-white';

  const Tag = header ? 'th' : 'td';

  return <Tag className={`${baseClasses} ${header ? headerClasses : cellClasses} ${className}`}>{children}</Tag>;
};
