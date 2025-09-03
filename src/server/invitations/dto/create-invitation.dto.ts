import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsEnum, IsOptional, IsString, IsArray, IsDateString } from 'class-validator';
import { GlobalRole } from '../../users/entities/user.entity';

export enum CommunicationChannel {
  EMAIL = 'EMAIL',
  SMS = 'SMS',
  TELEGRAM = 'TELEGRAM',
  WHATSAPP = 'WHATSAPP',
  SLACK = 'SLACK',
}

export class CreateInvitationDto {
  @ApiProperty({
    description: 'Email адреса для приглашения',
    example: ['user1@example.com', 'user2@example.com'],
    type: [String],
  })
  @IsArray()
  @IsEmail({}, { each: true })
  emails!: string[];

  @ApiProperty({
    description: 'Роль по умолчанию для приглашенных пользователей',
    enum: GlobalRole,
    example: GlobalRole.BUSINESS,
  })
  @IsEnum(GlobalRole)
  role!: GlobalRole;

  @ApiProperty({
    description: 'Персональное сообщение (необязательно)',
    example: 'Добро пожаловать в нашу платформу!',
    required: false,
  })
  @IsOptional()
  @IsString()
  message?: string;

  @ApiProperty({
    description: 'Канал связи для отправки приглашения',
    enum: CommunicationChannel,
    example: CommunicationChannel.EMAIL,
  })
  @IsEnum(CommunicationChannel)
  channel!: CommunicationChannel;

  @ApiProperty({
    description: 'Дата истечения приглашения (ISO string)',
    example: '2024-12-31T23:59:59.000Z',
    required: false,
  })
  @IsOptional()
  @IsDateString()
  expiresAt?: string;
}
