import { ApiProperty } from '@nestjs/swagger';
import { GlobalRole } from '../../users/entities/user.entity';

export enum InvitationStatus {
  PENDING = 'PENDING',
  ACCEPTED = 'ACCEPTED',
  EXPIRED = 'EXPIRED',
  CANCELLED = 'CANCELLED',
}

export enum CommunicationChannel {
  EMAIL = 'EMAIL',
  SMS = 'SMS',
  TELEGRAM = 'TELEGRAM',
  WHATSAPP = 'WHATSAPP',
  SLACK = 'SLACK',
}

export class Invitation {
  @ApiProperty({
    description: 'Уникальный идентификатор приглашения',
    example: 'clm1234567890',
  })
  id!: string;

  @ApiProperty({
    description: 'Email адрес приглашенного пользователя',
    example: 'user@example.com',
  })
  email!: string;

  @ApiProperty({
    description: 'Роль для приглашенного пользователя',
    enum: GlobalRole,
    example: GlobalRole.BUSINESS,
  })
  role!: GlobalRole;

  @ApiProperty({
    description: 'Статус приглашения',
    enum: InvitationStatus,
    example: InvitationStatus.PENDING,
  })
  status!: InvitationStatus;

  @ApiProperty({
    description: 'Токен приглашения',
    example: 'abc123def456',
  })
  token!: string;

  @ApiProperty({
    description: 'Персональное сообщение',
    example: 'Добро пожаловать в нашу платформу!',
    required: false,
  })
  message?: string;

  @ApiProperty({
    description: 'Канал связи',
    enum: CommunicationChannel,
    example: CommunicationChannel.EMAIL,
  })
  channel!: CommunicationChannel;

  @ApiProperty({
    description: 'ID пользователя, отправившего приглашение',
    example: 'clm1234567890',
  })
  invitedBy!: string;

  @ApiProperty({
    description: 'ID пользователя, принявшего приглашение',
    example: 'clm1234567890',
    required: false,
  })
  acceptedBy?: string;

  @ApiProperty({
    description: 'Дата истечения приглашения',
    example: '2024-12-31T23:59:59.000Z',
  })
  expiresAt!: Date;

  @ApiProperty({
    description: 'Дата отправки приглашения',
    example: '2024-01-01T00:00:00.000Z',
    required: false,
  })
  sentAt?: Date;

  @ApiProperty({
    description: 'Дата принятия приглашения',
    example: '2024-01-01T00:00:00.000Z',
    required: false,
  })
  acceptedAt?: Date;

  @ApiProperty({
    description: 'Дата создания приглашения',
    example: '2024-01-01T00:00:00.000Z',
  })
  createdAt!: Date;

  @ApiProperty({
    description: 'Дата последнего обновления',
    example: '2024-01-01T00:00:00.000Z',
  })
  updatedAt!: Date;

  // Связанные данные (добавляются в сервисе)
  @ApiProperty({
    description: 'Данные пользователя, отправившего приглашение',
    required: false,
  })
  invitedByUser?: {
    id: string;
    name: string;
    email: string;
  };

  @ApiProperty({
    description: 'Данные пользователя, принявшего приглашение',
    required: false,
  })
  acceptedByUser?: {
    id: string;
    name: string;
    email: string;
  };
}
