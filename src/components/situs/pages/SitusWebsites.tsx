import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { DemoAPI } from "../../../api/services/demo.api";

// Компонент левой панели с подменю (копируем из SitusProjects)
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
              <Link
                to={item.link}
                className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  location.pathname === item.link
                    ? "bg-primary text-white"
                    : "text-body-color hover:bg-gray-100 dark:text-dark-6 dark:hover:bg-dark-3"
                }`}
              >
                <span className="flex-shrink-0">{item.icon}</span>
                <span>{item.text}</span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>
      
      <div className="mt-8 pt-6 border-t border-stroke dark:border-dark-3">
        <div className="text-sm text-body-color dark:text-dark-6 mb-3">
          Быстрые действия
        </div>
        <Link
          to="/projects/new"
          className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-primary hover:bg-primary/5 transition-colors"
        >
          <svg width="16" height="16" viewBox="0 0 16 16" className="fill-current">
            <path d="M8 1C8.55228 1 9 1.44772 9 2V7H14C14.5523 7 15 7.44772 15 8C15 8.55228 14.5523 9 14 9H9V14C9 14.5523 8.55228 15 8 15C7.44772 15 7 14.5523 7 14V9H2C1.44772 9 1 8.55228 1 8C1 7.44772 1.44772 7 2 7H7V2C7 1.44772 7.44772 1 8 1Z"/>
          </svg>
          Создать проект
        </Link>
      </div>
    </div>
  );
};

type WebsiteCard = {
  id: number | string;
  name: string;
  status: string;
  url: string;
  createdAt: string;
  visitors: number;
  orders?: number;
  revenue?: number;
  template?: string;
  pages: number;
};

const SitusWebsites: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [websites, setWebsites] = useState<WebsiteCard[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const resp = await DemoAPI.websites();
        const list = (resp as any)?.data || [];
        if (mounted) setWebsites(list);
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  const filteredWebsites = websites.filter((w) =>
    w.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400">
            Активен
          </span>
        );
      case "development":
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400">
            В разработке
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400">
            {status}
          </span>
        );
    }
  };

  if (loading) {
    return (
      <div className="flex">
        <ProjectsSidebar />
        <div className="flex-1 p-6">
          <div className="text-body-color dark:text-dark-6">Загрузка...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex">
      {/* Левая панель с подменю */}
      <ProjectsSidebar />

      {/* Правая панель с сайтами */}
      <div className="flex-1 p-6">
        {/* Заголовок */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl font-semibold text-dark dark:text-white">Сайты</h1>
              <p className="text-body-color dark:text-dark-6 mt-2">
                Управление веб-сайтами и лендингами
              </p>
            </div>
            <Link
              to="/projects/new?type=website"
              className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary/90 transition-colors"
            >
              <svg width="16" height="16" viewBox="0 0 16 16" className="fill-current">
                <path d="M8 1C8.55228 1 9 1.44772 9 2V7H14C14.5523 7 15 7.44772 15 8C15 8.55228 14.5523 9 14 9H9V14C9 14.5523 8.55228 15 8 15C7.44772 15 7 14.5523 7 14V9H2C1.44772 9 1 8.55228 1 8C1 7.44772 1.44772 7 2 7H7V2C7 1.44772 7.44772 1 8 1Z"/>
              </svg>
              Создать сайт
            </Link>
          </div>

        {/* Поиск */}
        <div className="mt-6">
          <div className="relative max-w-md">
            <input
              type="text"
              placeholder="Поиск сайтов..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full rounded-lg border border-stroke bg-transparent px-4 py-3 pl-10 text-body-color placeholder-body-color outline-none transition focus:border-primary focus-visible:shadow-none dark:border-dark-3 dark:text-white dark:placeholder-dark-6"
            />
            <svg
              width="20"
              height="20"
              viewBox="0 0 20 20"
              className="fill-current absolute left-3 top-1/2 -translate-y-1/2 text-body-color dark:text-dark-6"
            >
              <path d="M8 4C5.79086 4 4 5.79086 4 8C4 10.2091 5.79086 12 8 12C10.2091 12 12 10.2091 12 8C12 5.79086 10.2091 4 8 4ZM2 8C2 4.68629 4.68629 2 8 2C11.3137 2 14 4.68629 14 8C14 9.29583 13.5892 10.4957 12.8907 11.4765L17.7071 16.2929C18.0976 16.6834 18.0976 17.3166 17.7071 17.7071C17.3166 18.0976 16.6834 18.0976 16.2929 17.7071L11.4765 12.8907C10.4957 13.5892 9.29583 14 8 14C4.68629 14 2 11.3137 2 8Z"/>
            </svg>
          </div>
        </div>
      </div>

      {/* Список сайтов */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredWebsites.map((website) => (
          <div
            key={website.id}
            className="bg-white dark:bg-dark-2 rounded-lg border border-stroke dark:border-dark-3 p-6 hover:shadow-lg transition-shadow"
          >
            {/* Заголовок карточки */}
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="flex-shrink-0">
                  <svg width="24" height="24" viewBox="0 0 24 24" className="fill-current text-blue-500">
                    <path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM12 20C7.59 20 4 16.41 4 12C4 7.59 7.59 4 12 4C16.41 4 20 7.59 20 12C20 16.41 16.41 20 12 20Z"/>
                    <path d="M7 7H17V9H7V7ZM7 11H17V13H7V11ZM7 15H13V17H7V15Z"/>
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-dark dark:text-white text-sm">
                    {website.name}
                  </h3>
                  <p className="text-xs text-body-color dark:text-dark-6">
                    {website.template}
                  </p>
                </div>
              </div>
              {getStatusBadge(website.status)}
            </div>

            {/* URL сайта */}
            <div className="mb-4">
              <a
                href={website.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:text-primary/80 text-sm break-all"
              >
                {website.url}
              </a>
            </div>

            {/* Статистика */}
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="text-center">
                <div className="text-lg font-semibold text-dark dark:text-white">
                  {website.visitors.toLocaleString()}
                </div>
                <div className="text-xs text-body-color dark:text-dark-6">
                  Посетители
                </div>
              </div>
              <div className="text-center">
                <div className="text-lg font-semibold text-dark dark:text-white">
                  {website.pages}
                </div>
                <div className="text-xs text-body-color dark:text-dark-6">
                  Страниц
                </div>
              </div>
            </div>

            {/* Действия */}
            <div className="flex gap-2">
              <Link
                to={`/projects/${website.id}/edit`}
                className="flex-1 text-center px-3 py-2 text-sm font-medium text-primary border border-primary rounded-lg hover:bg-primary hover:text-white transition-colors"
              >
                Редактировать
              </Link>
              <Link
                to={`/projects/${website.id}/preview`}
                className="flex-1 text-center px-3 py-2 text-sm font-medium text-body-color border border-stroke dark:border-dark-3 rounded-lg hover:bg-gray-50 dark:hover:bg-dark-3 transition-colors"
              >
                Просмотр
              </Link>
            </div>
          </div>
        ))}
      </div>

      {/* Пустое состояние */}
      {filteredWebsites.length === 0 && (
        <div className="text-center py-12">
          <svg
            width="64"
            height="64"
            viewBox="0 0 64 64"
            className="fill-current text-gray-400 dark:text-dark-6 mx-auto mb-4"
          >
            <path d="M32 8C18.745 8 8 18.745 8 32C8 45.255 18.745 56 32 56C45.255 56 56 45.255 56 32C56 18.745 45.255 8 32 8ZM32 52C21.177 52 12 42.823 12 32C12 21.177 21.177 12 32 12C42.823 12 52 21.177 52 32C52 42.823 42.823 52 32 52Z"/>
            <path d="M32 20C25.373 20 20 25.373 20 32C20 38.627 25.373 44 32 44C38.627 44 44 38.627 44 32C44 25.373 38.627 20 32 20ZM32 40C27.589 40 24 36.411 24 32C24 27.589 27.589 24 32 24C36.411 24 40 27.589 40 32C40 36.411 36.411 40 32 40Z"/>
          </svg>
          <h3 className="text-lg font-semibold text-dark dark:text-white mb-2">
            Сайты не найдены
          </h3>
          <p className="text-body-color dark:text-dark-6 mb-4">
            {searchTerm
              ? "Попробуйте изменить поисковый запрос"
              : "Создайте свой первый сайт"
            }
          </p>
          {!searchTerm && (
            <Link
              to="/projects/new?type=website"
              className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary/90 transition-colors"
            >
              <svg width="16" height="16" viewBox="0 0 16 16" className="fill-current">
                <path d="M8 1C8.55228 1 9 1.44772 9 2V7H14C14.5523 7 15 7.44772 15 8C15 8.55228 14.5523 9 14 9H9V14C9 14.5523 8.55228 15 8 15C7.44772 15 7 14.5523 7 14V9H2C1.44772 9 1 8.55228 1 8C1 7.44772 1.44772 7 2 7H7V2C7 1.44772 7.44772 1 8 1Z"/>
              </svg>
              Создать сайт
            </Link>
          )}
        </div>
      )}
      </div>
    </div>
  );
};

export default SitusWebsites; 