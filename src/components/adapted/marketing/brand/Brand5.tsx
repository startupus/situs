/**
 * Brand5 - Brand компонент
 * 
 * Адаптировано из TailGrids Pro для редактора Редактус
 * Категория: MarketingComponents
 * Подкатегория: Brand
 * 
 * @component
 * @example
 * <Brand5 
 *   href="value"
 *   imgSrc="value"
 *   Alt="value"
 * />
 */

import React from 'react';

interface Brand5Props {
  href: string;
  imgSrc: string;
  Alt: string;
}

const Brand5: React.FC<Brand5Props> = () => {
  return (
    <>
      <section className="bg-white dark:bg-dark py-20 lg:py-[120px]">
        <div className="container mx-auto">
          <div className="flex flex-wrap items-center -mx-4">
            <div className="w-full px-4 lg:w-1/2 xl:w-5/12">
              <div>
                <h2 className="text-dark dark:text-white text-3xl font-bold sm:text-4xl lg:text-3xl xl:text-[33px] 2xl:text-4xl">
                  Tailwind CSS UI Components for Modern Web Apps
                </h2>
              </div>
            </div>
            <div className="w-full px-4 lg:w-1/2 xl:w-7/12">
              <div className="flex flex-wrap items-center justify-center mt-12 lg:mt-0 xl:justify-end">
                <SingleImage
                  href={props.href || "#"}
                  Alt="Brand Image"
                  imgSrc="https://cdn.tailgrids.com/1.0/assets/images/brands/graygrids.svg"
                />
                <SingleImage
                  href={props.href || "#"}
                  Alt="Brand Image"
                  imgSrc="https://cdn.tailgrids.com/1.0/assets/images/brands/lineicons.svg"
                />
                <SingleImage
                  href={props.href || "#"}
                  Alt="Brand Image"
                  imgSrc="https://cdn.tailgrids.com/1.0/assets/images/brands/ayroui.svg"
                />
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
    </div>;
};

export default Brand5;

const SingleImage = ({ href, imgSrc, Alt }) => {
  return (
    <div className="redaktus-component" data-component-type="brand5">
    <a
      href={href}
      className="mx-4 flex min-w-[150px] max-w-[200px] items-center justify-center py-5 lg:min-w-min lg:max-w-[110px] xl:max-w-[200px]"
    >
      <img src={imgSrc} alt={Alt} className="w-full h-10" />
    </a>
  );
};
