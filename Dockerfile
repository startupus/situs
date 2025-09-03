# Backend container (NestJS + Prisma PostgreSQL)
FROM node:20-alpine AS builder

# Install system dependencies
RUN apk add --no-cache libc6-compat curl

# Set working directory
WORKDIR /app

# Environment setup
ENV NODE_ENV=production
ENV PRISMA_GENERATE_SKIP_AUTOINSTALL=true

# Copy package files
COPY package.json package-lock.json* ./

# Install all dependencies (including dev for build)
RUN npm ci --legacy-peer-deps || npm install --legacy-peer-deps

# Copy source files
COPY tsconfig.json tsconfig.server.json ./
COPY prisma ./prisma
COPY src ./src

# Generate Prisma client with proper URL
ENV DATABASE_URL=postgresql://situs:situs_password@postgres:5432/situs?schema=public
RUN npx prisma generate --schema=./prisma/schema.prisma

# Build NestJS application
RUN npm run nestjs:build

# Production stage
FROM node:20-alpine AS runtime

# Install system dependencies
RUN apk add --no-cache curl

WORKDIR /app

# Copy built application and dependencies
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/prisma ./prisma

# Environment variables
ENV NODE_ENV=production
ENV PORT=3002
ENV DATABASE_URL=postgresql://situs:situs_password@postgres:5432/situs?schema=public

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=30s --retries=3 \
  CMD curl -f http://localhost:3002/health || exit 1

# Expose port
EXPOSE 3002

# Start command with proper error handling
CMD ["sh", "-c", "npx prisma migrate deploy || npx prisma db push; node dist/server/main.js"]


