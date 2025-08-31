# Техническое задание: Система управления темами проекта

## Дата создания: 17.01.2025
## Статус: 📝 В разработке

---

## 🎯 Цель проекта

Создать полноценную систему управления темами для проектов, аналогичную системе шаблонов Joomla, с возможностью создания, редактирования и применения множественных тем для настройки внешнего вида проектов.

## 📋 Текущее состояние

### Существующая архитектура тем:
- ✅ **Глобальная система тем** (`ThemeContext.tsx`) - управление общими темами интерфейса
- ✅ **Административные темы** (`AdminThemeContext.tsx`) - темы для админ-панели  
- ✅ **Темы редактора** (`EditorThemeContext.tsx`) - темы для редактора контента
- ✅ **Темы проекта** (`ProjectThemeContext.tsx`) - базовая реализация тем проекта
- ✅ **Типизация** (`types/theme.ts`) - полная типизация системы тем
- ✅ **База данных** - поля `settings` и `theme` в таблице `projects`

### Текущие ограничения:
- ❌ Раздел `/projects/:id/settings/theme` использует только placeholder
- ❌ Нет интерфейса для управления множественными темами проекта
- ❌ Отсутствует система шаблонов как в Joomla
- ❌ Нет возможности создания и сохранения пользовательских тем
- ❌ Отсутствует предпросмотр тем

## 🔎 Актуальность к текущему коду

### Соответствие и расхождения
- ✅ В коде уже есть контексты тем: `src/contexts/ThemeContext.tsx`, `src/contexts/AdminThemeContext.tsx`, `src/contexts/EditorThemeContext.tsx`, `src/contexts/ProjectThemeContext.tsx`.
- ✅ Типы тем централизованы в `src/types/theme.ts` и используют DualThemeVariant: `colors: { light: ThemeColors; dark: ThemeColors }`.
- ✅ Маршрут `/projects/:projectId/settings/theme` существует, но сейчас рендерит `ProjectSettingsPlaceholder`.
- ✅ В БД (Prisma) уже есть поля `projects.settings` и `projects.theme` (JSON-строки) для хранения настроек и темы на уровне проекта.
- ❌ Нет таблиц `project_themes` и `theme_templates` в текущей Prisma-схеме.
- ❌ Нет API-эндпоинтов для CRUD тем; текущее хранение — локально (localStorage) через контексты.
- ⚠️ Спецификация описывает полную систему (мульти-темы, шаблоны, overrides). Для соответствия коду требуется этапность внедрения и MVP.

### Вывод
- На первом этапе целесообразно реализовать MVP на существующей схеме данных (`projects.theme`) и существующих контекстах темы, а затем развивать систему к много-темности и шаблонам.

---

## 🎨 Концепция системы тем (по аналогии с Joomla)

### Иерархия тем:
1. **Глобальные темы** - базовые темы системы
2. **Шаблоны проектов** - готовые наборы тем для разных типов проектов
3. **Пользовательские темы** - созданные пользователем темы
4. **Активные темы проекта** - применяемые к конкретному проекту

### Типы тем по функциональности:
- **Административные темы** - для интерфейса управления проектом
- **Публичные темы** - для фронтенда проекта
- **Мобильные темы** - адаптивные версии для мобильных устройств
- **Печатные темы** - для печатной версии контента

---

## 🔧 Техническая архитектура

### 1. Расширение схемы базы данных

#### MVP (без новых таблиц)
- Используем существующие поля проекта:
  - `projects.theme` (JSON как строка) — активная конфигурация в формате `ThemeConfig`.
  - `projects.settings` — флаги (например, тёмный режим).
- Новые таблицы — со следующей фазы.

