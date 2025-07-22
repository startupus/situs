/**
 * Brand2 - Brand компонент
 * 
 * Адаптировано из TailGrids Pro для редактора Редактус
 * Категория: MarketingComponents
 * Подкатегория: Brand
 * 
 * @component
 * @example
 * <Brand2 
 *   href="value"
 *   imgSrc="value"
 *   Alt="value"
 * />
 */

import React from 'react';

interface Brand2Props {
  href: string;
  imgSrc: string;
  Alt: string;
}

const Brand2: React.FC<Brand2Props> = () => {
  return (
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

export default Brand2;

const SingleImage = ({ href, imgSrc, Alt }) => {
  return (
    <div className="redaktus-component" data-component-type="brand2">
    <>
      <a
        href={href}
        className="flex h-20 w-[150px] items-center justify-center rounded-sm px-4 hover:shadow-[0px_7px_25px_0px_#E3E6F0] dark:hover:shadow-[0px_7px_25px_0px_rgba(0,0,0,.5)] lg:w-[200px] 2xl:w-[180px]"
      >
        <img src={imgSrc} alt={Alt} className="h-10 w-full" />
      </a>
    </>
  );
};
