import NavTop from "./NavTop.jsx";
import logoPrimary from "../../assets/images/logo/logo-primary.svg";
import logoWhite from "../../assets/images/logo/logo-white.svg";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import WishListDropdown from "./WishListDropdown.jsx";
import CartDropdown from "./CartDropdown.jsx";
import { useState, useEffect, useRef } from "react";

const navList = [
  {
    link: "#",
    text: "Home",
  },
  {
    link: "/filters",
    text: "Shop",
  },
  {
    link: "#",
    text: "Products",
    submenuGroup: [
      {
        title: "New Arrivals",
        link: "#",
        groupItems: [
          { text: "Dresses", link: "#" },
          { text: "Jackets", link: "#" },
          { text: "Sweatshirts", link: "#" },
          { text: "Tops & Tees", link: "#" },
          { text: "Party Dresses", link: "#" },
        ],
      },
      {
        title: "New Arrivals",
        link: "#",
        groupItems: [
          { text: "Dresses", link: "#" },
          { text: "Jackets", link: "#" },
          { text: "Sweatshirts", link: "#" },
          { text: "Tops & Tees", link: "#" },
          { text: "Party Dresses", link: "#" },
        ],
      },
      {
        title: "New Arrivals",
        link: "#",
        groupItems: [
          { text: "Dresses", link: "#" },
          { text: "Jackets", link: "#" },
          { text: "Sweatshirts", link: "#" },
          { text: "Tops & Tees", link: "#" },
          { text: "Party Dresses", link: "#" },
        ],
      },
    ],
  },
  {
    link: "#",
    text: "Accessories",
  },
  {
    link: "/support",
    text: "Contact",
  },
];

