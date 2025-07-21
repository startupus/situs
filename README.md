# Situs Service — Платформа для создания сайтов при помощи ИИ

[![Startupus Platform](https://img.shields.io/badge/Startupus-Platform-blue.svg)](https://github.com/startupus)
[![Hubus Integration](https://img.shields.io/badge/Hubus-Integration-green.svg)](https://github.com/startupus/hubus)
[![Loginus Integration](https://img.shields.io/badge/Loginus-Integration-orange.svg)](https://github.com/startupus/loginus)
[![Bilingus Integration](https://img.shields.io/badge/Bilingus-Integration-purple.svg)](https://github.com/startupus/bilingus)

**Situs Service** — это инновационная платформа для создания сайтов при помощи искусственного интеллекта, оснащённая интуитивным редактором Редактус. Является ключевым компонентом экосистемы **Startupus Platform**.

## 🎯 Основные возможности

- **🤖 ИИ-генерация сайтов** — создание полнофункциональных сайтов на основе текстового описания
- **✏️ Интуитивный редактор Редактус** — простое и понятное редактирование сгенерированного контента
- **🧩 Компонентная библиотека** — 600+ готовых компонентов TailGrids
- **🌐 Мультидоменность** — поддержка множественных доменов и языков
- **🔗 Экосистемная интеграция** — глубокая интеграция с Hubus, Loginus, Bilingus

## 🏗️ Архитектура

```mermaid
graph TB
    subgraph "Situs Service"
        AI[ИИ-генератор сайтов]
        Editor[Редактор Редактус]
        Components[Компонентная библиотека]
        Generator[Генератор JSON]
        Domains[Управление доменами]
        I18n[Мультиязычность]
    end
    
    subgraph "Startupus Platform"
        Hubus[Hubus - ИИ сервисы]
        Loginus[Loginus - Аутентификация]
        Bilingus[Bilingus - Платежи]
    end
    
    AI --> Hubus
    Editor --> Components
    Generator --> Domains
    Domains --> I18n
    
    AI -.-> Loginus
    Editor -.-> Loginus
    Generator -.-> Bilingus
```

## 🚀 Быстрый старт

### Предварительные требования

- Node.js 18+
- Docker & Docker Compose
- Git

### Установка и запуск

```bash
# Клонирование репозитория
git clone https://github.com/startupus/situs.git
cd situs

# Установка зависимостей
npm install

# Настройка окружения
cp env.example .env
# Отредактируйте .env файл

# Запуск в Docker
docker-compose up -d

# Или локальный запуск
npm run dev
```

### Переменные окружения

```bash
# Основные настройки
NODE_ENV=development
PORT=3000

# Интеграции с Startupus Platform
HUBUS_API_URL=https://api.hubus.startupus.com
LOGINUS_API_URL=https://api.loginus.startupus.com
BILINGUS_API_URL=https://api.bilingus.startupus.com

# ИИ-генерация
OPENAI_API_KEY=your_openai_key
ANTHROPIC_API_KEY=your_anthropic_key

# База данных (для локального хранения проектов)
DATABASE_URL=postgresql://user:password@localhost:5432/situs

# Аутентификация
JWT_SECRET=your_jwt_secret
```

## 📁 Структура проекта

```
src/
├── ai/                    # ИИ-генератор сайтов
│   ├── generator/         # Основная логика генерации
│   ├── prompts/          # Промпты для ИИ
│   └── templates/        # Шаблоны сайтов
├── editor/               # Редактор Редактус
│   ├── core/            # Основной движок редактора
│   ├── canvas/          # Холст для редактирования
│   ├── toolbar/         # Панель инструментов
│   └── panels/          # Боковые панели
├── components/           # Компонентная библиотека
│   ├── library/         # Основная библиотека
│   ├── categories/      # Категории компонентов
│   └── custom/          # Пользовательские компоненты
├── generator/            # Генератор JSON
│   ├── json/            # JSON схемы
│   ├── static/          # Статическая генерация
│   └── export/          # Экспорт сайтов
├── platform/             # Интеграции с платформой
│   ├── hubus/           # Интеграция с Hubus
│   ├── loginus/         # Интеграция с Loginus
│   └── bilingus/        # Интеграция с Bilingus
├── domains/              # Управление доменами
│   ├── management/      # Управление доменами
│   ├── dns/             # DNS интеграция
│   └── ssl/             # SSL сертификаты
├── i18n/                 # Мультиязычность
│   ├── locales/         # Локализации
│   ├── translation/     # Система переводов
│   └── rtl/             # Поддержка RTL
└── ui/                   # Пользовательский интерфейс
    ├── common/          # Общие компоненты
    ├── layout/          # Макеты
    └── forms/           # Формы
```

## 🔧 Технологический стек

### Frontend
- **React 18** — основной фреймворк
- **TypeScript** — типизация
- **TailwindCSS** — стилизация
- **Zustand** — управление состоянием
- **React Router** — маршрутизация

### Backend
- **Node.js** — серверная платформа
- **Express** — веб-фреймворк
- **Prisma** — ORM для базы данных
- **PostgreSQL** — основная база данных

### ИИ и интеграции
- **OpenAI API** — генерация контента
- **Anthropic API** — продвинутая генерация
- **Hubus API** — интеграция с ИИ-сервисами
- **Loginus API** — аутентификация
- **Bilingus API** — платежи

### Инструменты разработки
- **Docker** — контейнеризация
- **Vitest** — тестирование
- **Playwright** — E2E тесты
- **ESLint** — линтинг
- **Prettier** — форматирование

## 🚀 MVP План разработки

### Этап 1: ИИ-генерация сайтов (Q1 2025)

#### 1.1 ИИ-генератор (2-3 недели)
- [ ] Интеграция с Hubus API
- [ ] Создание промптов для генерации сайтов
- [ ] Базовые шаблоны сайтов
- [ ] Генерация структуры и контента

#### 1.2 Редактор Редактус (2-3 недели)
- [ ] Базовый интерфейс редактора
- [ ] Drag-and-drop функциональность
- [ ] Интеграция с компонентной библиотекой
- [ ] Редактирование сгенерированного контента

#### 1.3 Компонентная библиотека (1-2 недели)
- [ ] Интеграция 600+ TailGrids компонентов
- [ ] Категоризация и поиск компонентов
- [ ] Preview компонентов
- [ ] Пользовательские компоненты

#### 1.4 JSON генератор (1-2 недели)
- [ ] Схема JSON для сайтов
- [ ] Генерация JSON из редактора
- [ ] Валидация и оптимизация
- [ ] Export/Import функциональность

### Этап 2: Платформенная интеграция (Q2 2025)

#### 2.1 Loginus интеграция (2-3 недели)
- [ ] Единая аутентификация
- [ ] Управление профилями пользователей
- [ ] Командная работа
- [ ] SSO реализация

#### 2.2 Hubus интеграция (2-3 недели)
- [ ] Расширенная ИИ-генерация
- [ ] Умные предложения
- [ ] Генерация компонентов
- [ ] Оптимизация контента

#### 2.3 Bilingus интеграция (1-2 недели)
- [ ] Управление подписками
- [ ] Отслеживание использования
- [ ] Ограничения по тарифам
- [ ] Обработка платежей

### Этап 3: Мультидоменность и масштабирование (Q3 2025)

#### 3.1 Управление доменами (3-4 недели)
- [ ] Архитектура мультидоменной системы
- [ ] UI управления доменами
- [ ] DNS интеграция
- [ ] Автоматизация SSL сертификатов

#### 3.2 Мультиязычность (2-3 недели)
- [ ] i18n архитектура
- [ ] Переключение языков в редакторе
- [ ] Управление переводами контента
- [ ] Поддержка RTL

#### 3.3 Генерация сайтов (3-4 недели)
- [ ] Статическая генерация из JSON
- [ ] CDN интеграция
- [ ] SEO оптимизация
- [ ] Оптимизация производительности

## 🧪 Тестирование

```bash
# Unit тесты
npm run test

# E2E тесты
npm run test:e2e

# Покрытие кода
npm run test:coverage

# Линтинг
npm run lint

# Типы
npm run type-check
```

## 📚 Документация

- [API Documentation](./docs/api/README.md)
- [Component Library](./docs/components/README.md)
- [Editor Guide](./docs/editor/README.md)
- [Platform Integration](./docs/platform/README.md)
- [Deployment Guide](./docs/deployment/README.md)

## 🔗 Связанные проекты

- [Hubus](https://github.com/startupus/hubus) — ИИ-сервисы и генерация контента
- [Loginus](https://github.com/startupus/loginus) — Аутентификация и управление пользователями
- [Bilingus](https://github.com/startupus/bilingus) — Платежи и биллинг

## 🤝 Вклад в проект

1. Форкните репозиторий
2. Создайте ветку для новой функции (`git checkout -b feature/amazing-feature`)
3. Зафиксируйте изменения (`git commit -m 'Add amazing feature'`)
4. Отправьте в ветку (`git push origin feature/amazing-feature`)
5. Откройте Pull Request

## 📄 Лицензия

Этот проект лицензирован под MIT License — см. файл [LICENSE](LICENSE) для деталей.

## 🆘 Поддержка

- **Документация**: [docs.startupus.com](https://docs.startupus.com)
- **Сообщество**: [community.startupus.com](https://community.startupus.com)
- **Email**: support@startupus.com

---

**Situs Service** — революционная платформа, которая делает создание сайтов доступным каждому через силу искусственного интеллекта и интуитивного редактирования.
