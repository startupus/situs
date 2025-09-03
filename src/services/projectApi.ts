// Adapter: legacy API functions bridged to Nest endpoints

export interface ProjectData {
  id: string;
  name: string;
  description?: string | null;
  slug: string;
  domain?: string | null;
  customDomain?: string | null;
  isPublished: boolean;
  settings: any;
  createdAt: string;
  updatedAt: string;
}

export interface WebCategoryData {
  id: string;
  name: string;
  description?: string;
  slug: string;
  alias: string;
  level: number;
  parentId?: string;
  orderIndex: number;
  isActive: boolean;
  isPublished: boolean;
  language: string;
  accessLevel: string;
  productId: string;
  createdAt: string;
  updatedAt: string;
  parent?: WebCategoryData;
  children?: WebCategoryData[];
  _count?: {
    pageLinks: number;
    primaryPages: number;
  };
}

export interface PageData {
  id: string;
  title: string;
  slug: string;
  content: any;
  pageType?: string;
  status: string;
  isHomePage?: boolean;
  metaTitle?: string;
  metaDescription?: string;
  metaKeywords?: string;
  template?: string;
  layout?: string;
  projectId: string;
  primaryCategoryId?: string;
  createdAt: string;
  updatedAt: string;
  primaryCategory?: WebCategoryData;
  webCategories?: Array<{
    pageId: string;
    categoryId: string;
    assignedAt: string;
    category: WebCategoryData;
  }>;
}

const base = typeof window !== 'undefined' ? '' : process.env.API_BASE_URL || 'http://localhost:3001';

async function http<T>(url: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${base}${url}`, init);
  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(`HTTP ${res.status}: ${res.statusText} ${text}`);
  }
  const json = await res.json();
  return (json && (json.data ?? json)) as T;
}

export async function getProject(projectId: string): Promise<ProjectData> {
  return http<ProjectData>(`/api/projects/${projectId}`);
}

export async function getProjectPages(projectId: string): Promise<PageData[]> {
  try {
    const data = await http<{ pages: PageData[] }>(`/api/projects/${projectId}/pages`);
    return data?.pages || [];
  } catch (err) {
    // Fallback для совместимости: старый список страниц по query-параметру
    const alt = await http<{ pages: PageData[] }>(`/api/pages?projectId=${projectId}`);
    return alt?.pages || [];
  }
}

export async function getPage(pageId: string): Promise<PageData> {
  return http<PageData>(`/api/pages/${pageId}`);
}

export async function updatePage(pageId: string, updateData: Partial<PageData>): Promise<PageData> {
  return http<PageData>(`/api/pages/${pageId}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(updateData),
  });
}

// ==================== PAGES CATEGORIES ====================

export interface CreateWebCategoryRequest {
  name: string;
  description?: string;
  slug: string;
  alias?: string;
  parentId?: string;
  orderIndex?: number;
  isActive?: boolean;
  isPublished?: boolean;
  language?: string;
  accessLevel?: string;
}

export interface UpdateWebCategoryRequest {
  name?: string;
  description?: string;
  slug?: string;
  alias?: string;
  parentId?: string;
  orderIndex?: number;
  isActive?: boolean;
  isPublished?: boolean;
  language?: string;
  accessLevel?: string;
}

export interface ReorderWebCategoriesRequest {
  projectId: string;
  items: Array<{
    id: string;
    orderIndex: number;
    parentId?: string;
  }>;
}

export interface AssignCategoriesRequest {
  add?: string[];
  remove?: string[];
}

export async function getPagesCategories(projectId: string, includeInactive = false): Promise<WebCategoryData[]> {
  const params = includeInactive ? '?includeInactive=true' : '';
  const data = await http<{ categories: WebCategoryData[] }>(`/api/projects/${projectId}/pages/categories${params}`);
  return data?.categories || [];
}

// Aliases for backward compatibility
export const getWebsiteCategories = getPagesCategories;
export const createWebsiteCategory = createPagesCategory;
export const updateWebsiteCategory = updatePagesCategory;
export const deleteWebsiteCategory = deletePagesCategory;
export const reorderWebsiteCategories = reorderPagesCategories;

export async function createPagesCategory(
  projectId: string,
  categoryData: CreateWebCategoryRequest,
): Promise<WebCategoryData> {
  const data = await http<{ category: WebCategoryData }>(`/api/projects/${projectId}/pages/categories`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(categoryData),
  });
  return data.category;
}

export async function updatePagesCategory(
  categoryId: string,
  updateData: UpdateWebCategoryRequest,
): Promise<WebCategoryData> {
  const data = await http<{ category: WebCategoryData }>(`/api/pages/categories/${categoryId}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(updateData),
  });
  return data.category;
}

export async function deletePagesCategory(categoryId: string): Promise<void> {
  await http<{ success: boolean }>(`/api/pages/categories/${categoryId}`, {
    method: 'DELETE',
  });
}

export async function reorderPagesCategories(reorderData: ReorderWebCategoriesRequest): Promise<void> {
  await http<{ success: boolean }>(`/api/pages/categories/reorder`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(reorderData),
  });
}

// ==================== PAGE CATEGORIES ====================

export async function assignPageCategories(
  pageId: string,
  assignData: AssignCategoriesRequest,
): Promise<{ added: string[]; removed: string[] }> {
  const data = await http<{ added: string[]; removed: string[] }>(`/api/pages/${pageId}/categories`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(assignData),
  });
  return data;
}

export async function setPagePrimaryCategory(pageId: string, categoryId: string): Promise<PageData> {
  const data = await http<{ page: PageData }>(`/api/pages/${pageId}/categories/primary`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ categoryId }),
  });
  return data.page;
}

// ==================== URL HELPERS ====================

export function buildCanonicalUrl(page: PageData, menuUrl?: string): string {
  // Приоритет: URL из меню, затем основная рубрика
  if (menuUrl) {
    return menuUrl;
  }

  if (page.primaryCategory) {
    return `/${page.primaryCategory.slug}/${page.slug}`;
  }

  // Fallback: только slug страницы
  return `/${page.slug}`;
}
