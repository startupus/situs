import React from 'react';
import { FiChevronLeft, FiChevronRight, FiMoreHorizontal } from 'react-icons/fi';

interface ThemePaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'outline' | 'minimal';
  showFirstLast?: boolean;
  showPrevNext?: boolean;
  maxVisiblePages?: number;
  className?: string;
}

const ThemePagination: React.FC<ThemePaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
  size = 'md',
  variant = 'default',
  showFirstLast = false,
  showPrevNext = true,
  maxVisiblePages = 5,
  className = '',
}) => {
  const getSizeStyles = () => {
    const sizes = {
      sm: 'h-8 min-w-8 px-2 text-sm',
      md: 'h-10 min-w-10 px-3 text-base',
      lg: 'h-12 min-w-12 px-4 text-lg',
    };
    return sizes[size];
  };

  const getVariantStyles = (isActive = false, isDisabled = false) => {
    if (isDisabled) {
      return 'bg-gray-100 text-gray-400 cursor-not-allowed dark:bg-gray-800 dark:text-gray-600';
    }

    const variants = {
      default: isActive
        ? 'bg-blue-600 text-white border-blue-600'
        : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-700',
      outline: isActive
        ? 'bg-blue-600 text-white border-blue-600'
        : 'bg-transparent text-gray-700 border-gray-300 hover:bg-gray-50 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-800',
      minimal: isActive
        ? 'bg-blue-600 text-white'
        : 'bg-transparent text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800',
    };
    return variants[variant];
  };

  const getBorderStyles = () => {
    if (variant === 'minimal') return '';
    return 'border';
  };

  // Вычисляем видимые страницы
  const getVisiblePages = () => {
    const pages: (number | 'ellipsis')[] = [];
    const halfVisible = Math.floor(maxVisiblePages / 2);

    let start = Math.max(1, currentPage - halfVisible);
    let end = Math.min(totalPages, currentPage + halfVisible);

    // Корректируем диапазон если он меньше maxVisiblePages
    if (end - start + 1 < maxVisiblePages) {
      if (start === 1) {
        end = Math.min(totalPages, start + maxVisiblePages - 1);
      } else {
        start = Math.max(1, end - maxVisiblePages + 1);
      }
    }

    // Добавляем первую страницу и многоточие если нужно
    if (start > 1) {
      pages.push(1);
      if (start > 2) {
        pages.push('ellipsis');
      }
    }

    // Добавляем видимые страницы
    for (let i = start; i <= end; i++) {
      pages.push(i);
    }

    // Добавляем многоточие и последнюю страницу если нужно
    if (end < totalPages) {
      if (end < totalPages - 1) {
        pages.push('ellipsis');
      }
      pages.push(totalPages);
    }

    return pages;
  };

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages && page !== currentPage) {
      onPageChange(page);
    }
  };

  const visiblePages = getVisiblePages();

  return (
    <nav className={`flex items-center justify-center ${className}`} aria-label="Пагинация">
      <ul className="flex items-center gap-1">
        {/* Первая страница */}
        {showFirstLast && currentPage > 1 && (
          <li>
            <button
              onClick={() => handlePageChange(1)}
              className={`
                flex items-center justify-center rounded-lg font-medium transition-colors
                ${getSizeStyles()}
                ${getBorderStyles()}
                ${getVariantStyles()}
              `
                .trim()
                .replace(/\s+/g, ' ')}
              aria-label="Первая страница"
            >
              Первая
            </button>
          </li>
        )}

        {/* Предыдущая страница */}
        {showPrevNext && (
          <li>
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage <= 1}
              className={`
                flex items-center justify-center rounded-lg font-medium transition-colors
                ${getSizeStyles()}
                ${getBorderStyles()}
                ${getVariantStyles(false, currentPage <= 1)}
              `
                .trim()
                .replace(/\s+/g, ' ')}
              aria-label="Предыдущая страница"
            >
              <FiChevronLeft className="w-4 h-4" />
            </button>
          </li>
        )}

        {/* Страницы */}
        {visiblePages.map((page, index) => (
          <li key={index}>
            {page === 'ellipsis' ? (
              <span
                className={`
                flex items-center justify-center font-medium text-gray-500 dark:text-gray-400
                ${getSizeStyles()}
              `
                  .trim()
                  .replace(/\s+/g, ' ')}
              >
                <FiMoreHorizontal className="w-4 h-4" />
              </span>
            ) : (
              <button
                onClick={() => handlePageChange(page)}
                className={`
                  flex items-center justify-center rounded-lg font-medium transition-colors
                  ${getSizeStyles()}
                  ${getBorderStyles()}
                  ${getVariantStyles(page === currentPage)}
                `
                  .trim()
                  .replace(/\s+/g, ' ')}
                aria-label={`Страница ${page}`}
                aria-current={page === currentPage ? 'page' : undefined}
              >
                {page}
              </button>
            )}
          </li>
        ))}

        {/* Следующая страница */}
        {showPrevNext && (
          <li>
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage >= totalPages}
              className={`
                flex items-center justify-center rounded-lg font-medium transition-colors
                ${getSizeStyles()}
                ${getBorderStyles()}
                ${getVariantStyles(false, currentPage >= totalPages)}
              `
                .trim()
                .replace(/\s+/g, ' ')}
              aria-label="Следующая страница"
            >
              <FiChevronRight className="w-4 h-4" />
            </button>
          </li>
        )}

        {/* Последняя страница */}
        {showFirstLast && currentPage < totalPages && (
          <li>
            <button
              onClick={() => handlePageChange(totalPages)}
              className={`
                flex items-center justify-center rounded-lg font-medium transition-colors
                ${getSizeStyles()}
                ${getBorderStyles()}
                ${getVariantStyles()}
              `
                .trim()
                .replace(/\s+/g, ' ')}
              aria-label="Последняя страница"
            >
              Последняя
            </button>
          </li>
        )}
      </ul>
    </nav>
  );
};

export default ThemePagination;
