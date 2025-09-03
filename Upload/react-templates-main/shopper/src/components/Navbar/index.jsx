import logo from "../../assets/images/logo/logo.svg";
import logoWhite from "../../assets/images/logo/logo-white.svg";
import { Link } from "react-router-dom";
import WishListDropdown from "./WishListDropdown.jsx";
import CartDropdown from "./CartDropdown.jsx";
import SearchForm from "./SearchForm.jsx";
import AllCategories from "./AllCategories.jsx";
import { useState, useEffect, useRef } from "react";

const navList = [
  {
    link: "/",
    text: "Home",
  },
  {
    link: "/filters",
    text: "Shop",
  },
  {
    link: "/filters",
    text: "Products",
  },
  {
    link: "#",
    text: "Accessories",
    submenu: [
      {
        link: "#",
        text: "Arts & Crafts",
      },
      {
        link: "#",
        text: "Fashion",
      },
      {
        link: "#",
        text: "Bags & Shoes",
      },
      {
        link: "#",
        text: "Jewelry & Watch",
      },
    ],
  },
  {
    link: "#",
    text: "Contact",
  },
];

const Navbar = () => {
  const [submenuOpen, setSubmenuOpen] = useState(false);

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

  const handleSubmenuToggle = () => {
    setSubmenuOpen(!submenuOpen);
  };

  return (
    <header className="shadow-xs sticky top-0 z-40 flex w-full items-center bg-white dark:bg-dark">
      <div className="container mx-auto">
        <div className="relative -mx-4 flex items-center justify-between">
          <div className="w-60 max-w-full px-4 lg:w-48">
            <Link to="/" className="block w-full py-5 lg:py-3">
              <img src={logo} alt="logo" className="w-full dark:hidden" />
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
                <span className="relative my-[6px] block h-[2px] w-[30px] bg-body-color dark:bg-dark-6"></span>
                <span className="relative my-[6px] block h-[2px] w-[30px] bg-body-color dark:bg-dark-6"></span>
                <span className="relative my-[6px] block h-[2px] w-[30px] bg-body-color dark:bg-dark-6"></span>
              </button>

              <nav
                className={`absolute right-4 top-full z-20 w-full max-w-[250px] justify-center rounded-lg bg-white px-6 py-5 shadow-sm dark:bg-dark-2 lg:static lg:flex lg:w-full lg:max-w-full lg:bg-transparent lg:py-0 lg:shadow-none lg:dark:bg-transparent ${navbarOpen ? "" : "hidden"}`}
              >
                <ul className="block items-center lg:flex">
                  <AllCategories />
                  {navList.map((item, index) =>
                    item.submenu ? (
                      <li key={index} className="group relative lg:py-4">
                        <Link
                          to={item.link}
                          onClick={handleSubmenuToggle}
                          className="flex items-center justify-between py-2 text-base font-medium text-dark hover:text-primary dark:text-white lg:mx-[18px] lg:inline-flex lg:py-2"
                        >
                          {item.text}

                          <span className="pl-[6px]">
                            <svg
                              width="16"
                              height="17"
                              viewBox="0 0 16 17"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                              className="fill-current"
                            >
                              <path d="M8 11.9C7.85 11.9 7.725 11.85 7.6 11.75L1.85 6.10005C1.625 5.87505 1.625 5.52505 1.85 5.30005C2.075 5.07505 2.425 5.07505 2.65 5.30005L8 10.525L13.35 5.25005C13.575 5.02505 13.925 5.02505 14.15 5.25005C14.375 5.47505 14.375 5.82505 14.15 6.05005L8.4 11.7C8.275 11.825 8.15 11.9 8 11.9Z" />
                            </svg>
                          </span>
                        </Link>

                        <div
                          className={`${!submenuOpen ? "hidden lg:block" : "block"} relative left-0 top-full z-10 rounded-lg bg-white px-2 transition-all group-hover:opacity-100 dark:bg-dark-2 lg:invisible lg:absolute lg:top-[115%] lg:w-[180px] lg:border-[.5px] lg:border-stroke lg:px-6 lg:py-4 lg:opacity-0 lg:group-hover:visible lg:group-hover:top-full dark:lg:border-dark-3`}
                        >
                          {item.submenu.map((item, index) => (
                            <Link
                              key={index}
                              to={item.link}
                              className="block py-[6px] text-base text-body-color hover:text-primary dark:text-dark-6"
                            >
                              {item.text}
                            </Link>
                          ))}
                        </div>
                      </li>
                    ) : (
                      <li key={index}>
                        <Link
                          to={item.link}
                          className="flex justify-between py-2 text-base font-medium text-dark hover:text-primary dark:text-white lg:mx-[18px] lg:hidden lg:py-6 xl:inline-flex"
                        >
                          {item.text}
                        </Link>
                      </li>
                    ),
                  )}
                </ul>
              </nav>
            </div>

            <div className="relative right-16 hidden items-center justify-end gap-5 sm:flex lg:right-0">
              <SearchForm />
              <WishListDropdown />
              <CartDropdown />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
