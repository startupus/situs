# BrowserTools MCP Setup

## Стандартная установка согласно [официальной документации](https://github.com/AgentDeskAI/browser-tools-mcp)

### 1. Установка расширения
- Установите расширение "Situs Service Browser Tools" из папки `Upload/122/`
- Или скачайте с [официального репозитория](https://github.com/AgentDeskAI/browser-tools-mcp)

### 2. Запуск серверов

#### Browser Tools Server (middleware)
```bash
npx @agentdeskai/browser-tools-server@latest
```
Сервер запустится на порту 3025

#### MCP Server (для IDE)
```bash
npx @agentdeskai/browser-tools-mcp@latest
```
MCP сервер автоматически обнаружит browser-tools-server

### 3. Настройка Cursor

Создайте файл `cursor-mcp-config.json` в корне проекта:
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

### 4. Активация расширения

1. Откройте браузер с установленным расширением
2. Откройте DevTools (F12)
3. Найдите панель "BrowserToolsMCP"
4. Убедитесь, что расширение подключено к серверу

### 5. Тестирование

После настройки вы сможете использовать browser-tools функции:
- `takeScreenshot` - создание скриншотов
- `getConsoleLogs` - просмотр логов консоли
- `getConsoleErrors` - просмотр ошибок
- `getNetworkLogs` - анализ сетевых запросов
- `runAccessibilityAudit` - аудит доступности
- `runPerformanceAudit` - аудит производительности
- `runSEOAudit` - SEO аудит
- `runBestPracticesAudit` - аудит лучших практик

## Архитектура

```
┌─────────────┐     ┌──────────────┐     ┌───────────────┐     ┌─────────────┐
│  MCP Client │ ──► │  MCP Server  │ ──► │  Node Server  │ ──► │   Chrome    │
│  (Cursor)   │ ◄── │  (Protocol   │ ◄── │ (Middleware)  │ ◄── │  Extension  │
│             │     │   Handler)   │     │               │     │             │
└─────────────┘     └──────────────┘     └───────────────┘     └─────────────┘
```

## Устранение неполадок

1. **Расширение не подключается:**
   - Перезапустите браузер полностью
   - Перезапустите browser-tools-server
   - Убедитесь, что открыта только одна панель DevTools

2. **MCP сервер не находит browser-tools-server:**
   - Проверьте, что browser-tools-server запущен на порту 3025
   - Убедитесь, что нет конфликтов портов

3. **Функции не работают:**
   - Проверьте подключение расширения в DevTools
   - Убедитесь, что активна вкладка с сайтом
