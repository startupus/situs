import { ThemeConfig, ThemeTemplate, DEFAULT_THEMES, DEFAULT_TYPOGRAPHY, DEFAULT_LAYOUT, DEFAULT_ANIMATIONS, DEFAULT_GRADIENTS } from '../../types/theme';

export interface ListTemplatesParams {
  search?: string;
  categories?: string[];
  limit?: number;
}

export type BuiltInTemplate = ThemeTemplate;

const BUILT_INS: BuiltInTemplate[] = [
  {
    id: 'tpl-business-pro',
    name: 'Business Pro',
    description: 'Корпоративный стиль',
    config: {
      id: 'business-pro',
      name: 'Business Pro',
      colors: DEFAULT_THEMES[2].colors, // blue classic as base
      typography: DEFAULT_TYPOGRAPHY,
      layout: DEFAULT_LAYOUT,
      animations: DEFAULT_ANIMATIONS,
      gradients: DEFAULT_GRADIENTS,
    },
    createdAt: new Date(),
    isBuiltIn: true,
    tags: ['business']
  },
  {
    id: 'tpl-creative-agency',
    name: 'Creative Agency',
    description: 'Креативное агентство',
    config: {
      id: 'creative-agency',
      name: 'Creative Agency',
      colors: DEFAULT_THEMES[0].colors,
      typography: DEFAULT_TYPOGRAPHY,
      layout: DEFAULT_LAYOUT,
      animations: DEFAULT_ANIMATIONS,
      gradients: DEFAULT_GRADIENTS,
    },
    createdAt: new Date(),
    isBuiltIn: true,
    tags: ['creative']
  },
  {
    id: 'tpl-ecommerce',
    name: 'E-commerce Store',
    description: 'Интернет-магазин',
    config: {
      id: 'ecommerce',
      name: 'E-commerce',
      colors: DEFAULT_THEMES[1].colors,
      typography: DEFAULT_TYPOGRAPHY,
      layout: DEFAULT_LAYOUT,
      animations: DEFAULT_ANIMATIONS,
      gradients: DEFAULT_GRADIENTS,
    },
    createdAt: new Date(),
    isBuiltIn: true,
    tags: ['ecommerce']
  }
];

class ThemeTemplateService {
  async listTemplates(params?: ListTemplatesParams): Promise<{ templates: ThemeTemplate[]; total: number }> {
    // MVP: локальный каталог. В будущем — запрос к /api/theme-templates
    let list = BUILT_INS;
    if (params?.search && params.search.trim()) {
      const s = params.search.trim().toLowerCase();
      list = list.filter(t => t.name.toLowerCase().includes(s) || (t.tags || []).some(tag => tag.toLowerCase().includes(s)));
    }
    if (params?.categories && params.categories.length > 0) {
      const cats = new Set(params.categories);
      list = list.filter(t => (t.tags || []).some(tag => cats.has(tag)));
    }
    const total = list.length;
    if (params?.limit && params.limit > 0) {
      list = list.slice(0, params.limit);
    }
    return { templates: list, total };
  }

  getBuiltInTemplates(): ThemeTemplate[] {
    return BUILT_INS;
  }
}

export default new ThemeTemplateService();

