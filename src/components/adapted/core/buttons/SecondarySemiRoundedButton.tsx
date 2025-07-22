/**
 * SecondarySemiRoundedButton - Buttons компонент
 * 
 * Адаптировано из TailGrids Pro для редактора Редактус
 * Категория: CoreComponents
 * Подкатегория: Buttons
 * 
 * @component
 * @example
 * <SecondarySemiRoundedButton 
 *   
 * />
 */

import React from 'react';

const SecondarySemiRoundedButton = () => {
  return (
    <div className="redaktus-component" data-component-type="secondarysemiroundedbutton">
    <button className='bg-secondary border-secondary border rounded-md inline-flex items-center justify-center py-3 px-7 text-center text-base font-medium text-white hover:bg-[#0BB489] hover:border-[#0BB489] disabled:bg-gray-3 disabled:border-gray-3 disabled:text-dark-5'>
      Button
    </button>
  )
}

export default SecondarySemiRoundedButton