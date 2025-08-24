import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, IsNotEmpty, IsOptional, IsPhoneNumber } from 'class-validator';

/**
 * DTO для отправки кода подтверждения для входа
 */
export class SendCodeDto {
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
    description: 'Канал связи для отправки кода',
    example: 'EMAIL',
    enum: ['EMAIL', 'SMS', 'TELEGRAM', 'WHATSAPP'],
    default: 'EMAIL',
  })
  @IsString({ message: 'Канал связи должен быть строкой' })
  @IsNotEmpty({ message: 'Канал связи обязателен' })
  channel!: string;
}
