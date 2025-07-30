import { jsx as _jsx } from "react/jsx-runtime";
import { createContext, useContext, useReducer, useEffect } from 'react';
import { sitesApi } from '../api/services/sites.api';
// Начальное состояние
const initialState = {
    sites: [],
    currentSite: null,
    currentPage: null,
    loading: false,
    error: null
};
// Reducer для управления состоянием
function siteReducer(state, action) {
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
                sites: state.sites.map(site => site.id === action.payload.id ? action.payload : site),
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
                    sites: state.sites.map(site => site.id === updatedSite.id ? updatedSite : site)
                };
            }
            return state;
        case 'UPDATE_PAGE':
            if (state.currentSite) {
                const updatedPages = state.currentSite.pages.map(page => page.id === action.payload.id ? action.payload : page);
                const updatedSite = {
                    ...state.currentSite,
                    pages: updatedPages
                };
                return {
                    ...state,
                    currentSite: updatedSite,
                    currentPage: state.currentPage?.id === action.payload.id ? action.payload : state.currentPage,
                    sites: state.sites.map(site => site.id === updatedSite.id ? updatedSite : site)
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
                    sites: state.sites.map(site => site.id === updatedSite.id ? updatedSite : site)
                };
            }
            return state;
        default:
            return state;
    }
}
// Создание контекста
const SiteContext = createContext(undefined);
export function SiteProvider({ children }) {
    const [state, dispatch] = useReducer(siteReducer, initialState);
    // Загрузка сайтов
    const loadSites = async () => {
        dispatch({ type: 'SET_LOADING', payload: true });
        try {
            const response = await sitesApi.getSites();
            // Если нет проектов, создаем демо проект
            if (response.sites.length === 0) {
                const demoSite = await sitesApi.createSite({
                    name: 'Стартапус - Демо проект',
                    description: 'Демонстрационный проект экосистемы Стартапус',
                    template: 'website',
                    settings: {
                        theme: 'auto',
                        primaryColor: '#3B82F6',
                        favicon: '/favicon.ico',
                        logo: '/logo.svg'
                    }
                });
                dispatch({ type: 'ADD_SITE', payload: demoSite });
            }
            else {
                dispatch({ type: 'SET_SITES', payload: response.sites });
            }
        }
        catch (error) {
            dispatch({ type: 'SET_ERROR', payload: error instanceof Error ? error.message : 'Ошибка загрузки сайтов' });
        }
    };
    // Выбор сайта
    const selectSite = async (siteId) => {
        try {
            const site = await sitesApi.getSite(siteId);
            dispatch({ type: 'SET_CURRENT_SITE', payload: site });
            // Выбираем первую страницу, если есть
            if (site.pages.length > 0) {
                dispatch({ type: 'SET_CURRENT_PAGE', payload: site.pages[0] });
            }
        }
        catch (error) {
            dispatch({ type: 'SET_ERROR', payload: error instanceof Error ? error.message : 'Ошибка выбора сайта' });
        }
    };
    // Выбор страницы
    const selectPage = (pageId) => {
        if (state.currentSite) {
            const page = state.currentSite.pages.find(p => p.id === pageId);
            if (page) {
                dispatch({ type: 'SET_CURRENT_PAGE', payload: page });
            }
        }
    };
    // Создание сайта
    const createSite = async (data) => {
        try {
            const siteData = {
                name: data.name,
                description: data.description,
                domain: data.domain,
                template: data.template,
                settings: data.settings
            };
            const newSite = await sitesApi.createSite(siteData);
            dispatch({ type: 'ADD_SITE', payload: newSite });
            return newSite;
        }
        catch (error) {
            dispatch({ type: 'SET_ERROR', payload: error instanceof Error ? error.message : 'Ошибка создания сайта' });
            throw error;
        }
    };
    // Создание страницы
    const createPage = async (data) => {
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
        }
        catch (error) {
            dispatch({ type: 'SET_ERROR', payload: error instanceof Error ? error.message : 'Ошибка создания страницы' });
            throw error;
        }
    };
    // Обновление страницы
    const updatePage = async (pageId, data) => {
        try {
            const updatedPage = await sitesApi.updatePage(pageId, data);
            dispatch({ type: 'UPDATE_PAGE', payload: updatedPage });
        }
        catch (error) {
            dispatch({ type: 'SET_ERROR', payload: error instanceof Error ? error.message : 'Ошибка обновления страницы' });
        }
    };
    // Удаление страницы
    const deletePage = async (pageId) => {
        try {
            await sitesApi.deletePage(pageId);
            dispatch({ type: 'DELETE_PAGE', payload: pageId });
        }
        catch (error) {
            dispatch({ type: 'SET_ERROR', payload: error instanceof Error ? error.message : 'Ошибка удаления страницы' });
        }
    };
    // Сохранение контента страницы
    const savePageContent = async (pageId, content) => {
        try {
            await sitesApi.savePageContent(pageId, content);
            // Обновляем локальное состояние
            if (state.currentPage && state.currentPage.id === pageId) {
                const updatedPage = { ...state.currentPage, content };
                dispatch({ type: 'UPDATE_PAGE', payload: updatedPage });
            }
        }
        catch (error) {
            dispatch({ type: 'SET_ERROR', payload: error instanceof Error ? error.message : 'Ошибка сохранения контента' });
        }
    };
    // Загружаем сайты при монтировании
    useEffect(() => {
        loadSites();
    }, []);
    const contextValue = {
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
    return (_jsx(SiteContext.Provider, { value: contextValue, children: children }));
}
// Хук для использования контекста
export function useSite() {
    const context = useContext(SiteContext);
    if (context === undefined) {
        throw new Error('useSite must be used within a SiteProvider');
    }
    return context;
}
//# sourceMappingURL=SiteContext.js.map