import React from "react";
import { Link } from "react-router-dom";

const navList = [
  {
    link: "#",
    text: "Уведомления",
  },
  {
    link: "/profile-settings",
    text: "Настройки профиля",
  },
  {
    link: "/",
    text: "Дашборд",
  },
  {
    link: "#",
    text: "Выйти",
  },
];

const SitusUserDropdown: React.FC = () => {
  const userName = "Администратор Системы";
  const userRole = "Системный администратор";
  return (
    <div className="group relative">
      <Link to="#" className="flex items-center">
        <div className="h-[40px] w-[40px] rounded-full bg-gray-200 dark:bg-dark-3 flex items-center justify-center text-dark dark:text-white font-semibold">
          АС
        </div>

        <span className="ml-[8px] text-body-color dark:text-dark-6">
          <svg
            width="20"
            height="20"
            viewBox="0 0 20 20"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M4.41076 6.91009C4.7362 6.58466 5.26384 6.58466 5.58928 6.91009L10 11.3208L14.4108 6.91009C14.7362 6.58466 15.2638 6.58466 15.5893 6.91009C15.9147 7.23553 15.9147 7.76317 15.5893 8.0886L10.5893 13.0886C10.2638 13.414 9.7362 13.414 9.41077 13.0886L4.41076 8.0886C4.08533 7.76317 4.08533 7.23553 4.41076 6.91009Z"
              fill="currentColor"
            />
          </svg>
        </span>
      </Link>

      <div className="invisible absolute right-0 top-[120%] mt-3 w-[220px] rounded-sm bg-white p-3 opacity-0 shadow-card-2 duration-200 group-hover:visible group-hover:top-full group-hover:opacity-100 dark:bg-dark-2">
        <div className="px-3 py-2 border-b border-stroke dark:border-dark-3 mb-2">
          <div className="text-sm font-medium text-dark dark:text-white">{userName}</div>
          <div className="text-xs text-body-color dark:text-dark-6">{userRole}</div>
        </div>
        <div className="space-y-2">
        {navList.map((item, index) => (
          <Link
            key={index}
            to={item.link}
            className="block rounded-sm px-4 py-2 text-sm font-medium text-body-color hover:bg-gray-2 hover:text-primary dark:text-dark-6 dark:hover:bg-dark"
          >
            {item.text}
          </Link>
        ))}
        </div>
      </div>
    </div>
  );
};

export default SitusUserDropdown; 