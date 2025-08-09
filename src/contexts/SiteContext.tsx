import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';
import { sitesApi, Site, Page, CreateSiteData } from '../api/services/sites.api';

// Типы для состояния
interface SiteState {
  sites: Site[];
  currentSite: Site | null;
  currentPage: Page | null;
  loading: boolean;
  error: string | null;
}

// Типы действий
type SiteAction =
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'SET_SITES'; payload: Site[] }
  | { type: 'SET_CURRENT_SITE'; payload: Site | null }
  | { type: 'SET_CURRENT_PAGE'; payload: Page | null }
  | { type: 'ADD_SITE'; payload: Site }
  | { type: 'UPDATE_SITE'; payload: Site }
  | { type: 'ADD_PAGE'; payload: Page }
  | { type: 'UPDATE_PAGE'; payload: Page }
  | { type: 'DELETE_PAGE'; payload: string };

// Начальное состояние
const initialState: SiteState = {
  sites: [],
  currentSite: null,
  currentPage: null,
  loading: false,
  error: null
};

// Reducer для управления состоянием
function siteReducer(state: SiteState, action: SiteAction): SiteState {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, loading: action.payload };

    case 'SET_ERROR':
      return { ...state, error: action.payload, loading: false };

    case 'SET_SITES':
      return { ...state, sites: action.payload, loading: false };

    case 'SET_CURRENT_SITE':
      return { ...state, currentSite: action.payload };

    case 'SET_CURRENT_PAGE':
      return { ...state, currentPage: action.payload };

    case 'ADD_SITE':
      return { ...state, sites: [...state.sites, action.payload] };

    case 'UPDATE_SITE':
      return {
        ...state,
        sites: state.sites.map(site => 
          site.id === action.payload.id ? action.payload : site
        ),
        currentSite: state.currentSite?.id === action.payload.id ? action.payload : state.currentSite
      };

    case 'ADD_PAGE':
      if (state.currentSite) {
        const updatedSite = {
          ...state.currentSite,
          pages: [...state.currentSite.pages, action.payload]
        };
        return {
          ...state,
          currentSite: updatedSite,
          sites: state.sites.map(site => 
            site.id === updatedSite.id ? updatedSite : site
          )
        };
      }
      return state;

    case 'UPDATE_PAGE':
      if (state.currentSite) {
        const updatedPages = state.currentSite.pages.map(page => 
          page.id === action.payload.id ? action.payload : page
        );
        const updatedSite = {
          ...state.currentSite,
          pages: updatedPages
        };
        return {
          ...state,
          currentSite: updatedSite,
          currentPage: state.currentPage?.id === action.payload.id ? action.payload : state.currentPage,
          sites: state.sites.map(site => 
            site.id === updatedSite.id ? updatedSite : site
          )
        };
      }
      return state;

    case 'DELETE_PAGE':
      if (state.currentSite) {
        const updatedPages = state.currentSite.pages.filter(page => page.id !== action.payload);
        const updatedSite = {
          ...state.currentSite,
          pages: updatedPages
        };
        return {
          ...state,
          currentSite: updatedSite,
          currentPage: state.currentPage?.id === action.payload ? null : state.currentPage,
          sites: state.sites.map(site => 
            site.id === updatedSite.id ? updatedSite : site
          )
        };
      }
      return state;

    default:
      return state;
  }
}

