import { Link } from "react-router-dom";

const plans = [
  {
    name: "Starter",
    price: 25.0,
    features: [
      "Up to 1 User",
      "All UI components",
      "Lifetime access",
      "Free updates",
    ],
    button: {
      text: "Purchase Now",
      link: "#",
    },
  },
  {
    popular: true,
    name: "Basic",
    price: 59.0,
    features: [
      "Up to 1 User",
      "All UI components",
      "Lifetime access",
      "Free updates",
    ],
    button: {
      text: "Purchase Now",
      link: "#",
    },
  },
  {
    name: "Premium",
    price: 99.0,
    features: [
      "Up to 1 User",
      "All UI components",
      "Lifetime access",
      "Free updates",
    ],
    button: {
      text: "Purchase Now",
      link: "#",
    },
  },
];

const PricingPlans = () => {
  return (
    <>
      <section className="relative z-20 overflow-hidden bg-white pb-12 pt-20 dark:bg-dark lg:pb-[90px] lg:pt-[120px]">
        <div className="container mx-auto">
          <div className="-mx-4 flex flex-wrap">
            <div className="w-full px-4">
              <div className="mx-auto mb-[60px] max-w-[510px] text-center">
                <span className="mb-2 block text-lg font-semibold text-primary">
                  Pricing Table
                </span>
                <h2 className="mb-3 text-3xl font-bold text-dark dark:text-white sm:text-4xl md:text-[40px]">
                  Awesome Pricing Plan
                </h2>
                <p className="text-base text-body-color dark:text-dark-6">
                  There are many variations of passages of Lorem Ipsum available
                  but the majority have suffered alteration in some form.
                </p>
              </div>
            </div>
          </div>

          <div className="-mx-4 flex flex-wrap justify-center">
            {plans.map((item, index) => (
              <div key={index} className="w-full px-4 md:w-1/2 lg:w-1/3">
                <div className="relative z-10 mb-10 overflow-hidden rounded-xl bg-white px-8 py-10 shadow-pricing-2 dark:bg-dark-2 sm:p-12 lg:px-6 lg:py-10 xl:p-14">
                  {item.popular && (
                    <p className="absolute right-[-50px] top-[60px] inline-block -rotate-90 rounded-bl-md rounded-tl-md bg-primary px-5 py-2 text-base font-medium text-white">
                      Recommended
                    </p>
                  )}

                  <span className="mb-5 block text-xl font-medium text-dark dark:text-white">
                    {item.name}
                  </span>

                  <h2 className="mb-11 text-4xl font-semibold text-dark dark:text-white xl:text-[42px]">
                    <span className="text-xl font-medium">$</span>
                    <span className="px-0.5">{item.price}</span>
                    <span className="text-base text-body-color dark:text-dark-6">
                      Per Month
                    </span>
                  </h2>

                  <div className="mb-[50px]">
                    <h5 className="mb-5 text-lg font-medium text-dark dark:text-white">
                      Features
                    </h5>

                    <div className="flex flex-col gap-[14px]">
                      {item.features.map((feature, featureIndex) => (
                        <p
                          key={featureIndex}
                          className="text-base text-body-color dark:text-dark-6"
                        >
                          {feature}
                        </p>
                      ))}
                    </div>
                  </div>
                  <Link
                    to={item.button.link}
                    className="inline-block rounded-md bg-primary px-7 py-3 text-center text-base font-medium text-white transition hover:bg-blue-dark"
                  >
                    {item.button.text}
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
};

export default PricingPlans;
