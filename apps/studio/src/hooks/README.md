# Хуки (Hooks)

Эта папка содержит пользовательские React хуки для проекта Redaktus.

## useTheme

Хук для управления темной темой интерфейса.

### Возможности:

- **Три режима темы**: светлая, темная, системная
- **Автоопределение системной темы**: автоматически следует настройкам операционной системы
- **Сохранение в localStorage**: настройки темы сохраняются между сессиями
- **Плавные переходы**: анимация при смене темы
- **Meta теги**: автоматическое обновление theme-color для браузера

### Использование:

```tsx
import { useTheme } from '../hooks/useTheme'

function MyComponent() {
  const { 
    theme,           // 'light' | 'dark' | 'system'
    resolvedTheme,   // 'light' | 'dark' (реальная тема)
    isDark,          // boolean
    isLight,         // boolean
    isSystem,        // boolean
    setTheme,        // функция для установки темы
    toggleTheme      // функция для переключения темы
  } = useTheme()

  return (
    <div className={isDark ? 'bg-gray-900 text-white' : 'bg-white text-gray-900'}>
      <button onClick={toggleTheme}>
        Переключить тему
      </button>
    </div>
  )
}
```

### API:

| Свойство | Тип | Описание |
|----------|-----|----------|
| `theme` | `'light' \| 'dark' \| 'system'` | Текущая выбранная тема |
| `resolvedTheme` | `'light' \| 'dark'` | Реальная применяемая тема |
| `isDark` | `boolean` | `true` если темная тема |
| `isLight` | `boolean` | `true` если светлая тема |
| `isSystem` | `boolean` | `true` если используется системная тема |
| `setTheme` | `(theme: Theme) => void` | Установить конкретную тему |
| `toggleTheme` | `() => void` | Переключить на следующую тему |

### Особенности:

1. **Системная тема**: При выборе "системная" тема, хук автоматически следует настройкам `prefers-color-scheme` браузера
2. **Сохранение**: Выбранная тема сохраняется в `localStorage` под ключом `theme`
3. **CSS классы**: Хук автоматически добавляет классы `light` или `dark` к `document.documentElement`
4. **Meta теги**: Обновляет `theme-color` meta тег для корректного отображения в браузере
5. **Слушатели**: Автоматически слушает изменения системной темы при выборе "системная" тема 