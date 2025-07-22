/**
 * Gallery1 - Galleries компонент
 * 
 * Адаптировано из TailGrids Pro для редактора Редактус
 * Категория: CoreComponents
 * Подкатегория: Galleries
 * 
 * @component
 * @example
 * <Gallery1 
 *   
 * />
 */

import React from 'react';

export default function Gallery1() {
  return (
    <section className="bg-white py-20 dark:bg-dark">
      <div className="container">
        <div className="grid gap-8 md:grid-cols-2">
          <div className="overflow-hidden rounded-xl">
            <img
              src={props.imageSrc || "https://i.ibb.co/RN970Hg/image-1.jpg"}
              alt={props.imageAlt || "gallery image"}
              className="w-full object-cover object-center"
            />
          </div>
          <div className="overflow-hidden rounded-xl">
            <img
              src={props.imageSrc || "https://i.ibb.co/LNc3hRp/image-2.jpg"}
              alt={props.imageAlt || "gallery image"}
              className="w-full object-cover object-center"
            />
          </div>
          <div className="overflow-hidden rounded-xl">
            <img
              src={props.imageSrc || "https://i.ibb.co/DRsz74R/image-3.jpg"}
              alt={props.imageAlt || "gallery image"}
              className="w-full object-cover object-center"
            />
          </div>
          <div className="overflow-hidden rounded-xl">
            <img
              src={props.imageSrc || "https://i.ibb.co/rmKBwhc/image-4.jpg"}
              alt={props.imageAlt || "gallery image"}
              className="w-full object-cover object-center"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
