# Техническое задание: Доработка Core Components

## Обзор проблем

После интеграции Core Components в глобальную тему проекта Situs выявлены следующие критические проблемы:

### 1. 🔴 КРИТИЧНО: Core Avatars теряют круглую форму при сужении экрана

**Проблема:** При ширине экрана менее 800px аватары становятся овальными/прямоугольными вместо круглых.

**Причина:** Использование динамических классов Tailwind `h-${size} w-${size}` без учета responsive поведения и flex-контейнера.

**Местоположение:** `src/components/ui/core/Avatar/Avatar*.tsx` (все 9 компонентов)

### 2. 🔴 КРИТИЧНО: Form Elements полностью отключены

**Проблема:** Все Form Elements показывают заглушки "временно отключен":
- FormElementInput
- FormElementSelect  
- FormElementTextarea
- FormElementFileUpload

**Местоположение:** `src/components/situs/pages/settings/AppearanceDemoSimple.tsx` (строки 889-904)

### 3. 🔴 КРИТИЧНО: Input Range компоненты отключены

**Проблема:** Все Input Range компоненты показывают заглушки "временно отключен":
- InputRange1
- InputRange2
- InputRange3

**Местоположение:** `src/components/situs/pages/settings/AppearanceDemoSimple.tsx` (строки 916-926)

### 4. 🔴 КРИТИЧНО: Verification Code Inputs отключены

**Проблема:** Все Verification Code Input компоненты показывают заглушки "временно отключен":
- VerificationCodeInput1
- VerificationCodeInput2
- VerificationCodeInput3
- VerificationCodeInput4

**Местоположение:** `src/components/situs/pages/settings/AppearanceDemoSimple.tsx` (строки 938-953)

### 5. 🟡 СРЕДНЕ: Dashboard Components не реализованы

**Проблема:** Dashboard Components показывают только информационные сообщения без реальных компонентов:
- Calendar
- Charts  
- Data Stats
- Profile
- Chat
- Dropdown
- Navigation

## 📁 Структура проекта и источники компонентов

### Исходные компоненты (НЕ ИЗМЕНЯТЬ!):
```
src/components/ui/core/
├── Avatar/           # ← 9 компонентов (Avatar1.tsx - Avatar9.tsx)
├── FormElement/      # ← 4 компонента (FormElementInput, Select, Textarea, FileUpload)
├── InputRange/       # ← 3 компонента (InputRange1-3.tsx)
├── VerificationCodeInputs/ # ← 4 компонента (VerificationCodeInput1-4.tsx)
├── Badges/           # ← 9 компонентов (DangerBadge, PrimaryBadge, etc.)
├── Buttons/          # ← 33 компонента (различные варианты кнопок)
├── Alerts/           # ← 13 компонентов (различные типы алертов)
└── ... (остальные категории)
```

### Целевые Theme компоненты (СОЗДАВАТЬ/ОБНОВЛЯТЬ!):
```
src/components/ui/
├── ThemeAvatars.tsx      # ← Обертки для Avatar1-9
├── ThemeFormElements.tsx # ← Обертки для Form компонентов  
├── ThemeInputRanges.tsx  # ← Обертки для InputRange1-3
├── ThemeVerificationInputs.tsx # ← Обертки для VerificationCode1-4
├── ThemeBadges.tsx       # ← Уже существует, проверить
├── ThemeButtons.tsx      # ← Уже существует, расширить
└── index.ts             # ← Добавлять экспорты
```

### Демо-страница для тестирования:
```
src/components/situs/pages/settings/AppearanceDemoSimple.tsx
```

## 🔧 Шаблон работы с компонентами

### Пример создания Theme обертки:

```typescript
// src/components/ui/ThemeAvatars.tsx
import React from 'react';
import { 
  Avatar1,
  Avatar2,
  Avatar3,
  Avatar4,
  Avatar5,
  Avatar6,
  Avatar7,
  Avatar8,
  Avatar9
} from './core';

// Утилита для адаптации стилей под глобальную тему
const adaptAvatarProps = (props: any) => ({
  ...props,
  className: `${props.className || ''} transition-colors duration-200`
});

// Обертки с префиксом Theme
export const ThemeAvatar1: React.FC<any> = (props) => (
  <Avatar1 {...adaptAvatarProps(props)} />
);

export const ThemeAvatar2: React.FC<any> = (props) => (
  <Avatar2 {...adaptAvatarProps(props)} />
);

// ... остальные аватары
```

### Добавление экспортов в index.ts:

