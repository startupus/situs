import React from 'react';

const InfoBadge = () => {
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
          children: 'Info',
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
        Info
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
          children: 'Info',
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
        Info
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
        Info
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
          children: 'Info',
        } as any)}
      />
    </div>
  );
};

export default InfoBadge;

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
              (bgOpacity && `bg-cyan/10`)
            } border-cyan text-cyan`
          : `bg-cyan ${
              (roundedFull && `rounded-full`) ||
              (roundedLg && `rounded-lg`) ||
              (roundedNone && `rounded-none`) ||
              (roundedSm && `rounded-xs`) ||
              (roundedMd && `rounded-md`) ||
              (bgOpacity && `bg-cyan/10`)
            } text-white`
      } ${bgOpacity && 'bg-cyan/10 text-cyan'}
`}
    >
      {children}
    </span>
  );
};