// Типы для контекста
interface SiteContextType {
  state: SiteState;
  actions: {
    loadSites: () => Promise<void>;
    selectSite: (siteId: string) => Promise<void>;
    selectPage: (pageId: string) => void;
    createSite: (data: Omit<Site, 'id' | 'createdAt' | 'updatedAt' | 'pages'>) => Promise<Site>;
    createPage: (data: Omit<Page, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
    updatePage: (pageId: string, data: Partial<Page>) => Promise<void>;
    deletePage: (pageId: string) => Promise<void>;
    savePageContent: (pageId: string, content: any[]) => Promise<void>;
  };
}

// Создание контекста
const SiteContext = createContext<SiteContextType | undefined>(undefined);

// Провайдер контекста
interface SiteProviderProps {
  children: ReactNode;
}

export function SiteProvider({ children }: SiteProviderProps) {
  const [state, dispatch] = useReducer(siteReducer, initialState);

  // Загрузка сайтов
  const loadSites = async () => {
    dispatch({ type: 'SET_LOADING', payload: true });
    try {
      const response = await sitesApi.getSites();
      // Не автосоздаем демо‑проект, просто показываем пустое состояние
      dispatch({ type: 'SET_SITES', payload: response.sites });
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error instanceof Error ? error.message : 'Ошибка загрузки сайтов' });
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  // Выбор сайта
  const selectSite = async (siteId: string) => {
    try {
      const site = await sitesApi.getSite(siteId);
      dispatch({ type: 'SET_CURRENT_SITE', payload: site });
      
      // Выбираем первую страницу, если есть
      if (site.pages.length > 0) {
        dispatch({ type: 'SET_CURRENT_PAGE', payload: site.pages[0] });
      }
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error instanceof Error ? error.message : 'Ошибка выбора сайта' });
    }
  };

  // Выбор страницы
  const selectPage = (pageId: string) => {
    if (state.currentSite) {
      const page = state.currentSite.pages.find(p => p.id === pageId);
      if (page) {
        dispatch({ type: 'SET_CURRENT_PAGE', payload: page });
      }
    }
  };

  // Создание сайта
  const createSite = async (data: Omit<Site, 'id' | 'createdAt' | 'updatedAt' | 'pages'>): Promise<Site> => {
    try {
      const siteData: CreateSiteData = {
        name: data.name,
        description: data.description,
        domain: data.domain,
        template: data.template,
        settings: data.settings
      };
      
      const newSite = await sitesApi.createSite(siteData);
      dispatch({ type: 'ADD_SITE', payload: newSite });
      return newSite;
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error instanceof Error ? error.message : 'Ошибка создания сайта' });
      throw error;
    }
  };

  // Создание страницы
  const createPage = async (data: Omit<Page, 'id' | 'createdAt' | 'updatedAt'>) => {
    if (!state.currentSite) {
      dispatch({ type: 'SET_ERROR', payload: 'Сайт не выбран' });
      return;
    }

    try {
      const pageData = {
        title: data.title,
        slug: data.slug,
        content: data.content || [],
        meta: data.meta || {
          description: '',
          keywords: [],
          ogImage: ''
        },
        status: data.status || 'draft'
      };

      const newPage = await sitesApi.createPage(state.currentSite.id, pageData);
      dispatch({ type: 'ADD_PAGE', payload: newPage });
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error instanceof Error ? error.message : 'Ошибка создания страницы' });
      throw error;
    }
  };

  // Обновление страницы
  const updatePage = async (pageId: string, data: Partial<Page>) => {
    try {
      const updatedPage = await sitesApi.updatePage(pageId, data);
      dispatch({ type: 'UPDATE_PAGE', payload: updatedPage });
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error instanceof Error ? error.message : 'Ошибка обновления страницы' });
    }
  };

  // Удаление страницы
  const deletePage = async (pageId: string) => {
    try {
      await sitesApi.deletePage(pageId);
      dispatch({ type: 'DELETE_PAGE', payload: pageId });
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error instanceof Error ? error.message : 'Ошибка удаления страницы' });
    }
  };

  // Сохранение контента страницы
  const savePageContent = async (pageId: string, content: any[]) => {
    try {
      await sitesApi.savePageContent(pageId, content);
      // Обновляем локальное состояние
      if (state.currentPage && state.currentPage.id === pageId) {
        const updatedPage = { ...state.currentPage, content };
        dispatch({ type: 'UPDATE_PAGE', payload: updatedPage });
      }
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error instanceof Error ? error.message : 'Ошибка сохранения контента' });
    }
  };

  // Загружаем сайты при монтировании
  useEffect(() => {
    loadSites();
  }, []);

  const contextValue: SiteContextType = {
    state,
    actions: {
      loadSites,
      selectSite,
      selectPage,
      createSite,
      createPage,
      updatePage,
      deletePage,
      savePageContent
    }
  };

  return (
    <SiteContext.Provider value={contextValue}>
      {children}
    </SiteContext.Provider>
  );
}

// Хук для использования контекста
export function useSite() {
  const context = useContext(SiteContext);
  if (context === undefined) {
    throw new Error('useSite must be used within a SiteProvider');
  }
  return context;
} 