const fs = require('fs');
const path = require('path');

console.log('🚀 Advanced TailGrids PRO Migration System');
console.log('📊 Migrating from real TailGrids React PRO components...\n');

// Пути к исходным TailGrids компонентам
const TAILGRIDS_SOURCE = 'src/components-registry/core/pro/tailgrids-react-pro/src/components';
const TARGET_BASE = 'src/redactus-components';

// Конфигурация категорий для миграции
const MIGRATION_CONFIG = {
  MarketingComponents: {
    targetDir: 'marketing',
    priority: ['About', 'Hero', 'CallToAction', 'Features', 'Team', 'Testimonials'],
    maxComponents: 5
  },
  CoreComponents: {
    targetDir: 'core',
    priority: ['Buttons', 'Cards', 'Forms', 'Navigation', 'Badges'],
    maxComponents: 3
  },
  EcommerceComponents: {
    targetDir: 'ecommerce', 
    priority: ['ProductGrid', 'Pricing', 'ShoppingCart', 'Checkout'],
    maxComponents: 4
  },
  DashboardComponents: {
    targetDir: 'dashboard',
    priority: ['Charts', 'Tables', 'DataStats', 'Analytics'],
    maxComponents: 3
  },
  ApplicationComponents: {
    targetDir: 'application',
    priority: ['Tables', 'Forms', 'Cards', 'Modals'],
    maxComponents: 3
  }
};

