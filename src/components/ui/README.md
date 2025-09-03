# UI Components - Глобальная тема проекта

Этот каталог содержит все компоненты пользовательского интерфейса для проекта Situs, включая полную систему базовых компонентов из CoreComponents и DashboardComponents.

## 🎯 Полная система компонентов

### ✅ Скопированы ВСЕ компоненты из react-pro-components-main:

**📁 CoreComponents (25+ категорий, 200+ компонентов):**

- Alerts (13 вариантов)
- Avatar (9 вариантов)
- Badges (9 вариантов)
- Breadcrumb (12 вариантов)
- ButtonGroups (3 варианта)
- Buttons (33 варианта)
- Checkboxes (5 вариантов)
- Clipboard (4 варианта)
- DatePicker (2 варианта)
- FileUploads (5 вариантов)
- FormElement (4 варианта)
- Galleries (5 вариантов)
- InputRange (3 варианта)
- List (9 вариантов)
- MegaMenus (3 варианта)
- PageTitles (5 вариантов)
- Paginations (6 вариантов)
- Progress (4 варианта)
- Ratings (3 варианта)
- Selects (3 варианта)
- Skeletons (3 варианта)
- Spinners (4 варианта)
- StickyBars (4 варианта)
- Switch (5 вариантов)
- Switcher (13 вариантов)
- Tab (11 вариантов)
- Tags (4 варианта)
- Toast (8 вариантов)
- Tooltip (3 варианта)
- VerificationCodeInputs (4 варианта)

**📁 DashboardComponents (20+ категорий, 100+ компонентов):**

- Calendar (4 варианта)
- Chart (10 вариантов)
- ChatBox (4 варианта)
- ChatList (3 варианта)
- Cookies (4 варианта)
- DashboardDropdown (3 варианта)
- DataStats (10 вариантов)
- Drawer (2 варианта)
- Dropdown (4 варианта)
- HorizontalMenu (6 вариантов)
- Map (4 варианта)
- Popover (6 вариантов)
- Profile (5 вариантов)
- SelectBox (4 варианта)
- SettingsPage (2 варианта)
- ShoppingCart (4 варианта)
- Step (8 вариантов)
- TableStack (5 вариантов)
- VerticalNavbar (7 вариантов)

## Структура компонентов

### Базовые компоненты (Legacy)

- `Button` - Базовая кнопка
- `SitusDarkModeToggle` - Переключатель темной темы
- `StatsCard` - Карточка статистики
- `ToggleSwitch` - Переключатель
- `BatchActions` - Групповые действия
- `CorporateInput/Select/Textarea` - Корпоративные формы

### Pro компоненты

- `ProButton` - Профессиональная кнопка
- `ProModal` - Профессиональное модальное окно
- `ProTable` - Профессиональная таблица

### Theme компоненты (из react-pro-components-main)

- `ThemeButton` - Тематическая кнопка
- `ThemeModal` - Тематическое модальное окно
- `ThemeStatsCard` - Тематическая карточка статистики
- `ThemeForm/Input/Select/Textarea` - Тематические формы
- `ThemeTable` - Тематическая таблица

## Core Components - Базовые компоненты глобальной темы

### ThemeAlert

Система уведомлений с поддержкой различных типов.

```tsx
import { ThemeAlert } from '@/components/ui';

<ThemeAlert type="success" title="Успех" onClose={() => {}}>
  Операция выполнена успешно
</ThemeAlert>;
```

**Пропсы:**

- `type`: 'success' | 'error' | 'warning' | 'info'
- `title`: string (опционально)
- `onClose`: функция закрытия (опционально)
- `showIcon`: boolean (по умолчанию true)

### ThemeAvatar

Компонент аватара с поддержкой статусов и fallback.

```tsx
import { ThemeAvatar } from '@/components/ui';

<ThemeAvatar src="/path/to/image.jpg" size="md" status="online" showStatus={true} fallback="AB" />;
```

