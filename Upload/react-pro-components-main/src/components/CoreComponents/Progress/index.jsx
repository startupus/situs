import React from "react";

const Progress = ({
  ShowValue,
  ShowValueInside,
  primary,
  secondary,
  warning,
  danger,
  success,
  info,
  value = "50",
}) => {
  return (
    <>
      {/* ====== Progress-bars Section Start */}

      <div className="container mb-6 mt-12">
        <div className="-mx-4 flex flex-wrap justify-between">
          <div className="w-full px-4 lg:w-5/12">
            <div className="">
              <div className="bg-light relative h-[10px] w-full rounded-2xl">
                <div
                  className={`absolute left-0 top-0 h-full w-1/2 rounded-2xl ${
                    (primary && `bg-primary`) ||
                    (secondary && `bg-secondary`) ||
                    (danger && `bg-danger`) ||
                    (success && `bg-success`) ||
                    (info && `bg-info`) ||
                    (warning && `bg-warning`)
                  } bg-primary`}
                />
                {ShowValue && (
                  <div className="bg-light relative h-[10px] w-full rounded-2xl">
                    <div
                      className={`absolute left-0 top-0 h-full w-1/2 rounded-2xl ${
                        (primary && `bg-primary`) ||
                        (secondary && `bg-secondary`) ||
                        (danger && `bg-danger`) ||
                        (success && `bg-success`) ||
                        (info && `bg-info`) ||
                        (warning && `bg-warning`)
                      } bg-primary`}
                    >
                      <span
                        className={`absolute -right-4 bottom-full mb-2 rounded-sm px-2 py-1 text-xs font-semibold text-white ${
                          (primary && `bg-primary`) ||
                          (secondary && `bg-secondary`) ||
                          (danger && `bg-danger`) ||
                          (success && `bg-success`) ||
                          (info && `bg-info`) ||
                          (warning && `bg-warning`)
                        } bg-primary`}
                      >
                        <span
                          className={`absolute bottom-[-2px] left-1/2 -z-10 h-2 w-2 -translate-x-1/2 rotate-45 rounded-sm ${
                            (primary && `bg-primary`) ||
                            (secondary && `bg-secondary`) ||
                            (danger && `bg-danger`) ||
                            (success && `bg-success`) ||
                            (info && `bg-info`) ||
                            (warning && `bg-warning`)
                          } bg-primary`}
                        />
                        {value}%
                      </span>
                    </div>
                  </div>
                )}

                {ShowValueInside && (
                  <div className="bg-light relative h-4 w-full rounded-2xl">
                    <div
                      className={`absolute left-0 top-0 flex h-full w-1/2 items-center justify-center rounded-2xl text-xs font-semibold text-white ${
                        (primary && `bg-primary`) ||
                        (secondary && `bg-secondary`) ||
                        (danger && `bg-danger`) ||
                        (success && `bg-success`) ||
                        (info && `bg-info`) ||
                        (warning && `bg-warning`)
                      } bg-primary`}
                    >
                      {value}%
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ====== Progress-bars Section End */}
    </>
  );
};

export default Progress;
