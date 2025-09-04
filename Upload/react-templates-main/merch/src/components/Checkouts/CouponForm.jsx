const CouponForm = () => {
  return (
    <>
      <div className="shadow-testimonial-6 dark:shadow-box-dark mb-10 overflow-hidden rounded-[10px] border border-stroke bg-white px-8 pb-8 pt-6 dark:border-dark-3 dark:bg-dark-2">
        <div className="mb-8 border-b border-stroke pb-4 dark:border-dark-3">
          <h3 className="mb-2 text-lg font-semibold text-dark dark:text-white">
            Coupon Code
          </h3>
          <p className="text-sm text-body-color dark:text-dark-6">
            Enter code to get discount instantly
          </p>
        </div>

        <form className="relative">
          <input
            type="text"
            placeholder="Coupon code"
            className="outline-hidden w-full rounded-lg border border-stroke bg-transparent py-3 pl-5 pr-20 font-medium text-body-color transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-[#F5F7FD] dark:border-dark-3 dark:text-dark-6"
          />
          <button className="absolute right-2 top-1/2 mb-3 h-[34px] -translate-y-1/2 rounded-sm bg-dark px-5 text-sm font-medium text-white transition hover:bg-dark/90">
            Apply
          </button>
        </form>
      </div>
    </>
  );
};

export default CouponForm;
