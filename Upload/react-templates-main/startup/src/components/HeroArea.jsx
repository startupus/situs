import heroImage from "../assets/images/hero/hero-image-01.png";
import brandOne from "../assets/images/brands/ayroui.svg";
import brandTwo from "../assets/images/brands/graygrids.svg";
import brandThree from "../assets/images/brands/uideck.svg";
import ShapeOne from "./Shapes/ShapeOne.jsx";
import { Link } from "react-router-dom";

const clients = [
  {
    name: "Ayroui",
    image: brandOne,
    link: "#",
  },
  {
    name: "GrayGrids",
    image: brandTwo,
    link: "#",
  },
  {
    name: "UIdeck",
    image: brandThree,
    link: "#",
  },
];

const HeroArea = () => {
  return (
    <>
      <section className="relative bg-white pb-[110px] pt-[120px] dark:bg-dark lg:pt-[150px]">
        <div className="container">
          <div className="-mx-4 flex flex-wrap">
            <div className="w-full px-4 lg:w-5/12">
              <div className="hero-content">
                <h1 className="mb-5 text-4xl font-bold leading-[1.208]! text-dark dark:text-white sm:text-[42px] lg:text-[40px] xl:text-5xl">
                  Kickstart Startup Website with TailGrids
                </h1>
                <p className="mb-8 max-w-[480px] text-base text-body-color dark:text-dark-6">
                  With TailGrids, business and students thrive together.
                  Business can perfectly match their staffing to changing demand
                  throughout the dayed.
                </p>
                <ul className="flex flex-wrap items-center">
                  <li>
                    <Link
                      to="/#"
                      className="inline-flex items-center justify-center rounded-md bg-primary px-6 py-3 text-center text-base font-medium text-white hover:bg-blue-dark lg:px-7"
                    >
                      Get Started
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/#"
                      className="inline-flex items-center justify-center px-5 py-3 text-center text-base font-medium text-[#464646] hover:text-primary dark:text-white"
                    >
                      <span className="mr-2">
                        <svg
                          width="24"
                          height="25"
                          viewBox="0 0 24 25"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <circle cx="12" cy="12.6152" r="12" fill="#3758F9" />
                          <rect
                            x="7.99893"
                            y="14.979"
                            width="8.18182"
                            height="1.63636"
                            fill="white"
                          />
                          <rect
                            x="11.2717"
                            y="7.61523"
                            width="1.63636"
                            height="4.09091"
                            fill="white"
                          />
                          <path
                            d="M12.0898 14.1606L14.9241 11.0925H9.25557L12.0898 14.1606Z"
                            fill="white"
                          />
                        </svg>
                      </span>
                      Download App
                    </Link>
                  </li>
                </ul>
                <div className="clients pt-16">
                  <h6 className="mb-6 flex items-center text-xs font-normal text-body-color dark:text-dark-6">
                    Some Of Our Clients
                    <span className="ml-3 inline-block h-px w-8 bg-body-color"></span>
                  </h6>

                  <div className="flex items-center space-x-4">
                    {clients.map((item, index) => (
                      <Link
                        key={index}
                        to={item.link}
                        className="flex w-full items-center justify-center"
                      >
                        <img
                          src={item.image}
                          alt="brand image"
                          className="h-10 w-full"
                        />
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            <div className="hidden px-4 lg:block lg:w-1/12"></div>
            <div className="w-full px-4 lg:w-6/12">
              <div className="lg:ml-auto lg:text-right">
                <div className="relative z-10 inline-block pt-11 lg:pt-0">
                  <img
                    src={heroImage}
                    alt="hero"
                    className="max-w-full lg:ml-auto"
                  />
                  <span className="absolute -bottom-8 -left-8 z-[-1]">
                    <ShapeOne />
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default HeroArea;
