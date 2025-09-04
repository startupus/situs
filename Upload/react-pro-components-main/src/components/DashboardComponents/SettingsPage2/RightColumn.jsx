import React from "react";

const RightColumn = ({ title, children }) => {
  return (
    <div className="w-full px-5 md:w-1/2">
      <div className="shadow-two rounded-lg border border-stroke bg-white p-7 sm:p-10 md:p-7 lg:p-10">
        <h3 className="mb-7 text-2xl font-semibold text-black">{title}</h3>
        <form>{children}</form>
      </div>
    </div>
  );
};

export default RightColumn;
