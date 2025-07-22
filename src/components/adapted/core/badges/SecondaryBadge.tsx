/**
 * SecondaryBadge - Badges компонент
 * 
 * Адаптировано из TailGrids Pro для редактора Редактус
 * Категория: CoreComponents
 * Подкатегория: Badges
 * 
 * @component
 * @example
 * <SecondaryBadge 
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

interface SecondaryBadgeProps {
  children: string;
  outline: string;
  roundedFull: string;
  roundedLg: string;
  roundedNone: string;
  roundedSm: string;
  roundedMd: string;
  bgOpacity: string;
}

const SecondaryBadge: React.FC<SecondaryBadgeProps> = () => {
  return (
    <div className='flex flex-wrap items-center gap-4'>
      <BadgesItem roundedMd>Secondary</BadgesItem>
      <BadgesItem outline roundedMd>
        Secondary
      </BadgesItem>
      <BadgesItem roundedFull>Secondary</BadgesItem>
      <BadgesItem outline roundedFull>
        Secondary
      </BadgesItem>
      <BadgesItem roundedFull bgOpacity>
        Secondary
      </BadgesItem>
      <BadgesItem bgOpacity>
        Secondary
      </BadgesItem>
    </div>
  )
}

export default SecondaryBadge

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
    <div className="redaktus-component" data-component-type="secondarybadge">
    <span
      className={`inline-block rounded py-1 px-2.5 text-xs font-medium ${
        outline
          ? `border ${
              (roundedFull && `rounded-full`) ||
              (roundedLg && `rounded-lg`) ||
              (roundedNone && `rounded-none`) ||
              (roundedSm && `rounded-xs`) ||
              (roundedMd && `rounded-md`) ||
              (bgOpacity && `bg-secondary/10`)
            } border-secondary text-secondary`
          : `bg-secondary ${
              (roundedFull && `rounded-full`) ||
              (roundedLg && `rounded-lg`) ||
              (roundedNone && `rounded-none`) ||
              (roundedSm && `rounded-xs`) ||
              (roundedMd && `rounded-md`) ||
              (bgOpacity && `bg-secondary/10`)
            } text-white`
      } ${bgOpacity && 'bg-secondary/10 text-secondary!'}
`}
    >
      {children}
    </span>
  )
}