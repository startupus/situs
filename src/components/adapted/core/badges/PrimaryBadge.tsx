/**
 * PrimaryBadge - Badges компонент
 * 
 * Адаптировано из TailGrids Pro для редактора Редактус
 * Категория: CoreComponents
 * Подкатегория: Badges
 * 
 * @component
 * @example
 * <PrimaryBadge 
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

interface PrimaryBadgeProps {
  children: string;
  outline: string;
  roundedFull: string;
  roundedLg: string;
  roundedNone: string;
  roundedSm: string;
  roundedMd: string;
  bgOpacity: string;
}

const PrimaryBadge: React.FC<PrimaryBadgeProps> = () => {
  return (
    <div className='flex flex-wrap items-center gap-4'>
      <BadgesItem roundedMd>Primary</BadgesItem>
      <BadgesItem outline roundedMd>
        Primary
      </BadgesItem>
      <BadgesItem roundedFull>Primary</BadgesItem>
      <BadgesItem outline roundedFull>
        Primary
      </BadgesItem>
      <BadgesItem roundedFull bgOpacity>
        Primary
      </BadgesItem>
      <BadgesItem bgOpacity>
        Primary
      </BadgesItem>
    </div>
  )
}

export default PrimaryBadge

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
    <div className="redaktus-component" data-component-type="primarybadge">
    <span
      className={`inline-block rounded py-1 px-2.5 text-xs font-medium ${
        outline
          ? `border ${
              (roundedFull && `rounded-full`) ||
              (roundedLg && `rounded-lg`) ||
              (roundedNone && `rounded-none`) ||
              (roundedSm && `rounded-xs`) ||
              (roundedMd && `rounded-md`) ||
              (bgOpacity && `bg-info/10`)
            } border-primary text-primary`
          : `bg-primary ${
              (roundedFull && `rounded-full`) ||
              (roundedLg && `rounded-lg`) ||
              (roundedNone && `rounded-none`) ||
              (roundedSm && `rounded-xs`) ||
              (roundedMd && `rounded-md`) ||
              (bgOpacity && `bg-primary/10`)
            } text-white`
      } ${bgOpacity && 'bg-primary/10 text-primary!'}
`}
    >
      {children}
    </span>
  )
}