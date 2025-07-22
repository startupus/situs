/**
 * Avatar8 - Avatar компонент
 * 
 * Адаптировано из TailGrids Pro для редактора Редактус
 * Категория: CoreComponents
 * Подкатегория: Avatar
 * 
 * @component
 * @example
 * <Avatar8 
 *   img="value"
 * />
 */

import React from 'react';

interface Avatar8Props {
  img: string;
}

const Avatar8: React.FC<Avatar8Props> = () => {
  return (
    <>
      <section className='bg-white dark:bg-dark py-[75px]'>
        <div className='mx-auto px-4 sm:container'>
          <div className='flex items-end justify-center'>
            <AvatarItem img='https://cdn.tailgrids.com/2.0/image/dashboard/images/avatar/image-01.jpg' />
            <AvatarItem img='https://cdn.tailgrids.com/2.0/image/dashboard/images/avatar/image-02.jpg' />
            <AvatarItem img='https://cdn.tailgrids.com/2.0/image/dashboard/images/avatar/image-03.jpg' />
            <AvatarItem img='https://cdn.tailgrids.com/2.0/image/dashboard/images/avatar/image-04.jpg' />
            <AvatarItem img='https://cdn.tailgrids.com/2.0/image/dashboard/images/avatar/image-05.jpg' />
          </div>
        </div>
      </section>
    </>
  )
}

export default Avatar8

const AvatarItem = ({ img }) => {
  return (
    <div className="redaktus-component" data-component-type="avatar8">
    <div className='group group-first:ml-0 -ml-4 h-[50px] w-[50px] rounded-full border-4 border-white dark:border-dark-3'>
      <img
        src={img}
        alt={props.imageAlt || "avatar"}
        className='h-full w-full rounded-full object-cover object-center'
      />
    </div>
  )
}

