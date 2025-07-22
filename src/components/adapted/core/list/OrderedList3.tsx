/**
 * OrderedList3 - List компонент
 * 
 * Адаптировано из TailGrids Pro для редактора Редактус
 * Категория: CoreComponents
 * Подкатегория: List
 * 
 * @component
 * @example
 * <OrderedList3 
 *   count="value"
 *   text="value"
 * />
 */

import React from 'react';

interface OrderedList3Props {
  count: string;
  text: string;
}

const OrderedList3: React.FC<OrderedList3Props> = () => {
  return (
    <div className="w-full">
      <ol className="space-y-5">
        <ListItem count={1} text="It is a long established fact reader" />
        <ListItem count={2} text="It is a long established fact reader" />
        <ListItem count={3} text="The point of using Lorem Ipsum" />
        <ListItem count={4} text="There are many variations of passages" />
        <ListItem count={5} text="If you are going to use a of Lorem" />
      </ol>
    </div>
  )
    </div>;
};

export default OrderedList3;

const ListItem = ({ count, text }) => {
  return (
    <div className="redaktus-component" data-component-type="orderedlist3">
    <li className="text-body-color dark:text-dark-6 flex text-base">
      <span className="relative z-10 mr-2.5 flex h-[26px] w-full max-w-[26px] items-center justify-center rounded-sm text-base text-white">
        <span className="bg-primary absolute top-0 left-0 z-[-1] h-full w-full -rotate-45 rounded-sm"></span>
        {count}
      </span>
      {text}
    </li>
  );
};
