import logo from "../../assets/images/logo/logo.svg";
import logoWhite from "../../assets/images/logo/logo-white.svg";
import { Link } from "react-router-dom";
import { useEffect, useState, useRef } from "react";

const navList = [
  { link: "#", text: "About Us" },
  { link: "#", text: "Features" },
  { link: "#", text: "Pricing" },
  { link: "#", text: "Support" },
];

const Navbar = () => {
  const [navbarOpen, setNavbarOpen] = useState(false);
  const navRef = useRef(null);
  const [sticky, setSticky] = useState(false);

  const handleNavbarToggle = () => {
    setNavbarOpen((prev) => !prev);
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

  const handleStickyNavbar = () => {
    setSticky(window.scrollY >= 80);
  };

  useEffect(() => {
    window.addEventListener("scroll", handleStickyNavbar);
    return () => window.removeEventListener("scroll", handleStickyNavbar);
  }, []);

  return (
    <header
      className={`sticky left-0 top-0 z-50 w-full bg-white dark:bg-dark ${
        sticky && "shadow-xs backdrop-blur-xs bg-white/80 dark:bg-dark/80"
      }`}
    >
      <div className="container mx-auto">
        <div className="relative z-40 -mx-4 flex items-center justify-between">
          <div className="w-60 max-w-full px-4">
            <Link to="/" className="block w-full py-5">
              <img src={logo} alt="logo" className="block w-full dark:hidden" />
              <img
                src={logoWhite}
                alt="logo"
                className="hidden w-full dark:block"
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
                className={`absolute right-4 top-full z-40 w-full max-w-[250px] rounded-lg bg-white px-6 py-5 shadow-sm transition-all duration-300 ease-in-out dark:bg-dark-2 ${
                  navbarOpen
                    ? "block scale-100 opacity-100"
                    : "hidden scale-95 opacity-0"
                } lg:static lg:block lg:w-full lg:max-w-full lg:bg-transparent lg:shadow-none lg:dark:bg-transparent xl:ml-11`}
              >
                <ul className="block lg:flex">
                  {navList.map((item, index) => (
                    <li key={index}>
                      <Link
                        to={item.link}
                        className="flex py-2 text-base font-medium text-dark hover:text-primary dark:text-white lg:ml-10 lg:inline-flex"
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
                className="rounded-md bg-dark px-7 py-3 text-base font-medium text-white hover:bg-body-color dark:bg-dark-2 dark:hover:bg-dark-3"
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
