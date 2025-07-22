import { useState, useEffect, useCallback } from 'react';
import { 
  PageData, 
  PageComponent, 
  ComponentLibraryItem,
  CreatePageRequest,
  UpdatePageRequest,
  AddComponentRequest,
  UpdateComponentRequest,
  EditorAPIError 
} from '../types/editor';
import { editorAPI } from '../services/EditorAPIClient';

/**
 * React хук для работы с Editor API
 * Обеспечивает интеграцию редактора с бэк-ендом
 */
export const useEditorAPI = () => {
  // Состояние для страниц
  const [pages, setPages] = useState<PageData[]>([]);
  const [currentPage, setCurrentPage] = useState<PageData | null>(null);
  const [componentsLibrary, setComponentsLibrary] = useState<ComponentLibraryItem[]>([]);
  
  // Состояние загрузки и ошибок
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  // Состояние подключения к API
  const [isConnected, setIsConnected] = useState(false);

  /**
   * Проверить подключение к API
   */
  const checkConnection = useCallback(async () => {
    try {
      const connected = await editorAPI.healthCheck();
      setIsConnected(connected);
      return connected;
    } catch (err) {
      setIsConnected(false);
      return false;
    }
  }, []);

  /**
   * Загрузить список страниц
   */
  const loadPages = useCallback(async (page = 1, limit = 10, search?: string) => {
    try {
      setLoading(true);
      setError(null);
      
      const result = await editorAPI.getPages(page, limit, search);
      setPages(result.items);
      return result;
    } catch (err) {
      const errorMessage = err instanceof EditorAPIError ? err.message : 'Ошибка загрузки страниц';
      setError(errorMessage);
      console.error('Failed to load pages:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Загрузить страницу по ID
   */
  const loadPage = useCallback(async (pageId: string) => {
    try {
      setLoading(true);
      setError(null);
      
      const page = await editorAPI.getPageById(pageId);
      setCurrentPage(page);
      return page;
    } catch (err) {
      const errorMessage = err instanceof EditorAPIError ? err.message : 'Ошибка загрузки страницы';
      setError(errorMessage);
      console.error('Failed to load page:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Создать новую страницу
   */
  const createPage = useCallback(async (request: CreatePageRequest) => {
    try {
      setSaving(true);
      setError(null);
      
      const newPage = await editorAPI.createPage(request);
      setPages(prev => [newPage, ...prev]);
      setCurrentPage(newPage);
      return newPage;
    } catch (err) {
      const errorMessage = err instanceof EditorAPIError ? err.message : 'Ошибка создания страницы';
      setError(errorMessage);
      console.error('Failed to create page:', err);
      throw err;
    } finally {
      setSaving(false);
    }
  }, []);

  /**
   * Обновить страницу
   */
  const updatePage = useCallback(async (pageId: string, request: UpdatePageRequest) => {
    try {
      setSaving(true);
      setError(null);
      
      const updatedPage = await editorAPI.updatePage(pageId, request);
      
      // Обновляем в списке страниц
      setPages(prev => prev.map(page => 
        page.id === pageId ? updatedPage : page
      ));
      
      // Обновляем текущую страницу если это она
      if (currentPage?.id === pageId) {
        setCurrentPage(updatedPage);
      }
      
      return updatedPage;
    } catch (err) {
      const errorMessage = err instanceof EditorAPIError ? err.message : 'Ошибка обновления страницы';
      setError(errorMessage);
      console.error('Failed to update page:', err);
      throw err;
    } finally {
      setSaving(false);
    }
  }, [currentPage]);

  /**
   * Удалить страницу
   */
  const deletePage = useCallback(async (pageId: string) => {
    try {
      setSaving(true);
      setError(null);
      
      await editorAPI.deletePage(pageId);
      
      // Удаляем из списка
      setPages(prev => prev.filter(page => page.id !== pageId));
      
      // Сбрасываем текущую страницу если это она
      if (currentPage?.id === pageId) {
        setCurrentPage(null);
      }
      
      return true;
    } catch (err) {
      const errorMessage = err instanceof EditorAPIError ? err.message : 'Ошибка удаления страницы';
      setError(errorMessage);
      console.error('Failed to delete page:', err);
      throw err;
    } finally {
      setSaving(false);
    }
  }, [currentPage]);

  /**
   * Загрузить библиотеку компонентов
   */
  const loadComponentsLibrary = useCallback(async (category?: string) => {
    try {
      setLoading(true);
      setError(null);
      
      const components = await editorAPI.getComponentLibrary(category);
      setComponentsLibrary(components);
      return components;
    } catch (err) {
      const errorMessage = err instanceof EditorAPIError ? err.message : 'Ошибка загрузки библиотеки компонентов';
      setError(errorMessage);
      console.error('Failed to load components library:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Поиск компонентов
   */
  const searchComponents = useCallback(async (searchTerm: string) => {
    try {
      setLoading(true);
      setError(null);
      
      const components = await editorAPI.searchComponents(searchTerm);
      setComponentsLibrary(components);
      return components;
    } catch (err) {
      const errorMessage = err instanceof EditorAPIError ? err.message : 'Ошибка поиска компонентов';
      setError(errorMessage);
      console.error('Failed to search components:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Получить категории компонентов
   */
  const getComponentCategories = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const categories = await editorAPI.getComponentCategories();
      return categories;
    } catch (err) {
      const errorMessage = err instanceof EditorAPIError ? err.message : 'Ошибка загрузки категорий';
      setError(errorMessage);
      console.error('Failed to load component categories:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Загрузить адаптированные компоненты из TailGrids
   */
  const loadAdaptedComponents = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const result = await editorAPI.loadAdaptedComponents();
      
      // Перезагружаем библиотеку компонентов
      const updatedComponents = await editorAPI.getComponentLibrary();
      setComponentsLibrary(updatedComponents);
      
      return result;
    } catch (err) {
      const errorMessage = err instanceof EditorAPIError ? err.message : 'Ошибка загрузки адаптированных компонентов';
      setError(errorMessage);
      console.error('Failed to load adapted components:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Добавить компонент на страницу
   */
  const addComponent = useCallback(async (pageId: string, request: AddComponentRequest) => {
    try {
      setSaving(true);
      setError(null);
      
      const newComponent = await editorAPI.addComponentToPage(pageId, request);
      
      // Обновляем страницу с новым компонентом
      if (currentPage?.id === pageId) {
        setCurrentPage(prev => prev ? {
          ...prev,
          components: [...prev.components, newComponent],
          updatedAt: new Date().toISOString()
        } : null);
      }
      
      return newComponent;
    } catch (err) {
      const errorMessage = err instanceof EditorAPIError ? err.message : 'Ошибка добавления компонента';
      setError(errorMessage);
      console.error('Failed to add component:', err);
      throw err;
    } finally {
      setSaving(false);
    }
  }, [currentPage]);

  /**
   * Обновить компонент на странице
   */
  const updateComponent = useCallback(async (
    pageId: string, 
    componentId: string, 
    request: UpdateComponentRequest
  ) => {
    try {
      setSaving(true);
      setError(null);
      
      const updatedComponent = await editorAPI.updateComponent(pageId, componentId, request);
      
      // Обновляем компонент в текущей странице
      if (currentPage?.id === pageId) {
        setCurrentPage(prev => prev ? {
          ...prev,
          components: prev.components.map(comp => 
            comp.id === componentId ? updatedComponent : comp
          ),
          updatedAt: new Date().toISOString()
        } : null);
      }
      
      return updatedComponent;
    } catch (err) {
      const errorMessage = err instanceof EditorAPIError ? err.message : 'Ошибка обновления компонента';
      setError(errorMessage);
      console.error('Failed to update component:', err);
      throw err;
    } finally {
      setSaving(false);
    }
  }, [currentPage]);

  /**
   * Удалить компонент со страницы
   */
  const deleteComponent = useCallback(async (pageId: string, componentId: string) => {
    try {
      setSaving(true);
      setError(null);
      
      await editorAPI.deleteComponent(pageId, componentId);
      
      // Удаляем компонент из текущей страницы
      if (currentPage?.id === pageId) {
        setCurrentPage(prev => prev ? {
          ...prev,
          components: prev.components.filter(comp => comp.id !== componentId),
          updatedAt: new Date().toISOString()
        } : null);
      }
      
      return true;
    } catch (err) {
      const errorMessage = err instanceof EditorAPIError ? err.message : 'Ошибка удаления компонента';
      setError(errorMessage);
      console.error('Failed to delete component:', err);
      throw err;
    } finally {
      setSaving(false);
    }
  }, [currentPage]);

  /**
   * Автосохранение страницы
   */
  const autoSave = useCallback(async (pageData: PageData, delay = 2000) => {
    try {
      await editorAPI.autoSave(pageData, delay);
    } catch (err) {
      console.error('Auto-save failed:', err);
    }
  }, []);

  /**
   * Отменить автосохранение
   */
  const cancelAutoSave = useCallback((pageId: string) => {
    editorAPI.cancelAutoSave(pageId);
  }, []);

  /**
   * Сохранить всю страницу
   */
  const savePage = useCallback(async (pageData: PageData) => {
    try {
      setSaving(true);
      setError(null);
      
      const savedPage = await editorAPI.savePage(pageData);
      setCurrentPage(savedPage);
      
      // Обновляем в списке страниц
      setPages(prev => prev.map(page => 
        page.id === savedPage.id ? savedPage : page
      ));
      
      return savedPage;
    } catch (err) {
      const errorMessage = err instanceof EditorAPIError ? err.message : 'Ошибка сохранения страницы';
      setError(errorMessage);
      console.error('Failed to save page:', err);
      throw err;
    } finally {
      setSaving(false);
    }
  }, []);

  /**
   * Очистить ошибку
   */
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  // Проверяем подключение при монтировании
  useEffect(() => {
    checkConnection();
  }, [checkConnection]);

  // Загружаем библиотеку компонентов при монтировании
  useEffect(() => {
    if (isConnected) {
      loadComponentsLibrary();
    }
  }, [isConnected, loadComponentsLibrary]);

  return {
    // Данные
    pages,
    currentPage,
    componentsLibrary,
    
    // Состояние
    loading,
    saving,
    error,
    isConnected,
    
    // Методы работы со страницами
    loadPages,
    loadPage,
    createPage,
    updatePage,
    deletePage,
    savePage,
    
    // Методы работы с компонентами
    loadComponentsLibrary,
    searchComponents,
    getComponentCategories,
    loadAdaptedComponents,
    addComponent,
    updateComponent,
    deleteComponent,
    
    // Автосохранение
    autoSave,
    cancelAutoSave,
    
    // Утилиты
    checkConnection,
    clearError,
    
    // Прямой доступ к API клиенту для продвинутого использования
    api: editorAPI
  };
};