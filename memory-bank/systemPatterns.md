# System Patterns - Situs

## Architecture Patterns

- **Multi-tenant SaaS**: Project-based data isolation with custom domains
- **Event-Driven**: Event Bus for decoupled communication between services
- **Plugin Architecture**: Extensible system for new product types
- **API-First**: RESTful API design with comprehensive endpoints
- **Microservice Ready**: Products can be separate services

## Business Logic Patterns

- **Project Container**: Projects contain multiple products under one domain
- **Product Types**: Website, E-commerce, Blog, CRM, Task Manager, Analytics
- **Role-Based Access**: User roles (BUSINESS, AGENCY, ADMIN) with project permissions
- **Subscription Management**: Plan-based limits and feature access
- **Multi-domain**: Custom domains and subdomains per project

## Development Patterns

- **TypeScript-First**: Strict typing throughout the application
- **Component-Based**: React components with TypeScript interfaces
- **Service-Oriented**: NestJS services with dependency injection
- **Repository Pattern**: Prisma for data access abstraction
- **Safe Development**: Automated setup with `npm run dev:safe`

## Code Organization

- **Domain-Driven**: Components organized by business domain
- **Feature-Based**: UI components organized by feature/domain
- **Shared Utilities**: Common functions and types in shared directories
- **Configuration-Driven**: Environment-based configuration management
- **Schema Isolation**: Database schemas isolated per product type

## Quality Assurance

- **Pre-commit Hooks**: Automated linting, formatting, and schema sync
- **Health Monitoring**: Comprehensive system health checks
- **Build Validation**: Automated build and configuration validation
- **Environment Standardization**: Consistent setup across dev/prod/docker
- **Code Standards**: Joomla-inspired coding standards

## Real-time Patterns

- **SSE Streams**: Server-Sent Events for live updates
- **Event Broadcasting**: Real-time notifications via Event Bus
- **Webhook System**: External integrations and notifications
- **Cross-browser Sync**: Real-time updates across different browsers/contexts
- **Fallback Mechanisms**: Universal subscription with fetch-stream fallback
- **Event Isolation**: Multi-tenant event separation by projectId

## Event-driven Patterns

- **Event Bus**: Centralized event system with RxJS Subjects
- **Event Types**: Standardized event naming (project*\*, integration*_, user\__)
- **Event Handlers**: Async event processing with error handling
- **Event Store**: Persistent event storage with PostgreSQL
- **Event Middleware**: Processing pipeline for event transformation
- **Event Filtering**: Type-based and metadata-based event filtering
- **Live Collaboration**: Real-time updates for multi-user editing

## Deployment Patterns

- **Multi-stage Docker**: Optimized container builds
- **Environment Isolation**: Separate configurations for each environment
- **Health Checks**: Docker health checks for all services
- **Automated Setup**: Scripts for environment initialization
- **Container Orchestration**: Docker Compose for service management

## Monitoring & Observability

- **Health Endpoints**: /health endpoints for service monitoring
- **Structured Logging**: Consistent logging format across services
- **Performance Monitoring**: Response time and resource usage tracking
- **Error Handling**: Comprehensive error handling and reporting
- **Event Tracking**: Event Bus for audit trails and debugging
