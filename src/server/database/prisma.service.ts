import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

/**
 * Сервис для работы с Prisma ORM
 * 
 * Управляет подключением к базе данных
 * и предоставляет клиент для всех модулей
 */
@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  constructor() {
    // Диагностика долгого старта: логируем конструктор
    console.log('[Prisma] constructor start');
    super({
      log: process.env.NODE_ENV === 'development' ? ['query', 'info', 'warn', 'error'] : ['error'],
    });
    console.log('[Prisma] constructor end');
  }

  /**
   * Подключение к базе данных при инициализации модуля
   */
  async onModuleInit() {
    console.log('[Prisma] onModuleInit start');
    try {
      await this.$connect();
      console.log('✅ Подключение к базе данных установлено');
    } catch (error: any) {
      console.warn('⚠️ Ошибка подключения к базе данных (не критично):', (error && (error.message || error)));
    }
    console.log('[Prisma] onModuleInit end');
  }

  /**
   * Отключение от базы данных при завершении работы модуля
   */
  async onModuleDestroy() {
    await this.$disconnect();
    console.log('🔌 Отключение от базы данных');
  }

  /**
   * Очистка всех таблиц (для тестирования)
   */
  async cleanDatabase() {
    if (process.env.NODE_ENV === 'production') {
      throw new Error('Очистка базы данных недоступна в production');
    }

    const tablenames = await this.$queryRaw<Array<{ tablename: string }>>`
      SELECT tablename FROM pg_tables WHERE schemaname='public'
    `;

    for (const { tablename } of tablenames) {
      if (tablename !== '_prisma_migrations') {
        try {
          await this.$executeRawUnsafe(`TRUNCATE TABLE "public"."${tablename}" CASCADE;`);
        } catch (error: any) {
          console.log({ error: (error && (error.message || error)) });
        }
      }
    }
  }
}
