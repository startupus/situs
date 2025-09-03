import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsEmail, IsOptional, MinLength } from 'class-validator';

export class AcceptInvitationDto {
  @ApiProperty({
    description: 'Токен приглашения',
    example: 'clm1234567890abcdef',
  })
  @IsString()
  token!: string;

  @ApiProperty({
    description: 'Email пользователя (должен совпадать с приглашением)',
    example: 'user@example.com',
  })
  @IsEmail()
  email!: string;

  @ApiProperty({
    description: 'Пароль для нового пользователя',
    example: 'SecurePassword123!',
  })
  @IsString()
  @MinLength(8)
  password!: string;

  @ApiProperty({
    description: 'Имя пользователя',
    example: 'Иван Иванов',
    required: false,
  })
  @IsOptional()
  @IsString()
  name?: string;
}
