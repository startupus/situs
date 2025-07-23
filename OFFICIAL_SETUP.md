# 🚀 Официальная настройка BrowserTools MCP

## 📋 Требования по официальной документации

Согласно [официальному репозиторию](https://github.com/AgentDeskAI/browser-tools-mcp), система состоит из **3 компонентов**:

### 1. Chrome Extension
- **Скачать**: [v1.2.0 BrowserToolsMCP Chrome Extension](https://github.com/AgentDeskAI/browser-tools-mcp/releases)
- **Установить**: Загрузить в Chrome через `chrome://extensions/`

### 2. MCP Server (для IDE)
- **Команда**: `npx @agentdeskai/browser-tools-mcp@latest`
- **Статус**: ✅ Запущен

### 3. Browser Tools Server (локальный сервер)
- **Команда**: `npx @agentdeskai/browser-tools-server@latest`
- **Статус**: ✅ Запущен на порту 3025

## 🔧 Пошаговая настройка

### Шаг 1: Установка официального расширения
1. **Скачайте** расширение с [GitHub Releases](https://github.com/AgentDeskAI/browser-tools-mcp/releases)
2. **Распакуйте** ZIP файл
3. **Откройте** Chrome → `chrome://extensions/`
4. **Включите** "Режим разработчика"
5. **Нажмите** "Загрузить распакованное расширение"
6. **Выберите** папку с распакованным расширением

### Шаг 2: Проверка серверов
```bash
# Проверить browser-tools-server
curl http://localhost:3025/

# Проверить MCP server (должен быть в Cursor)
```

### Шаг 3: Активация расширения
1. **Откройте** любую веб-страницу
2. **Откройте** DevTools (F12)
3. **Найдите** вкладку "BrowserToolsMCP"
4. **Проверьте** статус подключения

## 🏗️ Архитектура (официальная)

```
┌─────────────┐     ┌──────────────┐     ┌───────────────┐     ┌─────────────┐
│  MCP Client │ ──► │  MCP Server  │ ──► │  Node Server  │ ──► │   Chrome    │
│  (Cursor)   │ ◄── │  (Protocol   │ ◄── │ (Middleware)  │ ◄── │  Extension  │
│             │     │   Handler)   │     │               │     │             │
└─────────────┘     └──────────────┘     └───────────────┘     └─────────────┘
```

## 🚨 Устранение проблем

### Проблема: "No active WebSocket connection"
**Решение:**
1. Закройте Chrome полностью (не только окно)
2. Перезапустите browser-tools-server
3. Убедитесь, что открыта только ОДНА панель DevTools

### Проблема: Расширение не подключается
**Решение:**
1. Проверьте, что browser-tools-server запущен на порту 3025
2. Убедитесь, что используется официальное расширение
3. Проверьте консоль DevTools на ошибки

## 🎯 Доступные функции

После правильной настройки доступны:
- 📸 **Screenshots** - автоматическая вставка в Cursor
- 📋 **Console Logs** - мониторинг консоли
- 🌐 **Network Logs** - анализ сетевых запросов
- 🔍 **Audits** - SEO, Performance, Accessibility
- 🛠️ **Debugger Mode** - все отладочные инструменты
- 📊 **Audit Mode** - все аудиты последовательно

## 📚 Дополнительные ресурсы

- [Официальная документация](https://github.com/AgentDeskAI/browser-tools-mcp)
- [Полное руководство по установке](https://github.com/AgentDeskAI/browser-tools-mcp#installation)
- [Устранение проблем](https://github.com/AgentDeskAI/browser-tools-mcp#troubleshooting) 