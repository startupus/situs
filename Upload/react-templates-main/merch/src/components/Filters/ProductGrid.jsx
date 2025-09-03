import productOne from "../../assets/ecom-images/products/products-grids-07/image-01.jpg";
import productTwo from "../../assets/ecom-images/products/products-grids-07/image-02.jpg";
import productThree from "../../assets/ecom-images/products/products-grids-07/image-03.jpg";
import productFour from "../../assets/ecom-images/products/products-grids-07/image-04.jpg";
import { Link } from "react-router-dom";

const productList = [
  {
    image: productOne,
    link: "/product-details",
    title: "T-shirt for Men's",
    price: "$24.00",
    priceBeforeDiscount: "$50.00",
    button: "Shop Now",
  },
  {
    image: productTwo,
    link: "/product-details",
    title: "T-shirt for Women's",
    price: "$39.00",
    button: "Shop Now",
  },
  {
    image: productThree,
    link: "/product-details",
    title: "Men's Sneakers",
    price: "$78.00",
    priceBeforeDiscount: "$89.00",
    button: "Shop Now",
  },
  {
    image: productFour,
    link: "#",
    title: "Fashionable Bag women",
    price: "$159.00",
    button: "Shop Now",
  },
  {
    image: productTwo,
    link: "#",
    title: "T-shirt for Women's",
    price: "$39.00",
    button: "Shop Now",
  },
  {
    image: productThree,
    link: "/product-details",
    title: "Men's Sneakers",
    price: "$78.00",
    priceBeforeDiscount: "$89.00",
    button: "Shop Now",
  },
  {
    image: productFour,
    link: "/product-details",
    title: "Fashionable Bag women",
    price: "$159.00",
    button: "Shop Now",
  },
  {
    image: productOne,
    link: "/product-details",
    title: "T-shirt for Men's",
    price: "$24.00",
    priceBeforeDiscount: "$50.00",
    button: "Shop Now",
  },
];

const ProductGrid = () => {
  return (
    <>
      {productList.map((item, index) => (
        <div key={index} className="w-full px-4 sm:w-1/2 lg:w-1/3 xl:w-1/4">
          <div className="mb-14">
            <div className="relative mb-5 overflow-hidden rounded-sm">
              <img src={item.image} alt="product" className="w-full" />
            </div>
            <div className="text-center">
              <h3>
                <Link
                  to={item.link}
                  className="mb-[5px] block text-lg font-semibold text-dark hover:text-primary dark:text-white md:text-xl"
                >
                  {item.title}
                </Link>
              </h3>
              <p className="mb-5 text-base font-medium text-dark dark:text-white">
                {item.priceBeforeDiscount && (
                  <span className="pr-2 text-body-color line-through dark:text-dark-6">
                    {item.priceBeforeDiscount}
                  </span>
                )}

                {item.price}
              </p>
              <Link
                to={item.link}
                className="inline-flex items-center justify-center rounded-md border border-dark-2 px-5 py-[9px] text-center text-base font-medium transition hover:bg-dark-2 hover:text-white dark:text-white"
              >
                {item.button}
              </Link>
            </div>
          </div>
        </div>
      ))}
    </>
  );
};

export default ProductGrid;
