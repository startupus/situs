/**
 * API для работы с проектами и страницами
 */

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001';

export interface ProjectData {
  id: string;
  name: string;
  description?: string;
  slug: string;
  type: string;
  status: string;
  domain?: string;
  customDomain?: string;
  isPublished: boolean;
  primaryColor?: string;
  secondaryColor?: string;
  fontFamily?: string;
  settings: any;
  pages: PageData[];
  products?: ProjectProduct[];
  _count: { pages: number };
}

export interface ProjectProduct {
  id: string;
  name: string;
  type: 'website' | 'store' | 'school' | 'chatbot' | 'blog';
  status: 'draft' | 'published' | 'archived';
  description?: string;
  settings?: Record<string, any>;
  url?: string;
  editorUrl?: string;
  createdAt: string;
  updatedAt: string;
}

export interface PageData {
  id: string;
  title: string;
  slug: string;
  content: any;
  pageType: string;
  status: string;
  isHomePage: boolean;
  metaTitle?: string;
  metaDescription?: string;
  metaKeywords?: string;
  template?: string;
  layout?: string;
  projectId: string;
  createdAt: string;
  updatedAt: string;
  project?: {
    id: string;
    name: string;
    slug: string;
  };
}

/**
 * Получить проект по ID
 */
export async function getProject(projectId: string): Promise<ProjectData> {
  const response = await fetch(`${API_BASE_URL}/api/projects`);
  
  if (!response.ok) {
    throw new Error(`Failed to fetch projects: ${response.statusText}`);
  }
  
  const data = await response.json();
  const project = data.data.find((p: ProjectData) => p.id === projectId);
  
  if (!project) {
    throw new Error(`Project with ID ${projectId} not found`);
  }
  
  return project;
}

/**
 * Получить страницы проекта
 */
export async function getProjectPages(projectId: string): Promise<PageData[]> {
  const response = await fetch(`${API_BASE_URL}/api/projects/${projectId}/pages`);
  
  if (!response.ok) {
    throw new Error(`Failed to fetch pages: ${response.statusText}`);
  }
  
  const data = await response.json();
  return data.data;
}

/**
 * Получить страницу по ID
 */
export async function getPage(pageId: string): Promise<PageData> {
  const response = await fetch(`${API_BASE_URL}/api/pages/${pageId}`);
  
  if (!response.ok) {
    throw new Error(`Failed to fetch page: ${response.statusText}`);
  }
  
  const data = await response.json();
  return data.data;
}

/**
 * Обновить страницу
 */
export async function updatePage(pageId: string, updateData: Partial<PageData>): Promise<PageData> {
  // Преобразуем контент в JSON строку, если он передан как объект
  const processedData = { ...updateData };
  if (updateData.content && typeof updateData.content === 'object') {
    processedData.content = JSON.stringify(updateData.content);
  }
  
  const response = await fetch(`${API_BASE_URL}/api/pages/${pageId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(processedData),
  });
  
  if (!response.ok) {
    throw new Error(`Failed to update page: ${response.statusText}`);
  }
  
  const data = await response.json();
  return data.data;
}

/**
 * Получить список всех проектов
 */
export async function getAllProjects(): Promise<ProjectData[]> {
  const response = await fetch(`${API_BASE_URL}/api/projects`);
  
  if (!response.ok) {
    throw new Error(`Failed to fetch projects: ${response.statusText}`);
  }
  
  const data = await response.json();
  return data.data;
}

/**
 * Получить продукты проекта
 */
export async function getProjectProducts(projectId: string): Promise<ProjectProduct[]> {
  const response = await fetch(`${API_BASE_URL}/api/projects/${projectId}/products`);
  
  if (!response.ok) {
    throw new Error(`Failed to fetch products: ${response.statusText}`);
  }
  
  const data = await response.json();
  return data.data;
}

/**
 * Создать продукт в проекте
 */
export async function createProjectProduct(
  projectId: string, 
  productData: {
    name: string;
    type: ProjectProduct['type'];
    description?: string;
    settings?: Record<string, any>;
  }
): Promise<ProjectProduct> {
  const response = await fetch(`${API_BASE_URL}/api/projects/${projectId}/products`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(productData),
  });
  
  if (!response.ok) {
    throw new Error(`Failed to create product: ${response.statusText}`);
  }
  
  const data = await response.json();
  return data.data;
}

/**
 * Обновить продукт
 */
export async function updateProjectProduct(
  projectId: string,
  productId: string,
  updateData: Partial<ProjectProduct>
): Promise<ProjectProduct> {
  const response = await fetch(`${API_BASE_URL}/api/projects/${projectId}/products/${productId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(updateData),
  });
  
  if (!response.ok) {
    throw new Error(`Failed to update product: ${response.statusText}`);
  }
  
  const data = await response.json();
  return data.data;
}

/**
 * Удалить продукт
 */
export async function deleteProjectProduct(projectId: string, productId: string): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/api/projects/${projectId}/products/${productId}`, {
    method: 'DELETE',
  });
  
  if (!response.ok) {
    throw new Error(`Failed to delete product: ${response.statusText}`);
  }
}
