import React from "react";

const RecentProduct = () => {
  return (
    <section className="pb-12 pt-20 dark:bg-dark lg:pb-[90px] lg:pt-[120px]">
      <div className="container mx-auto">
        <div className="mx-auto mb-[60px] max-w-[510px] text-center lg:mb-[70px]">
          <span className="mb-2 block text-lg font-semibold text-primary">
            Recent Products
          </span>
          <h2 className="mb-3 text-3xl font-bold text-dark dark:text-white sm:text-4xl md:text-[40px] md:leading-[1.2]">
            Top Collections
          </h2>
          <p className="text-base text-body-color dark:text-dark-6">
            There are many variations of passages of Lorem Ipsum available but
            the majority have suffered alteration in some form.
          </p>
        </div>

        <div className="-mx-4 flex flex-wrap">
          <ProductCard
            link="/#"
            img="https://cdn.tailgrids.com/1.0/assets/images/ecommerce/products/recent-products-01/product-01.jpg"
            title="Men Winter Jacket"
            subtitle="Item Descriptions"
            price="$35.00"
          />
          <ProductCard
            link="/#"
            img="https://cdn.tailgrids.com/1.0/assets/images/ecommerce/products/recent-products-01/product-02.jpg"
            title="Women Collection"
            subtitle="Item Descriptions"
            price="$35.00"
          />
          <ProductCard
            link="/#"
            img="https://cdn.tailgrids.com/1.0/assets/images/ecommerce/products/recent-products-01/product-03.jpg"
            title="Men Winter Jacket"
            subtitle="Item Descriptions"
            price="$35.00"
          />
          <ProductCard
            link="/#"
            img="https://cdn.tailgrids.com/1.0/assets/images/ecommerce/products/recent-products-01/product-04.jpg"
            title="Man in Black"
            subtitle="Item Descriptions"
            price="$35.00"
          />
        </div>
      </div>
    </section>
  );
};

export default RecentProduct;

const ProductCard = ({ link, img, title, subtitle, price }) => {
  return (
    <div className="w-full px-4 md:w-1/2 lg:w-1/3 xl:w-1/4">
      <div className="mb-10">
        <div className="mb-5 overflow-hidden rounded-[5px]">
          <img src={img} alt="category" className="w-full" />
        </div>
        <div className="flex-wrap justify-between xs:flex">
          <div className="mb-3 xs:mb-0">
            <h3>
              <a
                href={link}
                className="mb-1 inline-block text-lg font-semibold text-dark transition hover:text-primary dark:text-white 2xl:text-xl"
              >
                {title}
              </a>
            </h3>
            <p className="text-base text-body-color dark:text-dark-6">
              {subtitle}
            </p>
          </div>
          <div>
            <p className="text-base font-semibold text-primary">{price}</p>
          </div>
        </div>
      </div>
    </div>
  );
};