#### Фаза 2 (мульти-темность и шаблоны)
```sql
-- Новая таблица для хранения тем проектов
CREATE TABLE project_themes (
  id VARCHAR PRIMARY KEY,
  project_id VARCHAR NOT NULL REFERENCES projects(id),
  name VARCHAR(255) NOT NULL,
  description TEXT,
  type ENUM('admin', 'public', 'mobile', 'print') DEFAULT 'public',
  is_active BOOLEAN DEFAULT false,
  is_default BOOLEAN DEFAULT false,
  config JSON NOT NULL, -- ThemeConfig
  template_files JSON, -- Пути к файлам шаблонов
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  created_by VARCHAR REFERENCES users(id)
);

-- Таблица для шаблонов тем (аналог Joomla templates)
CREATE TABLE theme_templates (
  id VARCHAR PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  category VARCHAR(100), -- 'business', 'portfolio', 'ecommerce', etc.
  preview_image VARCHAR(500),
  config JSON NOT NULL,
  template_files JSON,
  is_built_in BOOLEAN DEFAULT false,
  is_public BOOLEAN DEFAULT false,
  downloads_count INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW(),
  created_by VARCHAR REFERENCES users(id)
);

-- Расширение таблицы projects
ALTER TABLE projects ADD COLUMN active_theme_id VARCHAR REFERENCES project_themes(id);
ALTER TABLE projects ADD COLUMN theme_settings JSON DEFAULT '{}';
```

### 2. Новые TypeScript типы

#### Актуальные типы в коде (сегодня)
```typescript
// src/types/theme.ts (фрагменты)
export interface ThemeColors { /* ... */ }

export interface DualThemeVariant {
  light: ThemeColors;
  dark: ThemeColors;
}

export interface ThemeConfig {
  id: string;
  name: string;
  colors: DualThemeVariant; // поддержка светлой/тёмной палитр
  typography?: ThemeTypography;
  layout?: ThemeLayout;
  animations?: ThemeAnimations;
  gradients?: ThemeGradients;
  customCss?: string;
}
```

#### Расширение для проекта (Фаза 2)
```typescript
export interface ProjectThemeConfig extends ThemeConfig {
  projectId: string;
  type: 'admin' | 'public' | 'mobile' | 'print';
  isActive: boolean;
  isDefault: boolean;
  templateFiles?: ThemeTemplateFiles;
  parentThemeId?: string;
}

export interface ThemeTemplateFiles {
  css?: string[];
  js?: string[];
  images?: string[];
  fonts?: string[];
  components?: Record<string, string>;
}

export interface ProjectThemeTemplate { /* как в исходной спецификации */ }

export interface ProjectThemeManager { /* как в исходной спецификации */ }
```

### 3. Компонентная архитектура

#### MVP структура (этап 0–1)
```
src/components/situs/projects/settings/theme/
├── ProjectThemeManager.tsx          # заменяет placeholder, интеграция с ThemeContext/ProjectThemeContext
└── components/
    └── BasicThemeForm.tsx           # выбор предустановленных тем, dark/light toggle, сохранение
```

– Допустимо переиспользовать части `src/components/admin/EnhancedThemeSettings.tsx`.
– Предпросмотр через динамическое применение CSS-переменных `ThemeContext`.

#### Полная структура (Фаза 2)
```
src/components/situs/projects/settings/theme/
├── ProjectThemeManager.tsx          # Главный компонент управления темами
├── ThemesList.tsx                   # Список доступных тем проекта
├── ThemeEditor.tsx                  # Редактор темы
├── ThemePreview.tsx                 # Предпросмотр темы
├── ThemeTemplates.tsx               # Галерея шаблонов тем
├── ThemeImportExport.tsx           # Импорт/экспорт тем
├── components/
│   ├── ColorPicker.tsx             # Выбор цветов
│   ├── TypographyEditor.tsx        # Настройка типографики
│   ├── LayoutEditor.tsx            # Настройка макета
│   ├── AnimationEditor.tsx         # Настройка анимаций
│   ├── ThemeCard.tsx               # Карточка темы
│   └── TemplateCard.tsx            # Карточка шаблона
└── hooks/
    ├── useProjectThemes.ts         # Хук для работы с темами проекта
    ├── useThemeTemplates.ts        # Хук для работы с шаблонами
    └── useThemePreview.ts          # Хук для предпросмотра
```

