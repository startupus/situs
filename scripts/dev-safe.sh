#!/bin/bash

# Безопасный запуск development окружения
# Проверяет и устраняет проблемы перед запуском

set -e  # Останавливается при ошибке

echo "🚀 Situs Dev-Safe Startup"
echo "========================"

# Цвета для вывода
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Проверка аргументов
CHECK_ONLY=false
if [[ "$1" == "--check-only" ]]; then
    CHECK_ONLY=true
    echo "🔍 Running in check-only mode"
fi

# Функция для логирования
log_info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

log_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

log_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# 1. Убиваем старые процессы
log_info "Stopping old processes..."
pkill -f "npm run dev" 2>/dev/null || true
pkill -f "ts-node" 2>/dev/null || true
pkill -f "nodemon" 2>/dev/null || true
sleep 2
log_success "Old processes stopped"

# 2. Проверяем порт
log_info "Checking port 3001..."
if lsof -i :3001 >/dev/null 2>&1; then
    log_warning "Port 3001 is busy, trying to free it..."
    lsof -ti :3001 | xargs kill -9 2>/dev/null || true
    sleep 2
fi
log_success "Port 3001 is available"

# 3. Проверяем .env файл
log_info "Checking environment variables..."
ENV_FILE="../.env"
if [ ! -f "$ENV_FILE" ]; then
    log_warning ".env file not found, creating basic one..."
    cat > "$ENV_FILE" << EOF
# Database
DATABASE_URL="file:./prisma/dev.db"

# Server
PORT=3001
NODE_ENV=development

# CORS
CORS_ORIGINS="http://localhost:5177,http://localhost:3000"

# JWT
JWT_SECRET="development_jwt_secret_minimum_32_characters_long_12345"
EOF
    log_success "Created .env file"
else
    log_success ".env file exists"
fi

# 4. Проверяем Prisma schema
log_info "Validating Prisma schema..."
if ! npx prisma validate; then
    log_error "Prisma schema validation failed"
    exit 1
fi
log_success "Prisma schema valid"

# 5. Проверяем и создаем базу данных
log_info "Checking database..."
if [ ! -f "prisma/dev.db" ]; then
    log_warning "Database not found, creating..."
    npx prisma db push --force-reset
    log_success "Database created"
else
    log_info "Applying pending migrations..."
    npx prisma db push 2>/dev/null || true
fi

# 6. Генерируем Prisma Client
log_info "Generating Prisma Client..."
npx prisma generate
log_success "Prisma Client generated"

# 7. Проверяем TypeScript компиляцию
log_info "Checking TypeScript compilation..."
cd backend/
if ! npx tsc --noEmit --skipLibCheck; then
    log_error "TypeScript compilation failed"
    if [[ "$CHECK_ONLY" == "false" ]]; then
        log_info "Trying to fix with Prisma regeneration..."
        cd ../
        npx prisma generate
        cd backend/
        if ! npx tsc --noEmit --skipLibCheck; then
            log_error "TypeScript compilation still fails"
            cd ../
            exit 1
        fi
    else
        cd ../
        exit 1
    fi
fi
cd ../
log_success "TypeScript compilation successful"

# Если только проверка - выходим
if [[ "$CHECK_ONLY" == "true" ]]; then
    log_success "All checks passed! ✅"
    exit 0
fi

# 8. Запускаем сервер
log_info "Starting backend server..."
log_success "🚀 Backend starting on port 3001"

# Запускаем с правильными переменными окружения
export DATABASE_URL="file:../prisma/dev.db"
export PORT=3001
export NODE_ENV=development

cd backend/
npm run dev