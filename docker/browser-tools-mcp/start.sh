#!/bin/bash

# BrowserTools MCP Docker Startup Script

set -e

echo "🚀 Запуск BrowserTools MCP в Docker..."

# Проверка наличия Docker
if ! command -v docker &> /dev/null; then
    echo "❌ Docker не установлен. Установите Docker и попробуйте снова."
    exit 1
fi

# Проверка наличия docker-compose
if ! command -v docker-compose &> /dev/null; then
    echo "❌ docker-compose не установлен. Установите docker-compose и попробуйте снова."
    exit 1
fi

# Создание необходимых директорий
echo "📁 Создание директорий..."
mkdir -p screenshots logs mcp-config

# Остановка существующих контейнеров
echo "🛑 Остановка существующих контейнеров..."
docker-compose down 2>/dev/null || true

# Сборка и запуск контейнеров
echo "🔨 Сборка и запуск контейнеров..."
docker-compose up -d --build

# Ожидание запуска сервисов
echo "⏳ Ожидание запуска сервисов..."
sleep 10

# Проверка статуса
echo "📊 Проверка статуса контейнеров..."
docker-compose ps

# Проверка доступности сервисов
echo "🔍 Проверка доступности сервисов..."

# Проверка BrowserTools Server (порт 3000)
if curl -s http://localhost:3000 > /dev/null 2>&1; then
    echo "✅ BrowserTools Server доступен на http://localhost:3000"
else
    echo "⚠️  BrowserTools Server не отвечает на http://localhost:3000"
fi

# Проверка MCP Server (порт 3001)
if curl -s http://localhost:3001 > /dev/null 2>&1; then
    echo "✅ MCP Server доступен на http://localhost:3001"
else
    echo "⚠️  MCP Server не отвечает на http://localhost:3001"
fi

echo ""
echo "🎉 BrowserTools MCP успешно запущен!"
echo ""
echo "📋 Следующие шаги:"
echo "1. Установите Chrome расширение: https://github.com/AgentDeskAI/browser-tools-mcp/releases"
echo "2. Настройте MCP в Cursor IDE (см. README.md)"
echo "3. Откройте DevTools в Chrome и найдите панель 'BrowserToolsMCP'"
echo ""
echo "🔧 Полезные команды:"
echo "  docker-compose logs -f browser-tools-mcp  # Просмотр логов"
echo "  docker-compose restart                    # Перезапуск"
echo "  docker-compose down                       # Остановка"
echo ""
echo "📁 Файлы:"
echo "  Скриншоты: ./screenshots/"
echo "  Логи: ./logs/"
echo "  Конфигурация: ./mcp-config/" 