---

## 📝 Детальные требования

### 1. Главная страница управления темами (`/projects/:id/settings/theme`)

#### Функциональность:
- **Список активных тем проекта** с возможностью переключения
- **Галерея доступных шаблонов** с фильтрацией по категориям
- **Кнопки действий**: Создать новую тему, Импортировать, Настройки
- **Предпросмотр** выбранной темы в реальном времени
- **Статистика использования** тем в проекте

#### UI/UX требования:
- Адаптивный дизайн для всех устройств
- Интуитивно понятный интерфейс в стиле существующей админки
- Быстрый поиск и фильтрация тем
- Drag & drop для изменения порядка тем
- Модальные окна для редактирования

### 2. Редактор тем (`ThemeEditor.tsx`)

#### Секции редактора:
1. **Основные настройки**
   - Название темы
   - Описание
   - Тип темы (admin/public/mobile/print)
   - Статус (активная/неактивная/по умолчанию)

2. **Цветовая схема**
   - Основные цвета (primary, secondary, accent)
   - Системные цвета (success, warning, error, info)
   - Цвета фона и текста
   - Границы и разделители
   - Поддержка светлой/темной версий

3. **Типографика**
   - Семейства шрифтов
   - Размеры шрифтов
   - Межстрочные интервалы
   - Насыщенность шрифта

4. **Макет и размеры**
   - Радиусы скругления
   - Отступы и промежутки
   - Тени и эффекты
   - Размеры сайдбара и хедера

5. **Анимации**
   - Длительность переходов
   - Типы анимаций
   - Включение/отключение анимаций

6. **Дополнительный CSS**
   - Поле для пользовательского CSS
   - Валидация CSS
   - Предпросмотр изменений

### 3. Система шаблонов (аналог Joomla Templates)

#### Встроенные шаблоны:
1. **Business Pro** - корпоративный стиль
2. **Creative Agency** - креативное агентство  
3. **E-commerce** - интернет-магазин
4. **Portfolio** - портфолио
5. **Blog/Magazine** - блог или журнал
6. **Landing Page** - лендинг
7. **Dashboard** - административная панель
8. **Minimal** - минималистичный дизайн

#### Возможности шаблонов:
- **Предпросмотр** перед установкой
- **Категоризация** по типам проектов
- **Рейтинг и отзывы** пользователей
- **Версионность** шаблонов
- **Зависимости** и требования
- **Автоматическое обновление**

### 4. Система переопределений (аналог Joomla Overrides)

#### Переопределяемые элементы:
- **Компоненты** - кнопки, формы, карточки
- **Макеты** - сетки, списки, таблицы
- **Модули** - сайдбар, хедер, футер
- **Страницы** - шаблоны страниц

#### Механизм переопределения:
```typescript
// Пример структуры переопределений
interface ThemeOverrides {
  components: {
    Button: string;        // Путь к переопределенному компоненту
    Card: string;
    Modal: string;
  };
  layouts: {
    GridLayout: string;
    ListLayout: string;
  };
  modules: {
    Sidebar: string;
    Header: string;
    Footer: string;
  };
  pages: {
    HomePage: string;
    ProjectPage: string;
  };
}
```

---

## 🛠 Этапы реализации

### Этап 0: Разблокировка UI (1–2 дня)
1. Заменить `ProjectSettingsPlaceholder` на `ProjectThemeManager` в маршруте `/projects/:id/settings/theme`.
2. Показать список предустановленных тем (`DEFAULT_THEMES`) с переключением.
3. Включить предпросмотр через `ThemeContext` (DualThemeVariant, dark/light).

### Этап 1: Базовая инфраструктура (1-2 недели)
1. **Хранение в БД (без новых таблиц)**
   - Сохранение активной темы проекта в поле `projects.theme` (JSON строка)
   - Миграция настроек из localStorage при первом сохранении

