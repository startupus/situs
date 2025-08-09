/**
 * Sites API Service
 * Полноценная интеграция с Projects Service для работы с сайтами
 * Использует Projects API как основу для управления сайтами
 */

import { apiClient, ApiResponse, ApiUtils } from '../client';
import { projectsApi } from './projects.api';
import { Project, ProjectPage, CreateProjectData } from '../../types/project';

// Адаптер типов для совместимости с существующим SiteContext
export interface Site {
  id: string;
  name: string;
  description?: string;
  domain?: string;
  template?: string;
  settings: {
    theme: 'light' | 'dark' | 'auto';
    primaryColor?: string;
    favicon?: string;
    logo?: string;
  };
  pages: Page[];
  createdAt: Date;
  updatedAt: Date;
  owner: string;
  collaborators?: string[];
  isPublic: boolean;
}

export interface Page {
  id: string;
  title: string;
  slug: string;
  content: any;
  meta: {
    description?: string;
    keywords?: string[];
    ogImage?: string;
  };
  status: 'draft' | 'published' | 'archived';
  createdAt: Date;
  updatedAt: Date;
  publishedAt?: Date;
}

export interface SiteFilters {
  search?: string;
  status?: string;
  type?: string;
  sortBy?: 'name' | 'updated' | 'created';
  sortOrder?: 'asc' | 'desc';
  page?: number;
  limit?: number;
}

