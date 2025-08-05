import React from 'react';

const ProjectsList = () => {
  const projects = [
    {
      id: 1,
      name: "Корпоративный сайт",
      status: "Активен",
      pages: 12,
      lastUpdate: "2024-01-15",
      type: "Бизнес"
    },
    {
      id: 2,
      name: "Интернет-магазин",
      status: "Активен",
      pages: 8,
      lastUpdate: "2024-01-10",
      type: "E-commerce"
    },
    {
      id: 3,
      name: "Блог",
      status: "Черновик",
      pages: 5,
      lastUpdate: "2024-01-08",
      type: "Блог"
    }
  ];

  return (
    <div className="w-full">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-dark dark:text-white">
          Все проекты
        </h1>
        <p className="text-body-color dark:text-dark-6">
          Управление вашими проектами и сайтами
        </p>
      </div>

      <div className="shadow-1 dark:bg-dark-2 dark:shadow-box-dark rounded-[10px] bg-white p-6">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-dark dark:text-white">
            Проекты ({projects.length})
          </h2>
          <button className="bg-primary hover:bg-opacity-90 text-white px-4 py-2 rounded-lg transition-all">
            Создать проект
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-stroke dark:border-dark-3">
                <th className="text-left py-3 px-4 font-medium text-dark dark:text-white">
                  Название
                </th>
                <th className="text-left py-3 px-4 font-medium text-dark dark:text-white">
                  Статус
                </th>
                <th className="text-left py-3 px-4 font-medium text-dark dark:text-white">
                  Страниц
                </th>
                <th className="text-left py-3 px-4 font-medium text-dark dark:text-white">
                  Тип
                </th>
                <th className="text-left py-3 px-4 font-medium text-dark dark:text-white">
                  Обновлен
                </th>
                <th className="text-left py-3 px-4 font-medium text-dark dark:text-white">
                  Действия
                </th>
              </tr>
            </thead>
            <tbody>
              {projects.map((project) => (
                <tr key={project.id} className="border-b border-stroke dark:border-dark-3 hover:bg-gray-50 dark:hover:bg-dark-3">
                  <td className="py-3 px-4">
                    <div className="font-medium text-dark dark:text-white">
                      {project.name}
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                      project.status === 'Активен' 
                        ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                        : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                    }`}>
                      {project.status}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-body-color dark:text-dark-6">
                    {project.pages}
                  </td>
                  <td className="py-3 px-4 text-body-color dark:text-dark-6">
                    {project.type}
                  </td>
                  <td className="py-3 px-4 text-body-color dark:text-dark-6">
                    {project.lastUpdate}
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex space-x-2">
                      <button className="text-primary hover:text-opacity-80 text-sm">
                        Редактировать
                      </button>
                      <button className="text-red-500 hover:text-red-700 text-sm">
                        Удалить
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ProjectsList; 