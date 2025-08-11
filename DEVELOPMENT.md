# Руководство по разработке

## Запуск проекта

### Подготовка
1. Установите зависимости: `npm install`
2. Сгенерируйте Prisma клиент: `npm run db:generate`
3. Создайте файл `.env` на основе переменных ниже

### Переменные окружения (.env)
```bash
# Database
DATABASE_URL="file:./dev.db"

# Server
NODE_ENV=development
PORT=3001

# Frontend
VITE_API_URL=http://localhost:3001
```

### Запуск dev-серверов
```bash
# Фронт + API одновременно
npm run dev:full

# Только API (NestJS)
npm run nestjs:dev

# Только фронт (Vite)
npm run dev:situs
```

## Архитектура

### Backend (src/server/)
- **main.ts** — точка входа NestJS
- **projects/** — модуль проектов (CRUD + статусы)
- **realtime/** — SSE события
- **database/** — Prisma ORM

### Frontend (src/)
- **components/situs/projects/** — список проектов
- **api/services/projects.api.ts** — клиент API

### Ключевые эндпоинты
- `GET /api/projects` — список проектов
- `PATCH /api/projects/:id/status` — смена статуса
- `GET /api/projects/events` — SSE подписка
- `GET /health` — здоровье сервера

## Решение проблем

### Dev-сервер зависает
- Проверьте DATABASE_URL в .env
- Убедитесь что порт 3001 свободен
- Попробуйте `npm run db:push` для инициализации БД

### Переключение статуса не работает
- Откройте dev tools, проверьте Network на ошибки PATCH запросов
- Проверьте SSE подключение в dev tools

### E2E тесты
```bash
npm run test:e2e
```

## Деплой
```bash
# Сборка и запуск через pm2
npm run deploy:api

# Остановка
npm run deploy:api:stop
```
