# 🏛️ Component Registry System

**Professional-grade component management system inspired by React Bricks architecture**

## 🎯 **Обзор**

Component Registry System — это централизованная система управления UI компонентами, обеспечивающая:

- **📦 Unified Component Storage** — единое хранилище всех компонентов
- **🔍 Smart Search & Filtering** — умный поиск и фильтрация
- **🖼️ Real Previews** — реальные превью из TailGrids каталога
- **🔒 Read-only Sources** — защищенные исходники
- **🤖 AI Integration** — поддержка AI-генерированных компонентов
- **📊 Rich Metadata** — подробные метаданные каждого компонента

---

## 🏗️ **Архитектура**

```
src/components-registry/
├── core/                    # 🔒 Read-only исходники
│   ├── free/               # Бесплатные TailGrids компоненты
│   ├── pro/                # Премиум TailGrids компоненты  
│   └── templates/          # Готовые шаблоны страниц
├── custom/                 # 🤖 AI-генерированные компоненты
├── instances/              # 📝 Пользовательские копии
├── parser/                 # 🔗 TailGrids парсер
├── scripts/                # 🔄 Скрипты заполнения
├── types.ts               # 📋 TypeScript типы
├── ComponentRegistry.ts   # 🎯 Главный класс
└── index.ts              # 📤 Экспорты
```

---

## 🚀 **Быстрый старт**

### **1. Импорт и инициализация**

```typescript
import { componentRegistry, ComponentMetadata } from './components-registry';

// Автоматическая инициализация при импорте
const registry = componentRegistry.getRegistry();
console.log(`Загружено ${registry.stats.totalComponents} компонентов`);
```

### **2. Поиск компонентов**

```typescript
// Поиск по категории
const proComponents = componentRegistry.searchComponents({
  category: 'pro',
  sortBy: 'popularity',
  sortOrder: 'desc'
});

// Поиск по тексту
const heroComponents = componentRegistry.searchComponents({
  query: 'hero',
  subcategory: 'marketing'
});

// Поиск по тегам
const featuredComponents = componentRegistry.searchComponents({
  featured: true,
  tags: ['responsive', 'modern']
});
```

### **3. Добавление компонентов**

```typescript
// Добавление нового компонента
const newComponent: Omit<ComponentMetadata, 'createdAt' | 'updatedAt'> = {
  id: 'custom-hero-1',
  name: 'Custom Hero Section',
  description: 'AI-generated hero section for startup',
  category: 'custom',
  subcategory: 'generated',
  source: 'ai-generated',
  preview: {
    thumbnail: '/previews/custom-hero-1.jpg'
  },
  component: {
    path: 'src/components-registry/custom/hero-sections/CustomHero1',
    props: { theme: 'gradient', size: 'large' }
  },
  tags: ['hero', 'startup', 'ai-generated'],
  readonly: false
};

componentRegistry.addComponent(newComponent);
```

### **4. Создание пользовательских копий**

```typescript
// Создание редактируемой копии компонента
const instance = componentRegistry.createInstance(
  'tailgrids-hero-modern', 
  'My Custom Hero'
);

// Обновление пользовательской копии
if (instance) {
  componentRegistry.updateInstance(instance.id, {
    customProps: {
      title: 'Welcome to My App',
      subtitle: 'Revolutionary platform for...',
      buttonText: 'Get Started Now'
    }
  });
}
```

---

## 📊 **Структура данных**

### **ComponentMetadata**

```typescript
interface ComponentMetadata {
  id: string;                    // Уникальный ID
  name: string;                  // Отображаемое имя
  description?: string;          // Описание
  category: ComponentCategory;   // core | pro | templates | custom
  subcategory: string;          // buttons, cards, hero, etc.
  source: ComponentSource;       // free | pro | templates | ai-generated
  preview: {
    thumbnail: string;           // URL превью
    demo?: string;              // URL демо
    screenshots?: string[];      // Скриншоты
  };
  component: {
    path: string;               // Путь к компоненту
    props: Record<string, any>; // Дефолтные props
    dependencies?: string[];     // Зависимости
  };
  tags: string[];              // Теги для поиска
  readonly: boolean;           // Можно ли редактировать
  featured?: boolean;          // Рекомендуемый
  popularity?: number;         // Рейтинг популярности
  createdAt: string;          // Дата создания
  updatedAt: string;          // Дата обновления
}
```

### **Component Registry**

```typescript
interface ComponentRegistry {
  version: string;            // Версия реестра
  lastUpdated: string;       // Последнее обновление
  components: ComponentMetadata[];
  categories: {
    [category]: {
      label: string;
      icon: string;
      description: string;
      subcategories: string[];
      componentIds: string[];
    };
  };
  sources: {
    [source]: {
      label: string;
      description: string;
      baseUrl?: string;
      readonly: boolean;
    };
  };
  stats: {
    totalComponents: number;
    componentsByCategory: Record<ComponentCategory, number>;
    componentsBySource: Record<ComponentSource, number>;
  };
}
```

---

## 🔗 **TailGrids Integration**

### **Автоматическая синхронизация**

```typescript
import { tailGridsParser } from './parser/TailGridsParser';

// Синхронизация с официальным каталогом
const components = await tailGridsParser.syncWithTailGrids();
console.log(`Синхронизировано ${components.length} компонентов`);

// Парсинг конкретной категории
const proComponents = await tailGridsParser.parseComponentsList('pro');
```

### **Генерация превью URLs**

