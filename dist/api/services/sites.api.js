/**
 * Sites API Service
 * Полноценная интеграция с Projects Service для работы с сайтами
 * Использует Projects API как основу для управления сайтами
 */
import { projectsApi } from './projects.api';
class SitesApiService {
    baseEndpoint = '/api/projects';
    /**
     * Получить список сайтов (проектов)
     */
    async getSites(filters) {
        try {
            const projectsResponse = await projectsApi.getProjects(filters);
            // Преобразуем проекты в сайты
            const sites = projectsResponse.projects.map(project => this.projectToSite(project));
            return {
                sites,
                pagination: projectsResponse.pagination
            };
        }
        catch (error) {
            console.error('Sites API Error:', error);
            throw error;
        }
    }
    /**
     * Получить отдельный сайт
     */
    async getSite(siteId) {
        try {
            const project = await projectsApi.getProject(siteId);
            return this.projectToSite(project);
        }
        catch (error) {
            console.error('Get Site API Error:', error);
            throw error;
        }
    }
    /**
     * Создать новый сайт
     */
    async createSite(data) {
        try {
            const projectData = {
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
        }
        catch (error) {
            console.error('Create Site API Error:', error);
            throw error;
        }
    }
    /**
     * Обновить сайт
     */
    async updateSite(siteId, data) {
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
        }
        catch (error) {
            console.error('Update Site API Error:', error);
            throw error;
        }
    }
    /**
     * Удалить сайт
     */
    async deleteSite(siteId) {
        try {
            await projectsApi.deleteProject(siteId);
        }
        catch (error) {
            console.error('Delete Site API Error:', error);
            throw error;
        }
    }
    /**
     * Создать новую страницу
     */
    async createPage(siteId, data) {
        try {
            // Используем projects API для создания страницы
            const project = await projectsApi.getProject(siteId);
            const newPage = {
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
        }
        catch (error) {
            console.error('Create Page API Error:', error);
            throw error;
        }
    }
    /**
     * Обновить страницу
     */
    async updatePage(pageId, data) {
        try {
            // Находим проект, содержащий страницу
            const projects = await projectsApi.getProjects();
            let targetProject = null;
            let targetPage = null;
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
        }
        catch (error) {
            console.error('Update Page API Error:', error);
            throw error;
        }
    }
    /**
     * Удалить страницу
     */
    async deletePage(pageId) {
        try {
            // Находим проект, содержащий страницу
            const projects = await projectsApi.getProjects();
            let targetProject = null;
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
        }
        catch (error) {
            console.error('Delete Page API Error:', error);
            throw error;
        }
    }
    /**
     * Сохранить контент страницы
     */
    async savePageContent(pageId, content) {
        try {
            await this.updatePage(pageId, { content });
        }
        catch (error) {
            console.error('Save Page Content API Error:', error);
            throw error;
        }
    }
    /**
     * Преобразование Project в Site
     */
    projectToSite(project) {
        return {
            id: project.id,
            name: project.name,
            description: project.description,
            domain: project.domain,
            template: project.template,
            settings: project.settings,
            pages: project.pages.map(page => this.projectPageToPage(page)),
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
    projectPageToPage(page) {
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
    generateSlug(title) {
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
//# sourceMappingURL=sites.api.js.map