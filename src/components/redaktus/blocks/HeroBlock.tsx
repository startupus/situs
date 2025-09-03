import React from 'react';
import { RichText, Text, Image } from '../editing-components';

export interface HeroBlockProps {
  title: string;
  subtitle: string;
  primaryButtonText: string;
  primaryButtonUrl: string;
  secondaryButtonText: string;
  secondaryButtonUrl: string;
  onUpdate: (updates: Partial<HeroBlockProps>) => void;
}

// Компонент Navbar из оригинального Hero1
const Navbar = () => {
  return (
    <header className="absolute left-0 top-0 z-20 flex w-full items-center">
      <div className="container">
        <div className="relative -mx-4 flex items-center justify-between">
          <div className="w-60 max-w-full px-4">
            <a href="/#" className="block w-full py-5">
              <img src="/images/logos/logo.svg" alt="logo" className="w-full dark:hidden" />
              <img src="/images/logos/logo-white.svg" alt="logo" className="w-full hidden dark:block" />
            </a>
          </div>
          <div className="flex w-full items-center justify-between px-4">
            <div>
              <nav className="absolute right-4 top-full w-full max-w-[250px] rounded-lg bg-white px-6 py-5 shadow dark:bg-dark-2 lg:static lg:block lg:w-full lg:max-w-full lg:bg-transparent lg:shadow-none lg:dark:bg-transparent">
                <ul className="block lg:flex">
                  <li>
                    <a
                      href="/#"
                      className="flex py-2 text-base font-medium text-dark hover:text-primary dark:text-white lg:ml-10 lg:inline-flex"
                    >
                      Home
                    </a>
                  </li>
                  <li>
                    <a
                      href="/#"
                      className="flex py-2 text-base font-medium text-dark hover:text-primary dark:text-white lg:ml-10 lg:inline-flex"
                    >
                      Payment
                    </a>
                  </li>
                  <li>
                    <a
                      href="/#"
                      className="flex py-2 text-base font-medium text-dark hover:text-primary dark:text-white lg:ml-10 lg:inline-flex"
                    >
                      About
                    </a>
                  </li>
                  <li>
                    <a
                      href="/#"
                      className="flex py-2 text-base font-medium text-dark hover:text-primary dark:text-white lg:ml-10 lg:inline-flex"
                    >
                      Blog
                    </a>
                  </li>
                </ul>
              </nav>
            </div>
            <div className="hidden justify-end pr-16 sm:flex lg:pr-0">
              <a href="/#" className="px-7 py-3 text-base font-medium text-dark hover:text-primary dark:text-white">
                Sign in
              </a>
              <a
                href="/#"
                className="rounded-lg bg-primary px-7 py-3 text-base font-medium text-white hover:bg-primary/90"
              >
                Sign Up
              </a>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

// Компонент SingleImage для логотипов клиентов
const SingleImage = ({ href, imgSrc }: { href: string; imgSrc: string }) => {
  return (
    <a href={href} className="flex w-full items-center justify-center">
      <img src={imgSrc} alt="brand image" className="h-10 w-full" />
    </a>
  );
};

export const HeroBlock: React.FC<HeroBlockProps> = ({
  title,
  subtitle,
  primaryButtonText,
  primaryButtonUrl,
  secondaryButtonText,
  secondaryButtonUrl,
  onUpdate,
}) => {
  return (
    <>
      <Navbar />
      <div className="relative bg-white pb-[110px] pt-[120px] dark:bg-dark lg:pt-[150px]">
        <div className="container">
          <div className="-mx-4 flex flex-wrap">
            <div className="w-full px-4 lg:w-5/12">
              <div className="hero-content">
                <RichText
                  propName="title"
                  value={title}
                  onChange={(value) => onUpdate({ title: value })}
                  renderBlock={({ children, onDoubleClick, className }) => (
                    <h1
                      onDoubleClick={onDoubleClick}
                      className={`mb-5 text-4xl font-bold leading-[1.208] text-dark dark:text-white sm:text-[42px] lg:text-[40px] xl:text-5xl ${className}`}
                    >
                      {children}
                    </h1>
                  )}
                />

                <Text
                  propName="subtitle"
                  value={subtitle}
                  onChange={(value) => onUpdate({ subtitle: value })}
                  renderBlock={({ children, onDoubleClick, className }) => (
                    <p
                      onDoubleClick={onDoubleClick}
                      className={`mb-8 max-w-[480px] text-base text-body-color dark:text-dark-6 ${className}`}
                    >
                      {children}
                    </p>
                  )}
                />

                <ul className="flex flex-wrap items-center">
                  <li>
                    <a
                      href={primaryButtonUrl}
                      className="inline-flex items-center justify-center rounded-md bg-primary px-6 py-3 text-center text-base font-medium text-white hover:bg-blue-dark lg:px-7"
                    >
                      <Text
                        propName="primaryButtonText"
                        value={primaryButtonText}
                        onChange={(value) => onUpdate({ primaryButtonText: value })}
                        renderBlock={({ children, onDoubleClick }) => (
                          <span onDoubleClick={onDoubleClick}>{children}</span>
                        )}
                      />
                    </a>
                  </li>
                  <li>
                    <a
                      href={secondaryButtonUrl}
                      className="inline-flex items-center justify-center px-5 py-3 text-center text-base font-medium text-[#464646] hover:text-primary dark:text-white"
                    >
                      <span className="mr-2">
                        <svg width="24" height="25" viewBox="0 0 24 25" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <circle cx="12" cy="12.6152" r="12" fill="#3758F9" />
                          <rect x="7.99893" y="14.979" width="8.18182" height="1.63636" fill="white" />
                          <rect x="11.2717" y="7.61523" width="1.63636" height="4.09091" fill="white" />
                          <path d="M12.0898 14.1606L14.9241 11.0925H9.25557L12.0898 14.1606Z" fill="white" />
                        </svg>
                      </span>
                      <Text
                        propName="secondaryButtonText"
                        value={secondaryButtonText}
                        onChange={(value) => onUpdate({ secondaryButtonText: value })}
                        renderBlock={({ children, onDoubleClick }) => (
                          <span onDoubleClick={onDoubleClick}>{children}</span>
                        )}
                      />
                    </a>
                  </li>
                </ul>

                <div className="clients pt-16">
                  <h6 className="mb-6 flex items-center text-xs font-normal text-body-color dark:text-dark-6">
                    Some Of Our Clients
                    <span className="ml-3 inline-block h-px w-8 bg-body-color"></span>
                  </h6>

                  <div className="flex items-center space-x-4">
                    <SingleImage
                      href="#"
                      imgSrc="https://cdn.tailgrids.com/2.0/image/assets/images/brands/ayroui.svg"
                    />
                    <SingleImage
                      href="#"
                      imgSrc="https://cdn.tailgrids.com/2.0/image/assets/images/brands/graygrids.svg"
                    />
                    <SingleImage
                      href="#"
                      imgSrc="https://cdn.tailgrids.com/2.0/image/assets/images/brands/uideck.svg"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="hidden px-4 lg:block lg:w-1/12"></div>

            <div className="w-full px-4 lg:w-6/12">
              <div className="lg:ml-auto lg:text-right">
                <div className="relative z-10 inline-block pt-11 lg:pt-0">
                  <img
                    src="https://cdn.tailgrids.com/1.0/assets/images/hero/hero-image-01.png"
                    alt="hero"
                    className="max-w-full lg:ml-auto"
                  />
                  <span className="absolute -bottom-8 -left-8 z-[-1]">
                    <svg width="93" height="93" viewBox="0 0 93 93" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <circle cx="2.5" cy="2.5" r="2.5" fill="#3056D3" />
                      <circle cx="2.5" cy="24.5" r="2.5" fill="#3056D3" />
                      <circle cx="2.5" cy="46.5" r="2.5" fill="#3056D3" />
                      <circle cx="2.5" cy="68.5" r="2.5" fill="#3056D3" />
                      <circle cx="2.5" cy="90.5" r="2.5" fill="#3056D3" />
                      <circle cx="24.5" cy="2.5" r="2.5" fill="#3056D3" />
                      <circle cx="24.5" cy="24.5" r="2.5" fill="#3056D3" />
                      <circle cx="24.5" cy="46.5" r="2.5" fill="#3056D3" />
                      <circle cx="24.5" cy="68.5" r="2.5" fill="#3056D3" />
                      <circle cx="24.5" cy="90.5" r="2.5" fill="#3056D3" />
                      <circle cx="46.5" cy="2.5" r="2.5" fill="#3056D3" />
                      <circle cx="46.5" cy="24.5" r="2.5" fill="#3056D3" />
                      <circle cx="46.5" cy="46.5" r="2.5" fill="#3056D3" />
                      <circle cx="46.5" cy="68.5" r="2.5" fill="#3056D3" />
                      <circle cx="46.5" cy="90.5" r="2.5" fill="#3056D3" />
                      <circle cx="68.5" cy="2.5" r="2.5" fill="#3056D3" />
                      <circle cx="68.5" cy="24.5" r="2.5" fill="#3056D3" />
                      <circle cx="68.5" cy="46.5" r="2.5" fill="#3056D3" />
                      <circle cx="68.5" cy="68.5" r="2.5" fill="#3056D3" />
                      <circle cx="68.5" cy="90.5" r="2.5" fill="#3056D3" />
                      <circle cx="90.5" cy="2.5" r="2.5" fill="#3056D3" />
                      <circle cx="90.5" cy="24.5" r="2.5" fill="#3056D3" />
                      <circle cx="90.5" cy="46.5" r="2.5" fill="#3056D3" />
                      <circle cx="90.5" cy="68.5" r="2.5" fill="#3056D3" />
                      <circle cx="90.5" cy="90.5" r="2.5" fill="#3056D3" />
                    </svg>
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Декоративные элементы */}
        <div className="absolute right-0 top-0 z-[-1] opacity-30 lg:opacity-100">
          <svg width="450" height="556" viewBox="0 0 450 556" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="277" cy="63" r="225" fill="url(#paint0_linear_25:217)" />
            <defs>
              <linearGradient
                id="paint0_linear_25:217"
                x1="298.5"
                y1="-48"
                x2="66.5"
                y2="352"
                gradientUnits="userSpaceOnUse"
              >
                <stop stopColor="#3056D3" stopOpacity="0.28" />
                <stop offset="1" stopColor="#C4C4C4" stopOpacity="0" />
              </linearGradient>
            </defs>
          </svg>
        </div>
        <div className="absolute bottom-0 left-0 z-[-1] opacity-30 lg:opacity-100">
          <svg width="364" height="201" viewBox="0 0 364 201" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M5.88928 72.3303C33.6599 66.4798 101.397 64.9086 150.178 105.427C211.155 156.076 229.59 162.093 264.333 166.607C299.076 171.12 337.718 183.657 362.889 212.24"
              stroke="url(#paint0_linear_25:218)"
            />
            <defs>
              <linearGradient
                id="paint0_linear_25:218"
                x1="6.5"
                y1="72.5"
                x2="66.5"
                y2="196"
                gradientUnits="userSpaceOnUse"
              >
                <stop stopColor="#3056D3" stopOpacity="0.28" />
                <stop offset="1" stopColor="#C4C4C4" stopOpacity="0" />
              </linearGradient>
            </defs>
          </svg>
        </div>
      </div>
    </>
  );
};

export default HeroBlock;
