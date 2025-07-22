/**
 * Filter1 - Filter компонент
 * 
 * Адаптировано из TailGrids Pro для редактора Редактус
 * Категория: EcommerceComponents
 * Подкатегория: Filter
 * 
 * @component
 * @example
 * <Filter1 
 *   title="value"
 *   children="value"
 * />
 */

import React from 'react';

interface Filter1Props {
  title: string;
  children: string;
}

const Filter = () => {
  const [view, setView] = useState("grid");

  return (
    <div className="redaktus-component" data-component-type="filter1">
    <>
      <section className="bg-white pb-12 pt-20 dark:bg-dark lg:pb-[90px] lg:pt-[120px]">
        <div className="container mx-auto">
          <div className="mb-10 rounded-lg border border-stroke bg-white p-[22px] dark:border-dark-3 dark:bg-dark-2">
            <div className="-mx-4 flex flex-wrap items-center justify-between">
              <div className="w-full px-4 sm:w-1/2">
                <div className="mb-4 inline-block sm:mb-0">
                  <div className="relative">
                    <select className="w-full appearance-none rounded-[5px] border border-stroke bg-transparent py-[9px] pl-[18px] pr-10 font-medium text-dark outline-hidden transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-[#F5F7FD] dark:border-dark-3 dark:text-white">
                      <option value="" className="dark:bg-dark-2">
                        Best Selling
                      </option>
                      <option value="" className="dark:bg-dark-2">
                        Newest
                      </option>
                      <option value="" className="dark:bg-dark-2">
                        Oldest
                      </option>
                    </select>
                    <span className="absolute right-4 top-1/2 mt-0.5 -translate-y-1/2 text-dark dark:text-white">
                      <svg
                        width="14"
                        height="14"
                        viewBox="0 0 14 14"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        className="fill-current"
                      >
                        <path
                          d="M6.99998 9.97495C6.86873 9.97495 6.75935 9.9312 6.64998 9.8437L1.61873 4.89995C1.42185 4.70308 1.42185 4.39683 1.61873 4.19995C1.8156 4.00308 2.12185 4.00308 2.31873 4.19995L6.99998 8.77183L11.6812 4.1562C11.8781 3.95933 12.1843 3.95933 12.3812 4.1562C12.5781 4.35308 12.5781 4.65933 12.3812 4.8562L7.34997 9.79995C7.2406 9.90933 7.13123 9.97495 6.99998 9.97495Z"
                          fill=""
                        />
                      </svg>
                    </span>
                  </div>
                </div>
              </div>
              <div className="w-full px-4 sm:w-1/2">
                <div className="flex items-center space-x-4 sm:justify-end">
                  <div className="relative">
                    <button
                      onClick={() => setView("grid")}
                      className={`flex h-11 w-11 cursor-pointer items-center justify-center rounded border ${
                        view === "grid"
                          ? "border-primary bg-primary text-white"
                          : "border-stroke bg-white text-body-color dark:border-dark-3 dark:bg-white/5 dark:text-dark-6"
                      }`}
                    >
                      <svg
                        className="fill-current"
                        width="22"
                        height="22"
                        viewBox="0 0 22 22"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M7.45938 1.1687H3.09375C1.925 1.1687 0.962502 2.1312 0.962502 3.29995V7.66558C0.962502 8.83433 1.925 9.79683 3.09375 9.79683H7.45938C8.62813 9.79683 9.59063 8.83433 9.59063 7.66558V3.33433C9.625 2.1312 8.6625 1.1687 7.45938 1.1687ZM8.07813 7.69995C8.07813 8.0437 7.80313 8.3187 7.45938 8.3187H3.09375C2.75 8.3187 2.475 8.0437 2.475 7.69995V3.33433C2.475 2.99058 2.75 2.71558 3.09375 2.71558H7.45938C7.80313 2.71558 8.07813 2.99058 8.07813 3.33433V7.69995Z"
                          fill=""
                        />
                        <path
                          d="M18.9063 1.1687H14.5406C13.3719 1.1687 12.4094 2.1312 12.4094 3.29995V7.66558C12.4094 8.83433 13.3719 9.79683 14.5406 9.79683H18.9063C20.075 9.79683 21.0375 8.83433 21.0375 7.66558V3.33433C21.0375 2.1312 20.075 1.1687 18.9063 1.1687ZM19.525 7.69995C19.525 8.0437 19.25 8.3187 18.9063 8.3187H14.5406C14.1969 8.3187 13.9219 8.0437 13.9219 7.69995V3.33433C13.9219 2.99058 14.1969 2.71558 14.5406 2.71558H18.9063C19.25 2.71558 19.525 2.99058 19.525 3.33433V7.69995Z"
                          fill=""
                        />
                        <path
                          d="M7.45938 12.1343H3.09375C1.925 12.1343 0.962502 13.0968 0.962502 14.2655V18.6312C0.962502 19.7999 1.925 20.7624 3.09375 20.7624H7.45938C8.62813 20.7624 9.59063 19.7999 9.59063 18.6312V14.2999C9.625 13.0968 8.6625 12.1343 7.45938 12.1343ZM8.07813 18.6655C8.07813 19.0093 7.80313 19.2843 7.45938 19.2843H3.09375C2.75 19.2843 2.475 19.0093 2.475 18.6655V14.2999C2.475 13.9562 2.75 13.6812 3.09375 13.6812H7.45938C7.80313 13.6812 8.07813 13.9562 8.07813 14.2999V18.6655Z"
                          fill=""
                        />
                        <path
                          d="M18.9063 12.1343H14.5406C13.3719 12.1343 12.4094 13.0968 12.4094 14.2655V18.6312C12.4094 19.7999 13.3719 20.7624 14.5406 20.7624H18.9063C20.075 20.7624 21.0375 19.7999 21.0375 18.6312V14.2999C21.0375 13.0968 20.075 12.1343 18.9063 12.1343ZM19.525 18.6655C19.525 19.0093 19.25 19.2843 18.9063 19.2843H14.5406C14.1969 19.2843 13.9219 19.0093 13.9219 18.6655V14.2999C13.9219 13.9562 14.1969 13.6812 14.5406 13.6812H18.9063C19.25 13.6812 19.525 13.9562 19.525 14.2999V18.6655Z"
                          fill=""
                        />
                      </svg>
                    </button>
                  </div>
                  <div className="relative">
                    <button
                      onClick={() => setView("list")}
                      className={`flex h-11 w-11 cursor-pointer items-center justify-center rounded border ${
                        view === "list"
                          ? "border-primary bg-primary text-white"
                          : "border-stroke bg-white text-body-color dark:border-dark-3 dark:bg-white/5 dark:text-dark-6"
                      }`}
                    >
                      <svg
                        className="fill-current"
                        width="22"
                        height="22"
                        viewBox="0 0 22 22"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M5.53438 4.98433H20.8312C21.2437 4.98433 21.6219 4.64058 21.6219 4.1937C21.6219 3.74683 21.2781 3.40308 20.8312 3.40308H5.53438C5.12188 3.40308 4.74375 3.74683 4.74375 4.1937C4.74375 4.64058 5.0875 4.98433 5.53438 4.98433Z"
                          fill=""
                        />
                        <path
                          d="M20.7969 10.2437H5.53438C5.12188 10.2437 4.74375 10.5874 4.74375 11.0343C4.74375 11.4468 5.0875 11.8249 5.53438 11.8249H20.8312C21.2437 11.8249 21.6219 11.4812 21.6219 11.0343C21.5875 10.5874 21.2438 10.2437 20.7969 10.2437Z"
                          fill=""
                        />
                        <path
                          d="M20.7969 17.0156H5.53438C5.12188 17.0156 4.74375 17.3594 4.74375 17.8062C4.74375 18.2531 5.0875 18.5969 5.53438 18.5969H20.8312C21.2437 18.5969 21.6219 18.2531 21.6219 17.8062C21.6219 17.3594 21.2438 17.0156 20.7969 17.0156Z"
                          fill=""
                        />
                        <path
                          d="M2.13125 5.12187C2.64384 5.12187 3.05937 4.70634 3.05937 4.19375C3.05937 3.68116 2.64384 3.26562 2.13125 3.26562C1.61866 3.26562 1.20312 3.68116 1.20312 4.19375C1.20312 4.70634 1.61866 5.12187 2.13125 5.12187Z"
                          fill=""
                        />
                        <path
                          d="M2.13125 11.928C2.64384 11.928 3.05937 11.5125 3.05937 10.9999C3.05937 10.4873 2.64384 10.0718 2.13125 10.0718C1.61866 10.0718 1.20312 10.4873 1.20312 10.9999C1.20312 11.5125 1.61866 11.928 2.13125 11.928Z"
                          fill=""
                        />
                        <path
                          d="M2.13125 18.7344C2.64384 18.7344 3.05937 18.3189 3.05937 17.8063C3.05937 17.2937 2.64384 16.8782 2.13125 16.8782C1.61866 16.8782 1.20312 17.2937 1.20312 17.8063C1.20312 18.3189 1.61866 18.7344 2.13125 18.7344Z"
                          fill=""
                        />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="-mx-4 flex flex-wrap">
            <div className="w-full px-4 lg:w-4/12">
              <SingleSidebarCard title="Product Type">
                <CheckboxGroup id="one" title="Standalone" />
                <CheckboxGroup id="two" title="Mobile" />
                <CheckboxGroup id="three" title="Clothing" />
                <CheckboxGroup id="four" title="Tethered" />
              </SingleSidebarCard>
              <SingleSidebarCard title="Choose Color">
                <ColorCheckbox name="Black" />
                <ColorCheckbox name="Red" />
                <ColorCheckbox name="Blue" />
                <ColorCheckbox name="Green" />
              </SingleSidebarCard>
              <SingleSidebarCard title="Select Size">
                <CheckboxGroup id="m" title="M" />
                <CheckboxGroup id="l" title="L" />
                <CheckboxGroup id="xl" title="XL" />
                <CheckboxGroup id="xxl" title="XXL" />
              </SingleSidebarCard>
            </div>

            <div className="w-full px-4 lg:w-8/12">
              <div className="mb-8 flex h-full items-center justify-center rounded-lg border border-dashed border-stroke py-12 dark:border-dark-3">
                <span className="text-3xl font-semibold text-dark/10 dark:text-white md:text-[44px] md:leading-tight">
                  Products
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
    </div>;
};

export default Filter;

const SingleSidebarCard = ({ title, children }) => {
  return (
    <div className="mb-8 rounded-lg border border-stroke bg-white dark:border-dark-3 dark:bg-dark-2">
      <div className="border-b border-stroke px-8 py-[14px] dark:border-dark-3 lg:px-6 xl:px-8">
        <h3 className="text-lg font-semibold text-dark dark:text-white">
          {title}
        </h3>
      </div>
      <div className="space-y-4 lg:p-6 xl:p-8">{children}</div>
    </div>
  );
};

const CheckboxGroup = ({ title, id }) => {
  return (
    <div>
      <label
        htmlFor={id}
        className="flex cursor-pointer select-none items-center font-medium text-dark dark:text-white"
      >
        <div className="relative">
          <input type="checkbox" id={id} className="sr-only" />
          <div className="box mr-4 flex h-5 w-5 items-center justify-center rounded-sm border">
            <span className="opacity-0">
              <svg
                width="11"
                height="8"
                viewBox="0 0 11 8"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M10.0915 0.951972L10.0867 0.946075L10.0813 0.940568C9.90076 0.753564 9.61034 0.753146 9.42927 0.939309L4.16201 6.22962L1.58507 3.63469C1.40401 3.44841 1.11351 3.44879 0.932892 3.63584C0.755703 3.81933 0.755703 4.10875 0.932892 4.29224L0.932878 4.29225L0.934851 4.29424L3.58046 6.95832C3.73676 7.11955 3.94983 7.2 4.1473 7.2C4.36196 7.2 4.55963 7.11773 4.71406 6.9584L10.0468 1.60234C10.2436 1.4199 10.2421 1.1339 10.0915 0.951972ZM4.2327 6.30081L4.2317 6.2998C4.23206 6.30015 4.23237 6.30049 4.23269 6.30082L4.2327 6.30081Z"
                  fill="#3056D3"
                  stroke="#3056D3"
                  strokeWidth="0.4"
                ></path>
              </svg>
            </span>
          </div>
        </div>
        {title}
      </label>
    </div>
  );
};

const ColorCheckbox = ({ name }) => {
  return (
    <label
      htmlFor={name}
      className="flex cursor-pointer select-none items-center font-medium text-dark dark:text-white"
    >
      <div className="relative">
        <input type="radio" name="color" id={name} className="sr-only" />
        <div
          className={`box mr-4 flex h-5 w-5 items-center justify-center rounded text-white ${
            (name === "Red" && "bg-red-600") ||
            (name === "Black" && "bg-dark") ||
            (name === "Blue" && "bg-primary") ||
            (name === "Green" && "bg-secondary")
          }`}
        >
          <span className="opacity-0">
            <svg
              width="11"
              height="8"
              viewBox="0 0 11 8"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M10.0915 0.951972L10.0867 0.946075L10.0813 0.940568C9.90076 0.753564 9.61034 0.753146 9.42927 0.939309L4.16201 6.22962L1.58507 3.63469C1.40401 3.44841 1.11351 3.44879 0.932892 3.63584C0.755703 3.81933 0.755703 4.10875 0.932892 4.29224L0.932878 4.29225L0.934851 4.29424L3.58046 6.95832C3.73676 7.11955 3.94983 7.2 4.1473 7.2C4.36196 7.2 4.55963 7.11773 4.71406 6.9584L10.0468 1.60234C10.2436 1.4199 10.2421 1.1339 10.0915 0.951972ZM4.2327 6.30081L4.2317 6.2998C4.23206 6.30015 4.23237 6.30049 4.23269 6.30082L4.2327 6.30081Z"
                fill="currentColor"
                stroke="currentColor"
                strokeWidth="0.4"
              ></path>
            </svg>
          </span>
        </div>
      </div>
      {name}
    </label>
  );
};
