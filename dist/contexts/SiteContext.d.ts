import { ReactNode } from 'react';
import { Site, Page } from '../api/services/sites.api';
interface SiteState {
    sites: Site[];
    currentSite: Site | null;
    currentPage: Page | null;
    loading: boolean;
    error: string | null;
}
interface SiteContextType {
    state: SiteState;
    actions: {
        loadSites: () => Promise<void>;
        selectSite: (siteId: string) => Promise<void>;
        selectPage: (pageId: string) => void;
        createSite: (data: Omit<Site, 'id' | 'createdAt' | 'updatedAt' | 'pages'>) => Promise<Site>;
        createPage: (data: Omit<Page, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
        updatePage: (pageId: string, data: Partial<Page>) => Promise<void>;
        deletePage: (pageId: string) => Promise<void>;
        savePageContent: (pageId: string, content: any[]) => Promise<void>;
    };
}
interface SiteProviderProps {
    children: ReactNode;
}
export declare function SiteProvider({ children }: SiteProviderProps): import("react/jsx-runtime").JSX.Element;
export declare function useSite(): SiteContextType;
export {};
//# sourceMappingURL=SiteContext.d.ts.map