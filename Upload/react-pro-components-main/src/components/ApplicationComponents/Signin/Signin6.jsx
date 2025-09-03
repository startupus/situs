import React, { useState } from "react";

const Signin6 = () => {
  const [isChecked, setIsChecked] = useState(false);

  return (
    <section className="bg-white py-20 dark:bg-dark lg:py-[120px]">
      <div className="container mx-auto">
        <div className="-mx-4 flex flex-wrap">
          <div className="w-full px-4">
            <div className="mx-auto max-w-[630px] rounded-[20px] border border-stroke bg-white px-6 py-10 dark:border-dark-3 dark:bg-dark-2 sm:p-[70px]">
              <h3 className="leading-[1.6]! mb-2.5 text-2xl font-bold text-dark dark:text-white sm:text-[28px]">
                Sign up to TailGrids
              </h3>
              <p className="mb-7 max-w-[315px] text-base text-body-color dark:text-dark-6">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit.
              </p>
              <div className="mb-6 flex items-center space-x-4">
                <a
                  href="/#"
                  className="flex h-[50px] items-center justify-center rounded-md border border-stroke text-sm font-semibold text-body-color hover:border-primary hover:text-primary dark:border-dark-3 dark:text-dark-6 sm:w-auto sm:px-7"
                >
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
                    {" "}
                    Sign up with Google{" "}
                  </span>
                </a>
                <a
                  href="/#"
                  className="flex h-[50px] w-[52px] items-center justify-center rounded-md bg-[#03A9F4]"
                >
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
                </a>
                <a
                  href="/#"
                  className="flex h-[50px] w-[52px] items-center justify-center rounded-md bg-[#0080FF]"
                >
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
                </a>
              </div>
              <div className="relative z-10 mb-8 flex items-center justify-center">
                <span className="absolute left-0 top-1/2 -z-10 hidden h-[1px] w-full -translate-y-1/2 bg-stroke dark:bg-dark-3 sm:block"></span>
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
                        name="fullName"
                        placeholder=""
                      />
                    </div>
                  </div>
                  <div className="w-full px-2 sm:w-1/2">
                    <div className="mb-4">
                      <InputBox
                        labelTitle="Username"
                        type="text"
                        name="username"
                        placeholder=""
                      />
                    </div>
                  </div>
                  <div className="w-full px-2">
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
                    <div className="mb-8">
                      <div>
                        <label
                          htmlFor="checkboxLabel"
                          className="flex cursor-pointer text-base text-body-color dark:text-dark-6"
                        >
                          <div className="relative pt-[2px]">
                            <input
                              type="checkbox"
                              id="checkboxLabel"
                              className="sr-only"
                              onChange={() => {
                                setIsChecked(!isChecked);
                              }}
                            />
                            <div
                              className={`mr-3 flex h-5 w-5 items-center justify-center rounded border ${
                                isChecked
                                  ? "border-primary"
                                  : "border-gray-2 dark:border-dark-3 dark:bg-dark"
                              }`}
                            >
                              <span
                                className={`${!isChecked ? "opacity-0" : ""}`}
                              >
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
                                  />
                                </svg>
                              </span>
                            </div>
                          </div>
                          <p className="text-base text-body-color dark:text-dark-6">
                            <span className="pr-0.5">
                              By creating account means you agree to the
                            </span>
                            <a
                              href="/#"
                              className="text-primary hover:underline"
                            >
                              Terms and Conditions
                            </a>
                            <span className="px-0.5">, and our</span>
                            <a
                              href="/#"
                              className="text-primary hover:underline"
                            >
                              Privacy Policy
                            </a>
                          </p>
                        </label>
                      </div>
                    </div>
                  </div>
                  <div className="w-full px-2">
                    <button
                      type="submit"
                      className="flex items-center justify-center rounded-md bg-primary px-14 py-[14px] text-sm font-medium text-white"
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
    </section>
  );
};

export default Signin6;

const InputBox = ({ type, placeholder, name, labelTitle }) => {
  return (
    <div>
      <label className="mb-2.5 block text-base font-medium text-dark dark:text-white">
        {labelTitle}
      </label>
      <input
        type={type}
        placeholder={placeholder}
        name={name}
        className="outline-hidden w-full rounded-md border border-stroke bg-gray-2 px-5 py-3 text-base text-body-color focus:border-primary dark:border-dark-3 dark:bg-dark dark:text-white"
      />
    </div>
  );
};