const Navbar = () => {
  const [submenuOpen, setSubmenuOpen] = useState(false);

  const [navbarOpen, setNavbarOpen] = useState(false);
  const navRef = useRef(null);

  const handleSubmenuToggle = () => {
    setSubmenuOpen(!submenuOpen);
  };

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

  return (
    <header className="w-full bg-white dark:bg-dark">
      <NavTop />

      <div>
        <div className="container mx-auto">
          <div className="relative -mx-4 flex items-center justify-center sm:justify-between">
            <div className="w-60 max-w-full px-4 lg:w-48">
              <Link to="/" className="block w-full py-5 lg:py-3">
                <img
                  src={logoPrimary}
                  alt="logo"
                  className="w-full dark:hidden"
                />
                <img
                  src={logoWhite}
                  alt="logo"
                  className="hidden w-full dark:block"
                />
              </Link>
            </div>

            <div className="flex w-full items-center justify-end px-4 lg:justify-between">
              <div className="flex w-full items-center justify-between px-4">
                <div className="w-full" ref={navRef}>
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
                    className={`absolute right-4 top-full z-50 w-full max-w-[250px] justify-center rounded-lg bg-white px-6 py-5 shadow-sm dark:bg-dark-2 lg:static lg:flex lg:w-full lg:max-w-full lg:justify-end lg:bg-transparent lg:px-0 lg:py-0 lg:shadow-none dark:lg:bg-transparent ${navbarOpen ? "" : "hidden"}`}
                  >
                    <ul className="block items-center lg:flex">
                      {navList.map((item, index) =>
                        item.submenuGroup ? (
                          <li key={index} className="group relative lg:py-4">
                            <Link
                              to={item.link}
                              onClick={handleSubmenuToggle}
                              className="flex items-center justify-between py-2 text-base font-medium text-dark hover:text-primary group-hover:text-primary dark:text-white lg:mx-6 lg:inline-flex lg:py-2 2xl:mx-[18px]"
                            >
                              {item.text}

                              <span className="pl-[6px]">
                                <svg
                                  width="15"
                                  height="15"
                                  viewBox="0 0 15 15"
                                  fill="none"
                                  xmlns="http://www.w3.org/2000/svg"
                                  className="fill-current"
                                >
                                  <path d="M7.39258 10.475C7.26133 10.475 7.15196 10.4313 7.04258 10.3438L2.01133 5.40001C1.81446 5.20314 1.81446 4.89689 2.01133 4.70001C2.20821 4.50314 2.51446 4.50314 2.71133 4.70001L7.39258 9.27189L12.0738 4.65626C12.2707 4.45939 12.577 4.45939 12.7738 4.65626C12.9707 4.85314 12.9707 5.15939 12.7738 5.35626L7.74258 10.3C7.63321 10.4094 7.52383 10.475 7.39258 10.475Z" />
                                </svg>
                              </span>
                            </Link>
                            {submenuOpen && (
                              <div>
                                <div
                                  className={`relative left-0 top-full z-50 rounded-[5px] bg-white px-2 transition-all group-hover:opacity-100 dark:bg-dark-2 lg:invisible lg:absolute lg:top-[115%] lg:w-[600px] lg:border-[.5px] lg:border-stroke lg:px-[50px] lg:pb-7 lg:pt-9 lg:opacity-0 lg:group-hover:visible lg:group-hover:top-full dark:lg:border-dark-3 xl:w-[700px] ${submenuOpen ? "block" : "hidden lg:block"}`}
                                >
                                  <span className="rounded-xs absolute -top-[6px] left-8 -z-10 hidden h-3 w-3 rotate-45 border-[.5px] border-b-0 border-r-0 border-stroke bg-white dark:border-dark-3 dark:bg-dark-2 lg:block xl:left-10"></span>

                                  <div className="-mx-4 flex flex-wrap lg:justify-center">
                                    {item.submenuGroup.map(
                                      (group, groupIndex) => (
                                        <div
                                          key={groupIndex}
                                          className="w-full px-4 lg:w-1/3"
                                        >
                                          <div>
                                            <h3 className="mb-[14px] text-base font-semibold text-dark dark:text-white">
                                              {group.title}
                                            </h3>

                                            {group.groupItems.map(
                                              (groupItem, groupItemIndex) => (
                                                <Link
                                                  key={groupItemIndex}
                                                  to={groupItemIndex}
                                                  className="block py-[6px] text-base text-body-color hover:text-primary dark:text-dark-6"
                                                >
                                                  {groupItem.text}
                                                </Link>
                                              ),
                                            )}
                                          </div>
                                        </div>
                                      ),
                                    )}
                                  </div>
                                </div>
                              </div>
                            )}
                          </li>
                        ) : (
                          <li key={index}>
                            <Link
                              to={item.link}
                              className="flex justify-between py-2 text-base font-medium text-dark hover:text-primary dark:text-white lg:mx-5 lg:inline-flex lg:py-6 2xl:mx-[18px]"
                            >
                              {item.text}
                            </Link>
                          </li>
                        ),
                      )}
                    </ul>
                  </nav>
                </div>
              </div>

              <div className="hidden w-full items-center justify-end space-x-4 pr-[70px] sm:flex lg:pr-0">
                <div className="hidden items-center pr-1 xl:flex">
                  <div className="mr-3 flex h-[42px] w-[42px] items-center justify-center rounded-full border-[.5px] border-stroke bg-gray-2 text-dark dark:border-dark-3 dark:bg-dark-2 dark:text-white">
                    <svg
                      width="22"
                      height="22"
                      viewBox="0 0 22 22"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      className="fill-current"
                    >
                      <path d="M20.6937 18.975L20.075 12.7531C19.9719 11.6187 19.0094 10.7594 17.875 10.7594H4.125C2.99062 10.7594 2.0625 11.6187 1.925 12.7531L1.30625 18.975C1.2375 19.5937 1.44375 20.2125 1.85625 20.6594C2.26875 21.1062 2.85312 21.3812 3.47187 21.3812H18.4594C19.0781 21.3812 19.6625 21.1062 20.075 20.6594C20.5562 20.2125 20.7281 19.5937 20.6937 18.975ZM18.975 19.6281C18.8375 19.7656 18.6656 19.8344 18.4937 19.8344H3.50625C3.33437 19.8344 3.1625 19.7656 3.025 19.6281C2.8875 19.4906 2.85312 19.3187 2.85312 19.1125L3.47187 12.8906C3.50625 12.5469 3.78125 12.3062 4.125 12.3062H17.875C18.2187 12.3062 18.4937 12.5469 18.5281 12.8906L19.1469 19.1125C19.1469 19.3187 19.1125 19.4906 18.975 19.6281Z" />
                      <path d="M11 13.5094C9.59063 13.5094 8.42188 14.6781 8.42188 16.0875C8.42188 17.5312 9.59063 18.6656 11 18.6656C12.4437 18.6656 13.5781 17.4969 13.5781 16.0875C13.5781 14.6781 12.4437 13.5094 11 13.5094ZM11 17.1187C10.4156 17.1187 9.96875 16.6375 9.96875 16.0875C9.96875 15.5031 10.45 15.0562 11 15.0562C11.5844 15.0562 12.0312 15.5375 12.0312 16.0875C12.0312 16.6719 11.5844 17.1187 11 17.1187Z" />
                      <path d="M2.09687 7.08124C2.16562 8.59374 3.47187 9.38437 4.36562 9.38437H6.77187H6.80625C7.90625 9.31562 9.00625 8.59374 9.00625 7.08124V6.42812C10.175 6.42812 12.4094 6.42812 13.5437 6.42812V7.08124C13.5437 8.59374 14.6437 9.31562 15.7437 9.38437H18.1844C19.1125 9.38437 20.3844 8.59374 20.4531 7.08124C20.4531 6.97812 20.4531 5.74062 20.4531 5.67187C20.4531 5.63749 20.4531 5.60312 20.4531 5.56874C20.35 4.57187 20.0062 3.74687 19.3875 3.09374L19.3531 3.05937C18.4594 2.23437 17.4281 1.78749 16.6375 1.51249C14.3 0.618744 11.3781 0.618744 11.2406 0.618744C9.17812 0.653119 7.87187 0.824994 5.87812 1.51249C5.05312 1.82187 4.02187 2.26874 3.12812 3.05937L3.09375 3.09374C2.475 3.74687 2.13125 4.57187 2.02812 5.56874C2.02812 5.60312 2.02812 5.63749 2.02812 5.67187C2.0625 5.74062 2.09687 6.94374 2.09687 7.08124ZM4.22812 4.19374C4.91562 3.57499 5.74062 3.23124 6.42812 2.95624C8.21562 2.30312 9.35 2.19999 11.275 2.13124C11.4469 2.13124 14.0594 2.16562 16.1219 2.95624C16.8437 3.23124 17.6687 3.57499 18.3219 4.19374C18.6656 4.57187 18.8719 5.08749 18.9406 5.67187C18.9406 5.77499 18.9406 6.90937 18.9406 7.01249C18.9062 7.73437 18.2187 7.83749 18.2187 7.83749H15.8469C15.5031 7.80312 15.125 7.66562 15.125 7.08124V5.67187C15.125 5.32812 14.9187 5.01874 14.575 4.94999C14.3344 4.81249 8.25 4.81249 8.00937 4.91562C7.7 5.01874 7.45937 5.32812 7.45937 5.63749V7.08124C7.45937 7.66562 7.08125 7.80312 6.7375 7.83749H4.36562C4.36562 7.83749 3.67812 7.73437 3.64375 7.04687C3.64375 6.94374 3.64375 6.56562 3.64375 6.22187C3.64375 5.98124 3.64375 5.80937 3.64375 5.70624C3.67812 5.05312 3.88437 4.57187 4.22812 4.19374Z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-dark dark:text-white">
                      Need Help?
                      <br />
                      +001 123 456 789
                    </p>
                  </div>
                </div>
                <div>
                  <button className="relative flex h-[42px] w-[42px] items-center justify-center rounded-full border-[.5px] border-stroke bg-gray-2 text-dark dark:border-dark-3 dark:bg-dark-2 dark:text-white">
                    <svg
                      width="22"
                      height="22"
                      viewBox="0 0 22 22"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      className="fill-current"
                    >
                      <path d="M11 9.62499C8.42188 9.62499 6.35938 7.59687 6.35938 5.12187C6.35938 2.64687 8.42188 0.618744 11 0.618744C13.5781 0.618744 15.6406 2.64687 15.6406 5.12187C15.6406 7.59687 13.5781 9.62499 11 9.62499ZM11 2.16562C9.28125 2.16562 7.90625 3.50624 7.90625 5.12187C7.90625 6.73749 9.28125 8.07812 11 8.07812C12.7188 8.07812 14.0938 6.73749 14.0938 5.12187C14.0938 3.50624 12.7188 2.16562 11 2.16562Z" />
                      <path d="M18.2531 21.4156C17.8406 21.4156 17.4625 21.0719 17.4625 20.625V19.6281C17.4625 16.0531 14.575 13.1656 11 13.1656C7.42499 13.1656 4.53749 16.0531 4.53749 19.6281V20.625C4.53749 21.0375 4.19374 21.4156 3.74686 21.4156C3.29999 21.4156 2.95624 21.0719 2.95624 20.625V19.6281C2.95624 15.1937 6.56561 11.6187 10.9656 11.6187C15.3656 11.6187 18.975 15.2281 18.975 19.6281V20.625C19.0094 21.0375 18.6656 21.4156 18.2531 21.4156Z" />
                    </svg>
                  </button>
                </div>

                <WishListDropdown />

                <CartDropdown />
              </div>
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
