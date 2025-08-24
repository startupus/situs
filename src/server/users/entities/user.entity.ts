import { ApiProperty } from '@nestjs/swagger';

/**
 * Перечисления для пользователя
 */
export enum GlobalRole {
  SUPER_ADMIN = 'SUPER_ADMIN',
  STAFF = 'STAFF', 
  AGENCY = 'AGENCY',
  BUSINESS = 'BUSINESS'
}

export enum UserStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive', 
  PENDING = 'pending',
  INVITED = 'invited',
  SUSPENDED = 'suspended',
  BANNED = 'banned'
}

/**
 * Сущность пользователя
 * 
 * Представляет структуру данных пользователя в API
 */
export class User {
  @ApiProperty({
    description: 'Уникальный идентификатор пользователя',
    example: 'clm1234567890',
  })
  id!: string;

  @ApiProperty({
    description: 'Имя пользователя (username)',
    example: 'john_doe',
  })
  username!: string;

  @ApiProperty({
    description: 'Email пользователя',
    example: 'user@example.com',
  })
  email!: string;

  @ApiProperty({
    description: 'Глобальная роль пользователя',
    enum: GlobalRole,
    example: GlobalRole.BUSINESS,
  })
  globalRole!: GlobalRole;

  @ApiProperty({
    description: 'Статус пользователя',
    enum: UserStatus,
    example: UserStatus.ACTIVE,
  })
  status!: UserStatus;

  @ApiProperty({
    description: 'План подписки',
    example: 'basic',
    required: false,
  })
  subscriptionPlan?: string;

  @ApiProperty({
    description: 'Лимиты пользователя (JSON)',
    example: '{"projects":1,"products":2,"aiTokens":1000}',
    required: false,
  })
  limits?: string;

  @ApiProperty({
    description: 'Профиль пользователя (JSON)',
    example: '{"name":"Иван Иванов","avatar":"","bio":""}',
    required: false,
  })
  profile?: string;

  @ApiProperty({
    description: 'Дата создания пользователя',
    example: '2024-01-01T00:00:00.000Z',
  })
  createdAt!: Date;

  @ApiProperty({
    description: 'Дата последнего обновления',
    example: '2024-01-01T00:00:00.000Z',
  })
  updatedAt!: Date;

  // Вычисляемые поля (добавляются в сервисе)
  @ApiProperty({
    description: 'Имя пользователя из профиля',
    example: 'Иван Иванов',
    required: false,
  })
  name?: string;

  @ApiProperty({
    description: 'Аватар пользователя из профиля',
    example: 'https://example.com/avatar.jpg',
    required: false,
  })
  avatar?: string;

  @ApiProperty({
    description: 'Дата последнего входа',
    example: '2024-01-01T00:00:00.000Z',
    required: false,
  })
  lastLogin?: Date;

  @ApiProperty({
    description: 'Количество проектов пользователя',
    example: 5,
    required: false,
  })
  projectsCount?: number;

  @ApiProperty({
    description: 'Права доступа пользователя',
    example: ['projects.create', 'users.invite'],
    required: false,
  })
  permissions?: string[];

  @ApiProperty({
    description: 'Подтвержден ли email',
    example: true,
    required: false,
  })
  isEmailVerified?: boolean;

  @ApiProperty({
    description: 'Включена ли двухфакторная аутентификация',
    example: false,
    required: false,
  })
  twoFactorEnabled?: boolean;

  @ApiProperty({
    description: 'Группы пользователя (Joomla-like)',
    example: ['Registered', 'Authors'],
    required: false,
  })
  groups?: string[];

  @ApiProperty({
    description: 'Внешние провайдеры аутентификации',
    example: ['google', 'github'],
    required: false,
  })
  authProviders?: string[];
}
