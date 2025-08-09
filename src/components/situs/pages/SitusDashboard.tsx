import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import ProjectOrdersChart from "./ProjectOrdersChart";
import ProjectTrafficChart from "./ProjectTrafficChart";
import ProjectConversionWidget from "./ProjectConversionWidget";
import {
  projectOrdersData,
  projectTrafficData,
  timeLabels,
  projectConversionData,
} from "./dashboardData";

const SitusDashboard: React.FC = () => {
  useEffect(() => {
    document.title = "Панель управления Situs";
  }, []);

  const recentProjects = [
    {
      id: 1,
      name: "Landing Page",
      status: "В разработке",
      lastModified: "2 часа назад",
      progress: 75,
    },
    {
      id: 2,
      name: "Portfolio Website",
      status: "Опубликован",
      lastModified: "1 день назад",
      progress: 100,
    },
    {
      id: 3,
      name: "E-commerce Store",
      status: "В разработке",
      lastModified: "3 дня назад",
      progress: 45,
    },
  ];

  const stats = [
    {
      title: "Всего проектов",
      value: "12",
      change: "+2",
      changeType: "increase",
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" className="fill-current">
          <path d="M3 3V21H21V3H3ZM5 5H19V19H5V5Z"/>
        </svg>
      ),
    },
    {
      title: "Активных сайтов",
      value: "8",
      change: "+1",
      changeType: "increase",
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" className="fill-current">
          <path d="M12 2C6.48 2 2 6.48 2 12S6.48 22 12 22 22 17.52 22 12 17.52 2 12 2ZM12 20C7.59 20 4 16.41 4 12S7.59 4 12 4 20 7.59 20 12 16.41 20 12 20Z"/>
        </svg>
      ),
    },
    {
      title: "Компонентов",
      value: "156",
      change: "+12",
      changeType: "increase",
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" className="fill-current">
          <path d="M12 2L1 7L12 12L23 7L12 2ZM12 15L1 10V16L12 21L23 16V10L12 15Z"/>
        </svg>
      ),
    },
    {
      title: "Посетителей",
      value: "2.4K",
      change: "+15%",
      changeType: "increase",
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" className="fill-current">
          <path d="M16 4C18.2091 4 20 5.79086 20 8C20 10.2091 18.2091 12 16 12C13.7909 12 12 10.2091 12 8C12 5.79086 13.7909 4 16 4Z"/>
          <path d="M8 6C9.65685 6 11 7.34315 11 9C11 10.6569 9.65685 12 8 12C6.34315 12 5 10.6569 5 9C5 7.34315 6.34315 6 8 6Z"/>
          <path d="M8 14C4.68629 14 2 16.6863 2 20H14C14 16.6863 11.3137 14 8 14Z"/>
          <path d="M16 14C13.7909 14 12 15.7909 12 18V20H22V18C22 15.7909 20.2091 14 18 14H16Z"/>
        </svg>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Заголовок убран — управляется глобальным хедером */}

      {/* Статистика */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat, index) => (
          <div
            key={index}
            className="rounded-lg bg-white p-6 shadow-1 dark:bg-dark-2 dark:shadow-box-dark"
          >
            <div className="flex items-center justify-between">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary">
                {stat.icon}
              </div>
              <span
                className={`text-sm font-medium ${
                  stat.changeType === "increase"
                    ? "text-green-500"
                    : "text-red-500"
                }`}
              >
                {stat.change}
              </span>
            </div>
            <div className="mt-4">
              <h3 className="text-xl font-semibold text-dark dark:text-white">
                {stat.value}
              </h3>
              <p className="text-body-color dark:text-dark-6 text-sm">
                {stat.title}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Графики и аналитика проектов */}
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        {/* График заказов по проектам */}
        <ProjectOrdersChart data={projectOrdersData} />
        
        {/* График посещаемости проектов */}
        <ProjectTrafficChart data={projectTrafficData} timeLabels={timeLabels} />
      </div>

      {/* Виджет конверсии проектов и недавние проекты */}
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        <ProjectConversionWidget projects={projectConversionData} />
        
        {/* Недавние проекты */}
        <div className="rounded-lg bg-white p-6 shadow-1 dark:bg-dark-2 dark:shadow-box-dark">
        <div className="mb-6 flex items-center justify-between">
          <h5 className="text-xl font-semibold text-dark dark:text-white">
            Недавние проекты
          </h5>
            <Link to="/projects" className="text-primary hover:text-primary/80 text-sm font-medium">
              Открыть раздел проектов
            </Link>
        </div>
        
        <div className="space-y-4">
          {recentProjects.map((project) => (
            <div
              key={project.id}
              className="flex items-center justify-between rounded-lg border border-stroke p-4 dark:border-dark-3"
            >
              <div className="flex items-center gap-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <svg width="20" height="20" viewBox="0 0 20 20" className="fill-current">
                    <path d="M2.5 2.5H17.5V17.5H2.5V2.5ZM4 4V16H16V4H4Z"/>
                  </svg>
                </div>
                <div>
                  <h3 className="font-medium text-dark dark:text-white">
                    {project.name}
                  </h3>
                  <p className="text-body-color dark:text-dark-6 text-sm">
                    Изменен {project.lastModified}
                  </p>
                </div>
              </div>
              
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <div className="h-2 w-20 rounded-full bg-gray-200 dark:bg-dark-3">
                    <div
                      className="h-2 rounded-full bg-primary"
                      style={{ width: `${project.progress}%` }}
                    ></div>
                  </div>
                  <span className="text-body-color dark:text-dark-6 text-sm">
                    {project.progress}%
                  </span>
                </div>
                
                <span
                  className={`rounded-full px-3 py-1 text-xs font-medium ${
                    project.status === "Опубликован"
                      ? "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400"
                      : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400"
                  }`}
                >
                  {project.status}
                </span>
                
                <Link
                  to={`/projects/${project.id}`}
                  className="text-primary hover:text-primary/80"
                >
                  <svg width="20" height="20" viewBox="0 0 20 20" className="fill-current">
                    <path d="M7 14L12 9L7 4V14Z"/>
                  </svg>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
      </div>

      {/* Быстрые действия */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <Link
          to="/templates"
          className="group rounded-lg bg-white p-6 shadow-1 transition-colors hover:bg-gray-50 dark:bg-dark-2 dark:shadow-box-dark dark:hover:bg-dark-3"
        >
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-100 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400">
              <svg width="24" height="24" viewBox="0 0 24 24" className="fill-current">
                <path d="M3 3V21H21V3H3ZM5 5H19V19H5V5ZM7 7V17H17V7H7Z"/>
              </svg>
            </div>
            <div>
              <h3 className="font-medium text-dark dark:text-white group-hover:text-primary">
                Шаблоны
              </h3>
              <p className="text-body-color dark:text-dark-6 text-sm">
                Готовые шаблоны сайтов
              </p>
            </div>
          </div>
        </Link>

        <Link
          to="/components"
          className="group rounded-lg bg-white p-6 shadow-1 transition-colors hover:bg-gray-50 dark:bg-dark-2 dark:shadow-box-dark dark:hover:bg-dark-3"
        >
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-purple-100 text-purple-600 dark:bg-purple-900/20 dark:text-purple-400">
              <svg width="24" height="24" viewBox="0 0 24 24" className="fill-current">
                <path d="M12 2L1 7L12 12L23 7L12 2ZM12 15L1 10V16L12 21L23 16V10L12 15Z"/>
              </svg>
            </div>
            <div>
              <h3 className="font-medium text-dark dark:text-white group-hover:text-primary">
                Компоненты
              </h3>
              <p className="text-body-color dark:text-dark-6 text-sm">
                Библиотека UI компонентов
              </p>
            </div>
          </div>
        </Link>

        <Link
          to="/help"
          className="group rounded-lg bg-white p-6 shadow-1 transition-colors hover:bg-gray-50 dark:bg-dark-2 dark:shadow-box-dark dark:hover:bg-dark-3"
        >
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-green-100 text-green-600 dark:bg-green-900/20 dark:text-green-400">
              <svg width="24" height="24" viewBox="0 0 24 24" className="fill-current">
                <path d="M12 2C6.48 2 2 6.48 2 12S6.48 22 12 22 22 17.52 22 12 17.52 2 12 2ZM13 17H11V15H13V17ZM13 13H11V7H13V13Z"/>
              </svg>
            </div>
            <div>
              <h3 className="font-medium text-dark dark:text-white group-hover:text-primary">
                Справка
              </h3>
              <p className="text-body-color dark:text-dark-6 text-sm">
                Документация и поддержка
              </p>
            </div>
          </div>
        </Link>
      </div>
    </div>
  );
};

export default SitusDashboard; 