2. **API эндпоинты (MVP)**
   - `GET /api/projects/:projectId/theme` и `PUT /api/projects/:projectId/theme`
   - Формат данных: `ThemeConfig`

3. **Обновление типов**
   - Расширение существующих типов тем
   - Новые интерфейсы для управления темами
   - Типизация API ответов

### Этап 2: Пользовательский интерфейс (2-3 недели)
1. **Главная страница тем**
   - Замена `ProjectSettingsPlaceholder` на `ProjectThemeManager`
   - Список тем с карточками
   - Панель действий и фильтров

2. **Редактор тем**
   - Многоступенчатый редактор с табами
   - Живой предпросмотр изменений
   - Валидация настроек
   - Автосохранение

3. **Галерея шаблонов**
   - Каталог встроенных шаблонов
   - Поиск и фильтрация по категориям
   - Предпросмотр и установка шаблонов

### Этап 3: Продвинутые возможности (2-3 недели)
1. **Система переопределений**
   - Механизм замены компонентов
   - Редактор переопределений
   - Валидация совместимости

2. **Импорт/экспорт**
   - Экспорт тем в JSON/ZIP формате
   - Импорт тем из файлов
   - Валидация импортируемых тем

3. **Предустановленные шаблоны**
   - Создание 8-10 качественных шаблонов
   - Интеграция с существующими Upload шаблонами
   - Система категорий и тегов

### Этап 4: Интеграция и оптимизация (1 неделя)
1. **Интеграция с существующими системами**
   - Связь с системой меню проекта
   - Интеграция с настройками SEO
   - Синхронизация с публичным фронтендом

2. **Производительность**
   - Ленивая загрузка тем
   - Кеширование настроек
   - Оптимизация CSS переменных

3. **Тестирование**
   - Unit тесты для всех компонентов
   - E2E тесты пользовательских сценариев
   - Тестирование производительности

---

## 📐 Детальная спецификация компонентов

### 1. ProjectThemeManager.tsx

```typescript
interface ProjectThemeManagerProps {
  projectId: string;
}

interface ProjectThemeManagerState {
  themes: ProjectThemeConfig[];
  activeTheme?: ProjectThemeConfig;
  templates: ProjectThemeTemplate[];
  isLoading: boolean;
  selectedTheme?: string;
  previewMode: boolean;
}
```

**Функциональность:**
- Отображение списка тем проекта в виде карточек
- Переключение между темами с мгновенным предпросмотром
- Кнопки создания новой темы и импорта
- Контекстное меню для каждой темы (редактировать, дублировать, удалить)
- Поиск и фильтрация тем по названию и типу
- Drag & drop для изменения порядка тем

### 2. ThemeEditor.tsx

```typescript
interface ThemeEditorProps {
  themeId?: string; // undefined для создания новой темы
  onSave: (theme: ProjectThemeConfig) => void;
  onCancel: () => void;
}
```

**Секции редактора:**
1. **Общие настройки**
   - Название и описание темы
   - Тип темы и категория
   - Родительская тема (для наследования)

2. **Визуальные настройки**
   - Цветовая палитра с поддержкой светлой/темной версий
   - Типографика (шрифты, размеры, интервалы)
   - Макет (отступы, радиусы, тени)
   - Анимации и переходы

3. **Дополнительно**
   - Пользовательский CSS
   - Переопределения компонентов
   - Медиа-файлы (логотипы, фоны)

### 3. ThemeTemplates.tsx

```typescript
interface ThemeTemplatesProps {
  onInstallTemplate: (template: ProjectThemeTemplate) => void;
  installedThemes: string[];
}
```

**Функциональность:**
- Каталог шаблонов с превью
- Фильтрация по категориям (Business, Creative, E-commerce, etc.)
- Поиск по названию и тегам
- Детальная информация о шаблоне
- Предпросмотр в модальном окне
- Установка шаблона в один клик

### 4. ThemePreview.tsx

