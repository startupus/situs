export interface Site {
    id: string;
    name: string;
    description: string;
    domain?: string;
    customDomain?: string;
    template?: string;
    status: 'draft' | 'published' | 'archived';
    createdAt: string;
    updatedAt: string;
    pages: Page[];
    settings?: {
        theme: 'light' | 'dark' | 'auto';
        primaryColor?: string;
        favicon?: string;
        logo?: string;
    };
}
export interface Page {
    id: string;
    siteId: string;
    title: string;
    slug: string;
    content: BlockContent[];
    metaTitle?: string;
    metaDescription?: string;
    isHomePage: boolean;
    isPublished: boolean;
    status: 'draft' | 'published' | 'archived';
    createdAt: string;
    updatedAt: string;
}
export interface BlockContent {
    id: string;
    type: string;
    props: Record<string, any>;
    children?: BlockContent[];
}
export declare const mockSites: Site[];
export declare const mockPages: Page[];
export declare const currentSite: Site;
export declare const currentPage: Page;
export declare class MockAPI {
    static getSites(): Promise<Site[]>;
    static getSite(id: string): Promise<Site | null>;
    static getPage(siteId: string, pageId: string): Promise<Page | null>;
    static createSite(data: Omit<Site, 'id' | 'createdAt' | 'updatedAt' | 'pages'>): Promise<Site>;
    static createPage(siteId: string, data: Omit<Page, 'id' | 'siteId' | 'createdAt' | 'updatedAt'>): Promise<Page>;
    static updatePage(pageId: string, data: Partial<Page>): Promise<Page | null>;
    static deletePage(pageId: string): Promise<boolean>;
}
export default MockAPI;
//# sourceMappingURL=mockData.d.ts.map