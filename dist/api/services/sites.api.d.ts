/**
 * Sites API Service
 * Полноценная интеграция с Projects Service для работы с сайтами
 * Использует Projects API как основу для управления сайтами
 */
export interface Site {
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
    pages: Page[];
    createdAt: Date;
    updatedAt: Date;
    owner: string;
    collaborators?: string[];
    isPublic: boolean;
}
export interface Page {
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
export interface SiteFilters {
    search?: string;
    status?: string;
    type?: string;
    sortBy?: 'name' | 'updated' | 'created';
    sortOrder?: 'asc' | 'desc';
    page?: number;
    limit?: number;
}
export interface SitesListResponse {
    sites: Site[];
    pagination: {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
    };
}
export interface CreateSiteData {
    name: string;
    description?: string;
    domain?: string;
    template?: string;
    settings?: Partial<Site['settings']>;
}
export interface UpdateSiteData {
    name?: string;
    description?: string;
    domain?: string;
    template?: string;
    settings?: Partial<Site['settings']>;
}
export interface CreatePageData {
    title: string;
    slug?: string;
    content?: any[];
    meta?: {
        description?: string;
        keywords?: string[];
        ogImage?: string;
    };
    status?: 'draft' | 'published' | 'archived';
}
export interface UpdatePageData {
    title?: string;
    slug?: string;
    content?: any[];
    meta?: Partial<Page['meta']>;
    status?: Page['status'];
    publishedAt?: Date;
}
declare class SitesApiService {
    private readonly baseEndpoint;
    /**
     * Получить список сайтов (проектов)
     */
    getSites(filters?: SiteFilters): Promise<SitesListResponse>;
    /**
     * Получить отдельный сайт
     */
    getSite(siteId: string): Promise<Site>;
    /**
     * Создать новый сайт
     */
    createSite(data: CreateSiteData): Promise<Site>;
    /**
     * Обновить сайт
     */
    updateSite(siteId: string, data: UpdateSiteData): Promise<Site>;
    /**
     * Удалить сайт
     */
    deleteSite(siteId: string): Promise<void>;
    /**
     * Создать новую страницу
     */
    createPage(siteId: string, data: CreatePageData): Promise<Page>;
    /**
     * Обновить страницу
     */
    updatePage(pageId: string, data: UpdatePageData): Promise<Page>;
    /**
     * Удалить страницу
     */
    deletePage(pageId: string): Promise<void>;
    /**
     * Сохранить контент страницы
     */
    savePageContent(pageId: string, content: any[]): Promise<void>;
    /**
     * Преобразование Project в Site
     */
    private projectToSite;
    /**
     * Преобразование ProjectPage в Page
     */
    private projectPageToPage;
    /**
     * Генерация slug из заголовка
     */
    private generateSlug;
}
export declare const sitesApi: SitesApiService;
export default sitesApi;
//# sourceMappingURL=sites.api.d.ts.map