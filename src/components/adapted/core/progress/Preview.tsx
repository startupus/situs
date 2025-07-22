/**
 * Preview - Progress компонент
 * 
 * Адаптировано из TailGrids Pro для редактора Редактус
 * Категория: CoreComponents
 * Подкатегория: Progress
 * 
 * @component
 * @example
 * <Preview 
 *   
 * />
 */

import React from 'react';
import Progress from "./Progress";

const Preview = () => {
  return (
    <div className="redaktus-component" data-component-type="preview">
    <>
      <Progress />
      <Progress warning />
      <Progress danger />
      <Progress success />
      <Progress ShowValue />
      <Progress danger ShowValue value="70" />
      <Progress warning ShowValue />
      <Progress success ShowValue value="90" />
      <Progress warning ShowValueInside />
      <Progress success ShowValueInside />
      <Progress danger ShowValueInside />
      <Progress primary ShowValueInside />
    </>
  )
    </div>;
};

export default Preview;
