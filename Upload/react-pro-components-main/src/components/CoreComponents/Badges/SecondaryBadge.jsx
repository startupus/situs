import React from "react";

const SecondaryBadge = () => {
  return (
    <div className="flex flex-wrap items-center gap-4">
      <BadgesItem roundedMd>Secondary</BadgesItem>
      <BadgesItem outline roundedMd>
        Secondary
      </BadgesItem>
      <BadgesItem roundedFull>Secondary</BadgesItem>
      <BadgesItem outline roundedFull>
        Secondary
      </BadgesItem>
      <BadgesItem roundedFull bgOpacity>
        Secondary
      </BadgesItem>
      <BadgesItem bgOpacity>Secondary</BadgesItem>
    </div>
  );
};

export default SecondaryBadge;

const BadgesItem = ({
  children,
  outline,
  roundedFull,
  roundedLg,
  roundedNone,
  roundedSm,
  roundedMd,
  bgOpacity,
}) => {
  return (
    <span
      className={`inline-block rounded px-2.5 py-1 text-xs font-medium ${
        outline
          ? `border ${
              (roundedFull && `rounded-full`) ||
              (roundedLg && `rounded-lg`) ||
              (roundedNone && `rounded-none`) ||
              (roundedSm && `rounded-xs`) ||
              (roundedMd && `rounded-md`) ||
              (bgOpacity && `bg-secondary/10`)
            } border-secondary text-secondary`
          : `bg-secondary ${
              (roundedFull && `rounded-full`) ||
              (roundedLg && `rounded-lg`) ||
              (roundedNone && `rounded-none`) ||
              (roundedSm && `rounded-xs`) ||
              (roundedMd && `rounded-md`) ||
              (bgOpacity && `bg-secondary/10`)
            } text-white`
      } ${bgOpacity && "text-secondary! bg-secondary/10"} `}
    >
      {children}
    </span>
  );
};
