import React from "react";

const ProgressBar3 = () => {
  return (
    <div className="w-full px-4 lg:w-5/12">
      <div className="mb-8">
        <div className="relative h-4 w-full rounded-2xl bg-stroke dark:bg-dark-3">
          <div className="absolute left-0 top-0 flex h-full w-1/2 items-center justify-center rounded-2xl bg-primary text-xs font-semibold text-white">
            50%
          </div>
        </div>
      </div>
      <div className="mb-8">
        <div className="relative h-4 w-full rounded-2xl bg-stroke dark:bg-dark-3">
          <div className="absolute left-0 top-0 flex h-full w-[75%] items-center justify-center rounded-2xl bg-primary text-xs font-semibold text-white">
            75%
          </div>
        </div>
      </div>
      <div className="mb-8">
        <div className="relative h-4 w-full rounded-2xl bg-stroke dark:bg-dark-3">
          <div className="absolute left-0 top-0 flex h-full w-[90%] items-center justify-center rounded-2xl bg-primary text-xs font-semibold text-white">
            90%
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProgressBar3;
