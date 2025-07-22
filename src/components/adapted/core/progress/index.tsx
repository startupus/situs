/**
 * index - Progress компонент
 * 
 * Адаптировано из TailGrids Pro для редактора Редактус
 * Категория: CoreComponents
 * Подкатегория: Progress
 * 
 * @component
 * @example
 * <index 
 *   ShowValue="value"
 *   ShowValueInside="value"
 *   primary="value"
 *   secondary="value"
 *   warning="value"
 *   danger="value"
 *   success="value"
 *   info="value"
 *   value="value"
 * />
 */

import React from 'react';

interface indexProps {
  ShowValue: string;
  ShowValueInside: string;
  primary: string;
  secondary: string;
  warning: string;
  danger: string;
  success: string;
  info: string;
  value?: string;
}

const Progress = ({
  ShowValue,
  ShowValueInside,
  primary,
  secondary,
  warning,
  danger,
  success,
  info,
  value = "50",
}) => {
  return (
    <div className="redaktus-component" data-component-type="index">
    <>
      {/* ====== Progress-bars Section Start */}

      <div className="container mt-12 mb-6">
        <div className="flex flex-wrap justify-between -mx-4">
          <div className="w-full px-4 lg:w-5/12">
            <div className="">
              <div className="relative h-[10px] w-full rounded-2xl bg-light">
                <div
                  className={`absolute top-0 left-0 w-1/2 h-full rounded-2xl ${
                    (primary && `bg-primary`) ||
                    (secondary && `bg-secondary`) ||
                    (danger && `bg-danger`) ||
                    (success && `bg-success`) ||
                    (info && `bg-info`) ||
                    (warning && `bg-warning`)
                  }  bg-primary`}
                />
                {ShowValue && (
                  <div className="relative h-[10px] w-full rounded-2xl bg-light">
                    <div
                      className={`absolute top-0 left-0 w-1/2 h-full rounded-2xl ${
                        (primary && `bg-primary`) ||
                        (secondary && `bg-secondary`) ||
                        (danger && `bg-danger`) ||
                        (success && `bg-success`) ||
                        (info && `bg-info`) ||
                        (warning && `bg-warning`)
                      }  bg-primary`}
                    >
                      <span
                        className={`absolute px-2 py-1 mb-2 text-xs font-semibold text-white rounded-sm -right-4 bottom-full ${
                          (primary && `bg-primary`) ||
                          (secondary && `bg-secondary`) ||
                          (danger && `bg-danger`) ||
                          (success && `bg-success`) ||
                          (info && `bg-info`) ||
                          (warning && `bg-warning`)
                        }  bg-primary`}
                      >
                        <span
                          className={`absolute bottom-[-2px] left-1/2 -z-10 h-2 w-2 -translate-x-1/2 rotate-45 rounded-sm  ${
                            (primary && `bg-primary`) ||
                            (secondary && `bg-secondary`) ||
                            (danger && `bg-danger`) ||
                            (success && `bg-success`) ||
                            (info && `bg-info`) ||
                            (warning && `bg-warning`)
                          }  bg-primary`}
                        />
                        {value}%
                      </span>
                    </div>
                  </div>
                )}

                {ShowValueInside && (
                  <div className="relative w-full h-4 rounded-2xl bg-light">
                    <div
                      className={`absolute top-0 left-0 flex items-center justify-center w-1/2 h-full text-xs font-semibold text-white rounded-2xl  ${
                        (primary && `bg-primary`) ||
                        (secondary && `bg-secondary`) ||
                        (danger && `bg-danger`) ||
                        (success && `bg-success`) ||
                        (info && `bg-info`) ||
                        (warning && `bg-warning`)
                      }  bg-primary`}
                    >
                      {value}%
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ====== Progress-bars Section End */}
    </>
  )
    </div>;
};

export default Progress;
