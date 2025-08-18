import { IsString, IsOptional, IsEnum, MaxLength } from 'class-validator';
import { ProductStatus, ProductType } from '@prisma/client';

export class UpdateProductDto {
  @IsOptional()
  @IsString({ message: 'Название продукта должно быть строкой' })
  @MaxLength(100, { message: 'Название должно содержать максимум 100 символов' })
  name?: string;

  @IsOptional()
  @IsString({ message: 'Описание должно быть строкой' })
  @MaxLength(500, { message: 'Описание должно содержать максимум 500 символов' })
  description?: string;

  @IsOptional()
  @IsString({ message: 'Тип продукта должен быть строкой' })
  @IsEnum(ProductType, { message: 'Некорректный тип продукта' })
  type?: ProductType | string;

  @IsOptional()
  @IsString({ message: 'Статус продукта должен быть строкой' })
  @IsEnum(ProductStatus, { message: 'Некорректный статус продукта' })
  status?: ProductStatus | string;

  @IsOptional()
  @IsString({ message: 'Настройки должны быть JSON строкой' })
  settings?: string;
}