import { Global, Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';

/**
 * Модуль базы данных
 *
 * Предоставляет глобальный доступ к Prisma ORM
 */
@Global()
@Module({
  providers: [PrismaService],
  exports: [PrismaService],
})
export class DatabaseModule {}
