/**
 * ProgressBar1 - Progress компонент
 * 
 * Адаптировано из TailGrids Pro для редактора Редактус
 * Категория: CoreComponents
 * Подкатегория: Progress
 * 
 * @component
 * @example
 * <ProgressBar1 
 *   
 * />
 */

import React from 'react';

const ProgressBar1 = () => {
  return (
    <div className="redaktus-component" data-component-type="progressbar1">
    <div className='w-full px-4 lg:w-5/12'>
      <div className='mb-8'>
        <div className='bg-stroke dark:bg-dark-3 relative h-2.5 w-full rounded-2xl'>
          <div className='bg-primary absolute top-0 left-0 h-full w-1/2 rounded-2xl'></div>
        </div>
      </div>
      <div className='mb-8'>
        <div className='bg-stroke dark:bg-dark-3 relative h-2.5 w-full rounded-2xl'>
          <div className='bg-primary absolute top-0 left-0 h-full w-[75%] rounded-2xl'></div>
        </div>
      </div>
      <div className='mb-8'>
        <div className='bg-stroke dark:bg-dark-3 relative h-2.5 w-full rounded-2xl'>
          <div className='bg-primary absolute top-0 left-0 h-full w-[90%] rounded-2xl'></div>
        </div>
      </div>
    </div>
  )
}

export default ProgressBar1