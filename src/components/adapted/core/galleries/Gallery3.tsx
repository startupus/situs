/**
 * Gallery3 - Galleries компонент
 * 
 * Адаптировано из TailGrids Pro для редактора Редактус
 * Категория: CoreComponents
 * Подкатегория: Galleries
 * 
 * @component
 * @example
 * <Gallery3 
 *   
 * />
 */

import React from 'react';

export default function Gallery3() {
  return (
    <section className="bg-white py-20 dark:bg-dark">
      <div className="container">
        <div className="break-inside-avoid gap-8 md:columns-2">
          <div className="mb-8 overflow-hidden rounded-xl">
            <img
              src={props.imageSrc || "https://i.ibb.co/JdQMcQL/image-1.jpg"}
              alt={props.imageAlt || "gallery image"}
              className="w-full object-cover object-center"
            />
          </div>
          <div className="mb-8 overflow-hidden rounded-xl">
            <img
              src={props.imageSrc || "https://i.ibb.co/QCGsX6f/image-2.jpg"}
              alt={props.imageAlt || "gallery image"}
              className="w-full object-cover object-center"
            />
          </div>
          <div className="mb-8 overflow-hidden rounded-xl">
            <img
              src={props.imageSrc || "https://i.ibb.co/QMBSTSC/image-3.jpg"}
              alt={props.imageAlt || "gallery image"}
              className="w-full object-cover object-center"
            />
          </div>
          <div className="mb-8 overflow-hidden rounded-xl">
            <img
              src={props.imageSrc || "https://i.ibb.co/yPB7cw4/image-4.jpg"}
              alt={props.imageAlt || "gallery image"}
              className="w-full object-cover object-center"
            />
          </div>
          <div className="mb-8 overflow-hidden rounded-xl">
            <img
              src={props.imageSrc || "https://i.ibb.co/qnG1YZp/image-5.jpg"}
              alt={props.imageAlt || "gallery image"}
              className="w-full object-cover object-center"
            />
          </div>
          <div className="mb-8 overflow-hidden rounded-xl">
            <img
              src={props.imageSrc || "https://i.ibb.co/w7qyhF1/image-6.jpg"}
              alt={props.imageAlt || "gallery image"}
              className="w-full object-cover object-center"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
