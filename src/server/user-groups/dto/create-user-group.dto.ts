import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, MaxLength, IsBoolean } from 'class-validator';

/**
 * DTO для создания группы пользователей
 */
export class CreateUserGroupDto {
  @ApiProperty({
    description: 'Название группы',
    example: 'Editors',
  })
  @IsString()
  @MaxLength(100, { message: 'Название группы должно содержать максимум 100 символов' })
  title!: string;

  @ApiProperty({
    description: 'Описание группы',
    example: 'Редакторы контента',
    required: false,
  })
  @IsOptional()
  @IsString()
  @MaxLength(500, { message: 'Описание должно содержать максимум 500 символов' })
  description?: string;

  @ApiProperty({
    description: 'ID родительской группы',
    example: 'clm1234567890',
    required: false,
  })
  @IsOptional()
  @IsString()
  parentId?: string;

  @ApiProperty({
    description: 'Является ли группа системной',
    example: false,
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  isCore?: boolean;
}
