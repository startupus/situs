import React, { useState } from "react";

interface ProjectConversion {
  id: number;
  name: string;
  conversionRate: number;
  visitors: number;
  orders: number;
  revenue: number;
  trend: "up" | "down" | "stable";
  trendValue: number;
}

interface ProjectConversionWidgetProps {
  projects: ProjectConversion[];
}

const ProjectConversionWidget: React.FC<ProjectConversionWidgetProps> = ({ projects }) => {
  const [showAll, setShowAll] = useState(false);
  
  const displayedProjects = showAll ? projects : projects.slice(0, 4);
  const hasMoreProjects = projects.length > 4;

  const getTrendIcon = (trend: "up" | "down" | "stable") => {
    switch (trend) {
      case "up":
        return (
          <svg
            width="12"
            height="12"
            viewBox="0 0 16 16"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="fill-current text-success"
          >
            <path d="M8 2L13.5 7.5L12.09 8.91L9 5.83V14H7V5.83L3.91 8.91L2.5 7.5L8 2Z" />
          </svg>
        );
      case "down":
        return (
          <svg
            width="12"
            height="12"
            viewBox="0 0 16 16"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="fill-current text-danger"
          >
            <path d="M8 14L2.5 8.5L3.91 7.09L7 10.17V2H9V10.17L12.09 7.09L13.5 8.5L8 14Z" />
          </svg>
        );
      default:
        return (
          <svg
            width="12"
            height="12"
            viewBox="0 0 16 16"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="fill-current text-body-color"
          >
            <path d="M8 4L10 6L6 10L4 8L8 4Z" />
          </svg>
        );
    }
  };

  const getProjectIcon = (index: number) => {
    const icons = [
      <svg
        key="icon1"
        width="20"
        height="21"
        viewBox="0 0 30 31"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="fill-current"
      >
        <path d="M18.5156 14.4688H11.4844C9.1875 14.4688 7.26562 12.6875 7.26562 10.4844C7.26562 8.28125 9.14062 6.5 11.4844 6.5H21.8438C22.4063 6.5 22.875 6.03125 22.875 5.46875C22.875 4.90625 22.4063 4.4375 21.8438 4.4375H16.9688V2.375C16.9688 1.8125 16.5 1.34375 15.9375 1.34375C15.375 1.34375 14.9062 1.8125 14.9062 2.375V4.34375H11.5313C8.0625 4.34375 5.20312 7.0625 5.20312 10.4375C5.20312 13.8125 8.01563 16.5313 11.5313 16.5313H18.5625C20.8594 16.5313 22.7813 18.3125 22.7813 20.5156C22.7813 22.7188 20.9062 24.5 18.5625 24.5H6.65625C6.09375 24.5 5.625 24.9688 5.625 25.5313C5.625 26.0938 6.09375 26.5625 6.65625 26.5625H14.8594V28.625C14.8594 29.1875 15.3281 29.6563 15.8906 29.6563C16.4531 29.6563 16.9219 29.1875 16.9219 28.625V26.6563H18.4219C21.8906 26.6563 24.75 23.9375 24.75 20.5625C24.75 17.1875 21.9844 14.4688 18.5156 14.4688Z" />
      </svg>,
      <svg
        key="icon2"
        width="20"
        height="21"
        viewBox="0 0 30 31"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="fill-current"
      >
        <path d="M23.0625 16.4375C21.6562 14.75 19.875 13.5781 17.9062 12.9687C19.875 11.9375 21.1875 9.875 21.1875 7.48437C21.1875 4.0625 18.4219 1.25 14.9531 1.25C11.4844 1.25 8.76563 4.10937 8.76563 7.53125C8.76563 9.875 10.0781 11.9375 12.0469 13.0156C10.0781 13.625 8.34375 14.7969 6.89062 16.4844C4.82812 18.9219 3.65625 22.2969 3.60938 26C3.60938 26.4219 3.84375 26.7969 4.17187 26.9375C5.4375 27.5937 10.0313 29.6562 14.9531 29.6562C20.2969 29.6562 24.5625 27.5469 25.7812 26.8906C26.1094 26.7031 26.3438 26.3281 26.3438 25.9531C26.2969 22.2969 25.125 18.9219 23.0625 16.4375ZM15 3.45312C17.25 3.45312 19.125 5.28125 19.125 7.57812C19.125 9.875 17.2969 11.7031 15 11.7031C12.7031 11.7031 10.875 9.875 10.875 7.57812C10.875 5.28125 12.75 3.45312 15 3.45312ZM15 27.5937C11.1094 27.5937 7.3125 26.0937 5.76563 25.3437C5.95313 22.3906 6.89063 19.7656 8.53125 17.7969C10.2188 15.7813 12.5156 14.6562 15 14.6562C17.4844 14.6562 19.7812 15.7813 21.4687 17.7969C23.1094 19.7188 24.0937 22.3906 24.2344 25.3437C22.7813 26.0937 19.2187 27.5937 15 27.5937Z" />
      </svg>,
      <svg
        key="icon3"
        width="20"
        height="21"
        viewBox="0 0 30 31"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="fill-current"
      >
        <path d="M17.3906 22.9062C15.5156 22.9062 14.0156 24.4063 14.0156 26.2812C14.0156 28.1562 15.5156 29.6562 17.3906 29.6562C19.2656 29.6562 20.7656 28.1562 20.7656 26.2812C20.7656 24.4531 19.2187 22.9062 17.3906 22.9062ZM17.3906 27.5937C16.6875 27.5937 16.125 27.0312 16.125 26.3281C16.125 25.625 16.6875 25.0625 17.3906 25.0625C18.0937 25.0625 18.6562 25.625 18.6562 26.3281C18.6562 26.9844 18.0469 27.5937 17.3906 27.5937Z" />
        <path d="M8.48437 22.9062C6.60938 22.9062 5.10938 24.4063 5.10938 26.2812C5.10938 28.1562 6.60938 29.6562 8.48437 29.6562C10.3594 29.6562 11.8594 28.1562 11.8594 26.2812C11.8594 24.4531 10.3125 22.9062 8.48437 22.9062ZM8.48437 27.5937C7.78125 27.5937 7.21875 27.0312 7.21875 26.3281C7.21875 25.625 7.78125 25.0625 8.48437 25.0625C9.1875 25.0625 9.75 25.625 9.75 26.3281C9.75 26.9844 9.1875 27.5937 8.48437 27.5937Z" />
        <path d="M27.2812 1.34375H24.75C23.625 1.34375 22.6406 2.1875 22.5 3.3125L21.75 8.70312H3.23437C2.76562 8.70312 2.29687 8.9375 1.96874 9.3125C1.68749 9.6875 1.54687 10.2031 1.68749 10.6719C1.68749 10.7188 1.68749 10.7188 1.68749 10.7656L4.59374 19.5312C4.78124 20.1875 5.39062 20.6563 6.09374 20.6563H19.0312C20.7656 20.6563 22.2656 19.3438 22.5 17.6094L24.4687 3.59375C24.4687 3.5 24.5625 3.45312 24.6562 3.45312H27.1875C27.75 3.45312 28.2656 2.98438 28.2656 2.375C28.2656 1.76563 27.8437 1.34375 27.2812 1.34375ZM20.4844 17.2812C20.3906 17.9844 19.7812 18.5 19.0781 18.5H6.51562L3.98437 10.8125H21.4219L20.4844 17.2812Z" />
      </svg>,
      <svg
        key="icon4"
        width="20"
        height="21"
        viewBox="0 0 30 31"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="fill-current"
      >
        <path d="M24.2531 6.05315C24.2531 6.01252 24.2125 6.01252 24.2125 5.9719C23.9281 5.56565 23.5219 5.20002 23.0344 4.9969L14.2594 0.975024C13.4469 0.609399 12.5531 0.609399 11.7406 0.975024L3.00625 4.9969C2.51875 5.20002 2.15312 5.56565 1.82812 5.93127C1.7875 5.9719 1.74687 6.01252 1.70625 6.05315C1.70625 6.09377 1.66562 6.09377 1.66562 6.1344C1.38125 6.6219 1.21875 7.15002 1.21875 7.71877V17.875C1.21875 19.0125 1.86875 20.0688 2.88437 20.5563L11.6188 24.9438C12.025 25.1469 12.5125 25.2688 12.9594 25.2688C13.4062 25.2688 13.8938 25.1469 14.3 24.9438L23.0344 20.5563C24.05 20.0281 24.7 19.0125 24.7 17.875V7.71877C24.7812 7.1094 24.5781 6.54065 24.2531 6.05315ZM12.5125 2.64065C12.675 2.5594 12.8375 2.51877 13 2.51877C13.1625 2.51877 13.325 2.5594 13.4875 2.64065L21.6938 6.41877L18.4438 8.00315L10.0344 3.77815L12.5125 2.64065ZM13 10.6844L4.30625 6.41877L7.92188 4.75315L16.4125 9.01877L13 10.6844ZM3.69688 18.9313C3.29063 18.7281 3.04688 18.3219 3.04688 17.875V7.84065L12.0656 12.2688V23.1563L3.69688 18.9313ZM22.3031 18.9313L13.8938 23.1563V12.2688L17.4688 10.5219V13.8125C17.4688 14.3 17.875 14.7063 18.3625 14.7063C18.85 14.7063 19.2563 14.3 19.2563 13.8125V9.62815L22.8719 7.84065V17.875C22.9531 18.3219 22.6688 18.7281 22.3031 18.9313Z" />
      </svg>,
      <svg
        key="icon5"
        width="20"
        height="21"
        viewBox="0 0 30 31"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="fill-current"
      >
        <path d="M15 0.731201C8.45 0.731201 4.79375 4.75308 4.79375 9.70933V16.2906C4.79375 21.2468 8.49063 25.2687 13 25.2687C15.1125 25.2687 17.1031 24.4156 18.6062 22.8718C20.3125 21.1656 21.2469 18.7281 21.2062 16.25V9.70933C21.2062 4.75308 17.5094 0.731201 13 0.731201ZM19.3781 9.70933V10.1562H13.975V2.64058C17.0625 3.1687 19.3781 6.13433 19.3781 9.70933ZM12.1469 2.59995V10.1562H6.58125V9.70933C6.58125 6.05308 9.01875 3.04683 12.1469 2.59995ZM17.3062 21.6125C16.1281 22.7906 14.5844 23.4406 13 23.4406C9.46563 23.4406 6.62188 20.2312 6.62188 16.2906V11.9843H19.4187V16.2906C19.4187 18.3218 18.6469 20.2718 17.3062 21.6125Z" />
      </svg>,
    ];
    return icons[index % icons.length];
  };

  return (
    <div className="rounded-lg border border-stroke bg-white p-4 shadow-1 dark:border-dark-3 dark:bg-dark-2">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h5 className="text-xl font-semibold text-dark dark:text-white">
            Конверсия проектов
          </h5>
          <p className="text-sm text-body-color dark:text-dark-6 sm:text-base">
            Показатели эффективности по проектам
          </p>
        </div>
        {hasMoreProjects && (
          <button
            onClick={() => setShowAll(!showAll)}
            className="text-primary hover:text-primary/80 text-xs font-medium"
          >
            {showAll ? "Скрыть" : "Подробнее"}
          </button>
        )}
      </div>
      
      <div className="-mx-2 flex flex-wrap">
        {displayedProjects.map((project, index) => (
          <div key={project.id} className="w-full px-2">
            <div className="shadow-1 dark:bg-dark-2 dark:shadow-box-dark relative mb-4 flex items-center rounded-[10px] bg-white px-4 py-6">
              <div className="bg-primary mr-3 flex h-[40px] w-full max-w-[40px] items-center justify-center rounded-full text-white">
                {getProjectIcon(index)}
              </div>
              <div className="flex-1">
                <h4 className="text-dark dark:text-white text-base font-semibold mb-1">
                  {project.name}
                </h4>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <p className="text-body-color dark:text-dark-6">Конверсия</p>
                    <p className="text-dark dark:text-white font-semibold">
                      {project.conversionRate}%
                    </p>
                  </div>
                  <div>
                    <p className="text-body-color dark:text-dark-6">Посетители</p>
                    <p className="text-dark dark:text-white font-semibold">
                      {project.visitors.toLocaleString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-body-color dark:text-dark-6">Заказы</p>
                    <p className="text-dark dark:text-white font-semibold">
                      {project.orders}
                    </p>
                  </div>
                  <div>
                    <p className="text-body-color dark:text-dark-6">Доход</p>
                    <p className="text-dark dark:text-white font-semibold">
                      {project.revenue.toLocaleString()} ₽
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="absolute top-2 right-2 flex items-center gap-1">
                {getTrendIcon(project.trend)}
                <span className={`text-[10px] font-medium ${
                  project.trend === 'up' ? 'text-success' : 
                  project.trend === 'down' ? 'text-danger' : 'text-body-color'
                }`}>
                  {project.trendValue > 0 ? '+' : ''}{project.trendValue}%
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProjectConversionWidget; 