import { IsBoolean, IsEnum, IsOptional, IsString, MaxLength } from 'class-validator';
import { PageStatus, PageType } from '@prisma/client';

export class CreatePageDto {
  @IsString({ message: 'Заголовок должен быть строкой' })
  @MaxLength(200)
  title!: string;

  @IsString({ message: 'Slug должен быть строкой' })
  @MaxLength(200)
  slug!: string;

  @IsString({ message: 'Содержимое должно быть JSON строкой' })
  content!: string;

  @IsOptional()
  @IsEnum(PageType)
  pageType?: PageType | string;

  @IsOptional()
  @IsEnum(PageStatus)
  status?: PageStatus | string;

  @IsOptional()
  @IsBoolean()
  isHomePage?: boolean;

  @IsString({ message: 'productId обязателен' })
  productId!: string;
}