import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, IsNotEmpty, IsOptional, IsPhoneNumber, Length } from 'class-validator';

/**
 * DTO для проверки кода подтверждения и входа
 */
export class VerifyCodeDto {
  @ApiProperty({
    description: 'Email пользователя',
    example: 'user@example.com',
    required: false,
  })
  @IsEmail({}, { message: 'Некорректный формат email' })
  @IsOptional()
  email?: string;

  @ApiProperty({
    description: 'Номер телефона пользователя',
    example: '+79001234567',
    required: false,
  })
  @IsPhoneNumber('RU', { message: 'Некорректный формат номера телефона' })
  @IsOptional()
  phone?: string;

  @ApiProperty({
    description: 'Код подтверждения',
    example: '123456',
  })
  @IsString({ message: 'Код должен быть строкой' })
  @IsNotEmpty({ message: 'Код обязателен' })
  @Length(6, 6, { message: 'Код должен содержать 6 цифр' })
  code!: string;
}
