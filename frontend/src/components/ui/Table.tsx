import React, { useState, useEffect } from 'react';
import { ChevronUpIcon, ChevronDownIcon } from '@heroicons/react/24/outline';
import Button from './Button';

export interface TableColumn<T> {
  key: keyof T;
  label: string;
  sortable?: boolean;
  width?: string;
  render?: (value: any, row: T) => React.ReactNode;
}

export interface TableProps<T> {
  data: T[];
  columns: TableColumn<T>[];
  loading?: boolean;
  pagination?: {
    page: number;
    limit: number;
    total: number;
    pages: number;
    onPageChange: (page: number) => void;
    onLimitChange: (limit: number) => void;
  };
  sorting?: {
    field: keyof T;
    direction: 'asc' | 'desc';
    onSort: (field: keyof T, direction: 'asc' | 'desc') => void;
  };
  actions?: (row: T) => React.ReactNode;
  emptyMessage?: string;
  className?: string;
}

const Table = <T extends Record<string, any>>({
  data,
  columns,
  loading = false,
  pagination,
  sorting,
  actions,
  emptyMessage = 'Нет данных для отображения',
  className = '',
}: TableProps<T>) => {
  const [localSorting, setLocalSorting] = useState<{
    field: keyof T | null;
    direction: 'asc' | 'desc';
  }>({
    field: sorting?.field || null,
    direction: sorting?.direction || 'asc',
  });

  useEffect(() => {
    if (sorting) {
      setLocalSorting({
        field: sorting.field,
        direction: sorting.direction,
      });
    }
  }, [sorting]);

  const handleSort = (field: keyof T) => {
    if (!columns.find(col => col.key === field)?.sortable) return;

    const newDirection = localSorting.field === field && localSorting.direction === 'asc' ? 'desc' : 'asc';
    
    setLocalSorting({
      field,
      direction: newDirection,
    });

    if (sorting?.onSort) {
      sorting.onSort(field, newDirection);
    }
  };

  const renderSortIcon = (field: keyof T) => {
    if (!columns.find(col => col.key === field)?.sortable) return null;

    if (localSorting.field === field) {
      return localSorting.direction === 'asc' ? (
        <ChevronUpIcon className="h-4 w-4" />
      ) : (
        <ChevronDownIcon className="h-4 w-4" />
      );
    }

    return (
      <div className="flex flex-col">
        <ChevronUpIcon className="h-3 w-3 text-gray-300" />
        <ChevronDownIcon className="h-3 w-3 text-gray-300 -mt-1" />
      </div>
    );
  };

  const renderTableHeader = () => (
    <thead className="bg-gray-50">
      <tr>
        {columns.map((column) => (
          <th
            key={String(column.key)}
            className={`px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider ${
              column.sortable ? 'cursor-pointer hover:bg-gray-100' : ''
            }`}
            style={{ width: column.width }}
            onClick={() => column.sortable && handleSort(column.key)}
          >
            <div className="flex items-center space-x-1">
              <span>{column.label}</span>
              {renderSortIcon(column.key)}
            </div>
          </th>
        ))}
        {actions && (
          <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
            Действия
          </th>
        )}
      </tr>
    </thead>
  );

  const renderTableBody = () => {
    if (loading) {
      return (
        <tbody className="bg-white divide-y divide-gray-200">
          {Array.from({ length: 5 }).map((_, index) => (
            <tr key={index} className="animate-pulse">
              {columns.map((column) => (
                <td key={String(column.key)} className="px-6 py-4 whitespace-nowrap">
                  <div className="skeleton h-4 w-3/4"></div>
                </td>
              ))}
              {actions && (
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div className="skeleton h-4 w-16"></div>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      );
    }

    if (data.length === 0) {
      return (
        <tbody className="bg-white">
          <tr>
            <td
              colSpan={columns.length + (actions ? 1 : 0)}
              className="px-6 py-8 text-center text-gray-500"
            >
              {emptyMessage}
            </td>
          </tr>
        </tbody>
      );
    }

    return (
      <tbody className="bg-white divide-y divide-gray-200">
        {data.map((row, index) => (
          <tr key={index} className="table-row">
            {columns.map((column) => (
              <td key={String(column.key)} className="px-6 py-4 whitespace-nowrap text-sm">
                {column.render ? column.render(row[column.key], row) : String(row[column.key])}
              </td>
            ))}
            {actions && (
              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                {actions(row)}
              </td>
            )}
          </tr>
        ))}
      </tbody>
    );
  };

  const renderPagination = () => {
    if (!pagination) return null;

    const { page, limit, total, pages, onPageChange, onLimitChange } = pagination;

    const getPageNumbers = () => {
      const pageNumbers = [];
      const maxVisible = 5;
      
      if (pages <= maxVisible) {
        for (let i = 1; i <= pages; i++) {
          pageNumbers.push(i);
        }
      } else {
        if (page <= 3) {
          pageNumbers.push(1, 2, 3, 4, '...', pages);
        } else if (page >= pages - 2) {
          pageNumbers.push(1, '...', pages - 3, pages - 2, pages - 1, pages);
        } else {
          pageNumbers.push(1, '...', page - 1, page, page + 1, '...', pages);
        }
      }
      
      return pageNumbers;
    };

    return (
      <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
        <div className="flex-1 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-700">Показать</span>
            <select
              value={limit}
              onChange={(e) => onLimitChange(Number(e.target.value))}
              className="form-input py-1 px-2 text-sm"
            >
              {[10, 25, 50, 100].map((size) => (
                <option key={size} value={size}>
                  {size}
                </option>
              ))}
            </select>
            <span className="text-sm text-gray-700">из {total}</span>
          </div>

          <div className="flex items-center space-x-2">
            <Button
              variant="secondary"
              size="sm"
              disabled={page === 1}
              onClick={() => onPageChange(page - 1)}
            >
              Назад
            </Button>

            <div className="flex space-x-1">
              {getPageNumbers().map((pageNumber, index) => (
                <React.Fragment key={index}>
                  {pageNumber === '...' ? (
                    <span className="px-3 py-1 text-gray-500">...</span>
                  ) : (
                    <Button
                      variant={pageNumber === page ? 'primary' : 'secondary'}
                      size="sm"
                      onClick={() => onPageChange(pageNumber as number)}
                    >
                      {pageNumber}
                    </Button>
                  )}
                </React.Fragment>
              ))}
            </div>

            <Button
              variant="secondary"
              size="sm"
              disabled={page === pages}
              onClick={() => onPageChange(page + 1)}
            >
              Вперед
            </Button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className={`overflow-hidden shadow ring-1 ring-black ring-opacity-5 rounded-lg ${className}`}>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          {renderTableHeader()}
          {renderTableBody()}
        </table>
      </div>
      {renderPagination()}
    </div>
  );
};

export default Table;