**Пропсы:**

- `size`: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl'
- `status`: 'online' | 'offline' | 'away' | 'busy'
- `showStatus`: boolean
- `fallback`: string (инициалы)

### ThemeBadge

Система значков с различными вариантами оформления.

```tsx
import { ThemeBadge } from '@/components/ui';

<ThemeBadge variant="success" size="md" rounded="full">
  Активен
</ThemeBadge>;
```

**Пропсы:**

- `variant`: 'primary' | 'secondary' | 'success' | 'danger' | 'warning' | 'info' | 'light' | 'dark' | 'gray'
- `size`: 'sm' | 'md' | 'lg'
- `rounded`: 'none' | 'sm' | 'md' | 'lg' | 'full'
- `outline`: boolean
- `opacity`: boolean

### ThemeBreadcrumb

Навигационные хлебные крошки.

```tsx
import { ThemeBreadcrumb } from '@/components/ui';

const items = [
  { label: 'Главная', href: '/' },
  { label: 'Пользователи', href: '/users' },
  { label: 'Профиль', current: true },
];

<ThemeBreadcrumb items={items} showHomeIcon={true} />;
```

### ThemeCheckbox

Чекбоксы с поддержкой различных состояний.

```tsx
import { ThemeCheckbox } from '@/components/ui';

<ThemeCheckbox
  checked={isChecked}
  onChange={setIsChecked}
  label="Согласен с условиями"
  variant="primary"
  shape="rounded"
/>;
```

**Пропсы:**

- `variant`: 'primary' | 'secondary' | 'success' | 'danger' | 'warning' | 'info'
- `shape`: 'square' | 'rounded' | 'circle'
- `indeterminate`: boolean
- `error`: string

### ThemePagination

Компонент пагинации с умной логикой отображения страниц.

```tsx
import { ThemePagination } from '@/components/ui';

<ThemePagination
  currentPage={currentPage}
  totalPages={totalPages}
  onPageChange={setCurrentPage}
  maxVisiblePages={5}
  showFirstLast={true}
/>;
```

### ThemeProgress

Индикаторы прогресса с анимацией.

```tsx
import { ThemeProgress } from '@/components/ui';

<ThemeProgress value={75} max={100} variant="success" showPercentage={true} animated={true} />;
```

### ThemeSpinner

Различные типы загрузочных индикаторов.

```tsx
import { ThemeSpinner } from '@/components/ui';

<ThemeSpinner size="md" variant="primary" type="border" />
<ThemeSpinner type="dots" variant="success" />
```

**Типы:**

- `border`: классический спиннер с вращающейся границей
- `grow`: пульсирующий спиннер
- `dots`: три прыгающие точки
- `pulse`: пульсирующий блок

### ThemeSwitch

Переключатели с различными размерами и цветами.

```tsx
import { ThemeSwitch } from '@/components/ui';

<ThemeSwitch checked={isEnabled} onChange={setIsEnabled} size="md" variant="primary" label="Включить уведомления" />;
```

### ThemeToast

Система toast-уведомлений с контекстом.

```tsx
import { ThemeToast, ToastProvider, useToast } from '@/components/ui';

// В корне приложения
<ToastProvider position="top-right">
  <App />
</ToastProvider>;

// В компоненте
const { addToast } = useToast();

const showSuccess = () => {
  addToast({
    type: 'success',
    title: 'Успех',
    message: 'Данные сохранены',
    duration: 5000,
  });
};
```

### ThemeTooltip

Всплывающие подсказки с умным позиционированием.

```tsx
import { ThemeTooltip } from '@/components/ui';

<ThemeTooltip content="Это подсказка" position="top" variant="dark">
  <button>Наведи на меня</button>
</ThemeTooltip>;
```

## Использование в проекте

Все компоненты поддерживают:

