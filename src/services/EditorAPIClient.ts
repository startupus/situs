import {
  PageData,
  PageComponent,
  ComponentLibraryItem,
  CreatePageRequest,
  UpdatePageRequest,
  AddComponentRequest,
  UpdateComponentRequest,
  APIResponse,
  PaginatedResponse,
  EditorAPIError,
  ERROR_CODES
} from '../types/editor';

/**
 * API клиент для редактора Редактус
 * Обеспечивает взаимодействие фронт-енда с бэк-ендом
 */
export class EditorAPIClient {
  private baseURL: string;
  private retryAttempts: number;
  private retryDelay: number;

  constructor(
    baseURL: string = 'http://localhost:3000',
    retryAttempts: number = 3,
    retryDelay: number = 1000
  ) {
    this.baseURL = baseURL.replace(/\/$/, ''); // Убираем trailing slash
    this.retryAttempts = retryAttempts;
    this.retryDelay = retryDelay;
  }

  // === UTILITY МЕТОДЫ ===

  /**
   * Выполнить HTTP запрос с retry логикой
   */
  private async request<T = any>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<APIResponse<T>> {
    const url = `${this.baseURL}${endpoint}`;
    
    const defaultOptions: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    for (let attempt = 1; attempt <= this.retryAttempts; attempt++) {
      try {
        const response = await fetch(url, defaultOptions);
        const data: APIResponse<T> = await response.json();

        if (!response.ok) {
          throw new EditorAPIError(
            data.error?.code || ERROR_CODES.INTERNAL_ERROR,
            data.error?.message || 'Unknown error',
            response.status,
            data.error?.details
          );
        }

        return data;
      } catch (error) {
        console.warn(`API request attempt ${attempt} failed:`, error);
        
        if (attempt === this.retryAttempts) {
          throw error;
        }

        // Экспоненциальная задержка для retry
        await this.delay(this.retryDelay * Math.pow(2, attempt - 1));
      }
    }

    throw new EditorAPIError(ERROR_CODES.INTERNAL_ERROR, 'All retry attempts failed');
  }

  /**
   * Задержка для retry логики
   */
  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  // === API ДЛЯ УПРАВЛЕНИЯ СТРАНИЦАМИ ===

