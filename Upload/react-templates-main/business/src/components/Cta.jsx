import { Link } from "react-router-dom";
import ShapeEleven from "./Shapes/ShapeEleven.jsx";
import ShapeTwelve from "./Shapes/ShapeTwelve.jsx";

const Cta = () => {
  return (
    <>
      <section className="pt-20 dark:bg-dark lg:pt-[120px]">
        <div className="container mx-auto">
          <div className="relative z-10 overflow-hidden rounded-sm bg-dark-2 px-8 py-12 md:p-[70px]">
            <div className="-mx-4 flex flex-wrap items-center">
              <div className="w-full px-4 lg:w-1/2">
                <span className="mb-4 block text-base font-medium text-white">
                  Find Your Next Dream App
                </span>
                <h2 className="mb-6 text-3xl font-bold leading-tight text-white sm:mb-8 sm:text-[40px]/[48px] lg:mb-0">
                  <span className="xs:block"> Get started with </span>
                  <span>our free trial</span>
                </h2>
              </div>
              <div className="w-full px-4 lg:w-1/2">
                <div className="flex flex-wrap lg:justify-end">
                  <Link
                    to="#"
                    className="hover:shadow-1 my-1 mr-4 inline-block rounded-md border border-transparent bg-white px-7 py-3 text-base font-medium text-primary transition hover:text-primary"
                  >
                    Get Pro Version
                  </Link>
                  <Link
                    to="#"
                    className="my-1 inline-block rounded-md border border-transparent bg-primary px-7 py-3 text-base font-medium text-white transition hover:bg-primary/90"
                  >
                    Start Free Trial
                  </Link>
                </div>
              </div>
            </div>
            <div>
              <span className="absolute left-0 top-0 z-[-1]">
                <ShapeEleven />
              </span>
              <span className="absolute bottom-0 right-0 z-[-1]">
                <ShapeTwelve />
              </span>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Cta;
