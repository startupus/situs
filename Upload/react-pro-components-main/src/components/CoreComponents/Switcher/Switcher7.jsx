import React, { useState } from "react";

const Switcher7 = () => {
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
          <div className="block h-8 w-14 rounded-full border border-[#BFCEFF] bg-[#EAEEFB]"></div>
          <div className="dot absolute left-1 top-1 h-6 w-6 rounded-full bg-primary transition"></div>
        </div>
      </label>
    </>
  );
};

export default Switcher7;
