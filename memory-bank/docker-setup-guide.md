# Docker Setup Guide

## Обзор

Проект Situs поддерживает два режима запуска через Docker:

- **Development** - с dev-флагами и локальными настройками
- **Production** - с production настройками и безопасностью

## Быстрый старт

### Development (рекомендуется для локальной разработки)

```bash
# Клонировать репозиторий
git clone <repository-url>
cd situs

# Запустить в dev режиме (автоматически применяет docker-compose.override.yml)
docker compose up -d --build

# Проверить статус
docker compose ps

# Просмотр логов
docker compose logs -f situs-api
```

**Доступные сервисы:**

- Frontend: http://localhost:5177
- Backend API: http://localhost:3002
- Postgres: localhost:5432
- Redis: localhost:6379

### Production (для продакшена)

```bash
# Установить переменные окружения
export POSTGRES_PASSWORD="secure_password_here"
export JWT_SECRET="your_jwt_secret_at_least_32_chars"
export REDIS_PASSWORD="secure_redis_password"
export CORS_ORIGINS="https://yourdomain.com,https://www.yourdomain.com"

# Запустить в production режиме
docker compose -f docker-compose.production.yml up -d --build

# Проверить статус
docker compose -f docker-compose.production.yml ps
```

## Конфигурация

### Development настройки (docker-compose.override.yml)

Автоматически применяется при запуске `docker compose up`:

```yaml
services:
  situs-api:
    environment:
      ENABLE_DEV_USER: '1' # Dev-байпас авторизации
      NODE_ENV: development
      DATABASE_URL: postgresql://situs:situs_password@postgres:5432/situs
      JWT_SECRET: 'dev_local_jwt_secret_change_me_please_at_least_32_chars'
      CORS_ORIGINS: 'http://localhost:5177,http://localhost:3000,http://localhost'
```

### Production настройки (docker-compose.production.yml)

```yaml
services:
  situs-api:
    environment:
      NODE_ENV: production
      DATABASE_URL: postgresql://situs_user:${POSTGRES_PASSWORD}@postgres:5432/situs_production
      # ENABLE_DEV_USER убран - безопасность!
      JWT_SECRET: ${JWT_SECRET}
      CORS_ORIGINS: ${CORS_ORIGINS}
```

## Авто-сид системного проекта

### Как это работает

При запуске API контейнера автоматически выполняется:

1. **Ожидание БД** - проверка готовности PostgreSQL
2. **Миграции** - `prisma migrate deploy`
3. **Авто-сид** - проверка и создание системного проекта `situs-admin`
4. **Запуск API** - старт NestJS приложения

### Что создается при авто-сиде

- **Системный проект** `situs-admin` с флагом `isSystemAdmin: true`
- **Меню типы**: `admin-sidebar`, `admin-top`, `admin-user`, `project-sidebar`
- **Пункты меню**: Дашборд, Проекты, Пользователи, Заказы, Маркетинг, Поддержка, Настройки
- **Административные экраны** для каждого раздела
- **Коммуникационные настройки** (EMAIL)
- **Интеграции** (EMAIL_SMTP, N8N) - placeholder'ы
- **Системный пользователь** `admin@situs.local` (если нет других пользователей)

### Логи авто-сида

```bash
# Просмотр логов инициализации
docker compose logs situs-api | grep -E "(🌱|✅|❌|🔍|📦)"

# Пример успешного авто-сида:
# [2024-01-15 10:30:15] 🔍 Checking system project existence...
# [2024-01-15 10:30:16] 📦 System project not found, running seed...
# [2024-01-15 10:30:16] 🌱 Running system admin seed...
# [2024-01-15 10:30:18] ✅ System admin seed completed successfully
# [2024-01-15 10:30:18] 🎉 Auto-seed completed successfully
```

## Переменные окружения

### Обязательные для Production

```bash
# Безопасность
POSTGRES_PASSWORD="secure_password_here"
JWT_SECRET="your_jwt_secret_at_least_32_chars"
REDIS_PASSWORD="secure_redis_password"

# CORS (список разрешенных доменов)
CORS_ORIGINS="https://yourdomain.com,https://www.yourdomain.com"

# Опциональные
RATE_LIMIT_WINDOW_MS="900000"  # 15 минут
RATE_LIMIT_MAX_REQUESTS="1000"
```