- ✅ Темную и светлую темы
- ✅ Адаптивный дизайн
- ✅ Accessibility (ARIA)
- ✅ TypeScript типизацию
- ✅ Настраиваемые стили через className
- ✅ Единообразный API

### Импорт компонентов

```tsx
// Отдельные компоненты
import { ThemeButton, ThemeAlert, ThemeAvatar } from '@/components/ui';

// Или все сразу
import * as UI from '@/components/ui';
```

### Стандарты использования

1. **Размеры**: Используйте стандартные размеры (sm, md, lg)
2. **Варианты**: Придерживайтесь семантических вариантов (primary, success, danger, etc.)
3. **Accessibility**: Всегда указывайте aria-label для интерактивных элементов
4. **Темизация**: Компоненты автоматически адаптируются к текущей теме

### Расширение компонентов

Для создания специализированных компонентов используйте базовые Theme компоненты:

```tsx
import { ThemeButton } from '@/components/ui';

const SaveButton = ({ onSave, loading, ...props }) => (
  <ThemeButton variant="primary" disabled={loading} onClick={onSave} {...props}>
    {loading ? 'Сохранение...' : 'Сохранить'}
  </ThemeButton>
);
```

## Миграция с существующих компонентов

При обновлении существующих интерфейсов рекомендуется:

1. Заменять старые компоненты на Theme аналоги
2. Использовать новые возможности (варианты, размеры)
3. Добавлять поддержку accessibility
4. Тестировать в обеих темах (светлой и темной)

Это обеспечит единообразие интерфейса и улучшит пользовательский опыт.

## 🚀 Использование всех скопированных компонентов

### Core Components

```tsx
// Импорт любого Core компонента
import {
  PrimaryButton,
  SuccessAlert1,
  Avatar1,
  DangerBadge,
  Breadcrumb1,
  ButtonGroup1,
  Checkbox1,
  DatePicker1,
  FileUpload1,
  Gallery1,
  InputRange1,
  List1,
  MegaMenu1,
  PageTitle1,
  Pagination1,
  ProgressBar1,
  Rating1,
  Select1,
  Skeleton1,
  Spinner1,
  StickyBar1,
  Switcher1,
  Tab1,
  Tag1,
  Toast1,
  Tooltip1,
  VerificationCodeInput1,
} from '@/components/ui';

// Использование в компоненте
<div>
  <PrimaryButton />
  <SuccessAlert1 />
  <Avatar1 />
  <DangerBadge />
</div>;
```

### Dashboard Components

```tsx
// Импорт любого Dashboard компонента
import {
  Calendar1,
  Chart1,
  ChatBox1,
  ChatList1,
  Cookies1,
  DashboardDropdown1,
  DataStats1,
  Drawer1,
  Dropdown1,
  HorizontalMenu1,
  Map1,
  Popover1,
  Profile1,
  SelectBox1,
  SettingsPage,
  ShoppingCart1,
  Step1,
  TableStack1,
  VerticalNavbar1,
} from '@/components/ui';

// Использование в компоненте
<div>
  <Calendar1 />
  <Chart1 />
  <DataStats1 />
  <Profile1 />
</div>;
```

## 📋 Следующие шаги

1. **Адаптация под глобальную тему** - Все компоненты будут адаптированы для работы с глобальными настройками темы проекта
2. **TypeScript типизация** - Добавление полной TypeScript поддержки для всех компонентов
3. **Интеграция с темной темой** - Обеспечение корректной работы во всех темах
4. **Документация по каждому компоненту** - Создание подробных примеров использования
5. **Тестирование** - Проверка работоспособности всех компонентов в проекте

## 🎨 Преимущества полной системы

- **300+ готовых компонентов** для любых задач интерфейса
- **Единообразный дизайн** во всем проекте
- **Быстрая разработка** - не нужно создавать компоненты с нуля
- **Профессиональный вид** - все компоненты следуют лучшим практикам UX/UI
- **Полная кастомизация** - каждый компонент можно адаптировать под нужды проекта
