# 🚀 Быстрый запуск системы управления проектами

> После проведения code review и исправления всех критических проблем

## 📋 Предварительные требования

- Node.js 18+
- PostgreSQL 12+
- npm или yarn

## ⚡ Быстрый старт

### 1. Настройка базы данных

```bash
# Применить обновленную схему Prisma
npx prisma migrate dev --name projects_system_with_security_fixes

# Сгенерировать Prisma Client
npx prisma generate
```

### 2. Настройка Projects Service

```bash
# Перейти в директорию сервиса
cd services/projects-service

# Установить зависимости
npm install

# Скопировать пример переменных окружения
cp .env.example .env

# Отредактировать .env файл
nano .env
```

**Обязательные переменные для .env:**
```env
NODE_ENV=development
PORT=3009
DATABASE_URL=postgresql://username:password@localhost:5432/situs_db
JWT_SECRET=your-super-secret-jwt-key-minimum-32-characters-long
SESSION_SECRET=your-session-secret-minimum-32-characters-long
```

### 3. Обновление Gateway Service

**Добавить в .env gateway-service:**
```env
PROJECTS_URL=http://localhost:3009
```

### 4. Запуск сервисов

```bash
# Terminal 1: Запуск Projects Service
cd services/projects-service
npm run dev

# Terminal 2: Запуск Gateway Service 
cd services/gateway-service
npm run dev

# Terminal 3: Запуск фронтенда
npm run dev
```

## ✅ Проверка работоспособности

### Health Check
```bash
curl http://localhost:3009/health
```

### Тестирование API через Gateway
```bash
# Получение списка проектов (требует JWT токен)
curl -H "Authorization: Bearer YOUR_JWT_TOKEN" \
     http://localhost:3000/api/projects
```

### Запуск тестов
```bash
cd services/projects-service
npm test
```

## 🔧 Возможные проблемы и решения

### Проблема: База данных не подключается
**Решение:** Проверьте DATABASE_URL и что PostgreSQL запущен
```bash
# Проверка статуса PostgreSQL
sudo systemctl status postgresql

# Тест подключения
npx prisma studio
```

### Проблема: JWT токен недействителен
**Решение:** Убедитесь что JWT_SECRET одинаковый во всех сервисах

### Проблема: CORS ошибки
**Решение:** Проверьте CORS_ORIGIN в .env файле

## 📊 Архитектура после исправлений

```
Фронтенд (React)
       ↓
Gateway Service (3000)
       ↓
Projects Service (3009) ←→ PostgreSQL
       ↓
Loginus Service (3001) - аутентификация
Bilingus Service (3003) - биллинг
```

## 🔒 Безопасность

✅ **Исправлено:**
- Проверка прав доступа на уровне БД
- Аутентификация всех endpoints  
- Защита от подделки владельца ресурсов
- Валидация на всех уровнях

✅ **Оптимизировано:**
- Добавлены индексы БД
- Убраны избыточные запросы
- Кеширование проверок прав

## 📈 Мониторинг

### Логи
```bash
# Просмотр логов Projects Service
tail -f services/projects-service/logs/projects-combined.log

# Ошибки
tail -f services/projects-service/logs/projects-error.log
```

### Метрики
```bash
curl http://localhost:3009/metrics
```

## 🎯 Готово к production!

Система полностью готова к эксплуатации:
- Все критические уязвимости исправлены
- Производительность оптимизирована  
- Архитектура соответствует enterprise-стандартам
- Код покрыт тестами

**Можно приступать к интеграции с фронтендом!** 🚀