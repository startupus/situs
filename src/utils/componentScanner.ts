import fs from 'fs';
import path from 'path';
import { ComponentLibraryItem } from '../types/editor';

/**
 * Утилита для сканирования готовых TailGrids компонентов
 * и их адаптации для редактора Редактус
 */

export interface TailGridsComponent {
  name: string;
  category: string;
  subcategory: string;
  filePath: string;
  content: string;
  dependencies: string[];
  props: Array<{
    name: string;
    type: string;
    defaultValue?: any;
    required?: boolean;
  }>;
}

export interface ScanResult {
  components: TailGridsComponent[];
  categories: Array<{
    name: string;
    subcategories: string[];
    count: number;
  }>;
  totalComponents: number;
}

/**
 * Сканировать директорию с TailGrids компонентами
 */
export async function scanTailGridsComponents(baseDir: string): Promise<ScanResult> {
  const components: TailGridsComponent[] = [];
  const categories: Map<string, Set<string>> = new Map();

  try {
    // Основные категории компонентов
    const componentDirs = [
      'MarketingComponents',
      'CoreComponents',
      'DashboardComponents',
      'EcommerceComponents',
      'AiComponents',
      'ApplicationComponents'
    ];

    for (const categoryDir of componentDirs) {
      const categoryPath = path.join(baseDir, 'src', 'components', categoryDir);
      
      if (fs.existsSync(categoryPath)) {
        await scanCategory(categoryPath, categoryDir, components, categories);
      }
    }

    // Преобразуем категории в нужный формат
    const categoriesArray = Array.from(categories.entries()).map(([name, subcategories]) => ({
      name,
      subcategories: Array.from(subcategories),
      count: components.filter(c => c.category === name).length
    }));

    return {
      components,
      categories: categoriesArray,
      totalComponents: components.length
    };
  } catch (error) {
    console.error('Error scanning TailGrids components:', error);
    return {
      components: [],
      categories: [],
      totalComponents: 0
    };
  }
}

/**
 * Сканировать категорию компонентов
 */
async function scanCategory(
  categoryPath: string,
  categoryName: string,
  components: TailGridsComponent[],
  categories: Map<string, Set<string>>
): Promise<void> {
  const subcategories = fs.readdirSync(categoryPath, { withFileTypes: true })
    .filter(dirent => dirent.isDirectory())
    .map(dirent => dirent.name);

  if (!categories.has(categoryName)) {
    categories.set(categoryName, new Set());
  }

  for (const subcategory of subcategories) {
    const subcategoryPath = path.join(categoryPath, subcategory);
    categories.get(categoryName)!.add(subcategory);

    // Сканируем файлы в подкategории
    const files = fs.readdirSync(subcategoryPath)
      .filter(file => file.endsWith('.jsx') || file.endsWith('.tsx'));

    for (const file of files) {
      const filePath = path.join(subcategoryPath, file);
      const componentData = await analyzeComponent(filePath, categoryName, subcategory);
      
      if (componentData) {
        components.push(componentData);
      }
    }
  }
}

/**
 * Анализировать компонент и извлечь метаданные
 */
async function analyzeComponent(
  filePath: string,
  category: string,
  subcategory: string
): Promise<TailGridsComponent | null> {
  try {
    const content = fs.readFileSync(filePath, 'utf-8');
    const fileName = path.basename(filePath, path.extname(filePath));

    // Извлекаем зависимости (импорты React и других библиотек)
    const dependencies = extractDependencies(content);

    // Извлекаем пропсы основного компонента
    const props = extractProps(content);

    return {
      name: fileName,
      category,
      subcategory,
      filePath,
      content,
      dependencies,
      props
    };
  } catch (error) {
    console.error(`Error analyzing component ${filePath}:`, error);
    return null;
  }
}

/**
 * Извлечь зависимости из импортов
 */
