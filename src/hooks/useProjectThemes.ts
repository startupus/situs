import { useCallback, useEffect, useMemo, useState } from 'react';
import projectsApi from '../api/services/projects.api';

export interface ProjectThemeItem {
  id: string;
  name: string;
  description?: string;
  type: 'admin' | 'public' | 'mobile' | 'print';
  isActive: boolean;
  isDefault: boolean;
  config: any;
  createdAt?: string;
  updatedAt?: string;
}

export function useProjectThemes(projectId?: string) {
  const [themes, setThemes] = useState<ProjectThemeItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const reload = useCallback(async () => {
    if (!projectId) return;
    setLoading(true);
    setError(null);
    try {
      const list = await projectsApi.listProjectThemes(projectId);
      setThemes(list as any);
    } catch (e: any) {
      setError(e?.message || 'Не удалось загрузить темы');
    } finally {
      setLoading(false);
    }
  }, [projectId]);

  useEffect(() => { reload(); }, [reload]);

  const activeTheme = useMemo(() => themes.find(t => t.isActive), [themes]);

  const createTheme = useCallback(async (data: Partial<ProjectThemeItem>) => {
    if (!projectId) return null;
    const created = await projectsApi.createProjectTheme(projectId, data);
    await reload();
    return created as ProjectThemeItem;
  }, [projectId, reload]);

  const updateTheme = useCallback(async (themeId: string, data: Partial<ProjectThemeItem>) => {
    if (!projectId) return null;
    const updated = await projectsApi.updateProjectThemeById(projectId, themeId, data);
    await reload();
    return updated as ProjectThemeItem;
  }, [projectId, reload]);

  const deleteTheme = useCallback(async (themeId: string) => {
    if (!projectId) return;
    await projectsApi.deleteProjectTheme(projectId, themeId);
    await reload();
  }, [projectId, reload]);

  const activateTheme = useCallback(async (themeId: string) => {
    if (!projectId) return;
    await projectsApi.activateProjectTheme(projectId, themeId);
    await reload();
  }, [projectId, reload]);

  return { themes, activeTheme, loading, error, reload, createTheme, updateTheme, deleteTheme, activateTheme } as const;
}

export default useProjectThemes;

