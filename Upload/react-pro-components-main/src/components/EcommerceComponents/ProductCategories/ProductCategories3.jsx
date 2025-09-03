import React from "react";

const ProductCategories3 = () => {
  return (
    <section className="bg-white pb-12 pt-20 dark:bg-dark lg:pb-[90px] lg:pt-[120px]">
      <div className="container mx-auto">
        <div className="-mx-4 flex flex-wrap">
          <div className="w-full px-4 lg:w-1/2">
            <CategoriesItem
              bigImg
              link="/#"
              img="https://cdn-tailgrids.b-cdn.net/1.0/assets/images/ecommerce/categories/category-03/image-01.jpg"
              subtitle="#House"
              title="Express Your Beautiful Life Through Furniture"
            />
          </div>
          <div className="w-full px-4 lg:w-1/2">
            <CategoriesItem
              link="/#"
              img="https://cdn-tailgrids.b-cdn.net/1.0/assets/images/ecommerce/categories/category-03/image-02.jpg"
              subtitle="#Accessories"
              title="Discover Our Accessories Collection"
            />
            <CategoriesItem
              link="/#"
              img="https://cdn-tailgrids.b-cdn.net/1.0/assets/images/ecommerce/categories/category-03/image-03.jpg"
              subtitle="#Office"
              title="Make Your Workspace More Comfortable"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProductCategories3;

const CategoriesItem = ({ bigImg, link, img, title, subtitle }) => {
  return (
    <div
      className={` ${
        bigImg
          ? "relative mb-10 sm:h-[500px] lg:h-[440px] xl:h-[500px]"
          : "relative mb-10 h-[180px] sm:h-[230px] lg:h-[200px] xl:h-[230px]"
      }`}
    >
      <img
        src={img}
        alt="category"
        className="h-full w-full object-cover object-center"
      />
      <div className="absolute left-0 top-0 h-full w-full px-6 py-10 sm:px-10">
        <div className="max-w-[400px]">
          <span className="mb-3 block text-base font-medium text-body-color">
            {subtitle}
          </span>
          <a
            href={link}
            className="text-xl font-semibold text-dark lg:text-2xl xl:text-[28px] xl:leading-10"
          >
            {title}
          </a>
        </div>
      </div>
    </div>
  );
};
