# 🚀 Руководство по интеграции Core Components

## 📋 Задача для делегирования

**Цель:** Интегрировать 200+ Core Components в глобальную тему проекта Situs

**Текущее состояние:**
- ✅ 13 Theme Components работают
- ✅ Select1 из Core Components работает (эталон)
- ❌ 200+ Core Components отключены в демо-странице
- ❌ Компоненты не используют стили глобальной темы

**Результат:** Все Core Components работают через единый импорт `@/components/ui` и используют стили проекта

## 🎯 Приоритетный план (начинать по порядку)

### 1️⃣ Badges (НАЧАТЬ ЗДЕСЬ - самые простые)
- **Файлы:** `src/components/ui/core/Badges/` → создать `src/components/ui/ThemeBadges.tsx`
- **Компоненты:** DangerBadge, DarkBadge, GrayBadge, InfoBadge, LightBadge, PrimaryBadge, SecondaryBadge, SuccessBadge, WarningBadge (9 штук)

### 2️⃣ Buttons (расширить существующий)
- **Файл:** расширить `src/components/ui/ThemeButton.tsx`
- **Компоненты:** 33 различных кнопки

### 3️⃣ Alerts + Avatars
- **Файлы:** создать `ThemeAlerts.tsx` и `ThemeAvatars.tsx`
- **Компоненты:** 5 Alert + 5 Avatar = 10 компонентов

### 4️⃣ Остальные (по мере готовности)
- Breadcrumbs (12), Checkboxes (5), Forms (4), Progress (3), Spinners (4), Tooltips (3), Paginations (5)

## 🔧 Шаблон работы (копировать и адаптировать)

### Пример создания ThemeBadges.tsx:

```typescript
// src/components/ui/ThemeBadges.tsx
import React from 'react';
import { 
  DangerBadge, 
  DarkBadge, 
  GrayBadge, 
  InfoBadge, 
  LightBadge, 
  PrimaryBadge, 
  SecondaryBadge, 
  SuccessBadge, 
  WarningBadge 
} from './core';

// Утилита для адаптации стилей под глобальную тему
const adaptBadgeProps = (props: any) => ({
  ...props,
  className: `${props.className || ''} transition-colors duration-200`
});

// Обертки с префиксом Theme
export const ThemeDangerBadge: React.FC<any> = (props) => (
  <DangerBadge {...adaptBadgeProps(props)} />
);

export const ThemeDarkBadge: React.FC<any> = (props) => (
  <DarkBadge {...adaptBadgeProps(props)} />
);

export const ThemeGrayBadge: React.FC<any> = (props) => (
  <GrayBadge {...adaptBadgeProps(props)} />
);

export const ThemeInfoBadge: React.FC<any> = (props) => (
  <InfoBadge {...adaptBadgeProps(props)} />
);

export const ThemeLightBadge: React.FC<any> = (props) => (
  <LightBadge {...adaptBadgeProps(props)} />
);

export const ThemePrimaryBadge: React.FC<any> = (props) => (
  <PrimaryBadge {...adaptBadgeProps(props)} />
);

export const ThemeSecondaryBadge: React.FC<any> = (props) => (
  <SecondaryBadge {...adaptBadgeProps(props)} />
);

export const ThemeSuccessBadge: React.FC<any> = (props) => (
  <SuccessBadge {...adaptBadgeProps(props)} />
);

export const ThemeWarningBadge: React.FC<any> = (props) => (
  <WarningBadge {...adaptBadgeProps(props)} />
);
```

### Добавить экспорт в index.ts:

```typescript
// src/components/ui/index.ts
// Добавить в конец файла:
export { 
  ThemeDangerBadge, 
  ThemeDarkBadge, 
  ThemeGrayBadge, 
  ThemeInfoBadge, 
  ThemeLightBadge, 
  ThemePrimaryBadge, 
  ThemeSecondaryBadge, 
  ThemeSuccessBadge, 
  ThemeWarningBadge 
} from './ThemeBadges';
```

### Включить в демо-страницу:

```typescript
// src/components/situs/pages/settings/AppearanceDemoSimple.tsx

// 1. Добавить импорт:
import { 
  ThemeDangerBadge, 
  ThemePrimaryBadge, 
  ThemeSuccessBadge, 
  ThemeWarningBadge, 
  ThemeInfoBadge 
} from '@/components/ui';

// 2. Найти закомментированную секцию Core Components и заменить на:
<ComponentDemo title="Core Badges" id="core-badges">
  <div className="flex flex-wrap gap-2">
    <ThemeDangerBadge>Danger</ThemeDangerBadge>
    <ThemePrimaryBadge>Primary</ThemePrimaryBadge>
    <ThemeSuccessBadge>Success</ThemeSuccessBadge>
    <ThemeWarningBadge>Warning</ThemeWarningBadge>
    <ThemeInfoBadge>Info</ThemeInfoBadge>
  </div>
</ComponentDemo>

// 3. Обновить статистику:
<h4 className="font-medium text-blue-800 dark:text-blue-200 mb-2">
  Core Components (9 активно из 200+)
</h4>
```

## 📁 Структура файлов

