const fs = require('fs');
const path = require('path');

// Конфигурация для массовой миграции
const BULK_MIGRATION_CONFIG = {
  // Исходные папки с TailGrids компонентами
  sourceDirs: [
    '../../../services/codus-service/scripts/tailgrids-react-pro-main/src',
    '../../../services/codus-service/scripts/tailgrids-pro-components-main/marketing',
    '../../../services/codus-service/scripts/react-templates-main'
  ],
  
  // Целевые папки по категориям
  targetDirs: {
    pricing: 'src/redactus-components/interactive',
    faq: 'src/redactus-components/interactive', 
    portfolio: 'src/redactus-components/content',
    testimonials: 'src/redactus-components/content',
    marketing: 'src/redactus-components/marketing',
    business: 'src/redactus-components/business'
  }
};

// Функция для улучшения компонента для Redactus
const enhanceForRedactus = (content, componentName, category) => {
  let enhanced = content;
  
  // Добавляем React import если отсутствует
  if (!enhanced.includes('import React')) {
    enhanced = `import React, { useState } from 'react';\n\n${enhanced}`;
  }
  
  // Добавляем TypeScript интерфейс
  const propsInterface = generateInterface(componentName, category);
  if (!enhanced.includes('interface') && !enhanced.includes('Props')) {
    enhanced = enhanced.replace(
      /(import.*\n\n)/, 
      `$1${propsInterface}\n\n`
    );
  }
  
  // Добавляем contentEditable к текстовым элементам
  enhanced = enhanced
    .replace(/<h([1-6])([^>]*?)>([^<{]+)<\/h\1>/g, 
      '<h$1$2 contentEditable suppressContentEditableWarning={true}>$3</h$1>')
    .replace(/<p([^>]*?)>([^<{]*?[^}])<\/p>/g, 
      '<p$1 contentEditable suppressContentEditableWarning={true}>$2</p>')
    .replace(/<span([^>]*?)>([^<{]*?[^}])<\/span>/g, 
      '<span$1 contentEditable suppressContentEditableWarning={true}>$2</span>')
    
    // Заменяем CDN ссылки на локальные
    .replace(/https:\/\/cdn\.(tailgrids|redactus)\.com[^"']*/g, '/images')
    .replace(/https:\/\/i\.ibb\.co[^"']*/g, '/images')
    .replace(/https:\/\/images\.unsplash\.com[^"']*/g, '/images')
    
    // Убираем интернационализацию если есть
    .replace(/\{t\([^}]+\)\}/g, '"Default Text"')
    .replace(/import.*i18n.*\n/g, '')
    .replace(/const.*useTranslation.*\n/g, '');
  
  return enhanced;
};

// Генерация TypeScript интерфейсов
const generateInterface = (componentName, category) => {
  const interfaces = {
    pricing: `export interface ${componentName}Props {
  sectionTitle?: string;
  sectionSubtitle?: string;
  pricingPlans?: PricingPlan[];
}

export interface PricingPlan {
  id: number;
  name: string;
  price: number;
  features: string[];
  isPopular?: boolean;
  buttonText?: string;
}`,
    
    faq: `export interface ${componentName}Props {
  sectionTitle?: string;
  sectionSubtitle?: string;
  faqItems?: FAQItem[];
}

export interface FAQItem {
  id: number;
  question: string;
  answer: string;
}`,

    portfolio: `export interface ${componentName}Props {
  sectionTitle?: string;
  sectionSubtitle?: string;
  portfolioItems?: PortfolioItem[];
}

export interface PortfolioItem {
  id: number;
  title: string;
  category: string;
  description: string;
  image: string;
  link?: string;
}`,

    testimonials: `export interface ${componentName}Props {
  sectionTitle?: string;
  sectionSubtitle?: string;
  testimonials?: TestimonialItem[];
}

export interface TestimonialItem {
  id: number;
  name: string;
  position: string;
  company: string;
  content: string;
  avatar: string;
  rating?: number;
}`
  };
  
  return interfaces[category] || `export interface ${componentName}Props {}`;
};

// Определение категории по имени файла
const determineCategory = (filename) => {
  const lower = filename.toLowerCase();
  if (lower.includes('pricing')) return 'pricing';
  if (lower.includes('faq')) return 'faq';
  if (lower.includes('portfolio')) return 'portfolio';
  if (lower.includes('testimonial')) return 'testimonials';
  if (lower.includes('hero') || lower.includes('cta') || lower.includes('feature')) return 'marketing';
  if (lower.includes('about') || lower.includes('team') || lower.includes('service')) return 'business';
  return 'marketing'; // по умолчанию
};

// Рекурсивный поиск файлов
const findTsxFiles = (dir, maxDepth = 3, currentDepth = 0) => {
  const files = [];
  
  if (currentDepth >= maxDepth || !fs.existsSync(dir)) {
    return files;
  }
  
  try {
    const items = fs.readdirSync(dir);
    
    for (const item of items) {
      const fullPath = path.join(dir, item);
      const stat = fs.statSync(fullPath);
      
      if (stat.isDirectory() && !item.startsWith('.') && !item.includes('node_modules')) {
        files.push(...findTsxFiles(fullPath, maxDepth, currentDepth + 1));
      } else if (item.endsWith('.tsx') && !item.includes('.test.') && !item.includes('.spec.')) {
        files.push(fullPath);
      }
    }
  } catch (error) {
    console.log(`⚠️  Не удалось прочитать директорию: ${dir}`);
  }
  
  return files;
};

// Главная функция массовой миграции
async function bulkMigrate() {
  console.log('🚀 Начинаю массовую миграцию TailGrids PRO компонентов...');
  
  // Создаем целевые папки
  Object.values(BULK_MIGRATION_CONFIG.targetDirs).forEach(dir => {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
  });
  
  let totalMigrated = 0;
  const migratedByCategory = {
    pricing: [],
    faq: [],
    portfolio: [],
    testimonials: [],
    marketing: [],
    business: []
  };
  
  // Обрабатываем каждую исходную папку
  for (const sourceDir of BULK_MIGRATION_CONFIG.sourceDirs) {
    if (!fs.existsSync(sourceDir)) {
      console.log(`⚠️  Папка не найдена: ${sourceDir}`);
      continue;
    }
    
    console.log(`📂 Обрабатываю: ${sourceDir}`);
    const tsxFiles = findTsxFiles(sourceDir);
    console.log(`   Найдено ${tsxFiles.length} TSX файлов`);
    
    for (const filePath of tsxFiles) {
      const filename = path.basename(filePath, '.tsx');
      const category = determineCategory(filename);
      const targetDir = BULK_MIGRATION_CONFIG.targetDirs[category];
      
      try {
        const content = fs.readFileSync(filePath, 'utf8');
        
        // Пропускаем файлы без экспорта компонентов
        if (!content.includes('export') || content.length < 100) {
          continue;
        }
        
        const enhanced = enhanceForRedactus(content, filename, category);
        const targetPath = path.join(targetDir, `${filename}.tsx`);
        
        // Проверяем, не существует ли уже такой файл
        if (fs.existsSync(targetPath)) {
          console.log(`   ⏭️  Пропущен (уже существует): ${filename}.tsx`);
          continue;
        }
        
        fs.writeFileSync(targetPath, enhanced);
        
        console.log(`   ✅ ${category}: ${filename}.tsx`);
        migratedByCategory[category].push(filename);
        totalMigrated++;
        
      } catch (error) {
        console.log(`   ❌ Ошибка при обработке ${filename}: ${error.message}`);
      }
    }
  }
  
  // Создаем/обновляем index.ts файлы
  updateIndexFiles(migratedByCategory);
  
  console.log('\n🎉 Массовая миграция завершена!');
  console.log(`📊 Всего мигрировано: ${totalMigrated} компонентов`);
  Object.entries(migratedByCategory).forEach(([category, components]) => {
    if (components.length > 0) {
      console.log(`   ${category}: ${components.length} компонентов`);
    }
  });
}

// Обновление index.ts файлов
const updateIndexFiles = (migratedByCategory) => {
  Object.entries(BULK_MIGRATION_CONFIG.targetDirs).forEach(([category, dir]) => {
    const components = migratedByCategory[category];
    if (components.length === 0) return;
    
    const indexPath = path.join(dir, 'index.ts');
    let existingContent = '';
    
    if (fs.existsSync(indexPath)) {
      existingContent = fs.readFileSync(indexPath, 'utf8');
    }
    
    // Добавляем новые экспорты
    const newExports = components.map(comp => 
      `export { default as ${comp} } from './${comp}';`
    ).join('\n');
    
    const newTypeExports = components.map(comp => 
      `export type { ${comp}Props } from './${comp}';`
    ).join('\n');
    
    const updatedContent = `${existingContent}\n\n// Auto-migrated components\n${newExports}\n\n// Type exports\n${newTypeExports}\n`;
    
    fs.writeFileSync(indexPath, updatedContent);
    console.log(`📝 Обновлен ${indexPath} (+${components.length} компонентов)`);
  });
};

// Запуск миграции
if (require.main === module) {
  bulkMigrate().catch(console.error);
}

module.exports = { bulkMigrate }; 