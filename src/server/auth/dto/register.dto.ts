import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, MinLength, MaxLength, IsNotEmpty } from 'class-validator';

/**
 * DTO для регистрации пользователя
 */
export class RegisterDto {
  @ApiProperty({
    description: 'Email пользователя',
    example: 'user@example.com',
  })
  @IsEmail({}, { message: 'Некорректный формат email' })
  @IsNotEmpty({ message: 'Email обязателен' })
  email!: string;

  @ApiProperty({
    description: 'Пароль пользователя',
    example: 'SecurePassword123',
    minLength: 8,
    maxLength: 50,
  })
  @IsString({ message: 'Пароль должен быть строкой' })
  @MinLength(8, { message: 'Пароль должен содержать минимум 8 символов' })
  @MaxLength(50, { message: 'Пароль должен содержать максимум 50 символов' })
  @IsNotEmpty({ message: 'Пароль обязателен' })
  password!: string;

  @ApiProperty({
    description: 'Имя пользователя',
    example: 'Иван Иванов',
    maxLength: 100,
  })
  @IsString({ message: 'Имя должно быть строкой' })
  @MaxLength(100, { message: 'Имя должно содержать максимум 100 символов' })
  @IsNotEmpty({ message: 'Имя обязательно' })
  name!: string;
}
