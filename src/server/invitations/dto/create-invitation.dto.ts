import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, IsOptional, IsArray, IsEnum, IsNumber, Min, Max } from 'class-validator';
import { GlobalRole } from '../../users/entities/user.entity';

/**
 * DTO для создания приглашений
 */
export class CreateInvitationDto {
  @ApiProperty({
    description: 'Список email адресов для приглашения',
    example: ['user1@example.com', 'user2@example.com'],
  })
  @IsArray()
  @IsEmail({}, { each: true, message: 'Некорректный формат email' })
  emails!: string[];

  @ApiProperty({
    description: 'Роль для приглашенных пользователей',
    enum: GlobalRole,
    example: GlobalRole.BUSINESS,
  })
  @IsEnum(GlobalRole, { message: 'Некорректная роль' })
  role!: GlobalRole;

  @ApiProperty({
    description: 'Сообщение для приглашенных пользователей',
    example: 'Добро пожаловать в нашу команду!',
    required: false,
  })
  @IsOptional()
  @IsString()
  message?: string;

  @ApiProperty({
    description: 'Время действия приглашения в часах',
    example: 72,
    required: false,
  })
  @IsOptional()
  @IsNumber()
  @Min(1, { message: 'Минимальное время действия - 1 час' })
  @Max(8760, { message: 'Максимальное время действия - 1 год (8760 часов)' })
  expiresInHours?: number;

  @ApiProperty({
    description: 'ID аккаунта (если приглашение в аккаунт)',
    example: 'clm1234567890',
    required: false,
  })
  @IsOptional()
  @IsString()
  accountId?: string;

  @ApiProperty({
    description: 'ID проекта (если приглашение в проект)',
    example: 'clm1234567890',
    required: false,
  })
  @IsOptional()
  @IsString()
  projectId?: string;
}
