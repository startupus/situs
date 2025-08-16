import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, IsNotEmpty } from 'class-validator';

/**
 * DTO для входа в систему
 */
export class LoginDto {
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
  })
  @IsString({ message: 'Пароль должен быть строкой' })
  @IsNotEmpty({ message: 'Пароль обязателен' })
  password!: string;
}