```typescript
// src/components/ui/index.ts
// Добавить в конец файла:
export { 
  ThemeAvatar1,
  ThemeAvatar2,
  ThemeAvatar3,
  ThemeAvatar4,
  ThemeAvatar5,
  ThemeAvatar6,
  ThemeAvatar7,
  ThemeAvatar8,
  ThemeAvatar9
} from './ThemeAvatars';
```

### Использование в демо-странице:

```typescript
// src/components/situs/pages/settings/AppearanceDemoSimple.tsx

// 1. Добавить импорт:
import { 
  ThemeAvatar1,
  ThemeAvatar2,
  ThemeAvatar3,
  ThemeAvatar4,
  ThemeAvatar5
} from '@/components/ui';

// 2. Заменить заглушки на реальные компоненты:
<div className="space-y-6">
  <div>
    <h4 className="font-medium mb-3">Avatar Variant 1</h4>
    <ThemeAvatar1 />
  </div>
  <div>
    <h4 className="font-medium mb-3">Avatar Variant 2</h4>
    <ThemeAvatar2 />
  </div>
  {/* ... остальные варианты */}
</div>
```

## Техническое задание для исправления

### Задача 1: Исправление Core Avatars (ПРИОРИТЕТ 1)

**Цель:** Обеспечить сохранение круглой формы аватаров на всех размерах экрана.

**Требования:**
1. Заменить динамические классы на фиксированные размеры
2. Добавить `flex-shrink-0` для предотвращения сжатия
3. Использовать `min-width` и `min-height` для гарантии размеров
4. Протестировать на экранах от 320px до 1920px

**Пример исправления для Avatar1.tsx:**
```tsx
const AvatarItem = ({ img, size }) => {
  // Преобразовать размер в фиксированные классы
  const sizeClasses = {
    '6': 'h-6 w-6 min-h-[24px] min-w-[24px]',
    '[38px]': 'h-[38px] w-[38px] min-h-[38px] min-w-[38px]',
    '[42px]': 'h-[42px] w-[42px] min-h-[42px] min-w-[42px]',
    '[52px]': 'h-[52px] w-[52px] min-h-[52px] min-w-[52px]',
    '20': 'h-20 w-20 min-h-[80px] min-w-[80px]'
  };

  return (
    <div className={`${sizeClasses[size]} rounded-full flex-shrink-0`}>
      <img
        src={img}
        alt="avatar"
        className="h-full w-full rounded-full object-cover object-center"
      />
    </div>
  );
};
```

**Файлы для исправления:**
- `src/components/ui/core/Avatar/Avatar1.tsx`
- `src/components/ui/core/Avatar/Avatar2.tsx`
- `src/components/ui/core/Avatar/Avatar3.tsx`
- `src/components/ui/core/Avatar/Avatar4.tsx`
- `src/components/ui/core/Avatar/Avatar5.tsx`
- `src/components/ui/core/Avatar/Avatar6.tsx`
- `src/components/ui/core/Avatar/Avatar7.tsx`
- `src/components/ui/core/Avatar/Avatar8.tsx`
- `src/components/ui/core/Avatar/Avatar9.tsx`

### Задача 2: Активация Form Elements (ПРИОРИТЕТ 1)

**Цель:** Заменить заглушки на рабочие компоненты.

**Требования:**
1. Убрать все сообщения "временно отключен"
2. Подключить реальные компоненты из `src/components/ui/core/FormElement/`
3. Обеспечить корректную работу с глобальной темой
4. Добавить обработку состояний (default, active, disabled, error)

**Файлы для исправления:**
- `src/components/situs/pages/settings/AppearanceDemoSimple.tsx` (строки 885-910)

**Пример исправления:**
```tsx
// Заменить:
<p className="text-gray-500">FormElementInput временно отключен</p>

// На:
<ThemeFormElementInput 
  label="Default Input"
  placeholder="Enter text..."
  className="mb-4"
/>
```

### Задача 3: Активация Input Range компонентов (ПРИОРИТЕТ 1)

**Цель:** Заменить заглушки на рабочие слайдеры.

**Требования:**
1. Убрать сообщения "временно отключен"
2. Подключить компоненты из `src/components/ui/core/InputRange/`
3. Настроить диапазоны значений и шаги
4. Обеспечить responsive поведение

**Файлы для исправления:**
- `src/components/situs/pages/settings/AppearanceDemoSimple.tsx` (строки 912-930)

### Задача 4: Активация Verification Code Inputs (ПРИОРИТЕТ 1)

