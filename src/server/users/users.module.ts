import { Module } from '@nestjs/common';
import { DatabaseModule } from '../database/database.module';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { RealtimeModule } from '../realtime/realtime.module';

/**
 * Модуль пользователей
 * 
 * Управляет:
 * - CRUD операциями с пользователями
 * - Профилями пользователей
 * - Настройками аккаунта
 */
@Module({
  imports: [DatabaseModule, RealtimeModule],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
