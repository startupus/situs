import { PartialType } from '@nestjs/mapped-types';
import { CreateCategoryDto } from './create-category.dto';

/**
 * DTO для обновления категории товаров
 */
export class UpdateCategoryDto extends PartialType(CreateCategoryDto) {
  // Все поля опциональны благодаря PartialType
}