**Цель:** Заменить заглушки на рабочие поля ввода кода.

**Требования:**
1. Убрать сообщения "временно отключен"
2. Подключить компоненты из `src/components/ui/core/VerificationCodeInputs/`
3. Настроить автофокус и переход между полями
4. Добавить валидацию и состояния ошибок

**Файлы для исправления:**
- `src/components/situs/pages/settings/AppearanceDemoSimple.tsx` (строки 934-958)

### Задача 5: Реализация Dashboard Components (ПРИОРИТЕТ 2)

**Цель:** Создать базовые Dashboard компоненты или подключить существующие.

**Требования:**
1. Создать простые демо-версии основных Dashboard компонентов
2. Интегрировать с глобальной темой
3. Обеспечить responsive дизайн
4. Добавить в демо-страницу

**Компоненты для создания:**
- `ThemeCalendar` - простой календарь
- `ThemeChart` - базовая диаграмма (без внешних библиотек)
- `ThemeDataStats` - карточки статистики
- `ThemeProfile` - профиль пользователя
- `ThemeChat` - простой чат интерфейс
- `ThemeDropdown` - выпадающее меню
- `ThemeNavigation` - навигационное меню

## ⚠️ Правила и ограничения

### ✅ МОЖНО:
- Создавать новые файлы в `src/components/ui/` (ThemeAvatars.tsx, ThemeFormElements.tsx, etc.)
- Расширять существующие Theme компоненты (ThemeButtons.tsx, ThemeBadges.tsx)
- Добавлять экспорты в `src/components/ui/index.ts`
- Изменять демо-страницу `AppearanceDemoSimple.tsx` (убирать заглушки, добавлять компоненты)
- Адаптировать стили под глобальную тему проекта
- Исправлять CSS классы в исходных Core компонентах для responsive поведения

### ❌ НЕЛЬЗЯ:
- Удалять файлы в `src/components/ui/core/` 
- Ломать существующие рабочие Theme компоненты
- Изменять структуру проекта или архитектуру
- Удалять рабочий код без замены на лучший
- Изменять логику существующих компонентов без необходимости
- Нарушать принципы типизации TypeScript

## 🎯 Эталонные примеры для изучения

### Рабочие компоненты:
- `src/components/ui/ThemeButton.tsx` - правильная структура Theme компонента
- `src/components/ui/core/Selects/Select1.tsx` - единственный рабочий Core Component
- `src/components/ui/index.ts` - правильная структура экспортов
- `src/components/situs/pages/settings/AppearanceDemoSimple.tsx` - использование в демо

### Стилевая система проекта:
- `src/styles/interface-themes.css` - стили интерфейса
- `src/styles/canvas-themes.css` - стили канваса  
- `src/styles/theme-components.css` - стили компонентов

## 🧪 Обязательное тестирование

### После каждого изменения:
```bash
# 1. Проверить сборку
npm run dev:situs

# 2. Открыть демо-страницу
http://localhost:5177/demo/components

# 3. Проверить отображение компонентов
# 4. Переключить тему (светлая/темная)
# 5. Протестировать responsive поведение (320px - 1920px)
# 6. Убедиться в отсутствии ошибок в консоли браузера
```

## 🆘 Решение типичных проблем

### Ошибка импорта Core компонента:
```typescript
// ПРАВИЛЬНО:
import Avatar1 from './core/Avatar/Avatar1';

// НЕПРАВИЛЬНО:
import { Avatar1 } from './core';
```

### Компонент не отображается в демо:
```typescript
// 1. Проверить экспорт в index.ts:
export { ThemeAvatar1 } from './ThemeAvatars';

// 2. Проверить импорт в демо-странице:
import { ThemeAvatar1 } from '@/components/ui';
```

### Стили не применяются:
```typescript
// Добавить базовые классы для темы:
const adaptProps = (props) => ({
  ...props,
  className: `${props.className || ''} transition-colors duration-200`
});
```

### Ошибки сборки Vite:
```bash
# Очистить кэш:
rm -rf node_modules/.vite
npm run dev:situs
```

## Критерии приемки

### Обязательные требования:
1. ✅ Core Avatars остаются круглыми на всех размерах экрана (320px - 1920px)
2. ✅ Все Form Elements работают и отображаются корректно
3. ✅ Input Range компоненты функциональны
4. ✅ Verification Code Inputs работают с автофокусом
5. ✅ Нет сообщений "временно отключен" в демо
6. ✅ Все компоненты поддерживают светлую/темную тему
7. ✅ Responsive дизайн работает корректно
8. ✅ Нет ошибок в консоли браузера

