import { IsBoolean, IsEnum, IsOptional, IsString, MaxLength } from 'class-validator';
import { PageStatus, PageType } from '@prisma/client';

export class UpdatePageDto {
  @IsOptional()
  @IsString({ message: 'Заголовок должен быть строкой' })
  @MaxLength(200)
  title?: string;

  @IsOptional()
  @IsString({ message: 'Slug должен быть строкой' })
  @MaxLength(200)
  slug?: string;

  @IsOptional()
  @IsString({ message: 'Содержимое должно быть JSON строкой' })
  content?: string;

  @IsOptional()
  @IsEnum(PageType)
  pageType?: PageType | string;

  @IsOptional()
  @IsEnum(PageStatus)
  status?: PageStatus | string;

  @IsOptional()
  @IsBoolean()
  isHomePage?: boolean;
}
