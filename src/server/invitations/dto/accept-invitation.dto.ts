import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, IsEmail, MinLength, MaxLength } from 'class-validator';

/**
 * DTO для принятия приглашения
 */
export class AcceptInvitationDto {
  @ApiProperty({
    description: 'Email пользователя (если не указан в приглашении)',
    example: 'user@example.com',
    required: false,
  })
  @IsOptional()
  @IsEmail({}, { message: 'Некорректный формат email' })
  email?: string;

  @ApiProperty({
    description: 'Пароль пользователя (если создается новый аккаунт)',
    example: 'SecurePassword123',
    required: false,
  })
  @IsOptional()
  @IsString()
  @MinLength(8, { message: 'Пароль должен содержать минимум 8 символов' })
  @MaxLength(50, { message: 'Пароль должен содержать максимум 50 символов' })
  password?: string;

  @ApiProperty({
    description: 'Имя пользователя',
    example: 'Иван Иванов',
    required: false,
  })
  @IsOptional()
  @IsString()
  @MaxLength(100, { message: 'Имя должно содержать максимум 100 символов' })
  name?: string;

  @ApiProperty({
    description: 'Внешний провайдер аутентификации',
    example: 'google',
    required: false,
  })
  @IsOptional()
  @IsString()
  provider?: string;

  @ApiProperty({
    description: 'ID пользователя у внешнего провайдера',
    example: '123456789',
    required: false,
  })
  @IsOptional()
  @IsString()
  providerUserId?: string;
}
