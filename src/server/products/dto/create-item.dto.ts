import { IsString, IsOptional, IsBoolean, IsInt, IsEnum, IsDecimal, MaxLength, Min } from 'class-validator';
import { ItemStatus } from '@prisma/client';
import { Transform } from 'class-transformer';

/**
 * DTO для создания товара
 */
export class CreateItemDto {
  @IsString({ message: 'Название товара должно быть строкой' })
  @MaxLength(200, { message: 'Название должно содержать максимум 200 символов' })
  name!: string;

  @IsOptional()
  @IsString({ message: 'Описание должно быть строкой' })
  @MaxLength(1000, { message: 'Описание должно содержать максимум 1000 символов' })
  description?: string;

  @IsString({ message: 'Slug должен быть строкой' })
  @MaxLength(100, { message: 'Slug должен содержать максимум 100 символов' })
  slug!: string;

  // Цены
  @Transform(({ value }) => parseFloat(value))
  @IsDecimal({ decimal_digits: '0,2' }, { message: 'Цена должна быть числом с максимум 2 знаками после запятой' })
  @Min(0, { message: 'Цена не может быть отрицательной' })
  price!: number;

  @IsOptional()
  @Transform(({ value }) => value ? parseFloat(value) : undefined)
  @IsDecimal({ decimal_digits: '0,2' }, { message: 'Цена сравнения должна быть числом' })
  @Min(0, { message: 'Цена сравнения не может быть отрицательной' })
  comparePrice?: number;

  @IsOptional()
  @Transform(({ value }) => value ? parseFloat(value) : undefined)
  @IsDecimal({ decimal_digits: '0,2' }, { message: 'Себестоимость должна быть числом' })
  @Min(0, { message: 'Себестоимость не может быть отрицательной' })
  costPrice?: number;

  // Инвентарь
  @IsOptional()
  @IsString({ message: 'Артикул должен быть строкой' })
  @MaxLength(50, { message: 'Артикул должен содержать максимум 50 символов' })
  sku?: string;

  @IsOptional()
  @IsString({ message: 'Штрихкод должен быть строкой' })
  @MaxLength(50, { message: 'Штрихкод должен содержать максимум 50 символов' })
  barcode?: string;

  @IsOptional()
  @IsBoolean({ message: 'Отслеживание количества должно быть булевым' })
  trackQuantity?: boolean;

  @IsOptional()
  @IsInt({ message: 'Количество должно быть целым числом' })
  @Min(0, { message: 'Количество не может быть отрицательным' })
  quantity?: number;

  @IsOptional()
  @IsInt({ message: 'Минимальный остаток должен быть целым числом' })
  @Min(0, { message: 'Минимальный остаток не может быть отрицательным' })
  lowStockThreshold?: number;

  // Контент
  @IsOptional()
  @IsString({ message: 'Изображения должны быть JSON строкой' })
  images?: string;

  @IsOptional()
  @IsString({ message: 'Контент должен быть строкой' })
  content?: string;

  // SEO
  @IsOptional()
  @IsString({ message: 'Meta title должен быть строкой' })
  @MaxLength(60, { message: 'Meta title должен содержать максимум 60 символов' })
  metaTitle?: string;

  @IsOptional()
  @IsString({ message: 'Meta description должно быть строкой' })
  @MaxLength(160, { message: 'Meta description должно содержать максимум 160 символов' })
  metaDescription?: string;

  @IsOptional()
  @IsString({ message: 'Meta keywords должны быть строкой' })
  metaKeywords?: string;

  // Настройки
  @IsOptional()
  @IsEnum(ItemStatus, { message: 'Статус товара должен быть валидным' })
  status?: ItemStatus;

  @IsOptional()
  @IsBoolean({ message: 'Цифровой товар должен быть булевым' })
  isDigital?: boolean;

  @IsOptional()
  @Transform(({ value }) => value ? parseFloat(value) : undefined)
  @IsDecimal({ decimal_digits: '0,3' }, { message: 'Вес должен быть числом' })
  @Min(0, { message: 'Вес не может быть отрицательным' })
  weight?: number;

  @IsOptional()
  @IsString({ message: 'Размеры должны быть JSON строкой' })
  dimensions?: string;

  // Связи
  @IsString({ message: 'ID категории должен быть строкой' })
  categoryId!: string;

  @IsString({ message: 'ID продукта должен быть строкой' })
  productId!: string;

  @IsOptional()
  @IsInt({ message: 'Порядок должен быть числом' })
  @Min(0, { message: 'Порядок не может быть отрицательным' })
  orderIndex?: number;

  @IsOptional()
  @IsBoolean({ message: 'Рекомендуемый товар должен быть булевым' })
  isFeatured?: boolean;
}
