/**
 * Brand3 - Brand компонент
 * 
 * Адаптировано из TailGrids Pro для редактора Редактус
 * Категория: MarketingComponents
 * Подкатегория: Brand
 * 
 * @component
 * @example
 * <Brand3 
 *   href="value"
 *   imgSrc="value"
 *   Alt="value"
 * />
 */

import React from 'react';

interface Brand3Props {
  href: string;
  imgSrc: string;
  Alt: string;
}

const Brand3: React.FC<Brand3Props> = () => {
  return (
    <>
      <section className="bg-white dark:bg-dark py-20 lg:py-[120px]">
        <div className="container mx-auto">
          <div className="flex flex-wrap -mx-4">
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
    </>
  )
    </div>;
};

export default Brand3;

const SingleImage = ({ href, imgSrc, Alt }) => {
  return (
    <div className="redaktus-component" data-component-type="brand3">
    <>
      <a
        href={href}
        className="hover:border-primary/20 flex h-20 min-w-[150px] max-w-[225px] items-center justify-center rounded-full border border-transparent px-7 hover:bg-primary/5"
      >
        <img src={imgSrc} alt={Alt} className="w-full h-10" />
      </a>
    </>
  );
};
