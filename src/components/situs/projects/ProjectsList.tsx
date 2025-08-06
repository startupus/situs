import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useSite } from '../../../contexts/SiteContext';
import { ProjectData, ProjectProduct } from '../../../types/project';
import ProjectProducts from './ProjectProducts';
import { projectsApi } from '../../../api/services/projects.api';

const ProjectsList: React.FC = () => {
  const { state } = useSite();
  const [selectedProject, setSelectedProject] = useState<ProjectData | null>(null);
  const [projectsData, setProjectsData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  // Загружаем данные проектов с продуктами
  useEffect(() => {
    const loadProjects = async () => {
      setLoading(true);
      try {
        const response = await projectsApi.getProjects();
        setProjectsData(response.projects || []);
      } catch (error) {
        console.error('Ошибка загрузки проектов:', error);
      } finally {
        setLoading(false);
      }
    };

    loadProjects();
  }, []);

  // Используем данные из API вместо SiteContext
  const projects = projectsData.map(project => ({
    id: project.id,
    name: project.name,
    description: project.description,
    type: project.template || 'website',
    status: 'active',
    createdAt: project.createdAt,
    updatedAt: project.updatedAt,
    products: project.products || [],
    settings: project.settings
  }));

  const error = state.error;

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
      <div className="space-y-6">
        {/* Заголовок */}
        <div>
          <h1 className="text-2xl font-bold text-dark dark:text-white">
            Проекты
          </h1>
          <p className="text-body-color dark:text-dark-6 mt-1">
            Управляйте всеми своими проектами в одном месте
          </p>
        </div>
        
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
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        {/* Заголовок */}
        <div>
          <h1 className="text-2xl font-bold text-dark dark:text-white">
            Проекты
          </h1>
          <p className="text-body-color dark:text-dark-6 mt-1">
            Управляйте всеми своими проектами в одном месте
          </p>
        </div>
        
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
      </div>
    );
  }

  if (projects.length === 0) {
    return (
      <div className="space-y-6">
        {/* Заголовок */}
        <div>
          <h1 className="text-2xl font-bold text-dark dark:text-white">
            Проекты
          </h1>
          <p className="text-body-color dark:text-dark-6 mt-1">
            Управляйте всеми своими проектами в одном месте
          </p>
        </div>
        
        <div className="text-center py-12">
          <svg
            width="64"
            height="64"
            viewBox="0 0 64 64"
            className="fill-current text-gray-400 dark:text-dark-6 mx-auto mb-4"
          >
            <path d="M32 8C18.745 8 8 18.745 8 32C8 45.255 18.745 56 32 56C45.255 56 56 45.255 56 32C56 18.745 45.255 8 32 8ZM32 52C21.177 52 12 42.823 12 32C12 21.177 21.177 12 32 12C42.823 12 52 21.177 52 32C52 42.823 42.823 52 32 52Z"/>
            <path d="M16 16H48V48H16V16ZM18 18V46H46V18H18Z"/>
            <path d="M24 24H40V32H24V24ZM24 36H40V44H24V36Z"/>
          </svg>
          <h3 className="text-lg font-semibold text-dark dark:text-white mb-2">
            Проекты не найдены
          </h3>
          <p className="text-body-color dark:text-dark-6 mb-4">
            Создайте свой первый проект
          </p>
        </div>
      </div>
    );
  }

  // Если выбран проект для просмотра продуктов
  if (selectedProject) {
    return (
      <ProjectProducts
        project={selectedProject}
        onBack={() => setSelectedProject(null)}
        onProductCreated={handleProductCreated}
      />
    );
  }

  return (
    <div className="space-y-6">
      {/* Заголовок */}
      <div>
        <h1 className="text-2xl font-bold text-dark dark:text-white">
          Проекты
        </h1>
        <p className="text-body-color dark:text-dark-6 mt-1">
          Управляйте всеми своими проектами в одном месте
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map((project) => {
          const productCount = project.products?.length || 0;
          const firstProduct = project.products?.[0];
          
          return (
            <div key={project.id} className="bg-white dark:bg-dark-2 rounded-lg p-6 border border-stroke dark:border-dark-3 hover:border-primary dark:hover:border-primary transition-colors">
              {/* Иконка типа проекта */}
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                  {getProjectTypeIcon(project.type)}
                </div>
                <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(project.status)}`}>
                  {getStatusText(project.status)}
                </span>
              </div>

              {/* Информация о проекте */}
              <div className="mb-4">
                <h3 className="text-lg font-semibold text-dark dark:text-white mb-2">
                  {project.name}
                </h3>
                <p className="text-body-color dark:text-dark-6 text-sm mb-3">
                  {project.description}
                </p>
                
                {/* Информация о продуктах */}
                <div className="flex items-center justify-between text-sm text-body-color dark:text-dark-6">
                  <span>Продуктов: {productCount}</span>
                  <span>{new Date(project.createdAt).toLocaleDateString('ru-RU')}</span>
                </div>
              </div>

              {/* Кнопки действий */}
              <div className="flex gap-2">
                {productCount > 0 && (
                  <button
                    onClick={() => setSelectedProject(project)}
                    className="flex-1 inline-flex items-center justify-center gap-2 px-3 py-2 bg-primary/10 text-primary rounded-lg text-sm font-medium hover:bg-primary/20 transition-colors"
                  >
                    <svg width="16" height="16" viewBox="0 0 16 16" className="fill-current">
                      <path d="M8 1C8.55228 1 9 1.44772 9 2V7H14C14.5523 7 15 7.44772 15 8C15 8.55228 14.5523 9 14 9H9V14C9 14.5523 8.55228 15 8 15C7.44772 15 7 14.5523 7 14V9H2C1.44772 9 1 8.55228 1 8C1 7.44772 1.44772 7 2 7H7V2C7 1.44772 7.44772 1 8 1Z"/>
                    </svg>
                    Продукты
                  </button>
                )}
                
                {firstProduct && (
                  <Link
                    to={`/redaktus?project=${project.id}&product=${firstProduct.id}`}
                    className="flex-1 inline-flex items-center justify-center gap-2 px-3 py-2 bg-primary text-white rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors"
                  >
                    <svg width="16" height="16" viewBox="0 0 16 16" className="fill-current">
                      <path d="M2 2C1.44772 2 1 2.44772 1 3V13C1 13.5523 1.44772 14 2 14H14C14.5523 14 15 13.5523 15 13V3C15 2.44772 14.5523 2 14 2H2ZM2 3H14V13H2V3Z"/>
                      <path d="M4 4H12V6H4V4ZM4 8H12V10H4V8ZM4 12H8V14H4V12Z"/>
                    </svg>
                    Редактор
                  </Link>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

// Вспомогательные функции
const getProjectTypeIcon = (type: string) => {
  const iconClass = "w-6 h-6 fill-current text-primary";
  
  switch (type.toLowerCase()) {
    case 'website':
      return (
        <svg viewBox="0 0 24 24" className={iconClass}>
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.94-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/>
        </svg>
      );
    case 'store':
      return (
        <svg viewBox="0 0 24 24" className={iconClass}>
          <path d="M7 18c-1.1 0-1.99.9-1.99 2S5.9 22 7 22s2-.9 2-2-.9-2-2-2zM1 2v2h2l3.6 7.59-1.35 2.45c-.16.28-.25.61-.25.96 0 1.1.9 2 2 2h12v-2H7.42c-.14 0-.25-.11-.25-.25l.03-.12L8.1 13h7.45c.75 0 1.41-.41 1.75-1.03L21.7 4H5.21l-.94-2H1zm16 16c-1.1 0-1.99.9-1.99 2s.89 2 1.99 2 2-.9 2-2-.9-2-2-2z"/>
        </svg>
      );
    default:
      return (
        <svg viewBox="0 0 24 24" className={iconClass}>
          <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z"/>
        </svg>
      );
  }
};

const getStatusColor = (status: string) => {
  switch (status) {
    case 'active':
      return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
    case 'inactive':
      return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    default:
      return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
  }
};

const getStatusText = (status: string) => {
  switch (status) {
    case 'active':
      return 'Активен';
    case 'inactive':
      return 'Неактивен';
    default:
      return 'Активен';
  }
};

export default ProjectsList;
