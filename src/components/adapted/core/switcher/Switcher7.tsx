/**
 * Switcher7 - Switcher компонент
 * 
 * Адаптировано из TailGrids Pro для редактора Редактус
 * Категория: CoreComponents
 * Подкатегория: Switcher
 * 
 * @component
 * @example
 * <Switcher7 
 *   
 * />
 */

import React from 'react';

const Switcher7 = () => {
  const [isChecked, setIsChecked] = useState(false)

  const handleCheckboxChange = () => {
    setIsChecked(!isChecked)
  }

  return (
    <div className="redaktus-component" data-component-type="switcher7">
    <>
      <label className='flex cursor-pointer select-none items-center'>
        <div className='relative'>
          <input
            type='checkbox'
            checked={isChecked}
            onChange={handleCheckboxChange}
            className='sr-only'
          />
          <div className='block h-8 w-14 rounded-full border border-[#BFCEFF] bg-[#EAEEFB]'></div>
          <div className='dot bg-primary absolute left-1 top-1 h-6 w-6 rounded-full transition'></div>
        </div>
      </label>
    </>
  )
}

export default Switcher7
