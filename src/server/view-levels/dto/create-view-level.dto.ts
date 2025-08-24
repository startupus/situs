import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, MaxLength, IsArray, IsNumber } from 'class-validator';

/**
 * DTO для создания уровня доступа
 */
export class CreateViewLevelDto {
  @ApiProperty({
    description: 'Название уровня доступа',
    example: 'VIP Users',
  })
  @IsString()
  @MaxLength(100, { message: 'Название должно содержать максимум 100 символов' })
  title!: string;

  @ApiProperty({
    description: 'Описание уровня доступа',
    example: 'Доступ для VIP пользователей',
    required: false,
  })
  @IsOptional()
  @IsString()
  @MaxLength(500, { message: 'Описание должно содержать максимум 500 символов' })
  description?: string;

  @ApiProperty({
    description: 'Порядок сортировки',
    example: 1,
    required: false,
  })
  @IsOptional()
  @IsNumber()
  ordering?: number;

  @ApiProperty({
    description: 'ID групп пользователей',
    example: ['group1', 'group2'],
    required: false,
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  groupIds?: string[];
}
