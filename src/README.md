# Situs Service — Структура проекта

## 🎯 Назначение

**Situs Service** — это AI-powered платформа для создания сайтов с интуитивным редактором Redaktus, часть экосистемы Startupus Platform.

## 🏗️ Структура модулей

### 🤖 **ai/** - AI Coordinator — координация с Hubus
- **coordinator/** — координация с Hubus (TaskBuilder, ResultProcessor, WorkflowManager)
- **specifications/** — система ТЗ (SiteTypeSpecs, ContentTypeSpecs, StructureTypeSpecs)
- **templates/** — шаблоны сайтов

### 🎨 **editor/** - Redaktus Editor — интуитивный редактор
- **core/** — ядро редактора
- **canvas/** — холст для редактирования
- **toolbar/** — панель инструментов
- **panels/** — панели редактора
- **history/** — история изменений
- **selection/** — выделение элементов
- **drag-drop/** — drag & drop функциональность

### 🧩 **components/** - Component Library — библиотека компонентов
- **library/** — основная библиотека (600+ TailGrids компонентов)
- **categories/** — категории компонентов
- **custom/** — кастомные компоненты
- **adapters/** — адаптеры для интеграции
- **preview/** — предварительный просмотр

### 📋 **templates/** - Template Engine — движок шаблонов
- **categories/** — категории шаблонов
- **builder/** — конструктор шаблонов
- **marketplace/** — маркетплейс шаблонов
- **import-export/** — импорт/экспорт

### 🔧 **generator/** - Site Generator — генератор сайтов
- **json/** — генерация JSON структуры
- **static/** — статическая генерация
- **optimization/** — оптимизация
- **export/** — экспорт сайтов

### 🔗 **platform/** - Platform Integrations — интеграции с экосистемой
- **hubus/** — AI Provider Management Hub (200+ моделей, ИИ-агенты)
- **loginus/** — аутентификация и авторизация
- **bilingus/** — Enterprise-grade биллинг
- **controlus/** — Enterprise административная панель

### 🌐 **domains/** - Domain Management — управление доменами
- **management/** — управление доменами
- **dns/** — DNS интеграция
- **ssl/** — SSL сертификаты
- **deployment/** — деплой сайтов

### 🌍 **i18n/** - Internationalization — мультиязычность
- **locales/** — локали
- **translation/** — переводы
- **rtl/** — поддержка RTL
- **content/** — контент

### 🎨 **ui/** - UI Components — UI компоненты
- **common/** — общие компоненты
- **layout/** — компоненты макета
- **forms/** — формы
- **navigation/** — навигация
- **feedback/** — обратная связь

### 🛠️ **utils/** - Utilities — утилиты
- **helpers/** — вспомогательные функции
- **validators/** — валидаторы
- **formatters/** — форматтеры
- **constants/** — константы

### 📝 **types/** - TypeScript Types — типы
- **editor/** — типы редактора
- **components/** — типы компонентов
- **platform/** — типы платформы
- **api/** — типы API

### ⚙️ **config/** - Configuration — конфигурация
- **editor/** — конфигурация редактора
- **platform/** — конфигурация платформы
- **build/** — конфигурация сборки
- **deployment/** — конфигурация деплоя

### 🧪 **hooks/** - React Hooks — React хуки
### 📦 **stores/** - State Management — управление состоянием
### 🔌 **services/** - Services — сервисы
### 🔒 **middleware/** - Middleware — промежуточное ПО
### 🔌 **plugins/** - Plugins — плагины
### 🎨 **themes/** - Themes — темы
### 📁 **assets/** - Assets — ресурсы

## 🔗 Интеграции с экосистемой

### ✅ Production Ready Сервисы

| **Сервис** | **Статус** | **Готовность** | **Описание** |
|------------|------------|----------------|--------------|
| **Loginus** | ✅ Production Ready | 100% | Сервис аутентификации и авторизации, управление клиентами |
| **Hubus Service** | ✅ Production Ready | 100% | AI Provider Management Hub, API Gateway и маршрутизация, Model Context Protocol интеграция, Управление AI-агентами |
| **Bilingus Service** | ✅ Production Ready | 100% | Enterprise-grade система биллинга |
| **Chat Service** | ✅ Production Ready | 100% | Чат-система с TailGrids UI |
| **Controlus Service** | ✅ Production Ready | 100% | Enterprise административная панель |
| **Codus Service** | ✅ Production Ready | 100% | Code Interpreter платформа |

## 📊 Основной поток данных

```
User Input → AI Coordinator → Hubus → Result Processing → Editor → Generator → Platform → Domains
```

## 🔧 Примеры использования

### AI Coordinator
```typescript
import { TaskBuilder } from '@/ai/coordinator/TaskBuilder';
import { ResultProcessor } from '@/ai/coordinator/ResultProcessor';

const taskBuilder = new TaskBuilder();
const resultProcessor = new ResultProcessor();

// Создание ТЗ для ИИ-агента
const taskSpec = await taskBuilder.createSiteSpec('Создай сайт для IT-компании');

// Обработка результата от Hubus
const siteStructure = await resultProcessor.processHubusResult(hubusResult);
```

### Platform Integration
```typescript
import { HubusClient } from '@/platform/hubus/HubusClient';
import { LoginusClient } from '@/platform/loginus/LoginusClient';
import { BilingusClient } from '@/platform/bilingus/BilingusClient';
import { ControlusClient } from '@/platform/controlus/ControlusClient';

const hubus = new HubusClient();
const loginus = new LoginusClient();
const bilingus = new BilingusClient();
const controlus = new ControlusClient();
```

## 🧪 Тестирование

### Unit тесты
- Тестирование AI Coordinator
- Тестирование Editor Core
- Тестирование Component Library
- Тестирование Platform Integrations

### Integration тесты
- Тестирование интеграции с Hubus
- Тестирование интеграции с Loginus
- Тестирование интеграции с Bilingus
- Тестирование интеграции с Controlus

### E2E тесты
- Полный цикл создания сайта
- Тестирование редактора
- Тестирование генерации
- Тестирование деплоя

## 📈 Ключевые метрики

### AI Coordinator
- **Task Accuracy** — точность составления ТЗ (>95%)
- **Result Processing** — качество обработки результатов (>90%)
- **Workflow Efficiency** — эффективность процесса (>85%)

### Platform Integrations
- **API Response Time** — время ответа API (<100ms)
- **Integration Success Rate** — успешность интеграций (>99%)
- **Data Consistency** — консистентность данных (>99%)

---

**Situs Service** — AI-powered платформа для создания сайтов с интеграцией в экосистему Startupus Platform. 