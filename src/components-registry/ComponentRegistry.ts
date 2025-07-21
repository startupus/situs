// 🎯 Component Registry - Главный класс управления компонентами
import { 
  ComponentMetadata, 
  ComponentRegistry as IComponentRegistry,
  ComponentSearchQuery,
  ComponentSearchResult,
  ComponentInstance,
  ComponentCategory,
  ComponentSource 
} from './types';

export class ComponentRegistry {
  private registry: IComponentRegistry;
  private instances: Map<string, ComponentInstance> = new Map();
  private eventListeners: Map<string, Function[]> = new Map();

  constructor() {
    this.registry = this.createEmptyRegistry();
    this.loadFromStorage();
  }

  // 📊 Создание пустого реестра
  private createEmptyRegistry(): IComponentRegistry {
    return {
      version: '1.0.0',
      lastUpdated: new Date().toISOString(),
      components: [],
      categories: {
        core: {
          label: 'Core Components',
          icon: '🏗️',
          description: 'Базовые UI компоненты',
          subcategories: ['buttons', 'forms', 'navigation', 'layout', 'feedback'],
          componentIds: []
        },
        pro: {
          label: 'Pro Components',
          icon: '⭐',
          description: 'Премиум TailGrids компоненты',
          subcategories: ['marketing', 'ecommerce', 'dashboard', 'advanced'],
          componentIds: []
        },
        templates: {
          label: 'Page Templates',
          icon: '📄',
          description: 'Готовые шаблоны страниц',
          subcategories: ['landing', 'dashboard', 'ecommerce', 'portfolio'],
          componentIds: []
        },
        custom: {
          label: 'AI Custom',
          icon: '🤖',
          description: 'AI-сгенерированные компоненты',
          subcategories: ['generated', 'modified', 'project-specific'],
          componentIds: []
        }
      },
      sources: {
        free: {
          label: 'Free TailGrids',
          description: 'Бесплатные компоненты Redactus',
          baseUrl: 'https://tailgrids.com/components',
          readonly: true
        },
        pro: {
          label: 'TailGrids Pro',
          description: 'Премиум компоненты Redactus',
          baseUrl: 'https://tailgrids.com/react/components',
          readonly: true
        },
        templates: {
          label: 'React Templates',
          description: 'Готовые шаблоны страниц',
          readonly: true
        },
        'ai-generated': {
          label: 'AI Generated',
          description: 'Сгенерированные ИИ компоненты',
          readonly: false
        },
        'user-custom': {
          label: 'User Custom',
          description: 'Пользовательские компоненты',
          readonly: false
        }
      },
      stats: {
        totalComponents: 0,
        componentsByCategory: { core: 0, pro: 0, templates: 0, custom: 0 },
        componentsBySource: { free: 0, pro: 0, templates: 0, 'ai-generated': 0, 'user-custom': 0 }
      }
    };
  }

  // 💾 Загрузка из localStorage
  private loadFromStorage(): void {
    try {
      const stored = localStorage.getItem('component-registry');
      if (stored) {
        this.registry = JSON.parse(stored);
      }
      
      const storedInstances = localStorage.getItem('component-instances');
      if (storedInstances) {
        const instances = JSON.parse(storedInstances);
        this.instances = new Map(instances);
      }
    } catch (error) {
      console.error('Ошибка загрузки Component Registry:', error);
    }
  }

  // 💾 Сохранение в localStorage
  private saveToStorage(): void {
    try {
      localStorage.setItem('component-registry', JSON.stringify(this.registry));
      localStorage.setItem('component-instances', JSON.stringify(Array.from(this.instances.entries())));
    } catch (error) {
      console.error('Ошибка сохранения Component Registry:', error);
    }
  }

  // 📋 Получение всего реестра
  getRegistry(): IComponentRegistry {
    return { ...this.registry };
  }

  // 🔍 Поиск компонентов
  searchComponents(query: ComponentSearchQuery): ComponentSearchResult {
    let filtered = [...this.registry.components];

    // Фильтрация по текстовому запросу
    if (query.query) {
      const searchTerm = query.query.toLowerCase();
      filtered = filtered.filter(comp => 
        comp.name.toLowerCase().includes(searchTerm) ||
        comp.description?.toLowerCase().includes(searchTerm) ||
        comp.tags.some(tag => tag.toLowerCase().includes(searchTerm))
      );
    }

    // Фильтрация по категории
    if (query.category) {
      filtered = filtered.filter(comp => comp.category === query.category);
    }

    // Фильтрация по подкатегории
    if (query.subcategory) {
      filtered = filtered.filter(comp => comp.subcategory === query.subcategory);
    }

    // Фильтрация по источнику
    if (query.source) {
      filtered = filtered.filter(comp => comp.source === query.source);
    }

    // Фильтрация по тегам
    if (query.tags && query.tags.length > 0) {
      filtered = filtered.filter(comp => 
        query.tags!.every(tag => comp.tags.includes(tag))
      );
    }

    // Фильтрация рекомендуемых
    if (query.featured) {
      filtered = filtered.filter(comp => comp.featured);
    }

    // Сортировка
    if (query.sortBy) {
      filtered.sort((a, b) => {
        const field = query.sortBy!;
        const order = query.sortOrder === 'desc' ? -1 : 1;
        
        if (field === 'popularity') {
          return ((a.popularity || 0) - (b.popularity || 0)) * order;
        }
        
        const aVal = a[field as keyof ComponentMetadata] as string;
        const bVal = b[field as keyof ComponentMetadata] as string;
        return aVal.localeCompare(bVal) * order;
      });
    }

    // Пагинация
    const offset = query.offset || 0;
    const limit = query.limit || 50;
    const total = filtered.length;
    const paginatedResults = filtered.slice(offset, offset + limit);

    return {
      components: paginatedResults,
      total,
      hasMore: offset + limit < total
    };
  }