// Функция для улучшения компонента для Redactus
const enhanceForRedactus = (content, fileName, category) => {
  console.log(`   🔄 Enhancing ${fileName} for Redactus...`);
  
  let enhanced = content;
  
  // 1. Добавляем React import если отсутствует
  if (!enhanced.includes('import React')) {
    enhanced = `import React, { useState } from 'react';\n\n${enhanced}`;
  }
  
  // 2. Конвертируем JSX -> TSX
  enhanced = enhanced.replace(/\.jsx/g, '.tsx');
  
  // 3. Добавляем TypeScript интерфейс
  const componentName = path.basename(fileName, '.jsx');
  const propsInterface = generateInterface(componentName, category);
  
  if (!enhanced.includes('interface') && !enhanced.includes('Props')) {
    enhanced = enhanced.replace(
      /(import.*\n\n)/, 
      `$1${propsInterface}\n\n`
    );
  }
  
  // 4. Добавляем contentEditable к текстовым элементам
  enhanced = enhanced
    // Заголовки
    .replace(/<h([1-6])([^>]*?)>([^<{]+)<\/h\1>/g, 
      '<h$1$2 contentEditable suppressContentEditableWarning={true}>$3</h$1>')
    // Параграфы
    .replace(/<p([^>]*?)>([^<{]*?[^}])<\/p>/g, 
      '<p$1 contentEditable suppressContentEditableWarning={true}>$2</p>')
    // Спаны с текстом
    .replace(/<span([^>]*?)>([^<{]*?[^}])<\/span>/g, 
      '<span$1 contentEditable suppressContentEditableWarning={true}>$2</span>')
    // Кнопки с текстом
    .replace(/<button([^>]*?)>([^<{]*?[^}])<\/button>/g, 
      '<button$1><span contentEditable suppressContentEditableWarning={true}>$2</span></button>');
  
  // 5. Заменяем CDN ссылки на локальные
  enhanced = enhanced
    .replace(/https:\/\/cdn\.(tailgrids|redactus)\.com[^"']*/g, '/images')
    .replace(/https:\/\/i\.ibb\.co[^"']*/g, '/images')
    .replace(/https:\/\/images\.unsplash\.com[^"']*/g, '/images')
    .replace(/https:\/\/.*\.tailgrids\.com[^"']*/g, '/images');
  
  // 6. Убираем интернационализацию
  enhanced = enhanced
    .replace(/\{t\([^}]+\)\}/g, '"Text"')
    .replace(/import.*i18n.*\n/g, '')
    .replace(/const.*useTranslation.*\n/g, '');
  
  // 7. Ребрендинг TailGrids -> Redactus
  enhanced = enhanced
    .replace(/TailGrids/g, 'Redactus')
    .replace(/tailgrids/g, 'redactus')
    .replace(/Tailwind/g, 'Redactus')
    .replace(/ui\.tailgrids\.com/g, 'redactus.com');
  
  return enhanced;
};

// Генерация TypeScript интерфейсов
const generateInterface = (componentName, category) => {
  const baseInterface = `export interface ${componentName}Props {
  sectionTitle?: string;
  sectionSubtitle?: string;
  className?: string;
}`;

  const specificInterfaces = {
    About: `export interface ${componentName}Props {
  sectionTitle?: string;
  sectionSubtitle?: string;
  features?: FeatureItem[];
  stats?: StatItem[];
}

export interface FeatureItem {
  id: number;
  title: string;
  description: string;
  icon?: string;
}

export interface StatItem {
  id: number;
  value: string;
  label: string;
}`,

    Hero: `export interface ${componentName}Props {
  title?: string;
  subtitle?: string;
  description?: string;
  primaryButtonText?: string;
  secondaryButtonText?: string;
  backgroundImage?: string;
}`,

    Pricing: `export interface ${componentName}Props {
  sectionTitle?: string;
  sectionSubtitle?: string;
  pricingPlans?: PricingPlan[];
}

export interface PricingPlan {
  id: number;
  name: string;
  price: number;
  period: string;
  features: string[];
  isPopular?: boolean;
  buttonText?: string;
}`,

    Team: `export interface ${componentName}Props {
  sectionTitle?: string;
  sectionSubtitle?: string;
  teamMembers?: TeamMember[];
}

export interface TeamMember {
  id: number;
  name: string;
  position: string;
  bio?: string;
  image: string;
  socialLinks?: SocialLink[];
}

export interface SocialLink {
  platform: string;
  url: string;
}`
  };

  // Определяем тип компонента по имени
  const componentType = Object.keys(specificInterfaces).find(type => 
    componentName.toLowerCase().includes(type.toLowerCase())
  );

  return specificInterfaces[componentType] || baseInterface;
};

// Поиск компонентов в категории
const findComponentsInCategory = (categoryPath, priorities, maxComponents) => {
  const components = [];
  
  if (!fs.existsSync(categoryPath)) {
    console.log(`   ⚠️  Category not found: ${categoryPath}`);
    return components;
  }
  
  // Ищем по приоритетным папкам
  for (const priority of priorities) {
    const priorityPath = path.join(categoryPath, priority);
    if (fs.existsSync(priorityPath)) {
      const files = fs.readdirSync(priorityPath);
      const jsxFiles = files.filter(file => file.endsWith('.jsx'));
      
      for (const file of jsxFiles.slice(0, maxComponents)) {
        components.push({
          name: path.basename(file, '.jsx'),
          sourcePath: path.join(priorityPath, file),
          category: priority
        });
        
        if (components.length >= maxComponents) break;
      }
      
      if (components.length >= maxComponents) break;
    }
  }
  
  console.log(`   📦 Found ${components.length} components`);
  return components.slice(0, maxComponents);
};

// Главная функция миграции
async function advancedMigration() {
  console.log('📂 Scanning TailGrids PRO components...\n');
  
  let totalMigrated = 0;
  const migratedByCategory = {};
  
  // Создаем базовые папки
  Object.values(MIGRATION_CONFIG).forEach(config => {
    const targetDir = path.join(TARGET_BASE, config.targetDir);
    if (!fs.existsSync(targetDir)) {
      fs.mkdirSync(targetDir, { recursive: true });
    }
  });
  
  // Обрабатываем каждую категорию
  for (const [categoryName, config] of Object.entries(MIGRATION_CONFIG)) {
    console.log(`🎯 Processing ${categoryName}...`);
    
    const categoryPath = path.join(TAILGRIDS_SOURCE, categoryName);
    const components = findComponentsInCategory(
      categoryPath, 
      config.priority, 
      config.maxComponents
    );
    
    migratedByCategory[config.targetDir] = [];
    
    for (const component of components) {
      try {
        console.log(`   🔄 Migrating ${component.name}...`);
        
        const sourceContent = fs.readFileSync(component.sourcePath, 'utf8');
        const enhanced = enhanceForRedactus(sourceContent, component.name, component.category);
        
        const targetPath = path.join(TARGET_BASE, config.targetDir, `${component.name}.tsx`);
        fs.writeFileSync(targetPath, enhanced);
        
        console.log(`   ✅ Migrated: ${component.name}.tsx`);
        migratedByCategory[config.targetDir].push(component.name);
        totalMigrated++;
        
      } catch (error) {
        console.log(`   ❌ Error migrating ${component.name}: ${error.message}`);
      }
    }
    
    console.log('');
  }
  
  // Создаем index.ts файлы
  console.log('📝 Creating index files...');
  createIndexFiles(migratedByCategory);
  
  // Итоговый отчет
  console.log('\n🎉 Advanced Migration Complete!');
  console.log(`📊 Total migrated: ${totalMigrated} components`);
  console.log('\n📋 Breakdown by category:');
  
  Object.entries(migratedByCategory).forEach(([category, components]) => {
    if (components.length > 0) {
      console.log(`   ${category}: ${components.length} components`);
      components.forEach(comp => console.log(`     - ${comp}`));
    }
  });
  
  console.log('\n🚀 Ready for integration with Redactus Editor!');
}

// Создание index.ts файлов
const createIndexFiles = (migratedByCategory) => {
  Object.entries(migratedByCategory).forEach(([category, components]) => {
    if (components.length === 0) return;
    
    const indexPath = path.join(TARGET_BASE, category, 'index.ts');
    
    const exports = components.map(comp => 
      `export { default as ${comp} } from './${comp}';`
    ).join('\n');
    
    const typeExports = components.map(comp => 
      `export type { ${comp}Props } from './${comp}';`
    ).join('\n');
    
    const content = `// ${category.charAt(0).toUpperCase() + category.slice(1)} Components\n// Auto-migrated from TailGrids PRO\n\n${exports}\n\n// Type exports\n${typeExports}\n`;
    
    fs.writeFileSync(indexPath, content);
    console.log(`   📝 Created ${indexPath}`);
  });
};

// Запуск
if (require.main === module) {
  advancedMigration().catch(console.error);
}

module.exports = { advancedMigration }; 