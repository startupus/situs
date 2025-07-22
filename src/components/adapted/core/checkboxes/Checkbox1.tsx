/**
 * Checkbox1 - Checkboxes компонент
 * 
 * Адаптировано из TailGrids Pro для редактора Редактус
 * Категория: CoreComponents
 * Подкатегория: Checkboxes
 * 
 * @component
 * @example
 * <Checkbox1 
 *   
 * />
 */

import React from 'react';

const Checkbox1 = () => {
  const [isChecked, setIsChecked] = useState(false)

  const handleCheckboxChange = () => {
    setIsChecked(!isChecked)
  }

  return (
    <div className="redaktus-component" data-component-type="checkbox1">
    <label className='flex items-center cursor-pointer select-none text-dark dark:text-white'>
      <div className='relative'>
        <input
          type='checkbox'
          checked={isChecked}
          onChange={handleCheckboxChange}
          className='sr-only'
        />
        <div className='box mr-4 flex h-5 w-5 items-center justify-center rounded-sm border-stroke dark:border-dark-3 border'>
          <span className={`dot h-[10px] w-[10px] rounded-xs ${isChecked && 'bg-primary'}`}></span>
        </div>
      </div>
      Checkbox Text
    </label>
  )
}

export default Checkbox1