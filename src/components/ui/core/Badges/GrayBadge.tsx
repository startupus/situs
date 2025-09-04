import React from 'react';

const GrayBadge = () => {
  return (
    <div className="flex flex-wrap items-center gap-4">
      <BadgesItem
        {...({
          roundedMd: true,
          outline: false,
          roundedFull: false,
          roundedLg: false,
          roundedNone: false,
          roundedSm: false,
          bgOpacity: false,
          children: 'Gray',
        } as any)}
      />
      <BadgesItem
        {...({
          outline: true,
          roundedMd: true,
          roundedFull: false,
          roundedLg: false,
          roundedNone: false,
          roundedSm: false,
          bgOpacity: false,
        } as any)}
      >
        Gray
      </BadgesItem>
      <BadgesItem
        {...({
          roundedFull: true,
          outline: false,
          roundedLg: false,
          roundedNone: false,
          roundedSm: false,
          roundedMd: false,
          bgOpacity: false,
          children: 'Gray',
        } as any)}
      />
      <BadgesItem
        {...({
          outline: true,
          roundedFull: true,
          roundedLg: false,
          roundedNone: false,
          roundedSm: false,
          roundedMd: false,
          bgOpacity: false,
        } as any)}
      >
        Gray
      </BadgesItem>
      <BadgesItem
        {...({
          roundedFull: true,
          bgOpacity: true,
          outline: false,
          roundedLg: false,
          roundedNone: false,
          roundedSm: false,
          roundedMd: false,
        } as any)}
      >
        Gray
      </BadgesItem>
      <BadgesItem
        {...({
          bgOpacity: true,
          outline: false,
          roundedFull: false,
          roundedLg: false,
          roundedNone: false,
          roundedSm: false,
          roundedMd: false,
          children: 'Gray',
        } as any)}
      />
    </div>
  );
};

export default GrayBadge;

const BadgesItem = ({ children, outline, roundedFull, roundedLg, roundedNone, roundedSm, roundedMd, bgOpacity }) => {
  return (
    <span
      className={`inline-block rounded py-1 px-2.5 text-xs font-medium ${
        outline
          ? `border ${
              (roundedFull && `rounded-full`) ||
              (roundedLg && `rounded-lg`) ||
              (roundedNone && `rounded-none`) ||
              (roundedSm && `rounded-xs`) ||
              (roundedMd && `rounded-md`) ||
              (bgOpacity && `bg-body-color/10 dark:bg-gray/10`)
            } border-body-color text-body-color`
          : `bg-body-color ${
              (roundedFull && `rounded-full`) ||
              (roundedLg && `rounded-lg`) ||
              (roundedNone && `rounded-none`) ||
              (roundedSm && `rounded-xs`) ||
              (roundedMd && `rounded-md`) ||
              (bgOpacity && `bg-body-color/10 dark:bg-gray/10`)
            } text-white`
      } ${bgOpacity && 'bg-body-color/10 dark:bg-gray/10'}
`}
    >
      {children}
    </span>
  );
};
