#!/bin/bash

# =============================================================================
# SITUS PLATFORM - Environment Setup Script
# =============================================================================
# Автоматически настраивает окружение в зависимости от контекста выполнения

set -e

# Цвета для вывода
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Функция для вывода сообщений
log() {
    echo -e "${BLUE}[SETUP]${NC} $1"
}

success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Функция для определения окружения
detect_environment() {
    if [ -f "/.dockerenv" ] || [ -n "$DOCKER_ENV" ] || [ -n "$CONTAINER" ]; then
        echo "docker"
    elif [ -n "$NODE_ENV" ]; then
        echo "$NODE_ENV"
    elif [ -f "docker-compose.yml" ] && [ -n "$(docker-compose ps -q 2>/dev/null)" ]; then
        echo "docker"
    else
        echo "development"
    fi
}

# Функция для копирования файла окружения
setup_environment() {
    local env_type=$1
    
    case $env_type in
        "development")
            log "Setting up development environment..."
            if [ -f "env.development" ]; then
                cp env.development .env
                success "Development environment configured"
            else
                error "env.development file not found"
                exit 1
            fi
            ;;
        "production")
            log "Setting up production environment..."
            if [ -f "env.production" ]; then
                cp env.production .env
                success "Production environment configured"
            else
                error "env.production file not found"
                exit 1
            fi
            ;;
        "docker")
            log "Setting up Docker environment..."
            if [ -f "env.docker" ]; then
                cp env.docker .env
                success "Docker environment configured"
            else
                error "env.docker file not found"
                exit 1
            fi
            ;;
        *)
            error "Unknown environment: $env_type"
            exit 1
            ;;
    esac
}

# Функция для проверки зависимостей
check_dependencies() {
    log "Checking dependencies..."
    
    # Проверяем Node.js
    if ! command -v node &> /dev/null; then
        error "Node.js is not installed"
        exit 1
    fi
    
    # Проверяем npm
    if ! command -v npm &> /dev/null; then
        error "npm is not installed"
        exit 1
    fi
    
    # Проверяем PostgreSQL (только для development)
    if [ "$1" = "development" ]; then
        if ! command -v psql &> /dev/null; then
            warning "PostgreSQL client not found. Make sure PostgreSQL is installed and running."
        fi
    fi
    
    success "Dependencies check completed"
}

# Функция для настройки базы данных
setup_database() {
    local env_type=$1
    
    if [ "$env_type" = "development" ]; then
        log "Setting up development database..."
        
        # Проверяем подключение к базе данных
        if command -v psql &> /dev/null; then
            # Читаем настройки из .env
            source .env
            
            # Проверяем подключение
            if psql "$DATABASE_URL" -c "SELECT 1;" &> /dev/null; then
                success "Database connection successful"
                
                # Применяем миграции
                log "Applying database migrations..."
                if npx prisma migrate dev --name init; then
                    success "Database migrations applied"
                else
                    warning "Failed to apply migrations. You may need to run 'npx prisma db push' manually."
                fi
            else
                warning "Cannot connect to database. Please check your DATABASE_URL in .env"
            fi
        else
            warning "PostgreSQL client not found. Skipping database setup."
        fi
    else
        log "Skipping database setup for $env_type environment"
    fi
}

# Функция для установки зависимостей
install_dependencies() {
    log "Installing dependencies..."
    
    if [ -f "package.json" ]; then
        npm install
        success "Dependencies installed"
    else
        error "package.json not found"
        exit 1
    fi
}

# Функция для генерации Prisma клиента
generate_prisma() {
    log "Generating Prisma client..."
    
    if [ -f "prisma/schema.prisma" ]; then
        npx prisma generate
        success "Prisma client generated"
    else
        warning "Prisma schema not found. Skipping Prisma client generation."
    fi
}

# Функция для проверки конфигурации
validate_config() {
    log "Validating configuration..."
    
    if [ -f ".env" ]; then
        # Проверяем обязательные переменные
        required_vars=("NODE_ENV" "DATABASE_URL" "JWT_SECRET")
        
        for var in "${required_vars[@]}"; do
            if ! grep -q "^${var}=" .env; then
                error "Required environment variable $var is missing from .env"
                exit 1
            fi
        done
        
        success "Configuration validation passed"
    else
        error ".env file not found"
        exit 1
    fi
}

# Основная функция
main() {
    local env_type=${1:-$(detect_environment)}
    
    log "Situs Platform Environment Setup"
    log "Detected environment: $env_type"
    
    # Настраиваем окружение
    setup_environment "$env_type"
    
    # Проверяем зависимости
    check_dependencies "$env_type"
    
    # Устанавливаем зависимости
    install_dependencies
    
    # Генерируем Prisma клиент
    generate_prisma
    
    # Настраиваем базу данных
    setup_database "$env_type"
    
    # Проверяем конфигурацию
    validate_config
    
    success "Environment setup completed successfully!"
    
    # Выводим информацию о следующем шаге
    case $env_type in
        "development")
            echo ""
            log "To start the development servers:"
            echo "  Frontend: npm run dev:situs"
            echo "  Backend:  npm run dev:api"
            echo "  Both:     npm run dev:full"
            ;;
        "production")
            echo ""
            log "To start the production server:"
            echo "  npm run build"
            echo "  npm run start:prod"
            ;;
        "docker")
            echo ""
            log "To start with Docker:"
            echo "  docker-compose up -d"
            ;;
    esac
}

# Запускаем основную функцию
main "$@"