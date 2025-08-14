import { Type } from 'class-transformer';
import { IsOptional, IsString, IsNumber, Min, Max, IsEnum } from 'class-validator';
import { ProductStatus, ProductType } from '@prisma/client';

export class ProductQueryDto {
  @IsOptional()
  @Type(() => Number)
  @IsNumber({}, { message: 'Страница должна быть числом' })
  @Min(1, { message: 'Страница должна быть больше 0' })
  page?: number = 1;

  @IsOptional()
  @Type(() => Number)
  @IsNumber({}, { message: 'Лимит должен быть числом' })
  @Min(1, { message: 'Лимит должен быть больше 0' })
  @Max(100, { message: 'Лимит должен быть меньше 100' })
  limit?: number = 20;

  @IsOptional()
  @IsString({ message: 'Тип должен быть строкой' })
  @IsEnum(ProductType, { message: 'Некорректный тип продукта' })
  type?: ProductType | string;

  @IsOptional()
  @IsString({ message: 'Статус должен быть строкой' })
  @IsEnum(ProductStatus, { message: 'Некорректный статус продукта' })
  status?: ProductStatus | string;

  @IsOptional()
  @IsString({ message: 'ID проекта должен быть строкой' })
  projectId?: string;
}