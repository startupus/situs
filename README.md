# 🎨 Situs Service - Visual Website Builder в экосистеме Startupus Platform

[![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)](https://github.com/startupus/situs-service)
[![License](https://img.shields.io/badge/license-MIT-green.svg)](LICENSE)
[![Status](https://img.shields.io/badge/status-MVP_Development-orange.svg)](SITUS_MVP_ADAPTATION_REPORT.md)
[![Platform](https://img.shields.io/badge/platform-Startupus_Platform-purple.svg)](https://startupus.com)

*Специализированный визуальный редактор для создания веб-сайтов, являющийся частью единой экосистемы Startupus Platform.*

## 🏢 Startupus Platform - Единая экосистема сервисов

**Startupus Platform** — это комплексная экосистема взаимосвязанных сервисов:

- **🎨 Situs Service** - Визуальный редактор для создания веб-сайтов *(текущий проект)*
- **🤖 Hubus (Хабус)** - AI и нейросети, ИИ агенты и генерация контента
- **🔐 Loginus (Логинус)** - Авторизация и управление пользователями
- **💳 Bilingus (Билингус)** - Биллинг и платежные операции

Все сервисы работают как **самостоятельные продукты**, но глубоко интегрированы между собой.

## 🎯 Project Overview

Situs Service — это MVP визуального редактора для создания сайтов, включающий:
- **Visual Drag-and-Drop Editor** - интуитивный редактор без кода  
- **Component Library** - 600+ готовых TailGrids компонентов
- **JSON Generation** - стандартизированный вывод структуры сайта
- **Multi-Domain Architecture** - поддержка множественных доменов
- **Multi-Language Support** - мультиязыковая архитектура

## 🔗 Интеграции с сервисами Startupus Platform

- **Hubus Integration** - AI генерация контента, ИИ агенты, нейросети
- **Loginus Integration** - авторизация, профили пользователей, команды
- **Bilingus Integration** - подписки, платежи, лимиты использования

## 🏗️ Архитектура в экосистеме

### MVP Focus - Visual Editor Core

| Компонент | Описание | Статус |
|-----------|----------|--------|
| **Visual Editor** | Drag-and-drop редактор | ⚠️ Research & Selection |
| **Component Library** | 600+ TailGrids компонентов | ✅ Готово |
| **JSON Generator** | Генерация структуры сайта | ⚠️ Разработка |
| **Preview Engine** | Реальный предпросмотр | ⚠️ Разработка |

### Этап 2 - Platform Integration

| Компонент | Описание | Статус |
|-----------|----------|--------|
| **Loginus Integration** | Единая авторизация | ⚠️ Планирование |
| **Hubus Integration** | AI функциональность | ⚠️ Планирование |
| **Bilingus Integration** | Биллинг и платежи | ⚠️ Планирование |

### Этап 3 - Multi-Domain Features

| Компонент | Описание | Статус |
|-----------|----------|--------|
| **Domain Manager** | Управление доменами | ⚠️ Планирование |
| **i18n Engine** | Мультиязыковая поддержка | ⚠️ Планирование |
| **Site Generator** | Генерация финальных сайтов | ⚠️ Планирование |

## 🚀 Быстрый старт

### Предварительные требования

- Node.js 18+
- React 18+
- TypeScript

### Установка

```bash
# Клонирование репозитория
git clone https://github.com/startupus/situs-service.git
cd situs-service

# Установка зависимостей
npm install

# Настройка переменных окружения
cp env.example .env

# Запуск в development режиме
npm run dev
```

### Запуск компонентов

```bash
# Запуск visual editor
npm run dev

# Запуск Storybook для компонентов
npm run storybook

# Тестирование
npm test

# Линтинг
npm run lint
```

## 📋 MVP Development Plan в экосистеме

### Этап 1: Visual Editor Foundation (Q1 2025)

#### 1.1 Research & Selection (1-2 недели)
- [ ] Исследование готовых редакторов (GrapesJS, Craft.js, Builder.io)
- [ ] POC интеграции с TailGrids компонентами
- [ ] Выбор оптимального решения

#### 1.2 Editor Integration (2-3 недели)
- [ ] Интеграция выбранного редактора
- [ ] Адаптация под TailGrids компоненты
- [ ] Кастомизация UI под бренд Startupus Platform

#### 1.3 Component Library (1-2 недели)
- [ ] Интеграция 600+ TailGrids компонентов
- [ ] Категоризация и поиск
- [ ] Preview в редакторе

#### 1.4 JSON Generation (1-2 недели)
- [ ] Создание JSON схемы
- [ ] Export/Import функциональность
- [ ] Валидация и оптимизация

### Этап 2: Platform Integration (Q2 2025)

#### 2.1 Loginus Integration (2-3 недели)
- [ ] Единая авторизация через Loginus
- [ ] User profile integration
- [ ] Team collaboration features
- [ ] SSO implementation

#### 2.2 Hubus Integration (2-3 недели)
- [ ] AI content generation
- [ ] Smart suggestions
- [ ] Component generation
- [ ] Content optimization

#### 2.3 Bilingus Integration (1-2 недели)
- [ ] Subscription management
- [ ] Usage tracking
- [ ] Feature limits
- [ ] Payment processing

### Этап 3: Multi-Domain Architecture (Q3 2025)

#### 3.1 Domain Management
- [ ] Мультидоменная архитектура
- [ ] DNS интеграция
- [ ] SSL automation

#### 3.2 Multi-Language
- [ ] i18n поддержка
- [ ] Content translation
- [ ] RTL support

#### 3.3 Site Generation
- [ ] Static site generation
- [ ] CDN интеграция
- [ ] SEO optimization

## 🛠️ Технологии

### Frontend Stack
- **Framework:** React 18 + TypeScript
- **Styling:** TailwindCSS
- **Components:** TailGrids (600+ компонентов)
- **Editor:** TBD (GrapesJS/Craft.js/Builder.io)
- **State:** Zustand
- **Testing:** Vitest + Playwright

### Platform Integration Stack
- **HTTP Client:** Axios
- **Authentication:** JWT (через Loginus)
- **i18n:** React Intl
- **Routing:** React Router
- **Forms:** React Hook Form

## 🔧 Конфигурация

### Переменные окружения

```bash
# Development
NODE_ENV=development
PORT=3000

# Startupus Platform Services
HUBUS_API_URL=http://localhost:3001
LOGINUS_API_URL=http://localhost:3002
BILINGUS_API_URL=http://localhost:3003

# Platform Configuration
PLATFORM_NAME=startupus
SERVICE_NAME=situs
PLATFORM_AUTH_ENDPOINT=http://localhost:3002/auth

# Editor Configuration
EDITOR_TYPE=grapesjs
COMPONENTS_SOURCE=tailgrids
PREVIEW_MODE=iframe

# Multi-Domain
DOMAINS_API_URL=https://api.cloudflare.com
CDN_URL=https://cdn.startupus.com

# Development Tools
STORYBOOK_PORT=6006
VITE_DEV_SERVER_PORT=5173
```

## 📋 Тестирование

### Статистика покрытия тестами

- **Component Library:** 100% ✅ (готовые TailGrids компоненты)
- **Visual Editor:** ⚠️ После выбора редактора
- **JSON Generator:** ⚠️ После разработки
- **Platform Integration:** ⚠️ После интеграций

### Запуск тестов

```bash
# Unit тесты
npm test

# E2E тесты
npm run test:e2e

# Component тесты в Storybook
npm run test:storybook

# Visual regression тесты
npm run test:visual

# Platform integration тесты
npm run test:integration
```

## 🤝 Участие в разработке

### Workflow для MVP в экосистеме

1. **Research Phase** - выбор и тестирование решений
2. **Implementation** - интеграция выбранного редактора
3. **Component Integration** - подключение TailGrids
4. **Platform Integration** - интеграция с сервисами Startupus
5. **Testing** - комплексное тестирование
6. **Documentation** - обновление документации

### Стандарты кода

- **TypeScript Strict Mode** - обязательно
- **ESLint + Prettier** - автоматическое форматирование
- **Component Documentation** - Storybook для всех компонентов
- **Test Coverage >80%** - для критического пути
- **Platform Integration Tests** - тестирование интеграций

## 🏆 Готовые компоненты

### ✅ **TailGrids Component Library - 100% Ready**

Готовая библиотека 600+ компонентов:

- **📦 Categories**: Hero, Features, Testimonials, Pricing, Contact, Footer
- **🎨 Modern Design**: TailwindCSS styling
- **📱 Responsive**: Адаптивность для всех устройств
- **⚡ Performance**: Оптимизированные компоненты
- **🔧 Customizable**: Легкая кастомизация

### ✅ **Development Infrastructure - Ready**

Настроенная инфраструктура разработки:

- **🏗️ Build System**: Vite + TypeScript
- **🧪 Testing**: Vitest + Playwright
- **📚 Documentation**: Storybook
- **🔍 Code Quality**: ESLint + Prettier
- **📦 Package Management**: npm

### ✅ **Platform Integration Foundation - Ready**

Готовая основа для интеграций:

- **🔗 API Client**: Axios для внешних сервисов
- **🔐 Auth Flow**: JWT интеграция с Loginus
- **💳 Billing**: Интеграция с Bilingus
- **🤖 AI**: Интеграция с Hubus

## 🎯 Roadmap в экосистеме

### Q1 2025: Situs Service MVP
- [x] Project setup и infrastructure
- [x] TailGrids component library готов
- [ ] Visual editor research & selection
- [ ] Editor integration
- [ ] JSON generation engine

### Q2 2025: Platform Integration
- [ ] Loginus integration (авторизация)
- [ ] Hubus integration (AI функциональность)
- [ ] Bilingus integration (биллинг)
- [ ] Cross-service features

### Q3 2025: Multi-Domain Platform
- [ ] Domain management system
- [ ] Multi-language support
- [ ] Site generation engine
- [ ] Advanced platform features

### Q4 2025: Enterprise & Scale
- [ ] Performance optimization
- [ ] Security hardening  
- [ ] White-label solutions
- [ ] Enterprise integrations

## 🔗 Ссылки на другие сервисы платформы

- **🤖 Hubus:** [AI и нейросети](https://github.com/startupus/hubus)
- **🔐 Loginus:** [Авторизация](https://github.com/startupus/loginus)
- **💳 Bilingus:** [Биллинг](https://github.com/startupus/bilingus)
- **🏢 Platform:** [Startupus Platform](https://startupus.com)

## 📄 Лицензия

MIT License. See [LICENSE](LICENSE) for details.

## 💬 Поддержка

- **Issues:** [GitHub Issues](https://github.com/startupus/situs-service/issues)
- **Documentation:** [Platform Wiki](https://github.com/startupus/platform/wiki)
- **Community:** [Discord Server](https://discord.gg/startupus)
- **Platform:** [Startupus Platform](https://startupus.com)

---

**Situs Service** - часть экосистемы **Startupus Platform** 🚀
