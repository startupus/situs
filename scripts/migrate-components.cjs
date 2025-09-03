const fs = require('fs');
const path = require('path');

// Конфигурация миграции
const MIGRATION_CONFIG = {
  // Исходные файлы TailGrids компонентов
  sourcePaths: [
    'src/redactus-components/TailGridsPricingComponents.tsx',
    'src/redactus-components/TailGridsFAQComponents.tsx',
  ],

  // Целевая папка
  targetDir: 'src/redactus-components/interactive',
};

// Функция для создания улучшенного компонента
const enhanceComponent = (originalCode, componentName, category) => {
  let enhanced = originalCode;

  // Удаляем интернационализацию и заменяем на contentEditable
  enhanced = enhanced
    // Заменяем t('...') на прямой текст с contentEditable
    .replace(/\{t\([^}]+\)\}/g, (match) => {
      const defaultTexts = {
        'pricing.title': 'Flexible Pricing Plans',
        'pricing.subtitle': 'Choose the plan that fits your needs',
        'faq.title': 'Frequently Asked Questions',
        'faq.subtitle': 'Get answers to common questions',
      };
      return `"${defaultTexts['pricing.title'] || 'Default Text'}"`;
    })

    // Добавляем contentEditable к текстовым элементам
    .replace(/<h([1-6])([^>]*?)>([^<{]+)</g, '<h$1$2 contentEditable suppressContentEditableWarning={true}>$3<')
    .replace(/<p([^>]*?)>([^<{]+)</g, '<p$1 contentEditable suppressContentEditableWarning={true}>$2<')
    .replace(/<span([^>]*?)>([^<{]+)</g, '<span$1 contentEditable suppressContentEditableWarning={true}>$2<')

    // Заменяем CDN ссылки
    .replace(/https:\/\/cdn\.(tailgrids|redactus)\.com[^"']*/g, '/images')
    .replace(/https:\/\/i\.ibb\.co[^"']*/g, '/images')

    // Добавляем useState если есть интерактивность
    .replace(/^export const/, "import React, { useState } from 'react';\n\nexport const")

    // Добавляем TypeScript interface
    .replace(/export const (\w+) = \(\{([^}]*)\}\) =>/, (match, name, props) => {
      const interfaceName = `${name}Props`;
      const propsInterface = generatePropsInterface(name, category);

      return `${propsInterface}\n\nconst ${name}: React.FC<${interfaceName}> = ({${props}}) =>`;
    });

  return enhanced;
};

// Генерация TypeScript интерфейса
const generatePropsInterface = (componentName, category) => {
  const baseProps = {
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
  };

  return baseProps[category] || `export interface ${componentName}Props {}`;
};

// Главная функция миграции
async function migrateComponents() {
  console.log('🚀 Начинаю быструю миграцию TailGrids компонентов...');

  // Создаем целевую папку
  if (!fs.existsSync(MIGRATION_CONFIG.targetDir)) {
    fs.mkdirSync(MIGRATION_CONFIG.targetDir, { recursive: true });
  }

  let totalMigrated = 0;
  const migratedComponents = [];

  // Простая быстрая миграция - копируем готовые компоненты из marketing папки
  const existingComponents = [
    { source: 'src/redactus-components/marketing/Pricing1.tsx', target: 'Pricing1.tsx', category: 'pricing' },
    { source: 'src/redactus-components/marketing/Pricing2.tsx', target: 'Pricing2.tsx', category: 'pricing' },
    { source: 'src/redactus-components/marketing/Pricing3.tsx', target: 'Pricing3.tsx', category: 'pricing' },
    { source: 'src/redactus-components/marketing/Faq1.tsx', target: 'FAQ1.tsx', category: 'faq' },
    { source: 'src/redactus-components/marketing/Faq2.tsx', target: 'FAQ2.tsx', category: 'faq' },
    { source: 'src/redactus-components/marketing/Faq3.tsx', target: 'FAQ3.tsx', category: 'faq' },
  ];

  for (const comp of existingComponents) {
    if (fs.existsSync(comp.source)) {
      const content = fs.readFileSync(comp.source, 'utf8');
      const enhanced = enhanceExistingComponent(content, path.basename(comp.target, '.tsx'), comp.category);

      const targetPath = path.join(MIGRATION_CONFIG.targetDir, comp.target);
      fs.writeFileSync(targetPath, enhanced);

      console.log(`✅ Мигрирован: ${comp.target}`);
      migratedComponents.push(path.basename(comp.target, '.tsx'));
      totalMigrated++;
    }
  }

  // Создаем index.ts
  createIndexFile(migratedComponents);

  console.log(`🎉 Быстрая миграция завершена! Создано ${totalMigrated} компонентов`);
  console.log('📦 Созданы компоненты:', migratedComponents.join(', '));
}

// Улучшение существующих компонентов
const enhanceExistingComponent = (content, componentName, category) => {
  let enhanced = content;

  // Добавляем React import если отсутствует
  if (!enhanced.includes('import React')) {
    enhanced = `import React, { useState } from 'react';\n\n${enhanced}`;
  }

  // Добавляем TypeScript интерфейс если отсутствует
  if (!enhanced.includes('interface') && !enhanced.includes('Props')) {
    const propsInterface = generatePropsInterface(componentName, category);
    enhanced = enhanced.replace(
      'import React',
      `import React, { useState } from 'react';\n\n${propsInterface}\n\n// Original component enhanced for Redactus\nconst ${componentName}: React.FC<${componentName}Props> = () =>`,
    );
  }

  // Добавляем contentEditable где нужно
  enhanced = enhanced
    .replace(/<h([1-6])([^>]*?)>([^<{]+)</g, '<h$1$2 contentEditable suppressContentEditableWarning={true}>$3<')
    .replace(/<p([^>]*?)>([^<{]+)</g, '<p$1 contentEditable suppressContentEditableWarning={true}>$2<')
    .replace(/>\s*([^<{][^<]*?)\s*</g, (match, text) => {
      if (text.trim() && !text.includes('{') && !text.includes('svg') && text.length > 3) {
        return `><span contentEditable suppressContentEditableWarning={true}>${text.trim()}</span><`;
      }
      return match;
    });

  return enhanced;
};

// Создание index.ts файла
function createIndexFile(components) {
  const pricingExports = components
    .filter((c) => c.startsWith('Pricing'))
    .map((c) => `export { default as ${c} } from './${c}';`)
    .join('\n');

  const faqExports = components
    .filter((c) => c.startsWith('FAQ'))
    .map((c) => `export { default as ${c} } from './${c}';`)
    .join('\n');

  const typeExports = components.map((c) => `export type { ${c}Props } from './${c}';`).join('\n');

  const indexContent = `// Interactive Components (Pricing & FAQ)
// Auto-generated by migrate-components script

// Pricing Components
${pricingExports}

// FAQ Components  
${faqExports}

// Type exports
${typeExports}

// Total migrated components: ${components.length}
`;

  const indexPath = path.join(MIGRATION_CONFIG.targetDir, 'index.ts');
  fs.writeFileSync(indexPath, indexContent);
  console.log('📝 Создан index.ts файл');
}

// Запуск миграции
if (require.main === module) {
  migrateComponents().catch(console.error);
}

module.exports = { migrateComponents };