  // ➕ Добавление компонента
  addComponent(component: Omit<ComponentMetadata, 'createdAt' | 'updatedAt'>): ComponentMetadata {
    const newComponent: ComponentMetadata = {
      ...component,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    this.registry.components.push(newComponent);
    this.updateStats();
    this.saveToStorage();
    this.emit('component:added', newComponent);

    return newComponent;
  }

  // ✏️ Обновление компонента
  updateComponent(id: string, updates: Partial<ComponentMetadata>): ComponentMetadata | null {
    const index = this.registry.components.findIndex(comp => comp.id === id);
    if (index === -1) return null;

    const updatedComponent = {
      ...this.registry.components[index],
      ...updates,
      updatedAt: new Date().toISOString()
    };

    this.registry.components[index] = updatedComponent;
    this.updateStats();
    this.saveToStorage();
    this.emit('component:updated', updatedComponent);

    return updatedComponent;
  }

  // 🗑️ Удаление компонента
  removeComponent(id: string): boolean {
    const index = this.registry.components.findIndex(comp => comp.id === id);
    if (index === -1) return false;

    this.registry.components.splice(index, 1);
    this.updateStats();
    this.saveToStorage();
    this.emit('component:removed', id);

    return true;
  }

  // 📊 Обновление статистики
  private updateStats(): void {
    const stats = this.registry.stats;
    stats.totalComponents = this.registry.components.length;
    
    // Обнуление счетчиков
    Object.keys(stats.componentsByCategory).forEach(key => {
      stats.componentsByCategory[key as ComponentCategory] = 0;
    });
    Object.keys(stats.componentsBySource).forEach(key => {
      stats.componentsBySource[key as ComponentSource] = 0;
    });

    // Подсчет по категориям и источникам
    this.registry.components.forEach(comp => {
      stats.componentsByCategory[comp.category]++;
      stats.componentsBySource[comp.source]++;
    });

    // Обновление списков компонентов в категориях
    Object.keys(this.registry.categories).forEach(categoryKey => {
      const category = categoryKey as ComponentCategory;
      this.registry.categories[category].componentIds = this.registry.components
        .filter(comp => comp.category === category)
        .map(comp => comp.id);
    });

    this.registry.lastUpdated = new Date().toISOString();
  }

  // 🎯 Создание экземпляра компонента
  createInstance(sourceComponentId: string, customName?: string): ComponentInstance | null {
    const sourceComponent = this.registry.components.find(comp => comp.id === sourceComponentId);
    if (!sourceComponent) return null;

    const instance: ComponentInstance = {
      id: `instance-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      sourceComponentId,
      name: customName || `${sourceComponent.name} Copy`,
      customProps: { ...sourceComponent.component.props },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    this.instances.set(instance.id, instance);
    this.saveToStorage();
    this.emit('instance:created', instance);

    return instance;
  }

  // 🎯 Получение экземпляра
  getInstance(instanceId: string): ComponentInstance | null {
    return this.instances.get(instanceId) || null;
  }

  // 🎯 Обновление экземпляра
  updateInstance(instanceId: string, updates: Partial<ComponentInstance>): ComponentInstance | null {
    const instance = this.instances.get(instanceId);
    if (!instance) return null;

    const updatedInstance = {
      ...instance,
      ...updates,
      updatedAt: new Date().toISOString()
    };

    this.instances.set(instanceId, updatedInstance);
    this.saveToStorage();
    this.emit('instance:updated', updatedInstance);

    return updatedInstance;
  }

  // 📡 События
  on(event: string, callback: Function): void {
    if (!this.eventListeners.has(event)) {
      this.eventListeners.set(event, []);
    }
    this.eventListeners.get(event)!.push(callback);
  }

  private emit(event: string, data: any): void {
    const listeners = this.eventListeners.get(event) || [];
    listeners.forEach(callback => callback(data));
  }

  // 🔄 Синхронизация с внешними источниками
  async syncWithTailGrids(): Promise<void> {
    try {
      // TODO: Реализовать парсинг tailgrids.com
      console.log('Синхронизация с TailGrids...');
      this.emit('registry:synced', this.registry);
    } catch (error) {
      console.error('Ошибка синхронизации с TailGrids:', error);
    }
  }
}

// 🌟 Singleton instance
export const componentRegistry = new ComponentRegistry(); 