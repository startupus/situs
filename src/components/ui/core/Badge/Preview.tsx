import React from 'react';
import Badge from './index';

const Preview = () => {
  return (
    <>
      <div className="container">
        <div className="flex flex-wrap items-center justify-between gap-20 mt-36">
          {/* With background */}
          <Badge {...({ label: 'Primary', primary: true, roundedMd: true } as any)} />
          <Badge {...({ secondary: true, label: 'Secondary', roundedFull: true } as any)} />
          <Badge {...({ dark: true, label: 'Dark', roundedMd: true } as any)} />
          <Badge {...({ gray: true, label: 'Gray', roundedMd: true } as any)} />
          <Badge {...({ light: true, label: 'Light', roundedMd: true } as any)} />
          <Badge {...({ warning: true, label: 'Warning', roundedMd: true } as any)} />
          <Badge {...({ danger: true, label: 'Danger', roundedMd: true } as any)} />
          <Badge {...({ success: true, label: 'Success', roundedMd: true } as any)} />
          <Badge {...({ info: true, label: 'Info', roundedMd: true } as any)} />

          {/* Without background */}
          <Badge {...({ primary: true, outline: true, label: 'Primary', roundedMd: true } as any)} />
          <Badge {...({ secondary: true, outline: true, label: 'Secondary', roundedFull: true } as any)} />
          <Badge {...({ dark: true, outline: true, label: 'Dark', roundedFull: true } as any)} />
          <Badge {...({ gray: true, outline: true, label: 'Gray', roundedFull: true } as any)} />
          <Badge {...({ light: true, outline: true, label: 'Light', roundedFull: true } as any)} />
          <Badge {...({ warning: true, outline: true, label: 'Warning', roundedFull: true } as any)} />
          <Badge {...({ danger: true, outline: true, label: 'Danger', roundedFull: true } as any)} />
          <Badge {...({ success: true, outline: true, label: 'Success', roundedFull: true } as any)} />
          <Badge {...({ info: true, outline: true, label: 'Info', roundedFull: true } as any)} />
        </div>
      </div>
    </>
  );
};

export default Preview;
