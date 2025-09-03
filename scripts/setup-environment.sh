#!/bin/bash

# =============================================================================
# SITUS PLATFORM - ENVIRONMENT SETUP SCRIPT
# =============================================================================

set -e  # Exit on any error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Functions
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

# Check if running from project root
check_project_root() {
    if [ ! -f "package.json" ] || [ ! -f "vite.config.ts" ]; then
        log_error "Please run this script from the project root directory"
        exit 1
    fi
}

# Validate environment parameter
validate_environment() {
    local env=$1
    case $env in
        development|production|docker)
            return 0
            ;;
        *)
            log_error "Invalid environment: $env"
            log_info "Valid environments: development, production, docker"
            exit 1
            ;;
    esac
}

# Setup environment files
setup_env_file() {
    local env=$1
    local source_file="env.$env"
    local target_file=".env"
    
    if [ ! -f "$source_file" ]; then
        log_error "Environment file $source_file not found"
        exit 1
    fi
    
    # Backup existing .env if it exists
    if [ -f "$target_file" ]; then
        cp "$target_file" "${target_file}.backup.$(date +%Y%m%d_%H%M%S)"
        log_info "Backed up existing .env file"
    fi
    
    # Copy environment file
    cp "$source_file" "$target_file"
    log_success "Environment set to: $env"
}

# Check Node.js version
check_node_version() {
    local required_version="20"
    local current_version=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
    
    if [ "$current_version" -lt "$required_version" ]; then
        log_error "Node.js version $required_version+ required. Current: $(node -v)"
        exit 1
    fi
    
    log_success "Node.js version check passed: $(node -v)"
}

# Check Docker availability
check_docker() {
    if ! command -v docker &> /dev/null; then
        log_error "Docker is not installed or not in PATH"
        exit 1
    fi
    
    if ! docker info &> /dev/null; then
        log_error "Docker daemon is not running"
        exit 1
    fi
    
    log_success "Docker is available and running"
}

# Install dependencies
install_dependencies() {
    log_info "Installing Node.js dependencies..."
    
    if [ -f "package-lock.json" ]; then
        npm ci --legacy-peer-deps
    else
        npm install --legacy-peer-deps
    fi
    
    log_success "Dependencies installed successfully"
}

# Generate Prisma client
generate_prisma() {
    log_info "Generating Prisma client..."
    npx prisma generate
    log_success "Prisma client generated"
}

# Validate configuration
validate_config() {
    local env=$1
    
    log_info "Validating configuration for $env environment..."
    
    # Check required environment variables
    source .env
    
    local required_vars=("NODE_ENV" "DATABASE_URL" "JWT_SECRET")
    local missing_vars=()
    
    for var in "${required_vars[@]}"; do
        if [ -z "${!var}" ]; then
            missing_vars+=("$var")
        fi
    done
    
    if [ ${#missing_vars[@]} -ne 0 ]; then
        log_error "Missing required environment variables: ${missing_vars[*]}"
        exit 1
    fi
    
    log_success "Configuration validation passed"
}

# Health check for services
health_check() {
    local env=$1
    
    case $env in
        development)
            log_info "Checking development services..."
            # Check if PostgreSQL is running on localhost:55432
            if ! nc -z localhost 55432 2>/dev/null; then
                log_warning "PostgreSQL not running on localhost:55432"
                log_info "Run: docker compose up -d postgres"
            else
                log_success "PostgreSQL is running"
            fi
            ;;
        docker)
            log_info "Checking Docker services..."
            if ! docker compose ps | grep -q "Up"; then
                log_warning "Docker services not running"
                log_info "Run: docker compose up -d"
            else
                log_success "Docker services are running"
            fi
            ;;
    esac
}

# Port availability check
check_ports() {
    local env=$1
    local ports_to_check=()
    
    case $env in
        development)
            ports_to_check=(3002 5177 55432 6379)
            ;;
        docker)
            ports_to_check=(3002 5177 55432 6379 5555)
            ;;
    esac
    
    for port in "${ports_to_check[@]}"; do
        if lsof -i ":$port" &> /dev/null; then
            local process=$(lsof -i ":$port" | tail -n1 | awk '{print $1}')
            log_warning "Port $port is already in use by: $process"
        else
            log_success "Port $port is available"
        fi
    done
}

# Main setup function
main() {
    local environment=${1:-development}
    
    log_info "Setting up Situs platform for $environment environment"
    
    # Validations
    check_project_root
    validate_environment "$environment"
    check_node_version
    
    # Docker specific checks
    if [ "$environment" = "docker" ]; then
        check_docker
    fi
    
    # Setup
    setup_env_file "$environment"
    install_dependencies
    generate_prisma
    validate_config "$environment"
    
    # Health checks
    health_check "$environment"
    check_ports "$environment"
    
    log_success "Environment setup completed successfully!"
    
    # Show next steps
    echo
    log_info "Next steps:"
    case $environment in
        development)
            echo "  1. Start PostgreSQL: docker compose up -d postgres redis"
            echo "  2. Run migrations: npm run db:push"
            echo "  3. Seed database: npm run db:seed:admin"
            echo "  4. Start dev servers: npm run dev:full"
            ;;
        docker)
            echo "  1. Build containers: docker compose build"
            echo "  2. Start services: docker compose up -d"
            echo "  3. Check health: curl http://localhost:3002/health"
            ;;
        production)
            echo "  1. Review and update JWT_SECRET and POSTGRES_PASSWORD"
            echo "  2. Update CORS_ORIGINS and API URLs"
            echo "  3. Build application: npm run build"
            echo "  4. Deploy to production server"
            ;;
    esac
}

# Help function
show_help() {
    echo "Usage: $0 [environment]"
    echo
    echo "Available environments:"
    echo "  development  - Local development with hot reload"
    echo "  production   - Production build configuration"
    echo "  docker       - Docker containerized environment"
    echo
    echo "Examples:"
    echo "  $0 development"
    echo "  $0 docker"
    echo "  $0 production"
}

# Parse arguments
case ${1:-} in
    -h|--help)
        show_help
        exit 0
        ;;
    *)
        main "$@"
        ;;
esac
