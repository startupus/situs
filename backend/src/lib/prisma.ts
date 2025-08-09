import { PrismaClient } from '@prisma/client';

// Создаем глобальный экземпляр Prisma клиента
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma = globalForPrisma.prisma ?? new PrismaClient({
  log: ['error', 'warn'],
  datasources: {
    db: {
      url: process.env.DATABASE_URL || 'file:../prisma/dev.db'
    }
  }
});

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}

// Graceful shutdown для Prisma обрабатывается в index.ts

export default prisma;