```typescript
interface ThemePreviewProps {
  theme: ProjectThemeConfig;
  previewType: 'desktop' | 'tablet' | 'mobile';
  components?: string[]; // Какие компоненты показывать в превью
}
```

**Возможности:**
- Предпросмотр темы на разных устройствах
- Демонстрация основных UI элементов
- Переключение между светлой/темной версиями
- Интерактивные элементы для тестирования

---

## 🎨 Предустановленные шаблоны тем

### 1. **Corporate Business** 
- **Цвета:** Синий + серый, консервативная палитра
- **Типографика:** Roboto, четкие линии
- **Стиль:** Минимализм, профессионализм
- **Компоненты:** Строгие формы, таблицы, графики

### 2. **Creative Agency**
- **Цвета:** Яркие акценты, градиенты
- **Типографика:** Modern sans-serif, креативные заголовки
- **Стиль:** Динамичность, креативность
- **Компоненты:** Карточки портфолио, анимации

### 3. **E-commerce Store**
- **Цвета:** Зеленый + оранжевый, коммерческие цвета
- **Типографика:** Читаемые шрифты, акцент на CTA
- **Стиль:** Доверие, конверсия
- **Компоненты:** Карточки товаров, корзина, checkout

### 4. **Tech Startup**
- **Цвета:** Фиолетовый + голубой, инновационная палитра
- **Типографика:** Futura, технологичность
- **Стиль:** Современность, инновации
- **Компоненты:** Дашборды, метрики, графики

### 5. **Portfolio/Creative**
- **Цвета:** Черный + белый + акцент
- **Типографика:** Художественные шрифты
- **Стиль:** Элегантность, фокус на контенте
- **Компоненты:** Галереи, слайдеры

### 6. **Educational**
- **Цвета:** Синий + зеленый, обучающая палитра
- **Типографика:** Читаемые шрифты, иерархия
- **Стиль:** Ясность, структурированность
- **Компоненты:** Курсы, прогресс, тесты

### 7. **Healthcare/Medical**
- **Цвета:** Голубой + белый, медицинская палитра
- **Типографика:** Четкие, надежные шрифты
- **Стиль:** Чистота, доверие
- **Компоненты:** Формы записи, календари

### 8. **Dark Professional**
- **Цвета:** Темная основа + яркие акценты
- **Типографика:** Контрастные шрифты
- **Стиль:** Современность, премиум
- **Компоненты:** Темные панели, неоновые акценты

---

## 🔄 Интеграция с существующими системами

### 1. Связь с системой меню
```typescript
// Темы могут влиять на стили меню
interface MenuThemeConfig {
  menuStyle: 'horizontal' | 'vertical' | 'sidebar';
  menuColors: {
    background: string;
    text: string;
    hover: string;
    active: string;
  };
  menuAnimation: boolean;
}
```

### 2. Интеграция с редактором контента
```typescript
// Темы проекта влияют на стили в редакторе
interface EditorThemeIntegration {
  inheritProjectTheme: boolean;
  customEditorStyles?: string;
  previewMode: 'project' | 'editor' | 'both';
}
```

### 3. Публичный фронтенд
```typescript
// API для получения активной темы проекта
GET /api/projects/:id/theme/active
Response: {
  theme: ProjectThemeConfig;
  cssVariables: string;
  customCSS: string;
}
```

---

## 📊 API Спецификация

### MVP (без новых таблиц)
```typescript
// Получение/сохранение активной темы проекта (projects.theme)
GET /api/projects/:projectId/theme
Response: ThemeConfig

PUT /api/projects/:projectId/theme
Body: ThemeConfig
Response: { success: boolean }
```

