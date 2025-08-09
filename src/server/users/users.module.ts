import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

/**
 * Модуль пользователей
 * 
 * Управляет:
 * - CRUD операциями с пользователями
 * - Профилями пользователей
 * - Настройками аккаунта
 */
@Module({
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
