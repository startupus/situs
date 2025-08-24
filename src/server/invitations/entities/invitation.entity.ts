import { ApiProperty } from '@nestjs/swagger';
import { GlobalRole } from '../../users/entities/user.entity';

/**
 * Статусы приглашений
 */
export enum InvitationStatus {
  PENDING = 'pending',
  ACCEPTED = 'accepted',
  EXPIRED = 'expired',
  CANCELLED = 'cancelled',
}

/**
 * Сущность приглашения
 */
export class Invitation {
  @ApiProperty({
    description: 'Уникальный идентификатор приглашения',
    example: 'clm1234567890',
  })
  id!: string;

  @ApiProperty({
    description: 'Email приглашенного пользователя',
    example: 'user@example.com',
    required: false,
  })
  email?: string;

  @ApiProperty({
    description: 'Уникальный токен приглашения',
    example: 'abc123def456',
  })
  token!: string;

  @ApiProperty({
    description: 'ID пользователя, отправившего приглашение',
    example: 'clm1234567890',
  })
  invitedById!: string;

  @ApiProperty({
    description: 'Предлагаемая роль',
    enum: GlobalRole,
    example: GlobalRole.BUSINESS,
    required: false,
  })
  role?: GlobalRole;

  @ApiProperty({
    description: 'ID аккаунта (если приглашение в аккаунт)',
    example: 'clm1234567890',
    required: false,
  })
  accountId?: string;

  @ApiProperty({
    description: 'ID проекта (если приглашение в проект)',
    example: 'clm1234567890',
    required: false,
  })
  projectId?: string;

  @ApiProperty({
    description: 'Статус приглашения',
    enum: InvitationStatus,
    example: InvitationStatus.PENDING,
  })
  status!: string;

  @ApiProperty({
    description: 'Дата истечения приглашения',
    example: '2024-01-01T00:00:00.000Z',
    required: false,
  })
  expiresAt?: Date;

  @ApiProperty({
    description: 'ID пользователя, принявшего приглашение',
    example: 'clm1234567890',
    required: false,
  })
  acceptedById?: string;

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

  @ApiProperty({
    description: 'Имя пользователя, отправившего приглашение',
    example: 'Иван Иванов',
    required: false,
  })
  inviterName?: string;

  @ApiProperty({
    description: 'Имя пользователя, принявшего приглашение',
    example: 'Петр Петров',
    required: false,
  })
  acceptedByName?: string;
}
