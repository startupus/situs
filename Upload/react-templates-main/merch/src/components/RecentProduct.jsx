import { Link } from "react-router-dom";

import productOne from "../assets/ecom-images/products/recent-products-01/product-01.jpg";
import productTwo from "../assets/ecom-images/products/recent-products-01/product-02.jpg";
import productThree from "../assets/ecom-images/products/recent-products-01/product-03.jpg";
import productFour from "../assets/ecom-images/products/recent-products-01/product-04.jpg";

const collections = [
  {
    imageSrc: productOne,
    link: "/product-details",
    productName: "Men Winter Jacket",
    productDescription: "Item Descriptions",
    productPrice: "$35.00",
  },
  {
    imageSrc: productTwo,
    link: "/product-details",
    productName: "Women Collection",
    productDescription: "Item Descriptions",
    productPrice: "$35.00",
  },
  {
    imageSrc: productThree,
    link: "/product-details",
    productName: "Women Sunglass",
    productDescription: "Item Descriptions",
    productPrice: "$35.00",
  },
  {
    imageSrc: productFour,
    link: "/product-details",
    productName: "Man in Black",
    productDescription: "Item Descriptions",
    productPrice: "$35.00",
  },
];

const RecentProduct = () => {
  return (
    <>
      <section className="pt-[120px] dark:bg-dark">
        <div className="container mx-auto">
          <div className="-mx-4 flex flex-wrap">
            <div className="w-full px-4">
              <div className="mx-auto mb-[60px] max-w-[510px] text-center lg:mb-[70px]">
                <span className="mb-2 block text-lg font-semibold text-primary">
                  Recent Products
                </span>
                <h2 className="mb-3 text-3xl font-bold text-dark dark:text-white sm:text-4xl md:text-[40px] md:leading-[1.2]">
                  Top Collections
                </h2>
                <p className="text-base text-body-color dark:text-dark-6">
                  There are many variations of passages of Lorem Ipsum available
                  but the majority have suffered alteration in some form.
                </p>
              </div>
            </div>
          </div>

          <div className="-mx-4 flex flex-wrap">
            {collections.map((collection, index) => (
              <div
                key={index}
                className="w-full px-4 md:w-1/2 lg:w-1/3 xl:w-1/4"
              >
                <div className="mb-10">
                  <div className="mb-5 overflow-hidden rounded-[5px]">
                    <img
                      src={collection.imageSrc}
                      alt="category"
                      className="w-full"
                    />
                  </div>
                  <div className="flex-wrap justify-between xs:flex">
                    <div className="mb-3 xs:mb-0">
                      <h3>
                        <Link
                          to={collection.link}
                          className="mb-1 inline-block text-lg font-semibold text-dark transition hover:text-primary dark:text-white 2xl:text-xl"
                        >
                          {collection.productName}
                        </Link>
                      </h3>
                      <p className="text-base text-body-color dark:text-dark-6">
                        {collection.productDescription}
                      </p>
                    </div>
                    <div>
                      <p className="text-base font-semibold text-primary">
                        {collection.productPrice}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
};

export default RecentProduct;
