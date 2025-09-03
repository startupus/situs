import React from "react";

const PrimaryRoundedButton = () => {
  return (
    <button className="inline-flex items-center justify-center rounded-full border border-primary bg-primary px-7 py-3 text-center text-base font-medium text-white hover:border-[#1B44C8] hover:bg-[#1B44C8] active:border-[#1B44C8] active:bg-[#1B44C8] disabled:border-gray-3 disabled:bg-gray-3 disabled:text-dark-5">
      Get Started
    </button>
  );
};

export default PrimaryRoundedButton;
