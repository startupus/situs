import React from 'react';

const Avatar6 = () => {
  return (
    <>
      <section className='bg-white dark:bg-dark py-[75px]'>
        <div className='mx-auto px-4 sm:container'>
          <div className='flex items-end justify-center space-x-2 sm:space-x-5'>
            <AvatarItem
              img='https://cdn.tailgrids.com/2.0/image/dashboard/images/avatar/image-01.jpg'
              size='6'
              bulletSize='[7px]'
              bulletPosition='0.5'
              border='border'
              active
            />
            <AvatarItem
              img='https://cdn.tailgrids.com/2.0/image/dashboard/images/avatar/image-02.jpg'
              size='[38px]'
              bulletSize='3'
              bulletPosition='1'
              border='border-2'
              active
            />
            <AvatarItem
              img='https://cdn.tailgrids.com/2.0/image/dashboard/images/avatar/image-03.jpg'
              size='[42px]'
              bulletSize='[13px]'
              bulletPosition='[6px]'
              border='border-[2.3px]'
              active
            />
            <AvatarItem
              img='https://cdn.tailgrids.com/2.0/image/dashboard/images/avatar/image-04.jpg'
              size='[52px]'
              bulletSize='[15px]'
              bulletPosition='[6px]'
              border='border-[2.7px]'
            />
            <AvatarItem
              img='https://cdn.tailgrids.com/2.0/image/dashboard/images/avatar/image-05.jpg'
              size='20'
              bulletSize='[18px]'
              bulletPosition='2'
              border='border-[3px]'
              active
            />
          </div>
        </div>
      </section>
    </>
  )
}

export default Avatar6

const AvatarItem = ({ img, size, bulletSize, bulletPosition, active, border }) => {
  // Преобразовать размер в фиксированные классы с защитой от сжатия
  const getSizeClasses = (size) => {
    const sizeMap = {
      '6': 'h-6 w-6 min-h-[24px] min-w-[24px]',
      '[38px]': 'h-[38px] w-[38px] min-h-[38px] min-w-[38px]',
      '[42px]': 'h-[42px] w-[42px] min-h-[42px] min-w-[42px]',
      '[52px]': 'h-[52px] w-[52px] min-h-[52px] min-w-[52px]',
      '20': 'h-20 w-20 min-h-[80px] min-w-[80px]'
    };
    return sizeMap[size] || 'h-10 w-10 min-h-[40px] min-w-[40px]';
  };

  // Преобразовать размер bullet в фиксированные классы
  const getBulletSizeClasses = (bulletSize) => {
    const bulletMap = {
      '[7px]': 'h-[7px] w-[7px]',
      '3': 'h-3 w-3',
      '[13px]': 'h-[13px] w-[13px]',
      '[15px]': 'h-[15px] w-[15px]',
      '[18px]': 'h-[18px] w-[18px]'
    };
    return bulletMap[bulletSize] || 'h-2 w-2';
  };

  // Преобразовать позицию bullet в фиксированные классы
  const getBulletPositionClasses = (bulletPosition) => {
    const positionMap = {
      '0.5': '-top-0.5 -right-0.5',
      '1': '-top-1 -right-1',
      '[6px]': '-top-[6px] -right-[6px]',
      '2': '-top-2 -right-2'
    };
    return positionMap[bulletPosition] || '-top-1 -right-1';
  };

  return (
    <div className={`${getSizeClasses(size)} relative flex-shrink-0`}>
      <img
        src={img}
        alt='avatar'
        className='h-full w-full object-cover object-center'
      />
      <span
        className={`${active ? 'bg-[#219653]' : 'bg-[#DC3545]'} absolute ${getBulletPositionClasses(bulletPosition)} block ${getBulletSizeClasses(bulletSize)} rounded-full ${border} border-white dark:border-dark`}
      ></span>
    </div>
  )
}

