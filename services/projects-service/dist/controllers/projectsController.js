import { Request, Response } from 'express';
import { ProjectsService } from '../services/projectsService.js';
import { projectsLogger } from '../utils/logger.js';
export class ProjectsController {
    static async getProjects(req, res) {
        try {
            if (!req.user) {
                return res.status(401).json({
                    error: 'Unauthorized',
                    message: 'Пользователь не аутентифицирован'
                });
            }
            const filters = {
                search: req.query.search,
                status: req.query.status,
                type: req.query.type,
                sortBy: req.query.sortBy,
                sortOrder: req.query.sortOrder,
                page: parseInt(req.query.page) || 1,
                limit: parseInt(req.query.limit) || 20
            };
            const result = await ProjectsService.getProjects(req.user.id, filters);
            res.json({
                success: true,
                data: result.projects,
                pagination: result.pagination
            });
        }
        catch (error) {
            projectsLogger.error('Error in getProjects controller', {
                userId: req.user?.id,
                query: req.query,
                error
            });
            res.status(500).json({
                error: 'Internal Server Error',
                message: 'Ошибка при получении списка проектов'
            });
        }
    }
    static async getProject(req, res) {
        try {
            if (!req.user) {
                return res.status(401).json({
                    error: 'Unauthorized',
                    message: 'Пользователь не аутентифицирован'
                });
            }
            const projectId = req.params.id;
            const project = await ProjectsService.getProject(projectId, req.user.id);
            if (!project) {
                return res.status(404).json({
                    error: 'Not Found',
                    message: 'Проект не найден'
                });
            }
            res.json({
                success: true,
                data: project
            });
        }
        catch (error) {
            projectsLogger.error('Error in getProject controller', {
                userId: req.user?.id,
                projectId: req.params.id,
                error
            });
            res.status(500).json({
                error: 'Internal Server Error',
                message: 'Ошибка при получении проекта'
            });
        }
    }
    static async createProject(req, res) {
        try {
            if (!req.user) {
                return res.status(401).json({
                    error: 'Unauthorized',
                    message: 'Пользователь не аутентифицирован'
                });
            }
            const projectData = {
                ...req.body,
                ownerId: req.user.id
            };
            const project = await ProjectsService.createProject(projectData);
            res.status(201).json({
                success: true,
                data: project,
                message: 'Проект успешно создан'
            });
        }
        catch (error) {
            projectsLogger.error('Error in createProject controller', {
                userId: req.user?.id,
                data: req.body,
                error
            });
            if (error instanceof Error) {
                if (error.message.includes('уже существует') || error.message.includes('уже занят')) {
                    return res.status(409).json({
                        error: 'Conflict',
                        message: error.message
                    });
                }
            }
            res.status(500).json({
                error: 'Internal Server Error',
                message: 'Ошибка при создании проекта'
            });
        }
    }
    static async updateProject(req, res) {
        try {
            if (!req.user) {
                return res.status(401).json({
                    error: 'Unauthorized',
                    message: 'Пользователь не аутентифицирован'
                });
            }
            const projectId = req.params.id;
            const updateData = req.body;
            const project = await ProjectsService.updateProject(projectId, req.user.id, updateData);
            if (!project) {
                return res.status(404).json({
                    error: 'Not Found',
                    message: 'Проект не найден или нет прав доступа'
                });
            }
            res.json({
                success: true,
                data: project,
                message: 'Проект успешно обновлен'
            });
        }
        catch (error) {
            projectsLogger.error('Error in updateProject controller', {
                userId: req.user?.id,
                projectId: req.params.id,
                data: req.body,
                error
            });
            if (error instanceof Error && error.message.includes('не найден')) {
                return res.status(404).json({
                    error: 'Not Found',
                    message: error.message
                });
            }
            res.status(500).json({
                error: 'Internal Server Error',
                message: 'Ошибка при обновлении проекта'
            });
        }
    }
    static async deleteProject(req, res) {
        try {
            if (!req.user) {
                return res.status(401).json({
                    error: 'Unauthorized',
                    message: 'Пользователь не аутентифицирован'
                });
            }
            const projectId = req.params.id;
            const result = await ProjectsService.deleteProject(projectId, req.user.id);
            if (!result) {
                return res.status(404).json({
                    error: 'Not Found',
                    message: 'Проект не найден или нет прав доступа'
                });
            }
            res.json({
                success: true,
                message: 'Проект успешно удален'
            });
        }
        catch (error) {
            projectsLogger.error('Error in deleteProject controller', {
                userId: req.user?.id,
                projectId: req.params.id,
                error
            });
            if (error instanceof Error && error.message.includes('не найден')) {
                return res.status(404).json({
                    error: 'Not Found',
                    message: error.message
                });
            }
            res.status(500).json({
                error: 'Internal Server Error',
                message: 'Ошибка при удалении проекта'
            });
        }
    }
    static async publishProject(req, res) {
        try {
            if (!req.user) {
                return res.status(401).json({
                    error: 'Unauthorized',
                    message: 'Пользователь не аутентифицирован'
                });
            }
            const projectId = req.params.id;
            const result = await ProjectsService.publishProject(projectId, req.user.id);
            if (!result) {
                return res.status(404).json({
                    error: 'Not Found',
                    message: 'Проект не найден или нет прав доступа'
                });
            }
            res.json({
                success: true,
                message: 'Проект успешно опубликован'
            });
        }
        catch (error) {
            projectsLogger.error('Error in publishProject controller', {
                userId: req.user?.id,
                projectId: req.params.id,
                error
            });
            if (error instanceof Error && error.message.includes('не найден')) {
                return res.status(404).json({
                    error: 'Not Found',
                    message: error.message
                });
            }
            res.status(500).json({
                error: 'Internal Server Error',
                message: 'Ошибка при публикации проекта'
            });
        }
    }
    static async unpublishProject(req, res) {
        try {
            if (!req.user) {
                return res.status(401).json({
                    error: 'Unauthorized',
                    message: 'Пользователь не аутентифицирован'
                });
            }
            const projectId = req.params.id;
            const result = await ProjectsService.unpublishProject(projectId, req.user.id);
            if (!result) {
                return res.status(404).json({
                    error: 'Not Found',
                    message: 'Проект не найден или нет прав доступа'
                });
            }
            res.json({
                success: true,
                message: 'Проект снят с публикации'
            });
        }
        catch (error) {
            projectsLogger.error('Error in unpublishProject controller', {
                userId: req.user?.id,
                projectId: req.params.id,
                error
            });
            if (error instanceof Error && error.message.includes('не найден')) {
                return res.status(404).json({
                    error: 'Not Found',
                    message: error.message
                });
            }
            res.status(500).json({
                error: 'Internal Server Error',
                message: 'Ошибка при снятии с публикации'
            });
        }
    }
    static async updateProjectStatus(req, res) {
        try {
            if (!req.user) {
                return res.status(401).json({
                    error: 'Unauthorized',
                    message: 'Пользователь не аутентифицирован'
                });
            }
            const projectId = req.params.id;
            const { status } = req.body;
            const result = await ProjectsService.updateProjectStatus(projectId, req.user.id, status);
            if (!result) {
                return res.status(404).json({
                    error: 'Not Found',
                    message: 'Проект не найден или нет прав доступа'
                });
            }
            res.json({
                success: true,
                message: 'Статус проекта успешно обновлен'
            });
        }
        catch (error) {
            projectsLogger.error('Error in updateProjectStatus controller', {
                userId: req.user?.id,
                projectId: req.params.id,
                status: req.body.status,
                error
            });
            if (error instanceof Error) {
                if (error.message.includes('не найден')) {
                    return res.status(404).json({
                        error: 'Not Found',
                        message: error.message
                    });
                }
                if (error.message.includes('Недопустимый статус')) {
                    return res.status(400).json({
                        error: 'Bad Request',
                        message: error.message
                    });
                }
            }
            res.status(500).json({
                error: 'Internal Server Error',
                message: 'Ошибка при обновлении статуса проекта'
            });
        }
    }
    static async checkSlugAvailability(req, res) {
        try {
            const slug = req.params.slug;
            const excludeProjectId = req.query.exclude;
            const isAvailable = await ProjectsService.checkSlugAvailability(slug, excludeProjectId);
            res.json({
                success: true,
                data: {
                    slug,
                    available: isAvailable
                }
            });
        }
        catch (error) {
            projectsLogger.error('Error in checkSlugAvailability controller', {
                slug: req.params.slug,
                exclude: req.query.exclude,
                error
            });
            res.status(500).json({
                error: 'Internal Server Error',
                message: 'Ошибка при проверке доступности слага'
            });
        }
    }
    static async checkDomainAvailability(req, res) {
        try {
            const domain = req.params.domain;
            const excludeProjectId = req.query.exclude;
            const isAvailable = await ProjectsService.checkDomainAvailability(domain, excludeProjectId);
            res.json({
                success: true,
                data: {
                    domain,
                    available: isAvailable
                }
            });
        }
        catch (error) {
            projectsLogger.error('Error in checkDomainAvailability controller', {
                domain: req.params.domain,
                exclude: req.query.exclude,
                error
            });
            res.status(500).json({
                error: 'Internal Server Error',
                message: 'Ошибка при проверке доступности домена'
            });
        }
    }
}
export default ProjectsController;
//# sourceMappingURL=projectsController.js.map