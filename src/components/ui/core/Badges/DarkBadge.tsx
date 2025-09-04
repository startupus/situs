import React from 'react';

const DarkBadge = () => {
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
          children: 'Dark',
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
        Dark
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
          children: 'Dark',
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
        Dark
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
        Dark
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
          children: 'Dark',
        } as any)}
      />
    </div>
  );
};

export default DarkBadge;

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
              (bgOpacity && `bg-dark/10`)
            } border-dark text-dark dark:text-dark-4 dark:border-dark-4`
          : `bg-dark dark:bg-dark-2 ${
              (roundedFull && `rounded-full`) ||
              (roundedLg && `rounded-lg`) ||
              (roundedNone && `rounded-none`) ||
              (roundedSm && `rounded-xs`) ||
              (roundedMd && `rounded-md`) ||
              (bgOpacity && `bg-dark/10`)
            } text-white`
      } ${bgOpacity && 'bg-dark/10'}
`}
    >
      {children}
    </span>
  );
};
