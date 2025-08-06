import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useSite } from '../../../contexts/SiteContext';
import { ProjectData, ProjectProduct } from '../../../types/project';
import ProjectProducts from './ProjectProducts';

interface ProjectsListProps {
  selectedType: string;
  searchTerm: string;
}

const ProjectsList: React.FC<ProjectsListProps> = ({ selectedType, searchTerm }) => {
  const { state } = useSite();
  const [selectedProject, setSelectedProject] = useState<ProjectData | null>(null);

  // Используем данные из SiteContext вместо отдельного запроса
  const projects = state.sites.map(site => ({
    id: site.id,
    name: site.name,
    description: site.description,
    type: site.template || 'website',
    status: 'active',
    createdAt: site.createdAt,
    updatedAt: site.updatedAt,
    products: [],
    settings: site.settings
  }));

  const loading = state.loading;
  const error = state.error;

  const filteredProjects = projects.filter(project => {
    const matchesType = selectedType === "all" || project.type.toLowerCase() === selectedType.toLowerCase();
    const matchesSearch = project.name.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesType && matchesSearch;
  });

  const handleProductCreated = (product: ProjectProduct) => {
    // Обновляем проект с новым продуктом
    if (selectedProject) {
      const updatedProject = {
        ...selectedProject,
        products: [...(selectedProject.products || []), product]
      };
      setSelectedProject(updatedProject);
    }
  };

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, index) => (
          <div key={index} className="bg-white dark:bg-dark-2 rounded-lg p-6 border border-stroke dark:border-dark-3 animate-pulse">
            <div className="h-40 bg-gray-200 dark:bg-dark-3 rounded-lg mb-4"></div>
            <div className="h-4 bg-gray-200 dark:bg-dark-3 rounded mb-2"></div>
            <div className="h-3 bg-gray-200 dark:bg-dark-3 rounded mb-4"></div>
            <div className="flex justify-between">
              <div className="h-3 bg-gray-200 dark:bg-dark-3 rounded w-16"></div>
              <div className="h-3 bg-gray-200 dark:bg-dark-3 rounded w-20"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <svg
          width="64"
          height="64"
          viewBox="0 0 64 64"
          className="fill-current text-red-500 mx-auto mb-4"
        >
          <path d="M32 8C18.745 8 8 18.745 8 32C8 45.255 18.745 56 32 56C45.255 56 56 45.255 56 32C56 18.745 45.255 8 32 8ZM32 52C21.177 52 12 42.823 12 32C12 21.177 21.177 12 32 12C42.823 12 52 21.177 52 32C52 42.823 42.823 52 32 52Z"/>
          <path d="M32 20C25.373 20 20 25.373 20 32C20 38.627 25.373 44 32 44C38.627 44 44 38.627 44 32C44 25.373 38.627 20 32 20ZM32 40C27.589 40 24 36.411 24 32C24 27.589 27.589 24 32 24C36.411 24 40 27.589 40 32C40 36.411 36.411 40 32 40Z"/>
        </svg>
        <h3 className="text-lg font-semibold text-dark dark:text-white mb-2">
          Ошибка загрузки проектов
        </h3>
        <p className="text-body-color dark:text-dark-6 mb-4">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary/90 transition-colors"
        >
          Попробовать снова
        </button>
      </div>
    );
  }

  if (filteredProjects.length === 0) {
    return (
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
          Проекты не найдены
        </h3>
        <p className="text-body-color dark:text-dark-6 mb-4">
          {searchTerm || selectedType !== "all"
            ? "Попробуйте изменить фильтры поиска"
            : "Создайте свой первый проект"
          }
        </p>
      </div>
    );
  }

  const getProjectTypeIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case 'website':
        return (
          <svg width="20" height="20" viewBox="0 0 20 20" className="fill-current">
            <path d="M10 2C5.58 2 2 5.58 2 10C2 14.42 5.58 18 10 18C14.42 18 18 14.42 18 10C18 5.58 14.42 2 10 2ZM10 16C6.69 16 4 13.31 4 10C4 6.69 6.69 4 10 4C13.31 4 16 6.69 16 10C16 13.31 13.31 16 10 16Z"/>
            <path d="M7 7H13V9H7V7ZM7 11H13V13H7V11Z"/>
          </svg>
        );
      case 'store':
      case 'ecommerce':
        return (
          <svg width="20" height="20" viewBox="0 0 20 20" className="fill-current">
            <path d="M3 3V5H4V16C4 16.55 4.45 17 5 17H15C15.55 17 16 16.55 16 16V5H17V3H3ZM5 5H15V16H5V5Z"/>
            <path d="M7 7V9H8V7H7ZM10 7V9H11V7H10Z"/>
          </svg>
        );
      default:
        return (
          <svg width="20" height="20" viewBox="0 0 20 20" className="fill-current">
            <path d="M2 3C2 2.45 2.45 2 3 2H17C17.55 2 18 2.45 18 3V17C18 17.55 17.55 18 17 18H3C2.45 18 2 17.55 2 17V3ZM4 4V16H16V4H4Z"/>
            <path d="M6 6H14V8H6V6ZM6 10H14V12H6V10Z"/>
          </svg>
        );
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'published':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'draft':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'archived':
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
      default:
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
    }
  };

  const getStatusText = (status: string) => {
    switch (status.toLowerCase()) {
      case 'published':
        return 'Опубликован';
      case 'draft':
        return 'Черновик';
      case 'archived':
        return 'Архив';
      default:
        return status;
    }
  };

  // Если выбран проект, показываем его продукты
  if (selectedProject) {
    return (
      <div className="space-y-6">
        {/* Кнопка возврата */}
        <div className="flex items-center gap-4">
          <button
            onClick={() => setSelectedProject(null)}
            className="inline-flex items-center gap-2 text-body-color dark:text-dark-6 hover:text-primary dark:hover:text-primary transition-colors"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" className="fill-current">
              <path d="M10.5 3.5L5.5 8.5L10.5 13.5L9.5 14.5L3.5 8.5L9.5 2.5L10.5 3.5Z"/>
            </svg>
            Назад к проектам
          </button>
          <h2 className="text-xl font-semibold text-dark dark:text-white">
            {selectedProject.name}
          </h2>
        </div>

        {/* Продукты проекта */}
        <ProjectProducts
          projectId={selectedProject.id}
          products={selectedProject.products || []}
          onProductCreated={handleProductCreated}
        />
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {filteredProjects.map((project) => (
        <div
          key={project.id}
          className="group bg-white dark:bg-dark-2 rounded-lg p-6 border border-stroke dark:border-dark-3 hover:border-primary dark:hover:border-primary transition-all duration-200 hover:shadow-lg"
        >
          {/* Превью изображение проекта */}
          <div className="h-40 bg-gradient-to-br from-primary/10 to-primary/5 rounded-lg mb-4 flex items-center justify-center border border-stroke/50 dark:border-dark-3">
            <div className="text-primary opacity-60">
              {getProjectTypeIcon(project.type)}
            </div>
          </div>

          {/* Информация о проекте */}
          <div className="mb-4">
            <div className="flex items-start justify-between mb-2">
              <h3 className="text-lg font-semibold text-dark dark:text-white group-hover:text-primary transition-colors line-clamp-2">
                {project.name}
              </h3>
              <div className="flex-shrink-0 ml-2">
                <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(project.status)}`}>
                  {getStatusText(project.status)}
                </span>
              </div>
            </div>
            
            {project.description && (
              <p className="text-sm text-body-color dark:text-dark-6 line-clamp-2 mb-3">
                {project.description}
              </p>
            )}

            <div className="flex items-center justify-between text-xs text-body-color dark:text-dark-6">
              <span>Страниц: {project.pages?.length || 0}</span>
              <span>{new Date(project.createdAt).toLocaleDateString('ru-RU')}</span>
            </div>
          </div>

          {/* Домен */}
          {project.domain && (
            <div className="pt-3 border-t border-stroke dark:border-dark-3">
              <p className="text-xs text-body-color dark:text-dark-6 truncate">
                {project.domain}
              </p>
            </div>
          )}

          {/* Действия */}
          <div className="flex gap-2 pt-3 border-t border-stroke dark:border-dark-3">
            <button
              onClick={() => setSelectedProject(project)}
              className="flex-1 inline-flex items-center justify-center gap-2 px-3 py-2 text-sm font-medium text-primary border border-primary rounded-lg hover:bg-primary hover:text-white transition-colors"
            >
              <svg width="14" height="14" viewBox="0 0 14 14" className="fill-current">
                <path d="M7 1C3.68629 1 1 3.68629 1 7C1 10.3137 3.68629 13 7 13C10.3137 13 13 10.3137 13 7C13 3.68629 10.3137 1 7 1ZM7 11C4.79086 11 3 9.20914 3 7C3 4.79086 4.79086 3 7 3C9.20914 3 11 4.79086 11 7C11 9.20914 9.20914 11 7 11Z"/>
                <path d="M5 5H9V7H5V5ZM5 9H9V11H5V9Z"/>
              </svg>
              Продукты
            </button>
            <Link
              to={`/projects/${project.id}`}
              className="flex-1 inline-flex items-center justify-center gap-2 px-3 py-2 text-sm font-medium text-body-color dark:text-dark-6 border border-stroke dark:border-dark-3 rounded-lg hover:border-primary dark:hover:border-primary transition-colors"
            >
              <svg width="14" height="14" viewBox="0 0 14 14" className="fill-current">
                <path d="M10 2H4C3.44772 2 3 2.44772 3 3V11C3 11.5523 3.44772 12 4 12H10C10.5523 12 11 11.5523 11 11V3C11 2.44772 10.5523 2 10 2ZM10 11H4V3H10V11Z"/>
                <path d="M7 5H9V7H7V5ZM7 9H9V11H7V9Z"/>
              </svg>
              Открыть
            </Link>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ProjectsList;
