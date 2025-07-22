/**
 * Hero12 - Hero компонент
 * 
 * Адаптировано из TailGrids Pro для редактора Редактус
 * Категория: MarketingComponents
 * Подкатегория: Hero
 * 
 * @component
 * @example
 * <Hero12 
 *   children="value"
 *   NavLink="value"
 * />
 */

import React from 'react';

interface Hero12Props {
  children: string;
  NavLink: string;
}

const Hero12: React.FC<Hero12Props> = () => {
  return (
    <>
      <Navbar />

      <div className="relative pb-[110px] pt-[150px] dark:bg-dark lg:pt-[170px]">
        <div className="container mx-auto">
          <div className="-mx-4 flex flex-wrap items-center">
            <div className="w-full px-4 lg:w-1/2">
              <div className="mb-12 lg:mb-0">
                <h2 className="mb-5 text-3xl font-bold leading-[1.208]! text-dark dark:text-white lg:text-[38px] xl:text-[40px]">
                  Build beautiful website with TailGrids blocks.
                </h2>
                <p className="mb-8 max-w-[485px] text-base text-body-color dark:text-dark-6">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                  Aliquam at egestas tortor. Morbi sed odio id purus
                  pellentesque iaculis nulla facilisi.
                </p>

                <p className="mb-5 text-base font-medium text-dark dark:text-white">
                  Subscribe to get notified when we launch 🎉
                </p>
                <form className="mb-7 flex max-w-[455px] flex-wrap">
                  <input
                    type="email"
                    className="mb-3 mr-3 h-[52px] w-full rounded-md border border-stroke bg-white px-5 text-base text-body-color outline-hidden placeholder:text-dark-6 focus:border-primary focus-visible:shadow-none dark:border-dark-3 dark:bg-dark-2 sm:max-w-[220px] md:max-w-[315px] lg:max-w-[250px] xl:max-w-[300px]"
                    placeholder="Your work mail"
                  />
                  <button className="mb-3 h-[52px] rounded-md bg-primary px-7 text-base font-medium text-white transition hover:bg-blue-dark">
                    Notify Me!
                  </button>
                </form>
              </div>
            </div>
            <div className="w-full px-4 lg:w-1/2">
              <div className="-mx-2 flex flex-wrap sm:-mx-4">
                <div className="w-1/2 px-2 sm:px-4">
                  <div className="mb-4 h-[256px] sm:mb-8 sm:h-[442px] lg:h-[332px] xl:h-[442px]">
                    <img
                      src={props.imageSrc || "https://cdn.tailgrids.com/2.0/image/marketing/images/hero/hero-12/image-1.jpg"}
                      alt={props.imageAlt || "hero image"}
                      className="h-full w-full object-cover object-center"
                    />
                  </div>
                </div>
                <div className="w-1/2 px-2 sm:px-4">
                  <div className="mb-4 h-[120px] sm:mb-8 sm:h-[205px] lg:h-[150px] xl:h-[205px]">
                    <img
                      src={props.imageSrc || "https://cdn.tailgrids.com/2.0/image/marketing/images/hero/hero-12/image-2.jpg"}
                      alt={props.imageAlt || "hero image"}
                      className="h-full w-full object-cover object-center"
                    />
                  </div>
                  <div className="mb-4 h-[120px] sm:mb-8 sm:h-[205px] lg:h-[150px] xl:h-[205px]">
                    <img
                      src={props.imageSrc || "https://cdn.tailgrids.com/2.0/image/marketing/images/hero/hero-12/image-3.jpg"}
                      alt={props.imageAlt || "hero image"}
                      className="h-full w-full object-cover object-center"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
    </div>;
};

export default Hero12;

const Navbar = () => {
  const [open, setOpen] = useState(false);

  return (
    <div className="redaktus-component" data-component-type="hero12">
    <header className="absolute left-0 top-0 z-50 w-full">
      <div className="container mx-auto">
        <div className="relative z-40 -mx-4 flex items-center justify-between">
          <div className="w-60 max-w-full px-4">
            <a href={props.href || "/#"} className="block w-full py-5">
              <img
                src={props.imageSrc || "https://cdn.tailgrids.com/2.0/image/assets/images/logo/logo.svg"}
                alt={props.imageAlt || "logo"}
                className="w-full dark:hidden"
              />
              <img
                src={props.imageSrc || "https://cdn.tailgrids.com/2.0/image/assets/images/logo/logo-white.svg"}
                alt={props.imageAlt || "logo"}
                className="w-full hidden dark:block"
              />
            </a>
          </div>
          <div className="flex w-full items-center justify-between px-4">
            <div>
              <button
                onClick={() => setOpen(!open)}
                className={` ${
                  open && "navbarTogglerActive"
                } absolute right-4 top-1/2 block -translate-y-1/2 rounded-lg px-3 py-[6px] ring-primary focus:ring-2 lg:hidden`}
              >
                <span className="relative my-[6px] block h-[2px] w-[30px] bg-body-color dark:bg-white"></span>
                <span className="relative my-[6px] block h-[2px] w-[30px] bg-body-color dark:bg-white"></span>
                <span className="relative my-[6px] block h-[2px] w-[30px] bg-body-color dark:bg-white"></span>
              </button>
              <nav
                className={`absolute right-4 top-full z-40 w-full max-w-[250px] rounded-lg bg-white px-6 py-5 shadow dark:bg-dark-2 lg:static lg:block lg:w-full lg:max-w-full lg:bg-transparent lg:shadow-none lg:dark:bg-transparent ${
                  !open && "hidden"
                } `}
              >
                <ul className="block lg:flex">
                  <ListItem NavLink="/#">About Us</ListItem>
                  <ListItem NavLink="/#">Services</ListItem>
                  <ListItem NavLink="/#">Pricing</ListItem>
                  <ListItem NavLink="/#">Support</ListItem>
                </ul>
              </nav>
            </div>
            <div className="hidden justify-end pr-16 sm:flex lg:pr-0">
              <a
                href={props.href || "/#"}
                className="rounded-md bg-dark px-7 py-3 text-base font-medium text-white hover:bg-body-color dark:bg-dark-2 dark:hover:bg-dark-3"
              >
                Get Started
              </a>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

const ListItem = ({ children, NavLink }) => {
  return (
    <>
      <li>
        <a
          href={NavLink}
          className="flex py-2 text-base font-medium text-dark hover:text-primary dark:text-white lg:ml-10 lg:inline-flex"
        >
          {children}
        </a>
      </li>
    </>
  );
};
