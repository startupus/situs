# 🚀 Situs Backend - Профессиональный бэкенд на основе архитектуры Strapi

Профессиональный бэкенд для платформы Situs, построенный на основе архитектурных принципов Strapi, но адаптированный под специфику нашего проекта.

## 🏗️ Архитектура

### Основные принципы
- **Модульная архитектура** - каждый функциональный блок изолирован
- **RESTful API** - стандартные HTTP методы и статусы
- **TypeScript** - строгая типизация для надежности
- **Middleware подход** - гибкая обработка запросов
- **Graceful shutdown** - корректное завершение работы

### Структура проекта
```
backend/
├── src/
│   ├── routes/          # API маршруты
│   │   ├── projects.ts  # Управление проектами
│   │   ├── users.ts     # Управление пользователями
│   │   └── auth.ts      # Аутентификация
│   ├── middleware/      # Промежуточное ПО
│   ├── services/        # Бизнес-логика
│   ├── utils/           # Утилиты
│   └── index.ts         # Главный файл сервера
├── prisma/              # Схема базы данных
├── package.json
└── tsconfig.json
```

## 🚀 Быстрый старт

### Установка зависимостей
```bash
cd backend
npm install
```

### Запуск в режиме разработки
```bash
npm run dev
```

### Сборка для продакшена
```bash
npm run build
npm start
```

## 📋 API Endpoints

### Проекты (`/api/projects`)

#### GET `/api/projects`
Получить список проектов с фильтрацией и пагинацией

**Параметры:**
- `search` - поиск по названию и описанию
- `type` - фильтр по типу проекта
- `sortBy` - сортировка (name, updated, created)
- `sortOrder` - порядок сортировки (asc, desc)
- `page` - номер страницы
- `limit` - количество элементов на странице

**Ответ:**
```json
{
  "success": true,
  "data": {
    "projects": [...],
    "pagination": {
      "page": 1,
      "limit": 10,
      "total": 2,
      "totalPages": 1
    }
  }
}
```

#### GET `/api/projects/:id`
Получить конкретный проект

#### POST `/api/projects`
Создать новый проект

**Тело запроса:**
```json
{
  "name": "Название проекта",
  "description": "Описание проекта",
  "domain": "example.com",
  "template": "website",
  "settings": {
    "theme": "auto",
    "primaryColor": "#3B82F6"
  }
}
```

#### PUT `/api/projects/:id`
Обновить проект

#### DELETE `/api/projects/:id`
Удалить проект

### Пользователи (`/api/users`)

#### GET `/api/users`
Получить список пользователей

#### GET `/api/users/:id`
Получить пользователя по ID

#### POST `/api/users`
Создать нового пользователя

### Аутентификация (`/api/auth`)

#### POST `/api/auth/login`
Вход в систему

**Тело запроса:**
```json
{
  "email": "admin@situs.com",
  "password": "password"
}
```

#### POST `/api/auth/register`
Регистрация нового пользователя

#### GET `/api/auth/me`
Получить текущего пользователя

#### POST `/api/auth/logout`
Выход из системы

## 🔧 Конфигурация

### Переменные окружения
Создайте файл `.env` в корне backend:

```env
# Основные настройки
NODE_ENV=development
PORT=3001

# База данных
DATABASE_URL=postgresql://user:password@localhost:5432/situs_db

# JWT
JWT_SECRET=your-super-secret-jwt-key-minimum-32-characters

# CORS
FRONTEND_URL=http://localhost:5173

# Логирование
LOG_LEVEL=info

# Безопасность
SESSION_SECRET=your-session-secret-minimum-32-characters
COOKIE_SECURE=false

# Файлы
UPLOAD_PATH=./uploads
MAX_FILE_SIZE=10485760

# Redis (для кэширования и очередей)
REDIS_URL=redis://localhost:6379

# Email
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password

# AWS S3 (для файлов)
AWS_ACCESS_KEY_ID=your-access-key
AWS_SECRET_ACCESS_KEY=your-secret-key
AWS_REGION=us-east-1
AWS_S3_BUCKET=situs-uploads
```

## 🛡️ Безопасность

### Middleware
- **Helmet** - защита заголовков HTTP
- **CORS** - настройка кросс-доменных запросов
- **Rate Limiting** - ограничение частоты запросов
- **Compression** - сжатие ответов

### Аутентификация
- JWT токены для аутентификации
- Хеширование паролей с bcrypt
- Защищенные маршруты

## 📊 Мониторинг

### Health Check
```
GET /health
```

**Ответ:**
```json
{
  "status": "ok",
  "timestamp": "2024-12-23T15:30:00Z",
  "uptime": 123.456,
  "environment": "development"
}
```

## 🔄 Интеграция с фронтендом

### Проксирование
Фронтенд настроен для проксирования всех `/api` запросов к бэкенду:

```typescript
// vite.config.ts
proxy: {
  '/api': {
    target: 'http://localhost:3001',
    changeOrigin: true,
    secure: false,
  }
}
```

### Запуск полного стека
```bash
# В корне проекта
npm run dev:full
```

Это запустит и фронтенд, и бэкенд одновременно.

## 🧪 Тестирование

### Запуск тестов
```bash
npm test
```

### Тесты в режиме наблюдения
```bash
npm run test:watch
```

## 📝 Логирование

Используется Winston для структурированного логирования:

- **Error** - ошибки приложения
- **Warn** - предупреждения
- **Info** - информационные сообщения
- **Debug** - отладочная информация

## 🚀 Развертывание

### Docker
```bash
docker build -t situs-backend .
docker run -p 3001:3001 situs-backend
```

### PM2
```bash
npm install -g pm2
pm2 start dist/index.js --name situs-backend
```

## 🔧 Разработка

### Добавление новых маршрутов
1. Создайте файл в `src/routes/`
2. Экспортируйте router
3. Подключите в `src/index.ts`

### Добавление middleware
1. Создайте файл в `src/middleware/`
2. Подключите в нужных маршрутах

### Добавление сервисов
1. Создайте файл в `src/services/`
2. Экспортируйте класс или функции
3. Используйте в контроллерах

## 📚 Дополнительные ресурсы

- [Express.js документация](https://expressjs.com/)
- [TypeScript документация](https://www.typescriptlang.org/)
- [Prisma документация](https://www.prisma.io/)
- [Strapi архитектура](https://strapi.io/)

---

**Разработано для платформы Situs**  
**Версия:** 1.0.0  
**Лицензия:** MIT 