### Этап 2+: Полные эндпоинты
```typescript
// Получение тем проекта
GET /api/projects/:projectId/themes
Response: ProjectThemeConfig[]

// Создание новой темы
POST /api/projects/:projectId/themes
Body: Partial<ProjectThemeConfig>
Response: ProjectThemeConfig

// Обновление темы
PUT /api/projects/:projectId/themes/:themeId
Body: Partial<ProjectThemeConfig>
Response: ProjectThemeConfig

// Удаление темы
DELETE /api/projects/:projectId/themes/:themeId
Response: { success: boolean }

// Активация темы
POST /api/projects/:projectId/themes/:themeId/activate
Response: { success: boolean }

// Получение шаблонов
GET /api/theme-templates
Query: { category?, search?, limit?, offset? }
Response: { templates: ProjectThemeTemplate[], total: number }

// Установка шаблона
POST /api/projects/:projectId/themes/install-template
Body: { templateId: string, customName?: string }
Response: ProjectThemeConfig

// Экспорт темы
GET /api/projects/:projectId/themes/:themeId/export
Response: { themeData: string, filename: string }

// Импорт темы
POST /api/projects/:projectId/themes/import
Body: FormData (theme file)
Response: ProjectThemeConfig
```

---

## 🔐 Права доступа и безопасность

### Уровни доступа:
1. **Владелец проекта** - полный доступ ко всем темам
2. **Администратор проекта** - создание и редактирование тем
3. **Редактор** - применение существующих тем
4. **Просмотр** - только просмотр активной темы

### Ограничения безопасности:
- Валидация CSS на предмет XSS атак
- Ограничение размера загружаемых файлов
- Песочница для предпросмотра тем
- Аудит изменений тем

---

## 📱 Адаптивность и совместимость

### Поддерживаемые устройства:
- **Desktop** - полный функционал
- **Tablet** - адаптированный интерфейс
- **Mobile** - упрощенный редактор

### Браузеры:
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

### Совместимость с существующим кодом:
- Обратная совместимость с текущими темами
- Миграция настроек из поля `settings.theme`
- Поддержка существующих CSS классов
- Совместимость с `DualThemeVariant` (светлая/тёмная палитры) из `ThemeContext`
- Переиспользование `AdminThemeContext`/`EditorThemeContext` подходов для единообразия

---

## 📈 Метрики успеха

### Пользовательские метрики:
- Время создания новой темы < 10 минут
- Переключение между темами < 2 секунд
- Удовлетворенность пользователей > 4.5/5

### Технические метрики:
- Время загрузки страницы тем < 1 секунды
- Размер CSS файлов < 50KB на тему
- Покрытие тестами > 90%

### Бизнес-метрики:
- Увеличение времени проведенного в проекте на 20%
- Рост количества созданных проектов на 15%
- Снижение обращений в поддержку по темам на 30%

---

## 🧪 План тестирования

### Unit тесты:
- Все хуки и утилиты
- Компоненты редактора
- API сервисы

### Integration тесты:
- Полный цикл создания/редактирования темы
- Переключение между темами
- Импорт/экспорт тем

### E2E тесты:
- Пользовательские сценарии
- Кроссбраузерное тестирование
- Тестирование производительности

---

## 🚀 Дальнейшее развитие

### Фаза 2 (будущие возможности):
1. **Marketplace тем** - магазин пользовательских тем
2. **AI-генерация тем** - автоматическое создание тем на основе описания
3. **A/B тестирование** - тестирование эффективности разных тем
4. **Аналитика тем** - статистика использования и конверсии
5. **Мобильное приложение** - управление темами с мобильных устройств
6. **Интеграция с дизайн-системами** - импорт из Figma, Sketch
7. **Версионность тем** - система версий и откатов
8. **Коллаборация** - совместное редактирование тем

### Интеграции:
- **Figma Plugin** - импорт дизайн-системы
- **GitHub Integration** - версионирование тем
- **CDN для ресурсов** - быстрая загрузка медиа-файлов
- **Webhook уведомления** - оповещения об изменениях тем

---

## 💾 Структура файлов проекта

