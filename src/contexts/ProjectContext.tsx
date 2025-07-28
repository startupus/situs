import React, { createContext, useContext, useState, useEffect } from 'react';
import { Project, ProjectPage, CreatePageData, UpdatePageData } from '../types/project';

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
      // В реальном приложении здесь будет API вызов
      // Пока используем моковые данные
      const mockProject: Project = {
        id: projectId,
        name: 'Мой Сайт',
        description: 'Описание проекта',
        domain: 'my-site.com',
        template: 'business',
        settings: {
          theme: 'auto',
          primaryColor: '#3B82F6',
          favicon: '/favicon.ico',
          logo: '/logo.svg'
        },
        pages: [
          {
            id: '1',
            title: 'Главная страница',
            slug: 'home',
            content: { blocks: [] },
            meta: {
              description: 'Добро пожаловать на наш сайт',
              keywords: ['главная', 'сайт', 'компания']
            },
            status: 'published',
            createdAt: new Date('2024-01-01'),
            updatedAt: new Date(),
            publishedAt: new Date('2024-01-01')
          },
          {
            id: '2',
            title: 'О нас',
            slug: 'about',
            content: { blocks: [] },
            meta: {
              description: 'Информация о нашей компании'
            },
            status: 'draft',
            createdAt: new Date('2024-01-02'),
            updatedAt: new Date()
          }
        ],
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date(),
        owner: 'user-1',
        isPublic: false
      };

      setCurrentProject(mockProject);
      setPages(mockProject.pages);
      
      // Автоматически загружаем первую страницу
      if (mockProject.pages.length > 0) {
        setCurrentPage(mockProject.pages[0]);
      }
    } catch (err) {
      setError('Ошибка загрузки проекта');
      console.error('Load project error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // Обновление проекта
  const updateProject = async (updates: Partial<Project>) => {
    if (!currentProject) return;
    
    setIsLoading(true);
    try {
      const updatedProject = {
        ...currentProject,
        ...updates,
        updatedAt: new Date()
      };
      
      setCurrentProject(updatedProject);
      console.log('Project updated:', updates);
    } catch (err) {
      setError('Ошибка обновления проекта');
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
        updatedAt: new Date()
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
      const updatedPages = pages.map(page => {
        if (page.id === pageId) {
          const updated = {
            ...page,
            ...data,
            updatedAt: new Date()
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
      const updatedPages = pages.filter(page => page.id !== pageId);
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
    const page = pages.find(p => p.id === pageId);
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
      publishedAt: new Date()
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
    error
  };

  return (
    <ProjectContext.Provider value={value}>
      {children}
    </ProjectContext.Provider>
  );
};

export default ProjectContext; 