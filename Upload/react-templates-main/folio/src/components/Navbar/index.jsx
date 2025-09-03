import logo from "../../assets/images/logo/logo.svg";
import logoWhite from "../../assets/images/logo/logo-white.svg";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import { useEffect, useState, useRef } from "react";

const navList = [
  {
    link: "#",
    text: "About Us",
  },
  {
    link: "#",
    text: "Features",
  },
  {
    link: "#",
    text: "Pricing",
  },
  {
    link: "#",
    text: "Support",
  },
];

const Navbar = () => {
  const [navbarOpen, setNavbarOpen] = useState(false);
  const navRef = useRef(null);

  const handleNavbarToggle = () => {
    setNavbarOpen(!navbarOpen);
  };

  // Close navbar when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (navRef.current && !navRef.current.contains(event.target)) {
        setNavbarOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Sticky Navbar
  const [sticky, setSticky] = useState(false);
  const handleStickyNavbar = () => {
    if (window.scrollY >= 80) {
      setSticky(true);
    } else {
      setSticky(false);
    }
  };
  useEffect(() => {
    window.addEventListener("scroll", handleStickyNavbar);
  });

  return (
    <header
      className={`left-0 top-0 z-50 w-full ${
        sticky
          ? "fixed border-b border-stroke bg-white/80 py-2 backdrop-blur-sm dark:border-dark-3 dark:bg-dark/80"
          : "absolute"
      }`}
    >
      <div className="container mx-auto">
        <div className="relative z-40 -mx-4 flex items-center justify-between">
          <div className="w-60 max-w-full px-4">
            <Link to="/" className={`${sticky ? "py-2" : "py-5"} block`}>
              <img
                src={logo}
                alt="logo"
                className="block w-full max-w-[90px] dark:hidden"
              />
              <img
                src={logoWhite}
                alt="logo"
                className="hidden w-full max-w-[90px] dark:block"
              />
            </Link>
          </div>

          <div className="flex w-full items-center justify-between px-4">
            <div ref={navRef}>
              <button
                onClick={handleNavbarToggle}
                className={`absolute right-4 top-1/2 block -translate-y-1/2 rounded-lg px-3 py-[6px] ring-primary focus:ring-2 lg:hidden ${
                  navbarOpen ? "navbarTogglerActive" : ""
                }`}
              >
                <span className="relative my-[6px] block h-[2px] w-[30px] bg-body-color dark:bg-white"></span>
                <span className="relative my-[6px] block h-[2px] w-[30px] bg-body-color dark:bg-white"></span>
                <span className="relative my-[6px] block h-[2px] w-[30px] bg-body-color dark:bg-white"></span>
              </button>

              <nav
                className={`absolute right-4 top-full z-40 w-full max-w-[250px] rounded-lg bg-white px-6 py-5 shadow-sm dark:bg-dark-2 lg:static lg:block lg:w-full lg:max-w-full lg:bg-transparent lg:shadow-none dark:lg:bg-transparent xl:ml-11 ${navbarOpen ? "" : "hidden"}`}
              >
                <ul className="block lg:flex">
                  {navList.map((item, index) => (
                    <li key={index}>
                      <Link
                        to={item.link}
                        className="flex py-2 text-base font-medium text-body-color hover:text-dark dark:text-dark-6 dark:hover:text-white lg:ml-10 lg:inline-flex"
                      >
                        {item.text}
                      </Link>
                    </li>
                  ))}
                </ul>
              </nav>
            </div>

            <div className="hidden justify-end pr-16 sm:flex lg:pr-0">
              <button className="inline-flex h-12 items-center justify-center gap-2 rounded-lg border border-primary px-6 py-3 text-base font-medium text-primary duration-200 hover:bg-primary hover:text-white">
                <span>
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 20 20"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M18.625 9.2814C18.5 9.06265 18.3125 8.9064 18.0937 8.7814L3.6875 0.718901C3.4375 0.593901 3.15625 0.531401 2.875 0.562651C2.59375 0.593901 2.34375 0.687651 2.125 0.875151C1.90625 1.06265 1.75 1.31265 1.6875 1.56265C1.59375 1.8439 1.625 2.12515 1.71875 2.4064L4.40625 10.0002L1.71875 17.5939C1.625 17.8751 1.625 18.1564 1.6875 18.4064C1.75 18.6876 1.90625 18.9064 2.125 19.0939C2.34375 19.2814 2.59375 19.3751 2.875 19.4064C2.90625 19.4064 2.96875 19.4064 3 19.4064C3.21875 19.4064 3.46875 19.3439 3.6875 19.2189L18.0937 11.1564C18.3125 11.0314 18.5 10.8751 18.625 10.6564C18.75 10.4376 18.8125 10.1876 18.8125 9.9689C18.8125 9.75015 18.75 9.50015 18.625 9.2814ZM3.0625 1.9689L16.125 9.2814H5.65625L3.0625 1.9689ZM3.0625 18.0314L5.6875 10.7189H16.1562L3.0625 18.0314Z"
                      fill="currentColor"
                    />
                  </svg>
                </span>
                Let&apos;s talk
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

Navbar.propTypes = {
  navbarOpen: PropTypes.bool.isRequired,
  setNavbarOpen: PropTypes.func.isRequired,
};

export default Navbar;
