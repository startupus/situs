import { ApiProperty } from '@nestjs/swagger';

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
  id: string;

  @ApiProperty({
    description: 'Email пользователя',
    example: 'user@example.com',
  })
  email: string;

  @ApiProperty({
    description: 'Имя пользователя',
    example: 'Иван Иванов',
  })
  name: string;

  @ApiProperty({
    description: 'Аватар пользователя',
    example: 'https://example.com/avatar.jpg',
    required: false,
  })
  avatar?: string;

  @ApiProperty({
    description: 'Дата создания пользователя',
    example: '2024-01-01T00:00:00.000Z',
  })
  createdAt: Date;

  @ApiProperty({
    description: 'Дата последнего обновления',
    example: '2024-01-01T00:00:00.000Z',
  })
  updatedAt: Date;
}
