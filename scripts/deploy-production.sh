#!/bin/bash

# Production Deployment Script for Situs Multi-Tenant System
# This script handles the complete deployment process for production environment

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
PROJECT_NAME="situs"
BACKUP_DIR="./backups"
LOG_FILE="./logs/deployment-$(date +%Y%m%d-%H%M%S).log"

# Create necessary directories
mkdir -p "$BACKUP_DIR"
mkdir -p "./logs"
mkdir -p "./uploads"
mkdir -p "./health-reports"

# Logging function
log() {
    echo -e "${BLUE}[$(date +'%Y-%m-%d %H:%M:%S')]${NC} $1" | tee -a "$LOG_FILE"
}

error() {
    echo -e "${RED}[ERROR]${NC} $1" | tee -a "$LOG_FILE"
    exit 1
}

success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1" | tee -a "$LOG_FILE"
}

warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1" | tee -a "$LOG_FILE"
}

# Check if required environment variables are set
check_environment() {
    log "Checking environment variables..."
    
    required_vars=(
        "POSTGRES_PASSWORD"
        "REDIS_PASSWORD"
        "JWT_SECRET"
        "CORS_ORIGINS"
    )
    
    missing_vars=()
    for var in "${required_vars[@]}"; do
        if [ -z "${!var}" ]; then
            missing_vars+=("$var")
        fi
    done
    
    if [ ${#missing_vars[@]} -ne 0 ]; then
        error "Missing required environment variables: ${missing_vars[*]}"
    fi
    
    success "Environment variables check passed"
}

# Backup current deployment
backup_current() {
    log "Creating backup of current deployment..."
    
    if [ -d "./backups/current" ]; then
        rm -rf "./backups/current"
    fi
    
    mkdir -p "./backups/current"
    
    # Backup database
    if docker compose ps postgres | grep -q "Up"; then
        log "Backing up database..."
        docker compose exec -T postgres pg_dump -U situs_user situs_production > "./backups/current/database.sql"
        success "Database backup created"
    fi
    
    # Backup uploads
    if [ -d "./uploads" ]; then
        cp -r "./uploads" "./backups/current/"
        success "Uploads backup created"
    fi
    
    # Backup logs
    if [ -d "./logs" ]; then
        cp -r "./logs" "./backups/current/"
        success "Logs backup created"
    fi
    
    success "Backup completed"
}

# Stop current services
stop_services() {
    log "Stopping current services..."
    
    if [ -f "docker-compose.yml" ]; then
        docker compose down --remove-orphans
        success "Services stopped"
    else
        warning "No docker-compose.yml found, skipping service stop"
    fi
}

# Build and start services
deploy_services() {
    log "Building and starting services..."
    
    # Copy production environment file
    if [ -f "env.production" ]; then
        cp "env.production" ".env"
        success "Production environment file copied"
    else
        error "Production environment file (env.production) not found"
    fi
    
    # Build and start services
    docker compose -f docker-compose.production.yml up -d --build
    
    # Wait for services to be healthy
    log "Waiting for services to be healthy..."
    sleep 30
    
    # Check service health
    check_service_health
    
    success "Services deployed successfully"
}

# Check service health
check_service_health() {
    log "Checking service health..."
    
    services=("postgres" "redis" "situs-api" "situs-web")
    
    for service in "${services[@]}"; do
        log "Checking $service health..."
        
        max_attempts=30
        attempt=1
        
        while [ $attempt -le $max_attempts ]; do
            if docker compose -f docker-compose.production.yml ps "$service" | grep -q "healthy"; then
                success "$service is healthy"
                break
            elif [ $attempt -eq $max_attempts ]; then
                error "$service failed to become healthy after $max_attempts attempts"
            else
                log "Waiting for $service to become healthy... (attempt $attempt/$max_attempts)"
                sleep 10
                attempt=$((attempt + 1))
            fi
        done
    done
}

# Run database migrations
run_migrations() {
    log "Running database migrations..."
    
    # Wait for database to be ready
    sleep 10
    
    # Run Prisma migrations
    docker compose -f docker-compose.production.yml exec situs-api npx prisma migrate deploy
    
    success "Database migrations completed"
}

# Seed initial data
seed_data() {
    log "Seeding initial data..."
    
    # Seed admin data
    docker compose -f docker-compose.production.yml exec situs-api npm run db:seed:admin
    
    success "Initial data seeded"
}

# Run health checks
run_health_checks() {
    log "Running health checks..."
    
    # Check API health
    if curl -f http://localhost:3002/health > /dev/null 2>&1; then
        success "API health check passed"
    else
        error "API health check failed"
    fi
    
    # Check web health
    if curl -f http://localhost/health > /dev/null 2>&1; then
        success "Web health check passed"
    else
        error "Web health check failed"
    fi
    
    # Check tenant monitoring
    if curl -f http://localhost:3002/api/monitoring/health > /dev/null 2>&1; then
        success "Tenant monitoring health check passed"
    else
        warning "Tenant monitoring health check failed (may be expected if no tenant context)"
    fi
}

# Cleanup old backups
cleanup_backups() {
    log "Cleaning up old backups..."
    
    # Keep only last 5 backups
    if [ -d "./backups" ]; then
        cd "./backups"
        ls -t | tail -n +6 | xargs -r rm -rf
        cd ..
        success "Old backups cleaned up"
    fi
}

# Main deployment function
main() {
    log "Starting production deployment for $PROJECT_NAME..."
    
    # Pre-deployment checks
    check_environment
    
    # Backup current deployment
    backup_current
    
    # Stop current services
    stop_services
    
    # Deploy new services
    deploy_services
    
    # Run database migrations
    run_migrations
    
    # Seed initial data
    seed_data
    
    # Run health checks
    run_health_checks
    
    # Cleanup old backups
    cleanup_backups
    
    success "Production deployment completed successfully!"
    
    log "Deployment summary:"
    log "- Services: postgres, redis, situs-api, situs-web"
    log "- API URL: http://localhost:3002"
    log "- Web URL: http://localhost"
    log "- Prisma Studio: http://localhost:5555 (admin profile)"
    log "- Health Monitor: Running in background"
    log "- Logs: ./logs/"
    log "- Backups: ./backups/"
    
    log "Next steps:"
    log "1. Update DNS records to point to your server"
    log "2. Configure SSL certificates"
    log "3. Set up monitoring and alerting"
    log "4. Test multi-tenant functionality"
}

# Run main function
main "$@"
