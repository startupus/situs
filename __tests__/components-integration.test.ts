import { describe, test, expect } from 'vitest';

const API_BASE_URL = 'http://localhost:3001';

describe('Адаптированные TailGrids компоненты - интеграционный тест', () => {
  
  test('API сервер доступен', async () => {
    const response = await fetch(`${API_BASE_URL}/health`);
    expect(response.ok).toBe(true);
    
    const data = await response.json();
    expect(data.success).toBe(true);
    expect(data.data.service).toBe('Redaktus Editor API');
  });

  test('Статистика адаптированных компонентов', async () => {
    const response = await fetch(`${API_BASE_URL}/api/stats`);
    expect(response.ok).toBe(true);
    
    const data = await response.json();
    expect(data.success).toBe(true);
    expect(data.data.totalComponents).toBe(623);
    expect(data.data.adaptedComponents).toBe(true);
    expect(data.data.categories).toHaveLength(6);
    
    // Проверяем основные категории
    const categoryNames = data.data.categories.map((cat: any) => cat.name);
    expect(categoryNames).toContain('MarketingComponents');
    expect(categoryNames).toContain('CoreComponents');
    expect(categoryNames).toContain('DashboardComponents');
    expect(categoryNames).toContain('EcommerceComponents');
    expect(categoryNames).toContain('AiComponents');
    expect(categoryNames).toContain('ApplicationComponents');
  });

  test('Получение информации об адаптированных компонентах', async () => {
    const response = await fetch(`${API_BASE_URL}/api/components/adapted`);
    expect(response.ok).toBe(true);
    
    const data = await response.json();
    expect(data.success).toBe(true);
    expect(data.data.totalComponents).toBe(623);
    expect(data.data.categories).toHaveLength(6);
    
    // Проверяем количество компонентов по категориям
    const marketingCategory = data.data.categories.find((cat: any) => cat.name === 'MarketingComponents');
    expect(marketingCategory.count).toBe(107);
    
    const coreCategory = data.data.categories.find((cat: any) => cat.name === 'CoreComponents');
    expect(coreCategory.count).toBe(209);
  });

  test('Поиск Hero компонентов', async () => {
    const response = await fetch(`${API_BASE_URL}/api/components/search?q=hero`);
    expect(response.ok).toBe(true);
    
    const data = await response.json();
    expect(data.success).toBe(true);
    expect(data.data.query).toBe('hero');
    expect(data.data.count).toBeGreaterThan(20);
    expect(data.data.components).toHaveLength(20); // API возвращает максимум 20
    
    // Проверяем что найденные компоненты действительно содержат "hero"
    const firstComponent = data.data.components[0];
    expect(firstComponent.metadata.tags).toContain('hero');
  });

  test('Получение компонентов категории MarketingComponents', async () => {
    const response = await fetch(`${API_BASE_URL}/api/components/category/MarketingComponents`);
    expect(response.ok).toBe(true);
    
    const data = await response.json();
    expect(data.success).toBe(true);
    expect(data.data.category).toBe('MarketingComponents');
    expect(data.data.count).toBe(107);
    expect(data.data.components).toHaveLength(10); // API возвращает первые 10 для демо
    
    // Проверяем структуру компонента
    const firstComponent = data.data.components[0];
    expect(firstComponent).toHaveProperty('id');
    expect(firstComponent).toHaveProperty('name');
    expect(firstComponent).toHaveProperty('category');
    expect(firstComponent).toHaveProperty('subcategory');
    expect(firstComponent).toHaveProperty('path');
    expect(firstComponent).toHaveProperty('metadata');
    
    // Проверяем метаданные
    expect(firstComponent.metadata).toHaveProperty('preview');
    expect(firstComponent.metadata).toHaveProperty('defaultProps');
    expect(firstComponent.metadata).toHaveProperty('schema');
    expect(firstComponent.metadata).toHaveProperty('tags');
  });

  test('Поиск Button компонентов', async () => {
    const response = await fetch(`${API_BASE_URL}/api/components/search?q=button`);
    expect(response.ok).toBe(true);
    
    const data = await response.json();
    expect(data.success).toBe(true);
    expect(data.data.count).toBeGreaterThan(10);
    
    // Проверяем что все найденные компоненты связаны с button
    data.data.components.forEach((comp: any) => {
      const hasButton = comp.name.toLowerCase().includes('button') ||
                       comp.subcategory.toLowerCase().includes('button') ||
                       comp.metadata.tags.some((tag: string) => tag.includes('button'));
      expect(hasButton).toBe(true);
    });
  });

  test('Поиск несуществующего компонента', async () => {
    const response = await fetch(`${API_BASE_URL}/api/components/search?q=nonexistentcomponent`);
    expect(response.ok).toBe(true);
    
    const data = await response.json();
    expect(data.success).toBe(true);
    expect(data.data.count).toBe(0);
    expect(data.data.components).toHaveLength(0);
  });

  test('Получение компонентов несуществующей категории', async () => {
    const response = await fetch(`${API_BASE_URL}/api/components/category/NonExistentCategory`);
    expect(response.ok).toBe(true);
    
    const data = await response.json();
    expect(data.success).toBe(true);
    expect(data.data.count).toBe(0);
    expect(data.data.components).toHaveLength(0);
  });

  test('Обработка невалидного запроса поиска', async () => {
    const response = await fetch(`${API_BASE_URL}/api/components/search`);
    expect(response.status).toBe(400);
    
    const data = await response.json();
    expect(data.success).toBe(false);
    expect(data.error.message).toBe('Параметр поиска q обязателен');
  });

  test('Проверка структуры preview изображений', async () => {
    const response = await fetch(`${API_BASE_URL}/api/components/search?q=hero`);
    const data = await response.json();
    
    const firstComponent = data.data.components[0];
    const preview = firstComponent.metadata.preview;
    
    // Проверяем что preview это base64 SVG
    expect(preview).toMatch(/^data:image\/svg\+xml;base64,/);
    
    // Декодируем и проверяем что это валидный SVG
    const svgContent = Buffer.from(preview.split(',')[1], 'base64').toString();
    expect(svgContent).toContain('<svg');
    expect(svgContent).toContain('</svg>');
  });

  test('Производительность API', async () => {
    const startTime = performance.now();
    
    // Выполняем несколько запросов подряд
    const requests = [
      fetch(`${API_BASE_URL}/api/stats`),
      fetch(`${API_BASE_URL}/api/components/search?q=hero`),
      fetch(`${API_BASE_URL}/api/components/category/CoreComponents`),
      fetch(`${API_BASE_URL}/api/components/adapted`)
    ];
    
    const responses = await Promise.all(requests);
    const endTime = performance.now();
    
    // Проверяем что все запросы успешны
    responses.forEach(response => {
      expect(response.ok).toBe(true);
    });
    
    // Проверяем что все запросы выполнились менее чем за 2 секунды
    const totalTime = endTime - startTime;
    expect(totalTime).toBeLessThan(2000);
  });

});