import { IsString, IsOptional, IsEnum, IsUUID, MaxLength } from 'class-validator';
import { ProductType } from '@prisma/client';

export class CreateProductDto {
  @IsString({ message: 'Название продукта должно быть строкой' })
  @MaxLength(100, { message: 'Название должно содержать максимум 100 символов' })
  name!: string;

  @IsOptional()
  @IsString({ message: 'Описание должно быть строкой' })
  @MaxLength(500, { message: 'Описание должно содержать максимум 500 символов' })
  description?: string;

  @IsString({ message: 'Тип продукта должен быть строкой' })
  @IsEnum(ProductType, { message: 'Некорректный тип продукта' })
  type!: ProductType | string;

  @IsString({ message: 'ID проекта должен быть строкой' })
  projectId!: string; // prisma uses cuid, not necessarily uuid

  @IsOptional()
  @IsString({ message: 'Настройки должны быть JSON строкой' })
  settings?: string;
}
