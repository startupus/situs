import React from "react";

const ProductCategories4 = () => {
  return (
    <section className="bg-gray-1 pb-12 pt-20 dark:bg-dark lg:pb-[90px] lg:pt-[120px]">
      <div className="container mx-auto">
        <div className="-mx-4 flex flex-wrap items-end">
          <div className="w-full px-4 lg:w-2/3">
            <div className="mb-[60px] max-w-[510px] lg:mb-20">
              <h2 className="mb-4 text-3xl font-bold text-dark dark:text-white md:text-[38px] md:leading-[45px]">
                Shop By Category
              </h2>
              <p className="text-base text-body-color dark:text-dark-6">
                There are many variations of passages of Lorem Ipsum available
                but the majority have suffered alteration in some form.
              </p>
            </div>
          </div>
          <div className="w-full px-4 lg:w-1/3">
            <div className="mb-[60px] lg:mb-20 lg:text-right">
              <a
                href="/#"
                className="inline-flex items-center justify-center rounded-md border border-primary px-7 py-3 text-center text-base text-primary transition hover:border-primary hover:bg-primary hover:text-white dark:border-white dark:text-white"
              >
                Explore All
              </a>
            </div>
          </div>
        </div>

        <div className="-mx-4 flex flex-wrap">
          <CategoriesItem
            link="/#"
            img="https://cdn-tailgrids.b-cdn.net/1.0/assets/images/ecommerce/categories/category-04/image-01.jpg"
            tag="#House"
            title="Beautiful Furniture"
          />
          <CategoriesItem
            link="/#"
            img="https://cdn-tailgrids.b-cdn.net/1.0/assets/images/ecommerce/categories/category-04/image-02.jpg"
            tag="#Accessories"
            title="Accessories Collection"
          />
          <CategoriesItem
            link="/#"
            img="https://cdn-tailgrids.b-cdn.net/1.0/assets/images/ecommerce/categories/category-04/image-03.jpg"
            tag="#Kitchen"
            title="Kitchen Set Collection"
          />
        </div>
      </div>
    </section>
  );
};

export default ProductCategories4;

const CategoriesItem = ({ link, img, title, tag }) => {
  return (
    <div className="w-full px-4 md:w-1/2 lg:w-1/3">
      <div className="mb-10 rounded-xl border border-stroke bg-white p-3 dark:border-dark-3 dark:bg-dark-2">
        <a href={link} className="block">
          <img src={img} alt="category" className="w-full rounded-lg" />
        </a>
        <div className="px-3 pb-3 pt-6">
          <span className="mb-1 text-base font-medium text-body-color dark:text-dark-6">
            {tag}
          </span>
          <a
            href={link}
            className="block text-lg font-semibold text-dark hover:text-primary dark:text-white sm:text-2xl md:text-xl lg:text-lg xl:text-2xl"
          >
            {title}
          </a>
        </div>
      </div>
    </div>
  );
};
