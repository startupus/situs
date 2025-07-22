/**
 * Error5 - Error компонент
 * 
 * Адаптировано из TailGrids Pro для редактора Редактус
 * Категория: ApplicationComponents
 * Подкатегория: Error
 * 
 * @component
 * @example
 * <Error5 
 *   
 * />
 */

import React from 'react';

const Error5 = () => {
  return (
    <div className="redaktus-component" data-component-type="error5">
    <section className="min-h-screen bg-white py-20 dark:bg-dark lg:py-[120px]">
      <div className="container mx-auto">
        <div className="-mx-4 flex flex-wrap items-center">
          <div className="w-full px-4 md:w-5/12 lg:w-6/12">
            <div className="relative z-10 mb-14 mr-5 md:mb-0 md:mr-10 lg:mr-14">
              <img
                src={props.imageSrc || "https://cdn.tailgrids.com/2.0/image/application/images/404/image-05.jpg"}
                alt={props.imageAlt || "image"}
                className="mx-auto w-full"
              />

              <div className="absolute -bottom-5 -right-5 -z-10 block h-full w-full bg-primary lg:-bottom-7 lg:-right-7"></div>
            </div>
          </div>
          <div className="w-full px-4 md:w-7/12 lg:w-6/12 xl:w-5/12">
            <div>
              <div className="lg:max-w-[450px]">
                <h3 className="mb-6 text-3xl font-bold leading-tight text-dark dark:text-white md:text-[40px] lg:text-[50px]">
                  Page Not Found Error 404
                </h3>
                <p className="mb-8 text-lg text-body-color dark:text-dark-6">
                  The page you were looking for appears to have been moved,
                  deleted or does not exist.
                </p>
              </div>

              <div className="-mx-2 flex w-full flex-wrap">
                <div className="mb-4 px-2">
                  <a
                    href={props.href || "/#"}
                    className="inline-flex border border-transparent bg-primary px-8 py-3 text-base font-medium text-white transition hover:bg-primary/90"
                  >
                    Back to Homepage
                  </a>
                </div>
                <div className="mb-4 px-2">
                  <a
                    href={props.href || "/#"}
                    className="inline-flex border border-transparent bg-white px-8 py-3 text-base font-medium text-primary transition hover:bg-primary hover:text-white dark:bg-white/10"
                  >
                    Visit our help center
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
    </div>;
};

export default Error5;
