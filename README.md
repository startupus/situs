# 🏗️ Situs Platform

> **Полнофункциональная платформа для создания и управления веб-проектами с визуальным редактором и микросервисной архитектурой**

![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=flat&logo=typescript&logoColor=white)
![React](https://img.shields.io/badge/React-20232A?style=flat&logo=react&logoColor=61DAFB)
![Node.js](https://img.shields.io/badge/Node.js-43853D?style=flat&logo=node.js&logoColor=white)
![Prisma](https://img.shields.io/badge/Prisma-3982CE?style=flat&logo=Prisma&logoColor=white)

## 🚀 Что реализовано

### 🎯 Situs Platform - Админ-панель
- ✅ **Современный дашборд** - статистики, метрики, графики на ApexCharts
- ✅ **Система проектов** - создание, управление сайтами/магазинами/чат-ботами
- ✅ **Управление пользователями** - CRUD операции, роли, права доступа
- ✅ **Система уведомлений** - real-time нотификации с типизацией
- ✅ **Адаптивный дизайн** - полная поддержка мобильных устройств
- ✅ **Темная/светлая тема** - переключение с сохранением предпочтений

### 🎨 Redaktus Studio - Визуальный редактор
- ✅ **Drag & Drop редактор** - визуальное создание страниц
- ✅ **Библиотека компонентов** - 600+ готовых TailGrids компонентов
- ✅ **Система тем** - независимое переключение интерфейса и канваса
- ✅ **FormBuilder** - конструктор форм с валидацией
- ✅ **Медиа-библиотека** - управление изображениями и файлами
- ✅ **Превью режим** - предварительный просмотр страниц

### 🏗️ Backend Architecture - Strapi-like
- ✅ **Архитектура Strapi** - service/controller/middleware слои
- ✅ **Content Types** - динамические типы контента с валидацией
- ✅ **RESTful API** - полноценные CRUD операции для всех сущностей
- ✅ **Валидация данных** - Joi схемы для всех входящих данных
- ✅ **Mock система** - реалистичные данные для разработки

### 🔧 Микросервисная архитектура
- ✅ **Users Service** - управление пользователями и ролями
- ✅ **Projects Service** - управление проектами и сайтами  
- ✅ **Environment валидация** - Zod схемы для конфигурации
- ✅ **Логирование** - Winston для всех сервисов
- 🔗 **Внешние интеграции** - Hubus, Gateway, Bilingus (внешние API)

## 🛠️ Технологический стек

### Frontend
```typescript
"react": "^18.3.1"           // UI библиотека
"typescript": "^5.5.3"       // Строгая типизация  
"tailwindcss": "^3.4.1"      // Utility-first CSS
"react-router-dom": "^6.26.0" // Роутинг
"apexcharts": "^3.50.0"      // Графики и диаграммы
"react-icons": "^5.2.1"      // Иконки
"@types/node": "^20.14.8"    // Node.js типы
```

### Backend
```typescript
"express": "^4.19.2"         // Web фреймворк
"prisma": "^5.16.1"          // ORM и миграции
"joi": "^17.13.3"            // Валидация данных
"winston": "^3.13.1"         // Логирование
"helmet": "^7.1.0"           // Безопасность
"cors": "^2.8.5"             // CORS политики
"jsonwebtoken": "^9.0.2"     // JWT аутентификация
```

### Инфраструктура
```typescript
"vite": "^5.3.1"             // Сборщик для фронтенда
"nodemon": "^3.1.4"          // Dev сервер для бэкенда
"concurrently": "^8.2.2"     // Параллельный запуск сервисов
"zod": "^3.23.8"             // Валидация окружения
```

## 📁 Структура проекта

```
Situs/
├── src/                              # Frontend исходники
│   ├── components/
│   │   ├── situs/                    # 🎯 Situs Platform
│   │   │   ├── layouts/              # Основные лейауты
│   │   │   ├── Header/               # Хедер с уведомлениями
│   │   │   ├── Sidebar/              # Навигация и меню
│   │   │   ├── pages/                # Страницы дашборда
│   │   │   └── components/           # UI компоненты
│   │   └── redaktus/                 # 🎨 Redaktus Studio
│   │       ├── redaktus-core.tsx     # Главный редактор
│   │       ├── website/              # Компоненты сайтов
│   │       ├── config/               # Конфигурация
│   │       └── starter-components/   # Стартовые компоненты
│   ├── api/                          # API клиенты
│   │   ├── services/                 # Сервисы для запросов
│   │   └── mockData.ts               # Mock данные
│   ├── contexts/                     # React контексты
│   ├── hooks/                        # Кастомные хуки
│   └── types/                        # TypeScript типы
│
├── backend/                          # 🏗️ Backend Strapi-like
│   ├── src/
│   │   ├── api/                      # API endpoints
│   │   │   └── project/              # Проекты API
│   │   │       ├── routes/           # Маршруты
│   │   │       ├── controllers/      # Контроллеры
│   │   │       └── services/         # Сервисы
│   │   ├── content-types/            # Типы контента
│   │   ├── middlewares/              # Middleware
│   │   ├── utils/                    # Утилиты
│   │   └── config/                   # Конфигурация
│   └── package.json                  # Backend зависимости
│
├── services/                         # 🔧 Микросервисы
│   ├── users-service/                # Управление пользователями
│   └── projects-service/             # Управление проектами
│
├── __tests__/                        # Тесты
│   ├── security/                     # Тесты безопасности
│   └── integration/                  # Интеграционные тесты
│
└── docs/                             # Документация
    ├── api/                          # API документация
    └── guides/                       # Руководства
```

## 🚀 Быстрый старт

### Установка зависимостей
```bash
# Установка фронтенд зависимостей
npm install

# Установка backend зависимостей  
npm run backend:install

# Установка микросервисов  
cd services/users-service && npm install
cd services/projects-service && npm install
```

### Разработка
```bash
# Запуск фронтенда + бэкенда
npm run dev:full

# Только фронтенд (порт 5173)
npm run dev

# Только бэкенд (порт 3001)  
npm run backend:dev

# Микросервисы (в отдельных терминалах)
cd services/users-service && npm run dev
cd services/projects-service && npm run dev
```

### Сборка
```bash
# Сборка фронтенда
npm run build

# Сборка бэкенда
npm run backend:build
```

## 🧪 Тестирование

```bash
# Все тесты
npm test

# Тесты с покрытием
npm run test:coverage

# E2E тесты
npm run test:e2e

# Тесты безопасности
npm run test:security
```

## 📚 Ключевые компоненты

### 🎯 Situs Platform
- **SitusMainLayout** - основной лейаут с sidebar и header
- **SitusDashboard** - дашборд с метриками и графиками  
- **SitusProjects** - управление проектами всех типов
- **SitusUsers** - CRUD система пользователей с ролями

### 🎨 Redaktus Studio  
- **RedaktusCore** - главный визуальный редактор
- **ComponentViewer** - просмотрщик библиотеки компонентов
- **FormBuilder** - конструктор форм с валидацией
- **MediaLibrary** - файловый менеджер

### 🏗️ Backend API
- **Project API** - CRUD для проектов (`/api/projects`)
- **User API** - управление пользователями (`/api/users`)  
- **Auth API** - аутентификация (`/api/auth`)
- **Content Types** - динамические схемы данных

## 🔧 Конфигурация

### Environment переменные
```bash
# Frontend
VITE_API_URL=http://localhost:3001

# Backend  
PORT=3001
DATABASE_URL="postgresql://..."
JWT_SECRET="your-secret-key"

# Микросервисы
USERS_SERVICE_PORT=3002
PROJECTS_SERVICE_PORT=3003

# Внешние сервисы (API endpoints)
HUBUS_API_URL=https://api.hubus.com
GATEWAY_API_URL=https://api.gateway.com  
BILINGUS_API_URL=https://api.bilingus.com
```

### База данных
```bash
# Prisma миграции
npx prisma migrate dev

# Генерация клиента
npx prisma generate

# Заполнение тестовыми данными
npx prisma db seed
```

## 🎨 Система тем

Проект поддерживает независимое переключение тем:
- **Интерфейс** - темная/светлая тема для UI
- **Редактор** - отдельная тема для canvas
- **Система** - автоматическое определение темы браузера

```typescript
// Использование хуков тем
const { theme, setTheme } = useTheme()          // Интерфейс
const { canvasTheme, setCanvasTheme } = useCanvasTheme() // Редактор
```

## 📖 Документация

- 📋 **[TODO.md](./TODO.md)** - текущие задачи разработки
- 📁 **[TODO_ARCHIVE.md](./TODO_ARCHIVE.md)** - архив выполненных задач  
- 🏗️ **[ПРОЕКТ_ИНФО.md](./ПРОЕКТ_ИНФО.md)** - бизнес-информация о проекте
- 🎨 **[EDITOR_THEME_FIXES.md](./EDITOR_THEME_FIXES.md)** - исправления тем редактора

## 🤝 Разработка

### Git workflow
```bash
# Создание фича ветки
git checkout -b feature/название-фичи

# Коммит изменений
git commit -m "feat: описание изменений"

# Пуш и создание PR
git push origin feature/название-фичи
```

### Code style
- **TypeScript** - строгая типизация без `any`
- **ESLint** - линтинг кода по стандартам проекта
- **Prettier** - автоформатирование кода
- **Conventional Commits** - стандарт коммитов

---

## 🏆 Статус проекта

✅ **Фронтенд** - полностью функционален  
✅ **Backend** - Strapi архитектура готова  
✅ **Микросервисы** - базовая инфраструктура  
🔄 **База данных** - интеграция с PostgreSQL  
🔄 **Аутентификация** - JWT система  
🔄 **Deployment** - Docker + CI/CD  

**Текущая версия:** `v0.8.0-beta`  
**Последнее обновление:** 30.07.2025