export interface SitesListResponse {
  sites: Site[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface CreateSiteData {
  name: string;
  description?: string;
  domain?: string;
  template?: string;
  settings?: Partial<Site['settings']>;
}

export interface UpdateSiteData {
  name?: string;
  description?: string;
  domain?: string;
  template?: string;
  settings?: Partial<Site['settings']>;
}

export interface CreatePageData {
  title: string;
  slug?: string;
  content?: any[];
  meta?: {
    description?: string;
    keywords?: string[];
    ogImage?: string;
  };
  status?: 'draft' | 'published' | 'archived';
}

export interface UpdatePageData {
  title?: string;
  slug?: string;
  content?: any[];
  meta?: Partial<Page['meta']>;
  status?: Page['status'];
  publishedAt?: Date;
}

class SitesApiService {
  private readonly baseEndpoint = '/projects';

  /**
   * Получить список сайтов (проектов)
   */
  async getSites(filters?: SiteFilters): Promise<SitesListResponse> {
    try {
      const projectsResponse = await projectsApi.getProjects(filters);
      
      // Преобразуем проекты в сайты
      const sites: Site[] = projectsResponse.projects.map(project => this.projectToSite(project));
      
      return {
        sites,
        pagination: projectsResponse.pagination
      };
    } catch (error) {
      console.error('Sites API Error:', error);
      throw error;
    }
  }

  /**
   * Получить отдельный сайт
   */
  async getSite(siteId: string): Promise<Site> {
    try {
      const project = await projectsApi.getProject(siteId);
      return this.projectToSite(project);
    } catch (error) {
      console.error('Get Site API Error:', error);
      throw error;
    }
  }

  /**
   * Создать новый сайт
   */
  async createSite(data: CreateSiteData): Promise<Site> {
    try {
      const projectData: CreateProjectData = {
        name: data.name,
        description: data.description,
        domain: data.domain,
        template: data.template,
        settings: data.settings || {
          theme: 'auto',
          primaryColor: '#3B82F6',
          favicon: '',
          logo: ''
        }
      };

      const project = await projectsApi.createProject(projectData);
      return this.projectToSite(project);
    } catch (error) {
      console.error('Create Site API Error:', error);
      throw error;
    }
  }

  /**
   * Обновить сайт
   */
  async updateSite(siteId: string, data: UpdateSiteData): Promise<Site> {
    try {
      const projectData = {
        name: data.name,
        description: data.description,
        domain: data.domain,
        template: data.template,
        settings: data.settings
      };

      const project = await projectsApi.updateProject(siteId, projectData);
      return this.projectToSite(project);
    } catch (error) {
      console.error('Update Site API Error:', error);
      throw error;
    }
  }

  /**
   * Удалить сайт
   */
  async deleteSite(siteId: string): Promise<void> {
    try {
      await projectsApi.deleteProject(siteId);
    } catch (error) {
      console.error('Delete Site API Error:', error);
      throw error;
    }
  }

  /**
   * Создать новую страницу
   */
  async createPage(siteId: string, data: CreatePageData): Promise<Page> {
    try {
      // Используем projects API для создания страницы
      const project = await projectsApi.getProject(siteId);
      
      const newPage: ProjectPage = {
        id: `page_${Date.now()}`,
        title: data.title,
        slug: data.slug || this.generateSlug(data.title),
        content: data.content || [],
        meta: data.meta || {
          description: '',
          keywords: [],
          ogImage: ''
        },
        status: data.status || 'draft',
        createdAt: new Date(),
        updatedAt: new Date()
      };

      project.pages.push(newPage);
      
      await projectsApi.updateProject(siteId, {
        pages: project.pages
      });

      return this.projectPageToPage(newPage);
    } catch (error) {
      console.error('Create Page API Error:', error);
      throw error;
    }
  }

  /**
   * Обновить страницу
   */
  async updatePage(pageId: string, data: UpdatePageData): Promise<Page> {
    try {
      // Находим проект, содержащий страницу
      const projects = await projectsApi.getProjects();
      let targetProject: Project | null = null;
      let targetPage: ProjectPage | null = null;

      for (const project of projects.projects) {
        const page = project.pages.find(p => p.id === pageId);
        if (page) {
          targetProject = project;
          targetPage = page;
          break;
        }
      }

      if (!targetProject || !targetPage) {
        throw new Error('Страница не найдена');
      }

      // Обновляем страницу
      Object.assign(targetPage, {
        ...data,
        updatedAt: new Date()
      });

      await projectsApi.updateProject(targetProject.id, {
        pages: targetProject.pages
      });

      return this.projectPageToPage(targetPage);
    } catch (error) {
      console.error('Update Page API Error:', error);
      throw error;
    }
  }

  /**
   * Удалить страницу
   */
  async deletePage(pageId: string): Promise<void> {
    try {
      // Находим проект, содержащий страницу
      const projects = await projectsApi.getProjects();
      let targetProject: Project | null = null;

      for (const project of projects.projects) {
        const pageIndex = project.pages.findIndex(p => p.id === pageId);
        if (pageIndex !== -1) {
          targetProject = project;
          project.pages.splice(pageIndex, 1);
          break;
        }
      }

      if (!targetProject) {
        throw new Error('Страница не найдена');
      }

      await projectsApi.updateProject(targetProject.id, {
        pages: targetProject.pages
      });
    } catch (error) {
      console.error('Delete Page API Error:', error);
      throw error;
    }
  }

  /**
   * Сохранить контент страницы
   */
  async savePageContent(pageId: string, content: any[]): Promise<void> {
    try {
      await this.updatePage(pageId, { content });
    } catch (error) {
      console.error('Save Page Content API Error:', error);
      throw error;
    }
  }

  /**
   * Преобразование Project в Site
   */
  private projectToSite(project: Project): Site {
    // Получаем страницы из первого продукта проекта
    let pages: ProjectPage[] = [];
    if (project.products && project.products.length > 0) {
      const firstProduct = project.products[0];
      // Если у продукта есть страницы, используем их
      if (firstProduct.pages) {
        pages = firstProduct.pages;
      }
    }
    
    // Fallback на старые страницы проекта если есть
    if (pages.length === 0 && project.pages) {
      pages = project.pages;
    }

    return {
      id: project.id,
      name: project.name,
      description: project.description,
      domain: project.domain,
      template: project.template,
      settings: project.settings,
      pages: pages.map(page => this.projectPageToPage(page)),
      createdAt: project.createdAt,
      updatedAt: project.updatedAt,
      owner: project.owner,
      collaborators: project.collaborators,
      isPublic: project.isPublic
    };
  }

  /**
   * Преобразование ProjectPage в Page
   */
  private projectPageToPage(page: ProjectPage): Page {
    return {
      id: page.id,
      title: page.title,
      slug: page.slug,
      content: page.content,
      meta: page.meta,
      status: page.status,
      createdAt: page.createdAt,
      updatedAt: page.updatedAt,
      publishedAt: page.publishedAt
    };
  }

  /**
   * Генерация slug из заголовка
   */
  private generateSlug(title: string): string {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
  }
}

export const sitesApi = new SitesApiService();
export default sitesApi; 