import React from 'react';

const InputGroup = ({labelTitle, type, placeholder, value, name, email }) => {
  return (
    <div className='mb-[30px]'>
      <label
        htmlFor=''
        className='mb-[10px] block text-base font-medium text-black'
      >
        {labelTitle}
      </label>
      <div className='relative'>
        <input
          type='text'
          placeholder={placeholder}
          defaultValue={value}
          className='h-[46px] w-full rounded-md border border-[#E0E0E0] pl-12 pr-5 text-base text-black outline-hidden focus:border-primary'
        />
        <span className='absolute left-[18px] top-1/2 -translate-y-1/2'>
          {name && (
            <svg
              width={20}
              height={20}
              viewBox='0 0 20 20'
              fill='none'
              xmlns='http://www.w3.org/2000/svg'
            >
              <g opacity={0.8}>
                <path
                  fillRule='evenodd'
                  clipRule='evenodd'
                  d='M3.72039 12.8864C4.50179 12.105 5.5616 11.666 6.66667 11.666H13.3333C14.4384 11.666 15.4982 12.105 16.2796 12.8864C17.061 13.6678 17.5 14.7276 17.5 15.8327V17.4993C17.5 17.9596 17.1269 18.3327 16.6667 18.3327C16.2064 18.3327 15.8333 17.9596 15.8333 17.4993V15.8327C15.8333 15.1696 15.5699 14.5338 15.1011 14.0649C14.6323 13.5961 13.9964 13.3327 13.3333 13.3327H6.66667C6.00363 13.3327 5.36774 13.5961 4.8989 14.0649C4.43006 14.5338 4.16667 15.1696 4.16667 15.8327V17.4993C4.16667 17.9596 3.79357 18.3327 3.33333 18.3327C2.8731 18.3327 2.5 17.9596 2.5 17.4993V15.8327C2.5 14.7276 2.93899 13.6678 3.72039 12.8864Z'
                  fill='#637381'
                />
                <path
                  fillRule='evenodd'
                  clipRule='evenodd'
                  d='M9.9987 3.33268C8.61799 3.33268 7.4987 4.45197 7.4987 5.83268C7.4987 7.21339 8.61799 8.33268 9.9987 8.33268C11.3794 8.33268 12.4987 7.21339 12.4987 5.83268C12.4987 4.45197 11.3794 3.33268 9.9987 3.33268ZM5.83203 5.83268C5.83203 3.5315 7.69751 1.66602 9.9987 1.66602C12.2999 1.66602 14.1654 3.5315 14.1654 5.83268C14.1654 8.13387 12.2999 9.99935 9.9987 9.99935C7.69751 9.99935 5.83203 8.13387 5.83203 5.83268Z'
                  fill='#637381'
                />
              </g>
            </svg>
          )}
          {email && (
            <svg
              width={20}
              height={20}
              viewBox='0 0 20 20'
              fill='none'
              xmlns='http://www.w3.org/2000/svg'
            >
              <g opacity={0.8}>
                <path
                  fillRule='evenodd'
                  clipRule='evenodd'
                  d='M3.33203 4.16667C2.8756 4.16667 2.4987 4.54357 2.4987 5V15C2.4987 15.4564 2.8756 15.8333 3.33203 15.8333H16.6654C17.1218 15.8333 17.4987 15.4564 17.4987 15V5C17.4987 4.54357 17.1218 4.16667 16.6654 4.16667H3.33203ZM0.832031 5C0.832031 3.6231 1.95513 2.5 3.33203 2.5H16.6654C18.0423 2.5 19.1654 3.6231 19.1654 5V15C19.1654 16.3769 18.0423 17.5 16.6654 17.5H3.33203C1.95513 17.5 0.832031 16.3769 0.832031 15V5Z'
                  fill='#637381'
                />
                <path
                  fillRule='evenodd'
                  clipRule='evenodd'
                  d='M0.982743 4.52154C1.24667 4.14449 1.76628 4.0528 2.14332 4.31673L9.99877 9.81554L17.8542 4.31673C18.2313 4.0528 18.7509 4.14449 19.0148 4.52154C19.2787 4.89858 19.187 5.41818 18.81 5.68211L10.4767 11.5154C10.1897 11.7163 9.80782 11.7163 9.52088 11.5154L1.18755 5.68211C0.81051 5.41818 0.718814 4.89858 0.982743 4.52154Z'
                  fill='#637381'
                />
              </g>
            </svg>
          )}
        </span>
      </div>
    </div>
  )
}

export default InputGroup;