### Дополнительные требования:
1. ✅ Dashboard Components имеют базовую реализацию
2. ✅ Компоненты следуют единому стилю проекта
3. ✅ Добавлена документация для новых компонентов
4. ✅ Проведено тестирование в разных браузерах

## Тестирование

### Обязательные тесты:
1. **Responsive тестирование:**
   - Экраны: 320px, 768px, 1024px, 1920px
   - Проверить все Avatar компоненты на сохранение формы

2. **Функциональное тестирование:**
   - Все Form Elements принимают ввод
   - Input Range изменяют значения
   - Verification Inputs переключаются между полями

3. **Тестирование темы:**
   - Переключение светлая/темная тема
   - Все компоненты корректно меняют цвета

### Инструменты тестирования:
- Playwright (обязательно для UI тестов)
- Ручное тестирование в Chrome, Firefox, Safari
- Тестирование на мобильных устройствах

## Временные рамки

- **Задача 1 (Avatars):** 2-4 часа
- **Задача 2 (Form Elements):** 4-6 часов  
- **Задача 3 (Input Range):** 2-3 часа
- **Задача 4 (Verification Inputs):** 2-3 часа
- **Задача 5 (Dashboard Components):** 8-12 часов

**Общее время:** 18-28 часов

## 📊 Прогресс трекинг

Отмечать выполненные задачи:

### Критичные задачи (ПРИОРИТЕТ 1):
- [ ] **Core Avatars** - исправить responsive поведение (9 компонентов)
- [ ] **Form Elements** - активировать заглушки (4 компонента)
- [ ] **Input Range** - активировать слайдеры (3 компонента)  
- [ ] **Verification Code Inputs** - активировать поля ввода (4 компонента)

### Дополнительные задачи (ПРИОРИТЕТ 2):
- [ ] **Dashboard Components** - создать базовые компоненты (7 категорий)

### Проверка интеграции существующих:
- [ ] **Badges** - проверить работу ThemeBadges.tsx (9 компонентов)
- [ ] **Buttons** - проверить работу ThemeButtons.tsx (33 компонента)
- [ ] **Alerts** - проверить работу ThemeAlerts.tsx (13 компонентов)

## 🚀 Быстрый старт

### Порядок выполнения:
1. **Начать с Core Avatars** - самая критичная проблема
2. **Активировать Form Elements** - убрать заглушки
3. **Активировать Input Range** - подключить слайдеры
4. **Активировать Verification Inputs** - подключить поля кода
5. **Создать Dashboard Components** - базовые демо-версии

### Шаги для каждой задачи:
1. Изучить исходные компоненты в `src/components/ui/core/`
2. Создать Theme обертки в `src/components/ui/`
3. Добавить экспорты в `index.ts`
4. Обновить демо-страницу `AppearanceDemoSimple.tsx`
5. Протестировать в браузере на разных размерах экрана

## 🎯 Критерии готовности компонента

Компонент считается готовым, когда:
1. ✅ Создана Theme обертка с правильным именованием
2. ✅ Добавлен экспорт в `src/components/ui/index.ts`
3. ✅ Работает в демо-странице без ошибок
4. ✅ Поддерживает переключение светлая/темная тема
5. ✅ Responsive дизайн работает на всех экранах (320px-1920px)
6. ✅ Нет ошибок в консоли браузера
7. ✅ Обновлена статистика компонентов в демо-странице

## Примечания для разработчика

1. **Архитектурные принципы:** Следовать существующим паттернам проекта, изучить эталонные примеры
2. **Типизация:** Использовать строгую типизацию TypeScript, избегать `any` где возможно
3. **Стили:** Использовать только Tailwind CSS, следовать глобальной теме проекта
4. **Компоненты:** Создавать Theme обертки, не изменять исходные Core компоненты без крайней необходимости
5. **Тестирование:** Обязательно тестировать каждое изменение в браузере
6. **Импорты:** Использовать правильные пути импортов, следовать примерам

## 📞 Техническая поддержка

При возникновении проблем:
1. **Изучить эталонные примеры:** ThemeButton.tsx, Select1.tsx, существующие Theme компоненты
2. **Проверить паттерны:** в `src/components/ui/` и демо-странице
3. **Тестировать:** на `/demo/components` после каждого изменения
4. **Следовать принципам:** проекта и не нарушать архитектуру

**Цель:** После завершения все Core Components будут работать корректно, без заглушек, с поддержкой responsive дизайна и глобальной темы проекта.
