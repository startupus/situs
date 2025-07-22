#!/usr/bin/env tsx

import path from 'path';
import fs from 'fs';
import { scanAndAdaptComponents, TailGridsComponent } from '../src/utils/componentScanner';
import { ComponentLibraryItem } from '../src/types/editor';

/**
 * Скрипт для сканирования TailGrids компонентов
 * и их адаптации для редактора Редактус
 */

const TAILGRIDS_PATH = path.join(process.cwd(), 'Upload', 'tailgrids-react-pro-main');
const OUTPUT_DIR = path.join(process.cwd(), 'src', 'components', 'adapted');
const COMPONENTS_JSON = path.join(process.cwd(), 'src', 'data', 'adaptedComponents.json');

interface AdaptedComponentFile {
  id: string;
  name: string;
  category: string;
  subcategory: string;
  originalPath: string;
  adaptedPath: string;
  content: string;
  metadata: ComponentLibraryItem;
}

/**
 * Основная функция сканирования
 */
async function main() {
  console.log('🔍 Начинаем сканирование TailGrids компонентов...');
  console.log(`📂 Путь к TailGrids: ${TAILGRIDS_PATH}`);

  try {
    // Проверяем существование директории
    if (!fs.existsSync(TAILGRIDS_PATH)) {
      throw new Error(`Директория TailGrids не найдена: ${TAILGRIDS_PATH}`);
    }

    // Создаем выходные директории
    ensureDirectories();

    // Сканируем и адаптируем компоненты
    console.log('⚡ Сканируем компоненты...');
    const { adapted, scanResult } = await scanAndAdaptComponents(TAILGRIDS_PATH);

    console.log(`✅ Найдено ${scanResult.totalComponents} компонентов в ${scanResult.categories.length} категориях`);
    
    // Выводим статистику по категориям
    console.log('\n📊 Статистика по категориям:');
    scanResult.categories.forEach(category => {
      console.log(`  ${category.name}: ${category.count} компонентов в подкатегориях: ${category.subcategories.join(', ')}`);
    });

    // Обрабатываем и сохраняем адаптированные компоненты
    console.log('\n🔄 Адаптируем компоненты для редактора...');
    const adaptedFiles = await processAndSaveComponents(scanResult.components, adapted);

    // Сохраняем JSON с метаданными
    await saveComponentsJSON(adaptedFiles);

    // Генерируем индексный файл
    await generateIndexFile(adaptedFiles);

    console.log(`\n🎉 Успешно адаптировано ${adaptedFiles.length} компонентов!`);
    console.log(`📁 Компоненты сохранены в: ${OUTPUT_DIR}`);
    console.log(`📄 Метаданные сохранены в: ${COMPONENTS_JSON}`);

  } catch (error) {
    console.error('❌ Ошибка при сканировании компонентов:', error);
    process.exit(1);
  }
}

/**
 * Создать необходимые директории
 */
function ensureDirectories() {
  const dirs = [
    OUTPUT_DIR,
    path.dirname(COMPONENTS_JSON),
    path.join(OUTPUT_DIR, 'marketing'),
    path.join(OUTPUT_DIR, 'core'),
    path.join(OUTPUT_DIR, 'dashboard'),
    path.join(OUTPUT_DIR, 'ecommerce'),
    path.join(OUTPUT_DIR, 'ai'),
    path.join(OUTPUT_DIR, 'application')
  ];

  dirs.forEach(dir => {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
  });
}

/**
 * Обработать и сохранить адаптированные компоненты
 */
