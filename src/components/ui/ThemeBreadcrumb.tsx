import React, { ReactNode } from 'react';
import { FiChevronRight, FiHome } from 'react-icons/fi';

interface BreadcrumbItem {
  label: string;
  href?: string;
  icon?: ReactNode;
  current?: boolean;
}

interface ThemeBreadcrumbProps {
  items: BreadcrumbItem[];
  separator?: ReactNode;
  showHomeIcon?: boolean;
  className?: string;
  onItemClick?: (item: BreadcrumbItem, index: number) => void;
}

const ThemeBreadcrumb: React.FC<ThemeBreadcrumbProps> = ({
  items,
  separator = <FiChevronRight className="w-4 h-4" />,
  showHomeIcon = false,
  className = '',
  onItemClick,
}) => {
  const handleItemClick = (item: BreadcrumbItem, index: number, e: React.MouseEvent) => {
    if (item.current) {
      e.preventDefault();
      return;
    }

    if (onItemClick) {
      e.preventDefault();
      onItemClick(item, index);
    }
  };

  return (
    <nav className={`flex ${className}`} aria-label="Breadcrumb">
      <ol className="inline-flex items-center space-x-1 md:space-x-3">
        {items.map((item, index) => (
          <li key={index} className="inline-flex items-center">
            {index > 0 && <div className="flex items-center text-gray-400 dark:text-gray-600 mx-1">{separator}</div>}

            <div className="flex items-center">
              {item.icon && <span className="mr-2 text-gray-500 dark:text-gray-400">{item.icon}</span>}

              {showHomeIcon && index === 0 && !item.icon && (
                <FiHome className="w-4 h-4 mr-2 text-gray-500 dark:text-gray-400" />
              )}

              {item.current ? (
                <span className="text-sm font-medium text-gray-500 dark:text-gray-400 cursor-default">
                  {item.label}
                </span>
              ) : (
                <a
                  href={item.href || '#'}
                  onClick={(e) => handleItemClick(item, index, e)}
                  className="text-sm font-medium text-gray-700 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400 transition-colors"
                >
                  {item.label}
                </a>
              )}
            </div>
          </li>
        ))}
      </ol>
    </nav>
  );
};

export default ThemeBreadcrumb;