### Исходники (НЕ ИЗМЕНЯТЬ!):
```
src/components/ui/core/
├── Badges/           # ← НАЧАТЬ ЗДЕСЬ (9 компонентов)
├── Buttons/          # ← Второй этап (33 компонента)
├── Alerts/           # ← Третий этап (5 компонентов)
├── Avatar/           # ← Третий этап (5 компонентов)
├── Breadcrumb/       # (12 компонентов)
├── Checkboxes/       # (5 компонентов)
├── FormElement/      # (4 компонента)
├── InputRange/       # (3 компонента)
├── Selects/          # Select1 уже работает! (3 компонента)
├── VerificationCodeInputs/ # (4 компонента)
├── Progress/         # (3 компонента)
├── Spinners/         # (4 компонента)
├── Tooltip/          # (3 компонента)
└── Paginations/      # (5 компонентов)
```

### Целевые файлы (СОЗДАВАТЬ!):
```
src/components/ui/
├── ThemeBadges.tsx      # ← Создать первым
├── ThemeButtons.tsx     # ← Расширить существующий
├── ThemeAlerts.tsx      # ← Создать третьим
├── ThemeAvatars.tsx     # ← Создать четвертым
└── ... (остальные по плану)
```

## 🧪 Тестирование каждого компонента

```bash
# 1. Проверить сборку
npm run dev:situs

# 2. Открыть демо-страницу
http://localhost:5177/demo/components

# 3. Проверить отображение компонентов
# 4. Переключить тему (светлая/темная)
# 5. Убедиться в корректности стилей
```

## ⚠️ Правила и ограничения

### ✅ МОЖНО:
- Создавать новые файлы в `src/components/ui/`
- Расширять существующие Theme компоненты
- Добавлять экспорты в `index.ts`
- Раскомментировать код в демо-странице
- Адаптировать стили под глобальную тему

### ❌ НЕЛЬЗЯ:
- Изменять файлы в `src/components/ui/core/`
- Ломать существующие Theme компоненты
- Изменять структуру проекта
- Удалять рабочий код
- Изменять логику существующих компонентов

## 🎯 Эталонные примеры

### Рабочие компоненты для изучения:
- `src/components/ui/ThemeButton.tsx` - как правильно делать Theme компоненты
- `src/components/ui/core/Selects/Select1.tsx` - единственный рабочий Core Component
- `src/components/ui/index.ts` - как правильно экспортировать

### Стилевая система проекта:
- `src/styles/interface-themes.css` - стили интерфейса
- `src/styles/canvas-themes.css` - стили канваса  
- `src/styles/theme-components.css` - стили компонентов

## 📊 Прогресс трекинг

Отмечать выполненные категории:

- [ ] **Badges** (9) - НАЧАТЬ ЗДЕСЬ!
- [ ] **Buttons** (33) - расширить существующий
- [ ] **Alerts** (5)
- [ ] **Avatars** (5)
- [ ] **Breadcrumbs** (12)
- [ ] **Checkboxes** (5)
- [ ] **Forms** (4)
- [ ] **InputRange** (3)
- [ ] **Selects** (2) - Select1 уже ✅
- [ ] **VerificationCode** (4)
- [ ] **Progress** (3)
- [ ] **Spinners** (4)
- [ ] **Tooltips** (3)
- [ ] **Paginations** (5)

**Всего:** ~200+ компонентов

## 🆘 Решение проблем

### Ошибка импорта:
```typescript
// ПРАВИЛЬНО:
import { BadgeName } from './core/Badges/BadgeName';

// НЕПРАВИЛЬНО:
import { BadgeName } from './core';
```

### Компонент не отображается:
```typescript
// Проверить экспорт в index.ts:
export { ThemeBadgeName } from './ThemeBadges';
```

### Стили не применяются:
```typescript
// Добавить базовые классы:
const adaptProps = (props) => ({
  ...props,
  className: `${props.className || ''} transition-colors duration-200`
});
```

### Ошибки сборки:
```bash
# Очистить кэш Vite:
rm -rf node_modules/.vite
npm run dev:situs
```

## 🎯 Критерии готовности

Компонент готов, когда:
1. ✅ Создана обертка с префиксом `Theme`
2. ✅ Добавлен экспорт в `index.ts`
3. ✅ Работает в демо-странице
4. ✅ Поддерживает темную/светлую тему
5. ✅ Нет ошибок в консоли браузера
6. ✅ Обновлена статистика в демо-странице

## 🚀 Быстрый старт

1. **Начать с Badges** - самые простые компоненты
2. **Скопировать шаблон** из этого документа
3. **Адаптировать под конкретную категорию**
4. **Тестировать каждый компонент**
5. **Переходить к следующей категории**

## 📞 Техническая поддержка

При возникновении проблем:
1. Изучить эталонные примеры (ThemeButton.tsx, Select1.tsx)
2. Проверить паттерны в `src/components/ui/`
3. Тестировать на `/demo/components`
4. Следовать принципам проекта

**Цель:** После завершения все 200+ Core Components будут доступны через `@/components/ui` и использовать единую стилевую систему проекта.
