// Database API for Situs Platform using PostgreSQL and Prisma
import { PrismaClient } from '@prisma/client';
// Initialize Prisma Client
const prisma = new PrismaClient();
export class DatabaseAPI {
    // Projects
    static async getProjects(ownerId, filters) {
        try {
            const whereClause = { ownerId };
            // Добавляем поиск
            if (filters?.search) {
                whereClause.OR = [
                    { name: { contains: filters.search, mode: 'insensitive' } },
                    { description: { contains: filters.search, mode: 'insensitive' } }
                ];
            }
            // Добавляем фильтр по статусу
            if (filters?.status) {
                whereClause.status = filters.status.toUpperCase();
            }
            // Определяем сортировку
            let orderBy = { updatedAt: 'desc' };
            if (filters?.sortBy) {
                const sortOrder = filters.sortOrder || 'desc';
                switch (filters.sortBy) {
                    case 'name':
                        orderBy = { name: sortOrder };
                        break;
                    case 'created':
                        orderBy = { createdAt: sortOrder };
                        break;
                    case 'updated':
                        orderBy = { updatedAt: sortOrder };
                        break;
                }
            }
            const projects = await prisma.project.findMany({
                where: whereClause,
                include: {
                    pages: {
                        orderBy: { createdAt: 'desc' }
                    },
                    _count: {
                        select: { pages: true }
                    }
                },
                orderBy
            });
            return projects.map(project => ({
                id: project.id,
                name: project.name,
                description: project.description,
                slug: project.slug,
                type: project.type.toLowerCase(),
                status: project.status,
                domain: project.domain,
                customDomain: project.customDomain,
                isPublished: project.isPublished,
                settings: project.settings,
                createdAt: project.createdAt.toISOString(),
                updatedAt: project.updatedAt.toISOString(),
                pages: project.pages.map(page => ({
                    id: page.id,
                    title: page.title,
                    slug: page.slug,
                    content: page.content,
                    isHomePage: page.isHomePage,
                    isPublished: page.status === 'PUBLISHED',
                    metaTitle: page.metaTitle,
                    metaDescription: page.metaDescription,
                    createdAt: page.createdAt.toISOString(),
                    updatedAt: page.updatedAt.toISOString(),
                    siteId: page.projectId
                })),
                pageCount: project._count.pages
            }));
        }
        catch (error) {
            console.error('Error fetching projects:', error);
            return [];
        }
    }
    static async getProject(projectId) {
        try {
            const project = await prisma.project.findUnique({
                where: { id: projectId },
                include: {
                    pages: {
                        orderBy: { createdAt: 'desc' }
                    },
                    owner: {
                        select: {
                            id: true,
                            username: true,
                            email: true
                        }
                    }
                }
            });
            if (!project)
                return null;
            return {
                id: project.id,
                name: project.name,
                description: project.description,
                type: project.type.toLowerCase(),
                status: project.status.toLowerCase(),
                domain: project.domain,
                createdAt: project.createdAt.toISOString(),
                updatedAt: project.updatedAt.toISOString(),
                pages: project.pages.map(page => ({
                    id: page.id,
                    title: page.title,
                    slug: page.slug,
                    content: page.content,
                    isHomePage: page.isHomePage,
                    isPublished: page.status === 'PUBLISHED',
                    metaTitle: page.metaTitle,
                    metaDescription: page.metaDescription,
                    createdAt: page.createdAt.toISOString(),
                    updatedAt: page.updatedAt.toISOString(),
                    siteId: page.projectId
                })),
                owner: project.owner
            };
        }
        catch (error) {
            console.error('Error fetching project:', error);
            return null;
        }
    }
    static async createProject(data) {
        try {
            // Генерируем slug если не предоставлен
            const slug = data.slug || DatabaseAPI.generateSlug(data.name);
            // Проверяем уникальность slug
            const existingProject = await prisma.project.findUnique({
                where: { slug }
            });
            if (existingProject) {
                throw new Error('Проект с таким названием уже существует');
            }
            // Создаем проект
            const project = await prisma.project.create({
                data: {
                    name: data.name,
                    description: data.description,
                    slug,
                    type: data.type || 'WEBSITE',
                    domain: data.domain,
                    customDomain: data.customDomain,
                    ownerId: data.ownerId,
                    status: 'DRAFT',
                    settings: data.settings || {
                        theme: 'auto',
                        language: 'ru',
                        creationType: 'manual'
                    }
                },
                include: {
                    pages: true
                }
            });
            // Создаем домашнюю страницу автоматически
            await prisma.page.create({
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
            return {
                id: project.id,
                name: project.name,
                description: project.description,
                slug: project.slug,
                type: project.type.toLowerCase(),
                status: project.status,
                domain: project.domain,
                customDomain: project.customDomain,
                isPublished: project.isPublished,
                settings: project.settings,
                createdAt: project.createdAt.toISOString(),
                updatedAt: project.updatedAt.toISOString(),
                pages: []
            };
        }
        catch (error) {
            console.error('Error creating project:', error);
            throw new Error(error instanceof Error ? error.message : 'Failed to create project');
        }
    }
    static async updateProject(projectId, data) {
        try {
            const project = await prisma.project.update({
                where: { id: projectId },
                data: {
                    name: data.name,
                    description: data.description,
                    type: data.type
                },
                include: {
                    pages: true
                }
            });
            return {
                id: project.id,
                name: project.name,
                description: project.description,
                type: project.type.toLowerCase(),
                status: project.status.toLowerCase(),
                domain: project.domain,
                createdAt: project.createdAt.toISOString(),
                updatedAt: project.updatedAt.toISOString(),
                pages: project.pages.map(page => ({
                    id: page.id,
                    title: page.title,
                    slug: page.slug,
                    content: page.content,
                    isHomePage: page.isHomePage,
                    isPublished: page.status === 'PUBLISHED',
                    metaTitle: page.metaTitle,
                    metaDescription: page.metaDescription,
                    createdAt: page.createdAt.toISOString(),
                    updatedAt: page.updatedAt.toISOString(),
                    siteId: page.projectId
                }))
            };
        }
        catch (error) {
            console.error('Error updating project:', error);
            throw new Error('Failed to update project');
        }
    }
    static async deleteProject(projectId) {
        try {
            await prisma.project.delete({
                where: { id: projectId }
            });
            return true;
        }
        catch (error) {
            console.error('Error deleting project:', error);
            return false;
        }
    }
    // Pages
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
                createdAt: page.createdAt.toISOString(),
                updatedAt: page.updatedAt.toISOString(),
                siteId: page.projectId
            };
        }
        catch (error) {
            console.error('Error creating page:', error);
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
                    metaDescription: data.metaDescription
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
                createdAt: page.createdAt.toISOString(),
                updatedAt: page.updatedAt.toISOString(),
                siteId: page.projectId
            };
        }
        catch (error) {
            console.error('Error updating page:', error);
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
            console.error('Error deleting page:', error);
            return false;
        }
    }
    // Users and Authentication
    static async getUser(userId) {
        try {
            const user = await prisma.user.findUnique({
                where: { id: userId },
                include: {
                    balances: {
                        include: {
                            currency: true
                        }
                    }
                }
            });
            if (!user)
                return null;
            return {
                id: user.id,
                username: user.username,
                email: user.email,
                role: user.role,
                status: user.status,
                balances: user.balances.map(balance => ({
                    amount: balance.amount,
                    currency: balance.currency.code,
                    symbol: balance.currency.symbol
                }))
            };
        }
        catch (error) {
            console.error('Error fetching user:', error);
            return null;
        }
    }
    // Новые методы для управления проектами
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
            return true;
        }
        catch (error) {
            console.error('Error publishing project:', error);
            throw new Error('Failed to publish project');
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
            console.error('Error unpublishing project:', error);
            throw new Error('Failed to unpublish project');
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
            console.error('Error updating project status:', error);
            throw new Error('Failed to update project status');
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
            console.error('Error checking slug availability:', error);
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
            console.error('Error checking domain availability:', error);
            return false;
        }
    }
    // Utility methods
    static generateSlug(name) {
        return name
            .toLowerCase()
            .replace(/[^\w\s-]/g, '')
            .replace(/\s+/g, '-')
            .trim();
    }
    static async disconnect() {
        await prisma.$disconnect();
    }
}
export { prisma };
export default DatabaseAPI;
//# sourceMappingURL=database.js.map