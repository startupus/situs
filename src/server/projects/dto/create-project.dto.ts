// import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, IsObject, MaxLength, MinLength } from 'class-validator';

/**
 * DTO для создания проекта
 */
export class CreateProjectDto {
  // @ApiProperty({
  //   description: 'Название проекта',
  //   example: 'Мой новый сайт',
  //   minLength: 1,
  //   maxLength: 100,
  // })
  @IsString({ message: 'Название должно быть строкой' })
  @MinLength(1, { message: 'Название обязательно' })
  @MaxLength(100, { message: 'Название должно содержать максимум 100 символов' })
  name: string;

  // @ApiProperty({
  //   description: 'Описание проекта',
  //   example: 'Корпоративный сайт компании',
  //   required: false,
  //   maxLength: 500,
  // })
  @IsOptional()
  @IsString({ message: 'Описание должно быть строкой' })
  @MaxLength(500, { message: 'Описание должно содержать максимум 500 символов' })
  description?: string;

  // Типа у проекта нет — типы у продуктов в проекте

  // @ApiProperty({
  //   description: 'Настройки проекта',
  //   example: { theme: 'modern', lang: 'ru' },
  //   required: false,
  // })
  @IsOptional()
  @IsObject({ message: 'Настройки должны быть объектом' })
  settings?: Record<string, any>;
}
