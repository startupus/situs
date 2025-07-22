/**
 * SuccessBadge - Badges компонент
 * 
 * Адаптировано из TailGrids Pro для редактора Редактус
 * Категория: CoreComponents
 * Подкатегория: Badges
 * 
 * @component
 * @example
 * <SuccessBadge 
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

interface SuccessBadgeProps {
  children: string;
  outline: string;
  roundedFull: string;
  roundedLg: string;
  roundedNone: string;
  roundedSm: string;
  roundedMd: string;
  bgOpacity: string;
}

const SuccessBadge: React.FC<SuccessBadgeProps> = () => {
  return (
    <div className='flex flex-wrap items-center gap-4'>
      <BadgesItem roundedMd>Success</BadgesItem>
      <BadgesItem outline roundedMd>
        Success
      </BadgesItem>
      <BadgesItem roundedFull>Success</BadgesItem>
      <BadgesItem outline roundedFull>
        Success
      </BadgesItem>
      <BadgesItem roundedFull bgOpacity>
        Success
      </BadgesItem>
      <BadgesItem bgOpacity>
        Success
      </BadgesItem>
    </div>
  )
}

export default SuccessBadge

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
    <div className="redaktus-component" data-component-type="successbadge">
    <span
      className={`inline-block rounded py-1 px-2.5 text-xs font-medium ${
        outline
          ? `border ${
              (roundedFull && `rounded-full`) ||
              (roundedLg && `rounded-lg`) ||
              (roundedNone && `rounded-none`) ||
              (roundedSm && `rounded-xs`) ||
              (roundedMd && `rounded-md`) ||
              (bgOpacity && `bg-green-dark/10`)
            } border-green-dark text-green-dark`
          : `bg-green-dark ${
              (roundedFull && `rounded-full`) ||
              (roundedLg && `rounded-lg`) ||
              (roundedNone && `rounded-none`) ||
              (roundedSm && `rounded-xs`) ||
              (roundedMd && `rounded-md`) ||
              (bgOpacity && `bg-green-dark/10`)
            } text-white`
      } ${bgOpacity && 'bg-green-dark/10! text-green-dark!'}
`}
    >
      {children}
    </span>
  )
}