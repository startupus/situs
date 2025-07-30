# 🚀 Situs API Server

Полнофункциональный REST API сервер для платформы Situs, построенный на основе архитектурных принципов [Strapi](https://github.com/strapi).

## ✨ Особенности

- 🏗️ **Модульная архитектура** - Контроллеры, Сервисы, Middleware по образцу Strapi
- 🔐 **JWT аутентификация** - Безопасная авторизация с ролевой моделью
- ✅ **Валидация данных** - Zod схемы для всех endpoints
- 🛡️ **Безопасность** - Helmet, CORS, Rate Limiting
- 📊 **Аналитика** - Встроенные endpoints для получения статистики
- 🔧 **TypeScript** - Полная типизация и автокомплит
- 🧪 **Тестирование** - Unit и Integration тесты
- 📖 **Документация** - Swagger/OpenAPI (планируется)

## 🛠 Архитектура

```
src/api/
├── config/
│   └── environment.ts      # Конфигурация окружения (как в Strapi)
├── controllers/            # REST API контроллеры
│   ├── AuthController.ts
│   ├── UserController.ts
│   ├── ProjectController.ts
│   ├── PageController.ts
│   └── AnalyticsController.ts
├── services/              # Бизнес-логика (как в Strapi)
│   ├── UserService.ts
│   ├── ProjectService.ts
│   └── PageService.ts
├── middleware/            # Express middleware
│   ├── auth.middleware.ts
│   ├── validation.middleware.ts
│   └── error.middleware.ts
├── routes/               # API маршруты
│   ├── index.ts
│   ├── auth.routes.ts
│   ├── users.routes.ts
│   ├── projects.routes.ts
│   ├── pages.routes.ts
│   └── analytics.routes.ts
├── validation/           # Zod схемы валидации
└── __tests__/           # API тесты
    └── api.test.ts
```

## 🚀 Быстрый старт

### 1. Конфигурация

Создайте `.env` файл на основе `.env.example`:

```bash
cp .env.example .env
```

Обязательные переменные:
```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/situs_dev"
JWT_SECRET="your-super-secret-jwt-key-here"
```

### 2. Установка зависимостей

```bash
npm install
```

### 3. Настройка базы данных

```bash
# Генерация Prisma клиента
npm run db:generate

# Применение миграций
npm run db:push

# Заполнение тестовыми данными
npm run db:seed
```

### 4. Запуск сервера

```bash
# Режим разработки
npm run api:dev

# Сборка для продакшена
npm run api:build

# Запуск в продакшене
npm run api:start
```

## 📡 API Endpoints

### 🔐 Аутентификация

```http
POST /api/auth/register       # Регистрация пользователя
POST /api/auth/login          # Авторизация
POST /api/auth/logout         # Выход
GET  /api/auth/me            # Информация о текущем пользователе
POST /api/auth/refresh       # Обновление токена
```

### 👥 Пользователи

```http
GET    /api/users             # Список пользователей (только админы)
GET    /api/users/:id         # Пользователь по ID
POST   /api/users             # Создание пользователя (только админы)
PUT    /api/users/:id         # Обновление пользователя
DELETE /api/users/:id         # Удаление пользователя (только админы)
GET    /api/users/statistics  # Статистика пользователей
```

### 📁 Проекты

```http
GET    /api/projects          # Список проектов
GET    /api/projects/:id      # Проект по ID
POST   /api/projects          # Создание проекта
PUT    /api/projects/:id      # Обновление проекта
DELETE /api/projects/:id      # Удаление проекта
GET    /api/projects/statistics # Статистика проектов
```

### 📄 Страницы

```http
GET    /api/pages             # Список страниц
GET    /api/pages/:id         # Страница по ID
POST   /api/pages             # Создание страницы
PUT    /api/pages/:id         # Обновление страницы
DELETE /api/pages/:id         # Удаление страницы
```

### 📊 Аналитика

```http
GET /api/analytics/user-growth       # Рост пользователей
GET /api/analytics/project-distribution # Распределение проектов
GET /api/analytics/revenue           # Данные о доходах
GET /api/analytics/activity          # Последняя активность
```

### 🔍 Системные

```http
GET /api/health              # Health check
GET /api                     # Информация об API
```

## 🔑 Аутентификация

API использует JWT токены для аутентификации:

```javascript
// Авторизация
const response = await fetch('/api/auth/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ email: 'user@example.com', password: 'password' })
});

const { token } = await response.json();

// Использование токена
const protectedResponse = await fetch('/api/users', {
  headers: { 'Authorization': `Bearer ${token}` }
});
```

## 🛡️ Роли и права доступа

### Роли пользователей

- **USER** - Базовые права (создание и управление своими проектами)
- **MODERATOR** - Расширенные права (модерация контента)
- **ADMIN** - Полные права (управление всей системой)

### Защищенные маршруты

- 🔒 **Требуют аутентификации** - Все API маршруты кроме `/health`, `/`, `/auth/login`, `/auth/register`
- 👑 **Только админы** - `/users` (список, создание, удаление), `/analytics/*`
- 🏠 **Владелец ресурса** - Редактирование/удаление собственных проектов и страниц

## 📝 Примеры использования

### Создание проекта

```javascript
const project = await fetch('/api/projects', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    name: 'Мой новый проект',
    description: 'Описание проекта',
    category: 'website'
  })
});
```

### Получение аналитики

```javascript
const analytics = await fetch('/api/analytics/user-growth?period=30d', {
  headers: { 'Authorization': `Bearer ${token}` }
});

const data = await analytics.json();
console.log(data.data); // Массив данных для графика
```

## 🧪 Тестирование

```bash
# Запуск всех тестов
npm test

# Запуск только API тестов
npm test src/api/__tests__

# Тесты с покрытием
npm run test:coverage
```

## 🔧 Конфигурация

### Environment переменные

| Переменная | Описание | По умолчанию |
|------------|----------|--------------|
| `DATABASE_URL` | URL PostgreSQL базы данных | - |
| `JWT_SECRET` | Секретный ключ для JWT | - |
| `JWT_EXPIRES_IN` | Время жизни JWT токена | `7d` |
| `PORT` | Порт API сервера | `3001` |
| `NODE_ENV` | Окружение | `development` |
| `FRONTEND_URL` | URL фронтенд приложения | `http://localhost:3000` |
| `CORS_ORIGINS` | Разрешенные CORS источники | `http://localhost:3000` |
| `BCRYPT_SALT_ROUNDS` | Раунды шифрования bcrypt | `12` |

### Безопасность

```env
# Минимальные требования к JWT_SECRET
JWT_SECRET="minimum-32-characters-long-secret-key"

# Рекомендуемая настройка для продакшена
NODE_ENV="production"
BCRYPT_SALT_ROUNDS=15
RATE_LIMIT_MAX=50
```

## 🐛 Отладка

### Логирование

```bash
# Debug режим
LOG_LEVEL=debug npm run api:dev

# Только ошибки
LOG_LEVEL=error npm run api:start
```

### Распространенные проблемы

1. **Ошибка подключения к БД**
   ```bash
   # Проверьте DATABASE_URL
   npx prisma db push
   ```

2. **JWT ошибки**
   ```bash
   # Убедитесь, что JWT_SECRET установлен и имеет достаточную длину
   echo $JWT_SECRET | wc -c  # Должно быть >= 32
   ```

3. **CORS ошибки**
   ```bash
   # Проверьте CORS_ORIGINS
   curl -H "Origin: http://localhost:3000" http://localhost:3001/api/health
   ```

## 🔗 Интеграция с фронтендом

API полностью интегрирован с фронтенд компонентами Situs:

- **ApiClient.ts** - Централизованный клиент для всех запросов
- **SitusDashboard** - Реальные данные из `/api/analytics/*`
- **SitusProjects** - CRUD операции через `/api/projects`
- **SitusUsers** - Управление пользователями через `/api/users`

## 🚀 Деплой

### Docker (рекомендуется)

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY dist/api ./
EXPOSE 3001
CMD ["node", "server.js"]
```

### Традиционный деплой

```bash
# Сборка
npm run api:build

# Загрузка на сервер
scp -r dist/api user@server:/opt/situs-api/

# Запуск
NODE_ENV=production npm run api:start
```

## 📚 Дополнительные ресурсы

- [Strapi Documentation](https://docs.strapi.io/) - Вдохновение для архитектуры
- [Prisma Docs](https://www.prisma.io/docs/) - ORM документация
- [JWT.io](https://jwt.io/) - Работа с JWT токенами
- [Zod](https://zod.dev/) - Валидация схем

## 🤝 Contribution

API построен по принципам Strapi - модульности, расширяемости и простоты использования. При добавлении новых функций следуйте установленным паттернам:

1. **Контроллеры** - только HTTP логика
2. **Сервисы** - вся бизнес-логика
3. **Middleware** - переиспользуемая функциональность
4. **Тесты** - для каждого нового endpoint

---

**API готов к продакшену** ✅ - полная интеграция с фронтендом, безопасность, тестирование и документация.