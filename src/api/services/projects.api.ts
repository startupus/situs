/**
 * Projects API Service
 * Интеграция с Projects Service бэкенда
 */

import { apiClient, ApiResponse, ApiUtils } from '../client';
import { Project, CreateProjectData, UpdateProjectData } from '../../types/project';

export interface ProjectFilters {
  search?: string;
  status?: string;
  type?: string;
  sortBy?: 'name' | 'updated' | 'created';
  sortOrder?: 'asc' | 'desc';
  page?: number;
  limit?: number;
}

export interface ProjectsListResponse {
  projects: Project[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

class ProjectsApiService {
  private readonly baseEndpoint = '/api/projects';

  /**
   * Получить список проектов пользователя
   */
  async getProjects(filters?: ProjectFilters): Promise<ProjectsListResponse> {
    try {
      const response = await apiClient.get<ApiResponse<ProjectsListResponse>>(
        this.baseEndpoint,
        filters
      );

      if (ApiUtils.isSuccess(response)) {
        return response.data;
      }

      throw new Error(response.error || 'Ошибка при загрузке проектов');
    } catch (error) {
      console.error('Projects API Error:', error);
      throw new Error(ApiUtils.handleError(error));
    }
  }

  /**
   * Получить отдельный проект
   */
  async getProject(projectId: string): Promise<Project> {
    try {
      const response = await apiClient.get<ApiResponse<Project>>(
        `${this.baseEndpoint}/${projectId}`
      );

      if (ApiUtils.isSuccess(response)) {
        return response.data;
      }

      throw new Error(response.error || 'Проект не найден');
    } catch (error) {
      console.error('Get Project API Error:', error);
      throw new Error(ApiUtils.handleError(error));
    }
  }

  /**
   * Создать новый проект
   */
  async createProject(data: CreateProjectData): Promise<Project> {
    try {
      const response = await apiClient.post<ApiResponse<Project>>(
        this.baseEndpoint,
        data
      );

      if (ApiUtils.isSuccess(response)) {
        return response.data;
      }

      throw new Error(response.error || 'Ошибка при создании проекта');
    } catch (error) {
      console.error('Create Project API Error:', error);
      throw new Error(ApiUtils.handleError(error));
    }
  }

  /**
   * Обновить проект
   */
  async updateProject(projectId: string, data: UpdateProjectData): Promise<Project> {
    try {
      const response = await apiClient.put<ApiResponse<Project>>(
        `${this.baseEndpoint}/${projectId}`,
        data
      );

      if (ApiUtils.isSuccess(response)) {
        return response.data;
      }

      throw new Error(response.error || 'Ошибка при обновлении проекта');
    } catch (error) {
      console.error('Update Project API Error:', error);
      throw new Error(ApiUtils.handleError(error));
    }
  }

  /**
   * Удалить проект
   */
  async deleteProject(projectId: string): Promise<void> {
    try {
      const response = await apiClient.delete<ApiResponse<void>>(
        `${this.baseEndpoint}/${projectId}`
      );

      if (!ApiUtils.isSuccess(response)) {
        throw new Error(response.error || 'Ошибка при удалении проекта');
      }
    } catch (error) {
      console.error('Delete Project API Error:', error);
      throw new Error(ApiUtils.handleError(error));
    }
  }

  /**
   * Опубликовать проект
   */
  async publishProject(projectId: string): Promise<void> {
    try {
      const response = await apiClient.patch<ApiResponse<void>>(
        `${this.baseEndpoint}/${projectId}/publish`
      );

      if (!ApiUtils.isSuccess(response)) {
        throw new Error(response.error || 'Ошибка при публикации проекта');
      }
    } catch (error) {
      console.error('Publish Project API Error:', error);
      throw new Error(ApiUtils.handleError(error));
    }
  }

  /**
   * Снять с публикации проект
   */
  async unpublishProject(projectId: string): Promise<void> {
    try {
      const response = await apiClient.patch<ApiResponse<void>>(
        `${this.baseEndpoint}/${projectId}/unpublish`
      );

      if (!ApiUtils.isSuccess(response)) {
        throw new Error(response.error || 'Ошибка при снятии с публикации');
      }
    } catch (error) {
      console.error('Unpublish Project API Error:', error);
      throw new Error(ApiUtils.handleError(error));
    }
  }

  /**
   * Изменить статус проекта
   */
  async updateProjectStatus(projectId: string, status: string): Promise<void> {
    try {
      const response = await apiClient.patch<ApiResponse<void>>(
        `${this.baseEndpoint}/${projectId}/status`,
        { status }
      );

      if (!ApiUtils.isSuccess(response)) {
        throw new Error(response.error || 'Ошибка при обновлении статуса');
      }
    } catch (error) {
      console.error('Update Project Status API Error:', error);
      throw new Error(ApiUtils.handleError(error));
    }
  }

  /**
   * Проверить доступность слага
   */
  async checkSlugAvailability(slug: string, excludeProjectId?: string): Promise<boolean> {
    try {
      const params = excludeProjectId ? { exclude: excludeProjectId } : undefined;
      const response = await apiClient.get<ApiResponse<{ slug: string; available: boolean }>>(
        `${this.baseEndpoint}/check-slug/${slug}`,
        params
      );

      if (ApiUtils.isSuccess(response)) {
        return response.data.available;
      }

      return false;
    } catch (error) {
      console.error('Check Slug Availability API Error:', error);
      return false;
    }
  }

  /**
   * Проверить доступность домена
   */
  async checkDomainAvailability(domain: string, excludeProjectId?: string): Promise<boolean> {
    try {
      const params = excludeProjectId ? { exclude: excludeProjectId } : undefined;
      const response = await apiClient.get<ApiResponse<{ domain: string; available: boolean }>>(
        `${this.baseEndpoint}/check-domain/${domain}`,
        params
      );

      if (ApiUtils.isSuccess(response)) {
        return response.data.available;
      }

      return false;
    } catch (error) {
      console.error('Check Domain Availability API Error:', error);
      return false;
    }
  }
}

export const projectsApi = new ProjectsApiService();
export default projectsApi;