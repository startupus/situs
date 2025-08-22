import React from 'react';

const Avatar3 = () => {
  return (
    <>
      <section className='bg-white dark:bg-dark py-[75px]'>
        <div className='mx-auto px-4 sm:container'>
          <div className='flex items-end justify-center space-x-2 sm:space-x-5'>
            <AvatarItem
              img='https://cdn.tailgrids.com/2.0/image/dashboard/images/avatar/image-01.jpg'
              size='6'
            />
            <AvatarItem
              img='https://cdn.tailgrids.com/2.0/image/dashboard/images/avatar/image-02.jpg'
              size='[38px]'
            />
            <AvatarItem
              img='https://cdn.tailgrids.com/2.0/image/dashboard/images/avatar/image-03.jpg'
              size='[42px]'
            />
            <AvatarItem
              img='https://cdn.tailgrids.com/2.0/image/dashboard/images/avatar/image-04.jpg'
              size='[52px]'
            />
            <AvatarItem
              img='https://cdn.tailgrids.com/2.0/image/dashboard/images/avatar/image-05.jpg'
              size='20'
            />
          </div>
        </div>
      </section>
    </>
  )
}

export default Avatar3

const AvatarItem = ({img, size}: {img: string; size: string}) => {
  // Преобразовать размер в фиксированные классы с защитой от сжатия
  const getSizeClasses = (size: string) => {
    const sizeMap = {
      '6': 'h-6 w-6 min-h-[24px] min-w-[24px]',
      '[38px]': 'h-[38px] w-[38px] min-h-[38px] min-w-[38px]',
      '[42px]': 'h-[42px] w-[42px] min-h-[42px] min-w-[42px]',
      '[52px]': 'h-[52px] w-[52px] min-h-[52px] min-w-[52px]',
      '20': 'h-20 w-20 min-h-[80px] min-w-[80px]'
    };
    return sizeMap[size] || 'h-10 w-10 min-h-[40px] min-w-[40px]';
  };

  return (
    <div className={`${getSizeClasses(size)} rounded-sm flex-shrink-0`}>
      <img
        src={img}
        alt='avatar'
        className='h-full w-full rounded-sm object-cover object-center'
      />
    </div>
  )
}
