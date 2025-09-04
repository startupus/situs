import React from 'react';
import Tooltip from '.';

const Preview = () => {
  return (
    <>
      <div className="container my-28">
        <div className="grid grid-cols-2 gap-12 md:grid-cols-3">
          <Tooltip
            {...({
              position: 'bottom',
              primary: true,
              secondary: false,
              gray: false,
              dark: false,
              warning: false,
              danger: false,
              success: false,
              info: false,
              tooltipsText: 'ToolTip Text',
            } as any)}
          >
            ToolTip On Top
          </Tooltip>
          <Tooltip
            {...({
              position: 'top',
              dark: true,
              primary: false,
              secondary: false,
              gray: false,
              warning: false,
              danger: false,
              success: false,
              info: false,
              tooltipsText: 'ToolTip Text',
            } as any)}
          >
            ToolTip On Top
          </Tooltip>
          <Tooltip
            {...({
              position: 'right',
              warning: true,
              primary: false,
              secondary: false,
              gray: false,
              dark: false,
              danger: false,
              success: false,
              info: false,
              tooltipsText: 'ToolTip Text',
            } as any)}
          >
            ToolTip On Top
          </Tooltip>
          <Tooltip
            {...({
              position: 'left',
              secondary: true,
              primary: false,
              gray: false,
              dark: false,
              warning: false,
              danger: false,
              success: false,
              info: false,
              tooltipsText: 'ToolTip Text',
            } as any)}
          >
            ToolTip On Top
          </Tooltip>
          <Tooltip
            {...({
              primary: false,
              secondary: false,
              gray: true,
              dark: false,
              warning: false,
              danger: false,
              success: false,
              info: false,
              tooltipsText: 'ToolTip Text',
            } as any)}
          >
            ToolTip On Top
          </Tooltip>

          <Tooltip
            {...({
              primary: false,
              secondary: false,
              gray: false,
              dark: false,
              warning: true,
              danger: false,
              success: false,
              info: false,
              tooltipsText: 'ToolTip Text',
            } as any)}
          >
            ToolTip On Top
          </Tooltip>
          <Tooltip
            {...({
              primary: false,
              secondary: false,
              gray: false,
              dark: false,
              warning: false,
              danger: true,
              success: false,
              info: false,
              tooltipsText: 'ToolTip Text',
            } as any)}
          >
            ToolTip On Top
          </Tooltip>
          <Tooltip
            {...({
              primary: false,
              secondary: false,
              gray: false,
              dark: true,
              warning: false,
              danger: false,
              success: false,
              info: false,
              tooltipsText: 'ToolTip Text',
            } as any)}
          >
            ToolTip On Top
          </Tooltip>
          <Tooltip
            {...({
              primary: false,
              secondary: false,
              gray: false,
              dark: true,
              warning: false,
              danger: false,
              success: false,
              info: false,
              tooltipsText: 'ToolTip Text',
            } as any)}
          >
            ToolTip On Top
          </Tooltip>
          <Tooltip
            {...({
              primary: false,
              secondary: false,
              gray: false,
              dark: false,
              warning: false,
              danger: false,
              success: true,
              info: false,
              tooltipsText: 'ToolTip Text',
            } as any)}
          >
            ToolTip On Top
          </Tooltip>
          <Tooltip
            {...({
              primary: false,
              secondary: false,
              gray: false,
              dark: false,
              warning: false,
              danger: false,
              success: false,
              info: true,
              tooltipsText: 'ToolTip Text',
            } as any)}
          >
            ToolTip On Top
          </Tooltip>
          <Tooltip
            {...({
              primary: false,
              secondary: false,
              gray: false,
              dark: true,
              warning: false,
              danger: false,
              success: false,
              info: false,
              tooltipsText: 'ToolTip Text',
            } as any)}
          >
            ToolTip On Top
          </Tooltip>
          <Tooltip
            {...({
              primary: false,
              secondary: false,
              gray: false,
              dark: false,
              warning: true,
              danger: false,
              success: false,
              info: false,
              tooltipsText: 'ToolTip Text',
            } as any)}
          >
            ToolTip On Top
          </Tooltip>
          <Tooltip
            {...({
              primary: false,
              secondary: false,
              gray: false,
              dark: false,
              warning: true,
              danger: false,
              success: false,
              info: false,
              tooltipsText: 'ToolTip Text',
            } as any)}
          >
            ToolTip On Top
          </Tooltip>
          <Tooltip
            {...({
              primary: false,
              secondary: false,
              gray: false,
              dark: false,
              warning: true,
              danger: false,
              success: false,
              info: false,
              tooltipsText: 'ToolTip Text',
            } as any)}
          >
            ToolTip On Top
          </Tooltip>
        </div>
      </div>
    </>
  );
};

export default Preview;
