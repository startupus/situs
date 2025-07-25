import React from "react";

export default function Toast3() {
  return (
    <section className="bg-white py-[60px]">
      <div className="mx-auto px-4 sm:container">
        <div className="flex justify-end">
          <div className="flex w-full max-w-[490px] items-center rounded-lg border border-[#F5C5BB] bg-[#FCEDEA] p-4">
            <div className="mr-5 flex h-[45px] w-full max-w-[45px] items-center justify-center rounded-sm bg-[#EA4E2C] text-white sm:h-[60px] sm:max-w-[60px]">
              <svg viewBox="0 0 32 32" className="h-7 w-7 sm:h-8 sm:w-8">
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M14.2002 3.33487C14.7493 3.0257 15.3689 2.86328 15.9991 2.86328C16.6292 2.86328 17.2488 3.0257 17.7979 3.33487C18.347 3.64403 18.8072 4.08951 19.1341 4.62831L19.1369 4.63306L30.4303 23.4864L30.4384 23.5002C30.7585 24.0547 30.9279 24.6833 30.9297 25.3235C30.9315 25.9637 30.7656 26.5933 30.4486 27.1495C30.1315 27.7057 29.6744 28.1693 29.1226 28.4939C28.5708 28.8186 27.9436 28.9932 27.3034 29.0002L27.2924 29.0003L4.69473 29.0003C4.05452 28.9932 3.42732 28.8186 2.87553 28.4939C2.32372 28.1693 1.86656 27.7057 1.54951 27.1495C1.23246 26.5933 1.06658 25.9637 1.06837 25.3235C1.07017 24.6833 1.23957 24.0547 1.55973 23.5002L1.56785 23.4864L12.8612 4.63307L13.7191 5.14694L12.8641 4.62831C13.1909 4.08951 13.6511 3.64403 14.2002 3.33487ZM14.5753 5.66344C14.5749 5.66415 14.5745 5.66486 14.5741 5.66557L3.28818 24.5065C3.14494 24.757 3.06917 25.0404 3.06837 25.3291C3.06755 25.6201 3.14295 25.9063 3.28706 26.1591C3.43118 26.4119 3.63898 26.6226 3.8898 26.7702C4.13921 26.917 4.42251 26.9962 4.71181 27.0003H27.2863C27.5756 26.9962 27.8589 26.917 28.1083 26.7702C28.3591 26.6226 28.5669 26.4119 28.711 26.1591C28.8552 25.9063 28.9306 25.6201 28.9297 25.3291C28.9289 25.0404 28.8532 24.757 28.7099 24.5065L17.4241 5.66557C17.4236 5.66486 17.4232 5.66415 17.4228 5.66344C17.2743 5.41949 17.0656 5.21776 16.8167 5.07764C16.5671 4.93711 16.2855 4.86328 15.9991 4.86328C15.7126 4.86328 15.431 4.93711 15.1814 5.07764C14.9325 5.21776 14.7238 5.41949 14.5753 5.66344Z"
                  fill="white"
                />
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M16 11C16.5523 11 17 11.4477 17 12V17.3333C17 17.8856 16.5523 18.3333 16 18.3333C15.4477 18.3333 15 17.8856 15 17.3333V12C15 11.4477 15.4477 11 16 11Z"
                  fill="white"
                />
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M15 22.666C15 22.1137 15.4477 21.666 16 21.666H16.0133C16.5656 21.666 17.0133 22.1137 17.0133 22.666C17.0133 23.2183 16.5656 23.666 16.0133 23.666H16C15.4477 23.666 15 23.2183 15 22.666Z"
                  fill="white"
                />
              </svg>
            </div>
            <div className="flex w-full items-center justify-between">
              <div>
                <h6 className="text-base font-semibold text-black sm:text-lg">
                  Uh oh, something went wrong
                </h6>
                <p className="text-sm font-medium text-body-color">
                  Sorry! There was a problem with your request
                </p>
              </div>
              <button className="ml-2 flex h-7 w-7 items-center justify-center rounded-sm bg-white text-body-color hover:bg-[#EA4E2C] hover:text-white">
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 20 20"
                  className="fill-current"
                >
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M4.41009 4.41009C4.73553 4.08466 5.26317 4.08466 5.5886 4.41009L9.99935 8.82084L14.4101 4.41009C14.7355 4.08466 15.2632 4.08466 15.5886 4.41009C15.914 4.73553 15.914 5.26317 15.5886 5.5886L11.1779 9.99935L15.5886 14.4101C15.914 14.7355 15.914 15.2632 15.5886 15.5886C15.2632 15.914 14.7355 15.914 14.4101 15.5886L9.99935 11.1779L5.5886 15.5886C5.26317 15.914 4.73553 15.914 4.41009 15.5886C4.08466 15.2632 4.08466 14.7355 4.41009 14.4101L8.82084 9.99935L4.41009 5.5886C4.08466 5.26317 4.08466 4.73553 4.41009 4.41009Z"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
