import { IsEmail, IsOptional, IsString } from 'class-validator';

/**
 * DTO для выдачи доступа к проекту
 * Разрешаем указать либо userId, либо userEmail (в этом случае пользователь будет создан при необходимости)
 */
export class GrantProjectAccessDto {
  @IsOptional()
  @IsString({ message: 'userId должен быть строкой' })
  userId?: string;

  @IsOptional()
  @IsEmail({}, { message: 'Некорректный email пользователя' })
  userEmail?: string;

  @IsString({ message: 'Роль обязательна' })
  role!: string; // OWNER | ADMIN | EDITOR | VIEWER
}


