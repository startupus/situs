/**
 * Preview - Badge компонент
 * 
 * Адаптировано из TailGrids Pro для редактора Редактус
 * Категория: CoreComponents
 * Подкатегория: Badge
 * 
 * @component
 * @example
 * <Preview 
 *   
 * />
 */

import React from 'react';
import Badge from "./index";

const Preview = () => {
  return (
    <div className="redaktus-component" data-component-type="preview">
    <>
      <div className="container">
        <div className="flex flex-wrap items-center justify-between gap-20 mt-36">
          {/* With background */}
          <Badge label="  Primary" primary roundedMd />
          <Badge secondary label="Secondary" roundedFull />
          <Badge dark label="Dark" roundedMd />
          <Badge gray label="Gray" roundedMd />
          <Badge light label="Light" roundedMd />
          <Badge warning label="Warning" roundedMd />
          <Badge danger label="Danger" roundedMd />
          <Badge success label="Success" roundedMd />
          <Badge info label="Info" roundedMd />

          {/* Without background */}
          <Badge primary outline label="Primary" roundedMd />
          <Badge secondary outline label="Secondary" roundedFull />
          <Badge dark outline label="Dark" roundedFull />
          <Badge gray outline label="Gray" roundedFull />
          <Badge light outline label="Light" roundedFull />
          <Badge warning outline label="Warning" roundedFull />
          <Badge danger outline label="Danger" roundedFull />
          <Badge success outline label="Success" roundedFull />
          <Badge info outline label="Info" roundedFull />
        </div>
      </div>
    </>
  )
    </div>;
};

export default Preview;
