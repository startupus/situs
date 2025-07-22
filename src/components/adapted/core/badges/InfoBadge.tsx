/**
 * InfoBadge - Badges компонент
 * 
 * Адаптировано из TailGrids Pro для редактора Редактус
 * Категория: CoreComponents
 * Подкатегория: Badges
 * 
 * @component
 * @example
 * <InfoBadge 
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

interface InfoBadgeProps {
  children: string;
  outline: string;
  roundedFull: string;
  roundedLg: string;
  roundedNone: string;
  roundedSm: string;
  roundedMd: string;
  bgOpacity: string;
}

const InfoBadge: React.FC<InfoBadgeProps> = () => {
  return (
    <div className='flex flex-wrap items-center gap-4'>
      <BadgesItem roundedMd>Info</BadgesItem>
      <BadgesItem outline roundedMd>
        Info
      </BadgesItem>
      <BadgesItem roundedFull>Info</BadgesItem>
      <BadgesItem outline roundedFull>
        Info
      </BadgesItem>
      <BadgesItem roundedFull bgOpacity>
        Info
      </BadgesItem>
      <BadgesItem bgOpacity>
        Info
      </BadgesItem>
    </div>
  )
}

export default InfoBadge

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
    <div className="redaktus-component" data-component-type="infobadge">
    <span
      className={`inline-block rounded py-1 px-2.5 text-xs font-medium ${
        outline
          ? `border ${
              (roundedFull && `rounded-full`) ||
              (roundedLg && `rounded-lg`) ||
              (roundedNone && `rounded-none`) ||
              (roundedSm && `rounded-xs`) ||
              (roundedMd && `rounded-md`) ||
              (bgOpacity && `bg-cyan/10`)
            } border-cyan text-cyan`
          : `bg-cyan ${
              (roundedFull && `rounded-full`) ||
              (roundedLg && `rounded-lg`) ||
              (roundedNone && `rounded-none`) ||
              (roundedSm && `rounded-xs`) ||
              (roundedMd && `rounded-md`) ||
              (bgOpacity && `bg-cyan/10`)
            } text-white`
      } ${bgOpacity && 'bg-cyan/10 text-cyan'}
`}
    >
      {children}
    </span>
  )
}
