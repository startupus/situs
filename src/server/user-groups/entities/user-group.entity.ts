import { ApiProperty } from '@nestjs/swagger';

/**
 * Сущность группы пользователей (Joomla-like)
 */
export class UserGroup {
  @ApiProperty({
    description: 'Уникальный идентификатор группы',
    example: 'clm1234567890',
  })
  id!: string;

  @ApiProperty({
    description: 'Название группы',
    example: 'Registered',
  })
  title!: string;

  @ApiProperty({
    description: 'Описание группы',
    example: 'Зарегистрированные пользователи',
    required: false,
  })
  description?: string;

  @ApiProperty({
    description: 'Является ли группа системной',
    example: true,
    required: false,
  })
  isCore?: boolean;

  @ApiProperty({
    description: 'ID родительской группы',
    example: 'clm1234567890',
    required: false,
  })
  parentId?: string;

  @ApiProperty({
    description: 'Дата создания группы',
    example: '2024-01-01T00:00:00.000Z',
  })
  createdAt!: Date;

  @ApiProperty({
    description: 'Дата последнего обновления',
    example: '2024-01-01T00:00:00.000Z',
  })
  updatedAt!: Date;

  @ApiProperty({
    description: 'Количество пользователей в группе',
    example: 15,
    required: false,
  })
  usersCount?: number;
}
