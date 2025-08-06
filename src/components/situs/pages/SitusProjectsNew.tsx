import React from "react";
import { useLocation } from "react-router-dom";
import { ProjectsMain } from "../projects";

// Компонент левой панели с подменю
const ProjectsSidebar: React.FC = () => {
  const location = useLocation();
  
  const menuItems = [
    {
      link: "/projects",
      text: "Все проекты",
      icon: (
        <svg width="18" height="18" viewBox="0 0 18 18" className="fill-current">
          <path d="M1.5 2.25C1.5 1.83579 1.83579 1.5 2.25 1.5H7.5C7.91421 1.5 8.25 1.83579 8.25 2.25V7.5C8.25 7.91421 7.91421 8.25 7.5 8.25H2.25C1.83579 8.25 1.5 7.91421 1.5 7.5V2.25ZM3 3V6.75H6.75V3H3Z"/>
          <path d="M9.75 2.25C9.75 1.83579 10.0858 1.5 10.5 1.5H15.75C16.1642 1.5 16.5 1.83579 16.5 2.25V7.5C16.5 7.91421 16.1642 8.25 15.75 8.25H10.5C10.0858 8.25 9.75 7.91421 9.75 7.5V2.25ZM11.25 3V6.75H15V3H11.25Z"/>
          <path d="M9.75 10.5C9.75 10.0858 10.0858 9.75 10.5 9.75H15.75C16.1642 9.75 16.5 10.0858 16.5 10.5V15.75C16.5 16.1642 16.1642 16.5 15.75 16.5H10.5C10.0858 16.5 9.75 16.1642 9.75 15.75V10.5ZM11.25 11.25V15H15V11.25H11.25Z"/>
          <path d="M1.5 10.5C1.5 10.0858 1.83579 9.75 2.25 9.75H7.5C7.91421 9.75 8.25 10.0858 8.25 10.5V15.75C8.25 16.1642 7.91421 16.5 7.5 16.5H2.25C1.83579 16.5 1.5 16.1642 1.5 15.75V10.5ZM3 11.25V15H6.75V11.25H3Z"/>
        </svg>
      )
    },
    {
      link: "/projects/websites",
      text: "Сайты",
      icon: (
        <svg width="18" height="18" viewBox="0 0 18 18" className="fill-current">
          <path d="M9 1C4.58172 1 1 4.58172 1 9C1 13.4183 4.58172 17 9 17C13.4183 17 17 13.4183 17 9C17 4.58172 13.4183 1 9 1ZM9 15C5.68629 15 3 12.3137 3 9C3 5.68629 5.68629 3 9 3C12.3137 3 15 5.68629 15 9C15 12.3137 12.3137 15 9 15Z"/>
          <path d="M6 6H12V8H6V6ZM6 10H12V12H6V10Z"/>
        </svg>
      )
    },
    {
      link: "/projects/stores",
      text: "Магазины",
      icon: (
        <svg width="18" height="18" viewBox="0 0 18 18" className="fill-current">
          <path d="M2 2V4H3V13C3 13.5523 3.44772 14 4 14H14C14.5523 14 15 13.5523 15 13V4H16V2H2ZM4 4H14V13H4V4Z"/>
          <path d="M6 6V8H7V6H6ZM9 6V8H10V6H9Z"/>
        </svg>
      )
    },
    {
      link: "/projects/chatbots",
      text: "Чатботы",
      icon: (
        <svg width="18" height="18" viewBox="0 0 18 18" className="fill-current">
          <path d="M9 1C4.58172 1 1 4.58172 1 9C1 13.4183 4.58172 17 9 17C13.4183 17 17 13.4183 17 9C17 4.58172 13.4183 1 9 1ZM9 15C5.68629 15 3 12.3137 3 9C3 5.68629 5.68629 3 9 3C12.3137 3 15 5.68629 15 9C15 12.3137 12.3137 15 9 15Z"/>
          <path d="M6 6.5C6 6.22386 6.22386 6 6.5 6H11.5C11.7761 6 12 6.22386 12 6.5V11.5C12 11.7761 11.7761 12 11.5 12H6.5C6.22386 12 6 11.7761 6 11.5V6.5Z"/>
        </svg>
      )
    },
    {
      link: "/projects/landings",
      text: "Лендинги",
      icon: (
        <svg width="18" height="18" viewBox="0 0 18 18" className="fill-current">
          <path d="M3 3H15V5H3V3ZM3 7H15V9H3V7ZM3 11H15V13H3V11ZM3 15H15V17H3V15Z"/>
        </svg>
      )
    },
    {
      link: "/projects/apps",
      text: "Приложения",
      icon: (
        <svg width="18" height="18" viewBox="0 0 18 18" className="fill-current">
          <path d="M6 2H12C13.1046 2 14 2.89543 14 4V14C14 15.1046 13.1046 16 12 16H6C4.89543 16 4 15.1046 4 14V4C4 2.89543 4.89543 2 6 2ZM6 4V14H12V4H6Z"/>
          <path d="M7 5H11V7H7V5ZM7 9H11V11H7V9Z"/>
        </svg>
      )
    }
  ];

  return (
    <div className="w-64 bg-white dark:bg-dark-2 border-r border-stroke dark:border-dark-3 p-4">
      <div className="mb-6">
        <h2 className="text-lg font-semibold text-dark dark:text-white mb-2">
          Разделы проектов
        </h2>
        <p className="text-sm text-body-color dark:text-dark-6">
          Выберите тип проекта для просмотра
        </p>
      </div>
      
      <nav>
        <ul className="space-y-1">
          {menuItems.map((item, index) => (
            <li key={index}>
              <a
                href={item.link}
                className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  location.pathname === item.link
                    ? "bg-primary text-white"
                    : "text-body-color hover:bg-gray-100 dark:text-dark-6 dark:hover:bg-dark-3"
                }`}
              >
                <span className="flex-shrink-0">{item.icon}</span>
                <span>{item.text}</span>
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
};

const SitusProjects: React.FC = () => {
  return (
    <div className="flex h-full">
      <ProjectsSidebar />
      <div className="flex-1">
        <ProjectsMain />
      </div>
    </div>
  );
};

export default SitusProjects;
