/**
 * Switcher8 - Switcher компонент
 * 
 * Адаптировано из TailGrids Pro для редактора Редактус
 * Категория: CoreComponents
 * Подкатегория: Switcher
 * 
 * @component
 * @example
 * <Switcher8 
 *   
 * />
 */

import React from 'react';

const Switcher8 = () => {
  const [isChecked, setIsChecked] = useState(false)

  const handleCheckboxChange = () => {
    setIsChecked(!isChecked)
  }

  return (
    <div className="redaktus-component" data-component-type="switcher8">
    <>
      <label className='flex cursor-pointer select-none items-center'>
        <div className='relative'>
          <input
            type='checkbox'
            checked={isChecked}
            onChange={handleCheckboxChange}
            className='sr-only'
          />
          <div
            className={`box h-5 w-14 rounded-full shadow-inner transition  ${
              isChecked ? 'bg-[#EAEEFB]' : 'bg-dark'
            }`}
          ></div>
          <div className='dot shadow-switch-1 absolute left-0 -top-1 flex h-7 w-7 items-center justify-center rounded-full bg-white transition'>
            <span
              className={`active h-4 w-4 rounded-full border  ${
                isChecked ? 'bg-primary border-white' : 'bg-white border-dark'
              }`}
            ></span>
          </div>
        </div>
      </label>
    </>
  )
}

export default Switcher8
