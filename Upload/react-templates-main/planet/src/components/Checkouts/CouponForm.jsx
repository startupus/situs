const CouponForm = () => {
  return (
    <>
      <div className="mt-4 w-full px-4">
        <h3 className="mb-8 text-xl font-semibold text-dark dark:text-white">
          Apply Coupon to get discount!
        </h3>
        <div className="mb-7 flex max-w-[495px] flex-wrap">
          <input
            type="email"
            className="outline-hidden mb-3 mr-5 h-[50px] w-full max-w-[325px] rounded-md border border-stroke bg-white px-5 text-base text-body-color placeholder:text-dark-6 focus:border-primary focus-visible:shadow-none dark:border-dark-3 dark:bg-dark-2 dark:text-dark-6"
            placeholder="Coupon code"
          />
          <button className="mb-3 h-[50px] rounded-md bg-dark px-7 py-2 text-base font-medium text-white transition hover:bg-dark/90 dark:bg-dark-2">
            Apply Code
          </button>
        </div>
      </div>
    </>
  );
};

export default CouponForm;
