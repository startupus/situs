/**
 * Projects API Service
 * Интеграция с Projects Service бэкенда
 */
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
declare class ProjectsApiService {
    private readonly baseEndpoint;
    /**
     * Получить список проектов пользователя
     */
    getProjects(filters?: ProjectFilters): Promise<ProjectsListResponse>;
    /**
     * Получить отдельный проект
     */
    getProject(projectId: string): Promise<Project>;
    /**
     * Создать новый проект
     */
    createProject(data: CreateProjectData): Promise<Project>;
    /**
     * Обновить проект
     */
    updateProject(projectId: string, data: UpdateProjectData): Promise<Project>;
    /**
     * Удалить проект
     */
    deleteProject(projectId: string): Promise<void>;
    /**
     * Опубликовать проект
     */
    publishProject(projectId: string): Promise<void>;
    /**
     * Снять с публикации проект
     */
    unpublishProject(projectId: string): Promise<void>;
    /**
     * Изменить статус проекта
     */
    updateProjectStatus(projectId: string, status: string): Promise<void>;
    /**
     * Проверить доступность слага
     */
    checkSlugAvailability(slug: string, excludeProjectId?: string): Promise<boolean>;
    /**
     * Проверить доступность домена
     */
    checkDomainAvailability(domain: string, excludeProjectId?: string): Promise<boolean>;
}
export declare const projectsApi: ProjectsApiService;
export default projectsApi;
//# sourceMappingURL=projects.api.d.ts.map