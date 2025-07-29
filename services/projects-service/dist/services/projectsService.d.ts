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
export interface UpdateProjectData {
    name?: string;
    description?: string;
    type?: 'WEBSITE' | 'ECOMMERCE' | 'LANDING' | 'BLOG' | 'APP';
    domain?: string;
    customDomain?: string;
    settings?: {
        theme?: 'light' | 'dark' | 'auto';
        language?: 'ru' | 'en';
        creationType?: 'manual' | 'ai';
    };
    metaTitle?: string;
    metaDescription?: string;
    metaKeywords?: string;
}
export interface ProjectFilters {
    search?: string;
    status?: string;
    type?: string;
    sortBy?: 'name' | 'updated' | 'created';
    sortOrder?: 'asc' | 'desc';
    page?: number;
    limit?: number;
}
export interface CreatePageData {
    title: string;
    slug: string;
    content?: any;
    projectId: string;
    isHomePage?: boolean;
    metaTitle?: string;
    metaDescription?: string;
    metaKeywords?: string;
}
export declare class ProjectsService {
    static generateSlug(name: string): string;
    static generateSitusSubdomain(slug: string): string;
    static getProjects(ownerId: string, filters?: ProjectFilters): Promise<{
        projects: any;
        pagination: {
            page: number;
            limit: number;
            totalCount: any;
            totalPages: number;
            hasNext: boolean;
            hasPrev: boolean;
        };
    }>;
    static getProject(projectId: string, ownerId?: string): Promise<{
        id: any;
        name: any;
        description: any;
        slug: any;
        type: any;
        status: any;
        domain: any;
        customDomain: any;
        isPublished: any;
        settings: any;
        metaTitle: any;
        metaDescription: any;
        metaKeywords: any;
        createdAt: any;
        updatedAt: any;
        owner: any;
        pages: any;
    } | null>;
    static createProject(data: CreateProjectData): Promise<{
        id: any;
        name: any;
        description: any;
        slug: any;
        type: any;
        status: any;
        domain: any;
        customDomain: any;
        isPublished: any;
        settings: any;
        createdAt: any;
        updatedAt: any;
    }>;
    static updateProject(projectId: string, ownerId: string, data: UpdateProjectData): Promise<{
        id: any;
        name: any;
        description: any;
        slug: any;
        type: any;
        status: any;
        domain: any;
        customDomain: any;
        isPublished: any;
        settings: any;
        metaTitle: any;
        metaDescription: any;
        metaKeywords: any;
        createdAt: any;
        updatedAt: any;
        owner: any;
        pages: any;
    } | null>;
    static deleteProject(projectId: string, ownerId: string): Promise<boolean>;
    static publishProject(projectId: string, ownerId: string): Promise<boolean>;
    static unpublishProject(projectId: string, ownerId: string): Promise<boolean>;
    static updateProjectStatus(projectId: string, ownerId: string, status: string): Promise<boolean>;
    static checkSlugAvailability(slug: string, excludeProjectId?: string): Promise<boolean>;
    static checkDomainAvailability(domain: string, excludeProjectId?: string): Promise<boolean>;
    static createPage(data: CreatePageData): Promise<{
        id: any;
        title: any;
        slug: any;
        content: any;
        isHomePage: any;
        isPublished: boolean;
        metaTitle: any;
        metaDescription: any;
        metaKeywords: any;
        createdAt: any;
        updatedAt: any;
        projectId: any;
    }>;
    static updatePage(pageId: string, data: Partial<CreatePageData>): Promise<{
        id: any;
        title: any;
        slug: any;
        content: any;
        isHomePage: any;
        isPublished: boolean;
        metaTitle: any;
        metaDescription: any;
        metaKeywords: any;
        createdAt: any;
        updatedAt: any;
        projectId: any;
    }>;
    static deletePage(pageId: string): Promise<boolean>;
    static disconnect(): Promise<void>;
}
export default ProjectsService;
//# sourceMappingURL=projectsService.d.ts.map