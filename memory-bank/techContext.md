# Technical Context - Situs

## Development Environment

- **Platform**: macOS (Darwin)
- **Node.js**: v20.10.0+
- **Package Manager**: npm
- **Git**: Version control with pre-commit hooks
- **Safe Development**: `npm run dev:safe` for automated setup

## Build System

- **Frontend Build**: Vite with React plugin
- **Backend Build**: NestJS with TypeScript compilation
- **TypeScript**: Strict mode with custom build config (tsconfig.build.json)
- **PostCSS**: Tailwind CSS processing with source maps
- **Schema Sync**: Automated Prisma schema synchronization

## Database & Storage

- **Primary Database**: PostgreSQL 15 with schema isolation
- **ORM**: Prisma with migrations and client generation
- **Caching**: Redis for session management
- **File Storage**: Local filesystem with media management
- **Multi-tenant**: Data isolation per project/product

## Development Tools

- **Linting**: ESLint with custom configuration
- **Formatting**: Prettier with pre-commit hooks
- **Testing**: Playwright (E2E), Vitest (Unit)
- **Health Monitoring**: Custom health-monitor.js script
- **Build Validation**: Automated build and config validation

## Architecture Components

- **Event Bus**: Event-driven architecture for decoupled communication
- **Plugin System**: Extensible architecture for new product types
- **SSE Streams**: Real-time updates via Server-Sent Events
- **Webhook System**: External integrations and notifications
- **Multi-Product**: Support for Website, E-commerce, Blog, CRM, etc.

## Event System Architecture

- **Current Implementation**: RealtimeEventsService with RxJS Subjects
- **SSE Endpoints**: `/api/projects/events`, `/api/realtime/integrations`, `/api/realtime/users`
- **Event Types**: 20+ types including project*\*, integration*_, user\__
- **Frontend Integration**: React hooks for SSE consumption
- **Multi-tenant**: Event isolation by projectId
- **Transport**: Server-Sent Events with fallback mechanisms
- **Real-time**: Cross-browser synchronization without session binding

## Deployment

- **Containerization**: Docker + Docker Compose
- **Services**: API, Web, Database, Cache, Prisma Studio
- **Environment Management**: Automated setup scripts
- **Health Checks**: Comprehensive monitoring system
- **Multi-stage Builds**: Optimized container builds

## Configuration Files

- **Package Management**: package.json, package-lock.json
- **TypeScript**: tsconfig.json, tsconfig.build.json, tsconfig.server.json
- **Build Tools**: vite.config.ts, tailwind.config.js, postcss.config.js
- **Docker**: Dockerfile, docker-compose.yml
- **Environment**: .env files for different stages (dev, prod, docker)
- **Prisma**: schema.prisma with multi-product support
