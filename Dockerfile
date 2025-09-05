# Backend container (NestJS + Prisma PostgreSQL)
FROM node:20-alpine AS builder

# Install system dependencies
RUN apk add --no-cache libc6-compat curl

# Set working directory
WORKDIR /app

# Environment setup
ENV NODE_ENV=development
ENV PRISMA_GENERATE_SKIP_AUTOINSTALL=true

# Copy package files
COPY package.json package-lock.json* ./

# Install all dependencies (including dev for build) and ensure prisma toolchain exists
RUN npm ci --legacy-peer-deps || npm install --legacy-peer-deps
RUN npm install -D prisma @prisma/client --legacy-peer-deps || true

# Copy source files
COPY tsconfig.json tsconfig.server.json ./
COPY prisma ./prisma
COPY src ./src
COPY scripts ./scripts

# Generate Prisma client with proper URL
ENV DATABASE_URL=postgresql://situs:situs_password@postgres:5432/situs?schema=public
RUN npx prisma generate --schema=./prisma/schema.prisma

# Build NestJS application
RUN npm run nestjs:build

# Production stage
FROM node:20-alpine AS production

# Install system dependencies
RUN apk add --no-cache curl bash

# Install ts-node for running TypeScript scripts
RUN npm install -g ts-node

WORKDIR /app

# Copy built application and dependencies
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/scripts ./scripts
# Include demo-data used by seed scripts
COPY --from=builder /app/src/server/demo-data ./src/server/demo-data

# Environment variables
ENV NODE_ENV=production
ENV PORT=3002

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=30s --retries=3 \
  CMD curl -f http://localhost:3002/health || exit 1

# Expose port
EXPOSE 3002

# Use custom entrypoint for migrations and auto-seed
ENTRYPOINT ["./scripts/docker-entrypoint.sh"]
CMD ["node", "dist/server/main.js"]

# Runtime stage (alias for production)
FROM production AS runtime


