# BrowserTools MCP Docker Setup

Этот Docker контейнер предоставляет BrowserTools MCP для использования в разных проектах одновременно.

## Что это такое

BrowserTools MCP - это мощный инструмент для мониторинга и взаимодействия с браузером, который позволяет AI-приложениям через Model Context Protocol (MCP) захватывать и анализировать данные браузера через Chrome расширение.

## Возможности

- 📸 **Скриншоты** - автоматическое создание скриншотов страниц
- 🔍 **Аудит доступности** - проверка соответствия WCAG стандартам
- ⚡ **Аудит производительности** - анализ скорости загрузки страниц
- 🔍 **SEO аудит** - проверка оптимизации для поисковых систем
- 🛠️ **Аудит лучших практик** - проверка стандартов веб-разработки
- ⚛️ **NextJS аудит** - специальные проверки для Next.js приложений
- 📊 **Логи консоли** - мониторинг console.log и ошибок
- 🌐 **Сетевые запросы** - отслеживание HTTP запросов
- 🎯 **Выбранные элементы** - анализ DOM элементов

## Установка и запуск

### 1. Сборка и запуск контейнеров

```bash
cd docker/browser-tools-mcp
docker-compose up -d --build
```

### 2. Проверка статуса

```bash
docker-compose ps
```

### 3. Просмотр логов

```bash
docker-compose logs -f browser-tools-mcp
```

## Настройка в Cursor IDE

### 1. Установка MCP сервера в Cursor

В настройках Cursor добавьте MCP сервер:

```json
{
  "mcpServers": {
    "browser-tools": {
      "command": "npx",
      "args": ["@agentdeskai/browser-tools-mcp@latest"],
      "env": {
        "BROWSER_TOOLS_SERVER_URL": "http://localhost:3025"
      }
    }
  }
}
```

### 2. Установка Chrome расширения

1. Скачайте расширение: [BrowserToolsMCP Chrome Extension v1.2.0](https://github.com/AgentDeskAI/browser-tools-mcp/releases)
2. Установите в Chrome
3. Откройте DevTools и найдите панель "BrowserToolsMCP"

## Использование

### Доступные команды

- `takeScreenshot` - сделать скриншот текущей страницы
- `runAccessibilityAudit` - проверить доступность
- `runPerformanceAudit` - проверить производительность
- `runSEOAudit` - проверить SEO
- `runBestPracticesAudit` - проверить лучшие практики
- `runNextJSAudit` - специальный аудит для Next.js
- `runAuditMode` - запустить все аудиты последовательно
- `runDebuggerMode` - запустить все инструменты отладки

### Примеры использования

```bash
# Сделать скриншот
"Сделай скриншот текущей страницы"

# Проверить доступность
"Проверь доступность этой страницы"

# Аудит производительности
"Почему эта страница загружается медленно?"

# SEO аудит
"Как улучшить SEO этой страницы?"

# Полный аудит
"Запусти полный аудит страницы"
```

## Структура проекта

```
docker/browser-tools-mcp/
├── Dockerfile              # Конфигурация Docker образа
├── docker-compose.yml      # Оркестрация контейнеров
├── README.md              # Эта документация
├── screenshots/           # Папка для скриншотов (монтируется)
├── logs/                  # Папка для логов (монтируется)
└── mcp-config/           # Конфигурация MCP (монтируется)
```

## Порты

- `3025` - BrowserTools Server (основной)
- `3000` - BrowserTools Server (альтернативный)
- `3001` - MCP Server

## Переменные окружения

- `NODE_ENV=production` - окружение выполнения
- `PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true` - использовать системный Chromium
- `PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium-browser` - путь к Chromium

## Устранение неполадок

### Проблема с подключением

1. Проверьте, что контейнеры запущены:

   ```bash
   docker-compose ps
   ```

2. Проверьте логи:

   ```bash
   docker-compose logs browser-tools-mcp
   ```

3. Перезапустите контейнеры:
   ```bash
   docker-compose restart
   ```

### Проблема с Chrome расширением

1. Убедитесь, что расширение установлено
2. Откройте DevTools и найдите панель BrowserToolsMCP
3. Проверьте, что расширение подключено к серверу

### Проблема с MCP в Cursor

1. Проверьте настройки MCP в Cursor
2. Убедитесь, что сервер доступен по адресу `http://localhost:3000`
3. Перезапустите Cursor

## Обновление

Для обновления до последней версии:

```bash
docker-compose down
docker-compose pull
docker-compose up -d --build
```

## Лицензия

MIT License - см. [лицензию BrowserTools MCP](https://github.com/AgentDeskAI/browser-tools-mcp/blob/main/LICENSE)
