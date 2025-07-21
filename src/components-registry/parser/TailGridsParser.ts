// 🔗 TailGrids Parser
// Парсер для извлечения метаданных с официального сайта TailGrids

import { ComponentMetadata, ComponentCategory, ComponentSource } from '../types';

export class TailGridsParser {
  private readonly baseUrls = {
    free: 'https://tailgrids.com/components',
    pro: 'https://tailgrids.com/react/components',
    docs: 'https://tailgrids.com/docs'
  };

  // 📊 Маппинг категорий TailGrids -> наши категории
  private readonly categoryMapping: Record<string, { category: ComponentCategory; subcategory: string }> = {
    // Core Components
    'buttons': { category: 'core', subcategory: 'buttons' },
    'forms': { category: 'core', subcategory: 'forms' },
    'navigation': { category: 'core', subcategory: 'navigation' },
    'layout': { category: 'core', subcategory: 'layout' },
    'feedback': { category: 'core', subcategory: 'feedback' },
    'cards': { category: 'core', subcategory: 'cards' },
    'badges': { category: 'core', subcategory: 'badges' },
    'alerts': { category: 'core', subcategory: 'alerts' },
    
    // Pro Components
    'marketing': { category: 'pro', subcategory: 'marketing' },
    'hero': { category: 'pro', subcategory: 'marketing' },
    'pricing': { category: 'pro', subcategory: 'marketing' },
    'testimonials': { category: 'pro', subcategory: 'marketing' },
    'cta': { category: 'pro', subcategory: 'marketing' },
    'ecommerce': { category: 'pro', subcategory: 'ecommerce' },
    'product-grid': { category: 'pro', subcategory: 'ecommerce' },
    'checkout': { category: 'pro', subcategory: 'ecommerce' },
    'dashboard': { category: 'pro', subcategory: 'dashboard' },
    'charts': { category: 'pro', subcategory: 'dashboard' },
    'tables': { category: 'pro', subcategory: 'dashboard' },
    'widgets': { category: 'pro', subcategory: 'dashboard' },
    
    // Templates
    'templates': { category: 'templates', subcategory: 'landing' },
    'landing': { category: 'templates', subcategory: 'landing' },
    'dashboard-template': { category: 'templates', subcategory: 'dashboard' },
    'ecommerce-template': { category: 'templates', subcategory: 'ecommerce' }
  };

