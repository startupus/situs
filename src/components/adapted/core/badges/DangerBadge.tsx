/**
 * DangerBadge - Badges компонент
 * 
 * Адаптировано из TailGrids Pro для редактора Редактус
 * Категория: CoreComponents
 * Подкатегория: Badges
 * 
 * @component
 * @example
 * <DangerBadge 
 *   children="value"
 *   outline="value"
 *   roundedFull="value"
 *   roundedLg="value"
 *   roundedNone="value"
 *   roundedSm="value"
 *   roundedMd="value"
 *   bgOpacity="value"
 * />
 */

import React from 'react';

interface DangerBadgeProps {
  children: string;
  outline: string;
  roundedFull: string;
  roundedLg: string;
  roundedNone: string;
  roundedSm: string;
  roundedMd: string;
  bgOpacity: string;
}

const DangerBadge: React.FC<DangerBadgeProps> = () => {
  return (
    <div className='flex flex-wrap items-center gap-4'>
      <BadgesItem roundedMd>Danger</BadgesItem>
      <BadgesItem outline roundedMd>
        Danger
      </BadgesItem>
      <BadgesItem roundedFull>Danger</BadgesItem>
      <BadgesItem outline roundedFull>
        Danger
      </BadgesItem>
      <BadgesItem roundedFull bgOpacity>
        Danger
      </BadgesItem>
      <BadgesItem bgOpacity>
        Danger
      </BadgesItem>
    </div>
  )
}

export default DangerBadge

const BadgesItem = ({
  children,
  outline,
  roundedFull,
  roundedLg,
  roundedNone,
  roundedSm,
  roundedMd,
  bgOpacity,
}) => {
  return (
    <div className="redaktus-component" data-component-type="dangerbadge">
    <span
      className={`inline-block rounded py-1 px-2.5 text-xs font-medium ${
        outline
          ? `border ${
              (roundedFull && `rounded-full`) ||
              (roundedLg && `rounded-lg`) ||
              (roundedNone && `rounded-none`) ||
              (roundedSm && `rounded-xs`) ||
              (roundedMd && `rounded-md`) ||
              (bgOpacity && `bg-red-dark/10`)
            } border-red-dark text-red-dark`
          : `bg-red-dark ${
              (roundedFull && `rounded-full`) ||
              (roundedLg && `rounded-lg`) ||
              (roundedNone && `rounded-none`) ||
              (roundedSm && `rounded-xs`) ||
              (roundedMd && `rounded-md`) ||
              (bgOpacity && `bg-red-dark/10`)
            } text-white`
      } ${bgOpacity && 'bg-red-dark/10 text-red-dark!'}
`}
    >
      {children}
    </span>
  )
}