  /**
   * Получить список всех страниц
   */
  async getPages(page = 1, limit = 10, search?: string): Promise<PaginatedResponse<PageData>> {
    const queryParams = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
    });

    if (search) {
      queryParams.append('search', search);
    }

    const response = await this.request<PaginatedResponse<PageData>>(
      `/api/pages?${queryParams}`
    );

    return response.data!;
  }

  /**
   * Получить страницу по ID
   */
  async getPageById(id: string): Promise<PageData> {
    const response = await this.request<PageData>(`/api/pages/${id}`);
    return response.data!;
  }

  /**
   * Создать новую страницу
   */
  async createPage(request: CreatePageRequest): Promise<PageData> {
    const response = await this.request<PageData>('/api/pages', {
      method: 'POST',
      body: JSON.stringify(request),
    });

    return response.data!;
  }

  /**
   * Обновить страницу
   */
  async updatePage(id: string, request: UpdatePageRequest): Promise<PageData> {
    const response = await this.request<PageData>(`/api/pages/${id}`, {
      method: 'PUT',
      body: JSON.stringify(request),
    });

    return response.data!;
  }

  /**
   * Удалить страницу
   */
  async deletePage(id: string): Promise<boolean> {
    const response = await this.request<{ deleted: boolean }>(`/api/pages/${id}`, {
      method: 'DELETE',
    });

    return response.data!.deleted;
  }

  // === API ДЛЯ УПРАВЛЕНИЯ КОМПОНЕНТАМИ ===

  /**
   * Получить компоненты страницы
   */
  async getPageComponents(pageId: string): Promise<PageComponent[]> {
    const response = await this.request<PageComponent[]>(`/api/pages/${pageId}/components`);
    return response.data!;
  }

  /**
   * Добавить компонент на страницу
   */
  async addComponentToPage(pageId: string, request: AddComponentRequest): Promise<PageComponent> {
    const response = await this.request<PageComponent>(`/api/pages/${pageId}/components`, {
      method: 'POST',
      body: JSON.stringify(request),
    });

    return response.data!;
  }

  /**
   * Получить компонент со страницы
   */
  async getComponentFromPage(pageId: string, componentId: string): Promise<PageComponent> {
    const response = await this.request<PageComponent>(
      `/api/pages/${pageId}/components/${componentId}`
    );
    return response.data!;
  }

  /**
   * Обновить компонент на странице
   */
  async updateComponent(
    pageId: string,
    componentId: string,
    request: UpdateComponentRequest
  ): Promise<PageComponent> {
    const response = await this.request<PageComponent>(
      `/api/pages/${pageId}/components/${componentId}`,
      {
        method: 'PUT',
        body: JSON.stringify(request),
      }
    );

    return response.data!;
  }

  /**
   * Удалить компонент со страницы
   */
  async deleteComponent(pageId: string, componentId: string): Promise<boolean> {
    const response = await this.request<{ deleted: boolean }>(
      `/api/pages/${pageId}/components/${componentId}`,
      {
        method: 'DELETE',
      }
    );

    return response.data!.deleted;
  }

  // === API ДЛЯ БИБЛИОТЕКИ КОМПОНЕНТОВ ===

  /**
   * Получить библиотеку компонентов
   */
  async getComponentLibrary(category?: string): Promise<ComponentLibraryItem[]> {
    const queryParams = category ? `?category=${encodeURIComponent(category)}` : '';
    const response = await this.request<ComponentLibraryItem[]>(`/api/components${queryParams}`);
    return response.data!;
  }

  /**
   * Получить компонент из библиотеки
   */
  async getComponentFromLibrary(type: string): Promise<ComponentLibraryItem> {
    const response = await this.request<ComponentLibraryItem>(`/api/components/${type}`);
    return response.data!;
  }

  /**
   * Поиск компонентов по тексту
   */
  async searchComponents(searchTerm: string): Promise<ComponentLibraryItem[]> {
    const queryParams = `?search=${encodeURIComponent(searchTerm)}`;
    const response = await this.request<ComponentLibraryItem[]>(`/api/components${queryParams}`);
    return response.data!;
  }

  /**
   * Получить категории компонентов
   */
  async getComponentCategories(): Promise<Array<{ category: string; count: number; components: string[] }>> {
    const response = await this.request<Array<{ category: string; count: number; components: string[] }>>('/api/components/categories');
    return response.data!;
  }

  /**
   * Загрузить адаптированные TailGrids компоненты
   */
  async loadAdaptedComponents(): Promise<{ totalComponents: number; categories: any[]; processingTime: number }> {
    const response = await this.request<{ totalComponents: number; categories: any[]; processingTime: number }>('/api/components/load-adapted', {
      method: 'POST'
    });
    return response.data!;
  }

  // === API ДЛЯ СТАТИСТИКИ ===

  /**
   * Получить статистику
   */
  async getStats(): Promise<{
    totalPages: number;
    totalComponents: number;
    totalLibraryComponents: number;
    pagesByStatus: {
      draft: number;
      published: number;
      archived: number;
    };
  }> {
    const response = await this.request('/api/stats');
    return response.data!;
  }

  // === BATCH ОПЕРАЦИИ ===

  /**
   * Сохранить всю страницу (включая компоненты)
   */
  async savePage(pageData: PageData): Promise<PageData> {
    // Сначала обновляем метаданные страницы
    const updatedPage = await this.updatePage(pageData.id, {
      title: pageData.title,
      slug: pageData.slug,
      status: pageData.status,
      description: pageData.description,
      metadata: pageData.metadata,
      settings: pageData.settings,
    });

    // Затем синхронизируем компоненты
    const currentComponents = await this.getPageComponents(pageData.id);
    
    // Обновляем существующие компоненты
    for (const component of pageData.components) {
      const existingComponent = currentComponents.find(c => c.id === component.id);
      
      if (existingComponent) {
        await this.updateComponent(pageData.id, component.id, {
          content: component.content,
          props: component.props,
          position: component.position,
          order: component.order,
        });
      } else {
        // Добавляем новые компоненты
        await this.addComponentToPage(pageData.id, {
          type: component.type,
          position: component.position,
          props: component.props,
          parentId: component.parentId,
        });
      }
    }

    // Удаляем компоненты, которых больше нет
    for (const currentComponent of currentComponents) {
      const stillExists = pageData.components.some(c => c.id === currentComponent.id);
      if (!stillExists) {
        await this.deleteComponent(pageData.id, currentComponent.id);
      }
    }

    return updatedPage;
  }

  /**
   * Автосохранение с debounce
   */
  private autoSaveTimeouts = new Map<string, NodeJS.Timeout>();

  async autoSave(pageData: PageData, delay = 2000): Promise<void> {
    const existingTimeout = this.autoSaveTimeouts.get(pageData.id);
    if (existingTimeout) {
      clearTimeout(existingTimeout);
    }

    const timeout = setTimeout(async () => {
      try {
        await this.savePage(pageData);
        console.log(`Автосохранение страницы ${pageData.id} выполнено`);
      } catch (error) {
        console.error(`Ошибка автосохранения страницы ${pageData.id}:`, error);
      } finally {
        this.autoSaveTimeouts.delete(pageData.id);
      }
    }, delay);

    this.autoSaveTimeouts.set(pageData.id, timeout);
  }

  /**
   * Отменить автосохранение
   */
  cancelAutoSave(pageId: string): void {
    const timeout = this.autoSaveTimeouts.get(pageId);
    if (timeout) {
      clearTimeout(timeout);
      this.autoSaveTimeouts.delete(pageId);
    }
  }

  // === HEALTH CHECK ===

  /**
   * Проверить доступность API
   */
  async healthCheck(): Promise<boolean> {
    try {
      const response = await fetch(`${this.baseURL}/health`);
      return response.ok;
    } catch {
      return false;
    }
  }
}

// Экспорт singleton instance
export const editorAPI = new EditorAPIClient();