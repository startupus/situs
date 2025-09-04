import React from 'react';

const SecondaryBadge = () => {
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
          children: 'Secondary',
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
        Secondary
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
          children: 'Secondary',
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
        Secondary
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
        Secondary
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
          children: 'Secondary',
        } as any)}
      />
    </div>
  );
};

export default SecondaryBadge;

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
      } ${bgOpacity && 'bg-secondary/10 text-secondary!'}
`}
    >
      {children}
    </span>
  );
};