### Development (автоматически в override)

```bash
# Dev-флаги
ENABLE_DEV_USER="1"  # Включает dev-байпас авторизации
NODE_ENV="development"
VITE_ENV="development"

# Dev пароли (НЕ для production!)
DATABASE_URL="postgresql://situs:situs_password@postgres:5432/situs"
JWT_SECRET="dev_local_jwt_secret_change_me_please_at_least_32_chars"
CORS_ORIGINS="http://localhost:5177,http://localhost:3000,http://localhost"
```

## Dev-пользователь

### В Development режиме

При `ENABLE_DEV_USER=1` любой запрос автоматически получает права `SUPER_ADMIN`:

```typescript
// Автоматически подставляется в JwtAuthGuard
{
  id: 'dev-user-id',
  email: 'dev@situs.local',
  name: 'Dev User',
  globalRole: 'SUPER_ADMIN',
  scopes: ['PROJECT_READ', 'PROJECT_WRITE', 'PROJECT_ADMIN']
}
```

### В Production режиме

`ENABLE_DEV_USER` отключен - требуется реальная авторизация через:

- JWT токены
- Системного пользователя `admin@situs.local` (создается при авто-сиде)

## Troubleshooting

### Проблемы с БД

```bash
# Проверить подключение к БД
docker compose exec situs-api npx prisma db execute --stdin <<< "SELECT 1;"

# Пересоздать БД
docker compose down -v
docker compose up -d --build
```

### Проблемы с авто-сидом

```bash
# Ручной запуск авто-сида
docker compose exec situs-api npx ts-node scripts/auto-seed.ts

# Ручной запуск системного сида
docker compose exec situs-api npx ts-node prisma/seed-admin-system.ts
```

### Проблемы с миграциями

```bash
# Принудительное выполнение миграций
docker compose exec situs-api npx prisma migrate deploy

# Сброс БД и миграций
docker compose exec situs-api npx prisma migrate reset --force
```

### Проблемы с dev-байпасом

```bash
# Проверить переменные окружения
docker compose exec situs-api env | grep ENABLE_DEV_USER

# Включить dev-байпас вручную
docker compose exec situs-api sh -c 'export ENABLE_DEV_USER=1; node dist/server/main.js'
```

## Безопасность

### Production Checklist

- [ ] `ENABLE_DEV_USER` отключен
- [ ] `POSTGRES_PASSWORD` установлен и сложный
- [ ] `JWT_SECRET` установлен и длинный (32+ символов)
- [ ] `CORS_ORIGINS` ограничен нужными доменами
- [ ] `REDIS_PASSWORD` установлен
- [ ] Все dev-пароли заменены на production

### Development Security

- Dev-флаги работают только в development режиме
- `docker-compose.override.yml` не должен попадать в production
- Dev-пароли четко помечены как "НЕ для production!"

## Мониторинг

### Health Checks

```bash
# Проверить health всех сервисов
curl http://localhost:3002/health  # Backend
curl http://localhost/health       # Frontend

# Проверить статус контейнеров
docker compose ps
```

### Логи

```bash
# Все сервисы
docker compose logs -f

# Только API
docker compose logs -f situs-api

# Только ошибки
docker compose logs situs-api 2>&1 | grep -i error
```

## Обновление

```bash
# Остановить сервисы
docker compose down

# Обновить код
git pull

# Пересобрать и запустить
docker compose up -d --build

# Проверить авто-сид
docker compose logs situs-api | grep -E "(🌱|✅|❌)"
```

## Smoke-тесты

### Запуск тестов безопасности

```bash
# Запустить Docker окружение
docker compose up -d --build

# Дождаться готовности
sleep 30

# Запустить smoke-тесты
npx playwright test tests/e2e/docker-security.test.ts

# Проверить результаты
npx playwright show-report
```

### Что проверяют тесты

- Доступность системного проекта при `ENABLE_DEV_USER=1`
- Отсутствие ошибок авторизации в консоли
- Корректность ответов API
- Безопасность endpoints
- CORS заголовки
- Tenant resolution
- Health checks всех сервисов
