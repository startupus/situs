import Breadcrumb from "../components/Breadcrumb.jsx";

import productOne from "../assets/ecom-images/order-summaries/order-summary-03/image-01.jpg";
import { Link } from "react-router-dom";

const orderItems = [
  {
    image: productOne,
    link: "#",
    title: "Mist Black Triblend",
    color: "White",
    size: "Medium",
    quantity: "01",
    price: "120.00",
  },
];

const OrderSummary = () => {
  return (
    <>
      <Breadcrumb pageName="Order Summary" />

      <section className="bg-white pb-[120px] pt-24 dark:bg-dark">
        <div className="container mx-auto">
          <div className="-mx-4 flex flex-wrap">
            <div className="w-full px-4 md:w-1/2">
              <div className="mb-[50px]">
                <h2 className="text-3xl font-semibold text-dark dark:text-white sm:text-4xl">
                  Order Summary
                </h2>
              </div>
            </div>
            <div className="w-full px-4 md:w-1/2">
              <div className="mb-[50px] md:text-right">
                <h3 className="text-xl font-semibold text-dark dark:text-white sm:text-2xl">
                  Order #15478
                </h3>
              </div>
            </div>
          </div>
        </div>

        <div className="mb-[50px] bg-gray-2 py-[50px] dark:bg-dark-2">
          <div className="container mx-auto">
            <div className="-mx-4 flex flex-wrap">
              <div className="w-full px-4 md:w-1/2 lg:w-4/12">
                <div className="mb-8 max-w-[270px]">
                  <h4 className="mb-[10px] text-base font-medium text-dark dark:text-white">
                    Note:
                  </h4>
                  <p className="text-base text-body-color dark:text-dark-6">
                    Your order has been confirmed and will be shipping soon.
                  </p>
                </div>
              </div>
              <div className="w-full px-4 md:w-1/2 lg:w-5/12 xl:w-4/12">
                <div className="mb-12">
                  <h4 className="mb-[10px] text-base font-medium text-dark dark:text-white">
                    Receiver Details
                  </h4>
                  <p className="mb-1 text-base text-body-color dark:text-dark-6">
                    Name: Jhon Smith
                  </p>
                  <p className="mb-1 text-base text-body-color dark:text-dark-6">
                    Email: contact@yourmail.com
                  </p>
                  <p className="text-base text-body-color dark:text-dark-6">
                    Address: New York, USA 2707 Davis Anenue
                  </p>
                </div>
              </div>
            </div>

            <div className="rounded-md border-[.5px] border-stroke bg-white py-5 pl-5 pr-8 dark:border-dark-3 dark:bg-dark-2">
              {orderItems.map((item, index) => (
                <div key={index} className="items-center sm:flex">
                  <div className="mb-3 mr-6 h-20 w-full max-w-[80px] overflow-hidden rounded-sm sm:mb-0">
                    <img
                      src={item.image}
                      alt="product"
                      className="h-full w-full object-cover object-center"
                    />
                  </div>
                  <div className="w-full items-center justify-between md:flex">
                    <div className="mb-3 md:mb-0">
                      <Link
                        to={item.link}
                        className="mb-1 inline-block text-base font-medium text-dark hover:text-primary dark:text-white"
                      >
                        {item.title}
                      </Link>

                      <p className="flex text-sm text-body-color dark:text-dark-6">
                        <span className="mr-5"> Color: {item.color} </span>
                        <span className="mr-5"> Size: {item.size} </span>
                      </p>
                    </div>

                    <div className="flex items-center md:justify-end">
                      <p className="mr-20 text-base font-medium text-dark dark:text-white">
                        Qty: {item.quantity}
                      </p>
                      <p className="mr-5 text-base font-medium text-dark dark:text-white">
                        ${item.price}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="container mx-auto">
          <div className="-mx-4 flex flex-wrap">
            <div className="w-full px-4 sm:w-1/2 lg:w-3/12">
              <div className="mb-10">
                <h3 className="mb-[18px] text-xl font-semibold text-dark dark:text-white md:text-2xl">
                  Shipping Method
                </h3>
                <p className="text-base text-body-color dark:text-dark-6">
                  FedEx - Take up to 3 <br />
                  working days.
                </p>
              </div>
            </div>
            <div className="w-full px-4 sm:w-1/2 lg:w-3/12">
              <div className="mb-10">
                <h3 className="mb-[18px] text-xl font-semibold text-dark dark:text-white md:text-2xl">
                  Payment Method
                </h3>
                <p className="text-base text-body-color dark:text-dark-6">
                  Apply Pay Mastercard <br />
                  **** **** **** 5874
                </p>
              </div>
            </div>

            <div className="w-full px-4 lg:w-6/12">
              <div className="mr-10 text-right md:ml-auto md:max-w-[370px] lg:max-w-[270px]">
                <p className="mb-4 flex justify-between text-base text-dark dark:text-white">
                  <span> Subtotal </span>
                  <span className="font-semibold"> $120.00 </span>
                </p>
                <p className="mb-6 flex justify-between text-base text-dark dark:text-white">
                  <span> Shipping Cost (+) </span>
                  <span className="font-semibold"> $10.00 </span>
                </p>
                <p className="mb-[18px] flex justify-between border-t border-stroke pt-6 text-base text-dark dark:border-dark-3 dark:text-white">
                  <span> Total Payable </span>
                  <span className="font-semibold"> $130.00 </span>
                </p>
                <Link
                  to="/filters"
                  className="flex w-full items-center justify-center rounded-md bg-dark px-10 py-[10px] text-center text-base font-semibold text-white hover:bg-dark/90 dark:bg-dark-2"
                >
                  Continue Shopping
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default OrderSummary;
