import React from "react";
import { Link, useLocation } from "react-router-dom";

interface SitusNavItem {
  divider: boolean;
  link?: string;
  text?: string;
  icon?: React.ReactNode;
}

interface SitusSidebarProps {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
}

const SitusSidebar: React.FC<SitusSidebarProps> = ({ sidebarOpen, setSidebarOpen }) => {
  const location = useLocation();

  const navList: SitusNavItem[] = [
    {
      divider: false,
      link: "/",
      text: "Дашборд",
      icon: (
        <svg width="18" height="18" viewBox="0 0 18 18" className="fill-current">
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M1.5 2.25C1.5 1.83579 1.83579 1.5 2.25 1.5H7.5C7.91421 1.5 8.25 1.83579 8.25 2.25V7.5C8.25 7.91421 7.91421 8.25 7.5 8.25H2.25C1.83579 8.25 1.5 7.91421 1.5 7.5V2.25ZM3 3V6.75H6.75V3H3Z"
          />
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M9.75 2.25C9.75 1.83579 10.0858 1.5 10.5 1.5H15.75C16.1642 1.5 16.5 1.83579 16.5 2.25V7.5C16.5 7.91421 16.1642 8.25 15.75 8.25H10.5C10.0858 8.25 9.75 7.91421 9.75 7.5V2.25ZM11.25 3V6.75H15V3H11.25Z"
          />
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M9.75 10.5C9.75 10.0858 10.0858 9.75 10.5 9.75H15.75C16.1642 9.75 16.5 10.0858 16.5 10.5V15.75C16.5 16.1642 16.1642 16.5 15.75 16.5H10.5C10.0858 16.5 9.75 16.1642 9.75 15.75V10.5ZM11.25 11.25V15H15V11.25H11.25Z"
          />
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M1.5 10.5C1.5 10.0858 1.83579 9.75 2.25 9.75H7.5C7.91421 9.75 8.25 10.0858 8.25 10.5V15.75C8.25 16.1642 7.91421 16.5 7.5 16.5H2.25C1.83579 16.5 1.5 16.1642 1.5 15.75V10.5ZM3 11.25V15H6.75V11.25H3Z"
          />
        </svg>
      ),
    },
    {
      divider: false,
      link: "/projects",
      text: "Проекты",
      icon: (
        <svg width="18" height="18" viewBox="0 0 18 18" className="fill-current">
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M7.87661 1.05247C8.21826 0.855592 8.60566 0.751953 9 0.751953C9.39435 0.751953 9.78177 0.8556 10.1234 1.05249C10.124 1.05279 10.1245 1.05309 10.125 1.0534L15.375 4.05339C15.7167 4.25068 16.0005 4.53435 16.198 4.87595C16.3954 5.21756 16.4996 5.60508 16.5 5.99965V12.0012C16.4996 12.3958 16.3954 12.7833 16.198 13.1249C16.0005 13.4665 15.7167 13.7502 15.375 13.9474L15.3721 13.9491L10.125 16.9474C10.1245 16.9477 10.1241 16.948 10.1237 16.9482C9.78194 17.1452 9.39444 17.2489 9 17.2489C8.60558 17.2489 8.21809 17.1452 7.87639 16.9482C7.87593 16.948 7.87546 16.9477 7.875 16.9474L2.6279 13.9491L2.625 13.9474C2.2833 13.7502 1.99948 13.4665 1.80202 13.1249C1.60456 12.7833 1.5004 12.3958 1.5 12.0012V5.99965C1.5004 5.60508 1.60456 5.21756 1.80202 4.87595C1.99948 4.53435 2.2833 4.25068 2.625 4.0534L2.62789 4.05173L7.87661 1.05247ZM9 2.25195C8.86835 2.25195 8.73901 2.28661 8.625 2.35243L8.62211 2.3541L3.375 5.35243C3.37461 5.35266 3.37421 5.35289 3.37382 5.35312C3.26044 5.41885 3.16626 5.51315 3.10067 5.62662C3.03491 5.74039 3.00019 5.86945 3 6.00086V12C3.00019 12.1314 3.03491 12.2604 3.10067 12.3742C3.16626 12.4877 3.26044 12.582 3.37382 12.6477C3.37421 12.6479 3.37461 12.6482 3.375 12.6484L8.625 15.6484C8.73901 15.7142 8.86835 15.7489 9 15.7489C9.13165 15.7489 9.26098 15.7142 9.375 15.6484L9.3779 15.6467L14.625 12.6484C14.6254 12.6482 14.6258 12.6479 14.6262 12.6477C14.7396 12.582 14.8337 12.4877 14.8993 12.3742C14.9651 12.2603 14.9999 12.1312 15 11.9996V6.00118C14.9999 5.86966 14.9651 5.74049 14.8993 5.62662C14.8337 5.51315 14.7396 5.41885 14.6262 5.35312C14.6258 5.35289 14.6254 5.35266 14.625 5.35243L9.375 2.35244C9.26098 2.28661 9.13165 2.25195 9 2.25195Z"
          />
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M1.80404 4.84529C2.01145 4.48674 2.47025 4.36422 2.82879 4.57162L9.00075 8.14188L15.1727 4.57162C15.5313 4.36422 15.99 4.48674 16.1975 4.84529C16.4049 5.20383 16.2823 5.66263 15.9238 5.87003L9.37629 9.65753C9.14396 9.79193 8.85753 9.79193 8.62521 9.65753L2.07771 5.87003C1.71916 5.66263 1.59664 5.20383 1.80404 4.84529Z"
          />
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M9 8.25C9.41421 8.25 9.75 8.58579 9.75 9V16.56C9.75 16.9742 9.41421 17.31 9 17.31C8.58579 17.31 8.25 16.9742 8.25 16.56V9C8.25 8.58579 8.58579 8.25 9 8.25Z"
          />
        </svg>
      ),
    },
    {
      divider: false,
      link: "/orders",
      text: "Заказы",
      icon: (
        <svg width="18" height="18" viewBox="0 0 18 18" className="fill-current">
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M3 3.75C2.58921 3.75 2.25 4.08921 2.25 4.5V13.5C2.25 13.9108 2.58921 14.25 3 14.25H15C15.4108 14.25 15.75 13.9108 15.75 13.5V4.5C15.75 4.08921 15.4108 3.75 15 3.75H3ZM0.75 4.5C0.75 3.26079 1.76079 2.25 3 2.25H15C16.2392 2.25 17.25 3.26079 17.25 4.5V13.5C17.25 14.7392 16.2392 15.75 15 15.75H3C1.76079 15.75 0.75 14.7392 0.75 13.5V4.5Z"
          />
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M0.88564 4.06997C1.12318 3.73063 1.59082 3.6481 1.93016 3.88564L9.00006 8.83457L16.07 3.88564C16.4093 3.6481 16.877 3.73063 17.1145 4.06997C17.352 4.4093 17.2695 4.87695 16.9302 5.11449L9.43016 10.3645C9.17192 10.5453 8.82821 10.5453 8.56997 10.3645L1.06997 5.11449C0.730631 4.87695 0.648105 4.4093 0.88564 4.06997Z"
          />
        </svg>
      ),
    },
    {
      divider: false,
      link: "/marketing",
      text: "Маркетинг",
      icon: (
        <svg width="18" height="18" viewBox="0 0 18 18" className="fill-current">
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M9 0.75C9.41421 0.75 9.75 1.08579 9.75 1.5V16.5C9.75 16.9142 9.41421 17.25 9 17.25C8.58579 17.25 8.25 16.9142 8.25 16.5V1.5C8.25 1.08579 8.58579 0.75 9 0.75Z"
          />
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M1.5 9C1.5 8.58579 1.83579 8.25 2.25 8.25H15.75C16.1642 8.25 16.5 8.58579 16.5 9C16.5 9.41421 16.1642 9.75 15.75 9.75H2.25C1.83579 9.75 1.5 9.41421 1.5 9Z"
          />
        </svg>
      ),
    },
    {
      divider: false,
      link: "/users",
      text: "Пользователи",
      icon: (
        <svg width="18" height="18" viewBox="0 0 18 18" className="fill-current">
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M9 9C11.0711 9 12.75 7.32107 12.75 5.25C12.75 3.17893 11.0711 1.5 9 1.5C6.92893 1.5 5.25 3.17893 5.25 5.25C5.25 7.32107 6.92893 9 9 9ZM9 10.5C6.33125 10.5 4.125 12.7063 4.125 15.375C4.125 15.9963 4.62868 16.5 5.25 16.5H12.75C13.3713 16.5 13.875 15.9963 13.875 15.375C13.875 12.7063 11.6687 10.5 9 10.5Z"
          />
        </svg>
      ),
    },
    {
      divider: false,
      link: "/support",
      text: "Поддержка",
      icon: (
        <svg width="18" height="18" viewBox="0 0 18 18" className="fill-current">
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M9 0.75C4.44365 0.75 0.75 4.44365 0.75 9C0.75 13.5563 4.44365 17.25 9 17.25C13.5563 17.25 17.25 13.5563 17.25 9C17.25 4.44365 13.5563 0.75 9 0.75ZM1.5 9C1.5 4.86751 4.86751 1.5 9 1.5C13.1325 1.5 16.5 4.86751 16.5 9C16.5 13.1325 13.1325 16.5 9 16.5C4.86751 16.5 1.5 13.1325 1.5 9Z"
          />
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M9 4.5C9.41421 4.5 9.75 4.83579 9.75 5.25V9.75C9.75 10.1642 9.41421 10.5 9 10.5C8.58579 10.5 8.25 10.1642 8.25 9.75V5.25C8.25 4.83579 8.58579 4.5 9 4.5Z"
          />
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M8.25 12.75C8.25 12.3358 8.58579 12 9 12C9.41421 12 9.75 12.3358 9.75 12.75C9.75 13.1642 9.41421 13.5 9 13.5C8.58579 13.5 8.25 13.1642 8.25 12.75Z"
          />
        </svg>
      ),
    },
    {
      divider: true,
    },
    {
      divider: false,
      link: "/section-settings",
      text: "Настройки",
      icon: (
        <svg width="18" height="18" viewBox="0 0 18 18" className="fill-current">
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M9 3.375C8.17157 3.375 7.5 4.04657 7.5 4.875C7.5 5.70343 8.17157 6.375 9 6.375C9.82843 6.375 10.5 5.70343 10.5 4.875C10.5 4.04657 9.82843 3.375 9 3.375ZM6 4.875C6 3.21815 7.34315 1.875 9 1.875C10.6569 1.875 12 3.21815 12 4.875C12 6.53185 10.6569 7.875 9 7.875C7.34315 7.875 6 6.53185 6 4.875Z"
          />
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M9 12.75C7.34315 12.75 6 11.4069 6 9.75C6 8.09315 7.34315 6.75 9 6.75C10.6569 6.75 12 8.09315 12 9.75C12 11.4069 10.6569 12.75 9 12.75ZM4.5 9.75C4.5 12.2353 6.51472 14.25 9 14.25C11.4853 14.25 13.5 12.2353 13.5 9.75C13.5 7.26472 11.4853 5.25 9 5.25C6.51472 5.25 4.5 7.26472 4.5 9.75Z"
          />
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M4.69711 12.9471C5.16171 12.9471 5.53711 13.3225 5.53711 13.7871C5.53711 14.2517 5.16171 14.6271 4.69711 14.6271C4.23251 14.6271 3.85711 14.2517 3.85711 13.7871C3.85711 13.3225 4.23251 12.9471 4.69711 12.9471Z"
          />
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M13.3029 12.9471C13.7675 12.9471 14.1429 13.3225 14.1429 13.7871C14.1429 14.2517 13.7675 14.6271 13.3029 14.6271C12.8383 14.6271 12.4629 14.2517 12.4629 13.7871C12.4629 13.3225 12.8383 12.9471 13.3029 12.9471Z"
          />
        </svg>
      ),
    },
  ];

  const handleSidebarToggle = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <>
      <div
        className={`shadow-1 dark:bg-dark-2 dark:shadow-box-dark absolute top-0 left-0 z-40 flex h-full min-h-screen w-full max-w-[90px] flex-col justify-between bg-white duration-200 xl:translate-x-0 ${sidebarOpen ? "-translate-x-full" : "translate-x-0"}`}
      >
        <div>
          <div className="px-7 pt-10 pb-9">
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
                    <div className="bg-stroke dark:bg-dark-3 mx-7 my-3 h-[1px]"></div>
                  </li>
                ),
              )}
            </ul>
          </nav>
        </div>

        <div className="px-6 py-10">
          <div className="flex items-center">
            <div className="h-[38px] w-full max-w-[38px] rounded-full bg-primary flex items-center justify-center text-white font-semibold">
              АС
            </div>
          </div>
        </div>
      </div>

      <div
        onClick={handleSidebarToggle}
        className={`fixed top-0 left-0 z-30 h-screen w-full bg-black/80 xl:hidden ${sidebarOpen ? "-translate-x-full" : "translate-x-0"}`}
      ></div>
    </>
  );
};

export default SitusSidebar; 