```
src/
├── components/situs/projects/settings/theme/
│   ├── ProjectThemeManager.tsx
│   ├── ThemesList.tsx
│   ├── ThemeEditor/
│   │   ├── index.tsx
│   │   ├── GeneralSettings.tsx
│   │   ├── ColorScheme.tsx
│   │   ├── Typography.tsx
│   │   ├── Layout.tsx
│   │   ├── Animations.tsx
│   │   └── CustomCSS.tsx
│   ├── ThemePreview/
│   │   ├── index.tsx
│   │   ├── PreviewFrame.tsx
│   │   └── DeviceSelector.tsx
│   ├── ThemeTemplates/
│   │   ├── index.tsx
│   │   ├── TemplateGallery.tsx
│   │   ├── TemplateCard.tsx
│   │   └── TemplatePreview.tsx
│   ├── ThemeImportExport/
│   │   ├── index.tsx
│   │   ├── ExportDialog.tsx
│   │   └── ImportDialog.tsx
│   └── components/
│       ├── ThemeCard.tsx
│       ├── ColorPicker.tsx
│       ├── FontSelector.tsx
│       └── PreviewComponents.tsx
├── api/services/
│   ├── ProjectThemeService.ts
│   └── ThemeTemplateService.ts
├── hooks/
│   ├── useProjectThemes.ts
│   ├── useThemeTemplates.ts
│   └── useThemePreview.ts
└── utils/
    ├── themeValidation.ts
    ├── themeExport.ts
    └── themeImport.ts
```

---

## 🎯 Критерии готовности

### Минимально жизнеспособный продукт (MVP):
- ✅ Создание и редактирование тем проекта
- ✅ Переключение между темами с предпросмотром
- ✅ 3-5 предустановленных шаблонов
- ✅ Базовый импорт/экспорт
- ✅ Адаптивный интерфейс
- ✅ Сохранение активной темы в `projects.theme` (JSON)
- ✅ Замена placeholder на рабочий UI на маршруте `/projects/:id/settings/theme`

### Полная версия:
- ✅ Все функции MVP
- ✅ Система переопределений компонентов
- ✅ 8-10 качественных шаблонов
- ✅ Продвинутый редактор с валидацией
- ✅ Полное покрытие тестами
- ✅ Документация для пользователей

---

## 📚 Документация

### Для пользователей:
1. **Руководство по созданию тем** - пошаговая инструкция
2. **Каталог шаблонов** - описание всех доступных шаблонов
3. **FAQ** - часто задаваемые вопросы
4. **Видео-туториалы** - обучающие ролики

### Для разработчиков:
1. **API документация** - описание всех эндпоинтов
2. **Архитектурное решение** - техническая документация
3. **Гайд по созданию шаблонов** - как создавать новые шаблоны
4. **Система переопределений** - как переопределять компоненты

---

## ⚠️ Риски и ограничения

### Технические риски:
1. **Производительность** - большое количество CSS переменных может замедлить рендеринг
2. **Совместимость** - конфликты с существующими стилями
3. **Безопасность** - XSS атаки через пользовательский CSS
4. **Сложность** - высокая сложность системы переопределений

### Пользовательские риски:
1. **Кривая обучения** - сложность для новых пользователей
2. **Перегрузка функциями** - слишком много опций может запутать
3. **Совместимость тем** - темы могут конфликтовать между собой

### Митигация рисков:
- Поэтапное внедрение функций
- Подробная документация и обучение
- Система валидации и предупреждений
- Откат к предыдущим версиям тем

---

## 🎉 Заключение

Данное техническое задание описывает создание комплексной системы управления темами проекта, которая:

1. **Решает текущие ограничения** - заменяет placeholder на полноценный функционал
2. **Следует лучшим практикам** - использует подходы из Joomla и современных CMS
3. **Масштабируется** - поддерживает множественные темы и шаблоны
4. **Интегрируется** - работает с существующей архитектурой проекта
5. **Готова к будущему** - заложены возможности для расширения

Реализация этой системы значительно улучшит пользовательский опыт работы с проектами и предоставит мощные инструменты для кастомизации внешнего вида.