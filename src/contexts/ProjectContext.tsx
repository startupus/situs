import React, { createContext, useContext, useState, useEffect } from 'react';
import { Project, ProjectPage, CreatePageData, UpdatePageData } from '../types/project';
import { projectsApi, ProjectFilters } from '../api/services/projects.api';
import { ApiUtils } from '../api/client';

interface ProjectContextType {
  currentProject: Project | null;
  currentPage: ProjectPage | null;
  pages: ProjectPage[];

  // Управление проектом
  loadProject: (projectId: string) => Promise<void>;
  updateProject: (updates: Partial<Project>) => Promise<void>;

  // Управление страницами
  createPage: (data: CreatePageData) => Promise<ProjectPage>;
  updatePage: (pageId: string, data: UpdatePageData) => Promise<void>;
  deletePage: (pageId: string) => Promise<void>;
  loadPage: (pageId: string) => Promise<void>;
  savePage: (pageId: string, content: any) => Promise<void>;
  publishPage: (pageId: string) => Promise<void>;

  // Состояние
  isLoading: boolean;
  error: string | null;
}

const ProjectContext = createContext<ProjectContextType | undefined>(undefined);

export const useProject = () => {
  const context = useContext(ProjectContext);
  if (context === undefined) {
    throw new Error('useProject must be used within a ProjectProvider');
  }
  return context;
};

interface ProjectProviderProps {
  children: React.ReactNode;
}

export const ProjectProvider: React.FC<ProjectProviderProps> = ({ children }) => {
  const [currentProject, setCurrentProject] = useState<Project | null>(null);
  const [currentPage, setCurrentPage] = useState<ProjectPage | null>(null);
  const [pages, setPages] = useState<ProjectPage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Генерация slug из заголовка
  const generateSlug = (title: string): string => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '') // Удаляем спецсимволы
      .replace(/\s+/g, '-') // Заменяем пробелы на дефисы
      .replace(/-+/g, '-') // Убираем повторяющиеся дефисы
      .trim();
  };

  // Загрузка проекта
  const loadProject = async (projectId: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const project = await projectsApi.getProject(projectId);

      setCurrentProject(project);
      setPages(project.pages || []);

      // Автоматически загружаем первую страницу
      if (project.pages && project.pages.length > 0) {
        setCurrentPage(project.pages[0]);
      }
    } catch (err) {
      const errorMessage = ApiUtils.handleError(err);
      setError(errorMessage);
      console.error('Load project error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // Обновление проекта
  const updateProject = async (updates: Partial<Project>) => {
    if (!currentProject) return;

    setIsLoading(true);
    setError(null);

    try {
      const updatedProject = await projectsApi.updateProject(currentProject.id, updates);
      setCurrentProject(updatedProject);
      console.log('Project updated:', updates);
    } catch (err) {
      const errorMessage = ApiUtils.handleError(err);
      setError(errorMessage);
      console.error('Update project error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // Создание страницы
  const createPage = async (data: CreatePageData): Promise<ProjectPage> => {
    if (!currentProject) throw new Error('Проект не загружен');

    setIsLoading(true);
    try {
      const newPage: ProjectPage = {
        id: Date.now().toString(),
        title: data.title,
        slug: data.slug || generateSlug(data.title),
        content: { blocks: [] },
        meta: {},
        status: 'draft',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const updatedPages = [...pages, newPage];
      setPages(updatedPages);

      // Обновляем проект
      await updateProject({ pages: updatedPages });

      return newPage;
    } catch (err) {
      setError('Ошибка создания страницы');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  // Обновление страницы
  const updatePage = async (pageId: string, data: UpdatePageData) => {
    setIsLoading(true);
    try {
      const updatedPages = pages.map((page) => {
        if (page.id === pageId) {
          const updated = {
            ...page,
            ...data,
            updatedAt: new Date(),
          };

          // Если обновляем текущую страницу
          if (currentPage?.id === pageId) {
            setCurrentPage(updated);
          }

          return updated;
        }
        return page;
      });

      setPages(updatedPages);
      await updateProject({ pages: updatedPages });

      console.log('Page updated:', data);
    } catch (err) {
      setError('Ошибка обновления страницы');
      console.error('Update page error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // Удаление страницы
  const deletePage = async (pageId: string) => {
    setIsLoading(true);
    try {
      const updatedPages = pages.filter((page) => page.id !== pageId);
      setPages(updatedPages);

      // Если удаляем текущую страницу, сбрасываем её
      if (currentPage?.id === pageId) {
        setCurrentPage(updatedPages.length > 0 ? updatedPages[0] : null);
      }

      await updateProject({ pages: updatedPages });
      console.log('Page deleted:', pageId);
    } catch (err) {
      setError('Ошибка удаления страницы');
      console.error('Delete page error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // Загрузка страницы
  const loadPage = async (pageId: string) => {
    const page = pages.find((p) => p.id === pageId);
    if (page) {
      setCurrentPage(page);
    } else {
      setError('Страница не найдена');
    }
  };

  // Сохранение контента страницы
  const savePage = async (pageId: string, content: any) => {
    await updatePage(pageId, { content });
  };

  // Публикация страницы
  const publishPage = async (pageId: string) => {
    await updatePage(pageId, {
      status: 'published',
      publishedAt: new Date(),
    });
  };

  const value: ProjectContextType = {
    currentProject,
    currentPage,
    pages,
    loadProject,
    updateProject,
    createPage,
    updatePage,
    deletePage,
    loadPage,
    savePage,
    publishPage,
    isLoading,
    error,
  };

  return <ProjectContext.Provider value={value}>{children}</ProjectContext.Provider>;
};

export default ProjectContext;
