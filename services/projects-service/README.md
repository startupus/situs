# 🏗️ Projects Service

Микросервис для управления проектами в экосистеме Situs Platform. Отвечает за создание, редактирование, публикацию и управление веб-проектами пользователей.

## 🚀 Особенности

- **Полное CRUD управление проектами** - создание, чтение, обновление, удаление
- **Мультипользовательность** - изоляция проектов по пользователям
- **Система статусов** - DRAFT, DEVELOPMENT, STAGING, PUBLISHED, ARCHIVED
- **Домены и поддомены** - поддержка собственных доменов и поддоменов Situs
- **Настройки проектов** - темы, языки, типы создания (ручной/AI)
- **Валидация данных** - строгая валидация с Joi
- **JWT аутентификация** - безопасная авторизация
- **Логирование и мониторинг** - подробные логи всех операций
- **Rate limiting** - защита от злоупотреблений
- **Graceful shutdown** - корректное завершение работы

## 📋 API Endpoints

### Проекты

- `GET /api/projects` - Получить список проектов пользователя
- `GET /api/projects/:id` - Получить конкретный проект
- `POST /api/projects` - Создать новый проект
- `PUT /api/projects/:id` - Обновить проект
- `DELETE /api/projects/:id` - Удалить проект

### Управление публикацией

- `PATCH /api/projects/:id/publish` - Опубликовать проект
- `PATCH /api/projects/:id/unpublish` - Снять проект с публикации
- `PATCH /api/projects/:id/status` - Изменить статус проекта

### Утилиты

- `GET /api/projects/check-slug/:slug` - Проверить доступность слага
- `GET /api/projects/check-domain/:domain` - Проверить доступность домена

### Системные

- `GET /health` - Health check
- `GET /metrics` - Метрики сервиса

## 🔧 Конфигурация

### Переменные окружения

```env
# Основные настройки
NODE_ENV=development
PORT=3009
DATABASE_URL=postgresql://user:password@localhost:5432/situs_db
JWT_SECRET=your-super-secret-jwt-key-minimum-32-characters

# Логирование
LOG_LEVEL=info

# CORS
CORS_ORIGIN=http://localhost:3000,http://localhost:5173

# Rate limiting
RATE_LIMIT_WINDOW=900000
RATE_LIMIT_MAX=1000

# Безопасность
SESSION_SECRET=your-session-secret-minimum-32-characters
COOKIE_SECURE=false

# URLs других сервисов
LOGINUS_URL=http://localhost:3001
BILINGUS_URL=http://localhost:3003
GATEWAY_URL=http://localhost:3000

# Настройки доменов
DEFAULT_SITUS_DOMAIN=situs.com
ENABLE_CUSTOM_DOMAINS=true

# Файлы
UPLOAD_PATH=./uploads
MAX_FILE_SIZE=10485760
```

## 🏃‍♂️ Быстрый старт

### Установка зависимостей

```bash
cd services/projects-service
npm install
```

### Настройка базы данных

```bash
# Создание миграций (из корня проекта)
npx prisma migrate dev --name projects_service_init

# Генерация Prisma Client
npx prisma generate
```

### Запуск в режиме разработки

```bash
npm run dev
```

### Сборка для production

```bash
npm run build
npm start
```

## 🧪 Тестирование

### Запуск тестов

```bash
# Все тесты
npm test

# Тесты в watch режиме
npm run test:watch

# Покрытие кода
npm run test:coverage
```

### Примеры запросов

#### Создание проекта

```bash
curl -X POST http://localhost:3009/api/projects \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "name": "Мой новый сайт",
    "description": "Описание проекта",
    "type": "WEBSITE",
    "domain": "my-site",
    "settings": {
      "theme": "auto",
      "language": "ru",
      "creationType": "manual"
    }
  }'
```

#### Получение списка проектов

```bash
curl -X GET "http://localhost:3009/api/projects?page=1&limit=10&search=сайт" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

#### Публикация проекта

```bash
curl -X PATCH http://localhost:3009/api/projects/PROJECT_ID/publish \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

