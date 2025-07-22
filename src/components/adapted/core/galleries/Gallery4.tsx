/**
 * Gallery4 - Galleries компонент
 * 
 * Адаптировано из TailGrids Pro для редактора Редактус
 * Категория: CoreComponents
 * Подкатегория: Galleries
 * 
 * @component
 * @example
 * <Gallery4 
 *   
 * />
 */

import React from 'react';

export default function Gallery4() {
  return (
    <section className="bg-white py-20 dark:bg-dark">
      <div className="container">
        <div className="break-inside-avoid gap-8 md:columns-2 lg:columns-3">
          <div className="mb-8 overflow-hidden rounded-xl">
            <img
              src={props.imageSrc || "https://i.ibb.co/cwr0MLd/image-1.jpg"}
              alt={props.imageAlt || "gallery image"}
              className="w-full object-cover object-center"
            />
          </div>
          <div className="mb-8 overflow-hidden rounded-xl">
            <img
              src={props.imageSrc || "https://i.ibb.co/qjwc7Qq/image-3.jpg"}
              alt={props.imageAlt || "gallery image"}
              className="w-full object-cover object-center"
            />
          </div>
          <div className="mb-8 overflow-hidden rounded-xl">
            <img
              src={props.imageSrc || "https://i.ibb.co/tb5yC4w/image-7.jpg"}
              alt={props.imageAlt || "gallery image"}
              className="w-full object-cover object-center"
            />
          </div>
          <div className="mb-8 overflow-hidden rounded-xl">
            <img
              src={props.imageSrc || "https://i.ibb.co/Tc5MqBD/image-2.jpg"}
              alt={props.imageAlt || "gallery image"}
              className="w-full object-cover object-center"
            />
          </div>
          <div className="mb-8 overflow-hidden rounded-xl">
            <img
              src={props.imageSrc || "https://i.ibb.co/mhWGgxw/image-5.jpg"}
              alt={props.imageAlt || "gallery image"}
              className="w-full object-cover object-center"
            />
          </div>
          <div className="mb-8 overflow-hidden rounded-xl">
            <img
              src={props.imageSrc || "https://i.ibb.co/njyBV8y/image-8.jpg"}
              alt={props.imageAlt || "gallery image"}
              className="w-full object-cover object-center"
            />
          </div>
          <div className="mb-8 overflow-hidden rounded-xl">
            <img
              src={props.imageSrc || "https://i.ibb.co/ssbFsXB/image-3.jpg"}
              alt={props.imageAlt || "gallery image"}
              className="w-full object-cover object-center"
            />
          </div>
          <div className="mb-8 overflow-hidden rounded-xl">
            <img
              src={props.imageSrc || "https://i.ibb.co/H4zC1j4/image-8.jpg"}
              alt={props.imageAlt || "gallery image"}
              className="w-full object-cover object-center"
            />
          </div>
          <div className="mb-8 overflow-hidden rounded-xl">
            <img
              src={props.imageSrc || "https://i.ibb.co/VWbtHkp/image-9.jpg"}
              alt={props.imageAlt || "gallery image"}
              className="w-full object-cover object-center"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
