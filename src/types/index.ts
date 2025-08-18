export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  balance: {
    monetus: number;
    currency: string;
  };
  subscription: {
    plan: 'free' | 'pro' | 'enterprise';
    expiresAt?: Date;
  };
}

export interface Project {
  id: string;
  name: string;
  description?: string;
  type: 'website' | 'ecommerce' | 'landing' | 'blog' | 'app';
  status: 'active' | 'draft' | 'archived';
  domain?: string;
  subdomain?: string;
  createdAt: Date;
  updatedAt: Date;
  settings: ProjectSettings;
  statistics: ProjectStatistics;
}

export interface ProjectSettings {
  seo: {
    title: string;
    description: string;
    keywords: string[];
  };
  theme: {
    primaryColor: string;
    secondaryColor: string;
    fontFamily: string;
  };
  integrations: {
    analytics: boolean;
    chat: boolean;
    payment: boolean;
  };
}

export interface ProjectStatistics {
  visitors: number;
  pageViews: number;
  conversionRate: number;
  revenue: number;
  pages: number;
  lastActivity: Date;
}

export interface ProjectPage {
  id: string;
  title: string;
  slug: string;
  type: 'page' | 'post' | 'product';
  status: 'published' | 'draft' | 'archived';
  createdAt: Date;
  updatedAt: Date;
}

export interface Extension {
  id: string;
  name: string;
  description: string;
  category: 'analytics' | 'payment' | 'marketing' | 'communication' | 'utility';
  status: 'installed' | 'available' | 'premium';
  icon: string;
  version: string;
}

export interface AITool {
  id: string;
  name: string;
  description: string;
  category: 'content' | 'design' | 'seo' | 'analytics';
  status: 'active' | 'inactive';
  usage: number;
  limit: number;
}

export type ProjectSection = 
  | 'dashboard'
  | 'pages'
  | 'menu'
  | 'ecommerce'
  | 'extensions'
  | 'marketing'
  | 'ai'
  | 'settings';

export interface NavigationItem {
  id: string;
  label: string;
  icon: string;
  path: string;
  section?: ProjectSection;
  children?: NavigationItem[];
}

// Экспорт типов системы меню
export * from './menu'; 