import Breadcrumb from "../components/Breadcrumb.jsx";
import paymentImage from "../assets/ecom-images/shopping-carts/shopping-cart-02/payment.svg";
import productOne from "../assets/ecom-images/shopping-carts/shopping-cart-04/image-01.jpg";
import productTwo from "../assets/ecom-images/shopping-carts/shopping-cart-04/image-02.jpg";
import { Link } from "react-router-dom";

const cartItems = [
  {
    image: productOne,
    link: "#",
    name: "Trendy Skirt Set for Women",
    color: "Blue",
    size: "S",
    price: 39.5,
    quantity: 1,
  },
  {
    image: productTwo,
    link: "#",
    name: "Trendy Men's Sneakers",
    color: "White",
    size: "L",
    price: 99.5,
    quantity: 1,
  },
];

const ShoppingCart = () => {
  return (
    <>
      <Breadcrumb pageName="Shopping Cart" />

      <section className="bg-white pb-[120px] pt-24 dark:bg-dark">
        <div className="container mx-auto">
          <h2 className="mb-[60px] text-2xl font-semibold text-dark dark:text-white sm:text-3xl md:text-4xl">
            Shopping cart
          </h2>

          <div className="-mx-4 flex flex-wrap">
            <div className="w-full px-4 lg:w-8/12">
              <div className="mb-5 space-y-9">
                {cartItems.map((item, index) => (
                  <div
                    key={index}
                    className="justify-between border-b border-stroke pb-9 last:border-b-0 dark:border-dark-3 md:flex"
                  >
                    <div className="mb-6 mr-8 h-[180px] w-full max-w-[150px] md:mb-0">
                      <img
                        src={item.image}
                        alt="product"
                        className="h-full w-full object-cover object-center"
                      />
                    </div>

                    <div className="flex w-full flex-col justify-between">
                      <div className="mb-4 w-full justify-between sm:flex">
                        <div className="mb-4 mr-4">
                          <h3>
                            <Link
                              to={item.link}
                              className="mb-3 block text-lg font-semibold text-dark hover:text-primary dark:text-white sm:text-xl"
                            >
                              {item.name}
                            </Link>
                          </h3>
                          <p className="mb-[5px] text-base font-medium text-body-color dark:text-dark-6">
                            Color: {item.color}
                          </p>
                          <p className="mb-[5px] text-base font-medium text-body-color dark:text-dark-6">
                            Size: {item.size}
                          </p>
                          <p className="text-base font-medium text-green">
                            In Stock
                          </p>
                        </div>
                        <div className="mb-4 mr-4">
                          <p className="mb-[10px] text-base font-medium text-body-color dark:text-dark-6">
                            Each
                          </p>
                          <p className="text-xl font-semibold text-dark dark:text-white">
                            ${item.price}
                          </p>
                        </div>
                        <div className="mr-4">
                          <label
                            htmlFor=""
                            className="mb-[10px] block text-base font-medium text-body-color dark:text-dark-6"
                          >
                            Quantity
                          </label>
                          <div className="relative inline-block">
                            <select className="outline-hidden w-full appearance-none border border-stroke bg-transparent py-[6px] pl-4 pr-[52px] text-sm font-medium text-body-color transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-[#F5F7FD] dark:border-dark-3">
                              <option value="" className="dark:bg-dark-2">
                                1
                              </option>
                              <option value="" className="dark:bg-dark-2">
                                2
                              </option>
                              <option value="" className="dark:bg-dark-2">
                                3
                              </option>
                              <option value="" className="dark:bg-dark-2">
                                4
                              </option>
                            </select>
                            <span className="absolute right-[10px] top-1/2 -translate-y-1/2 text-body-color dark:text-dark-6">
                              <svg
                                width="14"
                                height="14"
                                viewBox="0 0 14 14"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                                className="fill-current"
                              >
                                <path d="M7 9.97495C6.86875 9.97495 6.75937 9.9312 6.65 9.8437L1.61875 4.89995C1.42187 4.70308 1.42187 4.39683 1.61875 4.19995C1.81562 4.00308 2.12187 4.00308 2.31875 4.19995L7 8.77183L11.6812 4.1562C11.8781 3.95933 12.1844 3.95933 12.3812 4.1562C12.5781 4.35308 12.5781 4.65933 12.3812 4.8562L7.35 9.79995C7.24062 9.90933 7.13125 9.97495 7 9.97495Z" />
                              </svg>
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        <button className="border-[0.5px] border-gray-7 px-4 py-1 text-sm text-body-color transition hover:border-primary hover:bg-primary hover:text-white dark:border-dark-3 dark:text-dark-6">
                          Edit
                        </button>
                        <button className="border-[0.5px] border-gray-7 px-4 py-1 text-sm text-body-color transition hover:border-primary hover:bg-primary hover:text-white dark:border-dark-3 dark:text-dark-6">
                          Remove
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="w-full px-4 lg:w-4/12">
              <div className="2xl:pl-8">
                <div>
                  <h3 className="mb-5 text-xl font-semibold text-dark dark:text-white">
                    Apply Coupon to get discount!
                  </h3>
                  <form className="flex">
                    <input
                      type="email"
                      className="outline-hidden mb-3 mr-3 h-10 w-full border border-stroke bg-transparent px-4 text-sm text-body-color focus:border-primary focus-visible:shadow-none dark:border-dark-3 dark:text-dark-6"
                      placeholder="Coupon code"
                    />
                    <button className="mb-3 h-10 bg-primary px-[22px] text-sm font-semibold text-white transition hover:bg-blue-dark">
                      Submit
                    </button>
                  </form>
                </div>

                <div className="-mx-1 border-b border-stroke py-6 dark:border-dark-3">
                  <div className="mb-4 flex items-center justify-between">
                    <div className="px-1">
                      <p className="text-base font-medium text-dark dark:text-white">
                        Subtotal
                      </p>
                    </div>
                    <div className="px-1">
                      <p className="text-base font-medium text-dark dark:text-white">
                        $96.00
                      </p>
                    </div>
                  </div>
                  <div className="mb-4 flex items-center justify-between">
                    <div className="px-1">
                      <p className="text-base font-medium text-dark dark:text-white">
                        Shipping Cost (+)
                      </p>
                    </div>
                    <div className="px-1">
                      <p className="text-base font-medium text-dark dark:text-white">
                        $14.00
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="px-1">
                      <p className="text-base font-medium text-dark dark:text-white">
                        Discount (-)
                      </p>
                    </div>
                    <div className="px-1">
                      <p className="text-base font-medium text-dark dark:text-white">
                        $9.00
                      </p>
                    </div>
                  </div>
                </div>
                <div className="-mx-1 flex items-center justify-between pb-8 pt-6">
                  <div className="px-1">
                    <p className="text-base font-medium text-dark dark:text-white">
                      Estimated Total
                    </p>
                  </div>
                  <div className="px-1">
                    <p className="text-base font-medium text-dark dark:text-white">
                      $110.00
                    </p>
                  </div>
                </div>

                <div className="mb-3">
                  <Link
                    to="/order-summary"
                    className="flex w-full items-center justify-center bg-primary px-10 py-3 text-center text-base font-medium text-white hover:bg-blue-dark"
                  >
                    Checkout
                  </Link>
                </div>
                <p className="text-center text-base text-body-color dark:text-dark-6">
                  <span>You&apos;re</span>
                  <span className="px-0.5 text-[#DC2626]"> $10.05 </span>
                  <span>away from free shipping!</span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default ShoppingCart;
