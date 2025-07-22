/**
 * Services6 - Services компонент
 * 
 * Адаптировано из TailGrids Pro для редактора Редактус
 * Категория: MarketingComponents
 * Подкатегория: Services
 * 
 * @component
 * @example
 * <Services6 
 *   link="value"
 *   image="value"
 *   button="value"
 *   title="value"
 *   details="value"
 * />
 */

import React from 'react';

export default function Services6() {
  return (
    <section className="bg-[#090E34] pb-12 pt-20 dark:bg-dark lg:pb-[90px] lg:pt-[120px]">
      <div className="container mx-auto">
        <div className="-mx-4 mb-10 flex flex-wrap items-end lg:mb-[70px]">
          <div className="w-full px-4 lg:w-8/12">
            <div className="mb-5 max-w-[625px]">
              <span className="mb-2 block text-lg font-semibold text-primary">
                Project Planing
              </span>
              <h2 className="text-3xl font-bold leading-[1.2] text-white sm:text-4xl md:text-[40px]">
                We help our clients to build There Dream Projects
              </h2>
            </div>
          </div>
          <div className="w-full px-4 lg:w-4/12">
            <div className="mb-5 flex lg:justify-end">
              <a
                href={props.href || "/#"}
                className="group relative text-lg font-medium text-white hover:text-primary"
              >
                EXPLORE SERVICES
                <span className="absolute bottom-0 left-0 block h-0.5 w-full bg-white duration-300 ease-linear group-hover:w-full group-hover:bg-primary"></span>
              </a>
            </div>
          </div>
        </div>

        <div className="-mx-4 flex flex-wrap justify-center">
          <ServiceCard
            link="/#"
            image="https://cdn.tailgrids.com/2.0/image/marketing/images/services/services-06/image-01.jpg"
            title="Website Development"
            details="Lorem ipsum is simply dummy text of the printing typesetting lorem ipsum been dummy text."
            button="View Details"
          />
          <ServiceCard
            link="/#"
            image="https://cdn.tailgrids.com/2.0/image/marketing/images/services/services-06/image-02.jpg"
            title="Graphic Design"
            details="Lorem ipsum is simply dummy text of the printing typesetting lorem ipsum been dummy text."
            button="View Details"
          />
          <ServiceCard
            link="/#"
            image="https://cdn.tailgrids.com/2.0/image/marketing/images/services/services-06/image-03.jpg"
            title="App Development"
            details="Lorem ipsum is simply dummy text of the printing typesetting lorem ipsum been dummy text."
            button="View Details"
          />
        </div>
      </div>
    </section>
  );
}

interface Services6Props {
  link: string;
  image: string;
  button: string;
  title: string;
  details: string;
}

const ServiceCard = ({ link, image, button, title, details }) => {
  return (
    <div className="redaktus-component" data-component-type="services6">
    <div className="w-full px-4 md:w-1/2 lg:w-1/3">
      <div className="mb-10 bg-white dark:bg-dark-2">
        <a href={link} className="block w-full">
          <img src={image} alt={props.imageAlt || "image"} className="w-full" />
        </a>
        <div className="p-8 sm:p-11 md:p-8 lg:px-6 xl:p-10 2xl:p-11">
          <h3>
            <a
              href={link}
              className="mb-4 block text-lg font-bold text-dark hover:text-primary dark:text-white sm:text-[22px] sm:leading-[35px]"
            >
              {title}
            </a>
          </h3>
          <p className="mb-8 border-b border-stroke pb-8 text-base text-body-color dark:border-dark-3 dark:text-dark-6">
            {details}
          </p>
          <a
            href={link}
            className="inline-flex items-center text-base text-body-color hover:text-primary dark:text-dark-6"
          >
            {button}
            <span className="ml-3">
              <svg
                width="20"
                height="20"
                viewBox="0 0 20 20"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="fill-current"
              >
                <path
                  d="M18 9.5L11.5312 2.9375C11.25 2.65625 10.8125 2.65625 10.5312 2.9375C10.25 3.21875 10.25 3.65625 10.5312 3.9375L15.7812 9.28125H2.5C2.125 9.28125 1.8125 9.59375 1.8125 9.96875C1.8125 10.3438 2.125 10.6875 2.5 10.6875H15.8437L10.5312 16.0938C10.25 16.375 10.25 16.8125 10.5312 17.0938C10.6562 17.2188 10.8437 17.2812 11.0312 17.2812C11.2187 17.2812 11.4062 17.2188 11.5312 17.0625L18 10.5C18.2812 10.2187 18.2812 9.78125 18 9.5Z"
                  fill=""
                />
              </svg>
            </span>
          </a>
        </div>
      </div>
    </div>
  );
};
