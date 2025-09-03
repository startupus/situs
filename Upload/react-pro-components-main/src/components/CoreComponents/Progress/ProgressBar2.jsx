import React from "react";

const ProgressBar2 = () => {
  return (
    <div className="w-full px-4 lg:w-5/12">
      <div className="mb-12">
        <div className="relative h-2.5 w-full rounded-2xl bg-stroke dark:bg-dark-3">
          <div className="absolute left-0 top-0 h-full w-1/2 rounded-2xl bg-primary">
            <span className="rounded-xs absolute -right-4 bottom-full mb-2 bg-primary px-3.5 py-1 text-sm text-white">
              <span className="rounded-xs absolute bottom-[-2px] left-1/2 -z-10 h-2 w-2 -translate-x-1/2 rotate-45 bg-primary"></span>
              50%
            </span>
          </div>
        </div>
      </div>
      <div className="mb-12">
        <div className="relative h-2.5 w-full rounded-2xl bg-stroke dark:bg-dark-3">
          <div className="absolute left-0 top-0 h-full w-[75%] rounded-2xl bg-primary">
            <span className="rounded-xs absolute -right-4 bottom-full mb-2 bg-primary px-3.5 py-1 text-sm text-white">
              <span className="rounded-xs absolute bottom-[-2px] left-1/2 -z-10 h-2 w-2 -translate-x-1/2 rotate-45 bg-primary"></span>
              75%
            </span>
          </div>
        </div>
      </div>
      <div className="mb-12">
        <div className="relative h-2.5 w-full rounded-2xl bg-stroke dark:bg-dark-3">
          <div className="absolute left-0 top-0 h-full w-[90%] rounded-2xl bg-primary">
            <span className="rounded-xs absolute -right-4 bottom-full mb-2 bg-primary px-3.5 py-1 text-sm text-white">
              <span className="rounded-xs absolute bottom-[-2px] left-1/2 -z-10 h-2 w-2 -translate-x-1/2 rotate-45 bg-primary"></span>
              90%
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProgressBar2;
