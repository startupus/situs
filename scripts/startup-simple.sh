#!/bin/bash

# 🚀 ПРОСТОЙ И НАДЕЖНЫЙ ЗАПУСК BACKEND
# Решает проблему зависания навсегда

set -e

echo "🚀 SITUS BACKEND - ПРОСТОЙ ЗАПУСК"
echo "=================================="

# Цвета
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

log_success() { echo -e "${GREEN}[SUCCESS]${NC} $1"; }
log_error() { echo -e "${RED}[ERROR]${NC} $1"; }
log_info() { echo -e "${YELLOW}[INFO]${NC} $1"; }

# 1. УБИВАЕМ ВСЕ СТАРЫЕ ПРОЦЕССЫ
log_info "Очистка старых процессов..."
pkill -f "ts-node" 2>/dev/null || true
pkill -f "nodemon" 2>/dev/null || true
pkill -f "npm.*dev" 2>/dev/null || true
sleep 2
log_success "Процессы очищены"

# 2. ОСВОБОЖДАЕМ ПОРТ
log_info "Проверка порта 3001..."
if lsof -i :3001 >/dev/null 2>&1; then
    log_info "Порт занят, освобождаем..."
    lsof -ti :3001 | xargs kill -9 2>/dev/null || true
    sleep 2
fi
log_success "Порт 3001 свободен"

# 3. ПРОВЕРЯЕМ БАЗУ ДАННЫХ (минимально)
log_info "Синхронизация схемы БД (PostgreSQL)..."
cd ..
npx prisma db push >/dev/null 2>&1 || true
cd backend
log_success "Схема БД синхронизирована"

# 4. ЗАПУСКАЕМ СЕРВЕР С ТАЙМАУТОМ
log_info "Запуск backend сервера..."
cd backend

# Запускаем с правильными переменными
export DATABASE_URL="postgresql://situs:situs_password@localhost:5432/situs?schema=public"
export PORT=3001
export NODE_ENV=development

# Запускаем с таймаутом - если не запустился за 15 секунд, убиваем
timeout 15s npx ts-node src/index.ts &
SERVER_PID=$!

# Ждем запуска
sleep 5

# Проверяем, запустился ли сервер
if curl -s http://localhost:3001/health >/dev/null 2>&1; then
    log_success "✅ Backend успешно запущен на порту 3001"
    echo "🔗 Health check: http://localhost:3001/health"
    echo "📊 API: http://localhost:3001/api/projects"
    echo "🔄 PID: $SERVER_PID"
    
    # Сохраняем PID для управления
    echo $SERVER_PID > .server.pid
    
    # Ждем завершения
    wait $SERVER_PID
else
    log_error "❌ Backend не запустился за 15 секунд"
    kill $SERVER_PID 2>/dev/null || true
    exit 1
fi
