export interface ProjectPage {
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
export interface Project {
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
    pages: ProjectPage[];
    createdAt: Date;
    updatedAt: Date;
    owner: string;
    collaborators?: string[];
    isPublic: boolean;
}
export interface CreatePageData {
    title: string;
    slug?: string;
    template?: string;
}
export interface UpdatePageData {
    title?: string;
    slug?: string;
    content?: any;
    meta?: Partial<ProjectPage['meta']>;
    status?: ProjectPage['status'];
    publishedAt?: Date;
}
export interface CreateProjectData {
    name: string;
    description?: string;
    domain?: string;
    template?: string;
    type?: ProjectType;
    settings?: Partial<Project['settings']>;
}
export interface UpdateProjectData {
    name?: string;
    description?: string;
    domain?: string;
    template?: string;
    settings?: Partial<Project['settings']>;
    pages?: ProjectPage[];
}
//# sourceMappingURL=project.d.ts.map