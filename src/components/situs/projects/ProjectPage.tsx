import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { FiArrowLeft, FiSettings } from 'react-icons/fi';
import { projectsApi } from '../../../api/services/projects.api';
import { ProjectData } from '../../../types/project';
import { useProject } from '../../../contexts/ProjectContext';

interface ProjectPageProps {}

const ProjectPage: React.FC<ProjectPageProps> = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const [project, setProject] = useState<ProjectData | null>(null);
  const [loading, setLoading] = useState(true);
  const { loadProject } = (() => {
    try {
      return useProject();
    } catch {
      return { loadProject: async () => {} } as any;
    }
  })();
  // временно: страница очищена до заголовка

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

  // Синхронизируем ProjectContext, чтобы верхняя панель показывала название проекта
  useEffect(() => {
    if (projectId) {
      // не блокируем UI
      Promise.resolve(loadProject(projectId)).catch(() => {});
    }
  }, [projectId]);

  // все детали/вкладки будут добавлены на следующем шаге согласно ТЗ

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
          <FiArrowLeft aria-hidden />
        </Link>
      </div>
    );
  }

  // временно нет действий в хедере

  return (
    <div className="p-6" />
  );
};

export default ProjectPage;
