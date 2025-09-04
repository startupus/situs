import React from 'react';
import Progress from './Progress';

const Preview = () => {
  return (
    <>
      <Progress
        {...({
          ShowValue: false,
          ShowValueInside: false,
          primary: false,
          secondary: false,
          warning: false,
          danger: false,
          success: false,
          info: false,
        } as any)}
      />
      <Progress
        {...({
          warning: true,
          ShowValue: false,
          ShowValueInside: false,
          primary: false,
          secondary: false,
          danger: false,
          success: false,
          info: false,
        } as any)}
      />
      <Progress
        {...({
          danger: true,
          ShowValue: false,
          ShowValueInside: false,
          primary: false,
          secondary: false,
          warning: false,
          success: false,
          info: false,
        } as any)}
      />
      <Progress
        {...({
          success: true,
          ShowValue: false,
          ShowValueInside: false,
          primary: false,
          secondary: false,
          warning: false,
          danger: false,
          info: false,
        } as any)}
      />
      <Progress
        {...({
          ShowValue: true,
          ShowValueInside: false,
          primary: false,
          secondary: false,
          warning: false,
          danger: false,
          success: false,
          info: false,
        } as any)}
      />
      <Progress
        {...({
          danger: true,
          ShowValue: true,
          value: '70',
          ShowValueInside: false,
          primary: false,
          secondary: false,
          warning: false,
          success: false,
          info: false,
        } as any)}
      />
      <Progress
        {...({
          warning: true,
          ShowValue: true,
          ShowValueInside: false,
          primary: false,
          secondary: false,
          danger: false,
          success: false,
          info: false,
        } as any)}
      />
      <Progress
        {...({
          success: true,
          ShowValue: true,
          value: '90',
          ShowValueInside: false,
          primary: false,
          secondary: false,
          warning: false,
          danger: false,
          info: false,
        } as any)}
      />
      <Progress
        {...({
          warning: true,
          ShowValueInside: true,
          ShowValue: false,
          primary: false,
          secondary: false,
          danger: false,
          success: false,
          info: false,
        } as any)}
      />
      <Progress
        {...({
          success: true,
          ShowValueInside: true,
          ShowValue: false,
          primary: false,
          secondary: false,
          warning: false,
          danger: false,
          info: false,
        } as any)}
      />
      <Progress
        {...({
          danger: true,
          ShowValueInside: true,
          ShowValue: false,
          primary: false,
          secondary: false,
          warning: false,
          success: false,
          info: false,
        } as any)}
      />
      <Progress
        {...({
          primary: true,
          ShowValueInside: true,
          ShowValue: false,
          secondary: false,
          warning: false,
          danger: false,
          success: false,
          info: false,
        } as any)}
      />
    </>
  );
};

export default Preview;
