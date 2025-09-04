#!/bin/bash

# Docker entrypoint для Situs API
# Выполняет миграции, авто-сид и запускает приложение

set -e

echo "🚀 Starting Situs API container..."

# Функция для логирования
log() {
    echo "[$(date +'%Y-%m-%d %H:%M:%S')] $1"
}

# Ожидание готовности БД
wait_for_db() {
    log "⏳ Waiting for database to be ready..."
    
    local max_attempts=30
    local attempt=1
    
    while [ $attempt -le $max_attempts ]; do
        if echo "SELECT 1;" | npx prisma db execute --stdin --schema=./prisma/schema.prisma > /dev/null 2>&1; then
            log "✅ Database is ready"
            return 0
        fi
        
        log "⏳ Database not ready, attempt $attempt/$max_attempts"
        sleep 2
        attempt=$((attempt + 1))
    done
    
    log "❌ Database connection timeout"
    exit 1
}

# Выполнение миграций
run_migrations() {
    log "🔄 Running database migrations..."
    
    # Сначала пробуем migrate deploy
    if npx prisma migrate deploy; then
        log "✅ Migrations completed successfully"
    else
        log "⚠️ Migrate deploy failed, trying db push..."
        # Если migrate deploy не работает, используем db push с флагом --accept-data-loss
        if npx prisma db push --accept-data-loss; then
            log "✅ Database schema synchronized with db push"
        else
            log "❌ Database synchronization failed"
            exit 1
        fi
    fi
}

# Авто-сид системного проекта
run_auto_seed() {
    log "🌱 Running auto-seed for system project..."
    
    # Используем JavaScript версию для избежания проблем с ES модулями
    if node scripts/auto-seed.js; then
        log "✅ Auto-seed completed successfully"
    else
        log "❌ Auto-seed failed"
        exit 1
    fi
}

# Генерация Prisma клиента
generate_prisma_client() {
    log "🔧 Generating Prisma client..."
    
    if npx prisma generate; then
        log "✅ Prisma client generated"
    else
        log "❌ Prisma client generation failed"
        exit 1
    fi
}

# Основная логика
main() {
    log "🎯 Starting initialization process..."
    
    # 1. Ожидание БД
    wait_for_db
    
    # 2. Генерация Prisma клиента
    generate_prisma_client
    
    # 3. Миграции
    run_migrations
    
    # 4. Авто-сид (только если системный проект не существует)
    run_auto_seed
    
    log "🎉 Initialization completed, starting application..."
    
    # 5. Запуск приложения
    exec "$@"
}

# Обработка сигналов для graceful shutdown
trap 'log "🛑 Received shutdown signal"; exit 0' SIGTERM SIGINT

# Запуск основной логики
main "$@"
