/**
 * OrderedList1 - List компонент
 * 
 * Адаптировано из TailGrids Pro для редактора Редактус
 * Категория: CoreComponents
 * Подкатегория: List
 * 
 * @component
 * @example
 * <OrderedList1 
 *   count="value"
 *   text="value"
 * />
 */

import React from 'react';

interface OrderedList1Props {
  count: string;
  text: string;
}

const OrderedList1: React.FC<OrderedList1Props> = () => {
  return (
    <div className="w-full">
      <ol className="space-y-3">
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

export default OrderedList1;

const ListItem = ({ count, text }) => {
  return (
    <div className="redaktus-component" data-component-type="orderedlist1">
    <li className="text-body-color dark:text-dark-6 flex text-base">
      <span className="bg-primary mr-2.5 flex h-[26px] w-full max-w-[26px] items-center justify-center rounded-full text-base text-white">
        {count}
      </span>
      {text}
    </li>
  );
};
