/**
 * Projects API Service
 * Интеграция с Projects Service бэкенда
 */
import { apiClient, ApiUtils } from '../client';
class ProjectsApiService {
    baseEndpoint = '/api/projects';
    /**
     * Получить список проектов пользователя
     */
    async getProjects(filters) {
        try {
            const response = await apiClient.get(this.baseEndpoint, filters);
            if (ApiUtils.isSuccess(response)) {
                return response.data;
            }
            throw new Error(response.error || 'Ошибка при загрузке проектов');
        }
        catch (error) {
            console.error('Projects API Error:', error);
            throw new Error(ApiUtils.handleError(error));
        }
    }
    /**
     * Получить отдельный проект
     */
    async getProject(projectId) {
        try {
            const response = await apiClient.get(`${this.baseEndpoint}/${projectId}`);
            if (ApiUtils.isSuccess(response)) {
                return response.data;
            }
            throw new Error(response.error || 'Проект не найден');
        }
        catch (error) {
            console.error('Get Project API Error:', error);
            throw new Error(ApiUtils.handleError(error));
        }
    }
    /**
     * Создать новый проект
     */
    async createProject(data) {
        try {
            const response = await apiClient.post(this.baseEndpoint, data);
            if (ApiUtils.isSuccess(response)) {
                return response.data;
            }
            throw new Error(response.error || 'Ошибка при создании проекта');
        }
        catch (error) {
            console.error('Create Project API Error:', error);
            throw new Error(ApiUtils.handleError(error));
        }
    }
    /**
     * Обновить проект
     */
    async updateProject(projectId, data) {
        try {
            const response = await apiClient.put(`${this.baseEndpoint}/${projectId}`, data);
            if (ApiUtils.isSuccess(response)) {
                return response.data;
            }
            throw new Error(response.error || 'Ошибка при обновлении проекта');
        }
        catch (error) {
            console.error('Update Project API Error:', error);
            throw new Error(ApiUtils.handleError(error));
        }
    }
    /**
     * Удалить проект
     */
    async deleteProject(projectId) {
        try {
            const response = await apiClient.delete(`${this.baseEndpoint}/${projectId}`);
            if (!ApiUtils.isSuccess(response)) {
                throw new Error(response.error || 'Ошибка при удалении проекта');
            }
        }
        catch (error) {
            console.error('Delete Project API Error:', error);
            throw new Error(ApiUtils.handleError(error));
        }
    }
    /**
     * Опубликовать проект
     */
    async publishProject(projectId) {
        try {
            const response = await apiClient.patch(`${this.baseEndpoint}/${projectId}/publish`);
            if (!ApiUtils.isSuccess(response)) {
                throw new Error(response.error || 'Ошибка при публикации проекта');
            }
        }
        catch (error) {
            console.error('Publish Project API Error:', error);
            throw new Error(ApiUtils.handleError(error));
        }
    }
    /**
     * Снять с публикации проект
     */
    async unpublishProject(projectId) {
        try {
            const response = await apiClient.patch(`${this.baseEndpoint}/${projectId}/unpublish`);
            if (!ApiUtils.isSuccess(response)) {
                throw new Error(response.error || 'Ошибка при снятии с публикации');
            }
        }
        catch (error) {
            console.error('Unpublish Project API Error:', error);
            throw new Error(ApiUtils.handleError(error));
        }
    }
    /**
     * Изменить статус проекта
     */
    async updateProjectStatus(projectId, status) {
        try {
            const response = await apiClient.patch(`${this.baseEndpoint}/${projectId}/status`, { status });
            if (!ApiUtils.isSuccess(response)) {
                throw new Error(response.error || 'Ошибка при обновлении статуса');
            }
        }
        catch (error) {
            console.error('Update Project Status API Error:', error);
            throw new Error(ApiUtils.handleError(error));
        }
    }
    /**
     * Проверить доступность слага
     */
    async checkSlugAvailability(slug, excludeProjectId) {
        try {
            const params = excludeProjectId ? { exclude: excludeProjectId } : undefined;
            const response = await apiClient.get(`${this.baseEndpoint}/check-slug/${slug}`, params);
            if (ApiUtils.isSuccess(response)) {
                return response.data.available;
            }
            return false;
        }
        catch (error) {
            console.error('Check Slug Availability API Error:', error);
            return false;
        }
    }
    /**
     * Проверить доступность домена
     */
    async checkDomainAvailability(domain, excludeProjectId) {
        try {
            const params = excludeProjectId ? { exclude: excludeProjectId } : undefined;
            const response = await apiClient.get(`${this.baseEndpoint}/check-domain/${domain}`, params);
            if (ApiUtils.isSuccess(response)) {
                return response.data.available;
            }
            return false;
        }
        catch (error) {
            console.error('Check Domain Availability API Error:', error);
            return false;
        }
    }
}
export const projectsApi = new ProjectsApiService();
export default projectsApi;
//# sourceMappingURL=projects.api.js.map