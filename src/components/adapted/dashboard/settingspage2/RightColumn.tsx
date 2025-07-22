/**
 * RightColumn - SettingsPage2 компонент
 * 
 * Адаптировано из TailGrids Pro для редактора Редактус
 * Категория: DashboardComponents
 * Подкатегория: SettingsPage2
 * 
 * @component
 * @example
 * <RightColumn 
 *   title="value"
 *   children="value"
 * />
 */

import React from 'react';

interface RightColumnProps {
  title: string;
  children: string;
}

const RightColumn: React.FC<RightColumnProps> = ({ title, children }) => {
  return (
    <div className='w-full px-5 md:w-1/2'>
      <div className='rounded-lg border border-stroke bg-white p-7 shadow-two sm:p-10 md:p-7 lg:p-10'>
        <h3 className='mb-7 text-2xl font-semibold text-black'>{title}</h3>
        <form>
          {children}
        </form>
      </div>
    </div>
  )
}

export default RightColumn;
