/**
 * Brand4 - Brand компонент
 * 
 * Адаптировано из TailGrids Pro для редактора Редактус
 * Категория: MarketingComponents
 * Подкатегория: Brand
 * 
 * @component
 * @example
 * <Brand4 
 *   href="value"
 *   imgSrc="value"
 *   Alt="value"
 * />
 */

import React from 'react';

interface Brand4Props {
  href: string;
  imgSrc: string;
  Alt: string;
}

const Brand4: React.FC<Brand4Props> = () => {
  return (
    <section className="bg-white py-20 dark:bg-dark lg:py-[120px]">
      <div className="container flex h-[60vh] items-center justify-center">
        <div className="-mx-4 flex flex-wrap">
          <div className="w-full px-4">
            <div className="mx-auto flex max-w-[570px] flex-wrap items-center justify-center">
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
              <SingleImage
                href={props.href || "#"}
                Alt="Brand Image"
                imgSrc="https://cdn.tailgrids.com/1.0/assets/images/brands/plainadmin.svg"
              />
              <SingleImage
                href={props.href || "#"}
                Alt="Brand Image"
                imgSrc="https://cdn.tailgrids.com/1.0/assets/images/brands/ecom.svg"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
    </div>;
};

export default Brand4;

const SingleImage = ({ href, imgSrc, Alt }) => {
  return (
    <div className="redaktus-component" data-component-type="brand4">
    <>
      <a
        href={href}
        className="flex h-[110px] max-w-[188px] items-center justify-center border border-stroke px-7 hover:bg-primary/10 dark:border-primary/20"
      >
        <img src={imgSrc} alt={Alt} className="h-10 w-full" />
      </a>
    </>
  );
};
