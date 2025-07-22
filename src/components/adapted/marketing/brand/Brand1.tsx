/**
 * Brand1 - Brand компонент
 * 
 * Адаптировано из TailGrids Pro для редактора Редактус
 * Категория: MarketingComponents
 * Подкатегория: Brand
 * 
 * @component
 * @example
 * <Brand1 
 *   href="value"
 *   imgSrc="value"
 *   Alt="value"
 * />
 */

import React from 'react';

interface Brand1Props {
  href: string;
  imgSrc: string;
  Alt: string;
}

const Brand = () => {
  return (
    <div className="redaktus-component" data-component-type="brand1">
    <section className="bg-white py-20 dark:bg-dark lg:py-[120px]">
      <div className="container mx-auto">
        <div className="-mx-4 flex flex-wrap">
          <div className="w-full px-4">
            <div className="flex flex-wrap items-center justify-center">
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
                imgSrc="https://cdn.tailgrids.com/1.0/assets/images/brands/uideck.svg"
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
  )
    </div>;
};

export default Brand;

const SingleImage = ({ href, imgSrc, Alt }) => {
  return (
    <>
      <a
        href={href}
        className="mx-4 flex w-[150px] items-center justify-center  2xl:w-[180px]"
      >
        <img src={imgSrc} alt={Alt} className="h-10 w-full" />
      </a>
    </>
  );
};
