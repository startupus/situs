# Documentation Index - Situs Project

## 📚 Available Documentation

### Core Architecture

- **`docs/BUSINESS_ARCHITECTURE.md`** - Multi-tenant SaaS business logic and entity relationships
- **`docs/PRODUCT_SCHEMAS.md`** - Database schemas for all product types
- **`docs/PRODUCT_MODULES_ARCHITECTURE.md`** - Architecture of product modules
- **`docs/TECHNICAL_SPECIFICATION.md`** - Event Bus and Plugin Architecture specifications

### Development Standards

- **`docs/DEVELOPMENT_STANDARDS.md`** - Safe development practices and automation
- **`docs/CODING_STANDARDS.md`** - Joomla-inspired coding standards
- **`docs/coding-standards/`** - Detailed coding standards structure

### Integration & Setup

- **`docs/NESTJS_INTEGRATION_PLAN.md`** - NestJS integration strategy
- **`docs/MCP_INTEGRATION.md`** - Model Context Protocol integration
- **`docs/ENVIRONMENT_SETUP_GUIDE.md`** - Environment configuration guide
- **`docs/DATABASE_SETUP.md`** - Database setup and configuration

### User Management & Authentication

- **`docs/USERS_BACKEND_TZ.md`** - User management backend technical specification
- **`docs/USERS_AND_INVITATIONS.md`** - User and invitation system
- **`docs/AUTHENTICATION.md`** - Authentication system
- **`docs/AUTH_AND_DOMAINS.md`** - Authentication and domain management

### UI/UX & Themes

- **`docs/PROJECT_THEMES_TECHNICAL_SPECIFICATION.md`** - Theme system technical specification
- **`docs/BROWSER_TOOLS_ARCHITECTURE.md`** - Browser tools architecture

### Monitoring & Health

- **`docs/HEALTH_MONITOR_QUICK_REFERENCE.md`** - Health monitoring quick reference
- **`docs/MENU_FIXES_REPORT.md`** - Menu system fixes and improvements

### Platform Setup

- **`docs/SETUP_WINDOWS.md`** - Windows setup guide
- **`docs/ИНСТРУКЦИЯ_ПО_ДОСТУПУ.md`** - Access instructions (Russian)

### Data & Testing

- **`docs/DEMO_DATA.md`** - Demo data and mocking strategies
- **`docs/testing/`** - Testing documentation and guidelines

### Business Logic

- **`docs/rules.md`** - Business rules and constraints
- **`docs/DEVELOPMENT.md`** - Development guidelines

## 🎯 Key Documentation Highlights

### Business Architecture

- **Multi-tenant SaaS**: Project-based data isolation
- **Product Types**: Website, E-commerce, Blog, CRM, Task Manager, Analytics
- **User Roles**: BUSINESS, AGENCY, ADMIN with subscription plans
- **Domain Management**: Custom domains and subdomains

### Technical Architecture

- **Event-Driven**: Event Bus for decoupled communication
- **Plugin System**: Extensible architecture for new products
- **Real-time**: SSE streams for live updates
- **Multi-Product**: Support for various business functionalities

### Development Standards

- **Safe Development**: `npm run dev:safe` for automated setup
- **TypeScript Strict**: Comprehensive type safety
- **Pre-commit Hooks**: Automated validation and schema sync
- **Health Monitoring**: Comprehensive system health checks

### Database Design

- **Schema Isolation**: Each product type has isolated data
- **Multi-tenant**: Project-based data separation
- **Prisma ORM**: Type-safe database access
- **Migration System**: Automated schema updates

## 📋 Documentation Status

### ✅ Complete & Current

- Business Architecture
- Development Standards
- Health Monitoring
- Environment Setup
- User Management
- Authentication System

### 🔄 In Progress

- Plugin Architecture Implementation
- Event Bus System
- Multi-Product Integration

### 📝 Needs Updates

- API Documentation
- Testing Guidelines
- Deployment Procedures

## 🔍 Quick Reference

### Essential Commands

```bash
# Safe development startup
npm run dev:safe

# Schema synchronization
npm run schema:sync

# Health monitoring
node scripts/health-monitor.js

# Build validation
npm run validate:build
```

### Key Directories

- **`docs/`** - Main documentation
- **`docs/coding-standards/`** - Detailed coding standards
- **`docs/testing/`** - Testing documentation
- **`docs/specs/`** - Technical specifications
- **`docs/research/`** - Architecture research

### Critical Files

- **`docs/DEVELOPMENT_STANDARDS.md`** - Must-read for development
- **`docs/BUSINESS_ARCHITECTURE.md`** - Core business logic
- **`docs/CODING_STANDARDS.md`** - Code quality standards
- **`docs/HEALTH_MONITOR_QUICK_REFERENCE.md`** - Monitoring guide

---

**Last Updated**: 2025-09-03  
**Maintained By**: VAN Mode Health Assessment  
**Next Review**: After implementing immediate fixes
