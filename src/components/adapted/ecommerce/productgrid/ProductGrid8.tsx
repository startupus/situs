/**
 * ProductGrid8 - ProductGrid компонент
 * 
 * Адаптировано из TailGrids Pro для редактора Редактус
 * Категория: EcommerceComponents
 * Подкатегория: ProductGrid
 * 
 * @component
 * @example
 * <ProductGrid8 
 *   img="value"
 *   link="value"
 *   title="value"
 *   subtitle="value"
 *   price="value"
 * />
 */

import React from 'react';

interface ProductGrid8Props {
  img: string;
  link: string;
  title: string;
  subtitle: string;
  price: string;
}

const ProductGrid8: React.FC<ProductGrid8Props> = () => {
  return (
    <section className="bg-white py-20 dark:bg-dark lg:py-[120px]">
      <div className="container mx-auto">
        <div className="-mx-4 flex flex-wrap">
          <SingleProduct
            img="https://cdn.tailgrids.com/1.0/assets/images/ecommerce/products/products-grids-08/image-01.jpg"
            link="/#"
            title="Classified Ads HTML Template"
            subtitle="Templates/Html/Classified"
            price="$24"
          />
          <SingleProduct
            img="https://cdn.tailgrids.com/1.0/assets/images/ecommerce/products/products-grids-08/image-02.jpg"
            link="/#"
            title="Xpeedo - HTML Landing Page"
            subtitle="Templates/Html/Classified"
            price="$39"
          />
          <SingleProduct
            img="https://cdn.tailgrids.com/1.0/assets/images/ecommerce/products/products-grids-08/image-03.jpg"
            link="/#"
            title="Bold - Business Template"
            subtitle="Templates/Html/Classified"
            price="$78"
          />
        </div>
      </div>
    </section>
  )
    </div>;
};

export default ProductGrid8;

const SingleProduct = ({ img, link, title, subtitle, price }) => {
  return (
    <div className="redaktus-component" data-component-type="productgrid8">
    <div className="w-full px-4 md:w-1/2 lg:w-1/3">
      <div className="mb-10">
        <div className="relative mb-5 overflow-hidden rounded-sm border-[.5px] border-[#e7e7e7] dark:border-dark-3">
          <img src={img} alt={props.imageAlt || "product"} className="w-full" />
        </div>
        <div className="flex justify-between">
          <div>
            <h3>
              <a
                href={link}
                className="mb-2 block text-base font-semibold leading-tight! text-dark hover:text-primary dark:text-white xs:text-lg"
              >
                {title}
              </a>
            </h3>
            <p className="mb-4 text-sm font-medium text-body-color dark:text-dark-6">
              {subtitle}
            </p>
          </div>
          <div>
            <span className="inline-flex items-center justify-center rounded-full bg-primary px-3 py-[2px] text-center text-base font-semibold text-white">
              {price}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
