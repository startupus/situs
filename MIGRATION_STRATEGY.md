# Стратегия миграции к Enterprise Architecture

## 🎯 Цель миграции

Переход от текущей монолитной структуры к модульной enterprise архитектуре по образцу [Strapi](https://github.com/strapi/strapi) с 3-уровневой системой.

## 📊 Анализ текущего состояния

### Текущая структура (проблемы):
```
src/
├── components/          # Смешаны UI и бизнес компоненты
├── ai/                  # ИИ функциональность разбросана
├── editor/              # Редактор не выделен в отдельное приложение
├── platform/            # Платформенные интеграции в общей папке
├── domains/             # Управление доменами в корне
├── generator/           # Генераторы смешаны с логикой
└── i18n/                # Локализация на верхнем уровне
```

### Проблемы текущей архитектуры:
1. **Отсутствие модульности** - компоненты тесно связаны
2. **Нет разделения ответственности** - Level 1/2/3 смешаны
3. **Сложность масштабирования** - монолитная структура
4. **Проблемы с тестированием** - зависимости между модулями
5. **Отсутствие переиспользуемости** - компоненты специфичны

## 🚀 План миграции (поэтапный)

### Этап 1: Подготовка (1-2 недели)

#### 1.1 Настройка монорепозитория
```bash
# Создание новой структуры
mkdir -p packages/{core,plugins,providers,generators,cli}
mkdir -p apps/{platform,admin,studio,docs}
mkdir -p services/{auth,project,domain,media,deploy,analytics,ai}
mkdir -p libs/{shared,ui,config,utils}
mkdir -p tools/{build,test,deploy}

# Настройка workspace
npm init -w packages/core
npm init -w packages/plugins
npm init -w apps/studio
```

#### 1.2 Конфигурация монорепозитория
```json
// package.json (root)
{
  "name": "situs-platform",
  "workspaces": [
    "packages/*",
    "apps/*", 
    "services/*",
    "libs/*"
  ],
  "scripts": {
    "build:all": "npm run build --workspaces",
    "test:all": "npm run test --workspaces",
    "lint:all": "npm run lint --workspaces"
  }
}
```

### Этап 2: Миграция Level 1 - Platform Core (2-3 недели)

#### 2.1 Создание ядра платформы
```bash
# Миграция авторизации
src/auth/* → packages/core/platform/auth/
src/platform/loginus/* → packages/core/platform/auth/providers/

# Миграция управления пользователями  
prisma/schema.prisma → packages/core/database/entities/
src/controllers/* → packages/core/platform/users/controllers/

# Миграция проектов
src/projects/* → packages/core/platform/projects/
```

#### 2.2 Создание API ядра
```bash
# REST API
src/routes/* → packages/core/api/rest/
src/middleware/* → packages/core/api/middleware/

# GraphQL API (новое)
packages/core/api/graphql/
```

#### 2.3 Система событий
```bash
# Новая система событий
packages/core/events/
├── emitters/
├── listeners/
└── queues/
```

### Этап 3: Миграция Level 2 - Site Engine (3-4 недели)

#### 3.1 Редактор контента (Redaktus)
```bash
# Миграция Redaktus в Studio
src/components/redaktus/* → apps/studio/editor/
src/components/tailgrids/* → packages/plugins/component-library/tailgrids/

# Создание плагина управления контентом
packages/plugins/content-manager/
├── content-types/
├── fields/
├── editor/          # Интеграция с Redaktus
└── api/
```

#### 3.2 Медиа библиотека
```bash
# Миграция медиа функциональности
src/components/redaktus/media/* → packages/plugins/media-library/
# Добавление провайдеров хранилища
packages/plugins/media-library/storage/
├── local/
├── s3/
└── cloudinary/
```

#### 3.3 SEO и i18n
```bash
# SEO плагин
packages/plugins/seo-manager/
├── meta-tags/
├── sitemap/
└── analytics/

# i18n плагин  
src/i18n/* → packages/plugins/i18n/
```

### Этап 4: Миграция Level 3 - User Applications (2-3 недели)

#### 4.1 Пользовательские сайты
```bash
# Структура пользовательских проектов
apps/user-sites/
├── {project-id}/
│   ├── content/
│   ├── config/
│   ├── customizations/
│   └── integrations/
```

#### 4.2 Шаблоны и маркетплейс
```bash
# Шаблоны проектов
templates/* → apps/user-sites/templates/
# Создание маркетплейса
apps/user-sites/marketplace/
```

### Этап 5: Микросервисы (3-4 недели)

#### 5.1 Выделение сервисов
```bash
# Авторизация
services/auth-service/
├── src/controllers/
├── src/services/
└── src/middleware/

# Управление проектами  
services/project-service/
# Управление доменами
src/domains/* → services/domain-service/
# ИИ сервис
src/ai/* → services/ai-service/
```

#### 5.2 API Gateway
```bash
# Централизованный API Gateway
packages/core/api/gateway/
├── routing/
├── auth/
└── rate-limiting/
```

### Этап 6: Инструменты разработки (1-2 недели)

#### 6.1 CLI инструменты
```bash
# Создание CLI
packages/cli/
├── commands/create/
├── commands/generate/
└── commands/deploy/
```

#### 6.2 Система сборки
```bash
# Унифицированная сборка
tools/build/
├── webpack/
├── vite/
└── rollup/
```

## 📋 Детальный план миграции файлов

### Приоритет 1: Критически важные компоненты

```bash
# Ядро платформы
src/App.tsx → apps/platform/src/App.tsx
src/index.ts → apps/platform/src/index.ts

# Redaktus Editor
src/components/redaktus/redaktus-core.tsx → apps/studio/editor/core/RedaktusCore.tsx
src/components/redaktus/PageViewer.tsx → apps/studio/editor/components/PageViewer.tsx
src/components/redaktus/PreviewMode.tsx → apps/studio/preview/PreviewMode.tsx

# TailGrids компоненты
src/components/redaktus/blocks/* → packages/plugins/component-library/tailgrids/blocks/
src/components/tailgrids/* → packages/plugins/component-library/tailgrids/interface/
```

### Приоритет 2: Платформенная логика

```bash
# Авторизация
src/auth/* → packages/core/platform/auth/
src/platform/loginus/* → packages/core/platform/auth/providers/loginus/

# Проекты
src/projects/* → packages/core/platform/projects/

# Домены
src/domains/* → services/domain-service/src/

# База данных
prisma/* → packages/core/database/
```

### Приоритет 3: Плагины и расширения

```bash
# ИИ координатор
src/ai/* → services/ai-service/src/
src/platform/hubus/* → services/ai-service/src/integrations/hubus/

# Генераторы
src/generator/* → packages/generators/site-generator/

# i18n
src/i18n/* → packages/plugins/i18n/
src/hooks/useLanguage.ts → packages/plugins/i18n/hooks/
src/components/LanguageSwitcher.tsx → packages/plugins/i18n/components/
```

### Приоритет 4: UI и утилиты

```bash
# Общие компоненты
src/components/ThemeToggle.tsx → libs/ui/components/
src/hooks/useTheme.ts → libs/ui/hooks/
src/hooks/useCanvasTheme.ts → libs/ui/hooks/

# Утилиты
src/utils/* → libs/utils/
```

## 🔧 Конфигурационные изменения

### TypeScript конфигурация
```json
// tsconfig.json (root)
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@situs/core/*": ["packages/core/src/*"],
      "@situs/plugins/*": ["packages/plugins/*/src/*"],
      "@situs/ui/*": ["libs/ui/src/*"],
      "@situs/shared/*": ["libs/shared/src/*"]
    }
  }
}
```

### Vite конфигурация
```typescript
// vite.config.ts
export default defineConfig({
  resolve: {
    alias: {
      '@situs/core': path.resolve(__dirname, 'packages/core/src'),
      '@situs/plugins': path.resolve(__dirname, 'packages/plugins'),
      '@situs/ui': path.resolve(__dirname, 'libs/ui/src')
    }
  }
})
```

## 🧪 Стратегия тестирования

### Поэтапное тестирование
1. **Unit тесты** - для каждого пакета отдельно
2. **Integration тесты** - между пакетами
3. **E2E тесты** - полные пользовательские сценарии
4. **Migration тесты** - проверка корректности миграции

### Непрерывная интеграция
```yaml
# .github/workflows/ci.yml
name: CI
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
      - run: npm ci
      - run: npm run test:all
      - run: npm run lint:all
      - run: npm run build:all
```

## 📊 Метрики успеха миграции

### Технические метрики
- **Размер бандла**: уменьшение на 30-40%
- **Время сборки**: уменьшение на 50%
- **Покрытие тестами**: увеличение до 80%+
- **Переиспользование кода**: увеличение на 60%

### Бизнес метрики
- **Время разработки новых фич**: уменьшение на 40%
- **Количество багов**: уменьшение на 50%
- **Время онбординга разработчиков**: уменьшение на 60%

## 🚨 Риски и их митигация

### Технические риски
1. **Ломающие изменения** → Постепенная миграция с backward compatibility
2. **Проблемы зависимостей** → Четкое определение интерфейсов между пакетами
3. **Сложность деплоя** → Docker контейнеризация и staging среда

### Бизнес риски
1. **Остановка разработки** → Миграция в отдельной ветке с постепенным merge
2. **Потеря функциональности** → Комплексное тестирование на каждом этапе
3. **Увеличение времени выхода на рынок** → Параллельная разработка новых фич

## 📅 Timeline миграции

```
Неделя 1-2:   Подготовка и настройка монорепозитория
Неделя 3-5:   Миграция Level 1 (Platform Core)
Неделя 6-9:   Миграция Level 2 (Site Engine)  
Неделя 10-12: Миграция Level 3 (User Applications)
Неделя 13-16: Микросервисы и API Gateway
Неделя 17-18: Инструменты разработки и финализация
```

## ✅ Критерии готовности

### Этап считается завершенным когда:
1. Все файлы перенесены в новую структуру
2. Обновлены все импорты и ссылки
3. Пройдены все тесты (unit + integration)
4. Обновлена документация
5. Проведена code review
6. Выполнен smoke test в staging среде

---

**Результат**: Модульная, масштабируемая enterprise архитектура, готовая для роста от стартапа до корпорации. 