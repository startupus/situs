import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { projectsApi } from '../../../api/services/projects.api';
import { ProjectData } from '../../../types/project';
import ProjectProducts from './ProjectProducts';
import ProjectAnalytics from './ProjectAnalytics';
import ProjectSettings from './ProjectSettings';

interface ProjectPageProps {
  onCreateProduct: () => void;
}

const ProjectPage: React.FC<ProjectPageProps> = ({ onCreateProduct }) => {
  const { projectId } = useParams<{ projectId: string }>();
  const [project, setProject] = useState<ProjectData | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'products' | 'analytics' | 'settings'>('products');

  useEffect(() => {
    const loadProject = async () => {
      if (!projectId) return;
      
      setLoading(true);
      try {
        const response = await projectsApi.getProject(projectId);
        setProject(response);
      } catch (error) {
        console.error('Ошибка загрузки проекта:', error);
      } finally {
        setLoading(false);
      }
    };

    loadProject();
  }, [projectId]);

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 dark:bg-dark-3 rounded w-1/3 mb-4"></div>
          <div className="h-4 bg-gray-200 dark:bg-dark-3 rounded w-1/2 mb-6"></div>
          <div className="h-10 bg-gray-200 dark:bg-dark-3 rounded mb-6"></div>
          <div className="h-64 bg-gray-200 dark:bg-dark-3 rounded"></div>
        </div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="p-6 text-center">
        <h2 className="text-xl font-semibold text-dark dark:text-white mb-2">
          Проект не найден
        </h2>
        <p className="text-body-color dark:text-dark-6 mb-4">
          Проект с указанным ID не существует
        </p>
        <Link
          to="/projects"
          className="inline-flex items-center justify-center w-10 h-10 rounded-lg bg-primary text-white hover:bg-primary/90 transition-colors"
          title="Назад к проектам"
        >
          <svg width="16" height="16" viewBox="0 0 16 16" className="fill-current">
            <path d="M10.5 3.5L5.5 8.5L10.5 13.5L9.5 14.5L3.5 8.5L9.5 2.5L10.5 3.5Z"/>
          </svg>
        </Link>
      </div>
    );
  }

  const tabs = [
    {
      id: 'products' as const,
      name: 'Продукты',
      icon: (
        <svg width="16" height="16" viewBox="0 0 16 16" className="fill-current">
          <path d="M2 2C1.44772 2 1 2.44772 1 3V13C1 13.5523 1.44772 14 2 14H14C14.5523 14 15 13.5523 15 13V3C15 2.44772 14.5523 2 14 2H2ZM2 3H14V13H2V3Z"/>
          <path d="M4 4H12V6H4V4ZM4 8H12V10H4V8ZM4 12H8V14H4V12Z"/>
        </svg>
      )
    },
    {
      id: 'analytics' as const,
      name: 'Аналитика',
      icon: (
        <svg width="16" height="16" viewBox="0 0 16 16" className="fill-current">
          <path d="M2 2V14H14V2H2ZM3 3H13V13H3V3Z"/>
          <path d="M5 10L7 8L9 10L11 8V11H5V10Z"/>
        </svg>
      )
    },
    {
      id: 'settings' as const,
      name: 'Настройки',
      icon: (
        <svg width="16" height="16" viewBox="0 0 16 16" className="fill-current">
          <path d="M8 1C8.55228 1 9 1.44772 9 2V3.5C9 3.77614 8.77614 4 8.5 4H7.5C7.22386 4 7 3.77614 7 3.5V2C7 1.44772 7.44772 1 8 1Z"/>
          <path d="M8 15C7.44772 15 7 14.5523 7 14V12.5C7 12.2239 7.22386 12 7.5 12H8.5C8.77614 12 9 12.2239 9 12.5V14C9 14.5523 8.55228 15 8 15Z"/>
          <path d="M14 8C14 7.44772 13.5523 7 13 7H11.5C11.2239 7 11 7.22386 11 7.5V8.5C11 8.77614 11.2239 9 11.5 9H13C13.5523 9 14 8.55228 14 8Z"/>
          <path d="M2 8C2 8.55228 2.44772 9 3 9H4.5C4.77614 9 5 8.77614 5 8.5V7.5C5 7.22386 4.77614 7 4.5 7H3C2.44772 7 2 7.44772 2 8Z"/>
          <path d="M12.5 3.5C12.5 3.22386 12.7239 3 13 3C13.2761 3 13.5 3.22386 13.5 3.5V4.5C13.5 4.77614 13.2761 5 13 5C12.7239 5 12.5 4.77614 12.5 4.5V3.5Z"/>
          <path d="M2.5 11.5C2.5 11.2239 2.72386 11 3 11C3.27614 11 3.5 11.2239 3.5 11.5V12.5C3.5 12.7761 3.27614 13 3 13C2.72386 13 2.5 12.7761 2.5 12.5V11.5Z"/>
          <path d="M11.5 12.5C11.5 12.2239 11.7239 12 12 12C12.2761 12 12.5 12.2239 12.5 12.5V13.5C12.5 13.7761 12.2761 14 12 14C11.7239 14 11.5 13.7761 11.5 13.5V12.5Z"/>
          <path d="M4.5 2.5C4.5 2.22386 4.72386 2 5 2C5.27614 2 5.5 2.22386 5.5 2.5V3.5C5.5 3.77614 5.27614 4 5 4C4.72386 4 4.5 3.77614 4.5 3.5V2.5Z"/>
        </svg>
      )
    }
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case 'products':
        return (
          <ProjectProducts
            project={project}
            onBack={() => {}}
            onProductCreated={() => {}}
          />
        );
      case 'analytics':
        return <ProjectAnalytics project={project} />;
      case 'settings':
        return <ProjectSettings project={project} />;
      default:
        return null;
    }
  };

  return (
    <div className="p-6">
      {/* Заголовок и кнопка добавления продукта */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-dark dark:text-white">
            {project.name}
          </h1>
          <p className="text-body-color dark:text-dark-6 mt-1">
            {project.description}
          </p>
        </div>
        {activeTab === 'products' && (
          <button
            onClick={onCreateProduct}
            className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary/90 transition-colors"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" className="fill-current">
              <path d="M8 1C8.55228 1 9 1.44772 9 2V7H14C14.5523 7 15 7.44772 15 8C15 8.55228 14.5523 9 14 9H9V14C9 14.5523 8.55228 15 8 15C7.44772 15 7 14.5523 7 14V9H2C1.44772 9 1 8.55228 1 8C1 7.44772 1.44772 7 2 7H7V2C7 1.44772 7.44772 1 8 1Z"/>
            </svg>
            Добавить продукт
          </button>
        )}
      </div>

      {/* Вкладки */}
      <div className="border-b border-stroke dark:border-dark-3 mb-6">
        <nav className="flex space-x-8">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`inline-flex items-center gap-2 py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === tab.id
                  ? 'border-primary text-primary'
                  : 'border-transparent text-body-color dark:text-dark-6 hover:text-dark dark:hover:text-white'
              }`}
            >
              <span className="flex-shrink-0">{tab.icon}</span>
              <span>{tab.name}</span>
            </button>
          ))}
        </nav>
      </div>

      {/* Содержимое вкладки */}
      <div>
        {renderTabContent()}
      </div>
    </div>
  );
};

export default ProjectPage;
