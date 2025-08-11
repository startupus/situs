// Обновление проекта должно быть частичным и не требовать name
import { IsOptional, IsString, IsDateString, MaxLength, IsObject } from 'class-validator';

/**
 * DTO для обновления проекта
 */
export class UpdateProjectDto {
  @IsOptional()
  @IsString({ message: 'Название должно быть строкой' })
  @MaxLength(100, { message: 'Название должно содержать максимум 100 символов' })
  name?: string;

  @IsOptional()
  @IsString({ message: 'Описание должно быть строкой' })
  @MaxLength(500, { message: 'Описание должно содержать максимум 500 символов' })
  description?: string;

  @IsOptional()
  @IsObject({ message: 'Настройки должны быть объектом' })
  settings?: Record<string, any>;

  @IsOptional()
  @IsString({ message: 'Статус должен быть строкой' })
  status?: string;

  @IsOptional()
  @IsDateString({}, { message: 'Некорректная дата публикации' })
  publishedAt?: string;
}
