import { ApiProperty } from '@nestjs/swagger';

/**
 * Сущность уровня доступа (View Level)
 */
export class ViewLevel {
  @ApiProperty({
    description: 'Уникальный идентификатор уровня доступа',
    example: 'clm1234567890',
  })
  id!: string;

  @ApiProperty({
    description: 'Название уровня доступа',
    example: 'Registered Users',
  })
  title!: string;

  @ApiProperty({
    description: 'Описание уровня доступа',
    example: 'Доступ для зарегистрированных пользователей',
    required: false,
  })
  description?: string;

  @ApiProperty({
    description: 'Порядок сортировки',
    example: 1,
    required: false,
  })
  ordering?: number;

  @ApiProperty({
    description: 'ID групп, имеющих этот уровень доступа (JSON массив)',
    example: '["group1", "group2"]',
  })
  groupIds!: string;

  @ApiProperty({
    description: 'Дата создания',
    example: '2024-01-01T00:00:00.000Z',
  })
  createdAt!: Date;

  @ApiProperty({
    description: 'Дата последнего обновления',
    example: '2024-01-01T00:00:00.000Z',
  })
  updatedAt!: Date;

  @ApiProperty({
    description: 'Группы, имеющие этот уровень доступа',
    example: ['Registered', 'Authors'],
    required: false,
  })
  groups?: string[];
}
