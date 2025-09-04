# Project Brief - Situs

## Project Identity

- **Name**: Situs Visual Website Builder
- **Type**: Multi-tenant SaaS platform for website building
- **Purpose**: Visual website building platform with drag-and-drop interface and multi-product architecture

## Business Architecture

- **Project**: Container for multiple products under one domain
- **Product**: Individual business functionality (Website, E-commerce, Blog, CRM, etc.)
- **User Roles**: BUSINESS, AGENCY, ADMIN with subscription plans
- **Multi-tenancy**: Each project has isolated data and custom domains

## Core Technology Stack

- **Frontend**: React 18 + TypeScript + Vite + Tailwind CSS
- **Backend**: NestJS + TypeScript + Prisma ORM
- **Database**: PostgreSQL with schema isolation per product
- **Caching**: Redis for session management
- **Containerization**: Docker + Docker Compose
- **Testing**: Playwright (E2E) + Vitest (Unit)
- **Real-time**: SSE (Server-Sent Events) for live updates

## Key Features

- **Multi-Product Architecture**: Website, E-commerce, Blog, CRM, Task Manager, Analytics
- **Visual Builder**: Drag-and-drop interface with theme customization
- **User Management**: Role-based access control with project-level permissions
- **Domain Management**: Custom domains and subdomains per project
- **Real-time Collaboration**: SSE streams for live updates
- **Plugin System**: Event-driven architecture with webhook support
- **Media Management**: File upload and management system

## Architecture Patterns

- **Event-Driven**: Event Bus for decoupled communication
- **Plugin Architecture**: Extensible system for new product types
- **Multi-tenant**: Data isolation per project/product
- **API-First**: RESTful API with comprehensive endpoints
- **Microservice Ready**: Products can be separate services

## Event System

- **Current Implementation**: RealtimeEventsService with RxJS Subjects
- **SSE Transport**: Server-Sent Events for real-time updates
- **Event Types**: 20+ standardized event types (project*\*, integration*\_, user\_\_)
- **Multi-tenant Events**: Event isolation by projectId
- **Cross-browser Sync**: Real-time updates across different browsers/contexts
- **Frontend Integration**: React hooks for SSE consumption
- **Fallback Mechanisms**: Universal subscription with fetch-stream fallback

## Development Standards

- **Safe Development**: `npm run dev:safe` for automated setup
- **TypeScript Strict**: Comprehensive type safety
- **Code Standards**: Joomla-inspired coding standards
- **Pre-commit Hooks**: Automated validation and schema sync
- **Health Monitoring**: Comprehensive system health checks

## Current Status

- **Development Phase**: Production-ready with comprehensive monitoring
- **Documentation**: Extensive technical and business documentation
- **Monitoring**: Health monitoring system with automated reports
- **Automation**: Build validation, environment setup, and deployment automation