## 📊 Структура данных

### Модель проекта

```typescript
interface Project {
  id: string;
  name: string;
  description?: string;
  slug: string;
  type: 'WEBSITE' | 'ECOMMERCE' | 'LANDING' | 'BLOG' | 'APP';
  status: 'DRAFT' | 'DEVELOPMENT' | 'STAGING' | 'PUBLISHED' | 'ARCHIVED';
  domain?: string;           // example.situs.com
  customDomain?: string;     // example.com
  isPublished: boolean;
  settings: {
    theme: 'light' | 'dark' | 'auto';
    language: 'ru' | 'en';
    creationType: 'manual' | 'ai';
  };
  metaTitle?: string;
  metaDescription?: string;
  metaKeywords?: string;
  ownerId: string;
  createdAt: string;
  updatedAt: string;
  pages: Page[];
}
```

## 🔒 Безопасность

### Аутентификация

Сервис использует JWT токены для аутентификации. Токен должен быть передан в заголовке:

```
Authorization: Bearer <jwt_token>
```

### Авторизация

- Пользователи могут видеть и управлять только своими проектами
- Администраторы имеют доступ ко всем проектам
- Проверка владения ресурсами на уровне базы данных

### Валидация

- Все входящие данные валидируются с помощью Joi
- Санитизация пользовательского ввода
- Проверка ограничений по длине и формату

## 📈 Мониторинг

### Логирование

Сервис ведет подробные логи всех операций:

- API запросы и ответы
- Создание/изменение/удаление проектов
- Попытки аутентификации
- События безопасности
- Ошибки и исключения

### Метрики

Доступны через endpoint `/metrics`:

- Время работы сервиса
- Использование памяти
- Загрузка CPU
- Версия и окружение

### Health Check

Endpoint `/health` возвращает статус сервиса и базовую информацию.

## 🐳 Docker

### Сборка образа

```bash
docker build -t situs/projects-service .
```

### Запуск контейнера

```bash
docker run -d \
  --name projects-service \
  -p 3009:3009 \
  -e DATABASE_URL=postgresql://user:pass@db:5432/situs \
  -e JWT_SECRET=your-jwt-secret \
  situs/projects-service
```

## 🚀 Развертывание

### Production

1. Установите зависимости: `npm ci --only=production`
2. Соберите проект: `npm run build`
3. Настройте переменные окружения
4. Запустите: `npm start`

### Kubernetes

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: projects-service
spec:
  replicas: 3
  selector:
    matchLabels:
      app: projects-service
  template:
    metadata:
      labels:
        app: projects-service
    spec:
      containers:
      - name: projects-service
        image: situs/projects-service:latest
        ports:
        - containerPort: 3009
        env:
        - name: DATABASE_URL
          value: "postgresql://user:pass@postgres:5432/situs"
        - name: JWT_SECRET
          valueFrom:
            secretKeyRef:
              name: jwt-secret
              key: secret
```

## 🤝 Интеграция

### Gateway Service

Сервис автоматически регистрируется в API Gateway по адресу `/api/projects`.

### Другие сервисы

- **Loginus Service** - аутентификация пользователей
- **Bilingus Service** - биллинг и подписки
- **Hubus Service** - AI генерация контента

## 📚 Дополнительная документация

- [API Schema](./docs/api-schema.json) - OpenAPI спецификация
- [Database Schema](./docs/database.md) - Схема базы данных
- [Architecture](./docs/architecture.md) - Архитектурные решения

## 🐛 Отладка

### Логи

```bash
# Просмотр логов в development
tail -f logs/projects-combined.log

# Только ошибки
tail -f logs/projects-error.log
```

### Отладка базы данных

```bash
# Подключение к БД
npx prisma studio

# Просмотр миграций
npx prisma migrate status
```

## 👥 Команда разработки

- **Backend Team** - основная разработка
- **DevOps Team** - развертывание и мониторинг
- **QA Team** - тестирование и качество

## 📄 Лицензия

MIT License - см. файл [LICENSE](../../LICENSE)