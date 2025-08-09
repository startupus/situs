#!/bin/bash

# Синхронизация Prisma схемы между корнем и backend/
# Обеспечивает консистентность схемы во всем проекте

set -e

echo "🔄 Prisma Schema Sync"
echo "===================="

# Цвета для вывода
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m'

log_info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

log_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

log_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

# Проверяем существование основной схемы
MAIN_SCHEMA="prisma/schema.prisma"
BACKEND_SCHEMA="backend/prisma/schema.prisma"

if [ ! -f "$MAIN_SCHEMA" ]; then
    log_warning "Main schema not found: $MAIN_SCHEMA"
    exit 1
fi

# Создаем директорию backend/prisma если не существует
mkdir -p "backend/prisma"

# Копируем схему
log_info "Copying schema from $MAIN_SCHEMA to $BACKEND_SCHEMA"
cp "$MAIN_SCHEMA" "$BACKEND_SCHEMA"

# Валидируем схему
log_info "Validating synchronized schema..."
if npx prisma validate --schema="$BACKEND_SCHEMA" 2>/dev/null; then
    log_success "Schema synchronized and validated successfully ✅"
else
    log_warning "Schema validation failed after sync"
    exit 1
fi

log_success "Prisma schemas are now in sync!"