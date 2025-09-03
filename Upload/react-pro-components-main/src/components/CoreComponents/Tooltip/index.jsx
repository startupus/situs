import React from "react";

const Tooltip = ({
  children,
  tooltipsText,
  primary,
  secondary,
  gray,
  dark,
  warning,
  danger,
  success,
  info,
  position = "top",
}) => {
  return (
    <>
      <div>
        <div className="group relative inline-block">
          <button
            className={`inline-flex rounded bg-primary ${
              (secondary && `bg-secondary`) ||
              (gray && `bg-body-color`) ||
              (dark && `bg-dark`) ||
              (warning && `bg-warning`) ||
              (danger && `bg-danger`) ||
              (success && `bg-success`) ||
              (info && `bg-info`)
            } px-[18px] py-2 text-base font-semibold text-white`}
          >
            {children}
          </button>
          <div
            className={` ${
              (position === "right" &&
                `absolute left-full top-1/2 z-20 ml-3 -translate-y-1/2 whitespace-nowrap rounded-sm px-4 py-[6px] text-sm font-semibold text-white opacity-0 group-hover:opacity-100`) ||
              (position === "top" &&
                `absolute bottom-full left-1/2 z-20 mb-3 -translate-x-1/2 whitespace-nowrap rounded-sm px-4 py-[6px] text-sm font-semibold text-white opacity-0 group-hover:opacity-100`) ||
              (position === "left" &&
                `absolute right-full top-1/2 z-20 mr-3 -translate-y-1/2 whitespace-nowrap rounded-sm px-4 py-[6px] text-sm font-semibold text-white opacity-0 group-hover:opacity-100`) ||
              (position === "bottom" &&
                `absolute left-1/2 top-full z-20 mt-3 -translate-x-1/2 whitespace-nowrap rounded-sm px-4 py-[6px] text-sm font-semibold text-white opacity-0 group-hover:opacity-100`)
            } ${
              (primary ? `bg-dark` : ``) ||
              (secondary && `bg-secondary`) ||
              (gray && `bg-body-color`) ||
              (dark ? `bg-primary` : ``) ||
              (warning && `bg-warning`) ||
              (danger && `bg-danger`) ||
              (success && `bg-success`) ||
              (info && `bg-info`)
            }`}
          >
            <span
              className={` ${
                (position === "right" &&
                  `rounded-xs absolute left-[-3px] top-1/2 -z-10 h-2 w-2 -translate-y-1/2 rotate-45`) ||
                (position === "top" &&
                  `rounded-xs absolute bottom-[-3px] left-1/2 -z-10 h-2 w-2 -translate-x-1/2 rotate-45`) ||
                (position === "left" &&
                  `rounded-xs absolute right-[-3px] top-1/2 -z-10 h-2 w-2 -translate-y-1/2 rotate-45`) ||
                (position === "bottom" &&
                  `rounded-xs absolute left-1/2 top-[-3px] -z-10 h-2 w-2 -translate-x-1/2 rotate-45`)
              } ${
                (primary ? `bg-dark` : ``) ||
                (secondary && `bg-secondary`) ||
                (gray && `bg-body-color`) ||
                (dark ? `bg-primary` : ``) ||
                (warning && `bg-warning`) ||
                (danger && `bg-danger`) ||
                (success && `bg-success`) ||
                (info && `bg-info`)
              }`}
            ></span>
            {tooltipsText}
          </div>
        </div>
      </div>
    </>
  );
};

export default Tooltip;
