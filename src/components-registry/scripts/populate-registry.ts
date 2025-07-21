// 🔄 Registry Population Script
// Скрипт для заполнения registry.json метаданными всех компонентов

import { componentRegistry } from '../ComponentRegistry';
import { tailGridsParser } from '../parser/TailGridsParser';

export async function populateRegistry(): Promise<void> {
  try {
    console.log('🚀 Запуск заполнения Component Registry...');
    
    // 1. Синхронизация с TailGrids
    console.log('📡 Синхронизация с TailGrids каталогом...');
    const tailGridsComponents = await tailGridsParser.syncWithTailGrids();
    
    // 2. Добавление компонентов в реестр
    console.log('➕ Добавление компонентов в реестр...');
    let addedCount = 0;
    
    for (const component of tailGridsComponents) {
      try {
        componentRegistry.addComponent(component);
        addedCount++;
      } catch (error) {
        console.warn(`Ошибка добавления компонента ${component.name}:`, error);
      }
    }
    
    // 3. Добавление пользовательских шаблонов
    console.log('📄 Добавление шаблонов...');
    const templates = getTemplatesMetadata();
    for (const template of templates) {
      try {
        componentRegistry.addComponent(template);
        addedCount++;
      } catch (error) {
        console.warn(`Ошибка добавления шаблона ${template.name}:`, error);
      }
    }
    
    // 4. Статистика
    const registry = componentRegistry.getRegistry();
    console.log('📊 Статистика заполнения:');
    console.log(`✅ Всего компонентов: ${registry.stats.totalComponents}`);
    console.log(`🏗️ Core: ${registry.stats.componentsByCategory.core}`);
    console.log(`⭐ Pro: ${registry.stats.componentsByCategory.pro}`);
    console.log(`📄 Templates: ${registry.stats.componentsByCategory.templates}`);
    console.log(`🤖 Custom: ${registry.stats.componentsByCategory.custom}`);
    
    console.log('✅ Заполнение Component Registry завершено!');
    
  } catch (error) {
    console.error('❌ Ошибка заполнения registry:', error);
    throw error;
  }
}

// 📄 Метаданные шаблонов
function getTemplatesMetadata() {
  return [
    {
      id: 'template-admino',
      name: 'Admino Dashboard',
      description: 'Complete admin dashboard template with sidebar, charts, and data tables',
      category: 'templates' as const,
      subcategory: 'dashboard',
      source: 'templates' as const,
      preview: {
        thumbnail: '/templates/admino/preview.jpg',
        demo: '/templates/admino/demo',
        screenshots: ['/templates/admino/screenshot1.jpg', '/templates/admino/screenshot2.jpg']
      },
      component: {
        path: 'src/components-registry/core/templates/react-templates/admino',
        props: {
          theme: 'light',
          sidebar: 'expanded',
          layout: 'dashboard'
        },
        dependencies: ['react', 'tailwindcss', 'react-router-dom', 'recharts']
      },
      tags: ['template', 'dashboard', 'admin', 'complete', 'sidebar', 'charts'],
      readonly: true,
      featured: true,
      popularity: 95
    },
    {
      id: 'template-agency',
      name: 'Agency Landing',
      description: 'Modern agency website template with hero, services, and portfolio sections',
      category: 'templates' as const,
      subcategory: 'landing',
      source: 'templates' as const,
      preview: {
        thumbnail: '/templates/agency/preview.jpg',
        demo: '/templates/agency/demo',
        screenshots: ['/templates/agency/screenshot1.jpg']
      },
      component: {
        path: 'src/components-registry/core/templates/react-templates/agency',
        props: {
          theme: 'modern',
          hero: 'gradient',
          sections: ['hero', 'services', 'portfolio', 'contact']
        },
        dependencies: ['react', 'tailwindcss', 'framer-motion']
      },
      tags: ['template', 'landing', 'agency', 'marketing', 'hero', 'portfolio'],
      readonly: true,
      featured: true,
      popularity: 88
    },
    {
      id: 'template-ecommerce',
      name: 'E-commerce Store',
      description: 'Complete e-commerce template with product catalog, cart, and checkout',
      category: 'templates' as const,
      subcategory: 'ecommerce',
      source: 'templates' as const,
      preview: {
        thumbnail: '/templates/ecommerce/preview.jpg',
        demo: '/templates/ecommerce/demo'
      },
      component: {
        path: 'src/components-registry/core/templates/react-templates/mega',
        props: {
          layout: 'grid',
          cart: 'sidebar',
          checkout: 'multi-step'
        },
        dependencies: ['react', 'tailwindcss', 'react-router-dom', 'zustand']
      },
      tags: ['template', 'ecommerce', 'store', 'products', 'cart', 'checkout'],
      readonly: true,
      featured: true,
      popularity: 92
    },
    {
      id: 'template-saas',
      name: 'SaaS Landing',
      description: 'SaaS product landing page with pricing, features, and testimonials',
      category: 'templates' as const,
      subcategory: 'landing',
      source: 'templates' as const,
      preview: {
        thumbnail: '/templates/saas/preview.jpg',
        demo: '/templates/saas/demo'
      },
      component: {
        path: 'src/components-registry/core/templates/react-templates/saas',
        props: {
          pricing: 'three-tier',
          features: 'grid',
          testimonials: 'carousel'
        },
        dependencies: ['react', 'tailwindcss', 'react-router-dom']
      },
      tags: ['template', 'saas', 'landing', 'pricing', 'features', 'testimonials'],
      readonly: true,
      featured: true,
      popularity: 85
    }
  ];
}

// 🔄 Автоматический запуск при импорте
if (typeof window !== 'undefined') {
  // Запускаем только в браузере
  populateRegistry().catch(console.error);
}

export default populateRegistry; 