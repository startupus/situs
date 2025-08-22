import React, { useState } from 'react'

const Switcher1 = () => {
  const [isChecked, setIsChecked] = useState(false)

  const handleCheckboxChange = () => {
    setIsChecked(!isChecked)
  }

  return (
    <>
      <label className='flex cursor-pointer select-none items-center'>
        <div className='relative'>
          <input
            type='checkbox'
            checked={isChecked}
            onChange={handleCheckboxChange}
            className='sr-only'
          />
          <div className={`block h-8 w-14 rounded-full transition ${isChecked ? 'bg-primary' : 'bg-[#E5E7EB] dark:bg-dark-3'}`}></div>
          <div className={`absolute left-1 top-1 h-6 w-6 rounded-full bg-white transition-transform duration-300 ${isChecked ? 'translate-x-6' : 'translate-x-0'}`}></div>
        </div>
      </label>
    </>
  )
}

export default Switcher1