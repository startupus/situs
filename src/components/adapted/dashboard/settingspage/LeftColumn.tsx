/**
 * LeftColumn - SettingsPage компонент
 * 
 * Адаптировано из TailGrids Pro для редактора Редактус
 * Категория: DashboardComponents
 * Подкатегория: SettingsPage
 * 
 * @component
 * @example
 * <LeftColumn 
 *   title="value"
 *   children="value"
 * />
 */

import React from 'react';

interface LeftColumnProps {
  title: string;
  children: string;
}

const LeftColumn: React.FC<LeftColumnProps> = ({ title, children }) => {
  return (
    <div className='w-full px-4 lg:w-7/12 2xl:w-2/3'>
      <div className='mb-8 rounded-lg border border-stroke bg-white lg:mb-0'>
        <h3 className='border-b border-stroke py-4 px-7 text-base font-medium text-black'>
          {title}
        </h3>
        <div className='p-7'>
          <form>
            <div className='-mx-3 flex flex-wrap'>{children}</div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default LeftColumn;
