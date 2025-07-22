/**
 * Switcher9 - Switcher компонент
 * 
 * Адаптировано из TailGrids Pro для редактора Редактус
 * Категория: CoreComponents
 * Подкатегория: Switcher
 * 
 * @component
 * @example
 * <Switcher9 
 *   
 * />
 */

import React from 'react';

const Switcher9 = () => {
  const [isChecked, setIsChecked] = useState(false)

  const handleCheckboxChange = () => {
    setIsChecked(!isChecked)
  }

  return (
    <div className="redaktus-component" data-component-type="switcher9">
    <>
      <label className='flex cursor-pointer select-none items-center'>
        <div className='relative'>
          <input
            type='checkbox'
            checked={isChecked}
            onChange={handleCheckboxChange}
            className='sr-only'
          />
          <div className='block h-8 w-14 rounded-full bg-[#EAEEFB]'></div>
          <div className='dot absolute left-1 top-1 flex h-6 w-6 items-center justify-center rounded-full bg-white transition'>
            <span
              className={`h-3 w-3 rounded-full ${
                isChecked ? 'bg-white' : 'bg-primary'
              }`}
            ></span>
          </div>
        </div>
      </label>
    </>
  )
}

export default Switcher9
