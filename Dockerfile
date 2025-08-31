# Simple backend container (NestJS + Prisma SQLite)
FROM node:20-alpine AS base
ENV NODE_ENV=development
WORKDIR /app

# Install deps
COPY package.json package-lock.json* ./
RUN npm ci --legacy-peer-deps || npm install --legacy-peer-deps

# Copy sources
COPY tsconfig.json tsconfig.server.json ./
COPY prisma ./prisma
COPY src ./src

# Generate Prisma client (PostgreSQL)
ENV DATABASE_URL=postgresql://situs:situs_password@postgres:5432/situs?schema=public
RUN npx prisma generate

# Build NestJS server
RUN npm run nestjs:build

# Runtime
EXPOSE 3002
ENV PORT=3002
CMD sh -lc "npx prisma migrate deploy || npx prisma db push; node dist/server/main.js"


