/**
 * PageTitle1 - PageTitles компонент
 * 
 * Адаптировано из TailGrids Pro для редактора Редактус
 * Категория: CoreComponents
 * Подкатегория: PageTitles
 * 
 * @component
 * @example
 * <PageTitle1 
 *   
 * />
 */

import React from 'react';

const PageTitle1 = () => {
  return (
    <div className="redaktus-component" data-component-type="pagetitle1">
    <section className="bg-white py-[70px] dark:bg-dark">
      <div className="mx-auto px-4 sm:container">
        <div className="border-b border-stroke dark:border-dark-3">
          <h2 className="mb-2 text-2xl font-semibold text-dark dark:text-white">
            States Statistics
          </h2>
          <p className="mb-6 text-sm font-medium text-body-color dark:text-dark-6">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras
            ultrices lectus sem.
          </p>
        </div>
      </div>
    </section>
  )
    </div>;
};

export default PageTitle1;
