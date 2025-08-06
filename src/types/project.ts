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

export interface ProjectProduct {
  id: string;
  name: string;
  type: 'website' | 'store' | 'school' | 'chatbot' | 'blog';
  status: 'draft' | 'published' | 'archived';
  description?: string;
  settings?: Record<string, any>;
  url?: string; // URL продукта
  editorUrl?: string; // URL редактора (для сайтов)
  createdAt: Date;
  updatedAt: Date;
}

export interface Project {
  id: string;
  name: string;
  description?: string;
  domain?: string; // Домен для публикации
  template?: string;
  type: 'WEBSITE' | 'ECOMMERCE' | 'LANDING' | 'BLOG' | 'APP';
  status: 'draft' | 'published' | 'archived';
  settings: {
    theme: 'light' | 'dark' | 'auto';
    primaryColor?: string;
    favicon?: string;
    logo?: string;
  };
  pages: ProjectPage[];
  products: ProjectProduct[]; // Продукты проекта
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

export interface CreateProductData {
  name: string;
  type: ProjectProduct['type'];
  description?: string;
  settings?: Record<string, any>;
}

export interface UpdateProductData {
  name?: string;
  description?: string;
  status?: ProjectProduct['status'];
  settings?: Record<string, any>;
  url?: string;
  editorUrl?: string;
}

export interface CreateProjectData {
  name: string;
  description?: string;
  domain?: string;
  template?: string;
  type: Project['type'];
  settings?: Partial<Project['settings']>;
}

export interface UpdateProjectData {
  name?: string;
  description?: string;
  domain?: string;
  template?: string;
  type?: Project['type'];
  status?: Project['status'];
  settings?: Partial<Project['settings']>;
  pages?: ProjectPage[];
  products?: ProjectProduct[];
} 