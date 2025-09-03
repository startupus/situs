# Docker Окружение Situs

Этот раздел содержит Docker конфигурации для различных сервисов проекта Situs.

## 🐳 Доступные сервисы

### BrowserTools MCP

**Расположение:** `docker/browser-tools-mcp/`

Мощный инструмент для мониторинга и взаимодействия с браузером через Model Context Protocol (MCP).

**Возможности:**

- 📸 Автоматические скриншоты страниц
- 🔍 Аудит доступности (WCAG)
- ⚡ Аудит производительности
- 🔍 SEO аудит
- 🛠️ Аудит лучших практик
- ⚛️ NextJS аудит
- 📊 Мониторинг логов консоли
- 🌐 Отслеживание сетевых запросов

**Статус:** ✅ Запущен и готов к использованию

**Порты:**

- `3025` - BrowserTools Server (основной)
- `3001` - MCP Server

**Быстрый запуск:**

```bash
cd docker/browser-tools-mcp
./start.sh
```

## 🚀 Быстрый старт

### 1. Запуск всех сервисов

```bash
# BrowserTools MCP
cd docker/browser-tools-mcp
./start.sh

# Другие сервисы (будут добавлены позже)
# cd docker/other-service
# docker-compose up -d
```

### 2. Проверка статуса

```bash
# Проверка всех контейнеров
docker ps

# Проверка конкретного сервиса
cd docker/browser-tools-mcp
docker-compose ps
```

### 3. Просмотр логов

```bash
# BrowserTools MCP
cd docker/browser-tools-mcp
docker-compose logs -f browser-tools-mcp
```

## 🔧 Управление

### Остановка сервисов

```bash
# Остановка конкретного сервиса
cd docker/browser-tools-mcp
docker-compose down

# Остановка всех контейнеров
docker stop $(docker ps -q)
```

### Перезапуск сервисов

```bash
# Перезапуск конкретного сервиса
cd docker/browser-tools-mcp
docker-compose restart

# Перезапуск с пересборкой
docker-compose down
docker-compose up -d --build
```

### Обновление сервисов

```bash
# Обновление до последней версии
cd docker/browser-tools-mcp
docker-compose down
docker-compose pull
docker-compose up -d --build
```

## 📁 Структура

```
docker/
├── README.md                    # Эта документация
├── browser-tools-mcp/          # BrowserTools MCP сервис
│   ├── Dockerfile              # Конфигурация образа
│   ├── docker-compose.yml      # Оркестрация контейнеров
│   ├── start.sh                # Скрипт быстрого запуска
│   ├── README.md               # Документация сервиса
│   ├── cursor-mcp-config.json  # Конфигурация для Cursor IDE
│   ├── screenshots/            # Папка для скриншотов
│   ├── logs/                   # Папка для логов
│   └── mcp-config/            # Конфигурация MCP
└── [другие сервисы...]        # Будут добавлены позже
```

## 🔗 Интеграция с IDE

### Cursor IDE

1. Скопируйте содержимое `docker/browser-tools-mcp/cursor-mcp-config.json`
2. Добавьте в настройки Cursor в раздел MCP серверов
3. Перезапустите Cursor

### Chrome расширение

1. Скачайте [BrowserToolsMCP Chrome Extension](https://github.com/AgentDeskAI/browser-tools-mcp/releases)
2. Установите в Chrome
3. Откройте DevTools и найдите панель "BrowserToolsMCP"

## 🛠️ Разработка

### Добавление нового сервиса

1. Создайте папку для сервиса: `docker/new-service/`
2. Создайте `Dockerfile` и `docker-compose.yml`
3. Добавьте документацию в `README.md`
4. Обновите этот файл

### Отладка

```bash
# Вход в контейнер
docker exec -it browser-tools-mcp sh

# Просмотр переменных окружения
docker exec browser-tools-mcp env

# Проверка сетевых подключений
docker exec browser-tools-mcp netstat -tulpn
```

## 📊 Мониторинг

### Проверка здоровья сервисов

```bash
# BrowserTools MCP
curl http://localhost:3025

# MCP Server
curl http://localhost:3001
```

### Просмотр ресурсов

```bash
# Использование ресурсов контейнерами
docker stats

# Дисковое пространство
docker system df
```

## 🔒 Безопасность

- Все сервисы работают в изолированных контейнерах
- Порты открыты только для необходимых сервисов
- Логи и данные хранятся локально
- Нет отправки данных на внешние серверы

## 📝 Логи

Логи всех сервисов доступны в соответствующих папках:

- `docker/browser-tools-mcp/logs/` - логи BrowserTools MCP
- `docker/browser-tools-mcp/screenshots/` - скриншоты

## 🤝 Поддержка

При возникновении проблем:

1. Проверьте логи: `docker-compose logs -f [service-name]`
2. Проверьте статус контейнеров: `docker-compose ps`
3. Перезапустите сервис: `docker-compose restart [service-name]`
4. Создайте issue в репозитории проекта

## 📄 Лицензии

- BrowserTools MCP: MIT License
- Docker: Apache License 2.0
- Другие компоненты: см. соответствующие лицензии