async function processAndSaveComponents(
  originalComponents: TailGridsComponent[],
  adaptedMetadata: ComponentLibraryItem[]
): Promise<AdaptedComponentFile[]> {
  const adaptedFiles: AdaptedComponentFile[] = [];

  for (let i = 0; i < originalComponents.length; i++) {
    const original = originalComponents[i];
    const metadata = adaptedMetadata[i];

    try {
      // Адаптируем содержимое компонента
      const adaptedContent = adaptComponentContent(original);

      // Определяем путь для сохранения
      const categoryDir = getCategoryDirectory(original.category);
      const fileName = `${original.name}.tsx`;
      const adaptedPath = path.join(OUTPUT_DIR, categoryDir, original.subcategory.toLowerCase(), fileName);

      // Создаем директорию если не существует
      const dir = path.dirname(adaptedPath);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }

      // Сохраняем адаптированный компонент
      fs.writeFileSync(adaptedPath, adaptedContent, 'utf-8');

      const adaptedFile: AdaptedComponentFile = {
        id: metadata.id,
        name: metadata.name,
        category: original.category,
        subcategory: original.subcategory,
        originalPath: original.filePath,
        adaptedPath,
        content: adaptedContent,
        metadata
      };

      adaptedFiles.push(adaptedFile);

      console.log(`  ✓ ${original.category}/${original.subcategory}/${original.name}`);

    } catch (error) {
      console.warn(`  ⚠️  Пропущен компонент ${original.name}: ${error}`);
    }
  }

  return adaptedFiles;
}

/**
 * Адаптировать содержимое компонента для редактора Редактус
 */
function adaptComponentContent(component: TailGridsComponent): string {
  let content = component.content;

  // Заменяем JSX на TSX
  content = content.replace(/\.jsx/g, '.tsx');

  // Добавляем типы TypeScript
  content = addTypeScriptTypes(content, component);

  // Адаптируем для редактора
  content = adaptForEditor(content, component);

  // Добавляем комментарии и метаданные
  content = addMetadataComments(content, component);

  return content;
}

/**
 * Добавить типы TypeScript
 */
