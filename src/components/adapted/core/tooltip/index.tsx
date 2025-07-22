/**
 * index - Tooltip компонент
 * 
 * Адаптировано из TailGrids Pro для редактора Редактус
 * Категория: CoreComponents
 * Подкатегория: Tooltip
 * 
 * @component
 * @example
 * <index 
 *   children="value"
 *   tooltipsText="value"
 *   primary="value"
 *   secondary="value"
 *   gray="value"
 *   dark="value"
 *   warning="value"
 *   danger="value"
 *   success="value"
 *   info="value"
 *   position="value"
 * />
 */

import React from 'react';

interface indexProps {
  children: string;
  tooltipsText: string;
  primary: string;
  secondary: string;
  gray: string;
  dark: string;
  warning: string;
  danger: string;
  success: string;
  info: string;
  position?: string;
}

const Tooltip = ({
  children,
  tooltipsText,
  primary,
  secondary,
  gray,
  dark,
  warning,
  danger,
  success,
  info,
  position = 'top',
}) => {
  return (
    <div className="redaktus-component" data-component-type="index">
    <>
      <div>
        <div className='group relative inline-block'>
          <button
            className={`inline-flex rounded bg-primary ${
              (secondary && `bg-secondary`) ||
              (gray && `bg-body-color`) ||
              (dark && `bg-dark`) ||
              (warning && `bg-warning`) ||
              (danger && `bg-danger`) ||
              (success && `bg-success`) ||
              (info && `bg-info`)
            } py-2 px-[18px] text-base font-semibold text-white`}
          >
            {children}
          </button>
          <div
            className={` ${
              (position === 'right' &&
                `absolute left-full top-1/2 z-20 ml-3 -translate-y-1/2 whitespace-nowrap rounded-sm  py-[6px] px-4 text-sm font-semibold text-white opacity-0 group-hover:opacity-100`) ||
              (position === 'top' &&
                `absolute bottom-full left-1/2 z-20 mb-3 -translate-x-1/2 whitespace-nowrap rounded-sm  py-[6px] px-4 text-sm font-semibold text-white opacity-0 group-hover:opacity-100`) ||
              (position === 'left' &&
                `absolute right-full top-1/2 z-20 mr-3 -translate-y-1/2 whitespace-nowrap rounded-sm  py-[6px] px-4 text-sm font-semibold text-white opacity-0 group-hover:opacity-100`) ||
              (position === 'bottom' &&
                `absolute top-full left-1/2 z-20 mt-3 -translate-x-1/2 whitespace-nowrap rounded-sm  py-[6px] px-4 text-sm font-semibold text-white opacity-0 group-hover:opacity-100`)
            }   ${
              (primary ? `bg-dark` : ``) ||
              (secondary && `bg-secondary`) ||
              (gray && `bg-body-color`) ||
              (dark ? `bg-primary` : ``) ||
              (warning && `bg-warning`) ||
              (danger && `bg-danger`) ||
              (success && `bg-success`) ||
              (info && `bg-info`)
            }`}
          >
            <span
              className={` ${
                (position === 'right' &&
                  `absolute left-[-3px] top-1/2 -z-10 h-2 w-2 -translate-y-1/2 rotate-45 rounded-xs`) ||
                (position === 'top' &&
                  `absolute bottom-[-3px] left-1/2 -z-10 h-2 w-2 -translate-x-1/2 rotate-45 rounded-xs`) ||
                (position === 'left' &&
                  `absolute right-[-3px] top-1/2 -z-10 h-2 w-2 -translate-y-1/2 rotate-45 rounded-xs`) ||
                (position === 'bottom' &&
                  `absolute top-[-3px] left-1/2 -z-10 h-2 w-2 -translate-x-1/2 rotate-45 rounded-xs`)
              }    ${
                (primary ? `bg-dark` : ``) ||
                (secondary && `bg-secondary`) ||
                (gray && `bg-body-color`) ||
                (dark ? `bg-primary` : ``) ||
                (warning && `bg-warning`) ||
                (danger && `bg-danger`) ||
                (success && `bg-success`) ||
                (info && `bg-info`)
              }`}
            ></span>
            {tooltipsText}
          </div>
        </div>
      </div>
    </>
  )
}

export default Tooltip
