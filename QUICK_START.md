# 🚀 Быстрый старт - Редактор Редактус

## 📋 Требования
- Node.js 18+
- npm/yarn

## ⚡ Запуск за 30 секунд

### 1. Установка зависимостей (если не установлены)
```bash
npm install
```

### 2. Запуск API сервера
```bash
node temp_server.cjs
```
Сервер запустится на `http://localhost:3001`

### 3. Проверка работы API
```bash
# Проверка здоровья
curl http://localhost:3001/health

# Статистика компонентов
curl http://localhost:3001/api/stats

# Поиск Hero компонентов
curl "http://localhost:3001/api/components/search?q=hero"
```

### 4. Запуск тестов
```bash
npx vitest run __tests__/components-integration.test.ts
```

## 🧩 Использование в React приложении

### Подключение API хука:
```typescript
import { useEditorAPI } from './src/hooks/useEditorAPI';

function EditorComponent() {
  const { 
    componentsLibrary, 
    searchComponents, 
    loadAdaptedComponents,
    isConnected 
  } = useEditorAPI();

  return (
    <div>
      <p>Статус: {isConnected ? '✅ Подключено' : '❌ Отключено'}</p>
      <p>Компонентов: {componentsLibrary.length}</p>
    </div>
  );
}
```

### Поиск компонентов:
```typescript
// Поиск Hero компонентов
const heroComponents = await searchComponents('hero');

// Загрузка адаптированных компонентов
const result = await loadAdaptedComponents();
console.log(`Загружено ${result.totalComponents} компонентов`);
```

## 📊 Доступные данные

- **623 компонента** из TailGrids Pro
- **6 категорий**: Marketing, Core, Dashboard, Ecommerce, AI, Application
- **Полные метаданные** с preview и схемами настройки
- **Поиск по тегам** и категориям

## 🔧 API эндпоинты

| Эндпоинт | Описание |
|----------|----------|
| `GET /health` | Проверка сервера |
| `GET /api/stats` | Статистика |
| `GET /api/components/adapted` | Инфо о компонентах |
| `GET /api/components/search?q=term` | Поиск |
| `GET /api/components/category/Name` | По категории |

---
**Система готова к использованию!** 🎉