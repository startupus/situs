import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';
import { Site, Page, MockAPI } from '../api/mockData';

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
      return { 
        ...state, 
        sites: [...state.sites, action.payload],
        currentSite: action.payload
      };

    case 'UPDATE_SITE':
      return {
        ...state,
        sites: state.sites.map(site => 
          site.id === action.payload.id ? action.payload : site
        ),
        currentSite: state.currentSite?.id === action.payload.id ? action.payload : state.currentSite
      };

    case 'ADD_PAGE':
      const updatedSitesAdd = state.sites.map(site => {
        if (site.id === action.payload.siteId) {
          return { ...site, pages: [...site.pages, action.payload] };
        }
        return site;
      });
      
      return {
        ...state,
        sites: updatedSitesAdd,
        currentSite: state.currentSite?.id === action.payload.siteId 
          ? { ...state.currentSite, pages: [...state.currentSite.pages, action.payload] }
          : state.currentSite,
        currentPage: action.payload
      };

    case 'UPDATE_PAGE':
      const updatedSitesUpdate = state.sites.map(site => ({
        ...site,
        pages: site.pages.map(page => 
          page.id === action.payload.id ? action.payload : page
        )
      }));

      return {
        ...state,
        sites: updatedSitesUpdate,
        currentSite: state.currentSite ? {
          ...state.currentSite,
          pages: state.currentSite.pages.map(page => 
            page.id === action.payload.id ? action.payload : page
          )
        } : null,
        currentPage: state.currentPage?.id === action.payload.id ? action.payload : state.currentPage
      };

    case 'DELETE_PAGE':
      const updatedSitesDelete = state.sites.map(site => ({
        ...site,
        pages: site.pages.filter(page => page.id !== action.payload)
      }));

      return {
        ...state,
        sites: updatedSitesDelete,
        currentSite: state.currentSite ? {
          ...state.currentSite,
          pages: state.currentSite.pages.filter(page => page.id !== action.payload)
        } : null,
        currentPage: state.currentPage?.id === action.payload ? null : state.currentPage
      };

    default:
      return state;
  }
}

// Контекст
interface SiteContextType {
  state: SiteState;
  actions: {
    loadSites: () => Promise<void>;
    selectSite: (siteId: string) => Promise<void>;
    selectPage: (pageId: string) => void;
    createSite: (data: Omit<Site, 'id' | 'createdAt' | 'updatedAt' | 'pages'>) => Promise<void>;
    createPage: (data: Omit<Page, 'id' | 'siteId' | 'createdAt' | 'updatedAt'>) => Promise<void>;
    updatePage: (pageId: string, data: Partial<Page>) => Promise<void>;
    deletePage: (pageId: string) => Promise<void>;
    savePageContent: (pageId: string, content: any[]) => Promise<void>;
  };
}

const SiteContext = createContext<SiteContextType | null>(null);

// Provider компонент
interface SiteProviderProps {
  children: ReactNode;
}

export function SiteProvider({ children }: SiteProviderProps) {
  const [state, dispatch] = useReducer(siteReducer, initialState);

  // Загрузка сайтов
  const loadSites = async () => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      const sites = await MockAPI.getSites();
      dispatch({ type: 'SET_SITES', payload: sites });
      
      // Автоматически выбираем первый сайт и его первую страницу
      if (sites.length > 0) {
        dispatch({ type: 'SET_CURRENT_SITE', payload: sites[0] });
        if (sites[0].pages.length > 0) {
          dispatch({ type: 'SET_CURRENT_PAGE', payload: sites[0].pages[0] });
        }
      }
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: 'Ошибка загрузки сайтов' });
      console.error('Error loading sites:', error);
    }
  };

  // Выбор сайта
  const selectSite = async (siteId: string) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      const site = await MockAPI.getSite(siteId);
      if (site) {
        dispatch({ type: 'SET_CURRENT_SITE', payload: site });
        // Выбираем домашнюю страницу или первую доступную
        const homePage = site.pages.find(p => p.isHomePage) || site.pages[0];
        if (homePage) {
          dispatch({ type: 'SET_CURRENT_PAGE', payload: homePage });
        }
      }
      dispatch({ type: 'SET_LOADING', payload: false });
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: 'Ошибка загрузки сайта' });
      console.error('Error loading site:', error);
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
  const createSite = async (data: Omit<Site, 'id' | 'createdAt' | 'updatedAt' | 'pages'>) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      const newSite = await MockAPI.createSite(data);
      dispatch({ type: 'ADD_SITE', payload: newSite });
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: 'Ошибка создания сайта' });
      console.error('Error creating site:', error);
    }
  };

  // Создание страницы
  const createPage = async (data: Omit<Page, 'id' | 'siteId' | 'createdAt' | 'updatedAt'>) => {
    if (!state.currentSite) return;

    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      const newPage = await MockAPI.createPage(state.currentSite.id, data);
      dispatch({ type: 'ADD_PAGE', payload: newPage });
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: 'Ошибка создания страницы' });
      console.error('Error creating page:', error);
    }
  };

  // Обновление страницы
  const updatePage = async (pageId: string, data: Partial<Page>) => {
    try {
      const updatedPage = await MockAPI.updatePage(pageId, data);
      if (updatedPage) {
        dispatch({ type: 'UPDATE_PAGE', payload: updatedPage });
      }
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: 'Ошибка обновления страницы' });
      console.error('Error updating page:', error);
    }
  };

  // Удаление страницы
  const deletePage = async (pageId: string) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      const success = await MockAPI.deletePage(pageId);
      if (success) {
        dispatch({ type: 'DELETE_PAGE', payload: pageId });
      }
      dispatch({ type: 'SET_LOADING', payload: false });
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: 'Ошибка удаления страницы' });
      console.error('Error deleting page:', error);
    }
  };

  // Сохранение контента страницы (для автосохранения)
  const savePageContent = async (pageId: string, content: any[]) => {
    try {
      await updatePage(pageId, { content });
    } catch (error) {
      console.error('Error saving page content:', error);
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
  if (!context) {
    throw new Error('useSite must be used within a SiteProvider');
  }
  return context;
}

export default SiteContext; 