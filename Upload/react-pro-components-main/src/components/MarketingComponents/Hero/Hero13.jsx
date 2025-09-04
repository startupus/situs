import React, { useState } from "react";

const Hero13 = () => {
  return (
    <>
      <Navbar />

      <div
        className="relative z-10 bg-cover bg-center bg-no-repeat pb-20 pt-[120px] md:pt-[150px]"
        style={{
          backgroundImage: `url('https://cdn.tailgrids.com/2.0/image/marketing/images/hero/hero-bg-13.jpg')`,
        }}
      >
        <div className="absolute left-0 top-0 -z-10 h-full w-full bg-[#090E34]/[85%]"></div>
        <div className="container mx-auto">
          <div className="-mx-4 flex flex-wrap items-center">
            <div className="w-full px-4 lg:w-1/2">
              <div className="mb-16 max-w-[500px] lg:mb-0">
                <span className="mb-5 block text-base font-semibold text-white sm:text-lg md:text-xl">
                  Digital Marketing
                </span>
                <h1 className="leading-[1.208]! mb-4 text-3xl font-bold text-white sm:text-4xl lg:text-[42px] xl:text-5xl">
                  Grow your website traffic with TailGrids.
                </h1>
                <p className="mb-9 text-base text-white">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin
                  posuere arcu sit amet ligula feugiat eleifend.
                </p>
                <ul className="flex flex-wrap items-center gap-3">
                  <li>
                    <a
                      href="/#"
                      className="inline-flex items-center justify-center rounded-md bg-primary px-7 py-3 text-center text-base font-medium text-white hover:bg-blue-dark"
                    >
                      Discover More
                    </a>
                  </li>
                  <li>
                    <a
                      href="/#"
                      className="inline-flex items-center rounded-md bg-white/5 px-6 py-3 text-base font-medium text-white hover:bg-gray-2 hover:text-body-color"
                    >
                      Explore Services
                      <span className="ml-2">
                        <svg
                          width="20"
                          height="20"
                          viewBox="0 0 20 20"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                          className="fill-current"
                        >
                          <path
                            d="M18 9.5L11.5312 2.9375C11.25 2.65625 10.8125 2.65625 10.5312 2.9375C10.25 3.21875 10.25 3.65625 10.5312 3.9375L15.7812 9.28125H2.5C2.125 9.28125 1.8125 9.59375 1.8125 9.96875C1.8125 10.3437 2.125 10.6875 2.5 10.6875H15.8437L10.5312 16.0938C10.25 16.375 10.25 16.8125 10.5312 17.0938C10.6562 17.2188 10.8437 17.2813 11.0312 17.2813C11.2187 17.2813 11.4062 17.2188 11.5312 17.0625L18 10.5C18.2812 10.2187 18.2812 9.78125 18 9.5Z"
                            fill=""
                          />
                        </svg>
                      </span>
                    </a>
                  </li>
                </ul>
              </div>
            </div>
            <div className="w-full px-4 lg:w-1/2">
              <div className="mx-auto max-w-[460px] rounded-[10px] bg-white px-6 py-10 dark:bg-dark-2 sm:px-10">
                <h2 className="leading-[1.43]! mb-2.5 text-2xl font-bold text-dark dark:text-white sm:text-3xl lg:text-2xl xl:text-[28px]">
                  Sign up to TailGrids
                </h2>
                <p className="mb-8 text-base font-medium text-body-color dark:text-dark-6">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                </p>
                <div className="mb-6 flex items-center space-x-4">
                  <button className="shadow-btn-2 flex h-[50px] w-[50px] items-center justify-center rounded-md border border-stroke bg-transparent text-sm font-medium text-body-color dark:border-dark-3 dark:text-dark-6 sm:w-auto sm:px-7">
                    <span className="sm:pr-3">
                      <svg
                        width="18"
                        height="18"
                        viewBox="0 0 18 18"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <g clipPath="url(#clip0_1416_409)">
                          <path
                            d="M18 9.19932C18.0109 8.58059 17.9457 7.96284 17.806 7.35938H9.18372V10.6993H14.2449C14.149 11.2849 13.9333 11.8455 13.6106 12.3473C13.288 12.8491 12.8651 13.2818 12.3674 13.6193L12.3497 13.7311L15.0761 15.8009L15.2649 15.8194C16.9995 14.2493 17.9997 11.9393 17.9997 9.19932"
                            fill="#4285F4"
                          />
                          <path
                            d="M9.18382 18.0003C11.6633 18.0003 13.745 17.2003 15.2655 15.8203L12.3675 13.6202C11.592 14.1503 10.5512 14.5203 9.18382 14.5203C8.02249 14.5137 6.89279 14.1488 5.955 13.4775C5.0172 12.8061 4.31894 11.8624 3.95927 10.7803L3.85164 10.7893L1.01679 12.9392L0.979736 13.0402C1.74323 14.5314 2.91494 15.7851 4.36385 16.661C5.81276 17.537 7.48174 18.0007 9.18417 18.0003"
                            fill="#34A853"
                          />
                          <path
                            d="M3.95921 10.7798C3.75834 10.2069 3.65469 9.60558 3.65239 8.99982C3.65609 8.39505 3.75591 7.79453 3.94828 7.21988L3.94316 7.10057L1.07355 4.91602L0.979681 4.95976C0.335608 6.21294 0.00012207 7.59658 0.00012207 8.99973C0.00012207 10.4029 0.335608 11.7865 0.979681 13.0397L3.95921 10.7798Z"
                            fill="#FBBC05"
                          />
                          <path
                            d="M9.1838 3.47965C10.4997 3.45963 11.7725 3.93991 12.7348 4.81971L15.3267 2.33965C13.6644 0.811346 11.463 -0.0272143 9.1838 -0.000350488C7.48139 -0.000747434 5.81242 0.462942 4.36352 1.33887C2.91461 2.2148 1.74289 3.46843 0.97937 4.95959L3.94902 7.21971C4.31223 6.13773 5.01281 5.19476 5.95199 4.52376C6.89117 3.85275 8.02156 3.48755 9.1838 3.47965Z"
                            fill="#EB4335"
                          />
                        </g>
                        <defs>
                          <clipPath id="clip0_1416_409">
                            <rect width="18" height="18" fill="white" />
                          </clipPath>
                        </defs>
                      </svg>
                    </span>
                    <span className="hidden sm:inline-flex">
                      Sign up with Google
                    </span>
                  </button>
                  <button className="flex h-[50px] w-[50px] items-center justify-center rounded-md bg-[#03A9F4]">
                    <svg
                      width="23"
                      height="18"
                      viewBox="0 0 23 18"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <g clipPath="url(#clip0_1416_400)">
                        <path
                          d="M22.8462 2.13028C21.9868 2.49377 21.0779 2.73537 20.1474 2.84761C21.128 2.28345 21.8611 1.39009 22.2078 0.336823C21.2899 0.86471 20.2857 1.2365 19.2386 1.43611C18.5964 0.77076 17.7626 0.308154 16.8457 0.108441C15.9287 -0.0912717 14.971 -0.0188534 14.0971 0.31628C13.2232 0.651413 12.4734 1.23376 11.9454 1.9876C11.4173 2.74144 11.1353 3.63191 11.1361 4.54322C11.1325 4.89097 11.1689 5.23803 11.2447 5.57795C9.38141 5.48937 7.55838 5.02044 5.89479 4.20183C4.23121 3.38322 2.76452 2.23336 1.59061 0.82742C0.987918 1.82652 0.801149 3.011 1.06842 4.13909C1.3357 5.26719 2.03687 6.25384 3.02882 6.89768C2.28774 6.87826 1.56234 6.68639 0.913726 6.33825V6.38774C0.914945 7.43656 1.28875 8.45295 1.97222 9.26583C2.6557 10.0787 3.6071 10.6384 4.66629 10.8508C4.26559 10.9532 3.85262 11.0035 3.43824 11.0004C3.1407 11.0055 2.84345 10.9795 2.55166 10.9228C2.85437 11.8242 3.43776 12.6124 4.22154 13.179C5.00531 13.7456 5.95093 14.0627 6.92822 14.0866C5.27035 15.3438 3.22573 16.0259 1.12111 16.0238C0.74641 16.0262 0.371941 16.0053 0 15.9612C2.14164 17.2995 4.63724 18.0074 7.18501 17.9994C15.8036 17.9994 20.5158 11.0764 20.5158 5.07543C20.5158 4.87456 20.5086 4.68088 20.4986 4.48833C21.4225 3.84724 22.218 3.04815 22.8462 2.13028Z"
                          fill="white"
                        />
                      </g>
                      <defs>
                        <clipPath id="clip0_1416_400">
                          <rect width="22.8462" height="18" fill="white" />
                        </clipPath>
                      </defs>
                    </svg>
                  </button>
                  <button className="flex h-[50px] w-[50px] items-center justify-center rounded-md bg-[#0080FF]">
                    <svg
                      width="10"
                      height="20"
                      viewBox="0 0 10 20"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <g clipPath="url(#clip0_1416_404)">
                        <path
                          d="M6.4908 19.9982V10.8773H9.43911L9.88051 7.3228H6.4908V5.05333C6.4908 4.02423 6.76604 3.32284 8.18733 3.32284L10 3.32197V0.14284C9.68636 0.0996795 8.61042 0.00292969 7.35864 0.00292969C4.74517 0.00292969 2.95593 1.65936 2.95593 4.70148V7.3229H0V10.8774H2.95584V19.9983L6.4908 19.9982Z"
                          fill="white"
                        />
                      </g>
                      <defs>
                        <clipPath id="clip0_1416_404">
                          <rect width="10" height="20" fill="white" />
                        </clipPath>
                      </defs>
                    </svg>
                  </button>
                </div>
                <div className="relative z-10 mb-8 flex items-center justify-center">
                  <span className="bg-form-stroke absolute left-0 top-1/2 -z-10 hidden h-px w-full -translate-y-1/2 sm:block"></span>
                  <p className="bg-white text-base font-medium text-body-color dark:bg-dark-2 dark:text-dark-6 sm:px-4">
                    Or create account with email
                  </p>
                </div>
                <form>
                  <div className="-mx-2 flex flex-wrap">
                    <div className="w-full px-2 sm:w-1/2">
                      <div className="mb-4">
                        <InputBox
                          labelTitle="Full Name"
                          type="text"
                          name="name"
                          placeholder=""
                        />
                      </div>
                    </div>
                    <div className="w-full px-2 sm:w-1/2">
                      <div className="mb-4">
                        <InputBox
                          labelTitle="Email address"
                          type="email"
                          name="email"
                          placeholder=""
                        />
                      </div>
                    </div>
                    <div className="w-full px-2">
                      <div className="mb-6">
                        <InputBox
                          labelTitle="Password"
                          type="password"
                          name="password"
                          placeholder=""
                        />
                      </div>
                    </div>
                    <div className="w-full px-2">
                      <button
                        type="submit"
                        className="flex w-full items-center justify-center rounded-md bg-primary px-3 py-3 text-sm font-medium text-white hover:bg-blue-dark"
                      >
                        Create Account
                      </button>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Hero13;

const InputBox = ({ labelTitle, type, name, placeholder }) => {
  return (
    <>
      <label
        htmlFor={name}
        className="mb-2 block text-base font-medium text-dark dark:text-white"
      >
        {labelTitle}
      </label>
      <input
        type={type}
        name={name}
        placeholder={placeholder}
        className="outline-hidden w-full rounded-md border border-stroke bg-transparent px-5 py-2.5 text-base font-medium text-body-color focus:border-primary dark:border-dark-3 dark:text-dark-6"
      />
    </>
  );
};

const Navbar = () => {
  const [open, setOpen] = useState(false);

  return (
    <header className="absolute left-0 top-0 z-50 w-full">
      <div className="container mx-auto">
        <div className="relative -mx-4 flex items-center justify-between">
          <div className="w-60 max-w-full px-4">
            <a href="/#" className="block w-full py-5">
              <img
                src="https://cdn.tailgrids.com/2.0/image/assets/images/logo/logo-white.svg"
                alt="logo"
                className="w-full"
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
                <span className="relative my-[6px] block h-[2px] w-[30px] bg-white"></span>
                <span className="relative my-[6px] block h-[2px] w-[30px] bg-white"></span>
                <span className="relative my-[6px] block h-[2px] w-[30px] bg-white"></span>
              </button>
              <nav
                className={`absolute right-4 top-full w-full max-w-[250px] rounded-lg bg-white px-6 py-5 shadow dark:bg-dark-2 lg:static lg:block lg:w-full lg:max-w-full lg:bg-transparent lg:shadow-none lg:dark:bg-transparent ${
                  !open && "hidden"
                } `}
              >
                <ul className="block lg:flex">
                  <ListItem NavLink="/#">About Us</ListItem>
                  <ListItem NavLink="/#">Services</ListItem>
                  <ListItem NavLink="/#">Blog</ListItem>
                  <ListItem NavLink="/#">Contact</ListItem>
                </ul>
              </nav>
            </div>
            <div className="hidden justify-end pr-16 sm:flex lg:pr-0">
              <a
                href="/#"
                className="shadow-1 rounded-md bg-white px-7 py-3 text-base font-medium text-primary hover:bg-gray-2 hover:text-body-color dark:shadow-none"
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
    <li>
      <a
        href={NavLink}
        className="flex py-2 text-base font-medium text-dark hover:text-primary dark:text-white lg:ml-10 lg:inline-flex lg:text-white"
      >
        {children}
      </a>
    </li>
  );
};
