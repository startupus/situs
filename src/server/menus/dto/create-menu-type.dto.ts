import { IsString, IsOptional, IsBoolean, MaxLength } from 'class-validator';

/**
 * DTO для создания типа меню
 */
export class CreateMenuTypeDto {
  @IsString({ message: 'Название типа меню должно быть строкой' })
  @MaxLength(50, { message: 'Название должно содержать максимум 50 символов' })
  name!: string;

  @IsString({ message: 'Заголовок должен быть строкой' })
  @MaxLength(100, { message: 'Заголовок должен содержать максимум 100 символов' })
  title!: string;

  @IsOptional()
  @IsString({ message: 'Описание должно быть строкой' })
  @MaxLength(500, { message: 'Описание должно содержать максимум 500 символов' })
  description?: string;

  @IsOptional()
  @IsBoolean({ message: 'isActive должно быть булевым значением' })
  isActive?: boolean = true;

  @IsString({ message: 'ID проекта должен быть строкой' })
  projectId!: string;
}
