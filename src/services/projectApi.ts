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
  createdAt: string;
  updatedAt: string;
}

const base = typeof window !== 'undefined' ? '' : (process.env.API_BASE_URL || 'http://localhost:3001');

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
  const data = await http<{ pages: PageData[] }>(`/api/projects/${projectId}/pages`);
  return data?.pages || [];
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
