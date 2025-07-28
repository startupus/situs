export interface ProjectPage {
  id: string;
  title: string;
  slug: string; // URL-friendly название
  content: any; // JSON контент от Redaktus
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
  domain?: string; // Домен для публикации
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