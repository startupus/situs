/**
 * FeaturedProduct5 - FeaturedProduct компонент
 * 
 * Адаптировано из TailGrids Pro для редактора Редактус
 * Категория: EcommerceComponents
 * Подкатегория: FeaturedProduct
 * 
 * @component
 * @example
 * <FeaturedProduct5 
 *   img="value"
 *   details="value"
 *   subtitle="value"
 *   title="value"
 *   link="value"
 *   button="value"
 * />
 */

import React from 'react';

interface FeaturedProduct5Props {
  img: string;
  details: string;
  subtitle: string;
  title: string;
  link: string;
  button: string;
}

const FeaturedProduct5: React.FC<FeaturedProduct5Props> = () => {
  return (
    <section className="bg-gray-2 py-20 dark:bg-dark lg:py-[120px]">
      <div className="container mx-auto">
        <div className="flex justify-center">
          <SingleFeaturedProduct
            img="https://cdn.tailgrids.com/1.0/assets/images/ecommerce/products/featured-products-05/image-01.jpg"
            details="Lorem ipsum dolor sit amet, consectetur adipiscing elit. In sit amet molestie nunc. Vestibulum tempus justo et venenatis tempus. Nulla tincidunt,"
            subtitle="Start From $49"
            title="New Winter Collections."
            button="View All Items"
            link="/#"
          />
        </div>
      </div>
    </section>
  )
    </div>;
};

export default FeaturedProduct5;

const SingleFeaturedProduct = ({
  img,
  details,
  subtitle,
  title,
  link,
  button,
}) => {
  return (
    <div className="redaktus-component" data-component-type="featuredproduct5">
    <div className="w-full lg:w-11/12 xl:w-10/12 2xl:w-9/12">
      <div className="shadow-product items-center overflow-hidden bg-white dark:bg-dark-2 md:flex">
        <div className="w-full border-8 border-white dark:border-dark-2 md:max-w-[300px] lg:max-w-[350px] xl:max-w-[400px]">
          <img src={img} alt={props.imageAlt || "product"} className="w-full" />
        </div>

        <div className="w-full">
          <div className="mx-auto max-w-[510px] px-5 py-8 xs:px-8">
            <span className="mb-[14px] block text-lg font-semibold text-primary">
              {subtitle}
            </span>
            <h2 className="mb-4 text-xl font-bold text-dark dark:text-white sm:text-3xl lg:text-4xl">
              {title}
            </h2>
            <p className="mb-8 text-base text-body-color dark:text-dark-6">
              {details}
            </p>
            <a
              href={link}
              className="inline-flex items-center justify-center bg-primary px-7 py-3 text-center text-base font-medium text-white hover:bg-blue-dark"
            >
              {button}
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
