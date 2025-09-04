import React, { useState } from "react";

const Switcher8 = () => {
  const [isChecked, setIsChecked] = useState(false);

  const handleCheckboxChange = () => {
    setIsChecked(!isChecked);
  };

  return (
    <>
      <label className="flex cursor-pointer select-none items-center">
        <div className="relative">
          <input
            type="checkbox"
            checked={isChecked}
            onChange={handleCheckboxChange}
            className="sr-only"
          />
          <div
            className={`box h-5 w-14 rounded-full shadow-inner transition ${
              isChecked ? "bg-[#EAEEFB]" : "bg-dark"
            }`}
          ></div>
          <div className="dot shadow-switch-1 absolute -top-1 left-0 flex h-7 w-7 items-center justify-center rounded-full bg-white transition">
            <span
              className={`active h-4 w-4 rounded-full border ${
                isChecked ? "border-white bg-primary" : "border-dark bg-white"
              }`}
            ></span>
          </div>
        </div>
      </label>
    </>
  );
};

export default Switcher8;
