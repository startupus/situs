# Модуль универсальной системы меню

## 🎯 Описание

Универсальная система меню, основанная на архитектуре Joomla CMS. Позволяет создавать гибкие иерархические меню с привязкой к любым компонентам системы.

## 🏗️ Архитектура

### Модели
- **MenuType** - типы меню (main, footer, sidebar, admin)
- **MenuItem** - пункты меню с иерархической структурой

### Ключевые принципы
1. **Универсальная привязка**: пункт меню → компонент + параметры
2. **Иерархия**: level (1,2,3...), parent-child структура
3. **Права доступа**: AccessLevel (PUBLIC, REGISTERED, SPECIAL, CUSTOM)
4. **Мультиязычность**: language filtering ('*', 'ru-RU', 'en-GB')
5. **Параметры**: JSON поле с настройками отображения
6. **SEF URLs**: lookup таблицы для роутинга

## 📡 API эндпоинты

### MenuTypes
```
GET    /api/menu-types?projectId=xxx        - список типов меню
GET    /api/menu-types/:id                  - получить тип меню
POST   /api/menu-types                      - создать тип меню
PUT    /api/menu-types/:id                  - обновить тип меню
DELETE /api/menu-types/:id                  - удалить тип меню
```

### MenuItems
```
GET    /api/menu-items                      - список пунктов (с фильтрами)
GET    /api/menu-items/:id                  - получить пункт меню
POST   /api/menu-items                      - создать пункт меню
PUT    /api/menu-items/:id                  - обновить пункт меню
DELETE /api/menu-items/:id                  - удалить пункт меню
PATCH  /api/menu-items/reorder              - изменить порядок

GET    /api/menu-items/items-by-filters     - получить с мультипараметровой фильтрацией
GET    /api/menu-items/active               - получить активный пункт
GET    /api/menu-items/authorized           - получить доступные пункты
GET    /api/menu-items/lookup               - lookup таблица для роутинга
```

## 🔍 Фильтрация (аналог Joomla)

### Простая фильтрация
```typescript
// Получить все пункты главного меню на русском языке
GET /api/menu-items?menuTypeId=main&language=ru-RU

// Получить пункты 1-го уровня
GET /api/menu-items?menuTypeId=main&level=1

// Получить дочерние пункты
GET /api/menu-items?parentId=menu-item-id
```

### Мультипараметровая фильтрация (как в Joomla)
```typescript
// Аналог $sitemenu->getItems(['menutype','level'], ['mainmenu', [1,2]])
GET /api/menu-items/items-by-filters?menuTypeId=main&properties=level,component&values=1,Website
```

## 🔐 Права доступа

### Уровни доступа
- **PUBLIC** - доступно всем
- **REGISTERED** - только авторизованным пользователям
- **SPECIAL** - по специальным ролям (ADMIN, EDITOR)
- **CUSTOM** - пользовательские уровни

### Интеграция с системой ролей
```typescript
// Получить пункты меню с учетом прав пользователя
GET /api/menu-items/authorized?menuTypeId=main&accessLevels=PUBLIC,REGISTERED
```

## 🌐 Мультиязычность

### Поддержка языков
- `language = '*'` - универсальные пункты (для всех языков)
- `language = 'ru-RU'` - пункты на русском языке
- `language = 'en-GB'` - пункты на английском языке

### Фильтрация
```typescript
// Получить пункты для текущего языка + универсальные
const items = await menusService.getItems(menuTypeId, ['language'], [currentLang]);
```

## 🔗 Привязка к компонентам

### Структура привязки
```typescript
{
  component: 'Website',     // Тип компонента
  view: 'page',            // Представление
  layout: 'default',      // Макет
  targetId: 'page-123',   // ID целевого объекта
  parameters: {           // Дополнительные параметры
    showBreadcrumbs: true,
    showTitle: false
  }
}
```

### Поддерживаемые компоненты
- **Website**: pageId, view: page|list
- **Store**: categoryId|itemId, view: category|item|list
- **Blog**: articleId|categoryId, view: article|category|list
- **Landing**: templateId, view: landing

## 🛣️ Роутинг и SEF URLs

### Lookup система
```typescript
// Построение lookup таблицы для быстрого поиска
const lookup = await menusService.buildLookup(menuTypeId, language);
// Результат:
{
  "page": { 0: "menu-item-1", 123: "menu-item-2" },
  "category:grid": { 0: "menu-item-3", 456: "menu-item-4" }
}
```

### Определение активного пункта
```typescript
// Поиск активного пункта по текущему пути
const active = await menusService.getActiveMenuItem(menuTypeId, currentPath);
```

## 📊 Примеры использования

### Создание типа меню
```typescript
POST /api/menu-types
{
  "name": "main",
  "title": "Главное меню",
  "description": "Основная навигация сайта",
  "projectId": "project-123"
}
```

### Создание пункта меню
```typescript
POST /api/menu-items
{
  "title": "Каталог товаров",
  "alias": "catalog",
  "type": "COMPONENT",
  "component": "Store", 
  "view": "categories",
  "layout": "grid",
  "accessLevel": "PUBLIC",
  "language": "*",
  "menuTypeId": "menu-type-123",
  "parameters": "{\"itemsPerPage\": 20, \"showFilters\": true}"
}
```

### Изменение порядка пунктов
```typescript
PATCH /api/menu-items/reorder
{
  "items": [
    { "id": "item-1", "orderIndex": 0, "level": 1, "parentId": null },
    { "id": "item-2", "orderIndex": 1, "level": 2, "parentId": "item-1" },
    { "id": "item-3", "orderIndex": 2, "level": 1, "parentId": null }
  ]
}
```

## 🧪 Тестирование

Модуль включает:
- Unit-тесты для всех методов сервиса
- E2E тесты для всех API эндпоинтов
- Тесты прав доступа и мультиязычности
- Тесты производительности lookup таблиц

## 🔧 Конфигурация

### Подключение в AppModule
```typescript
@Module({
  imports: [
    // ... другие модули
    MenusModule,
  ],
})
export class AppModule {}
```

---
*Создано: 18.08.2025*  
*Основано на архитектуре: Joomla CMS Menu System*
