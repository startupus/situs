import { IsArray, IsString, IsInt, IsOptional, ValidateNested, Min } from 'class-validator';
import { Type } from 'class-transformer';

/**
 * DTO для элемента при изменении порядка
 */
export class ReorderMenuItemDto {
  @IsString({ message: 'ID пункта меню должен быть строкой' })
  id!: string;

  @IsInt({ message: 'Порядок должен быть целым числом' })
  @Min(0, { message: 'Порядок не может быть отрицательным' })
  orderIndex!: number;

  @IsInt({ message: 'Уровень должен быть целым числом' })
  @Min(1, { message: 'Минимальный уровень: 1' })
  level!: number;

  @IsOptional()
  @IsString({ message: 'ID родителя должен быть строкой' })
  parentId?: string;
}

/**
 * DTO для изменения порядка пунктов меню
 */
export class ReorderMenuItemsDto {
  @IsArray({ message: 'items должен быть массивом' })
  @ValidateNested({ each: true })
  @Type(() => ReorderMenuItemDto)
  items!: ReorderMenuItemDto[];
}
