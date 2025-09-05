import { Link } from "react-router-dom";
import logoWhite from "../../assets/images/logo/logo-white.svg";
import logo from "../../assets/images/logo/logo.svg";
import user from "../../assets/images/avatar/image-02.jpg";
import PropTypes from "prop-types";
import { useState } from "react";

const navList = [
  {
    link: "/",
    text: "Home",
  },
  {
    link: "#",
    text: "Dashboard",
  },
  {
    link: "#",
    text: "Products",
    children: [
      {
        link: "#",
        text: "Dropdown One",
      },
      {
        link: "#",
        text: "Dropdown Two",
      },
      {
        link: "#",
        text: "Dropdown Three",
      },
    ],
  },
  {
    link: "/",
    text: "Messages",
  },
  {
    link: "/",
    text: "Order",
  },
  {
    link: "/",
    text: "Calender",
  },
  {
    link: "/",
    text: "Static",
  },
  {
    link: "/",
    text: "Documents",
  },
  {
    divider: true,
  },
  {
    link: "/",
    text: "Chat",
  },
  {
    link: "/",
    text: "Settings",
  },
  {
    link: "/",
    text: "Log out",
  },
];

const Sidebar = ({ sidebarOpen, setSidebarOpen }) => {
  const [openDropDown, setOpenDropDown] = useState(false);

  const handleSidebarToggle = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const handleDropDownToggle = () => {
    setOpenDropDown(!openDropDown);
  };

  return (
    <>
      <div
        className={`fixed left-0 top-0 z-40 flex h-screen w-full max-w-[300px] flex-col justify-between overflow-y-scroll bg-white shadow-card duration-200 dark:bg-dark-2 xl:translate-x-0 ${sidebarOpen ? "-translate-x-full" : "translate-x-0"}`}
      >
        <div>
          <div className="px-10 pb-9 pt-10">
            <Link to="/">
              <img src={logo} alt="logo" className="dark:hidden" />
              <img src={logoWhite} alt="logo" className="hidden dark:block" />
            </Link>
          </div>

          <nav>
            <ul>
              {navList.map((item, index) =>
                item?.divider ? (
                  <li key={index}>
                    <div className="mx-9 my-5 h-px bg-stroke dark:bg-dark-3"></div>
                  </li>
                ) : item?.children ? (
                  <li key={index} className="relative">
                    <Link
                      to={item.link}
                      onClick={handleDropDownToggle}
                      className={`relative flex items-center border-r-4 py-[10px] pl-9 pr-10 text-base font-medium text-body-color duration-200 hover:border-primary hover:bg-primary/5 dark:text-dark-6 ${openDropDown === true ? "border-primary bg-primary/5" : "border-transparent"} `}
                    >
                      {item.text}
                      <span
                        className={`absolute right-10 top-1/2 -translate-y-1/2 ${
                          openDropDown ? "rotate-180" : "rotate-0"
                        }`}
                      >
                        <svg
                          width="20"
                          height="20"
                          viewBox="0 0 20 20"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                          className="fill-current"
                        >
                          <path d="M10 14.25C9.8125 14.25 9.65625 14.1875 9.5 14.0625L2.3125 7C2.03125 6.71875 2.03125 6.28125 2.3125 6C2.59375 5.71875 3.03125 5.71875 3.3125 6L10 12.5312L16.6875 5.9375C16.9688 5.65625 17.4062 5.65625 17.6875 5.9375C17.9688 6.21875 17.9688 6.65625 17.6875 6.9375L10.5 14C10.3437 14.1562 10.1875 14.25 10 14.25Z" />
                        </svg>
                      </span>
                    </Link>

                    {openDropDown && (
                      <div>
                        <ul className="py-[6px] pl-[50px] pr-10">
                          {item?.children.map((child, childIndex) => (
                            <li key={childIndex}>
                              <Link
                                to={child.link}
                                className="flex items-center border-r-4 border-transparent py-[9px] text-base font-medium text-body-color duration-200 hover:text-primary dark:text-dark-6 dark:hover:text-primary"
                              >
                                {child.text}
                              </Link>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </li>
                ) : (
                  <li key={index}>
                    <Link
                      to={item.link}
                      className="relative flex items-center border-r-4 border-transparent py-[10px] pl-9 pr-10 text-base font-medium text-body-color duration-200 hover:border-primary hover:bg-primary/5 dark:text-dark-6"
                    >
                      {item.text}
                    </Link>
                  </li>
                ),
              )}
            </ul>
          </nav>
        </div>

        <div className="p-10">
          <div className="flex items-center">
            <div className="mr-4 h-[50px] w-full max-w-[50px] rounded-full">
              <img
                src={user}
                alt="profile"
                className="h-full w-full rounded-full object-cover object-center"
              />
            </div>
            <div>
              <h6 className="text-base font-medium text-dark dark:text-white">
                Musharof
              </h6>
              <p className="text-sm text-body-color dark:text-dark-6">
                hello@tailgrids.com
              </p>
            </div>
          </div>
        </div>
      </div>

      <div
        onClick={handleSidebarToggle}
        className={`fixed left-0 top-0 z-30 h-screen w-full bg-dark/80 xl:hidden ${sidebarOpen ? "-translate-x-full" : "translate-x-0"}`}
      ></div>
    </>
  );
};

Sidebar.propTypes = {
  sidebarOpen: PropTypes.bool.isRequired,
  setSidebarOpen: PropTypes.func.isRequired,
};

export default Sidebar;
