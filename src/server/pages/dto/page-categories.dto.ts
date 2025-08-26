import { IsArray, IsOptional, IsString } from 'class-validator';

export class AssignCategoriesDto {
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  add?: string[];

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  remove?: string[];
}

export class SetPrimaryCategoryDto {
  @IsString()
  categoryId!: string;
}
