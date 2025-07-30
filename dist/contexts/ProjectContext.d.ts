import React from 'react';
import { Project, ProjectPage, CreatePageData, UpdatePageData } from '../types/project';
interface ProjectContextType {
    currentProject: Project | null;
    currentPage: ProjectPage | null;
    pages: ProjectPage[];
    loadProject: (projectId: string) => Promise<void>;
    updateProject: (updates: Partial<Project>) => Promise<void>;
    createPage: (data: CreatePageData) => Promise<ProjectPage>;
    updatePage: (pageId: string, data: UpdatePageData) => Promise<void>;
    deletePage: (pageId: string) => Promise<void>;
    loadPage: (pageId: string) => Promise<void>;
    savePage: (pageId: string, content: any) => Promise<void>;
    publishPage: (pageId: string) => Promise<void>;
    isLoading: boolean;
    error: string | null;
}
declare const ProjectContext: React.Context<ProjectContextType | undefined>;
export declare const useProject: () => ProjectContextType;
interface ProjectProviderProps {
    children: React.ReactNode;
}
export declare const ProjectProvider: React.FC<ProjectProviderProps>;
export default ProjectContext;
//# sourceMappingURL=ProjectContext.d.ts.map