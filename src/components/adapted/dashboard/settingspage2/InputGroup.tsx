/**
 * InputGroup - SettingsPage2 компонент
 * 
 * Адаптировано из TailGrids Pro для редактора Редактус
 * Категория: DashboardComponents
 * Подкатегория: SettingsPage2
 * 
 * @component
 * @example
 * <InputGroup 
 *   labelTitle="value"
 *   type="value"
 *   placeholder="value"
 *   value="value"
 * />
 */

import React from 'react';

interface InputGroupProps {
  labelTitle: string;
  type: string;
  placeholder: string;
  value: string;
}

const InputGroup: React.FC<InputGroupProps> = ({labelTitle, type, placeholder, value }) => {
  return (
    <div className='mb-5'>
      <label className='mb-3 block text-base font-medium text-black'>
        {labelTitle}
      </label>
      <div className='relative'>
        <input
          type={type}
          placeholder={placeholder}
          defaultValue={value}
          className='h-[50px] w-full rounded-sm border border-stroke px-[22px] text-base text-black outline-hidden focus:border-primary'
        />
      </div>
    </div>
  )
}

export default InputGroup;
