import { IsString, IsOptional, IsBoolean, IsInt, MaxLength, Min } from 'class-validator';

/**
 * DTO для создания категории товаров
 */
export class CreateCategoryDto {
  @IsString({ message: 'Название категории должно быть строкой' })
  @MaxLength(100, { message: 'Название должно содержать максимум 100 символов' })
  name!: string;

  @IsOptional()
  @IsString({ message: 'Описание должно быть строкой' })
  @MaxLength(500, { message: 'Описание должно содержать максимум 500 символов' })
  description?: string;

  @IsString({ message: 'Slug должен быть строкой' })
  @MaxLength(100, { message: 'Slug должен содержать максимум 100 символов' })
  slug!: string;

  @IsOptional()
  @IsString({ message: 'Изображение должно быть строкой' })
  image?: string;

  @IsOptional()
  @IsString({ message: 'ID родительской категории должен быть строкой' })
  parentId?: string;

  @IsOptional()
  @IsInt({ message: 'Порядок должен быть числом' })
  @Min(0, { message: 'Порядок не может быть отрицательным' })
  orderIndex?: number;

  @IsOptional()
  @IsBoolean({ message: 'Статус активности должен быть булевым' })
  isActive?: boolean;

  @IsString({ message: 'ID продукта должен быть строкой' })
  productId!: string;
}
