import logoWhite from "../../assets/images/logo/logo-white.svg";
import { Link } from "react-router-dom";

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
    text: "Home",
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
      className={`absolute left-0 top-0 z-50 w-full ${
        sticky && "shadow-xs backdrop-blur-xs sticky bg-dark/70"
      }`}
    >
      <div className="container mx-auto">
        <div className="relative -mx-4 flex items-center justify-between">
          <div className="w-60 max-w-full px-4">
            <Link
              to="/"
              className={`block w-full py-5 ${sticky ? "py-2" : "py-5"}`}
            >
              <img src={logoWhite} alt="logo" className="w-full" />
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
                <span className="relative my-[6px] block h-[2px] w-[30px] bg-white"></span>
                <span className="relative my-[6px] block h-[2px] w-[30px] bg-white"></span>
                <span className="relative my-[6px] block h-[2px] w-[30px] bg-white"></span>
              </button>

              <nav
                className={`absolute right-4 top-full w-full max-w-[250px] rounded-lg bg-white px-6 py-5 shadow-sm dark:bg-dark lg:static lg:block lg:w-full lg:max-w-full lg:bg-transparent lg:shadow-none lg:dark:bg-transparent xl:ml-11 ${navbarOpen ? "" : "hidden"}`}
              >
                <ul className="block lg:flex">
                  {navList.map((item, index) => (
                    <li key={index}>
                      <Link
                        to={item.link}
                        className="flex py-2 text-base font-medium text-dark hover:text-primary dark:text-white dark:hover:text-primary lg:ml-10 lg:inline-flex lg:text-white"
                      >
                        {item.text}
                      </Link>
                    </li>
                  ))}
                </ul>
              </nav>
            </div>

            <div className="hidden justify-end pr-16 sm:flex lg:pr-0">
              <Link
                to="#"
                className="rounded-md bg-white px-7 py-3 text-base font-medium text-primary shadow-1 hover:bg-gray-2 hover:text-body-color dark:shadow-none"
              >
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
