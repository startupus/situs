import { PrismaClient } from '@prisma/client';
declare const prisma: PrismaClient<import(".prisma/client").Prisma.PrismaClientOptions, never, import("@prisma/client/runtime/library").DefaultArgs>;
export interface CreateProjectData {
    name: string;
    description?: string;
    slug?: string;
    type?: 'WEBSITE' | 'ECOMMERCE' | 'LANDING' | 'BLOG' | 'APP';
    domain?: string;
    customDomain?: string;
    settings?: {
        theme?: 'light' | 'dark' | 'auto';
        language?: 'ru' | 'en';
        creationType?: 'manual' | 'ai';
    };
    ownerId: string;
}
export interface CreatePageData {
    title: string;
    slug: string;
    content?: any;
    projectId: string;
    isHomePage?: boolean;
    metaTitle?: string;
    metaDescription?: string;
}
export declare class DatabaseAPI {
    static getProjects(ownerId: string, filters?: {
        search?: string;
        status?: string;
        sortBy?: 'name' | 'updated' | 'created';
        sortOrder?: 'asc' | 'desc';
    }): Promise<{
        id: string;
        name: string;
        description: string | null;
        slug: string;
        type: string;
        status: import(".prisma/client").$Enums.ProjectStatus;
        domain: string | null;
        customDomain: string | null;
        isPublished: boolean;
        settings: import("@prisma/client/runtime/library").JsonValue;
        createdAt: string;
        updatedAt: string;
        pages: {
            id: string;
            title: string;
            slug: string;
            content: import("@prisma/client/runtime/library").JsonValue;
            isHomePage: boolean;
            isPublished: boolean;
            metaTitle: string | null;
            metaDescription: string | null;
            createdAt: string;
            updatedAt: string;
            siteId: string;
        }[];
        pageCount: number;
    }[]>;
    static getProject(projectId: string): Promise<{
        id: string;
        name: string;
        description: string | null;
        type: string;
        status: string;
        domain: string | null;
        createdAt: string;
        updatedAt: string;
        pages: {
            id: string;
            title: string;
            slug: string;
            content: import("@prisma/client/runtime/library").JsonValue;
            isHomePage: boolean;
            isPublished: boolean;
            metaTitle: string | null;
            metaDescription: string | null;
            createdAt: string;
            updatedAt: string;
            siteId: string;
        }[];
        owner: {
            id: string;
            username: string;
            email: string;
        };
    } | null>;
    static createProject(data: CreateProjectData): Promise<{
        id: string;
        name: string;
        description: string | null;
        slug: string;
        type: string;
        status: import(".prisma/client").$Enums.ProjectStatus;
        domain: string | null;
        customDomain: string | null;
        isPublished: boolean;
        settings: import("@prisma/client/runtime/library").JsonValue;
        createdAt: string;
        updatedAt: string;
        pages: never[];
    }>;
    static updateProject(projectId: string, data: Partial<CreateProjectData>): Promise<{
        id: string;
        name: string;
        description: string | null;
        type: string;
        status: string;
        domain: string | null;
        createdAt: string;
        updatedAt: string;
        pages: {
            id: string;
            title: string;
            slug: string;
            content: import("@prisma/client/runtime/library").JsonValue;
            isHomePage: boolean;
            isPublished: boolean;
            metaTitle: string | null;
            metaDescription: string | null;
            createdAt: string;
            updatedAt: string;
            siteId: string;
        }[];
    }>;
    static deleteProject(projectId: string): Promise<boolean>;
    static createPage(data: CreatePageData): Promise<{
        id: string;
        title: string;
        slug: string;
        content: import("@prisma/client/runtime/library").JsonValue;
        isHomePage: boolean;
        isPublished: boolean;
        metaTitle: string | null;
        metaDescription: string | null;
        createdAt: string;
        updatedAt: string;
        siteId: string;
    }>;
    static updatePage(pageId: string, data: Partial<CreatePageData>): Promise<{
        id: string;
        title: string;
        slug: string;
        content: import("@prisma/client/runtime/library").JsonValue;
        isHomePage: boolean;
        isPublished: boolean;
        metaTitle: string | null;
        metaDescription: string | null;
        createdAt: string;
        updatedAt: string;
        siteId: string;
    }>;
    static deletePage(pageId: string): Promise<boolean>;
    static getUser(userId: string): Promise<{
        id: string;
        username: string;
        email: string;
        role: import(".prisma/client").$Enums.Role;
        status: import(".prisma/client").$Enums.UserStatus;
        balances: {
            amount: number;
            currency: string;
            symbol: string;
        }[];
    } | null>;
    static publishProject(projectId: string, ownerId: string): Promise<boolean>;
    static unpublishProject(projectId: string, ownerId: string): Promise<boolean>;
    static updateProjectStatus(projectId: string, ownerId: string, status: string): Promise<boolean>;
    static checkSlugAvailability(slug: string, excludeProjectId?: string): Promise<boolean>;
    static checkDomainAvailability(domain: string, excludeProjectId?: string): Promise<boolean>;
    static generateSlug(name: string): string;
    static disconnect(): Promise<void>;
}
export { prisma };
export default DatabaseAPI;
//# sourceMappingURL=database.d.ts.map