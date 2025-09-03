import React from "react";

const ProgressBar1 = () => {
  return (
    <div className="w-full px-4 lg:w-5/12">
      <div className="mb-8">
        <div className="relative h-2.5 w-full rounded-2xl bg-stroke dark:bg-dark-3">
          <div className="absolute left-0 top-0 h-full w-1/2 rounded-2xl bg-primary"></div>
        </div>
      </div>
      <div className="mb-8">
        <div className="relative h-2.5 w-full rounded-2xl bg-stroke dark:bg-dark-3">
          <div className="absolute left-0 top-0 h-full w-[75%] rounded-2xl bg-primary"></div>
        </div>
      </div>
      <div className="mb-8">
        <div className="relative h-2.5 w-full rounded-2xl bg-stroke dark:bg-dark-3">
          <div className="absolute left-0 top-0 h-full w-[90%] rounded-2xl bg-primary"></div>
        </div>
      </div>
    </div>
  );
};

export default ProgressBar1;
