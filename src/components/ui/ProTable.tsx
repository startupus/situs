import React, { ReactNode } from 'react';

interface ProTableColumn {
  key: string;
  title: string;
  width?: string;
  align?: 'left' | 'center' | 'right';
  render?: (value: any, record: any, index: number) => ReactNode;
}

interface ProTableProps {
  columns: ProTableColumn[];
  data: any[];
  loading?: boolean;
  className?: string;
  onRowClick?: (record: any, index: number) => void;
}

const ProTable: React.FC<ProTableProps> = ({ columns, data, loading = false, className = '', onRowClick }) => {
  const getThStyle = (column: ProTableColumn) => {
    const baseStyle = 'border-l border-transparent py-4 px-3 text-lg font-medium text-white lg:py-7 lg:px-4';
    const widthStyle = column.width ? column.width : 'w-1/6 min-w-[160px]';
    const alignStyle =
      column.align === 'center' ? 'text-center' : column.align === 'right' ? 'text-right' : 'text-left';
    return `${baseStyle} ${widthStyle} ${alignStyle}`;
  };

  const getTdStyle = (column: ProTableColumn, isEven: boolean) => {
    const baseStyle = 'text-dark border-b border-l border-[#E8E8E8] dark:border-dark py-5 px-2 text-base font-medium';
    const bgStyle = isEven
      ? 'bg-[#F3F6FF] dark:bg-dark-3 dark:text-dark-7'
      : 'bg-white dark:bg-dark-2 dark:text-dark-7';
    const alignStyle =
      column.align === 'center' ? 'text-center' : column.align === 'right' ? 'text-right' : 'text-left';
    return `${baseStyle} ${bgStyle} ${alignStyle}`;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <section className={`bg-white dark:bg-dark ${className}`}>
      <div className="w-full">
        <div className="max-w-full overflow-x-auto">
          <table className="w-full table-auto">
            <thead className="text-center bg-primary">
              <tr>
                {columns.map((column) => (
                  <th key={column.key} className={getThStyle(column)}>
                    {column.title}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {data.map((record, index) => (
                <tr
                  key={index}
                  className={onRowClick ? 'cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700' : ''}
                  onClick={() => onRowClick?.(record, index)}
                >
                  {columns.map((column) => (
                    <td key={column.key} className={getTdStyle(column, index % 2 === 0)}>
                      {column.render ? column.render(record[column.key], record, index) : record[column.key]}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
};

export default ProTable;
