import { PrismaClient } from '@prisma/client';
import { config } from '../config/environment.js';
import { projectsLogger } from '../utils/logger.js';
const prisma = new PrismaClient({
    datasources: {
        db: {
            url: config.getDatabaseUrl()
        }
    },
    log: config.isDevelopment() ? ['query', 'info', 'warn', 'error'] : ['warn', 'error']
});
export class ProjectsService {
    static generateSlug(name) {
        return name
            .toLowerCase()
            .replace(/[^\w\s-]/g, '')
            .replace(/\s+/g, '-')
            .replace(/--+/g, '-')
            .trim();
    }
    static generateSitusSubdomain(slug) {
        return `${slug}.${config.getDefaultSitusDomain()}`;
    }
    static async getProjects(ownerId, filters = {}) {
        try {
            const { search, status, type, sortBy = 'updated', sortOrder = 'desc', page = 1, limit = 20 } = filters;
            const whereClause = { ownerId };
            if (search) {
                whereClause.OR = [
                    { name: { contains: search, mode: 'insensitive' } },
                    { description: { contains: search, mode: 'insensitive' } }
                ];
            }
            if (status) {
                whereClause.status = status;
            }
            if (type) {
                whereClause.type = type;
            }
            let orderBy = { updatedAt: sortOrder };
            if (sortBy === 'name') {
                orderBy = { name: sortOrder };
            }
            else if (sortBy === 'created') {
                orderBy = { createdAt: sortOrder };
            }
            const offset = (page - 1) * limit;
            const [projects, totalCount] = await Promise.all([
                prisma.project.findMany({
                    where: whereClause,
                    include: {
                        pages: {
                            orderBy: { createdAt: 'desc' },
                            take: 5
                        },
                        _count: {
                            select: { pages: true }
                        }
                    },
                    orderBy,
                    skip: offset,
                    take: limit
                }),
                prisma.project.count({ where: whereClause })
            ]);
            const formattedProjects = projects.map(project => ({
                id: project.id,
                name: project.name,
                description: project.description,
                slug: project.slug,
                type: project.type,
                status: project.status,
                domain: project.domain,
                customDomain: project.customDomain,
                isPublished: project.isPublished,
                settings: project.settings,
                metaTitle: project.metaTitle,
                metaDescription: project.metaDescription,
                metaKeywords: project.metaKeywords,
                createdAt: project.createdAt.toISOString(),
                updatedAt: project.updatedAt.toISOString(),
                pageCount: project._count.pages,
                pages: project.pages.map(page => ({
                    id: page.id,
                    title: page.title,
                    slug: page.slug,
                    isHomePage: page.isHomePage,
                    isPublished: page.status === 'PUBLISHED',
                    updatedAt: page.updatedAt.toISOString()
                }))
            }));
            return {
                projects: formattedProjects,
                pagination: {
                    page,
                    limit,
                    totalCount,
                    totalPages: Math.ceil(totalCount / limit),
                    hasNext: page * limit < totalCount,
                    hasPrev: page > 1
                }
            };
        }
        catch (error) {
            projectsLogger.error('Error fetching projects', { ownerId, filters, error });
            throw new Error('Failed to fetch projects');
        }
    }
    static async getProject(projectId, ownerId) {
        try {
            const whereClause = { id: projectId };
            if (ownerId) {
                whereClause.ownerId = ownerId;
            }
            const project = await prisma.project.findFirst({
                where: whereClause,
                include: {
                    pages: {
                        orderBy: { createdAt: 'desc' }
                    },
                    owner: {
                        select: {
                            id: true,
                            username: true,
                            email: true,
                            role: true
                        }
                    }
                }
            });
            if (!project) {
                return null;
            }
            return {
                id: project.id,
                name: project.name,
                description: project.description,
                slug: project.slug,
                type: project.type,
                status: project.status,
                domain: project.domain,
                customDomain: project.customDomain,
                isPublished: project.isPublished,
                settings: project.settings,
                metaTitle: project.metaTitle,
                metaDescription: project.metaDescription,
                metaKeywords: project.metaKeywords,
                createdAt: project.createdAt.toISOString(),
                updatedAt: project.updatedAt.toISOString(),
                owner: project.owner,
                pages: project.pages.map(page => ({
                    id: page.id,
                    title: page.title,
                    slug: page.slug,
                    content: page.content,
                    isHomePage: page.isHomePage,
                    isPublished: page.status === 'PUBLISHED',
                    metaTitle: page.metaTitle,
                    metaDescription: page.metaDescription,
                    metaKeywords: page.metaKeywords,
                    createdAt: page.createdAt.toISOString(),
                    updatedAt: page.updatedAt.toISOString()
                }))
            };
        }
        catch (error) {
            projectsLogger.error('Error fetching project', { projectId, ownerId, error });
            throw new Error('Failed to fetch project');
        }
    }
    static async createProject(data) {
        try {
            const slug = data.slug || this.generateSlug(data.name);
            const existingProject = await prisma.project.findUnique({
                where: { slug }
            });
            if (existingProject) {
                throw new Error('Проект с таким названием уже существует');
            }
            let situsUrl = null;
            if (data.domain) {
                situsUrl = this.generateSitusSubdomain(data.domain);
                const domainExists = await this.checkDomainAvailability(situsUrl);
                if (!domainExists) {
                    throw new Error('Домен уже занят');
                }
            }
            if (data.customDomain) {
                const customDomainExists = await this.checkDomainAvailability(data.customDomain);
                if (!customDomainExists) {
                    throw new Error('Кастомный домен уже используется');
                }
            }
            const result = await prisma.$transaction(async (tx) => {
                const project = await tx.project.create({
                    data: {
                        name: data.name,
                        description: data.description,
                        slug,
                        type: data.type || 'WEBSITE',
                        domain: situsUrl,
                        customDomain: data.customDomain,
                        ownerId: data.ownerId,
                        status: 'DRAFT',
                        settings: data.settings || {
                            theme: 'auto',
                            language: 'ru',
                            creationType: 'manual'
                        }
                    }
                });
                await tx.page.create({
                    data: {
                        title: 'Главная',
                        slug: '/',
                        projectId: project.id,
                        isHomePage: true,
                        status: 'DRAFT',
                        content: {
                            blocks: [
                                {
                                    type: 'heading',
                                    data: {
                                        text: `Добро пожаловать на ${data.name}`,
                                        level: 1
                                    }
                                },
                                {
                                    type: 'paragraph',
                                    data: {
                                        text: 'Это ваша новая домашняя страница. Начните редактирование!'
                                    }
                                }
                            ]
                        }
                    }
                });
                return project;
            });
            projectsLogger.projectCreated(result.id, data.ownerId, data.name);
            return {
                id: result.id,
                name: result.name,
                description: result.description,
                slug: result.slug,
                type: result.type,
                status: result.status,
                domain: result.domain,
                customDomain: result.customDomain,
                isPublished: result.isPublished,
                settings: result.settings,
                createdAt: result.createdAt.toISOString(),
                updatedAt: result.updatedAt.toISOString()
            };
        }
        catch (error) {
            projectsLogger.error('Error creating project', { data, error });
            throw error instanceof Error ? error : new Error('Failed to create project');
        }
    }
    static async updateProject(projectId, ownerId, data) {
        try {
            const project = await prisma.project.updateMany({
                where: { id: projectId, ownerId },
                data: {
                    name: data.name,
                    description: data.description,
                    type: data.type,
                    domain: data.domain,
                    customDomain: data.customDomain,
                    settings: data.settings,
                    metaTitle: data.metaTitle,
                    metaDescription: data.metaDescription,
                    metaKeywords: data.metaKeywords
                }
            });
            if (project.count === 0) {
                throw new Error('Проект не найден или нет прав доступа');
            }
            projectsLogger.projectUpdated(projectId, ownerId, data);
            return await this.getProject(projectId, ownerId);
        }
        catch (error) {
            projectsLogger.error('Error updating project', { projectId, ownerId, data, error });
            throw error instanceof Error ? error : new Error('Failed to update project');
        }
    }
    static async deleteProject(projectId, ownerId) {
        try {
            const project = await prisma.project.deleteMany({
                where: { id: projectId, ownerId }
            });
            if (project.count === 0) {
                throw new Error('Проект не найден или нет прав доступа');
            }
            projectsLogger.projectDeleted(projectId, ownerId);
            return true;
        }
        catch (error) {
            projectsLogger.error('Error deleting project', { projectId, ownerId, error });
            throw error instanceof Error ? error : new Error('Failed to delete project');
        }
    }
    static async publishProject(projectId, ownerId) {
        try {
            const project = await prisma.project.updateMany({
                where: { id: projectId, ownerId },
                data: {
                    isPublished: true,
                    status: 'PUBLISHED'
                }
            });
            if (project.count === 0) {
                throw new Error('Проект не найден или нет прав доступа');
            }
            const updatedProject = await this.getProject(projectId, ownerId);
            projectsLogger.projectPublished(projectId, ownerId, updatedProject?.domain);
            return true;
        }
        catch (error) {
            projectsLogger.error('Error publishing project', { projectId, ownerId, error });
            throw error instanceof Error ? error : new Error('Failed to publish project');
        }
    }
    static async unpublishProject(projectId, ownerId) {
        try {
            const project = await prisma.project.updateMany({
                where: { id: projectId, ownerId },
                data: {
                    isPublished: false,
                    status: 'DRAFT'
                }
            });
            if (project.count === 0) {
                throw new Error('Проект не найден или нет прав доступа');
            }
            return true;
        }
        catch (error) {
            projectsLogger.error('Error unpublishing project', { projectId, ownerId, error });
            throw error instanceof Error ? error : new Error('Failed to unpublish project');
        }
    }
    static async updateProjectStatus(projectId, ownerId, status) {
        try {
            const validStatuses = ['DRAFT', 'DEVELOPMENT', 'STAGING', 'PUBLISHED', 'ARCHIVED'];
            if (!validStatuses.includes(status)) {
                throw new Error('Недопустимый статус проекта');
            }
            const project = await prisma.project.updateMany({
                where: { id: projectId, ownerId },
                data: { status: status }
            });
            if (project.count === 0) {
                throw new Error('Проект не найден или нет прав доступа');
            }
            return true;
        }
        catch (error) {
            projectsLogger.error('Error updating project status', { projectId, ownerId, status, error });
            throw error instanceof Error ? error : new Error('Failed to update project status');
        }
    }
    static async checkSlugAvailability(slug, excludeProjectId) {
        try {
            const whereClause = { slug };
            if (excludeProjectId) {
                whereClause.id = { not: excludeProjectId };
            }
            const existingProject = await prisma.project.findFirst({
                where: whereClause
            });
            return !existingProject;
        }
        catch (error) {
            projectsLogger.error('Error checking slug availability', { slug, excludeProjectId, error });
            return false;
        }
    }
    static async checkDomainAvailability(domain, excludeProjectId) {
        try {
            const whereClause = {
                OR: [
                    { domain },
                    { customDomain: domain }
                ]
            };
            if (excludeProjectId) {
                whereClause.id = { not: excludeProjectId };
            }
            const existingProject = await prisma.project.findFirst({
                where: whereClause
            });
            return !existingProject;
        }
        catch (error) {
            projectsLogger.error('Error checking domain availability', { domain, excludeProjectId, error });
            return false;
        }
    }
    static async createPage(data) {
        try {
            const page = await prisma.page.create({
                data: {
                    title: data.title,
                    slug: data.slug,
                    content: data.content || { blocks: [] },
                    projectId: data.projectId,
                    isHomePage: data.isHomePage || false,
                    metaTitle: data.metaTitle,
                    metaDescription: data.metaDescription,
                    metaKeywords: data.metaKeywords,
                    status: 'DRAFT'
                }
            });
            return {
                id: page.id,
                title: page.title,
                slug: page.slug,
                content: page.content,
                isHomePage: page.isHomePage,
                isPublished: page.status === 'PUBLISHED',
                metaTitle: page.metaTitle,
                metaDescription: page.metaDescription,
                metaKeywords: page.metaKeywords,
                createdAt: page.createdAt.toISOString(),
                updatedAt: page.updatedAt.toISOString(),
                projectId: page.projectId
            };
        }
        catch (error) {
            projectsLogger.error('Error creating page', { data, error });
            throw new Error('Failed to create page');
        }
    }
    static async updatePage(pageId, data) {
        try {
            const page = await prisma.page.update({
                where: { id: pageId },
                data: {
                    title: data.title,
                    content: data.content,
                    metaTitle: data.metaTitle,
                    metaDescription: data.metaDescription,
                    metaKeywords: data.metaKeywords
                }
            });
            return {
                id: page.id,
                title: page.title,
                slug: page.slug,
                content: page.content,
                isHomePage: page.isHomePage,
                isPublished: page.status === 'PUBLISHED',
                metaTitle: page.metaTitle,
                metaDescription: page.metaDescription,
                metaKeywords: page.metaKeywords,
                createdAt: page.createdAt.toISOString(),
                updatedAt: page.updatedAt.toISOString(),
                projectId: page.projectId
            };
        }
        catch (error) {
            projectsLogger.error('Error updating page', { pageId, data, error });
            throw new Error('Failed to update page');
        }
    }
    static async deletePage(pageId) {
        try {
            await prisma.page.delete({
                where: { id: pageId }
            });
            return true;
        }
        catch (error) {
            projectsLogger.error('Error deleting page', { pageId, error });
            throw new Error('Failed to delete page');
        }
    }
    static async disconnect() {
        await prisma.$disconnect();
    }
}
export default ProjectsService;
//# sourceMappingURL=projectsService.js.map