function addTypeScriptTypes(content: string, component: TailGridsComponent): string {
  // Заменяем import React на импорт с типами
  content = content.replace(
    /import React.*?from ["']react["'];?/,
    "import React from 'react';"
  );

  // Добавляем интерфейс для пропсов если есть пропсы
  if (component.props.length > 0) {
    const propsInterface = generatePropsInterface(component);
    content = content.replace(
      /(import.*?from.*?;[\s\S]*?)(\n\nconst|\nexport const)/,
      `$1\n\n${propsInterface}$2`
    );

    // Типизируем основной компонент
    const componentName = component.name;
    const propsTypeName = `${componentName}Props`;
    
    content = content.replace(
      new RegExp(`const ${componentName} = \\(([^)]*?)\\)`),
      `const ${componentName}: React.FC<${propsTypeName}> = ($1)`
    );
  }

  return content;
}

/**
 * Генерировать интерфейс для пропсов
 */
function generatePropsInterface(component: TailGridsComponent): string {
  if (component.props.length === 0) return '';

  const propsTypeName = `${component.name}Props`;
  const props = component.props.map(prop => {
    const optional = prop.required ? '' : '?';
    const type = mapPropType(prop.type);
    return `  ${prop.name}${optional}: ${type};`;
  }).join('\n');

  return `interface ${propsTypeName} {\n${props}\n}`;
}

/**
 * Маппинг типов пропсов
 */
function mapPropType(type: string): string {
  switch (type) {
    case 'string': return 'string';
    case 'number': return 'number';
    case 'boolean': return 'boolean';
    case 'array': return 'any[]';
    case 'object': return 'Record<string, any>';
    case 'function': return '() => void';
    default: return 'any';
  }
}

/**
 * Адаптировать для редактора
 */
function adaptForEditor(content: string, component: TailGridsComponent): string {
  // Добавляем обёртку для редактируемости
  content = content.replace(
    /(const \w+ = .*?\{[\s\S]*?return \()/,
    `$1\n    <div className="redaktus-component" data-component-type="${component.name.toLowerCase()}">`
  );

  content = content.replace(
    /([\s\S]*)(;\s*};?\s*export)/,
    `$1\n    </div>$2`
  );

  // Делаем ссылки и изображения редактируемыми
  content = makeLinksEditable(content);
  content = makeImagesEditable(content);
  content = makeTextEditable(content);

  return content;
}

/**
 * Сделать ссылки редактируемыми
 */
function makeLinksEditable(content: string): string {
  return content.replace(
    /href=["']([^"']*)["']/g,
    'href={props.href || "$1"}'
  );
}

/**
 * Сделать изображения редактируемыми
 */
function makeImagesEditable(content: string): string {
  return content.replace(
    /src=["']([^"']*)["']/g,
    'src={props.imageSrc || "$1"}'
  ).replace(
    /alt=["']([^"']*)["']/g,
    'alt={props.imageAlt || "$1"}'
  );
}

/**
 * Сделать текст редактируемым
 */
function makeTextEditable(content: string): string {
  // Заменяем статичный текст на пропсы (упрощённая версия)
  content = content.replace(
    />(.*?Kickstart.*?)<\/h1>/g,
    '>{props.title || "$1"}</h1>'
  );
  
  content = content.replace(
    />(.*?TailGrids.*?business.*?)<\/p>/g,
    '>{props.description || "$1"}</p>'
  );

  return content;
}

/**
 * Добавить комментарии с метаданными
 */
function addMetadataComments(content: string, component: TailGridsComponent): string {
  const header = `/**
 * ${component.name} - ${component.subcategory} компонент
 * 
 * Адаптировано из TailGrids Pro для редактора Редактус
 * Категория: ${component.category}
 * Подкатегория: ${component.subcategory}
 * 
 * @component
 * @example
 * <${component.name} 
 *   ${component.props.map(p => `${p.name}="${p.defaultValue || 'value'}"`).join('\n *   ')}
 * />
 */\n\n`;

  return header + content;
}

/**
 * Получить директорию для категории
 */
function getCategoryDirectory(category: string): string {
  const mapping: Record<string, string> = {
    'MarketingComponents': 'marketing',
    'CoreComponents': 'core',
    'DashboardComponents': 'dashboard',
    'EcommerceComponents': 'ecommerce',
    'AiComponents': 'ai',
    'ApplicationComponents': 'application'
  };

  return mapping[category] || 'other';
}

/**
 * Сохранить JSON с метаданными компонентов
 */
async function saveComponentsJSON(adaptedFiles: AdaptedComponentFile[]): Promise<void> {
  const componentsData = {
    version: '1.0.0',
    generatedAt: new Date().toISOString(),
    totalComponents: adaptedFiles.length,
    categories: getCategories(adaptedFiles),
    components: adaptedFiles.map(file => ({
      id: file.id,
      name: file.name,
      category: file.category,
      subcategory: file.subcategory,
      path: file.adaptedPath,
      metadata: file.metadata
    }))
  };

  fs.writeFileSync(COMPONENTS_JSON, JSON.stringify(componentsData, null, 2), 'utf-8');
}

/**
 * Получить категории из адаптированных файлов
 */
function getCategories(adaptedFiles: AdaptedComponentFile[]) {
  const categoryMap = new Map<string, Set<string>>();

  adaptedFiles.forEach(file => {
    if (!categoryMap.has(file.category)) {
      categoryMap.set(file.category, new Set());
    }
    categoryMap.get(file.category)!.add(file.subcategory);
  });

  return Array.from(categoryMap.entries()).map(([category, subcategories]) => ({
    name: category,
    subcategories: Array.from(subcategories),
    count: adaptedFiles.filter(f => f.category === category).length
  }));
}

/**
 * Генерировать индексный файл для экспорта всех компонентов
 */
async function generateIndexFile(adaptedFiles: AdaptedComponentFile[]): Promise<void> {
  const indexPath = path.join(OUTPUT_DIR, 'index.ts');
  
  const exports = adaptedFiles.map(file => {
    const relativePath = path.relative(OUTPUT_DIR, file.adaptedPath).replace(/\.tsx$/, '');
    const exportName = file.metadata.name.replace(/\s+/g, '');
    return `export { default as ${exportName} } from './${relativePath}';`;
  });

  const indexContent = `/**
 * Индексный файл для всех адаптированных TailGrids компонентов
 * Автоматически сгенерирован скриптом scanComponents.ts
 * 
 * Всего компонентов: ${adaptedFiles.length}
 * Дата генерации: ${new Date().toISOString()}
 */

${exports.join('\n')}

// Экспорт метаданных
export { default as componentsMetadata } from '../data/adaptedComponents.json';
`;

  fs.writeFileSync(indexPath, indexContent, 'utf-8');
}

// Запуск скрипта
if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch(console.error);
}