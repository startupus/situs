import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, IsOptional, MinLength, MaxLength, IsEnum, IsBoolean, ValidateIf } from 'class-validator';
import { GlobalRole, UserStatus } from '../entities/user.entity';

/**
 * DTO для создания пользователя
 */
export class CreateUserDto {
  @ApiProperty({
    description: 'Email пользователя',
    example: 'user@example.com',
  })
  @ValidateIf((o: CreateUserDto) => !o.provider || !o.providerUserId)
  @IsEmail({}, { message: 'Некорректный формат email' })
  email?: string;

  @ApiProperty({
    description: 'Пароль пользователя',
    example: 'SecurePassword123',
  })
  @ValidateIf((o: CreateUserDto) => !o.provider || !o.providerUserId)
  @IsString()
  @MinLength(8, { message: 'Пароль должен содержать минимум 8 символов' })
  @MaxLength(50, { message: 'Пароль должен содержать максимум 50 символов' })
  password?: string;

  @ApiProperty({
    description: 'Имя пользователя',
    example: 'Иван Иванов',
  })
  @IsString()
  @MaxLength(100, { message: 'Имя должно содержать максимум 100 символов' })
  @IsOptional()
  name?: string;

  @ApiProperty({
    description: 'Аватар пользователя',
    example: 'https://example.com/avatar.jpg',
    required: false,
  })
  @IsOptional()
  @IsString()
  avatar?: string;

  @ApiProperty({
    description: 'Глобальная роль пользователя',
    enum: GlobalRole,
    example: GlobalRole.BUSINESS,
    required: false,
  })
  @IsOptional()
  @IsEnum(GlobalRole, { message: 'Некорректная роль пользователя' })
  globalRole?: GlobalRole;

  @ApiProperty({
    description: 'Статус пользователя',
    enum: UserStatus,
    example: UserStatus.ACTIVE,
    required: false,
  })
  @IsOptional()
  @IsEnum(UserStatus, { message: 'Некорректный статус пользователя' })
  status?: UserStatus;

  @ApiProperty({
    description: 'Активен ли пользователь',
    example: true,
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @ApiProperty({
    description: 'Внешний провайдер аутентификации (например, google, github)',
    required: false,
  })
  @IsOptional()
  @IsString()
  provider?: string;

  @ApiProperty({
    description: 'Идентификатор пользователя у провайдера',
    required: false,
  })
  @IsOptional()
  @IsString()
  providerUserId?: string;
}
