import { useEffect, useMemo, useState } from 'react';
import ThemeTemplateService, { BuiltInTemplate } from '../api/services/ThemeTemplateService';
import { ThemeTemplate, ThemeConfig } from '../types/theme';

export type TemplateCategory = 'business' | 'creative' | 'ecommerce' | 'portfolio' | 'blog' | 'landing' | 'dashboard' | 'minimal' | 'dark' | 'tech' | 'other';

export interface UseThemeTemplatesOptions {
  search?: string;
  categories?: TemplateCategory[];
  limit?: number;
}

export interface UseThemeTemplatesResult {
  templates: ThemeTemplate[];
  total: number;
  isLoading: boolean;
  error?: string;
  installTemplate: (templateId: string, customName?: string) => ThemeConfig | null;
  refresh: () => void;
}

const useThemeTemplates = (options?: UseThemeTemplatesOptions): UseThemeTemplatesResult => {
  const [allTemplates, setAllTemplates] = useState<ThemeTemplate[]>([]);
  const [total, setTotal] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | undefined>(undefined);

  const fetchTemplates = async () => {
    setIsLoading(true);
    setError(undefined);
    try {
      const result = await ThemeTemplateService.listTemplates({
        search: options?.search,
        categories: options?.categories,
        limit: options?.limit,
      });
      setAllTemplates(result.templates);
      setTotal(result.total);
    } catch (e: any) {
      setError(e?.message || 'Не удалось загрузить шаблоны');
      // Фоллбек к встроенным шаблонам
      const fallback = ThemeTemplateService.getBuiltInTemplates();
      setAllTemplates(fallback);
      setTotal(fallback.length);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTemplates();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [options?.search, JSON.stringify(options?.categories), options?.limit]);

  const installTemplate = (templateId: string, customName?: string): ThemeConfig | null => {
    try {
      const tmpl = allTemplates.find(t => t.id === templateId);
      if (!tmpl) return null;
      const config: ThemeConfig = {
        ...tmpl.config,
        id: tmpl.config.id || tmpl.id,
        name: customName || tmpl.name,
      };
      return config;
    } catch {
      return null;
    }
  };

  const filtered = useMemo(() => {
    let list = allTemplates;
    if (options?.search && options.search.trim().length > 0) {
      const s = options.search.trim().toLowerCase();
      list = list.filter(t => t.name.toLowerCase().includes(s) || (t.tags || []).some(tag => tag.toLowerCase().includes(s)));
    }
    if (options?.categories && options.categories.length > 0) {
      const cats = new Set(options.categories);
      list = list.filter(t => (t.tags || []).some(tag => cats.has(tag as TemplateCategory)));
    }
    if (options?.limit && options.limit > 0) {
      list = list.slice(0, options.limit);
    }
    return list;
  }, [allTemplates, options?.search, JSON.stringify(options?.categories), options?.limit]);

  return {
    templates: filtered,
    total,
    isLoading,
    error,
    installTemplate,
    refresh: fetchTemplates,
  };
};

export default useThemeTemplates;

