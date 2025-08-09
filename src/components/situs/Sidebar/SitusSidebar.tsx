import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  FiGrid,
  FiFolder,
  FiShoppingCart,
  FiBarChart2,
  FiUsers,
  FiLifeBuoy,
  FiSettings,
} from "react-icons/fi";

interface SitusNavItem {
  divider: boolean;
  link?: string;
  text?: string;
  icon?: React.ReactNode;
}

interface SitusSidebarProps {
  // Текущий API компонента
  sidebarOpen?: boolean;
  setSidebarOpen?: (open: boolean) => void;
  // Совместимость с новым лейаутом
  isOpen?: boolean;
  onClose?: () => void;
}

const SitusSidebar: React.FC<SitusSidebarProps> = ({ sidebarOpen, setSidebarOpen, isOpen, onClose }) => {
  const location = useLocation();

  const navList: SitusNavItem[] = [
    {
      divider: false,
      link: "/",
      text: "Дашборд",
      icon: <FiGrid size={18} aria-hidden />,
    },
    {
      divider: false,
      link: "/projects",
      text: "Проекты",
      icon: <FiFolder size={18} aria-hidden />,
    },
    {
      divider: false,
      link: "/orders",
      text: "Заказы",
      icon: <FiShoppingCart size={18} aria-hidden />,
    },
    {
      divider: false,
      link: "/marketing",
      text: "Маркетинг",
      icon: <FiBarChart2 size={18} aria-hidden />,
    },
    {
      divider: false,
      link: "/users",
      text: "Пользователи",
      icon: <FiUsers size={18} aria-hidden />,
    },
    {
      divider: false,
      link: "/support",
      text: "Поддержка",
      icon: <FiLifeBuoy size={18} aria-hidden />,
    },
    {
      divider: true,
    },
    {
      divider: false,
      link: "/section-settings",
      text: "Настройки",
      icon: <FiSettings size={18} aria-hidden />,
    },
  ];

  const computedOpen = typeof sidebarOpen === "boolean" ? sidebarOpen : !!isOpen;

  const handleSidebarToggle = () => {
    if (setSidebarOpen) {
      setSidebarOpen(!computedOpen);
      return;
    }
    if (onClose && computedOpen) {
      onClose();
    }
  };

  const [userMenuOpen, setUserMenuOpen] = useState(false);

  return (
    <>
      <div
        className={`shadow-1 dark:bg-dark-2 dark:shadow-box-dark fixed top-0 left-0 z-40 flex h-screen w-[90px] flex-col bg-white duration-200 xl:translate-x-0 ${computedOpen ? "-translate-x-full" : "translate-x-0"}`}
      >
        <div>
          <div className="px-6 pt-6 pb-6">
            <Link to="/">
              <div className="h-8 w-8 bg-primary rounded flex items-center justify-center text-white font-bold text-lg">
                S
              </div>
            </Link>
          </div>
          <nav>
            <ul>
              {navList.map((item, index) =>
                item?.divider === false ? (
                  <li key={index} className="group relative">
                    <Link
                      to={item.link || "#"}
                      className={`text-body-color hover:border-primary hover:bg-primary/5 hover:text-primary dark:text-dark-6 relative flex items-center justify-center border-r-4 border-transparent px-9 py-3 text-base font-medium duration-200 ${
                        location.pathname === item.link ? "border-primary bg-primary/5 text-primary" : ""
                      }`}
                    >
                      <span>{item.icon}</span>
                    </Link>

                    <span className="text-body-color shadow-1 dark:bg-dark-2 dark:text-dark-6 dark:shadow-box-dark invisible absolute top-1/2 left-[115%] -translate-y-1/2 rounded-[5px] bg-white px-[14px] py-[6px] text-sm whitespace-nowrap group-hover:visible">
                      <span className="dark:text-dark-2 absolute top-1/2 -left-2 -translate-y-1/2 text-white">
                        <svg
                          width="9"
                          height="12"
                          viewBox="0 0 9 12"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                          className="fill-current"
                        >
                          <path d="M1.23134 6.8294C0.642883 6.43303 0.642882 5.56697 1.23133 5.1706L7.44134 0.987699C8.10557 0.540292 9 1.01624 9 1.81709L9 10.1829C9 10.9838 8.10557 11.4597 7.44134 11.0123L1.23134 6.8294Z" />
                        </svg>
                      </span>
                      {item.text}
                    </span>
                  </li>
                ) : (
                  <li key={index}>
                    <div className="bg-stroke dark:bg-dark-3 mx-6 my-3 h-[1px]"></div>
                  </li>
                ),
              )}
            </ul>
          </nav>
        </div>

        {/* Аватар фиксированно прижат к низу сайдбара и всегда на виду */}
        <div className="px-6 pt-5 pb-6 relative mt-auto">
          <div className="absolute left-1/2 bottom-4 -translate-x-1/2">
            <button
              onClick={() => setUserMenuOpen((v) => !v)}
              className="h-[38px] w-[38px] rounded-full bg-gray-200 dark:bg-dark-3 flex items-center justify-center text-dark dark:text-white font-semibold shadow-sm"
              title="Профиль"
            >
              АС
            </button>
            {userMenuOpen && (
              <div className="absolute left-[60px] bottom-0 z-50 w-56 rounded-md border border-stroke dark:border-dark-3 bg-white dark:bg-dark-2 shadow-md">
                <div className="px-3 py-2 border-b border-stroke dark:border-dark-3">
                  <div className="text-sm font-medium text-dark dark:text-white">Администратор Системы</div>
                  <div className="text-xs text-body-color dark:text-dark-6">Системный администратор</div>
                </div>
                <ul className="py-2 text-sm">
                  <li>
                    <a href="#" className="block px-4 py-2 hover:bg-gray-50 dark:hover:bg-dark-3">Уведомления</a>
                  </li>
                  <li>
                    <a href="/profile-settings" className="block px-4 py-2 hover:bg-gray-50 dark:hover:bg-dark-3">Настройки профиля</a>
                  </li>
                  <li>
                    <a href="/" className="block px-4 py-2 hover:bg-gray-50 dark:hover:bg-dark-3">Дашборд</a>
                  </li>
                  <li>
                    <a href="#" className="block px-4 py-2 hover:bg-gray-50 dark:hover:bg-dark-3">Выйти</a>
                  </li>
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>

      <div
        onClick={handleSidebarToggle}
        className={`fixed top-0 left-0 z-30 h-screen w-full bg-black/80 xl:hidden ${computedOpen ? "-translate-x-full" : "translate-x-0"}`}
      ></div>
    </>
  );
};

export default SitusSidebar; 