  // 🎯 Парсинг метаданных компонента
  async parseComponent(componentData: any): Promise<ComponentMetadata | null> {
    try {
      const { name, category, preview, description, tags = [] } = componentData;
      
      if (!name || !category) {
        console.warn('Недостаточно данных для компонента:', componentData);
        return null;
      }

      const categoryInfo = this.categoryMapping[category.toLowerCase()] || 
                          { category: 'core' as ComponentCategory, subcategory: 'other' };

      const source: ComponentSource = this.getSourceFromCategory(categoryInfo.category);
      
      const metadata: ComponentMetadata = {
        id: `tailgrids-${category}-${name}`.toLowerCase().replace(/[^a-z0-9-]/g, '-'),
        name,
        description: description || `${name} component from TailGrids`,
        category: categoryInfo.category,
        subcategory: categoryInfo.subcategory,
        source,
        preview: {
          thumbnail: this.getPreviewUrl(category, name),
          demo: this.getDemoUrl(category, name),
          screenshots: []
        },
        component: {
          path: this.getComponentPath(categoryInfo.category, category, name),
          props: {},
          dependencies: ['react', 'tailwindcss']
        },
        tags: [
          ...tags,
          category,
          categoryInfo.subcategory,
          source,
          'tailgrids'
        ],
        readonly: source !== 'ai-generated' && source !== 'user-custom',
        featured: false,
        popularity: 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      return metadata;
    } catch (error) {
      console.error('Ошибка парсинга компонента:', error);
      return null;
    }
  }

  // 🔗 Генерация URL превью
  private getPreviewUrl(category: string, name: string): string {
    const baseUrl = this.baseUrls.pro; // Используем pro URL для превью
    return `${baseUrl}/${category}/${name}/preview.jpg`;
  }

  // 🔗 Генерация URL демо
  private getDemoUrl(category: string, name: string): string {
    const baseUrl = this.baseUrls.pro;
    return `${baseUrl}/${category}/${name}`;
  }

  // 📁 Генерация пути к компоненту
  private getComponentPath(category: ComponentCategory, subcategory: string, name: string): string {
    return `src/components-registry/core/${category}/${subcategory}/${name}`;
  }

  // 🎯 Определение источника по категории
  private getSourceFromCategory(category: ComponentCategory): ComponentSource {
    switch (category) {
      case 'core':
        return 'free';
      case 'pro':
        return 'pro';
      case 'templates':
        return 'templates';
      case 'custom':
        return 'ai-generated';
      default:
        return 'free';
    }
  }

  // 📊 Парсинг списка компонентов из каталога
  async parseComponentsList(source: 'free' | 'pro' = 'pro'): Promise<ComponentMetadata[]> {
    try {
      console.log(`🔍 Парсинг каталога TailGrids (${source})...`);
      
      // Моковые данные для демонстрации
      // В реальной реализации здесь будет fetch к TailGrids API
      const mockComponents = this.getMockComponentsData(source);
      
      const parsedComponents: ComponentMetadata[] = [];
      
      for (const componentData of mockComponents) {
        const parsed = await this.parseComponent(componentData);
        if (parsed) {
          parsedComponents.push(parsed);
        }
      }

      console.log(`✅ Спарсено ${parsedComponents.length} компонентов`);
      return parsedComponents;
    } catch (error) {
      console.error('Ошибка парсинга каталога TailGrids:', error);
      return [];
    }
  }

  // 🎭 Моковые данные для демонстрации
  private getMockComponentsData(source: 'free' | 'pro'): any[] {
    const baseComponents = [
      // Core Components
      { name: 'Button Primary', category: 'buttons', description: 'Primary action button', tags: ['interactive', 'action'] },
      { name: 'Button Secondary', category: 'buttons', description: 'Secondary action button', tags: ['interactive', 'action'] },
      { name: 'Card Basic', category: 'cards', description: 'Basic content card', tags: ['layout', 'content'] },
      { name: 'Card Featured', category: 'cards', description: 'Featured content card', tags: ['layout', 'content', 'featured'] },
      { name: 'Alert Success', category: 'alerts', description: 'Success notification alert', tags: ['feedback', 'notification'] },
      { name: 'Alert Error', category: 'alerts', description: 'Error notification alert', tags: ['feedback', 'notification'] },
      { name: 'Navbar Simple', category: 'navigation', description: 'Simple navigation bar', tags: ['navigation', 'header'] },
      { name: 'Navbar With Logo', category: 'navigation', description: 'Navigation bar with logo', tags: ['navigation', 'header', 'branding'] }
    ];

    const proComponents = [
      // Marketing
      { name: 'Hero Modern', category: 'hero', description: 'Modern hero section', tags: ['marketing', 'landing', 'hero'] },
      { name: 'Hero Gradient', category: 'hero', description: 'Hero section with gradient', tags: ['marketing', 'landing', 'hero', 'gradient'] },
      { name: 'Pricing Table', category: 'pricing', description: 'Professional pricing table', tags: ['marketing', 'pricing', 'saas'] },
      { name: 'Pricing Cards', category: 'pricing', description: 'Pricing cards layout', tags: ['marketing', 'pricing', 'cards'] },
      { name: 'Testimonials Grid', category: 'testimonials', description: 'Customer testimonials grid', tags: ['marketing', 'social-proof'] },
      { name: 'CTA Banner', category: 'cta', description: 'Call-to-action banner', tags: ['marketing', 'conversion'] },
      
      // E-commerce
      { name: 'Product Grid', category: 'product-grid', description: 'Product showcase grid', tags: ['ecommerce', 'products'] },
      { name: 'Product Card', category: 'ecommerce', description: 'Individual product card', tags: ['ecommerce', 'products', 'cards'] },
      { name: 'Shopping Cart', category: 'ecommerce', description: 'Shopping cart component', tags: ['ecommerce', 'cart'] },
      { name: 'Checkout Form', category: 'checkout', description: 'Complete checkout form', tags: ['ecommerce', 'forms', 'payment'] },
      
      // Dashboard
      { name: 'Analytics Chart', category: 'charts', description: 'Analytics data chart', tags: ['dashboard', 'analytics', 'data'] },
      { name: 'Data Table', category: 'tables', description: 'Advanced data table', tags: ['dashboard', 'data', 'table'] },
      { name: 'Stats Widget', category: 'widgets', description: 'Statistics widget', tags: ['dashboard', 'stats', 'metrics'] },
      { name: 'Dashboard Sidebar', category: 'dashboard', description: 'Dashboard navigation sidebar', tags: ['dashboard', 'navigation'] }
    ];

    const templates = [
      { name: 'Admino Dashboard', category: 'templates', description: 'Complete admin dashboard template', tags: ['template', 'dashboard', 'admin'] },
      { name: 'Agency Landing', category: 'templates', description: 'Agency website template', tags: ['template', 'landing', 'agency'] },
      { name: 'E-commerce Store', category: 'templates', description: 'Complete e-commerce template', tags: ['template', 'ecommerce', 'store'] },
      { name: 'SaaS Landing', category: 'templates', description: 'SaaS product landing page', tags: ['template', 'landing', 'saas'] }
    ];

    if (source === 'free') {
      return baseComponents;
    } else {
      return [...baseComponents, ...proComponents, ...templates];
    }
  }

  // 🔄 Синхронизация с TailGrids
  async syncWithTailGrids(): Promise<ComponentMetadata[]> {
    try {
      console.log('🔄 Синхронизация с TailGrids каталогом...');
      
      // Парсим бесплатные и премиум компоненты
      const [freeComponents, proComponents] = await Promise.all([
        this.parseComponentsList('free'),
        this.parseComponentsList('pro')
      ]);

      const allComponents = [...freeComponents, ...proComponents];
      
      console.log(`✅ Синхронизация завершена: ${allComponents.length} компонентов`);
      return allComponents;
    } catch (error) {
      console.error('Ошибка синхронизации с TailGrids:', error);
      return [];
    }
  }
}

// 🌟 Singleton instance
export const tailGridsParser = new TailGridsParser(); 