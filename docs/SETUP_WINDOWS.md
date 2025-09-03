# Настройка окружения и запуск проекта на Windows

Этот документ описывает подготовку окружения и запуск Backend (NestJS + Prisma + PostgreSQL) и Frontend (Vite) на Windows 10/11.

## Поддерживаемые окружения

- Windows 10/11 x64 (рекомендуется Pro/Enterprise, но не обязательно)
- Включена виртуализация (для Docker Desktop)
- Терминал: PowerShell 7+ (рекомендуется) или Git Bash

## Необходимые инструменты

- Git for Windows (включить Git Credential Manager)
- Node.js 20.x (в комплекте npm 10.x)
- Docker Desktop for Windows (WSL2 backend) — если хотите запускать в контейнерах
- PostgreSQL 15 — если запускаете БД локально без Docker

Рекомендации:

- Включить поддержку длинных путей
  ```powershell
  git config --global core.longpaths true
  ```
- Клонируйте проект в путь без пробелов и кириллицы, например: `C:\Projects\Situs`
- Откройте порты в фаерволе: 5177 (Frontend), 3002 (Backend), 55432 (Postgres в Docker)

## Переменные окружения (.env)

Создайте файл `.env` в корне проекта:

```dotenv
# Бэкенд
JWT_SECRET=change_me

# Если запускаете Postgres локально (без Docker):
DATABASE_URL=postgresql://situs:situs_password@localhost:5432/situs?schema=public

# Если используете Docker Compose (порт 55432 -> 5432 внутри контейнера):
# DATABASE_URL=postgresql://situs:situs_password@localhost:55432/situs?schema=public
```

Примечания:

- `JWT_SECRET` должен быть непустым
- Убедитесь, что `DATABASE_URL` указывает на актуальную базу

## Вариант A (рекомендуется): запуск через Docker Compose

Требуется: Docker Desktop (WSL2 backend).

1. Клонирование и установка зависимостей

```powershell
git clone https://github.com/<your-org-or-user>/Situs.git C:\Projects\Situs
cd C:\Projects\Situs
npm ci
```

2. Поднять сервисы

- Только база данных:

```powershell
docker compose up -d postgres
```

- Весь стек (бэкенд + фронтенд + база):

```powershell
docker compose up -d situs-api situs-web postgres
```

3. Миграции и сиды (выполняются на хосте)

```powershell
$env:DATABASE_URL="postgresql://situs:situs_password@localhost:55432/situs?schema=public"
npx prisma generate
npx prisma db push
npx tsx prisma/seed-admin-system.ts
npx tsx scripts/seed-demo-projects.ts
```

4. Проверка сервисов

- API здоровье: http://localhost:3002/health — должен вернуть OK
- Фронтенд: http://localhost:5177

Подсказки:

- В Docker Compose Postgres проброшен как `55432:5432`
- Если подняли только `postgres`, фронтенд/бэкенд можно запускать локально (см. Вариант B)

## Вариант B: локальный запуск без Docker

Требуется установленный PostgreSQL 15 локально.

1. Создать БД и пользователя

```powershell
psql -U postgres -h localhost -p 5432 -c "CREATE USER situs WITH PASSWORD 'situs_password';"
psql -U postgres -h localhost -p 5432 -c "CREATE DATABASE situs OWNER situs;"
```

2. Установка зависимостей и Prisma

```powershell
cd C:\Projects\Situs
npm ci
npx prisma generate
```

3. Синхронизация схемы и сиды

```powershell
npx prisma db push
npx tsx prisma/seed-admin-system.ts
npx tsx scripts/seed-demo-projects.ts
```

4. Запуск dev‑серверов

```powershell
# Окно 1: бэкенд (NestJS) на 3002
npm run dev:api:watch

# Окно 2: фронтенд (Vite) на 5177
npm run dev:situs
```

5. Проверка

- API здоровье: http://localhost:3002/health
- Проекты: http://localhost:5177/projects — данные должны приходить с бэка

## Настройка интеграции N8N (опционально)

1. Откройте страницу интеграций проекта: `/projects/:id/settings/integrations`
2. Введите адрес инстанса N8N и API Key
3. Обновите список воркфлоу — должен появиться список из REST `/api/v1/workflows`
4. Выберите воркфлоу и настройте маршруты (mapping) при необходимости

Если N8N размещён на внешнем сервере, проверьте CORS и доступность из браузера.

## Частые проблемы и решения

- Белый экран фронтенда — проверьте консоль браузера и что фронтенд запущен на 5177, а API отвечает на 3002
- Ошибки Prisma подключения — проверьте `DATABASE_URL`, что база создана и доступна, выполнен `prisma db push`
- Проблемы с путями/кириллицей — перенесите проект в путь без пробелов и кириллицы, включите `core.longpaths`
- Docker не стартует — включите виртуализацию в BIOS/UEFI, WSL2 в Windows, перезагрузите ПК

## Приложение: полезные команды PowerShell

Временная установка переменной средой:

```powershell
$env:DATABASE_URL="postgresql://situs:situs_password@localhost:55432/situs?schema=public"
```

Постоянная установка (сохранится между перезагрузками):

```powershell
setx DATABASE_URL "postgresql://situs:situs_password@localhost:55432/situs?schema=public"
```
