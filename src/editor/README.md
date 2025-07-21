# 🎨 Editor Module - Ядро визуального редактора

## 🎯 Назначение

**Editor Module** - это ядро визуального редактора Situs Service. Обеспечивает drag-and-drop функциональность, управление состоянием редактора и взаимодействие с компонентами.

## 📁 Структура модуля

### 🧠 **core/** - Основная логика редактора
- **EditorEngine** - основной движок редактора
- **StateManager** - управление состоянием
- **EventSystem** - система событий
- **CommandManager** - менеджер команд

### 🎨 **canvas/** - Область редактирования
- **Canvas** - основная область редактирования
- **CanvasRenderer** - рендеринг canvas
- **CanvasController** - контроллер canvas
- **CanvasEvents** - обработка событий canvas

### 🛠️ **toolbar/** - Панели инструментов
- **MainToolbar** - главная панель инструментов
- **FormatToolbar** - панель форматирования
- **LayoutToolbar** - панель макета
- **ToolbarManager** - менеджер панелей

### 📋 **panels/** - Боковые панели
- **PropertiesPanel** - панель свойств
- **LayersPanel** - панель слоев
- **ComponentsPanel** - панель компонентов
- **PanelManager** - менеджер панелей

### ⏮️ **history/** - Система undo/redo
- **HistoryManager** - менеджер истории
- **CommandHistory** - история команд
- **UndoRedo** - undo/redo функциональность
- **HistoryState** - состояние истории

### 🎯 **selection/** - Выделение элементов
- **SelectionManager** - менеджер выделения
- **SelectionBox** - рамка выделения
- **MultiSelection** - множественное выделение
- **SelectionEvents** - события выделения

### 🖱️ **drag-drop/** - Drag and drop
- **DragManager** - менеджер перетаскивания
- **DropZone** - зоны сброса
- **DragPreview** - предпросмотр перетаскивания
- **DragEvents** - события drag and drop

## 🔧 API модуля

### Основные классы

```typescript
// Инициализация редактора
const editor = new EditorEngine(config);

// Управление состоянием
const state = editor.getState();
editor.setState(newState);

// События
editor.on('element:selected', callback);
editor.emit('element:updated', data);

// Команды
editor.executeCommand('addElement', elementData);
editor.undo();
editor.redo();
```

### Конфигурация

```typescript
interface EditorConfig {
  canvas: CanvasConfig;
  toolbar: ToolbarConfig;
  panels: PanelsConfig;
  history: HistoryConfig;
  selection: SelectionConfig;
  dragDrop: DragDropConfig;
}
```

## 🔗 Интеграции

### С компонентами
- Импорт компонентов из `components/` модуля
- Рендеринг компонентов в canvas
- Управление свойствами компонентов

### С генератором
- Экспорт состояния в JSON
- Импорт JSON в редактор
- Синхронизация с генератором

### С платформой
- Интеграция с Hubus для AI функциональности
- Авторизация через Loginus
- Биллинг через Bilingus

## 🧪 Тестирование

### Unit тесты
- Тестирование каждого подмодуля изолированно
- Mock внешних зависимостей
- Проверка API контрактов

### Integration тесты
- Тестирование взаимодействия подмодулей
- Тестирование интеграций с другими модулями
- End-to-end тестирование редактора

### Visual тесты
- Тестирование UI компонентов
- Проверка корректности рендеринга
- Тестирование drag-and-drop

## 📋 TODO

### Приоритет 1 - MVP
- [ ] Базовая архитектура EditorEngine
- [ ] Canvas с поддержкой элементов
- [ ] Простое drag-and-drop
- [ ] Базовая панель инструментов
- [ ] Система undo/redo

### Приоритет 2 - Расширенная функциональность
- [ ] Панель свойств компонентов
- [ ] Панель слоев
- [ ] Множественное выделение
- [ ] Группировка элементов
- [ ] Выравнивание и распределение

### Приоритет 3 - Продвинутые возможности
- [ ] Плагинная архитектура
- [ ] Кастомные инструменты
- [ ] Горячие клавиши
- [ ] Контекстные меню
- [ ] Автосохранение

## 🚀 Разработка

### Добавление нового функционала
1. Создать подмодуль в соответствующей папке
2. Добавить типы в `types.ts`
3. Обновить API в `index.ts`
4. Написать тесты
5. Обновить документацию

### Рефакторинг
1. Сохранить обратную совместимость API
2. Обновить все зависимости
3. Переписать тесты
4. Обновить документацию

---

**Editor Module - основа визуального редактора Situs Service!** 🎨 