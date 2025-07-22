/**
 * SubmitButton - SettingsPage2 компонент
 * 
 * Адаптировано из TailGrids Pro для редактора Редактус
 * Категория: DashboardComponents
 * Подкатегория: SettingsPage2
 * 
 * @component
 * @example
 * <SubmitButton 
 *   children="value"
 * />
 */

import React from 'react';

interface SubmitButtonProps {
  children: string;
}

const SubmitButton: React.FC<SubmitButtonProps> = ({children}) => {
  return (
    <div>
      <button className='flex h-11 w-full items-center justify-center rounded-md bg-primary text-base font-semibold text-white hover:bg-primary/90'>
        {children}
      </button>
    </div>
  )
}

export default SubmitButton
