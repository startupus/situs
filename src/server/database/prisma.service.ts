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
      // Уменьшенные таймауты для dev-режима, чтобы избежать зависания
      const connectTimeout = process.env.NODE_ENV === 'production' ? 10000 : 3000;
      
      await Promise.race([
        this.$connect(),
        new Promise((_, reject) => 
          setTimeout(() => reject(new Error('DB connect timeout')), connectTimeout)
        )
      ]);
      
      console.log('✅ Подключение к базе данных установлено');

      // Dev-seed: не блокируем запуск приложения. Выполняем best-effort без await.
      if (process.env.NODE_ENV !== 'production') {
        setImmediate(async () => {
          try {
            const devEmail = 'dev@situs.local';
            await this.user.upsert({
              where: { email: devEmail },
              update: {},
              create: { username: 'dev', email: devEmail, password: 'dev' },
            });
            console.log('👤 dev-пользователь готов (best-effort)');
          } catch (e: any) {
            console.warn('⚠️ Не удалось создать dev-пользователя (не критично):', (e && (e.message || e)));
          }
        });
      }
    } catch (error: any) {
      console.error('❌ Ошибка подключения к базе данных:', (error && (error.message || error)));
      // В dev-режиме не блокируем запуск: API/health должны быть доступны
      if (process.env.NODE_ENV === 'production') {
        throw error;
      }
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