function extractDependencies(content: string): string[] {
  const dependencies: string[] = [];
  const importRegex = /import\s+.*?\s+from\s+['"](.*?)['"];?/g;
  
  let match;
  while ((match = importRegex.exec(content)) !== null) {
    const dependency = match[1];
    if (!dependency.startsWith('.') && !dependency.startsWith('/')) {
      dependencies.push(dependency);
    }
  }

  return [...new Set(dependencies)]; // Убираем дубликаты
}

/**
 * Извлечь пропсы из компонента (базовый анализ)
 */
function extractProps(content: string): Array<{
  name: string;
  type: string;
  defaultValue?: any;
  required?: boolean;
}> {
  const props: Array<{
    name: string;
    type: string;
    defaultValue?: any;
    required?: boolean;
  }> = [];

  // Ищем деструктуризацию пропсов в функциональных компонентах
  const destructureRegex = /const\s+\w+\s*=\s*\(\s*\{\s*([^}]*)\s*\}/;
  const match = content.match(destructureRegex);

  if (match) {
    const propsString = match[1];
    const propItems = propsString.split(',').map(p => p.trim());

    for (const propItem of propItems) {
      const cleanProp = propItem.replace(/\s*=\s*.*$/, '').trim(); // Убираем значения по умолчанию
      if (cleanProp && !cleanProp.includes('...')) { // Игнорируем rest параметры
        props.push({
          name: cleanProp,
          type: 'string', // По умолчанию string, можно улучшить анализ
          required: !propItem.includes('=') // Если есть значение по умолчанию, то не обязательный
        });
      }
    }
  }

  return props;
}

/**
 * Адаптировать TailGrids компонент для редактора Редактус
 */
export function adaptComponentForEditor(component: TailGridsComponent): ComponentLibraryItem {
  const componentId = `${component.category.toLowerCase()}_${component.subcategory.toLowerCase()}_${component.name.toLowerCase()}`;
  
  // Генерируем preview изображение (base64 заглушка)
  const preview = generatePreviewImage(component.name, component.subcategory);

  // Создаем дефолтные пропсы на основе анализа
  const defaultProps: Record<string, any> = {};
  component.props.forEach(prop => {
    switch (prop.type) {
      case 'string':
        defaultProps[prop.name] = prop.defaultValue || `Default ${prop.name}`;
        break;
      case 'number':
        defaultProps[prop.name] = prop.defaultValue || 0;
        break;
      case 'boolean':
        defaultProps[prop.name] = prop.defaultValue || false;
        break;
      default:
        defaultProps[prop.name] = prop.defaultValue || '';
    }
  });

  // Создаем схему пропсов для редактора
  const schema = {
    props: component.props.map(prop => ({
      name: prop.name,
      type: prop.type as 'string' | 'number' | 'boolean' | 'color' | 'image' | 'select',
      label: formatPropLabel(prop.name),
      defaultValue: prop.defaultValue,
      required: prop.required || false
    }))
  };

  // Генерируем теги для поиска
  const tags = [
    component.category.toLowerCase(),
    component.subcategory.toLowerCase(),
    component.name.toLowerCase(),
    ...component.props.map(p => p.name.toLowerCase())
  ];

  return {
    id: componentId,
    name: formatComponentName(component.name),
    type: componentId,
    category: component.subcategory.toLowerCase(),
    description: `${component.subcategory} компонент из ${component.category}`,
    preview,
    defaultProps,
    schema,
    tags,
    isCustom: false
  };
}

/**
 * Генерировать превью изображение для компонента
 */
function generatePreviewImage(name: string, subcategory: string): string {
  // Простая SVG заглушка
  const svg = `
    <svg width="200" height="120" xmlns="http://www.w3.org/2000/svg">
      <rect width="200" height="120" fill="#f3f4f6" stroke="#d1d5db" stroke-width="1"/>
      <text x="100" y="60" text-anchor="middle" font-family="Arial" font-size="12" fill="#374151">
        ${subcategory}
      </text>
      <text x="100" y="80" text-anchor="middle" font-family="Arial" font-size="10" fill="#6b7280">
        ${name}
      </text>
    </svg>
  `;
  
  return `data:image/svg+xml;base64,${Buffer.from(svg).toString('base64')}`;
}

/**
 * Форматировать название компонента для отображения
 */
function formatComponentName(name: string): string {
  return name
    .replace(/([A-Z])/g, ' $1') // Добавляем пробелы перед заглавными буквами
    .replace(/^\w/, c => c.toUpperCase()) // Делаем первую букву заглавной
    .trim();
}

/**
 * Форматировать название пропса для отображения
 */
function formatPropLabel(propName: string): string {
  return propName
    .replace(/([A-Z])/g, ' $1')
    .replace(/^\w/, c => c.toUpperCase())
    .trim();
}

/**
 * Сканировать и адаптировать все компоненты
 */
export async function scanAndAdaptComponents(baseDir: string): Promise<{
  adapted: ComponentLibraryItem[];
  scanResult: ScanResult;
}> {
  const scanResult = await scanTailGridsComponents(baseDir);
  const adapted = scanResult.components.map(component => adaptComponentForEditor(component));

  return {
    adapted,
    scanResult
  };
}

/**
 * Получить компоненты по категории
 */
export function getComponentsByCategory(
  components: ComponentLibraryItem[],
  category: string
): ComponentLibraryItem[] {
  return components.filter(component => 
    component.category.toLowerCase() === category.toLowerCase()
  );
}

/**
 * Поиск компонентов по тегам
 */
export function searchComponents(
  components: ComponentLibraryItem[],
  searchTerm: string
): ComponentLibraryItem[] {
  const term = searchTerm.toLowerCase();
  
  return components.filter(component =>
    component.name.toLowerCase().includes(term) ||
    component.description.toLowerCase().includes(term) ||
    component.tags.some(tag => tag.includes(term))
  );
}