import React, { useState, useEffect } from 'react';
import { getProject, getPage, updatePage, ProjectData, PageData } from '../../services/projectApi';

interface ProjectManagerProps {
  projectId?: string;
  pageId?: string;
  onProjectLoad?: (project: ProjectData) => void;
  onPageLoad?: (page: PageData) => void;
  onPageUpdate?: (page: PageData) => void;
  children: React.ReactNode;
}

interface ProjectManagerState {
  project: ProjectData | null;
  currentPage: PageData | null;
  loading: boolean;
  error: string | null;
  saving: boolean;
}

/**
 * Менеджер проектов для редактора
 * Загружает проект и страницы из API, обеспечивает сохранение
 */
export const ProjectManager: React.FC<ProjectManagerProps> = ({
  projectId,
  pageId,
  onProjectLoad,
  onPageLoad,
  onPageUpdate,
  children,
}) => {
  const [state, setState] = useState<ProjectManagerState>({
    project: null,
    currentPage: null,
    loading: false,
    error: null,
    saving: false,
  });

  // Загрузка проекта
  useEffect(() => {
    if (!projectId) return;

    let cancelled = false;

    const loadProject = async () => {
      setState((prev) => ({ ...prev, loading: true, error: null }));

      try {
        console.log('🚀 ProjectManager: Загрузка проекта', projectId);
        const project = await getProject(projectId);

        if (cancelled) return;

        console.log('✅ ProjectManager: Проект загружен', project.name);
        setState((prev) => ({ ...prev, project, loading: false }));

        if (onProjectLoad) {
          onProjectLoad(project);
        }
      } catch (error) {
        if (cancelled) return;

        console.error('❌ ProjectManager: Ошибка загрузки проекта:', error);
        setState((prev) => ({
          ...prev,
          loading: false,
          error: error instanceof Error ? error.message : 'Неизвестная ошибка',
        }));
      }
    };

    loadProject();

    return () => {
      cancelled = true;
    };
  }, [projectId, onProjectLoad]);

  // Загрузка страницы
  useEffect(() => {
    if (!pageId) return;

    let cancelled = false;

    const loadPage = async () => {
      setState((prev) => ({ ...prev, loading: true, error: null }));

      try {
        console.log('📄 ProjectManager: Загрузка страницы', pageId);
        const page = await getPage(pageId);

        if (cancelled) return;

        console.log('✅ ProjectManager: Страница загружена', page.title);
        setState((prev) => ({ ...prev, currentPage: page, loading: false }));

        if (onPageLoad) {
          onPageLoad(page);
        }
      } catch (error) {
        if (cancelled) return;

        console.error('❌ ProjectManager: Ошибка загрузки страницы:', error);
        setState((prev) => ({
          ...prev,
          loading: false,
          error: error instanceof Error ? error.message : 'Неизвестная ошибка',
        }));
      }
    };

    loadPage();

    return () => {
      cancelled = true;
    };
  }, [pageId, onPageLoad]);

  // Функция сохранения страницы
  const savePage = async (pageData: Partial<PageData>): Promise<void> => {
    if (!state.currentPage) {
      throw new Error('Нет текущей страницы для сохранения');
    }

    setState((prev) => ({ ...prev, saving: true, error: null }));

    try {
      console.log('💾 ProjectManager: Сохранение страницы', state.currentPage.id);
      const updatedPage = await updatePage(state.currentPage.id, pageData);

      console.log('✅ ProjectManager: Страница сохранена');
      setState((prev) => ({ ...prev, currentPage: updatedPage, saving: false }));

      if (onPageUpdate) {
        onPageUpdate(updatedPage);
      }
    } catch (error) {
      console.error('❌ ProjectManager: Ошибка сохранения страницы:', error);
      setState((prev) => ({
        ...prev,
        saving: false,
        error: error instanceof Error ? error.message : 'Ошибка сохранения',
      }));
      throw error;
    }
  };

  // Контекст для дочерних компонентов
  const contextValue = {
    project: state.project,
    currentPage: state.currentPage,
    loading: state.loading,
    error: state.error,
    saving: state.saving,
    savePage,
  };

  // Передаем контекст через React Context или пропсы
  return <ProjectManagerContext.Provider value={contextValue}>{children}</ProjectManagerContext.Provider>;
};

// React Context для доступа к данным проекта
export const ProjectManagerContext = React.createContext<{
  project: ProjectData | null;
  currentPage: PageData | null;
  loading: boolean;
  error: string | null;
  saving: boolean;
  savePage: (pageData: Partial<PageData>) => Promise<void>;
} | null>(null);

// Хук для использования контекста
export const useProjectManager = () => {
  const context = React.useContext(ProjectManagerContext);
  if (!context) {
    throw new Error('useProjectManager must be used within ProjectManager');
  }
  return context;
};