```typescript
// Автоматическая генерация URL превью из TailGrids
const previewUrl = `https://tailgrids.com/react/components/${category}/${name}/preview.jpg`;
const demoUrl = `https://tailgrids.com/react/components/${category}/${name}`;
```

---

## 🎨 **Integration с LeftSidebar**

### **Новый LeftSidebar с Component Registry**

```typescript
import LeftSidebarNew from './components/interface/LeftSidebarNew';

// Автоматическая интеграция с Component Registry
<LeftSidebarNew
  collapsed={leftPanelCollapsed}
  setCollapsed={setLeftPanelCollapsed}
  darkMode={darkMode}
/>
```

### **Функциональность**

- **📊 3-уровневая навигация**: Категории → Подкатегории → Компоненты
- **🔍 Real-time поиск** по всем компонентам
- **🖼️ Реальные превью** из TailGrids каталога
- **🏷️ Фильтрация по тегам** и источникам
- **⭐ Featured компоненты** и рейтинги популярности
- **🎯 Drag & Drop** с метаданными компонента

---

## 🤖 **AI Components Integration**

### **Добавление AI-компонентов**

```typescript
// Интеграция с Agents Service
import { agentsService } from '../agents-service';

// Генерация компонента через AI
const aiComponent = await agentsService.generateComponent({
  description: 'Modern pricing table for SaaS',
  style: 'tailwind',
  framework: 'react'
});

// Добавление в Registry
componentRegistry.addComponent({
  ...aiComponent,
  category: 'custom',
  subcategory: 'generated',
  source: 'ai-generated',
  readonly: false
});
```

---

## 📈 **Performance & Optimization**

### **Lazy Loading**

```typescript
// Компоненты загружаются по требованию
const component = await import(`./core/${category}/${path}`);
```

### **Caching**

```typescript
// Автоматическое кэширование в localStorage
componentRegistry.loadFromStorage(); // При инициализации
componentRegistry.saveToStorage();   // При изменениях
```

### **Event System**

```typescript
// Подписка на события
componentRegistry.on('component:added', (component) => {
  console.log('Добавлен компонент:', component.name);
});

componentRegistry.on('registry:synced', (registry) => {
  console.log('Синхронизация завершена');
});
```

---

## 🔧 **API Reference**

### **ComponentRegistry Methods**

| Method | Description |
|--------|-------------|
| `getRegistry()` | Получить весь реестр |
| `searchComponents(query)` | Поиск компонентов |
| `addComponent(component)` | Добавить компонент |
| `updateComponent(id, updates)` | Обновить компонент |
| `removeComponent(id)` | Удалить компонент |
| `createInstance(id, name?)` | Создать пользовательскую копию |
| `getInstance(id)` | Получить экземпляр |
| `updateInstance(id, updates)` | Обновить экземпляр |
| `syncWithTailGrids()` | Синхронизация с TailGrids |

### **Search Query Options**

```typescript
interface ComponentSearchQuery {
  query?: string;             // Текстовый поиск
  category?: ComponentCategory;
  subcategory?: string;
  source?: ComponentSource;
  tags?: string[];
  featured?: boolean;
  sortBy?: 'name' | 'popularity' | 'createdAt' | 'updatedAt';
  sortOrder?: 'asc' | 'desc';
  limit?: number;
  offset?: number;
}
```

---

## 🎯 **Best Practices**

### **1. Организация компонентов**

- ✅ Используйте четкие, описательные имена
- ✅ Добавляйте подробные описания
- ✅ Указывайте релевантные теги
- ✅ Поддерживайте актуальные превью

### **2. Read-only исходники**

- ✅ Никогда не изменяйте файлы в `core/`
- ✅ Создавайте копии через `createInstance()`
- ✅ Используйте `custom/` для AI-компонентов
- ✅ Документируйте изменения в instances

### **3. Performance**

- ✅ Используйте пагинацию для больших списков
- ✅ Кэшируйте часто используемые компоненты
- ✅ Оптимизируйте превью изображения
- ✅ Lazy-load компоненты по требованию

---

## 🚀 **Roadmap**

### **Phase 1: Core ✅**
- ✅ Базовая архитектура
- ✅ TailGrids parser
- ✅ Component Registry
- ✅ LeftSidebar integration

### **Phase 2: AI Integration 🔄**
- 🔄 Agents Service integration
- ⏳ AI component generation
- ⏳ Smart suggestions
- ⏳ Auto-categorization

### **Phase 3: Advanced Features ⏳**
- ⏳ Real-time collaboration
- ⏳ Version control
- ⏳ A/B testing
- ⏳ Analytics & insights

---

## 🐛 **Troubleshooting**

### **Компоненты не загружаются**

```typescript
// Проверьте инициализацию
console.log(componentRegistry.getRegistry().stats);

// Запустите синхронизацию вручную
await tailGridsParser.syncWithTailGrids();
```

### **Превью не отображаются**

```typescript
// Проверьте URL превью
component.preview.thumbnail;

// Используйте fallback
onError={(e) => e.target.src = '/fallback-preview.jpg'}
```

### **Поиск не работает**

```typescript
// Проверьте индексацию тегов
component.tags; // Должно содержать релевантные теги

// Перестройте индекс
componentRegistry.updateStats();
```

---

## 📄 **License**

MIT License - можете использовать в коммерческих и личных проектах.

---

**🎉 Component Registry System — это foundation для создания professional-grade visual editor как в React Bricks, но с полной интеграцией TailGrids ecosystem!** 